# Archive Folder

**Purpose**: Historical reference and backups only

---

## What's Here

### Backups
- `settings.json.backup-*` - Automatic backups before major changes

### Historical Documentation (Superseded)
- `ALL_20_OPTIMIZATIONS_COMPLETE.md` - Superseded by `../ACTIVE_OPTIMIZATIONS.md`
- `MASTER_OPTIMIZATION_GUIDE.md` - Superseded by `../COMPLETE_OPTIMIZATION_GUIDE.md`
- `COMPLETE_IMPLEMENTATION_SUMMARY.md` - Historical reference
- `OPTIMIZATION_SUMMARY.md` - Historical reference
- `ADDITIONAL_OPTIMIZATIONS.md` - Historical reference
- `QUICK_START_OPTIMIZATIONS.md` - Superseded by active setup

### Historical Scripts (Superseded)
- `apply-optimizations.sh` - Superseded by current `settings.json` (already has all optimizations)

### Example Files
- `stop-hook-stdin.json` - Example of hook stdin format

---

## What's NOT Here (Active Files)

All active files are in main `.claude/` folder:

### Active Docs
- `ACTIVE_OPTIMIZATIONS.md` - Current optimization status
- `COMPLETE_OPTIMIZATION_GUIDE.md` - Full implementation guide
- `CONTEXT_MANAGEMENT.md` - Context strategy
- `CONTEXT_QUICK_REFERENCE.md` - 5 golden rules
- `ADVANCED_OPTIMIZATIONS.md` - Advanced techniques
- `README-TOOL-CACHING.md` - Tool caching guide
- `README.md` - Configuration overview
- `PRODUCTION_OPTIMIZATIONS.md` - Production safety

### Active Scripts (in `scripts/`)
- All `.sh` scripts are active and executable
- No duplication with archive

### Active Agents (in `agents/`)
- `cost-optimizer.md`
- `quick-reviewer.md`
- `deep-reviewer.md`

### Active Templates (in `templates/`)
- `context-handoff.md`

---

## Why Archive?

The archive is gitignored and contains:
1. **Backups** for recovery if needed
2. **Historical docs** showing evolution of optimizations
3. **Example files** for reference

**Rule**: If a file is actively used, it should NOT be in archive.

---

**Current Status**: Archive contains 9 historical/backup files. All active optimizations are in main folders.
