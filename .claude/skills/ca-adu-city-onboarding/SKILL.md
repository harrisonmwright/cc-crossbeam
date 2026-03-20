---
name: ca-adu-city-onboarding
description: "Onboards a new California city into the ca-adu-city-review skill by creating the required city-specific reference files in adu-skill-development/skill/. Uses the adu-city-research skill to gather local ordinance content, then generates local-amendments.md, submittal-requirements.md, and a city SKILL.md from built-in templates. Triggers on: 'Onboard [City] for ADU review', 'Add [City] to the city review skill', or 'Create city files for [City]'."
---

# ADU City Onboarding

Onboard a new California city into the `ca-adu-city-review` skill. The output is a complete `<city-slug>-adu/` directory that the review skill loads during Phase 3B code verification — making future reviews for this city fast and offline.

## How to Invoke

The user provides:
1. **City name** — e.g., "Long Beach", "Santa Monica", "Fresno"
2. (Optional) **Municipal code URL** — if the user already has a link to the city's ADU ordinance

Example invocations:
- "Onboard Long Beach for ADU review"
- "Add Santa Monica to the city review skill"
- "Create city files for Fresno: `https://fresno.gov/municipal-code/...`"

---

## Output Location

All files are created at:
```
adu-skill-development/skill/<city-slug>-adu/
```

City slug = city name lowercased, spaces replaced with hyphens:
- "Long Beach" → `long-beach-adu`
- "Santa Monica" → `santa-monica-adu`
- "San Jose" → `san-jose-adu`

---

## Workflow

### Step 1: Research the City's ADU Rules

Run the `adu-city-research` skill in full mode (all three modes sequentially):
1. **Discovery** — WebSearch to find the city's ADU ordinance, municipal code chapter, and permit portal
2. **Targeted Extraction** — WebFetch to pull content from the discovered URLs
3. **Browser Fallback** — if needed for cities with difficult websites

Collect:
- ADU ordinance number and effective date
- Municipal code title/chapter governing ADUs
- Any local amendments that differ from CA state defaults (setbacks, heights, fees, design standards)
- Permit submittal checklist (what sheets and data are required)
- Any city-published standard details or information bulletins (IBs)

---

### Step 2: Create the Directory and Files

Create the directory `adu-skill-development/skill/<city-slug>-adu/` with three files:

#### SKILL.md

```markdown
---
name: <city-slug>-adu
description: "ADU regulations for [City Name], CA. Loaded by ca-adu-city-review during Phase 3B code verification."
---

# [City Name] ADU Rules

**Jurisdiction:** [City Name], [County] County, CA
**Municipal Code:** [Link or citation]
**ADU Ordinance:** [Ord. XXXX, adopted MM/DD/YYYY]
**Last Verified:** [Date]

## Key Local Amendments

[Summary — how this city differs from CA state ADU defaults. Focus on deviations only.]

## Reference Files

Load during Phase 3B:
- `references/local-amendments.md`
- `references/submittal-requirements.md`
- `references/standard-details.md` (if it exists)
```

#### references/local-amendments.md

Document every local rule that deviates from CA state ADU law defaults. For each topic, note the local value, the state default, and whether the local rule is state-compliant (cities cannot impose more restrictive rules than state law in most cases):

```markdown
# [City Name] — Local ADU Amendments

**Source:** [Municipal Code chapter] + [Ordinance number]
**Effective Date:** [MM/DD/YYYY]

## Setbacks
- State default: 4 ft rear and side for detached ADUs
- [City] rule: [cite § and value]
- State compliant? [Yes / No — if No, state law prevails]

## Height
- State default: 16 ft (up to 25 ft within ½ mi of transit)
- [City] rule: [cite § and value]
- State compliant? [Yes / No]

## Size Limits
- State defaults: 850 sq ft (studio/1BR), 1,000 sq ft (2+ BR), 500 sq ft (JADU)
- [City] rule: [cite § and value]
- State compliant? [Yes / No]

## Parking
- State: no parking required for ADUs within ½ mi of transit, for JADUs, or for conversions
- [City] rule: [cite § and value]
- State compliant? [Yes / No]

## Owner-Occupancy
- State: cities may not impose owner-occupancy requirements after Jan 1, 2025 (AB 1033)
- [City] rule: [cite § if any]
- State compliant? [Yes / No]

## Design Standards
- State: only objective standards permitted (Gov. Code § 66314(b)(1))
- [City] objective standards: [list — materials, roof pitch, window placement, etc.]
- Subjective standards found? [List any — these are unenforceable]

## Fees
- State: no impact fees for ADUs ≤750 sq ft; proportional for larger
- [City] fee schedule: [amounts and code section]
- State compliant? [Yes / No]

## Other Local Provisions
[Anything not covered above — utility connection requirements, design review, HOA provisions, etc.]
```

#### references/submittal-requirements.md

Document what the city requires at ADU permit submittal:

```markdown
# [City Name] — ADU Permit Submittal Requirements

**Source:** [Link to city's checklist or code section]
**Last Verified:** [Date]

## Required Plan Sheets

- [ ] Cover sheet — required data: [list fields city requires]
- [ ] Site plan — required annotations: [setbacks dimensioned, lot coverage %, utility connections, etc.]
- [ ] Floor plan(s) — [city-specific requirements]
- [ ] Elevations — [how many sides, specific callouts]
- [ ] Building sections — [requirements]
- [ ] Title 24 energy compliance — [form required: CF1R, CF2R, etc.]
- [ ] Soils report — [required / not required / conditional]

## Required Stamps/Signatures
[List — licensed architect, civil engineer, structural engineer, etc.]

## Cover Sheet Data Table
[List every field the city requires on the cover sheet project data table]

## City-Specific Notes
[Any unusual requirements not covered above]
```

---

### Step 3: Register the City

After creating the files, add the city to the **Onboarded cities** table in `ca-adu-city-review/SKILL.md`:

```markdown
| [City Name] | `<city-slug>` | `adu-skill-development/skill/<city-slug>-adu/` |
```

---

### Step 4: Confirm

Report to the user:
- Files created (list paths)
- Key findings from research: any city rules that differ from state defaults, any unenforceable local provisions found
- Any gaps where content could not be verified from available sources (flag these for manual review)

---

## Quality Rules

- **State compliance check on every local rule.** If a city rule is more restrictive than state law, flag it in the amendments file — the review skill will not cite preempted rules.
- **No fabrication.** If a rule cannot be found through research, leave the field blank and note "Not found — verify manually." Do not invent code sections.
- **Date everything.** Local ordinances change. Every file must include the date last verified.
- **Cite the source.** Every local rule should include the municipal code section number, not just the rule text.
