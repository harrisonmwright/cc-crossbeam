# Smart Housing — Greenfield Multifamily

## At a Glance
| Field | Value |
|-------|-------|
| LDC Section | §25-1-501 through §25-1-519; §25-2 (MF district provisions) |
| Ordinance | No. 991202-J (Smart Housing base); MF-specific provisions amended Ord. 20031211-H |
| Incentive Type | Development Incentive (fee waivers, density bonus, expedited review) |
| Applicability | New multifamily residential development (greenfield or underutilized site) in MF-1 through MF-6 and commercial base districts; requires City Council Smart Housing designation |

## Incentives Granted
| Incentive | Value |
|-----------|-------|
| Density bonus | Up to 20% additional units over base district maximum |
| Parking reduction | 1.0 space per unit regardless of bedroom count (instead of §25-6 table) |
| Development fee waiver | City development fees waived |
| Expedited review | Priority processing at DSD |
| Front setback | Potential reduction to 10 ft (from standard requirements) |

## Affordability Requirements
| Parameter | Rental | Ownership |
|-----------|--------|-----------|
| Set-aside % | 10% of total units | 10% of total units |
| Max income limit | ≤80% MFI (min 5% of total at ≤60% MFI for enhanced tier) | ≤80% MFI |
| Affordability period | 10 years (standard); 40 years (enhanced) | 10 years (standard); 40 years (enhanced) |
| Fee-in-lieu | Not available |

**Math check:** `affordable_units / total_units ≥ 0.10`

For enhanced tier: additionally confirm ≥ 5% of total units at ≤60% MFI.

## Dimensional Standards Under Bonus
| Parameter | Smart Housing Greenfield MF Standard |
|-----------|-------------------------------------|
| Density bonus | Base district max units + 20% |
| Maximum height | Base district limit (no additional height) |
| Maximum FAR | Base district; density bonus may approach FAR cap — verify |
| Parking | 1.0 space per unit (flat rate, regardless of bedroom count) |
| Front setback | Potential reduction to 10 ft |
| Side/rear setbacks | Base district standards |
| Maximum lot coverage | Base district standards |

## Required Plan Elements
1. **Cover sheet:** "Smart Housing Greenfield — Multifamily" stated; LDC §25-1-501 cited; City Council resolution number; affordability tier declared (standard or enhanced)
2. **Project data table:** Total units, affordable units, set-aside %, income limit, affordability period, tenure type; density bonus calculation
3. **Affordability schedule:** Each affordable unit by ID, type, MFI tier, period
4. **Site plan:** Parking count per Smart Housing table (1.0/unit); setbacks labeled; FAR calculation
5. **Floor plans:** Affordable units individually labeled with MFI tier
6. **Elevations:** Maximum height from grade

## Key Compliance Checks
- [ ] City Council Smart Housing resolution number cited on cover sheet
- [ ] LDC §25-1-501 et seq. cited
- [ ] Standard or enhanced tier declared
- [ ] Affordable count ≥ 10% of total units — recompute from plan data
- [ ] For enhanced: confirm ≥ 5% of total units at ≤60% MFI separately labeled
- [ ] Income limit ≤ 80% MFI (standard) or ≤ 60% MFI for enhanced-tier units
- [ ] Affordability period: 10 years (standard) or 40 years (enhanced) — match to declared tier
- [ ] Density bonus correct: base max + 20% = bonus allowed; proposed ≤ bonus
- [ ] Parking: 1.0 space per unit (flat rate; verify total count = total units × 1.0, rounded up)
- [ ] No fee-in-lieu claimed (not available)
- [ ] Affordable units labeled on floor plans

## Notes
- Smart Housing Greenfield MF is rare for new projects; most recent affordable housing uses Affordability Unlocked or DB90 instead
- Enhanced tier (40-year affordability) unlocks greater incentives; verify tier matches affordability period on plans — a mismatch (e.g., 10 years stated but 40 years required for enhanced) is a FAIL
- Density bonus is unit-count based; if the base district has no explicit unit count maximum (only FAR), the 20% bonus is ambiguous — flag for [REVIEWER: confirm density bonus calculation methodology]
- Council resolution must pre-date the site plan application; if resolution date is after application date, flag as FAIL
