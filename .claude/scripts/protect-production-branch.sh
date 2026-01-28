#!/bin/bash
# Block writes/edits on production branches (main, master, production)

# Read JSON input from stdin
INPUT=$(cat)

# Get current git branch
BRANCH=$(git branch --show-current 2>/dev/null)

# Check if on a production branch
if [[ "$BRANCH" =~ ^(main|master|production)$ ]]; then
  # Get tool name and file path for better error message
  TOOL=$(echo "$INPUT" | jq -r '.tool')
  FILE=$(echo "$INPUT" | jq -r '.tool_input.file_path // .tool_input.command // "operation"')

  echo "❌ BLOCKED: Cannot perform ${TOOL} on branch '${BRANCH}'"
  echo "   Target: ${FILE}"
  echo "   Create a feature branch first: git checkout -b feature/your-branch-name"
  exit 1
fi

# Allow operation
exit 0
