# Security Scanning

Perform security scanning and vulnerability assessment for Node.js/React applications and infrastructure.

## When to Use

- Scanning dependencies for vulnerabilities
- Auditing code for security issues
- Checking Docker images for CVEs
- Testing APIs for security flaws
- Validating OWASP Top 10 compliance
- Pre-deployment security checks

## Tech Stack Context

- **Backend**: Node.js + Express + TypeScript
- **Frontend**: React 19 + TypeScript
- **Infrastructure**: Docker, Kubernetes, Hetzner Cloud
- **Event Bus**: NATS JetStream

## Instructions

When conducting security scans:

1. **Dependency Scanning**:
   - Use `npm audit` for Node.js packages
   - Use `snyk` for comprehensive vulnerability detection
   - Check for outdated packages
   - Review dependency licenses
   - Automate with Dependabot/Renovate

2. **Code Security Analysis**:
   - **SAST** (Static): ESLint security plugins, Semgrep
   - **DAST** (Dynamic): OWASP ZAP, Burp Suite
   - Check for common vulnerabilities:
     - SQL injection
     - XSS (Cross-Site Scripting)
     - CSRF (Cross-Site Request Forgery)
     - Authentication/authorization flaws
     - Sensitive data exposure
     - Insecure deserialization

3. **Container Security**:
   - Scan Docker images with Trivy or Grype
   - Check base image vulnerabilities
   - Validate Dockerfile best practices
   - Use minimal base images (alpine)
   - Run as non-root user

4. **Infrastructure Security**:
   - Scan IaC with checkov or tfsec (Terraform)
   - Validate Kubernetes manifests with kubesec
   - Check for exposed secrets
   - Validate firewall rules
   - Review IAM permissions

5. **API Security Testing**:
   - Test authentication/authorization
   - Validate input sanitization
   - Test rate limiting
   - Check CORS configuration
   - Test for injection attacks
   - Validate JWT security

6. **OWASP Top 10 Checks**:
   - A01: Broken Access Control
   - A02: Cryptographic Failures
   - A03: Injection
   - A04: Insecure Design
   - A05: Security Misconfiguration
   - A06: Vulnerable Components
   - A07: Authentication Failures
   - A08: Data Integrity Failures
   - A09: Logging Failures
   - A10: SSRF

## Security Scanning Tools

**Dependency Scanning**:
```bash
# npm audit
npm audit
npm audit fix

# Snyk
snyk test
snyk monitor

# OWASP Dependency Check
dependency-check --project "Dikrasin.bg" --scan ./
```

**Code Analysis**:
```bash
# Semgrep (SAST)
semgrep --config=auto .

# ESLint security plugin
npm install eslint-plugin-security --save-dev
# Add to .eslintrc: "plugin:security/recommended"

# NodeJsScan
nodejsscan -d /path/to/code
```

**Container Scanning**:
```bash
# Trivy
trivy image backend:latest
trivy fs .  # Scan filesystem

# Grype
grype backend:latest

# Docker Scout
docker scout cves backend:latest
```

**Infrastructure**:
```bash
# Checkov (IaC)
checkov -d terraform/

# tfsec (Terraform)
tfsec terraform/

# kubesec (K8s)
kubesec scan deployment.yaml
```

**API Security**:
```bash
# OWASP ZAP
zap-cli quick-scan -s xss,sqli https://api.dikrasin.bg

# Nuclei
nuclei -u https://api.dikrasin.bg -t cves/

# Postman/Newman security tests
newman run security-tests.json
```

## Example Security Test (API)

```typescript
import request from 'supertest';
import app from '../app';

describe('Security Tests', () => {
  describe('SQL Injection', () => {
    it('should not be vulnerable to SQL injection', async () => {
      const maliciousInput = "1' OR '1'='1";
      const res = await request(app)
        .get(`/api/users/${maliciousInput}`);

      expect(res.status).not.toBe(200);
    });
  });

  describe('XSS Protection', () => {
    it('should sanitize HTML input', async () => {
      const xssPayload = '<script>alert("XSS")</script>';
      const res = await request(app)
        .post('/api/comments')
        .send({ content: xssPayload });

      expect(res.body.content).not.toContain('<script>');
    });
  });

  describe('Authentication', () => {
    it('should reject requests without token', async () => {
      const res = await request(app)
        .get('/api/protected-route');

      expect(res.status).toBe(401);
    });

    it('should reject invalid tokens', async () => {
      const res = await request(app)
        .get('/api/protected-route')
        .set('Authorization', 'Bearer invalid-token');

      expect(res.status).toBe(401);
    });
  });

  describe('Rate Limiting', () => {
    it('should rate limit excessive requests', async () => {
      const requests = Array(100).fill(null).map(() =>
        request(app).get('/api/users')
      );

      const responses = await Promise.all(requests);
      const rateLimited = responses.some(r => r.status === 429);

      expect(rateLimited).toBe(true);
    });
  });
});
```

## Security Checklist

- [ ] Dependencies scanned for CVEs
- [ ] No hardcoded secrets in code
- [ ] Authentication/authorization tested
- [ ] Input validation on all endpoints
- [ ] SQL injection protection (parameterized queries)
- [ ] XSS protection (sanitize output)
- [ ] CSRF protection enabled
- [ ] Rate limiting implemented
- [ ] HTTPS enforced
- [ ] Security headers configured (helmet.js)
- [ ] Docker images scanned
- [ ] Infrastructure as Code validated
- [ ] Logging and monitoring enabled
- [ ] Regular security updates scheduled

## Example Tasks

- "Scan backend for vulnerabilities"
- "Check Docker image for CVEs"
- "Test API for OWASP Top 10"
- "Audit dependencies for security issues"
- "Validate Terraform for security misconfigs"
- "Run SAST on codebase"

## CI/CD Integration

```yaml
# GitHub Actions example
- name: Security Scan
  run: |
    npm audit --audit-level=high
    npx snyk test
    trivy image backend:latest
    semgrep --config=auto .
```

## Output Format

Provide scan results with severity ratings, remediation steps, and code examples for fixes. Prioritize critical and high-severity issues.
