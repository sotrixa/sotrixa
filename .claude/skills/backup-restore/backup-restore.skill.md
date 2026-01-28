# Backup & Restore Automation

Automate backup and restore processes for PostgreSQL databases and application data.

## When to Use

- Setting up automated backups
- Creating backup scripts
- Testing restore procedures
- Implementing disaster recovery
- Managing backup retention
- Troubleshooting backup failures

## Tech Stack Context

- **Database**: PostgreSQL
- **Hosting**: Hetzner Cloud (volumes)
- **Backup Storage**: S3-compatible (Hetzner Object Storage or AWS S3)
- **Tools**: pg_dump, pg_restore, restic, or wal-g

## Instructions

When implementing backup/restore:

1. **Backup Strategy**:
   - **Full backups**: Daily complete database dumps
   - **Incremental**: WAL (Write-Ahead Logging) archiving
   - **Point-in-time recovery**: Enable WAL archiving
   - **Testing**: Regular restore testing (monthly)
   - **Retention**: Keep daily for 7 days, weekly for 4 weeks, monthly for 12 months

2. **Backup Tools**:
   - **pg_dump/pg_restore**: Standard PostgreSQL tools
   - **pg_basebackup**: Physical backups
   - **wal-g**: Continuous archiving with compression
   - **restic**: Encrypted, deduplicated backups
   - **Hetzner snapshots**: Volume-level backups

3. **Backup Storage**:
   - Use S3-compatible object storage
   - Encrypt backups at rest
   - Use separate region/provider for DR
   - Implement lifecycle policies
   - Monitor storage usage

4. **Automation**:
   - Cron jobs for scheduled backups
   - Kubernetes CronJobs for K8s deployments
   - Systemd timers as alternative
   - Monitoring and alerting on failures
   - Slack/email notifications

5. **Security**:
   - Encrypt backups (GPG or native encryption)
   - Secure backup credentials
   - Restrict access to backups
   - Audit backup access
   - Test restore from encrypted backups

6. **Disaster Recovery Plan**:
   - Document restore procedures
   - Define RTO (Recovery Time Objective)
   - Define RPO (Recovery Point Objective)
   - Maintain runbooks
   - Regular DR drills

## Backup Scripts

**Simple pg_dump Backup**:
```bash
#!/bin/bash
# backup-postgres.sh

set -euo pipefail

# Configuration
DB_NAME="${DB_NAME:-dikrasin}"
DB_USER="${DB_USER:-postgres}"
DB_HOST="${DB_HOST:-localhost}"
BACKUP_DIR="${BACKUP_DIR:-/backups}"
S3_BUCKET="${S3_BUCKET:-s3://dikrasin-backups}"
RETENTION_DAYS=7

# Generate timestamp
TIMESTAMP=$(date +%Y%m%d_%H%M%S)
BACKUP_FILE="${BACKUP_DIR}/${DB_NAME}_${TIMESTAMP}.sql.gz"

# Create backup directory
mkdir -p "${BACKUP_DIR}"

# Perform backup
echo "Starting backup of ${DB_NAME}..."
pg_dump \
  -h "${DB_HOST}" \
  -U "${DB_USER}" \
  -d "${DB_NAME}" \
  --format=custom \
  --compress=9 \
  --file="${BACKUP_FILE}"

# Verify backup
if [ -f "${BACKUP_FILE}" ]; then
  echo "Backup created: ${BACKUP_FILE}"
  SIZE=$(du -h "${BACKUP_FILE}" | cut -f1)
  echo "Backup size: ${SIZE}"
else
  echo "ERROR: Backup failed!"
  exit 1
fi

# Upload to S3
echo "Uploading to S3..."
aws s3 cp "${BACKUP_FILE}" "${S3_BUCKET}/" \
  --storage-class STANDARD_IA

# Verify upload
if aws s3 ls "${S3_BUCKET}/$(basename ${BACKUP_FILE})" > /dev/null; then
  echo "Upload successful"
  # Remove local backup after successful upload
  rm "${BACKUP_FILE}"
else
  echo "ERROR: Upload failed!"
  exit 1
fi

# Cleanup old backups (keep last N days)
echo "Cleaning up old backups..."
aws s3 ls "${S3_BUCKET}/" \
  | awk '{print $4}' \
  | grep "${DB_NAME}_" \
  | sort \
  | head -n -${RETENTION_DAYS} \
  | xargs -I {} aws s3 rm "${S3_BUCKET}/{}"

echo "Backup completed successfully!"

# Send notification
curl -X POST https://hooks.slack.com/services/YOUR/WEBHOOK/URL \
  -H 'Content-Type: application/json' \
  -d "{\"text\":\"✅ Database backup completed: ${DB_NAME} (${SIZE})\"}"
```

**WAL Archiving with wal-g**:
```bash
#!/bin/bash
# setup-wal-archiving.sh

# Install wal-g
curl -L https://github.com/wal-g/wal-g/releases/download/v2.0.1/wal-g-pg-ubuntu-20.04-amd64.tar.gz \
  | tar -xz -C /usr/local/bin

# Configure PostgreSQL for WAL archiving
cat >> /etc/postgresql/14/main/postgresql.conf <<EOF
wal_level = replica
archive_mode = on
archive_command = 'wal-g wal-push %p'
archive_timeout = 60
max_wal_senders = 3
EOF

# Configure wal-g
cat > /etc/wal-g.d/server.conf <<EOF
AWS_ACCESS_KEY_ID=${AWS_ACCESS_KEY_ID}
AWS_SECRET_ACCESS_KEY=${AWS_SECRET_ACCESS_KEY}
AWS_ENDPOINT=https://fsn1.your-objectstorage.com
AWS_S3_FORCE_PATH_STYLE=true
WALG_S3_PREFIX=s3://dikrasin-wal
WALG_COMPRESSION_METHOD=zstd
WALG_DELTA_MAX_STEPS=6
EOF

# Create base backup
wal-g backup-push /var/lib/postgresql/14/main

# Restart PostgreSQL
systemctl restart postgresql
```

**Restore Script**:
```bash
#!/bin/bash
# restore-postgres.sh

set -euo pipefail

BACKUP_FILE=$1
DB_NAME="${DB_NAME:-dikrasin}"
DB_USER="${DB_USER:-postgres}"
DB_HOST="${DB_HOST:-localhost}"

if [ -z "${BACKUP_FILE}" ]; then
  echo "Usage: $0 <backup-file-or-s3-url>"
  exit 1
fi

# Download from S3 if URL provided
if [[ "${BACKUP_FILE}" == s3://* ]]; then
  LOCAL_FILE="/tmp/$(basename ${BACKUP_FILE})"
  aws s3 cp "${BACKUP_FILE}" "${LOCAL_FILE}"
  BACKUP_FILE="${LOCAL_FILE}"
fi

# Verify file exists
if [ ! -f "${BACKUP_FILE}" ]; then
  echo "ERROR: Backup file not found: ${BACKUP_FILE}"
  exit 1
fi

# Drop existing database (CAUTION!)
read -p "This will drop database ${DB_NAME}. Continue? (yes/no) " -r
if [[ ! $REPLY =~ ^yes$ ]]; then
  echo "Aborted."
  exit 0
fi

# Drop and recreate database
echo "Dropping database ${DB_NAME}..."
psql -h "${DB_HOST}" -U "${DB_USER}" -d postgres -c "DROP DATABASE IF EXISTS ${DB_NAME};"
psql -h "${DB_HOST}" -U "${DB_USER}" -d postgres -c "CREATE DATABASE ${DB_NAME};"

# Restore backup
echo "Restoring backup..."
pg_restore \
  -h "${DB_HOST}" \
  -U "${DB_USER}" \
  -d "${DB_NAME}" \
  --clean \
  --if-exists \
  --no-owner \
  --no-acl \
  --verbose \
  "${BACKUP_FILE}"

echo "Restore completed successfully!"

# Cleanup temp file
if [[ "${BACKUP_FILE}" == /tmp/* ]]; then
  rm "${BACKUP_FILE}"
fi
```

## Cron Job Setup

```bash
# /etc/cron.d/postgres-backup
# Daily backup at 2 AM
0 2 * * * postgres /usr/local/bin/backup-postgres.sh >> /var/log/postgres-backup.log 2>&1

# Weekly full backup (Sunday 3 AM)
0 3 * * 0 postgres /usr/local/bin/backup-postgres.sh full >> /var/log/postgres-backup.log 2>&1
```

## Kubernetes CronJob

```yaml
apiVersion: batch/v1
kind: CronJob
metadata:
  name: postgres-backup
spec:
  schedule: "0 2 * * *"  # Daily at 2 AM
  jobTemplate:
    spec:
      template:
        spec:
          containers:
          - name: backup
            image: postgres:16-alpine
            env:
            - name: PGHOST
              value: postgres-service
            - name: PGUSER
              valueFrom:
                secretKeyRef:
                  name: postgres-secret
                  key: username
            - name: PGPASSWORD
              valueFrom:
                secretKeyRef:
                  name: postgres-secret
                  key: password
            - name: AWS_ACCESS_KEY_ID
              valueFrom:
                secretKeyRef:
                  name: s3-secret
                  key: access-key-id
            - name: AWS_SECRET_ACCESS_KEY
              valueFrom:
                secretKeyRef:
                  name: s3-secret
                  key: secret-access-key
            command:
            - /bin/sh
            - -c
            - |
              apk add --no-cache aws-cli
              TIMESTAMP=$(date +%Y%m%d_%H%M%S)
              BACKUP_FILE="/tmp/backup_${TIMESTAMP}.sql.gz"
              pg_dump -d dikrasin --format=custom --compress=9 --file="${BACKUP_FILE}"
              aws s3 cp "${BACKUP_FILE}" s3://dikrasin-backups/
          restartPolicy: OnFailure
```

## Monitoring

```bash
#!/bin/bash
# check-backup-status.sh

# Check if backup ran today
LATEST_BACKUP=$(aws s3 ls s3://dikrasin-backups/ | sort | tail -n 1 | awk '{print $4}')
BACKUP_DATE=$(echo $LATEST_BACKUP | grep -oP '\d{8}')
TODAY=$(date +%Y%m%d)

if [ "${BACKUP_DATE}" != "${TODAY}" ]; then
  echo "❌ ALERT: No backup found for today!"
  # Send alert
  curl -X POST https://hooks.slack.com/services/YOUR/WEBHOOK/URL \
    -d '{"text":"⚠️ Database backup missing for today!"}'
  exit 1
else
  echo "✅ Backup found for today: ${LATEST_BACKUP}"
fi
```

## Example Tasks

- "Set up automated PostgreSQL backups"
- "Create restore procedure"
- "Test backup restoration"
- "Implement WAL archiving"
- "Configure backup monitoring"
- "Create DR runbook"

## Best Practices

1. **3-2-1 Rule**: 3 copies, 2 different media, 1 offsite
2. **Test restores regularly** (at least monthly)
3. **Monitor backup jobs** (alerts on failure)
4. **Encrypt sensitive backups**
5. **Document restore procedures**
6. **Automate everything**
7. **Verify backup integrity**

## Output Format

Provide complete backup/restore scripts with error handling, monitoring, and documentation. Include cron or K8s CronJob configs.
