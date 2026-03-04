# UNO (Post-2014) — University Neighborhood Overlay

## At a Glance
| Field | Value |
|-------|-------|
| LDC Section | §25-2-773 (UNO provisions, post-2014 version) |
| Ordinance | No. 20140213-151 (2014 UNO amendment, effective March 2014); amended Ord. 20180322-004 |
| Incentive Type | Density Bonus (University Neighborhood Overlay combining district) |
| Applicability | Properties within the University Neighborhood Overlay (-UNO); post-2014 version applies to projects with site plan applications filed on or after March 2014 |

## Incentives Granted (Post-2014 Version)
| Incentive | Standard Value | Bonus Value |
|-----------|---------------|-------------|
| Maximum height | Base district limit (typically 40–60 ft) | Up to 60 ft (Tier 1); up to 90 ft (Tier 2); up to 120 ft (Tier 3) |
| FAR | Base district limit | Up to 4:1 (Tier 1); up to 6:1 (Tier 2); up to 8:1 (Tier 3) |
| Parking | Per §25-6 | 1.0 space/unit (Tier 1/2); 0.5 spaces/unit (Tier 3) |
| Setbacks | Base district minimums | Front: 0 ft at UNO frontages |

## Affordability Requirements (Post-2014)

Post-2014 UNO calculates affordable housing by **units** (not bedrooms, unlike pre-2014):

**Tier 1 (up to 60 ft / 4:1 FAR):**
| Parameter | Rental | Ownership |
|-----------|--------|-----------|
| Set-aside % | 10% of total units | 10% of total units |
| Max income limit | ≤80% MFI | ≤80% MFI |
| Affordability period | 40 years | 40 years |

**Tier 2 (up to 90 ft / 6:1 FAR):**
| Parameter | Rental | Ownership |
|-----------|--------|-----------|
| Set-aside % | 12% of total units | 12% of total units |
| Max income limit | ≤80% MFI (min 2% at ≤60% MFI) | ≤80% MFI (min 2% at ≤60% MFI) |
| Affordability period | 40 years | 40 years |

**Tier 3 (up to 120 ft / 8:1 FAR):**
| Parameter | Rental | Ownership |
|-----------|--------|-----------|
| Set-aside % | 15% of total units | 15% of total units |
| Max income limit | ≤80% MFI (min 5% at ≤60% MFI) | ≤80% MFI (min 5% at ≤60% MFI) |
| Affordability period | 40 years | 40 years |

**Math check (post-2014):**
- Tier 1: `affordable_units / total_units ≥ 0.10`
- Tier 2: total affordable ≥ 12% AND ≥ 2% at ≤60% MFI
- Tier 3: total affordable ≥ 15% AND ≥ 5% at ≤60% MFI

Fee-in-lieu: Available at HCD-set rate per unit (rate varies by tier).

## Dimensional Standards Under Bonus
| Parameter | Tier 1 | Tier 2 | Tier 3 |
|-----------|--------|--------|--------|
| Maximum height | 60 ft | 90 ft | 120 ft |
| Maximum FAR | 4:1 | 6:1 | 8:1 |
| Front setback | 0 ft at UNO frontage | 0 ft | 0 ft |
| Parking | 1.0 space/unit | 1.0 space/unit | 0.5 space/unit |

## Required Plan Elements
1. **Cover sheet:** "UNO" or "University Neighborhood Overlay" stated; Ord. 20140213-151 cited (post-2014 version); tier declared (Tier 1, 2, or 3)
2. **Project data table:** Total units, affordable units, set-aside % by MFI tier, affordability period, tenure type; height and FAR labeled
3. **Affordability schedule:** Each affordable unit by ID, type, MFI tier (60% MFI units separately identified for Tier 2/3), period
4. **Site plan:** Height labeled; FAR calculation; parking count (total spaces ÷ total units to verify rate); setbacks labeled
5. **Floor plans:** Affordable units labeled with MFI tier; 60% MFI units distinguished from 80% MFI units for Tier 2/3
6. **Elevations:** Maximum height from natural grade

## Key Compliance Checks
- [ ] Property within UNO combining district (zoning includes -UNO)
- [ ] Post-2014 UNO ordinance (Ord. 20140213-151) cited — not pre-2014 provisions
- [ ] Tier declared (Tier 1, 2, or 3)
- [ ] Affordable calculation uses **units** (not bedrooms) — verify denominator is total units
- [ ] Affordable unit count meets tier threshold — recompute from plan data
- [ ] For Tier 2: confirm ≥ 2% of total units at ≤60% MFI separately labeled
- [ ] For Tier 3: confirm ≥ 5% of total units at ≤60% MFI separately labeled
- [ ] Income limit ≤ 80% MFI (base); ≤ 60% MFI for tiered units as required
- [ ] Affordability period ≥ 40 years
- [ ] Height ≤ tier maximum (60/90/120 ft)
- [ ] FAR ≤ tier maximum (4/6/8:1)
- [ ] Parking rate correct per tier (1.0/unit for T1/T2; 0.5/unit for T3)
- [ ] If fee-in-lieu: documentation present; do not compute amount
- [ ] Affordable units labeled on floor plans (with MFI tiers for Tier 2/3)

## Notes
- Post-2014 UNO is the current version; if plans reference UNO without specifying version, assume post-2014 for projects with recent site plan filings
- If plans use bedroom-based calculation or 65% MFI income limit, the project may be using pre-2014 UNO standards — see `uno-pre-2014.md`
- Tier 3 (120 ft) requires extensive community outreach documentation; the plan set should reference the community meeting summary — flag for [REVIEWER: verify community outreach documentation]
- Building adjacency standards may apply in certain areas of the UNO near single-family neighborhoods; flag for [REVIEWER: verify compatibility standards]
- UNO parking reductions (especially Tier 3 at 0.5/unit) are significant; verify parking count on site plan matches the rate for the declared tier
