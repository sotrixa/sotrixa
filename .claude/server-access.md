# Server Access Configuration

**Created:** 2026-01-20
**Updated:** 2026-01-20 (Added MCP server)
**Purpose:** SSH access for Claude Code to deploy and manage Dikrasin.bg infrastructure

## MCP Server (Preferred Method)

**MCP tools available in ALL conversations:**

- `mcp__dikrasin-ssh__ssh_execute` - Execute commands on server
- `mcp__dikrasin-ssh__ssh_upload` - Upload files via SCP
- `mcp__dikrasin-ssh__ssh_download` - Download files via SCP
- `mcp__dikrasin-ssh__get_server_info` - Get server information

**Example usage:**
```javascript
// Execute command
mcp__dikrasin-ssh__ssh_execute({ command: "sudo docker ps" })

// Get server info
mcp__dikrasin-ssh__get_server_info({})
```

**MCP Server location:** `~/.claude/mcp-servers/dikrasin-ssh/`

**Restart required:** After MCP server installation/updates, restart Claude Code.

---

## SSH Aliases

### Primary (Limited Access - Use This)
```bash
ssh dikrasin-deploy
```
- **User:** claude-deploy (non-root)
- **Key:** ~/.ssh/dikrasin_claude_deploy (passwordless)
- **Permissions:** Docker, systemctl, /app directory, apt
- **Security:** Limited sudo, cannot access root files

### Root Access (Emergency Only)
```bash
ssh dikrasin-hetzner
```
- **User:** root
- **Key:** ~/.ssh/id_dikrasin (passphrase protected)
- **Permissions:** Full root access
- **Security:** Requires passphrase (must be added to ssh-agent)

## Server Details

- **Hostname:** dikrasin-server
- **OS:** Ubuntu 24.04.3 LTS
- **Kernel:** 6.8.0-90-generic
- **App Directory:** `/app` (owned by claude-deploy)

## SSH Config Location

All configuration stored in: `~/.ssh/config`

SSH keys stored in: `~/.ssh/`
- `dikrasin_claude_deploy` (automation, no passphrase)
- `id_dikrasin` (manual, passphrase protected)

## Usage in Claude Code

```bash
# Deploy commands (preferred)
ssh dikrasin-deploy "cd /app && git pull"
ssh dikrasin-deploy "sudo docker ps"
ssh dikrasin-deploy "sudo systemctl restart app"

# Root commands (emergency only)
ssh dikrasin-hetzner "command"
```

## Security Notes

1. SSH config is in `~/.ssh/config` (NOT in git repository)
2. Private keys are in `~/.ssh/` (NOT in git repository)
3. This file contains NO credentials, only documentation
4. claude-deploy user has limited sudo access (see /etc/sudoers.d/claude-deploy on server)

## Verification

Test connection:
```bash
ssh dikrasin-deploy "whoami && hostname && sudo docker --version"
```

Expected output:
```
claude-deploy
dikrasin-server
Docker version ...
```

## First Time Setup (For New Conversations)

When starting a new Claude Code conversation:

1. Read this file to learn SSH alias: `dikrasin-deploy`
2. Test connection: `ssh dikrasin-deploy "whoami"`
3. If successful, proceed with deployment commands
4. If failed, check if user has run `ssh-add` for passphrase-protected keys

## Troubleshooting

**"Permission denied":**
- Check if ssh-agent has keys: `ssh-add -l`
- For root access: `ssh-add ~/.ssh/id_dikrasin` (enter passphrase)
- For deploy access: Should work automatically (no passphrase)

**"Connection refused":**
- Check server status via Hetzner Console
- Verify firewall allows SSH (port 22)

**"Command not found" or "Permission denied" for sudo:**
- Verify user is claude-deploy: `ssh dikrasin-deploy "whoami"`
- Check sudoers: `ssh dikrasin-deploy "sudo -l"`
- May need root access for system-level changes
