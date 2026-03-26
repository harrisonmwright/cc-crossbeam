# TOD Development Bonus — Transit-Oriented Development

## At a Glance
| Field | Value |
|-------|-------|
| LDC Section | §25-2-658 |
| Ordinance | No. 20141211-199 (TOD combining district and density bonus) |
| Incentive Type | Density Bonus (TOD Combining District) |
| Applicability | Properties within an approved TOD combining district (-TOD), typically within ¼ mile of an approved or planned Capital Metro rail station or rapid bus station; TOD combining district must be approved via zoning case |

## Incentives Granted
| Incentive | Standard Value | Bonus Value |
|-----------|---------------|-------------|
| Maximum height | Base district limit | Up to 120 ft (or per TOD station area plan) |
| FAR | Base district limit | Up to 5.0 (or per TOD station area plan) |
| Parking | Per §25-6 | Significantly reduced or waived depending on TOD subzone |
| Setbacks | Base district minimums | Reduced; front setback may be 0 ft at transit street frontage |
| Ground floor | Optional | Active pedestrian-oriented use required at transit street frontage in some subzones |

## Affordability Requirements
| Parameter | Rental | Ownership |
|-----------|--------|-----------|
| Set-aside % | 10% of total residential units | 10% of total residential units |
| Max income limit | ≤80% MFI | ≤80% MFI |
| Affordability period | 40 years | 40 years |
| Fee-in-lieu | Available at HCD-set rate |

**Math check:** `affordable_units / total_residential_units ≥ 0.10`

Some TOD station areas require higher set-asides per the station area plan — verify with the specific station area plan if applicable.

## Dimensional Standards Under Bonus
Standards are station-area-plan-specific. General ranges:

| TOD Subzone | Max Height | Max FAR | Parking Requirement |
|-------------|-----------|---------|---------------------|
| Core (within 500 ft of station) | 120 ft | 5.0 | Waived or 0.5 spaces/unit max |
| Secondary (500–1,320 ft) | 90 ft | 4.0 | 0.5–1.0 spaces/unit |
| General (1,320 ft–¼ mile) | 60 ft | 3.0 | 1.0 spaces/unit |

*Confirm subzone from the applicable station area plan.*

## Required Plan Elements
1. **Cover sheet:** "TOD Development Bonus" stated; LDC §25-2-658 cited; -TOD combining district shown in zoning designation; station name and distance shown; TOD subzone identified
2. **Project data table:** Total residential units, affordable units, set-aside %, income limit, affordability period, tenure type; FAR and height calculations
3. **Affordability schedule:** Each affordable unit by ID, type, MFI tier, period
4. **Site plan:** Building footprint; distance to transit station labeled or noted; height labeled; FAR calculation exhibit; parking count shown; setbacks labeled per TOD subzone
5. **Ground floor plan:** Active use shown at transit street frontage if required by subzone
6. **Floor plans:** Affordable units individually labeled
7. **Elevations:** Maximum height from natural grade; ground floor use at transit frontage shown

## Key Compliance Checks
- [ ] Property within TOD combining district (zoning includes -TOD)
- [ ] LDC §25-2-658 cited on cover sheet
- [ ] Station name and approximate distance to station noted on plans
- [ ] TOD subzone identified (Core, Secondary, or General)
- [ ] Affordable count ≥ 10% of residential units — recompute from plan data
- [ ] Income limit ≤ 80% MFI
- [ ] Affordability period ≥ 40 years
- [ ] Proposed height ≤ subzone maximum
- [ ] Proposed FAR ≤ subzone maximum
- [ ] Parking count consistent with subzone standards (waived/reduced in Core; partial reduction in Secondary)
- [ ] Ground floor active use shown at transit frontage if subzone requires it
- [ ] If fee-in-lieu: documentation present; do not compute amount
- [ ] Affordable units individually labeled on floor plans

## Notes
- TOD combining district is approved via a standalone zoning case; the skill trusts user declaration of TOD eligibility
- Station area plans vary significantly; if the project references a specific station area plan, load the plan's dimensional standards before reviewing — the numbers in this reference file are general defaults
- Capital Metro Project Connect may create new TOD zones; verify station status (approved vs. planned vs. funded) is consistent with TOD eligibility
- Parking waiver in Core subzone applies to spaces required under §25-6; any voluntarily provided parking must comply with design standards
- Mixed-use TOD projects: ground floor active use requirement applies to the street frontage facing the transit street, not all sides of the building
