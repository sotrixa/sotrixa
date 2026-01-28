# Infrastructure as Code (Terraform)

Manage infrastructure as code using Terraform for Hetzner Cloud deployments.

## When to Use

- Creating or updating Terraform configurations
- Provisioning cloud infrastructure
- Managing state and workspaces
- Refactoring IaC for better organization
- Troubleshooting Terraform errors
- Implementing infrastructure changes

## Tech Stack Context

- **Provider**: Hetzner Cloud
- **IaC Tool**: Terraform (HCL)
- **Alternative**: Pulumi (TypeScript)
- **Stack**: Node.js backend, React frontend, NATS JetStream, PostgreSQL

## Instructions

When working with Terraform:

1. **Project Structure**:
   ```
   terraform/
   ├── main.tf           # Provider and main resources
   ├── variables.tf      # Input variables
   ├── outputs.tf        # Output values
   ├── versions.tf       # Terraform and provider versions
   ├── modules/
   │   ├── network/      # Private networks, firewalls
   │   ├── compute/      # Servers
   │   ├── loadbalancer/ # Load balancers
   │   └── storage/      # Volumes, backups
   └── environments/
       ├── dev/          # Dev environment
       ├── staging/      # Staging environment
       └── prod/         # Production environment
   ```

2. **Hetzner Provider Setup**:
   ```hcl
   terraform {
     required_providers {
       hcloud = {
         source  = "hetznercloud/hcloud"
         version = "~> 1.45"
       }
     }
   }

   provider "hcloud" {
     token = var.hcloud_token
   }
   ```

3. **Best Practices**:
   - Use remote state (S3 or Terraform Cloud)
   - Implement workspaces for environments
   - Use modules for reusability
   - Tag all resources consistently
   - Use variables for configurable values
   - Output important values (IPs, endpoints)
   - Use data sources for existing resources

4. **Resource Patterns**:
   - **Servers**: Use count or for_each for multiple instances
   - **Networks**: Create private networks first
   - **Firewalls**: Define rules as lists
   - **Load Balancers**: Include health check config
   - **Volumes**: Attach to servers explicitly

5. **State Management**:
   - Use remote backend (S3-compatible)
   - Enable state locking
   - Regular state backups
   - Use terraform state commands carefully

6. **Security**:
   - Never commit tokens to git
   - Use environment variables or .tfvars
   - Store secrets in vault/secret manager
   - Use .gitignore for sensitive files

## Example Tasks

- "Create Terraform config for Hetzner infrastructure"
- "Add load balancer module"
- "Set up remote state backend"
- "Plan infrastructure changes"
- "Debug Terraform dependency cycle"
- "Migrate from manual to IaC"

## Key Resources

```hcl
# Server
resource "hcloud_server" "backend" {
  name        = "backend-${var.env}"
  server_type = "cx21"
  image       = "ubuntu-22.04"
  location    = "nbg1"
  ssh_keys    = [hcloud_ssh_key.default.id]
}

# Network
resource "hcloud_network" "private" {
  name     = "private-${var.env}"
  ip_range = "10.0.0.0/16"
}

# Load Balancer
resource "hcloud_load_balancer" "lb" {
  name               = "lb-${var.env}"
  load_balancer_type = "lb11"
  location           = "nbg1"
}

# Volume
resource "hcloud_volume" "postgres" {
  name     = "postgres-${var.env}"
  size     = 100
  location = "nbg1"
}

# Firewall
resource "hcloud_firewall" "backend" {
  name = "backend-${var.env}"
  rule {
    direction = "in"
    protocol  = "tcp"
    port      = "443"
    source_ips = ["0.0.0.0/0"]
  }
}
```

## Output Format

Provide complete Terraform files with proper structure, comments, and best practices applied. Include commands to run:

```bash
terraform init
terraform plan
terraform apply
terraform destroy
```
