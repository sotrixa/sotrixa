#!/bin/bash
# Alert on dependency file changes

# Read JSON input from stdin
INPUT=$(cat)

# Get file path from tool input
FILE_PATH=$(echo "$INPUT" | jq -r '.tool_input.file_path // empty')

# Check if it's a dependency file
if echo "$FILE_PATH" | grep -qE '(package\.json|package-lock\.json|composer\.json|composer\.lock|requirements\.txt|Pipfile|Gemfile|Gemfile\.lock|go\.mod|go\.sum|Cargo\.toml|Cargo\.lock|yarn\.lock|pnpm-lock\.yaml)$'; then
  TIMESTAMP=$(date '+%Y-%m-%d %H:%M:%S')
  echo "[${TIMESTAMP}] ⚠️  DEPENDENCY CHANGE: ${FILE_PATH}" >> .claude/alerts.log
fi

exit 0
