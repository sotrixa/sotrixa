# Docker & Kubernetes Management

Manage Docker containers and Kubernetes deployments for Node.js/Express backend and React 19 frontend applications.

## When to Use

- Building or optimizing Dockerfiles
- Managing multi-container setups with docker-compose
- Creating or updating Kubernetes manifests
- Deploying to K8s clusters
- Troubleshooting container issues
- Setting up dev/staging/prod environments

## Tech Stack Context

- **Backend**: Node.js + Express + TypeScript
- **Frontend**: React 19 + TypeScript + Vite
- **Event Bus**: NATS JetStream
- **Database**: PostgreSQL (assumed)
- **Hosting**: Hetzner Cloud

## Instructions

When managing Docker/K8s:

1. **Dockerfile Best Practices**:
   - Use multi-stage builds for Node.js apps
   - Optimize layer caching (copy package.json first)
   - Use node:20-alpine for smaller images
   - Run as non-root user
   - Include .dockerignore

2. **Docker Compose**:
   - Include services: backend, frontend, NATS JetStream, PostgreSQL
   - Use named volumes for persistence
   - Set up health checks
   - Configure networks properly
   - Include environment variable templates

3. **Kubernetes Manifests**:
   - Create Deployments for backend/frontend
   - Use StatefulSets for NATS JetStream
   - Configure Services (ClusterIP, LoadBalancer)
   - Set up ConfigMaps and Secrets
   - Define resource limits/requests
   - Include HPA (Horizontal Pod Autoscaler) for scaling
   - Add liveness/readiness probes

4. **Security**:
   - Scan images with trivy
   - Use secrets management (not hardcoded)
   - Run containers as non-root
   - Limit capabilities
   - Use network policies

5. **Optimization**:
   - Minimize image size
   - Use buildkit caching
   - Implement health checks
   - Configure resource limits appropriately

## Example Tasks

- "Create Dockerfile for Express backend"
- "Set up docker-compose for local development"
- "Generate K8s manifests for Hetzner deployment"
- "Debug container that won't start"
- "Optimize Docker build time"

## Output Format

Provide ready-to-use Dockerfiles, docker-compose.yml, or K8s manifests with inline comments explaining configuration choices.
