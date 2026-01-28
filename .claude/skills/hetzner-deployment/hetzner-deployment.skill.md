# Hetzner Cloud Deployment

Manage deployments and infrastructure on Hetzner Cloud for event-driven Node.js applications.

## When to Use

- Deploying applications to Hetzner Cloud
- Setting up servers and networking
- Managing load balancers and volumes
- Configuring DNS and SSL/TLS
- Optimizing costs on Hetzner
- Troubleshooting deployment issues

## Tech Stack Context

- **Hosting**: Hetzner Cloud (Germany-based)
- **Backend**: Node.js + Express
- **Frontend**: React 19 (static build)
- **Event Bus**: NATS JetStream
- **IaC**: Terraform/Pulumi

## Instructions

When managing Hetzner deployments:

1. **Server Setup**:
   - Use hcloud CLI or API
   - Choose appropriate server types (CX, CPX, CCX lines)
   - Set up private networks for internal communication
   - Configure firewalls (restrict public access)
   - Use cloud-init for initial provisioning

2. **Load Balancing**:
   - Create Hetzner Load Balancer for frontend/backend
   - Configure health checks
   - Set up SSL/TLS certificates (Let's Encrypt)
   - Use proxy protocol for real IP forwarding

3. **Storage**:
   - Use Volumes for persistent data (PostgreSQL, NATS)
   - Configure automatic backups
   - Set up snapshots for disaster recovery

4. **Networking**:
   - Create private networks (10.0.0.0/16)
   - Segment services (backend, NATS, DB on private)
   - Use floating IPs for high availability
   - Configure DNS records

5. **Cost Optimization**:
   - Right-size servers (start small, scale up)
   - Use ARM servers (CAX line) where possible
   - Enable traffic monitoring
   - Implement auto-shutdown for dev/staging

6. **Security**:
   - Use SSH keys (no password auth)
   - Configure firewall rules (allowlist only)
   - Enable private networking
   - Regular security updates
   - Use Hetzner's DDoS protection

## Example Tasks

- "Deploy Express backend to Hetzner"
- "Set up load balancer with SSL"
- "Create private network for NATS cluster"
- "Configure backups for PostgreSQL volume"
- "Optimize Hetzner costs"

## Commands Reference

```bash
# Server management
hcloud server create --name backend-01 --type cx21 --image ubuntu-22.04
hcloud server list

# Load balancer
hcloud load-balancer create --name lb-prod --type lb11 --location nbg1

# Volumes
hcloud volume create --name postgres-data --size 100 --location nbg1

# Networking
hcloud network create --name private --ip-range 10.0.0.0/16
hcloud firewall create --name backend-fw
```

## Output Format

Provide deployment scripts, hcloud commands, or configuration files with explanations for Hetzner-specific settings.
