# Deployment Runbooks

Create comprehensive deployment runbooks for Node.js applications on Hetzner Cloud.

## When to Use

- Creating deployment procedures
- Documenting rollback processes
- Setting up CI/CD pipelines
- Planning zero-downtime deployments
- Troubleshooting deployment failures
- Onboarding new team members

## Tech Stack Context

- **Backend**: Node.js + Express + TypeScript
- **Frontend**: React 19 + TypeScript
- **Infrastructure**: Kubernetes on Hetzner Cloud
- **CI/CD**: GitHub Actions or GitLab CI
- **Registry**: Docker Hub or Hetzner Registry

## Instructions

When creating deployment runbooks:

1. **Runbook Structure**:
   - **Purpose**: What this runbook does
   - **Prerequisites**: Required access, tools
   - **Pre-deployment checklist**: Validation steps
   - **Deployment steps**: Detailed procedures
   - **Verification**: How to confirm success
   - **Rollback**: How to undo if issues occur
   - **Troubleshooting**: Common issues and fixes

2. **Deployment Types**:
   - **Blue-Green**: Run both versions, switch traffic
   - **Rolling**: Gradually replace instances
   - **Canary**: Deploy to small subset first
   - **Recreate**: Stop old, start new (downtime)

3. **Zero-Downtime Strategy**:
   - Use readiness probes
   - Implement graceful shutdown
   - Use rolling updates in K8s
   - Test database migrations separately
   - Maintain backward compatibility

4. **Checklist Items**:
   - Code reviewed and merged
   - Tests passing
   - Database migrations tested
   - Environment variables updated
   - Dependencies audited for security
   - Performance tested
   - Monitoring and alerts configured
   - Rollback plan documented

5. **Communication**:
   - Notify team of deployment
   - Update status page during maintenance
   - Document what changed
   - Post deployment summary

## Backend Deployment Runbook

```markdown
# Backend Deployment Runbook

## Purpose
Deploy new version of Dikrasin.bg backend API to Kubernetes cluster on Hetzner Cloud.

## Prerequisites
- kubectl access to production cluster
- Docker registry credentials
- GitHub Actions configured (or manual build)
- Database migration files reviewed
- Rollback plan ready

## Pre-Deployment Checklist
- [ ] All tests passing (unit, integration, E2E)
- [ ] Code review completed and approved
- [ ] Database migrations tested in staging
- [ ] No breaking API changes (or coordinated with frontend)
- [ ] Environment variables verified
- [ ] Security scan completed
- [ ] Performance tests passed
- [ ] Monitoring dashboards ready
- [ ] Team notified of deployment
- [ ] Rollback procedure documented

## Deployment Steps

### 1. Prepare

```bash
# Set version
export VERSION="v1.2.3"
export NAMESPACE="production"

# Verify kubectl access
kubectl get nodes

# Check current deployment status
kubectl -n $NAMESPACE get deployments
kubectl -n $NAMESPACE get pods
```

### 2. Build and Push Docker Image

**Automated (GitHub Actions)**:
```bash
# Push to main branch triggers build
git tag $VERSION
git push origin $VERSION
# Wait for GitHub Actions to complete
```

**Manual**:
```bash
# Build image
docker build -t backend:$VERSION .

# Tag for registry
docker tag backend:$VERSION registry.hetzner.com/dikrasin/backend:$VERSION

# Push to registry
docker push registry.hetzner.com/dikrasin/backend:$VERSION
```

### 3. Run Database Migrations

```bash
# Backup database first
kubectl -n $NAMESPACE exec -it postgres-0 -- \
  pg_dump -U postgres dikrasin > backup-$(date +%Y%m%d-%H%M%S).sql

# Run migrations (from migration pod)
kubectl -n $NAMESPACE run migrations \
  --image=registry.hetzner.com/dikrasin/backend:$VERSION \
  --restart=Never \
  --command -- npm run migrate

# Verify migrations
kubectl -n $NAMESPACE logs migrations

# Cleanup migration pod
kubectl -n $NAMESPACE delete pod migrations
```

### 4. Update Deployment

```bash
# Update image in deployment
kubectl -n $NAMESPACE set image deployment/backend \
  backend=registry.hetzner.com/dikrasin/backend:$VERSION

# Or apply updated manifest
kubectl -n $NAMESPACE apply -f k8s/backend-deployment.yaml

# Watch rollout status
kubectl -n $NAMESPACE rollout status deployment/backend
```

### 5. Verify Deployment

```bash
# Check pod status
kubectl -n $NAMESPACE get pods -l app=backend

# Check logs for errors
kubectl -n $NAMESPACE logs -l app=backend --tail=100

# Test health endpoint
BACKEND_URL=$(kubectl -n $NAMESPACE get svc backend -o jsonpath='{.status.loadBalancer.ingress[0].ip}')
curl https://$BACKEND_URL/health

# Check specific pod
kubectl -n $NAMESPACE logs backend-xxx-yyy
```

### 6. Smoke Tests

```bash
# Run automated smoke tests
npm run test:smoke -- --env=production

# Manual verification
curl https://api.dikrasin.bg/health
curl https://api.dikrasin.bg/api/users?limit=1

# Check monitoring dashboards
# - Response times < 500ms
# - Error rate < 1%
# - All health checks passing
```

### 7. Monitor

```bash
# Watch metrics (first 15 minutes critical)
# - CPU and memory usage
# - Request rate and latency
# - Error rate
# - Database connections

# Watch logs for errors
kubectl -n $NAMESPACE logs -f -l app=backend | grep ERROR
```

## Rollback Procedure

If issues detected:

```bash
# Quick rollback to previous version
kubectl -n $NAMESPACE rollout undo deployment/backend

# Rollback to specific revision
kubectl -n $NAMESPACE rollout history deployment/backend
kubectl -n $NAMESPACE rollout undo deployment/backend --to-revision=2

# Verify rollback
kubectl -n $NAMESPACE rollout status deployment/backend
```

If database migration issue:

```bash
# Restore database backup
kubectl -n $NAMESPACE exec -it postgres-0 -- \
  psql -U postgres dikrasin < backup-TIMESTAMP.sql

# Verify data
kubectl -n $NAMESPACE exec -it postgres-0 -- \
  psql -U postgres dikrasin -c "SELECT version FROM schema_migrations ORDER BY version DESC LIMIT 1;"
```

## Verification Checklist

- [ ] All pods running (3/3)
- [ ] Health checks passing
- [ ] No error spikes in logs
- [ ] Response times normal (< 500ms p95)
- [ ] Error rate < 1%
- [ ] Database connections stable
- [ ] NATS consumers processing events
- [ ] Frontend can connect to API
- [ ] Smoke tests passing

## Post-Deployment

- [ ] Update changelog
- [ ] Notify team of successful deployment
- [ ] Document any issues encountered
- [ ] Update runbook if process changed
- [ ] Close deployment ticket
- [ ] Monitor for next 24 hours

## Troubleshooting

### Pods CrashLooping

```bash
# Check pod logs
kubectl -n $NAMESPACE logs backend-xxx-yyy

# Check previous logs
kubectl -n $NAMESPACE logs backend-xxx-yyy --previous

# Describe pod for events
kubectl -n $NAMESPACE describe pod backend-xxx-yyy

# Common fixes:
# - Check environment variables
# - Verify database connection
# - Check NATS connection
# - Review recent code changes
```

### High Error Rate

```bash
# Check error logs
kubectl -n $NAMESPACE logs -l app=backend | grep ERROR

# Check health endpoint
curl https://api.dikrasin.bg/health

# Check database connection
kubectl -n $NAMESPACE exec -it backend-xxx-yyy -- \
  node -e "require('./dist/db').testConnection()"

# If errors persist, rollback
kubectl -n $NAMESPACE rollout undo deployment/backend
```

### Database Migration Failed

```bash
# Check migration logs
kubectl -n $NAMESPACE logs migrations

# Connect to database and check
kubectl -n $NAMESPACE exec -it postgres-0 -- psql -U postgres dikrasin

# If migration partially applied, may need manual fix
# Restore from backup if critical
```

### Performance Degradation

```bash
# Check resource usage
kubectl -n $NAMESPACE top pods

# Check if hitting resource limits
kubectl -n $NAMESPACE describe pod backend-xxx-yyy | grep -A 5 Limits

# Scale up if needed
kubectl -n $NAMESPACE scale deployment/backend --replicas=5

# Or increase resources
kubectl -n $NAMESPACE set resources deployment/backend \
  --limits=cpu=1000m,memory=1Gi
```

## Emergency Contacts

- On-call engineer: Check PagerDuty
- DevOps team: Slack #devops
- Database admin: Slack #database

## Related Documentation

- [Architecture Overview](./architecture.md)
- [Database Migration Guide](./migrations.md)
- [Kubernetes Setup](./k8s-setup.md)
- [Monitoring & Alerts](./monitoring.md)
```

## Frontend Deployment Runbook

```markdown
# Frontend Deployment Runbook

## Purpose
Deploy new version of React 19 frontend to CDN and Hetzner Cloud.

## Prerequisites
- CI/CD pipeline configured
- CDN access (Cloudflare)
- S3 or Hetzner Object Storage access

## Deployment Steps

### 1. Build

```bash
# Set environment
export VITE_API_URL=https://api.dikrasin.bg
export VITE_ENV=production

# Install dependencies
npm ci

# Run tests
npm run test

# Build production bundle
npm run build

# Output: dist/ directory
```

### 2. Deploy to CDN

```bash
# Upload to S3/Object Storage
aws s3 sync dist/ s3://dikrasin-frontend/ \
  --delete \
  --cache-control "public, max-age=31536000, immutable"

# Update index.html (no cache)
aws s3 cp dist/index.html s3://dikrasin-frontend/index.html \
  --cache-control "no-cache"

# Invalidate CDN cache
aws cloudfront create-invalidation \
  --distribution-id EXXXXXXXXXXXXX \
  --paths "/*"
```

### 3. Verify

```bash
# Check frontend loads
curl https://dikrasin.bg

# Check API connection
# Open browser DevTools, verify API calls work

# Run E2E tests
npm run test:e2e -- --env=production
```

## Rollback

```bash
# Revert to previous version in S3
aws s3 sync s3://dikrasin-frontend-backup/v1.2.2/ \
  s3://dikrasin-frontend/

# Invalidate CDN
aws cloudfront create-invalidation \
  --distribution-id EXXXXXXXXXXXXX \
  --paths "/*"
```
```

## CI/CD Pipeline (GitHub Actions)

```yaml
# .github/workflows/deploy.yml
name: Deploy Backend

on:
  push:
    tags:
      - 'v*'

jobs:
  build-and-deploy:
    runs-on: ubuntu-latest

    steps:
      - name: Checkout code
        uses: actions/checkout@v3

      - name: Set up Docker Buildx
        uses: docker/setup-buildx-action@v2

      - name: Log in to Registry
        uses: docker/login-action@v2
        with:
          registry: registry.hetzner.com
          username: ${{ secrets.REGISTRY_USERNAME }}
          password: ${{ secrets.REGISTRY_PASSWORD }}

      - name: Extract version
        id: version
        run: echo "VERSION=${GITHUB_REF#refs/tags/}" >> $GITHUB_OUTPUT

      - name: Build and push
        uses: docker/build-push-action@v4
        with:
          context: .
          push: true
          tags: |
            registry.hetzner.com/dikrasin/backend:${{ steps.version.outputs.VERSION }}
            registry.hetzner.com/dikrasin/backend:latest
          cache-from: type=gha
          cache-to: type=gha,mode=max

      - name: Set up kubectl
        uses: azure/setup-kubectl@v3

      - name: Configure kubectl
        run: |
          echo "${{ secrets.KUBECONFIG }}" | base64 -d > kubeconfig
          export KUBECONFIG=kubeconfig

      - name: Deploy to Kubernetes
        run: |
          kubectl set image deployment/backend \
            backend=registry.hetzner.com/dikrasin/backend:${{ steps.version.outputs.VERSION }} \
            -n production

          kubectl rollout status deployment/backend -n production

      - name: Smoke tests
        run: |
          sleep 30
          curl -f https://api.dikrasin.bg/health || exit 1

      - name: Notify team
        if: always()
        uses: 8398a7/action-slack@v3
        with:
          status: ${{ job.status }}
          text: 'Deployment ${{ steps.version.outputs.VERSION }} ${{ job.status }}'
        env:
          SLACK_WEBHOOK_URL: ${{ secrets.SLACK_WEBHOOK }}
```

## Example Tasks

- "Create deployment runbook for backend"
- "Document rollback procedure"
- "Set up CI/CD pipeline with GitHub Actions"
- "Create blue-green deployment strategy"
- "Write troubleshooting guide for deployments"
- "Document zero-downtime deployment process"

## Output Format

Provide complete runbooks with step-by-step procedures, verification steps, rollback instructions, and troubleshooting guides. Include CI/CD configurations.
