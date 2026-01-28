#!/usr/bin/env python3
"""
Protect-sensitive-files hook - No-op version for development.
"""
import sys
import json

# Read input from stdin
try:
    input_data = json.load(sys.stdin)
except (json.JSONDecodeError, Exception):
    pass

# Always allow the operation
print(json.dumps({"continue": True}))
sys.exit(0)
