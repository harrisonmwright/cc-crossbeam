---
name: austin-density-bonus
description: "Austin density bonus program reference package. Contains LDC standards for all 16 Austin density bonus combining districts — DB90, Affordability Unlocked, VMU/VMU2, DDB, DB-ETO, ERC, Micro-Unit, NBG, Rainey Street, Smart Housing, TOD, PUD, and UNO programs. Loaded by demo-db-city and demo-db-developer during Phase 3 code verification."
---

# Austin Density Bonus — Reference Package

This package contains the program-specific standards for all Austin density bonus combining districts. It is loaded by **`demo-db-city`** and **`demo-db-developer`** during Phase 3 code verification.

Both the city review skill and the developer self-check skill share this single reference package — eliminating duplication and ensuring both skills cite the same standards.

---

## Program Index

| Program Name | Slug | Reference File |
|-------------|------|----------------|
| DB90 | `db90` | `references/db90.md` |
| Affordability Unlocked | `affordability-unlocked` | `references/affordability-unlocked.md` |
| VMU / VMU2 | `vertical-mixed-use` | `references/vertical-mixed-use.md` |
| Downtown Density Bonus / DDB | `downtown-density-bonus` | `references/downtown-density-bonus.md` |
| DB-ETO / East 11th/12th | `dbeto` | `references/dbeto.md` |
| East Riverside Corridor | `east-riverside-corridor` | `references/east-riverside-corridor.md` |
| Micro-Unit Density Bonus | `micro-unit-density-bonus` | `references/micro-unit-density-bonus.md` |
| North Burnet/Gateway | `north-burnet-gateway` | `references/north-burnet-gateway.md` |
| Rainey Street | `rainey-street` | `references/rainey-street.md` |
| Smart Housing | `smart-housing` | `references/smart-housing.md` |
| Smart Housing Greenfield SF | `smart-greenfield-sf` | `references/smart-greenfield-sf.md` |
| Smart Housing Greenfield MF | `smart-greenfield-mf` | `references/smart-greenfield-mf.md` |
| TOD Development Bonus | `tod-development-bonus` | `references/tod-development-bonus.md` |
| PUD Density Bonus | `pud-density-bonus` | `references/pud-density-bonus.md` |
| UNO (pre-2014) | `uno-pre-2014` | `references/uno-pre-2014.md` |
| UNO (post-2014) | `uno-post-2014` | `references/uno-post-2014.md` |

---

## How to Load

During Phase 3 code verification, load the specific program file by slug:

```
adu-skill-development/skill/austin-density-bonus/references/<program-slug>.md
```

Example for DB90:
```
adu-skill-development/skill/austin-density-bonus/references/db90.md
```

---

## Shared by Both Review Skills

| Skill | Role | Uses This Package |
|-------|------|-------------------|
| `demo-db-city` | City staff corrections letter | Phase 3 code verification |
| `demo-db-developer` | Developer pre-submittal self-check | Phase 3 code verification |

Both skills load the same reference files — the difference is tone and output format, not the underlying standards.

---

## Notes

- **User-declared program is trusted.** Neither skill re-verifies zoning eligibility — the combining district is already approved before plan review begins.
- **Math must close independently.** Always verify `affordable_units / total_units ≥ required set-aside %`. Do not trust the stated percentage on the plans.
- **Fee-in-lieu availability varies by program.** Check the specific program reference file — some programs prohibit fee-in-lieu.
