# PUD Density Bonus — Planned Unit Development

## At a Glance
| Field | Value |
|-------|-------|
| LDC Section | §25-2-492 (PUD base); §25-2-507 (PUD density bonus provisions) |
| Ordinance | PUD-specific ordinances vary by project; PUD density bonus framework established in Ord. 20050519-Z-11 |
| Incentive Type | Density Bonus (within approved PUD zoning) |
| Applicability | Lots within an approved PUD zoning district; PUD must include density bonus provisions in its approved zoning ordinance; each PUD has its own negotiated standards |

## Incentives Granted
PUD density bonuses are individually negotiated and codified in the project's adopting ordinance. General incentive types:

| Incentive | Typical Range |
|-----------|--------------|
| Height | Above base zoning limit, per PUD ordinance |
| FAR | Above base zoning limit, per PUD ordinance |
| Unit count | Increased over base zoning, per PUD ordinance |
| Setbacks | May be modified per PUD site plan |
| Parking | May be reduced per PUD ordinance |

**CRITICAL:** The PUD adopting ordinance governs all dimensional standards — not the LDC base district. This reference file provides a framework only; the actual standards must be read from the project's PUD ordinance.

## Affordability Requirements
PUD affordability requirements are project-specific and negotiated at time of PUD zoning approval. Common framework:

| Parameter | Typical PUD Requirement |
|-----------|------------------------|
| Set-aside % | Negotiated; commonly 5–15% of residential units |
| Max income limit | Negotiated; commonly 60–80% MFI |
| Affordability period | Negotiated; commonly 40 years |
| Fee-in-lieu | Per PUD ordinance — may or may not be available |

**Math check:** `affordable_units / total_units ≥ PUD_required_percentage`

The required percentage must be extracted from the PUD adopting ordinance and `program_data.json`.

## Dimensional Standards Under Bonus
**All standards are PUD-specific.** The plan set must reference:
1. The PUD adopting ordinance number
2. The specific section of the PUD ordinance governing density bonus
3. The dimensional standards (height, FAR, setbacks, parking) as stated in the PUD ordinance

This reference file does not contain numeric standards because they vary by PUD.

## Required Plan Elements
1. **Cover sheet:** "PUD Density Bonus" stated; PUD ordinance number cited; LDC §25-2-492 cited; PUD case number shown
2. **PUD compliance exhibit or note:** Confirming compliance with PUD density bonus provisions; citing specific PUD ordinance sections
3. **Project data table:** Total units, affordable units, set-aside %, income limit, affordability period, tenure type — all per PUD ordinance
4. **Affordability schedule:** Each affordable unit by ID, type, MFI tier, period — consistent with PUD ordinance
5. **Site plan:** Dimensional standards labeled per PUD ordinance; note "per PUD Ord. No. XXXXXXXXX-XXX" on dimensions
6. **Floor plans:** Affordable units individually labeled
7. **Elevations:** Maximum height labeled; note "per PUD Ord. No." on height call-out

## Key Compliance Checks
- [ ] PUD adopting ordinance number cited on cover sheet
- [ ] PUD zoning case number cited
- [ ] LDC §25-2-492 cited
- [ ] Affordable count meets PUD-required percentage — recompute from plan data; compare to PUD ordinance
- [ ] Income limit matches PUD ordinance requirement
- [ ] Affordability period matches PUD ordinance requirement
- [ ] Proposed height ≤ PUD ordinance limit
- [ ] Proposed FAR ≤ PUD ordinance limit
- [ ] Parking meets PUD ordinance standard (not base LDC §25-6)
- [ ] Affordable units individually labeled on floor plans

## Notes
- **This program requires reading the PUD adopting ordinance** — without it, compliance review for dimensional standards is not possible; flag for [REVIEWER: PUD ordinance required for dimensional review]
- If the plan set does not include or reference the PUD ordinance number, record as FAIL immediately — the review cannot proceed without it
- Affordability Unlocked (§25-2-656) explicitly does NOT apply to PUD districts per §25-2-656(A)(1) — if a developer claims Affordability Unlocked on a PUD lot, that is a FAIL
- PUD sites frequently have multiple phases or parcels with different standards; confirm which phase/parcel the submitted plans apply to
- Some PUDs were approved before current density bonus programs existed; they may have outdated affordability standards; the PUD ordinance governs regardless of what current LDC sections say
