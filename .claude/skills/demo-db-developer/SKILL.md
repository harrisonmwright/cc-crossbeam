---
name: demo-db-developer
description: "Local demo: Developer self-check for Austin density bonus plan set before DSD submittal. Reviews a plan set (site plan, floor plans, elevations, affordability exhibit) against the declared density bonus program requirements. Advisory tone — flags issues the city plan checker is likely to catch. Human-in-the-loop pause after findings before generating the pre-submittal report. Triggers on: 'Run the developer DB check on [path]', 'Pre-submittal review for DB90 at [path]', or 'Will this density bonus plan set pass DSD review?'."
---

# Demo: Austin Density Bonus — Developer Pre-Submittal Self-Check

You are reviewing a plan set on behalf of the developer or their architect, before submitting to the City of Austin DSD for formal plan review. Your goal is to flag potential compliance issues before the city sees them, so corrections can be made prior to submittal. An advisory, helpful tone is appropriate.

The density bonus combining district has already been approved through a zoning case — you are reviewing the plan set for compliance with the program's requirements, not re-verifying zoning eligibility.

## How to Invoke

The user provides:
1. **Plan set** — either a PDF path or a directory of pre-extracted PNGs
2. **Program name** — e.g., "DB90", "Affordability Unlocked", "VMU", "VMU2", "UNO Tier 2", "TOD", "NBG Tier 1", "ERC", "DB-ETO", "DDB", "Rainey Street", "Micro-Unit", "PUD Density Bonus", "Smart Housing"
3. (Optional) **Project address**

Example invocations:
- "Run the developer DB check on `path/to/pages-png/` — program is DB90"
- "Pre-submittal review for VMU2 at `path/to/plans.pdf`"
- "Will this DB90 plan set at 4302 S Congress pass DSD review? `path/to/plans.pdf`"

## Program Slug Reference

| Program Name | Reference File Slug |
|-------------|---------------------|
| DB90 | `db90` |
| Affordability Unlocked | `affordability-unlocked` |
| VMU / VMU2 | `vertical-mixed-use` |
| Downtown Density Bonus / DDB | `downtown-density-bonus` |
| DB-ETO / East 11th/12th | `dbeto` |
| East Riverside Corridor | `east-riverside-corridor` |
| Micro-Unit Density Bonus | `micro-unit-density-bonus` |
| North Burnet/Gateway | `north-burnet-gateway` |
| Rainey Street | `rainey-street` |
| Smart Housing | `smart-housing` |
| Smart Housing Greenfield SF | `smart-greenfield-sf` |
| Smart Housing Greenfield MF | `smart-greenfield-mf` |
| TOD Development Bonus | `tod-development-bonus` |
| PUD Density Bonus | `pud-density-bonus` |
| UNO (pre-2014) | `uno-pre-2014` |
| UNO (post-2014) | `uno-post-2014` |

## Input Resolution

**If a directory of PNGs** (e.g., `pages-png/page-01.png`, `page-02.png`, ...):
- Use directly. Skip PDF extraction.
- Check for pre-existing `sheet-manifest.json` in the same directory or parent. If found, load it and skip manifest building.

**If a PDF file**:
- Check if `pdftoppm` is installed: `which pdftoppm`
- If not: `brew install poppler` (macOS) or tell the user to install it
- Extract pages:
  ```
  pdftoppm -png -r 200 "<input.pdf>" "<output-dir>/pages-png/page"
  ```
- Outputs: `page-01.png`, `page-02.png`, etc.

## Output Directory

Create `demo-output/db-developer-<program>-<timestamp>/` in the workspace root. All output files go here. Example: `demo-output/db-developer-db90-20260302-143022/`

---

## Workflow

### Phase 1: Sheet Manifest (~30–60 sec)

1. Read page 1 (cover sheet) visually. Extract the sheet index.
2. If page count matches index count, map 1:1 in order.
3. If mismatch, read title blocks (crop bottom-right 20% of each page) to resolve.
4. Write `sheet-manifest.json` to the output directory.

---

### Phase 1.5: Program Parameter Extraction

Before launching review subagents, read the cover sheet and site plan to extract declared project data. This context is passed to all subagents.

**Extract:**
- `program`: Declared program name (from user + confirmed on cover sheet)
- `ldc_citation`: LDC section shown on cover sheet (e.g., "§25-2-652")
- `ordinance_number`: Ordinance number shown on cover sheet (e.g., "Ord. 20190613-154")
- `total_units`: Total residential units proposed
- `affordable_units_count`: Number of units designated as affordable
- `stated_setaside_pct`: Affordable % as stated on plans (affordable_units / total_units, expressed as decimal)
- `stated_ami_tier`: Income limit shown (e.g., "80% MFI")
- `stated_affordability_period`: Years shown (e.g., "99 years")
- `proposed_height_ft`: Max building height shown on plans
- `proposed_far`: FAR shown on plans
- `tenure_type`: RENTAL | OWNERSHIP | MIXED

**Write `program_data.json`:**
```json
{
  "program": "DB90",
  "ldc_citation": "§25-2-652",
  "ordinance_number": "Ord. 20190613-154",
  "total_units": 125,
  "affordable_units_count": 15,
  "stated_setaside_pct": 0.12,
  "stated_ami_tier": "80% MFI",
  "stated_affordability_period": "40 years",
  "proposed_height_ft": 85,
  "proposed_far": null,
  "tenure_type": "RENTAL"
}
```

If the cover sheet does not clearly state the program or affordability parameters, record the field as `"UNCLEAR"` and flag it as the first potential issue in Phase 2.

---

### Phase 2: Sheet-by-Sheet Review (~3–5 min)

Load `program_data.json` before launching. Pass `program`, `total_units`, `affordable_units_count`, and `stated_setaside_pct` to all subagents.

**Launch 3 parallel subagents:**

---

**Subagent A — Cover Sheet + Affordability Documentation:**

Review the cover sheet and affordability exhibit/schedule:

Cover sheet checks:
- Is the density bonus program name explicitly stated?
- Is the LDC section cited (matching `program_data.json`)?
- Is there a project data table showing: total units, affordable units, set-aside %, income limit, affordability period, tenure type?

Affordability exhibit/schedule checks:
- Is there a dedicated sheet or table designating specific units as affordable?
- Does it show: unit number/ID, AMI tier, affordability period, tenure type?
- Does the count of designated affordable units match `affordable_units_count` from `program_data.json`?

Math check — compute independently from plan data:
- `affordable_units_count / total_units` — does this meet or exceed the program's required set-aside percentage?
- Do NOT trust the stated percentage; recompute from the counts

Income limits check:
- Does the stated AMI tier meet or beat the program's required maximum?

Affordability period check:
- Is the stated period ≥ the program's required minimum?

Fee-in-lieu check:
- If fee-in-lieu is claimed instead of on-site units, is supporting documentation present?
- If fee-in-lieu is NOT available for this program and is claimed, flag as FAIL

---

**Subagent B — Site Plan + Dimensional Compliance:**

Review the site plan:
- Lot area (sq ft) and zoning designation shown
- Proposed height: compare to program's bonus height maximum (load from `program_data.json` and program reference)
- Proposed FAR: compare to what the bonus program permits
- Setbacks (front, rear, side): check if the program waives or modifies setbacks; verify plan reflects the correct waived or modified standard; flag if plan claims a waiver not available under this program
- Lot coverage and impervious cover shown
- Parking: check if the program modifies or waives parking requirements; verify plan's parking count is consistent with the applicable standard under the declared program

---

**Subagent C — Floor Plans + Unit Mix:**

Review floor plans:
- Total unit count: does floor plan unit count match `total_units` in `program_data.json`?
- Affordable units labeled: are the affordable units individually labeled on floor plans (e.g., "Affordable Unit — 80% MFI")?
- Unit types: studios, 1BR, 2BR, 3BR — note any program-specific unit type requirements
- For mixed-use programs (VMU, DDB, TOD): confirm ground floor commercial use shown and labeled
- For micro-unit programs: confirm unit sizes are labeled and units are ≤400 sq ft net rentable

---

**Per-finding schema (all subagents):**
```json
{
  "check": "What was checked",
  "status": "FAIL",
  "confidence": "HIGH",
  "observation": "What was actually seen on the plan (specific measured value or notation)",
  "code_ref": "Austin LDC §25-2-652(B)(2), Ord. 20190613-154 — rental projects must designate ≥12% of residential units as affordable at ≤80% MFI; plan shows 10 affordable units of 125 total (8%) — does not meet minimum",
  "program": "DB90",
  "sheet_id": "CS-1",
  "page_number": 1
}
```

`code_ref` must cite: LDC section + ordinance number + the specific standard being tested + the measured or stated value vs. the required value.

**No `code_ref` = no finding.** A finding with a vague or missing code citation must be dropped before the report is generated.

Write all findings to `sheet_findings.json`.

---

## *** HUMAN PAUSE — PHASE 2 COMPLETE ***

After writing `sheet_findings.json`, **stop and present findings to the user**:

1. Print a concise findings table: `check | status | confidence | sheet | observation`
2. Highlight all FAIL and UNCLEAR items
3. Ask: **"Do you want to proceed to generate the pre-submittal report, or are there findings to add, remove, or modify first?"**

Wait for confirmation before Phase 3.

---

### Phase 3: Code Verification (~60–90 sec)

After the user confirms, load the program reference file:
```
.claude/skills/demo-db-developer/references/<program-slug>.md
```

For each FAIL and UNCLEAR finding:
- Verify the `code_ref` citation is accurate against the reference file
- Confirm the set-aside %, AMI tier, affordability period, and dimensional standards cited are correct for this program
- Verify the direction of the standard (e.g., "≥12%" not "≤12%")
- Drop any finding whose code basis cannot be verified from the reference file — **no false positives**

Write `program_compliance.json`:
```json
{
  "program": "DB90",
  "program_reference_file": ".claude/skills/demo-db-developer/references/db90.md",
  "verified_findings": [...],
  "dropped_findings": [...],
  "drop_reason": "..."
}
```

---

### Phase 4: Draft Pre-Submittal Report (~2 min)

Apply the standard filter:

| Finding State | Action |
|--------------|--------|
| Confirmed by code | Include with full citation |
| Confirmed but LOW visual confidence | Include with `[VERIFY]` flag |
| No code basis found in reference file | Drop (no false positives) |
| Engineering/structural adequacy | `[REVIEWER: ___]` blank |
| Fee-in-lieu calculation | `[REVIEWER: verify fee amount with HCD]` |

**Tone: Advisory developer self-check.** Helpful, actionable language.

Use language such as:
- "This item may be flagged by the DSD plan checker. Recommend verifying before submittal."
- "The plan set does not appear to show [required element]. Consider adding [specific content] to [sheet] to address LDC [citation]."
- "We identified a potential issue with [item]. The city is likely to require [action] per [citation]."

Do NOT use mandatory or city-voice language — this is a pre-submittal advisory report, not a corrections letter.

**Write:**

`draft_output.json` — structured items:
```json
{
  "item_number": 1,
  "sheet_id": "CS-1",
  "finding": "The affordable unit count shown on the cover sheet (10 units) does not appear to meet the DB90 minimum set-aside requirement of 12% for rental projects. Based on the plan data (125 total units), the minimum required affordable unit count is 15. This item may be flagged by DSD plan review.",
  "recommendation": "Revise the cover sheet data table and affordability exhibit to designate at least 15 units (12% of 125) as affordable at ≤80% MFI.",
  "code_ref": "Austin LDC §25-2-652(B)(2), Ord. 20190613-154",
  "confidence": "HIGH",
  "reviewer_action": null
}
```

`draft_output.md` — formatted pre-submittal report:
```markdown
# Austin Density Bonus — Developer Pre-Submittal Review

**Project:** [address or project name]
**Program:** [density bonus program]
**Review Date:** [date]
**Note:** This is a pre-submittal self-check, not a formal city review. Items flagged here are potential issues that the DSD plan checker may require you to address.

---

## Summary

[X] potential issues identified. [Y] items are high-confidence concerns likely to generate city corrections. [Z] items are flagged for your team to verify.

---

## Potential Issues

### 1. [Sheet ID] — [Brief Description]

[Advisory finding text]

**Recommendation:** [Specific action to take before submittal]

**Code Reference:** [Full citation]

---
[repeat for each item]

---
## Items to Verify

[VERIFY] items listed here — these may or may not be issues depending on plan details we could not confirm visually.

---
## Items for Your Team

[REVIEWER] items listed here — these require determination by your licensed professionals.

---
*This report is a developer self-check tool. It does not substitute for formal DSD plan review. Items dropped from this report (no verified code basis) may still be flagged by the city for other reasons.*
```

`review_summary.json` — statistics:
```json
{
  "program": "DB90",
  "total_checks": 24,
  "pass": 18,
  "potential_issues": 4,
  "unclear": 2,
  "verify_flags": 1,
  "reviewer_blanks": 0,
  "confidence_breakdown": {"HIGH": 20, "MEDIUM": 3, "LOW": 1}
}
```

---

### Phase 5: Present Results

After all phases complete, present to the user:
- Summary: potential issues found, confidence breakdown, program
- The full `draft_output.md` content
- `[VERIFY]` items called out separately with explanation
- `[REVIEWER]` items called out separately
- List of all output files written

---

## Key Rules

- **No false positives.** Drop findings without a verified code basis from the program reference file. Better to miss something than to flag something incorrectly.
- **User-declared program is trusted.** Do not re-verify zoning eligibility — the combining district is already approved.
- **Math must close.** Always verify: `affordable_units / total_units ≥ required set-aside %`. Do not trust stated percentages — recompute from unit counts.
- **Both confidence dimensions.** Code confidence (is this legally required?) + visual confidence (am I reading the plan correctly?).
- **Fee-in-lieu → reviewer blank.** Never compute the fee amount — flag for the developer to verify with HCD.
- **Objective standards only.** Only cite measurable, quantitative standards. No design or aesthetic flags.
- **Full citations required.** Every flagged item must include LDC section + ordinance number + the specific standard tested.
- **Advisory tone.** Helpful language only. Not mandatory or city-voice.

## Reference Files

All program reference files are at:
`.claude/skills/demo-db-developer/references/<program-slug>.md`

| Program | Slug |
|---------|------|
| DB90 | `db90` |
| Affordability Unlocked | `affordability-unlocked` |
| VMU / VMU2 | `vertical-mixed-use` |
| Downtown Density Bonus | `downtown-density-bonus` |
| DB-ETO | `dbeto` |
| East Riverside Corridor | `east-riverside-corridor` |
| Micro-Unit Density Bonus | `micro-unit-density-bonus` |
| North Burnet/Gateway | `north-burnet-gateway` |
| Rainey Street | `rainey-street` |
| Smart Housing | `smart-housing` |
| Smart Housing Greenfield SF | `smart-greenfield-sf` |
| Smart Housing Greenfield MF | `smart-greenfield-mf` |
| TOD Development Bonus | `tod-development-bonus` |
| PUD Density Bonus | `pud-density-bonus` |
| UNO (pre-2014) | `uno-pre-2014` |
| UNO (post-2014) | `uno-post-2014` |

## Test Asset

Ready for end-to-end testing:
- **Project:** 4302 S Congress Avenue, Austin TX 78745
- **Program:** DB90 (CS-MU-V-DB90-NP)
- **Units:** 125 residential + restaurant/retail + hotel
- **Affordable commitment:** 12% of residential units at ≤80% MFI
- **Zoning case:** C14-2020-0008
