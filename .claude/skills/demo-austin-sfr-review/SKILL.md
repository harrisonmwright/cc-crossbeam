---
name: demo-austin-sfr-review
description: "Local demo: Austin city-side residential plan review for single-family, two-unit, and three-unit projects against HOME Phase I/II and Texas state law. The HOME Initiative allows up to 3 units by right on SF-zoned lots — this skill reviews those submittals as a city plan checker. Point this at a plan set (PDF or pre-extracted PNGs). Phase 1 reviews sheets and presents findings — then PAUSES for city staff review. After staff confirm, Phase 2 generates the draft corrections letter. Triggers on: 'Review this plan set for Austin', 'Run the Austin HOME review on [path]', or 'Check if this two-unit / three-unit project complies with HOME'."
---

# Demo: Austin Residential Plan Review (HOME Phase I/II)

Run a city-side residential plan review for Austin, TX. You are a city plan checker reviewing a permit submittal for compliance with the Austin Land Development Code (LDC), the HOME Initiative amendments (Phase I and II), and applicable Texas state law.

**In scope:** Single-family residential, Two-Unit Residential, and Three-Unit Residential uses on SF-1, SF-2, and SF-3 zoned lots. The HOME Initiative is the central policy context: it allows up to 3 dwelling units by right on any SF-zoned lot (Phase I, lots ≥5,750 sq ft) and enables small-lot SFR development on lots as small as 1,800 sq ft (Phase II). Most submittals under HOME will be one of: a standalone SFR, a main house + ADU (Two-Unit), or a main house + two additional units (Three-Unit).

## How to Invoke

The user provides:
1. **Plan set** — either a PDF path or a directory of pre-extracted PNGs
2. (Optional) **Project address** — helps confirm zoning and lot data

Example invocations:
- "Review this SFR plan set for Austin: `path/to/pages-png/`"
- "Run the Austin HOME review on `path/to/plans.pdf`"
- "Check if this plan at 1234 Main St Austin complies with HOME"

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
- Outputs will be `page-01.png`, `page-02.png`, etc.

## Output Directory

Create `demo-output/austin-sfr-review-<timestamp>/` in the workspace root. All output files go here.

## Workflow

### Phase 1: Sheet Manifest (~30–60 sec)

1. Read page 1 (cover sheet) visually. Extract the sheet index.
2. If page count matches index count, map 1:1 in order.
3. If mismatch, read title blocks (crop bottom-right 20% of each page) to resolve.
4. Write `sheet-manifest.json` to the output directory.

### Phase 1.5: Lot Classification + Phase Determination

Before launching sheet review subagents, read the site plan (or cover sheet data table if it contains lot data) to extract the key lot metrics that determine which HOME phase governs. This step must complete before Phase 2 begins — the governing phase is passed to all subagents.

**Extract from plans:**
- `lot_area_sqft`: Total lot area in square feet
- `lot_width_at_setback`: Lot width measured at the front setback line
- `lot_width_at_25ft`: Lot width measured at 25 ft behind the front setback line (the Phase II measurement — LDC §25-1-22(C) as amended)
- `flag_lot`: Yes / No
- `zoning`: Base zoning designation (e.g., SF-1, SF-2, SF-3)
- `unit_count_proposed`: Number of dwelling units proposed on the lot

**Apply the governing phase decision tree:**

| Lot Area | Governing Phase | Key Standards Section |
|----------|-----------------|-----------------------|
| ≥5,750 sq ft | **PHASE_I** | §25-2-773 (Duplex, Two-Unit, Three-Unit) — up to 3 units |
| 1,800–5,749 sq ft | **PHASE_II** | §25-2-779 (Small Lot SFR) — 1 unit only |
| <1,800 sq ft | **NON_COMPLIANT** | Fails HOME minimum lot size — flag immediately, stop review |

- A lot ≥5,750 sq ft is not eligible for Phase II small lot SFR rules — Phase I governs entirely.
- If the lot area is within 50 sq ft of a threshold (e.g., 5,700–5,800 sq ft), record confidence as MEDIUM and note the measurement source.

**Determine the use type** (for Phase I lots, the specific use type sets which FAR and coverage limits apply):

| Units Proposed | Use Type | Phase I FAR (site) | Phase I FAR (per unit) |
|---------------|----------|--------------------|------------------------|
| 1 | Single-Family Residential | Base district rules | Base district rules |
| 2 | Two-Unit Residential | Greater of 0.55 or 3,200 sq ft | Greater of 0.4 or 2,300 sq ft |
| 3 | Three-Unit Residential | Greater of 0.65 or 4,350 sq ft | Greater of 0.4 or 2,300 sq ft (two units combined: greater of 0.55 or 3,200 sq ft) |

Note: A main house + ADU on the same lot = Two-Unit Residential use, not Single-Family. Both buildings are reviewed together under the Two-Unit standards.

**Write `lot_classification.json`:**
```json
{
  "lot_area_sqft": 7730,
  "lot_width_at_setback": 55,
  "lot_width_at_25ft": 55,
  "flag_lot": false,
  "zoning": "SF-3",
  "unit_count_proposed": 2,
  "use_type": "TWO_UNIT_RESIDENTIAL",
  "governing_phase": "PHASE_I",
  "governing_section": "Austin LDC §25-2-773, Ord. 20231207-001",
  "measurement_confidence": "HIGH"
}
```

If lot area cannot be read from the plans, record `governing_phase: "UNCLEAR"` and flag it as the first FAIL item — the review cannot proceed accurately without it.

---

### Phase 2: Sheet-by-Sheet Review (~3–5 min)

Load `lot_classification.json` before launching subagents. Pass `governing_phase` and `governing_section` to all three subagents so each applies the correct standard set.

Review sheets in parallel using subagents. Group by discipline:

**Subagent A — Administrative + Site:**
- Cover sheet (CS): stamps/signatures, applicable codes listed (IBC/IRC edition, Austin LDC, HOME amendment ordinance number), sheet index accuracy, project data (address, legal description, zoning designation, proposed unit count)
- Site plan (SP) — lot measurements (record all of the following explicitly):
  - Lot area (sq ft) — compare to `lot_classification.json`; flag if plan value differs
  - Lot width at front setback line
  - Lot width at 25 ft behind front setback line (Phase II measurement per §25-1-22(C))
  - Flag lot status
  - Front, rear, and side setbacks (measured values vs. governing phase minimums)
  - Lot coverage % (building footprint ÷ lot area)
  - Impervious cover % (total impervious area ÷ lot area)
  - FAR (gross floor area ÷ lot area) if within Subchapter F compatibility area
  - Parking count and type (covered vs. uncovered)
  - Utility connections shown
  - Tree survey / TPZ noted
  - Drainage direction

**Subagent B — Architectural:**
- Floor plans (A-series): review **each building/unit separately**
  - Confirm unit count matches `unit_count_proposed` in `lot_classification.json`
  - For each unit: record gross floor area (GFA), room labels, egress path (door widths ≥32", travel distance), accessible route (visitability if required), stair dimensions if multi-story
  - For Two-Unit: verify combined site GFA does not exceed the greater of 0.55 FAR or 3,200 sq ft; verify no single unit exceeds greater of 0.4 FAR or 2,300 sq ft (§25-2-773(E))
  - For Three-Unit: verify site GFA ≤ greater of 0.65 FAR or 4,350 sq ft; no single unit exceeds greater of 0.4 FAR or 2,300 sq ft; no two units combined exceed greater of 0.55 FAR or 3,200 sq ft (§25-2-773(E))
  - Note which unit is the primary dwelling and which are secondary/ADU if labeled
- Elevations (review each building): building height measured from natural grade to highest point of roof ridge; confirm no single building height is called out as exceeding base district limit; facade materials noted; fenestration shown

**Subagent C — Life Safety + Structure:**
- Building sections: wall assembly, insulation values (energy code), eave/soffit detail
- Foundation plan: type noted, soils reference if required
- Roof plan: pitch, drainage direction, attic ventilation

Launch all three concurrently. Each subagent reads the relevant PNGs and produces findings.

**For each finding, record:**
- `check`: What was checked
- `status`: PASS | FAIL | UNCLEAR | NOT_APPLICABLE
- `confidence`: HIGH | MEDIUM | LOW
- `observation`: What was actually seen on the plan (specific measured value or notation)
- `code_ref`: **Full citation required** — ordinance number, LDC section, and the specific standard being applied. Examples:
  - `"HOME Phase I, Ord. 20231207-001, §25-2-773(B)(6) — max building coverage 40%; plan shows 47%"`
  - `"HOME Phase II, Ord. 20240516-006, §25-2-779(F)(4)(a) — min front setback 10 ft; plan shows 8 ft"`
  - `"Austin LDC §25-2-492 — max 3 units per lot in SF-3; plan proposes 4 units"`
  - `"TX SB 15 (2025), Tex. Local Gov't Code §211.055(a)(2) — covered parking cannot be required for small lots"`
- `governing_phase`: PHASE_I | PHASE_II | IBC | IRC | TX_STATE | LDC
- `sheet_id` and `page_number`

**No `code_ref` = no correction.** A finding with a vague or missing code citation must be dropped before the corrections letter is generated.

Write all findings to `sheet_findings.json`.

---

## *** HUMAN PAUSE — PHASE 2 COMPLETE ***

After writing `sheet_findings.json`, **stop and present findings to the city staff reviewer**:

1. Print a concise findings table: check | status | confidence | sheet | observation
2. Highlight all FAIL and UNCLEAR items
3. Ask: **"Do you want to proceed to generate the corrections letter, or are there findings to add, remove, or modify first?"**

Wait for the reviewer's response before continuing to Phase 3.

---

### Phase 3: Code Verification (~60–90 sec)

After the reviewer confirms, launch two parallel subagents:

**3A — HOME Phase I/II Verification:**
- Load `references/home-phase-1.md` and `references/home-phase-2.md`
- Load `lot_classification.json` to confirm the governing phase
- For each FAIL and UNCLEAR finding, verify the `code_ref` citation is accurate against the governing phase's standards
- Cross-check: unit count limits, setback minimums, height allowances, lot coverage maximums, impervious cover limits, parking rules, minimum lot size
- If a finding's `code_ref` cites the wrong phase for this lot's size, correct it or drop the finding
- Write `home_compliance.json`

**3B — Texas State Law Verification:**
- Load `references/texas-state-law.md`
- Identify any findings that touch state-preempted topics (parking minimums, unit count, rental restrictions, HOA override provisions)
- Flag any city LDC provisions that may be preempted by state law
- Write `state_compliance.json`

### Phase 4: Draft Corrections Letter (~2 min)

Merge all inputs and generate the corrections letter:

1. For each finding, apply the filter:
   - Confirmed by code citation → **include** with citation
   - Confirmed but LOW visual confidence → include with `[VERIFY]` flag
   - No code basis found → **drop** (no false positives)
   - Structural/engineering adequacy → `[REVIEWER: ___]` blank for human
   - Preempted by state law → **do not cite** the local provision; note the state statute instead
   - HOME amendment now allows something that pre-HOME LDC would have failed → mark PASS, note HOME authorization

2. Write two outputs:
   - `draft_corrections.json` — structured, each item with code citation, HOME phase reference, confidence, reviewer_action
   - `draft_corrections.md` — formatted markdown corrections letter ready to present to the applicant

3. Write `review_summary.json` — stats on items found, confidence breakdown, HOME vs. state vs. IBC citations

### Phase 5: Present Results

After all phases complete, present to the reviewer:
- Summary: total items, breakdown by discipline and code basis (HOME Phase I, HOME Phase II, TX state, LDC, IBC/IRC)
- The full `draft_corrections.md` content
- Note which items carry `[VERIFY]` or `[REVIEWER]` flags
- List all output files written

## Key Rules

- **No false positives.** Drop findings without a confirmed code basis.
- **Reviewer blanks > AI guesses.** Use `[REVIEWER: ___]` for structural/engineering adequacy items.
- **Objective standards only.** Only cite measurable, quantitative standards. Never flag subjective design or aesthetic issues.
- **HOME preemption awareness.** If the HOME amendments now allow something that the base LDC would have failed, mark PASS and note the HOME authorization — do not generate a correction.
- **State preemption awareness.** If a local LDC provision conflicts with a Texas state statute, flag the conflict — state law prevails. Load `references/texas-state-law.md` to verify.
- **Two confidence dimensions.** Report both code confidence (is this legally required?) and visual confidence (am I reading the sheet correctly?).

## Reference Files

| File | Contents |
|------|----------|
| `references/home-phase-1.md` | Austin HOME Initiative Phase I — allowable uses, unit counts, setbacks, height, lot coverage, parking |
| `references/home-phase-2.md` | Austin HOME Initiative Phase II — additional amendments, effective dates, dimensional standards |
| `references/texas-state-law.md` | Applicable Texas state statutes affecting SFR zoning, parking, unit count, and preemption |
