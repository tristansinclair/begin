# Prompt Templates

This directory contains Jinja2 templates for system prompts used by our agents.

## Directory Structure

- `candidly/` – Candidly-branded templates  
- `default/` – Shared or fallback templates  

## Naming Convention

- Filename pattern: `<architecture>_<agent>.j2`  
  - Example: `single_student_debt.j2`  
- Each template **must** include YAML front-matter at the top:

```yaml
---
version: "<major>.<minor>.<patch>"
date: "YYYY-MM-DD"
---
```

## Versioning

- Follow Semantic Versioning in front-matter.  
- Bump **patch** for backward-compatible tweaks.  
- Bump **minor** when adding variables or non-breaking features.  
- Bump **major** for breaking changes (e.g., removing or renaming variables).  
- Record changes in a `CHANGELOG.md` at the root of this directory.

## Missing Variables

- If a template rendering fails, agents will log an error and display:
  > The information was unable to be retrieved.

  We will want to make this more robust in the future!
