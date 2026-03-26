# Downtown Density Bonus (DDB)

## At a Glance
| Field | Value |
|-------|-------|
| LDC Section | §25-2-586 (Downtown Subdistrict provisions); Downtown Austin Plan overlay |
| Ordinance | No. 20130815-105 (Downtown Austin Plan adoption); amended Ord. 20141211-198 |
| Incentive Type | Density Bonus (Downtown Austin Plan subdistricts) |
| Applicability | Properties within the Downtown Austin Plan area (bounded roughly by Lamar Blvd, 15th St, IH-35, and Town Lake); governed by CBD and DMU base districts |

## Incentives Granted
| Incentive | Standard Value | Bonus Value |
|-----------|---------------|-------------|
| Maximum FAR | 8:1 base (CBD) | Up to 15:1 bonus FAR |
| Height | Governed by view corridors and subdistrict caps | Increased per Community Benefits points earned |
| Setbacks | Per CBD/DMU base district | Potential modifications through design standard compliance |
| Ground floor activation | Required | Required; ground floor active use standard |
| Parking | Per §25-6 | Reductions available based on subdistrict and proximity to transit |

## Affordability Requirements
The Downtown Density Bonus uses a Community Benefits system. Affordable housing is one of several eligible community benefits.

| Parameter | Value |
|-----------|-------|
| Affordable housing option | On-site affordable units OR fee-in-lieu |
| Set-aside for max bonus | 10% of residential units at ≤80% MFI (on-site) |
| Fee-in-lieu rate | Set by DSD/HCD; amount depends on bonus FAR requested |
| Affordability period | 40 years (on-site units) |
| Income limit | ≤80% MFI for on-site affordable units |

**Math check (if on-site units selected):** `affordable_units / total_residential_units ≥ 0.10`

Alternative community benefits (non-affordability): Historic preservation, green building, public art, pedestrian amenities — these may substitute for or supplement affordability depending on points earned.

## Dimensional Standards Under Bonus
| Parameter | Standard |
|-----------|---------|
| Base FAR | 8:1 (CBD); lower in DMU subdistricts |
| Maximum bonus FAR | Up to 15:1 depending on subdistrict and community benefits points earned |
| Height | Governed by subdistrict; view corridor restrictions apply; no single absolute cap |
| Ground floor active use | Required for all buildings fronting designated streets; minimum 75% of street frontage |
| Setbacks | Per subdistrict standards; generally no setback required in CBD |
| Parking | Maximums apply in transit-priority areas; minimums per §25-6 reduced by proximity |

## Required Plan Elements
1. **Cover sheet:** "Downtown Density Bonus" or "DDB" stated; reference to Downtown Austin Plan and applicable subdistrict; LDC section cited
2. **Community Benefits summary:** List of community benefits claimed and point values; if affordable housing claimed, set-aside % and MFI tier
3. **Project data table:** Total residential units (if any), affordable units, % set-aside, MFI tier, affordability period; gross floor area by use; bonus FAR calculation
4. **FAR calculation exhibit:** Base FAR, bonus FAR requested, community benefits points earned; must show math
5. **Ground floor plan:** Active use shown at all designated street frontages; use labeled (retail, restaurant, lobby, etc.)
6. **Affordability schedule:** If on-site affordable units claimed, each unit listed by ID, floor, type, MFI tier, period
7. **Site plan:** Building footprint, lot area, FAR calculation inputs labeled

## Key Compliance Checks
- [ ] Property confirmed within Downtown Austin Plan area (zoning designation is CBD or DMU)
- [ ] Subdistrict identified on cover sheet
- [ ] Bonus FAR ≤ maximum for subdistrict (up to 15:1)
- [ ] Community benefits points earned ≥ points required for bonus FAR tier requested
- [ ] If affordable housing selected: affordable count ≥ 10% of residential units at ≤80% MFI
- [ ] Affordability period ≥ 40 years if on-site units
- [ ] If fee-in-lieu: documentation present; do not compute amount (reviewer blank)
- [ ] Ground floor active use shown at designated street frontages (≥75% frontage coverage)
- [ ] View corridor compliance: building massing does not penetrate protected view corridors (review subdistrict map)

## Notes
- The Downtown Density Bonus is a points-based system, not a simple percentage-based bonus; the affordable housing component competes with other community benefits for points
- If the project elects fee-in-lieu rather than on-site units, no affordable unit review applies to the plan set — only confirm fee-in-lieu documentation is present
- View corridor restrictions are subdistrict-specific; this skill does not evaluate view corridor compliance (requires GIS analysis) — flag as [REVIEWER: verify view corridor compliance]
- Ground floor active use depth minimum: 20 ft measured from the street-facing façade
- Projects in the Rainey Street subdistrict follow the Rainey Street overlay rules in addition to DDB — see `rainey-street.md`
