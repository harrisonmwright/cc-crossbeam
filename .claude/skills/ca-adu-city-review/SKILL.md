---
name: ca-adu-city-review
description: "City-side ADU plan review for any California city. Reviews a plan set (PDF or pre-extracted PNGs) sheet-by-sheet against CA state ADU law and city-specific amendments. Classifies the ADU type (detached, attached, JADU, above-garage conversion, multi-family) before review so the correct state standards are applied. Human-in-the-loop pause after findings — city staff confirm before the corrections letter is generated. Triggers on: 'Review this ADU plan set for [CA City]', 'Run the CA ADU city review on [path]', or 'ADU corrections letter for [City]'."
---

# CA ADU City Plan Review

Run a city-side ADU plan review for any California city. You are a city plan checker reviewing an ADU permit submittal for code compliance.

**In scope:** All California ADU types — detached, attached, Junior ADU (JADU), above-garage/accessory structure conversion, and multi-family ADU additions — on single-family, multi-family, and mixed-use lots.

## How to Invoke

The user provides:
1. **Plan binder** — either a PDF path or a directory of pre-extracted PNGs
2. **City name** — e.g., "Placentia", "Buena Park", "Long Beach"
3. (Optional) **Project address**

Example invocations:
- "Review this ADU plan set for Placentia: `test-assets/city-flow/mock-session/pages-png/`"
- "Run the CA ADU city review on `path/to/plans.pdf` for Long Beach"
- "ADU corrections letter for Buena Park — `path/to/pages-png/`"

## Input Resolution

**If a directory of PNGs** (e.g., `pages-png/page-01.png`, `page-02.png`, ...):
- Use directly. Skip PDF extraction.
- Check for pre-existing `sheet-manifest.json` in the same directory or parent. If found, load it and skip manifest building.
- Check for pre-existing `title-blocks/` directory. If found, use those for manifest building.

**If a PDF file**:
- Check if `pdftoppm` is installed: `which pdftoppm`
- If not: `brew install poppler` (macOS) or tell the user to install it
- Extract pages: create a `pages-png/` directory next to the PDF and run:
  ```
  pdftoppm -png -r 200 "<input.pdf>" "<output-dir>/pages-png/page"
  ```
- Outputs will be `page-01.png`, `page-02.png`, etc.

## Output Directory

Create `demo-output/ca-adu-city-<city>-<timestamp>/` in the workspace root. All output files go here.

---

## Workflow

### Phase 1: Sheet Manifest (~30–60 sec)

Follow the `adu-targeted-page-viewer` skill workflow:

1. Read page 1 (cover sheet) visually. Extract the sheet index.
2. If page count matches index count, map 1:1 in order.
3. If mismatch, read title blocks to resolve (crop bottom-right 20% of each page, or use pre-cropped title blocks if available).
4. Write `sheet-manifest.json` to the output directory.

---

### Phase 1.5: Lot + ADU Classification (~30 sec)

Before launching review subagents, read the site plan and cover sheet to extract the key lot and project data that determines which CA state ADU standards apply. This step must complete before Phase 2 begins — the classification is passed to all subagents.

**Extract from plans:**
- `lot_type`: SINGLE_FAMILY | MULTI_FAMILY | MIXED_USE
- `lot_area_sqft`: Total lot area in square feet
- `existing_dwelling_count`: Number of dwelling units on the lot before the proposed ADU
- `adu_type_proposed`: DETACHED | ATTACHED | JADU | ABOVE_GARAGE_CONVERSION | MULTI_FAMILY_CONVERSION
- `adu_sqft_proposed`: Proposed ADU floor area (square feet)
- `is_new_construction`: Yes / No (distinguishes new structure from conversion of existing space)

**Apply the ADU type classification:**

| ADU Type | Key Governing Statute | Size Limits | Notes |
|----------|-----------------------|-------------|-------|
| JADU | Gov. Code § 66333 | ≤500 sq ft | Must be within existing SFR structure; separate entrance required; efficiency kitchen allowed |
| Detached (new construction) | Gov. Code § 66314 | 850 sq ft (studio/1BR) / 1,000 sq ft (2+ BR) | 4 ft min rear + side setbacks; height up to 16 ft standard (up to 25 ft within ½ mi of transit) |
| Attached (addition to primary) | Gov. Code § 66314 | Up to 50% of existing primary or 1,200 sq ft | Must share at least one wall with primary |
| Above-garage / accessory structure conversion | Gov. Code § 66314(c) | Existing footprint | No new setbacks imposed on existing nonconforming structure |
| Multi-family conversion (interior non-livable space) | Gov. Code § 66315 | Up to 25% of existing units; min 1 per building | Non-livable space converted (storage, laundry, offices) |
| Multi-family detached (on multi-family lot) | Gov. Code § 66315 | Up to 2 detached ADUs | 4 ft setbacks apply |

**Determine which state law sections govern — pass to all subagents:**
- All types → base statutes Gov. Code § 66310–66342
- JADU → additionally flag § 66333 specific rules (owner-occupancy, separate entrance, size cap)
- Multi-family → additionally flag § 66315 (conversion rules, detached ADU count)

**Write `lot_classification.json`:**
```json
{
  "lot_type": "SINGLE_FAMILY",
  "lot_area_sqft": 7200,
  "existing_dwelling_count": 1,
  "adu_type_proposed": "DETACHED",
  "adu_sqft_proposed": 850,
  "is_new_construction": true,
  "governing_statutes": ["Gov. Code § 66314"],
  "setback_minimum_ft": 4,
  "height_maximum_ft": 16,
  "size_maximum_sqft": 850,
  "classification_confidence": "HIGH",
  "classification_notes": ""
}
```

If lot area or ADU type cannot be read from the plans, record `"classification_confidence": "LOW"` and flag it as the first FAIL item — the review accuracy depends on correct classification.

---

### Phase 2: Sheet-by-Sheet Review (~3–5 min)

Load `lot_classification.json` before launching subagents. Pass `adu_type_proposed`, `governing_statutes`, `setback_minimum_ft`, `height_maximum_ft`, and `size_maximum_sqft` to all three subagents so each applies the correct standard set.

Review sheets in parallel using subagents. Group by discipline:

**Subagent A — Administrative + Architectural:**
- Cover sheet (CS): stamps, signatures, governing codes list, sheet index accuracy, project data (address, APN, zoning, proposed ADU type, proposed square footage)
- Floor plan (A-series): ADU floor area (sq ft), room labels, bathroom fixture count, separate entrance shown (required for JADU per § 66333(a)(3)), egress window in sleeping room, minimum ceiling height (7 ft per CRC R305)

**Subagent B — Site + Civil:**
- Site plan: setbacks from all property lines (compare to `setback_minimum_ft` from classification), lot coverage %, impervious cover %, existing primary dwelling footprint shown, ADU footprint shown, utility connections shown; flag separate utility service meter if city is requiring it for JADU (prohibited by state law for JADUs — § 66333(b)(3))
- Grading/drainage: slopes shown, drainage direction, "For Reference Only" stamp if present

**Subagent C — Elevations + Fire/Life Safety:**
- Elevations: ADU height from natural grade (compare to `height_maximum_ft`), fire separation if < 5 ft from property line (1-hour rated wall required per CBC § 705), no new windows within 5 ft of property line, roof form shown
- Building sections: wall assembly, insulation values (Title 24 energy compliance), foundation-to-wall connection

Launch all three concurrently. Each subagent reads the relevant PNGs and produces findings.

**For each finding, record:**
- `check`: What was checked
- `status`: PASS | FAIL | UNCLEAR | NOT_APPLICABLE
- `confidence`: HIGH | MEDIUM | LOW
- `observation`: What was actually seen on the plan (specific measured value or notation)
- `code_ref`: **Full citation required** — CA statute or municipal code section + the specific standard being tested + the measured/stated value vs. the required value. Examples:
  - `"Gov. Code § 66314(c)(2) — detached ADU max height 16 ft from natural grade; plan shows 18 ft — exceeds state maximum"`
  - `"Gov. Code § 66333(a)(3) — JADU must have separate entrance from primary; no separate entrance shown on floor plan A-1"`
  - `"[City] Municipal Code § X.X.X — [local amendment]; plan shows X ft, code requires X ft"`
- `sheet_id` and `page_number`

**No `code_ref` = no correction.** A finding with a vague or missing code citation must be dropped before the corrections letter is generated.

Write all findings to `sheet_findings.json`.

---

## *** HUMAN PAUSE — PHASE 2 COMPLETE ***

After writing `sheet_findings.json`, **stop and present findings to the city staff reviewer**:

1. Print a concise findings table: `check | status | confidence | sheet | observation`
2. Highlight all FAIL and UNCLEAR items
3. Ask: **"Do you want to proceed to generate the corrections letter, or are there findings to add, remove, or modify first?"**

Wait for the reviewer's response before continuing to Phase 3.

---

### Phase 3: Code Verification (~60–90 sec)

After the reviewer confirms, launch two parallel subagents:

**3A — State Law Verification:**
- Load reference files from `adu-skill-development/skill/california-adu/references/`
- Load `lot_classification.json` to confirm the ADU type and governing statutes
- For each FAIL and UNCLEAR finding, verify the `code_ref` citation is accurate for this ADU type
- Check for ADU-specific exceptions: setback waivers for conversions, prohibited conditions (parking requirements for JADU, utility hookup fees for JADU, design standards beyond objective standards per § 66314(b)(1))
- If a finding's code_ref cites the wrong standard for this ADU type, correct it or drop the finding
- Write `state_compliance.json`

**3B — City Rules:**
- Check if `adu-skill-development/skill/<city-slug>-adu/` exists
  - **If yes** (onboarded city): Load the city skill reference files. Fast, offline.
  - **If no**: Run the `adu-city-research` skill — Discovery (WebSearch) then Extraction (WebFetch)
- Check findings against city-specific amendments, standard details, IBs
- Flag any city rule that is more restrictive than state ADU law — state law prevails (note the conflict; do not cite the preempted city rule as enforceable)
- Write `city_compliance.json`

---

### Phase 4: Draft Corrections Letter (~2 min)

Merge all inputs and generate the corrections letter:

1. For each finding, apply the filter:

| Finding State | Action |
|--------------|--------|
| Confirmed by code citation | Include with full citation |
| Confirmed but LOW visual confidence | Include with `[VERIFY]` flag |
| No code basis found | Drop (no false positives) |
| Structural/engineering adequacy | `[REVIEWER: ___]` blank for human |
| Subjective design issue | Drop (prohibited per Gov. Code § 66314(b)(1)) |
| City rule preempted by state | Cite the state standard; note the conflict |

2. Write two outputs:
   - `draft_corrections.json` — structured, each item with code citation, confidence, reviewer_action
   - `draft_corrections.md` — formatted markdown corrections letter ready to present to the applicant

3. Write `review_summary.json` — stats on items found, confidence breakdown, code basis breakdown (state vs. city)

### Phase 5: Present Results

After all phases complete, present to the reviewer:
- Summary: total items, breakdown by code basis (state law vs. city code) and discipline
- The full `draft_corrections.md` content
- `[VERIFY]` items called out separately with explanation
- `[REVIEWER]` items called out separately
- List all output files written

---

## Key Rules

- **No false positives.** Drop findings without a confirmed code basis. Missing a real issue is preferable to flagging a non-issue.
- **Reviewer blanks > AI guesses.** For structural and engineering adequacy items, use `[REVIEWER: ___]` instead of guessing.
- **Objective standards only.** ADUs can only be subject to objective, measurable standards (Gov. Code § 66314(b)(1)). Never flag subjective design or aesthetic issues.
- **State preemption.** If a city rule is more restrictive than state law, flag the conflict — state law prevails. Do not write the correction as if the preempted city rule is enforceable.
- **ADU type governs standards.** The classification from Phase 1.5 determines which standards apply. A JADU rule does not apply to a detached ADU. Do not mix standards across ADU types.
- **Two confidence dimensions.** Report both code confidence (is this legally required?) and visual confidence (am I reading the plan correctly?).
- **Human pause is non-negotiable.** Do not skip the Phase 2 pause. The plan checker's name goes on this letter.

---

## City Onboarding Convention

City-specific reference files follow a predictable structure. To derive the city slug: lowercase the city name, replace spaces with hyphens (e.g., "Long Beach" → `long-beach`).

Each onboarded city has files at `adu-skill-development/skill/<city-slug>-adu/`. To onboard a new city, use the `ca-adu-city-onboarding` skill — it provides the required file structure, templates, and a step-by-step workflow.

**Onboarded cities:**
| City | Slug | Path |
|------|------|------|
| Placentia | `placentia` | `adu-skill-development/skill/placentia-adu/` |
| Buena Park | `buena-park` | `adu-skill-development/skill/buena-park-adu/` |

For any city not listed above, run the `adu-city-research` skill to research local rules dynamically.

---

## Sub-Skills Referenced

| Skill | Location | Role |
|-------|----------|------|
| `adu-targeted-page-viewer` | `adu-skill-development/skill/adu-targeted-page-viewer/` | PDF extraction + sheet manifest |
| `california-adu` | `adu-skill-development/skill/california-adu/` | State law (28 reference files, Gov. Code § 66310–66342) |
| `adu-city-research` | `.claude/skills/adu-city-research/` | Web research for non-onboarded cities |
| `placentia-adu` | `adu-skill-development/skill/placentia-adu/` | Placentia-specific rules (onboarded) |
| `buena-park-adu` | `adu-skill-development/skill/buena-park-adu/` | Buena Park-specific rules (onboarded) |

---

## Test Data

| Test Set | City | Path |
|----------|------|------|
| 1232 N Jefferson | Placentia | `test-assets/city-flow/mock-session/pages-png/` (15 pages, title blocks in `../title-blocks/`) |
| Same project | Placentia | `test-assets/01-extract-test/pages-png/` (15 pages, same project) |
