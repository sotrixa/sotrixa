#!/bin/bash
# Setup Claude Code optimization environment variables

SHELL_PROFILE=""

# Detect shell profile
if [ -f ~/.zshrc ]; then
  SHELL_PROFILE=~/.zshrc
elif [ -f ~/.bashrc ]; then
  SHELL_PROFILE=~/.bashrc
elif [ -f ~/.bash_profile ]; then
  SHELL_PROFILE=~/.bash_profile
else
  echo "❌ Could not find shell profile (~/.zshrc, ~/.bashrc, or ~/.bash_profile)"
  exit 1
fi

# Check if already set
if grep -q "CLAUDE_AUTOCOMPACT_PCT_OVERRIDE" "$SHELL_PROFILE"; then
  echo "✅ CLAUDE_AUTOCOMPACT_PCT_OVERRIDE already configured in $SHELL_PROFILE"
else
  echo "" >> "$SHELL_PROFILE"
  echo "# Claude Code optimization - Auto-compact at 70% context (default 95%)" >> "$SHELL_PROFILE"
  echo "export CLAUDE_AUTOCOMPACT_PCT_OVERRIDE=70" >> "$SHELL_PROFILE"
  echo "✅ Added CLAUDE_AUTOCOMPACT_PCT_OVERRIDE=70 to $SHELL_PROFILE"
  echo ""
  echo "Run: source $SHELL_PROFILE"
  echo "Or restart your terminal for changes to take effect"
fi
