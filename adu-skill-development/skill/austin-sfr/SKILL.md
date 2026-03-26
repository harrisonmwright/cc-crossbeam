---
name: austin-sfr
description: "Austin city-layer reference package for single-family residential plan review. Contains the HOME Initiative amendments (Phase I and II) that govern 1–3 unit residential development on SF-zoned lots. Loaded by demo-austin-sfr-review during Phase 3 code verification, on top of the texas-sfr state layer."
---

# Austin SFR — City Layer

This is the Austin city-specific reference package for residential plan review. It is loaded by **`demo-austin-sfr-review`** during Phase 3 code verification, after the `texas-sfr` state layer has been applied.

**Layer order:**
1. `texas-sfr/` — Texas state law (SB 15, SB 840, HB 24, IRC/IBC baseline)
2. `austin-sfr/` ← this layer — Austin HOME Initiative amendments
3. Austin LDC base district rules (embedded in the review workflow)

---

## What This Layer Covers

The HOME Initiative is Austin's primary policy context for 1–3 unit SFR development. It allows up to 3 dwelling units by right on SF-zoned lots and enables small-lot SFR on lots as small as 1,800 sq ft.

| Phase | Ordinance | Effective | Key Change |
|-------|-----------|-----------|-----------|
| HOME Phase I | Ord. 20231207-001 | Dec 2023 | Up to 3 units by right on SF-1/SF-2/SF-3 lots ≥5,750 sq ft |
| HOME Phase II | Ord. 20240516-006 | May 2024 | Small-lot SFR on lots as small as 1,800 sq ft; reduces setbacks and width minimums |

---

## Governing Phase Decision Tree

| Lot Area | Governing Phase | Governing Section |
|----------|-----------------|-------------------|
| ≥5,750 sq ft | PHASE_I | §25-2-773 — up to 3 units |
| 1,800–5,749 sq ft | PHASE_II | §25-2-779 — 1 unit only (small lot SFR) |
| <1,800 sq ft | NON_COMPLIANT | Fails HOME minimum lot size |

---

## Reference Files

| File | Contents |
|------|----------|
| `references/home-phase-1.md` | HOME Phase I — allowable uses, unit counts, setbacks, height, lot coverage, FAR, parking |
| `references/home-phase-2.md` | HOME Phase II — small lot SFR, additional amendments, effective dates, dimensional standards |

---

## Preemption Note

Austin HOME is generally **more permissive** than SB 15 (Texas state floor). In most cases, Austin HOME governs because it allows smaller lots and narrower lots than SB 15 requires. See `texas-sfr/references/preemption-guide.md` for the full comparison table.

The one area where SB 15 preempts local rules: **covered parking requirements on small lots** — HOME Phase I/II do not explicitly address this, but SB 15 §211.055(a)(2) prohibits requiring covered parking on lots ≤4,000 sq ft.
