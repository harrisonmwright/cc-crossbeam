# Smart Housing (General)

## At a Glance
| Field | Value |
|-------|-------|
| LDC Section | §25-1-501 through §25-1-519 (Smart Housing program) |
| Ordinance | No. 991202-J (original Smart Housing); amended multiple times through 2010 |
| Incentive Type | Development Incentive (fee waivers, expedited review, density bonuses) |
| Applicability | Projects meeting Smart Housing affordability thresholds; applies across zoning districts; requires City Council designation as Smart Housing project |

## Incentives Granted
| Incentive | Value |
|-----------|-------|
| Development fee waiver | City development-related fees waived (building permit fees, utility connection fees, inspection fees) |
| Expedited plan review | Priority processing at DSD |
| Density bonus | Up to 20% additional units over base district limit |
| Parking reduction | Reduced parking per §25-6 Smart Housing table |
| Setback reductions | Potential setback reductions depending on project type |

## Affordability Requirements

Smart Housing uses a point/tier system based on depth and breadth of affordability:

| Requirement Level | Min % Affordable | Max Income | Affordability Period |
|------------------|-----------------|------------|---------------------|
| Minimum (fee waivers only) | 10% of units | ≤80% MFI | 5 years |
| Standard (fee waivers + density) | 10% of units | ≤80% MFI (min 5% at ≤60% MFI) | 10 years |
| Enhanced (full incentives) | 20% of units | ≤60% MFI | 40 years |

**Math check:** `affordable_units / total_units ≥ declared_percentage`

Fee-in-lieu: **Not available** under Smart Housing — all affordable units must be on-site.

Note: Smart Housing projects require City Council designation before incentives apply; the plan set should reference the Council resolution number.

## Dimensional Standards Under Bonus
| Parameter | Smart Housing Standard |
|-----------|----------------------|
| Density bonus | Up to 20% additional units over base district maximum unit count |
| Height | No height bonus (density bonus is unit-count based, not height based) |
| FAR | Per base district; density bonus may push FAR beyond base limit — verify |
| Parking | Per Smart Housing parking table (§25-1-513) — typically 1.0 spaces per unit regardless of unit type |
| Setbacks | Potential reduction up to 20% from base minimums for Enhanced tier |

## Required Plan Elements
1. **Cover sheet:** "Smart Housing" stated; LDC §25-1-501 et seq. cited; City Council resolution number cited; affordability tier declared
2. **Project data table:** Total units, affordable units, set-aside %, income limit, affordability period, tenure type; density bonus calculation (base max units, 20% bonus, total allowed)
3. **Affordability schedule:** Each affordable unit by ID, type, MFI tier, period
4. **Site plan:** Parking count per Smart Housing table; setbacks labeled (with reduction noted if claimed)
5. **Floor plans:** Affordable units individually labeled with MFI tier
6. **Council resolution reference:** Resolution number confirming Smart Housing designation

## Key Compliance Checks
- [ ] City Council Smart Housing resolution number cited on cover sheet
- [ ] LDC §25-1-501 et seq. cited
- [ ] Affordability tier declared
- [ ] Affordable count meets declared tier threshold — recompute from plan data
- [ ] Income limit correct per tier (80% MFI minimum; 60% MFI for enhanced)
- [ ] Affordability period matches tier (5, 10, or 40 years)
- [ ] Density bonus calculation correct: base max + 20% = bonus allowed; proposed count ≤ bonus allowed
- [ ] Parking per Smart Housing table (§25-1-513)
- [ ] No fee-in-lieu claimed (not available)
- [ ] Affordable units labeled on floor plans

## Notes
- Smart Housing is one of Austin's older programs; many projects were approved in the 1990s–2010s. New Smart Housing designations are uncommon — if reviewing a new project claiming Smart Housing, verify with HCD that a current Council resolution exists
- The 5-year affordability period for the minimum tier is significantly shorter than other programs; ensure the correct period is stated on plans
- Smart Housing density bonus is unit-count based (not FAR or height based); the base district's unit count cap applies before the 20% bonus
- Fee waivers are administered separately from DSD — plan review does not need to verify fee amounts; flag for [REVIEWER: verify fee waivers applied at permit issuance]
- For single-family Smart Housing, see `smart-greenfield-sf.md`; for multifamily greenfield projects, see `smart-greenfield-mf.md`
