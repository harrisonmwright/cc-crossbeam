const {
  Document, Packer, Paragraph, TextRun, Table, TableRow, TableCell,
  Header, Footer, AlignmentType, HeadingLevel, BorderStyle, WidthType,
  ShadingType, VerticalAlign, PageNumber, LevelFormat, PageBreak
} = require('docx');
const fs = require('fs');

const border = { style: BorderStyle.SINGLE, size: 1, color: "CCCCCC" };
const cellBorders = { top: border, bottom: border, left: border, right: border };
const noBorder = { style: BorderStyle.NONE, size: 0, color: "FFFFFF" };
const noBorders = { top: noBorder, bottom: noBorder, left: noBorder, right: noBorder };

function h1(text) {
  return new Paragraph({ heading: HeadingLevel.HEADING_1, children: [new TextRun(text)] });
}
function h2(text) {
  return new Paragraph({ heading: HeadingLevel.HEADING_2, children: [new TextRun(text)] });
}
function body(children, opts = {}) {
  return new Paragraph({ spacing: { after: 120 }, ...opts, children });
}
function bold(text) { return new TextRun({ text, bold: true }); }
function normal(text) { return new TextRun({ text }); }
function italic(text) { return new TextRun({ text, italics: true, color: "555555" }); }
function code(text) { return new TextRun({ text, font: "Courier New", size: 20, color: "1A5276" }); }

function labelRow(label, value) {
  return new TableRow({
    children: [
      new TableCell({
        borders: noBorders,
        width: { size: 2200, type: WidthType.DXA },
        children: [body([bold(label)])]
      }),
      new TableCell({
        borders: noBorders,
        width: { size: 7160, type: WidthType.DXA },
        children: [body([normal(value)])]
      })
    ]
  });
}

function correctionBlock(num, tag, title, code_ref, text, verify = false, reviewer = false) {
  const tagColor = tag === "FAIL" ? "C0392B" : tag === "VERIFY" ? "884EA0" : "1A5276";
  const tagLabel = reviewer ? "REVIEWER" : tag;

  return [
    new Paragraph({
      spacing: { before: 240, after: 80 },
      children: [
        new TextRun({ text: `Item ${num}  `, bold: true, size: 24 }),
        new TextRun({ text: `[${tagLabel}]  `, bold: true, color: tagColor, size: 22 }),
        new TextRun({ text: title, bold: true, size: 22 })
      ]
    }),
    body([italic("Code: "), code(code_ref)], { indent: { left: 360 } }),
    body([normal(text)], { indent: { left: 360 }, spacing: { after: 200 } })
  ];
}

function statusRow(check, standard, finding, status) {
  const statusColor = status === "PASS" ? "1E8449" : status === "VERIFY" ? "884EA0" : "C0392B";
  return new TableRow({
    children: [
      new TableCell({ borders: cellBorders, width: { size: 2800, type: WidthType.DXA },
        children: [new Paragraph({ spacing: { before: 60, after: 60 }, children: [normal(check)] })] }),
      new TableCell({ borders: cellBorders, width: { size: 3000, type: WidthType.DXA },
        children: [new Paragraph({ spacing: { before: 60, after: 60 }, children: [italic(standard)] })] }),
      new TableCell({ borders: cellBorders, width: { size: 2360, type: WidthType.DXA },
        children: [new Paragraph({ spacing: { before: 60, after: 60 }, children: [normal(finding)] })] }),
      new TableCell({ borders: cellBorders, width: { size: 800, type: WidthType.DXA },
        shading: { fill: status === "PASS" ? "D5F5E3" : "FDEDEC", type: ShadingType.CLEAR },
        verticalAlign: VerticalAlign.CENTER,
        children: [new Paragraph({ alignment: AlignmentType.CENTER, spacing: { before: 60, after: 60 },
          children: [new TextRun({ text: status, bold: true, color: statusColor, size: 18 })] })] })
    ]
  });
}

const doc = new Document({
  numbering: {
    config: [
      { reference: "bullets",
        levels: [{ level: 0, format: LevelFormat.BULLET, text: "•", alignment: AlignmentType.LEFT,
          style: { paragraph: { indent: { left: 720, hanging: 360 } } } }] }
    ]
  },
  styles: {
    default: { document: { run: { font: "Arial", size: 22 } } },
    paragraphStyles: [
      { id: "Heading1", name: "Heading 1", basedOn: "Normal", next: "Normal", quickFormat: true,
        run: { size: 28, bold: true, color: "1A3A5C", font: "Arial" },
        paragraph: { spacing: { before: 320, after: 160 }, outlineLevel: 0,
          border: { bottom: { style: BorderStyle.SINGLE, size: 1, color: "CCCCCC", space: 4 } } } },
      { id: "Heading2", name: "Heading 2", basedOn: "Normal", next: "Normal", quickFormat: true,
        run: { size: 24, bold: true, color: "2E4057", font: "Arial" },
        paragraph: { spacing: { before: 240, after: 120 }, outlineLevel: 1 } }
    ]
  },
  sections: [{
    properties: {
      page: { margin: { top: 1080, right: 1080, bottom: 1080, left: 1080 } }
    },
    headers: {
      default: new Header({
        children: [
          new Table({
            columnWidths: [6300, 3060],
            rows: [new TableRow({
              children: [
                new TableCell({ borders: noBorders, width: { size: 6300, type: WidthType.DXA },
                  children: [
                    new Paragraph({ children: [new TextRun({ text: "City of Austin — Development Services Department", bold: true, size: 20, color: "1A3A5C" })] }),
                    new Paragraph({ children: [new TextRun({ text: "Residential Plan Check", size: 18, color: "666666" })] })
                  ]}),
                new TableCell({ borders: noBorders, width: { size: 3060, type: WidthType.DXA },
                  verticalAlign: VerticalAlign.CENTER,
                  children: [new Paragraph({ alignment: AlignmentType.RIGHT, children: [
                    new TextRun({ text: "DRAFT CORRECTIONS LETTER", bold: true, size: 18, color: "C0392B" })
                  ]})]})
              ]
            })]
          }),
          new Paragraph({ spacing: { after: 0 }, border: { bottom: { style: BorderStyle.SINGLE, size: 2, color: "1A3A5C" } }, children: [] })
        ]
      })
    },
    footers: {
      default: new Footer({
        children: [
          new Paragraph({ border: { top: { style: BorderStyle.SINGLE, size: 1, color: "CCCCCC" } },
            alignment: AlignmentType.CENTER, spacing: { before: 80 },
            children: [
              new TextRun({ text: "Page ", size: 18, color: "888888" }),
              new TextRun({ children: [PageNumber.CURRENT], size: 18, color: "888888" }),
              new TextRun({ text: " of ", size: 18, color: "888888" }),
              new TextRun({ children: [PageNumber.TOTAL_PAGES], size: 18, color: "888888" }),
              new TextRun({ text: "   |   2406 Euclid Avenue, Austin TX — HOME Phase I Plan Check — 2026-03-01", size: 16, color: "AAAAAA" })
            ]
          })
        ]
      })
    },
    children: [

      // Title block
      new Paragraph({ spacing: { before: 120, after: 80 }, children: [
        new TextRun({ text: "Residential Plan Check — Corrections Letter", bold: true, size: 36, color: "1A3A5C" })
      ]}),

      // Project info table
      new Table({
        columnWidths: [2200, 7160],
        margins: { top: 60, bottom: 60, left: 120, right: 120 },
        rows: [
          labelRow("Project Address:", "2406 Euclid Avenue, Austin, TX 78722"),
          labelRow("Legal Description:", "Lot 2, Block 2, Laprelle Place Extension  |  Tax ID: 305495"),
          labelRow("Zoning:", "SF-3-NP (Dawson Neighborhood Plan)"),
          labelRow("Proposed Use:", "Two-Unit Residential (HOME Phase I, §25-2-773)"),
          labelRow("Governing Ordinance:", "HOME Phase I — Ord. 20231207-001"),
          labelRow("Plan Set Stamp:", "10.25.2023  |  Heidi Goebel Architect, #12843"),
          labelRow("Review Date:", "2026-03-01"),
        ]
      }),

      new Paragraph({ spacing: { before: 120, after: 160 }, children: [
        new TextRun({ text: "The above-referenced permit application has been reviewed for compliance with the Austin Land Development Code (LDC), HOME Initiative Phase I (Ord. 20231207-001), and the 2021 IRC as locally adopted. The following corrections are required prior to approval. Please resubmit with a written response to each item.", size: 20, color: "333333" })
      ]}),
      body([
        italic("Items marked "),
        new TextRun({ text: "[VERIFY]", bold: true, color: "884EA0" }),
        italic(" require confirmation on the full-size plan set. Items marked "),
        new TextRun({ text: "[REVIEWER]", bold: true, color: "1A5276" }),
        italic(" require determination by City staff.")
      ], { spacing: { after: 200 } }),

      // Section 1
      h1("Section 1 — Administrative Corrections"),

      ...correctionBlock(1, "FAIL", "Lot area inconsistency across submittal documents",
        "Austin LDC §25-1-21 — lot area must be determined by licensed survey; all permit documents must reflect the same verified measurement.",
        "The permit application (page 4) states lot area = 7,330 sq ft. The site development data table states 7,730 sq ft — a discrepancy of 400 sq ft on the same submittal. Revise all documents to reflect a single, consistent lot area reconciled to the recorded plat or a current licensed survey. Note: both values exceed the 5,750 sq ft Phase I threshold, so the governing HOME phase (§25-2-773) is not affected. However, the correct lot area is critical for all FAR calculations (see Items 3 and 4)."),

      ...correctionBlock(2, "FAIL", "Use type must be designated as Two-Unit Residential",
        "HOME Phase I, Ord. 20231207-001, §25-2-773 — Two-Unit Residential use governs; Austin LDC §25-2-901 (Accessory Apartments) repealed by Ord. 20231207-001.",
        "The submittal title blocks describe the project as \"House w/ Habitable Attic\" with a separate ADU — framing consistent with the former Accessory Apartment use under §25-2-901, which was repealed by HOME Phase I. Two dwelling units on a single SF-3 lot now constitute Two-Unit Residential use under §25-2-773, regardless of how the units are described. Revise all title blocks, the permit application, and the Subchapter F GFA exhibits to explicitly designate the use type as Two-Unit Residential and confirm that all §25-2-773 development standards are applied to both structures."),

      // Section 2
      h1("Section 2 — Floor Area Ratio / GFA Corrections"),

      ...correctionBlock(3, "FAIL", "ADU (Unit 2) GFA calculation not submitted",
        "HOME Phase I, Ord. 20231207-001, §25-2-773(E) — within Subchapter F compatibility area, each unit in a Two-Unit Residential development must individually not exceed the greater of 0.4 FAR or 2,300 sq ft. Austin LDC Subchapter F §3.3.",
        "The Subchapter F GFA calculation form (pages 7–8) covers Unit 1 (the house) only. No GFA calculation has been submitted for Unit 2 (the ADU). Under §25-2-773(E), each unit's GFA must be verified individually. Provide a Subchapter F GFA exhibit for the ADU following Subchapter F §3.3 methodology. Confirm ADU GFA does not exceed the greater of 0.4 × [verified lot area] or 2,300 sq ft. Using the lower lot area (7,330 sq ft): per-unit maximum = 2,932 sq ft."),

      ...correctionBlock(4, "FAIL", "Combined site GFA not calculated",
        "HOME Phase I, Ord. 20231207-001, §25-2-773(E) — within Subchapter F compatibility area, Two-Unit Residential: site maximum GFA is the greater of 0.55 FAR or 3,200 sq ft.",
        "No combined site GFA exhibit has been submitted. The Subchapter F forms address Unit 1 only; Unit 2 GFA is unknown and the sum of both units has not been compared to the §25-2-773(E) site maximum. Using the lower lot area (7,330 sq ft): site maximum = 4,031 sq ft (greater of 0.55 × 7,330 or 3,200 sq ft). Provide a combined Subchapter F GFA summary showing Unit 1 GFA + Unit 2 GFA vs. the site maximum. Resolve Item 1 (lot area) first, as the correct lot area controls all FAR calculations."),

      // Section 3
      h1("Section 3 — Architectural / Design Corrections"),

      ...correctionBlock(5, "FAIL", "ADU lacks a street-facing entrance",
        "HOME Phase I, Ord. 20231207-001, §25-2-773(C) — minimum 1 street-facing entrance required.",
        "The ADU's north elevation (facing Euclid Avenue — the primary street) does not show an entry door (sheet p.3b2). The ADU's primary entry appears on the east elevation, accessed by an exterior stair on the interior side yard. An interior side-yard entry does not constitute a street-facing entrance toward Euclid Avenue. Provide a street-facing entry door on the north elevation of the ADU. [VERIFY: If a compliant entry exists but was not legible at reduced scale, confirm on the full-size drawings and provide a note.]"),

      // Section 4
      h1("Section 4 — Items Requiring Field Verification"),

      body([new TextRun({ text: "The following items appear potentially compliant but could not be confirmed at the scale of plans reviewed. Provide a written response noting the sheet and dimension confirming compliance, or provide revised drawings if not compliant.", size: 20, color: "444444" })], { spacing: { after: 160 }}),

      ...correctionBlock(6, "VERIFY", "Unit 1 (House) per-unit GFA — near maximum limit",
        "HOME Phase I, Ord. 20231207-001, §25-2-773(E) — per-unit maximum: greater of 0.4 FAR or 2,300 sq ft.",
        "The Subchapter F GFA form shows Unit 1 FAR at approximately 39.86%. Using the lower lot area (7,330 sq ft): house GFA ≈ 2,922 sq ft vs. per-unit maximum ≈ 2,932 sq ft — a margin of ~10 sq ft, within reduced-sheet reading tolerance. Confirm the exact Unit 1 GFA on the full-size Subchapter F form. Note: if the verified lot area is 7,730 sq ft, the per-unit maximum becomes 3,092 sq ft and this is a clear pass.", true),

      ...correctionBlock(7, "VERIFY", "Front yard impervious cover percentage not shown",
        "HOME Phase I, Ord. 20231207-001, §25-2-773(B) — maximum front yard impervious cover: 40%.",
        "A separate calculation of impervious cover within the front yard (between the front setback line and the Euclid Ave property line) is not visible on the submitted plans. Provide: (1) front yard area in sq ft, (2) impervious area within the front yard in sq ft, and (3) the resulting percentage. Confirm this does not exceed 40%.", true),

      ...correctionBlock(8, "VERIFY", "Front setback — house dimension not confirmed",
        "HOME Phase I, Ord. 20231207-001, §25-2-773(B) — minimum front yard setback: 15 ft.",
        "The front setback of the house from the Euclid Avenue (north) property line is not clearly dimensioned at the scale reviewed. Confirm on the full-size site plan (p.1a) that the setback from the front lot line to the nearest exterior wall of the house is ≥ 15 ft.", true),

      ...correctionBlock(9, "VERIFY", "Rear setback — ADU dimension not confirmed",
        "HOME Phase I, Ord. 20231207-001, §25-2-773(B) — minimum rear setback: 5 ft if adjacent to alley.",
        "The alley along the south property line is confirmed on the site plan, triggering the 5 ft minimum rear setback exception under §25-2-773(B). The exact dimension from the ADU's south wall to the south property line is not legible at scale. Confirm on the full-size site plan that the ADU rear setback is ≥ 5 ft from the south (alley-adjacent) property line.", true),

      ...correctionBlock(10, "VERIFY", "Side / street-side setback condition not confirmed",
        "HOME Phase I, Ord. 20231207-001, §25-2-773(B) — corner lot: Level 1 street ≥ greater of 5 ft from PL or 10 ft from curb; Level 2–4 street ≥ 10 ft from PL. SF-3 interior side: 5 ft.",
        "The ADU ground floor plan (p.2b) notes '5' Street Side Setback' and '20' Front Street-Side Setback.' Confirm whether the lot is a corner lot or interior lot. If corner: verify the street-side setback meets the applicable Phase I minimum per street classification. If interior: confirm all side setbacks are ≥ 5 ft. Clearly dimension all setbacks on the full-size site plan.", true),

      ...correctionBlock(11, "VERIFY", "Front porch setback from front lot line not confirmed",
        "HOME Phase I, Ord. 20231207-001, §25-2-773(C) — porch ≥ 15 ft from front lot line; porch roof/overhang ≥ 13 ft.",
        "The house north elevation shows a covered front porch projecting toward Euclid Avenue. The porch-to-lot-line dimension is not shown at scale. Confirm on the full-size site plan that: (1) the porch floor is ≥ 15 ft from the north lot line, and (2) the porch roof/overhang is ≥ 13 ft from the north lot line.", true),

      ...correctionBlock(12, "VERIFY", "Parking spaces in front/street yard — count not confirmed",
        "HOME Phase I, Ord. 20231207-001, §25-2-773(B) — maximum 4 parking spaces in front or street yard (combined for corner lots).",
        "The number of parking spaces within the front or street yard is not confirmed at scale. Confirm on the full-size site plan that the total parking spaces within the front yard and/or street yard does not exceed 4.", true),

      // Section 5
      h1("Section 5 — For City Reviewer Determination"),

      ...correctionBlock(13, "REVIEWER", "Structural design adequacy",
        "2021 IBC Chapter 16 (structural loads), Chapter 18 (soils and foundations), Chapter 23 (wood frame construction).",
        "Structural engineering documents (S200–S400, Greensmith Engineering, PE-stamped 10/27/23) show reinforced concrete footings with embedded plate connections, LVL beams, floor trusses at 24\" o.c., CS-WSP shear walls, and lateral bracing for seismic Category A / 115 mph wind. Texas PE seal is present on all structural sheets. Adequacy of the foundation system for actual site soil conditions requires review by the City's structural plan checker.", false, true),

      // Confirmed compliant
      new Paragraph({ pageBreakBefore: true, heading: HeadingLevel.HEADING_1, children: [new TextRun("Items Confirmed Compliant")] }),

      body([new TextRun({ text: "The following items were reviewed and found to comply. No corrections required.", size: 20, color: "444444" })], { spacing: { after: 160 } }),

      new Table({
        columnWidths: [2800, 3000, 2360, 800],
        margins: { top: 60, bottom: 60, left: 120, right: 120 },
        rows: [
          new TableRow({
            tableHeader: true,
            children: [
              new TableCell({ borders: cellBorders, width: { size: 2800, type: WidthType.DXA },
                shading: { fill: "1A3A5C", type: ShadingType.CLEAR },
                children: [new Paragraph({ children: [new TextRun({ text: "Item", bold: true, color: "FFFFFF", size: 20 })] })] }),
              new TableCell({ borders: cellBorders, width: { size: 3000, type: WidthType.DXA },
                shading: { fill: "1A3A5C", type: ShadingType.CLEAR },
                children: [new Paragraph({ children: [new TextRun({ text: "Standard", bold: true, color: "FFFFFF", size: 20 })] })] }),
              new TableCell({ borders: cellBorders, width: { size: 2360, type: WidthType.DXA },
                shading: { fill: "1A3A5C", type: ShadingType.CLEAR },
                children: [new Paragraph({ children: [new TextRun({ text: "Finding", bold: true, color: "FFFFFF", size: 20 })] })] }),
              new TableCell({ borders: cellBorders, width: { size: 800, type: WidthType.DXA },
                shading: { fill: "1A3A5C", type: ShadingType.CLEAR },
                children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: "Status", bold: true, color: "FFFFFF", size: 20 })] })] }),
            ]
          }),
          statusRow("Building coverage", "HOME I §25-2-773(B) ≤ 40%", "~29.88%", "PASS"),
          statusRow("Total impervious cover", "HOME I §25-2-773(B) ≤ 45%", "~37.98%", "PASS"),
          statusRow("House height", "SF-3 base district ≤ 35 ft", "30'-2\"", "PASS"),
          statusRow("ADU height", "SF-3 base district ≤ 35 ft", "25'-5\"", "PASS"),
          statusRow("Street-facing entry — house", "HOME I §25-2-773(C)", "North elev. entry ✓", "PASS"),
          statusRow("Habitable attic GFA method", "Subchapter F §3.3.4 A/B", "514 sf per methodology ✓", "PASS"),
          statusRow("ADU garage placement", "HOME I §25-2-773(B)", "Faces alley, not front yard ✓", "PASS"),
          statusRow("Egress windows", "2021 IRC R310", "All bedrooms labeled ✓", "PASS"),
          statusRow("Smoke/CO alarms", "2021 IRC R314/R315", "Noted in plan notes ✓", "PASS"),
          statusRow("Architect stamp", "Texas Occ. Code §1051.701", "Heidi Goebel #12843 ✓", "PASS"),
          statusRow("Structural PE stamp", "Texas Occ. Code §1001", "Greensmith Engineering ✓", "PASS"),
        ]
      }),

      // Summary
      h1("Summary"),

      new Table({
        columnWidths: [5500, 3860],
        margins: { top: 60, bottom: 60, left: 120, right: 120 },
        rows: [
          new TableRow({ children: [
            new TableCell({ borders: cellBorders, width: { size: 5500, type: WidthType.DXA },
              children: [new Paragraph({ children: [bold("Hard corrections required (Items 1–5)")] })] }),
            new TableCell({ borders: cellBorders, width: { size: 3860, type: WidthType.DXA },
              shading: { fill: "FDEDEC", type: ShadingType.CLEAR },
              children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: "5", bold: true, color: "C0392B", size: 24 })] })] })
          ]}),
          new TableRow({ children: [
            new TableCell({ borders: cellBorders, width: { size: 5500, type: WidthType.DXA },
              children: [new Paragraph({ children: [bold("[VERIFY] items (Items 6–12)")] })] }),
            new TableCell({ borders: cellBorders, width: { size: 3860, type: WidthType.DXA },
              shading: { fill: "F4ECF7", type: ShadingType.CLEAR },
              children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: "7", bold: true, color: "884EA0", size: 24 })] })] })
          ]}),
          new TableRow({ children: [
            new TableCell({ borders: cellBorders, width: { size: 5500, type: WidthType.DXA },
              children: [new Paragraph({ children: [bold("[REVIEWER] blanks (Item 13)")] })] }),
            new TableCell({ borders: cellBorders, width: { size: 3860, type: WidthType.DXA },
              children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: "1", bold: true, size: 24 })] })] })
          ]}),
          new TableRow({ children: [
            new TableCell({ borders: cellBorders, width: { size: 5500, type: WidthType.DXA },
              children: [new Paragraph({ children: [bold("Confirmed compliant")] })] }),
            new TableCell({ borders: cellBorders, width: { size: 3860, type: WidthType.DXA },
              shading: { fill: "D5F5E3", type: ShadingType.CLEAR },
              children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: "11", bold: true, color: "1E8449", size: 24 })] })] })
          ]}),
          new TableRow({ children: [
            new TableCell({ borders: cellBorders, width: { size: 5500, type: WidthType.DXA },
              children: [new Paragraph({ children: [bold("State law preemption triggered")] })] }),
            new TableCell({ borders: cellBorders, width: { size: 3860, type: WidthType.DXA },
              shading: { fill: "D5F5E3", type: ShadingType.CLEAR },
              children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: "None", bold: true, color: "1E8449", size: 24 })] })] })
          ]}),
          new TableRow({ children: [
            new TableCell({ borders: cellBorders, width: { size: 5500, type: WidthType.DXA },
              children: [new Paragraph({ children: [bold("HOME Phase II applicable")] })] }),
            new TableCell({ borders: cellBorders, width: { size: 3860, type: WidthType.DXA },
              shading: { fill: "D5F5E3", type: ShadingType.CLEAR },
              children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: "No (lot ≥ 5,750 sq ft)", bold: true, color: "1E8449", size: 24 })] })] })
          ]}),
        ]
      }),

      body([new TextRun({ text: "Priority before resubmittal: ", bold: true })],
        { spacing: { before: 240, after: 60 } }),
      new Paragraph({ numbering: { reference: "bullets", level: 0 },
        children: [new TextRun("Item 1 — Resolve lot area discrepancy (controls all FAR limits)")] }),
      new Paragraph({ numbering: { reference: "bullets", level: 0 },
        children: [new TextRun("Items 3 & 4 — Submit ADU GFA calculation and combined site GFA summary")] }),
      new Paragraph({ numbering: { reference: "bullets", level: 0 },
        children: [new TextRun("Item 5 — Add street-facing entry to ADU north elevation")] }),
      new Paragraph({ numbering: { reference: "bullets", level: 0 },
        spacing: { after: 200 },
        children: [new TextRun("Item 2 — Update all title blocks and application to Two-Unit Residential use type")] }),

      body([italic("This letter was generated as a draft plan check review using the Austin HOME Phase I (Ord. 20231207-001) and applicable LDC/IRC standards. All findings are subject to final determination by a licensed City of Austin plan reviewer.")],
        { spacing: { before: 240, after: 80 } })
    ]
  }]
});

Packer.toBuffer(doc).then(buf => {
  fs.writeFileSync("demo-output/austin-sfr-review-2406euclid/corrections-letter.docx", buf);
  console.log("Written: corrections-letter.docx");
});
