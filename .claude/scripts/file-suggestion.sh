#!/bin/bash
# Smart file suggestions based on recent changes
git diff --name-only HEAD~5..HEAD 2>/dev/null | head -20 || echo ""
