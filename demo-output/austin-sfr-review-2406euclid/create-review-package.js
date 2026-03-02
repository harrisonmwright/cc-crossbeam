const {
  Document, Packer, Paragraph, TextRun, Table, TableRow, TableCell,
  Header, Footer, AlignmentType, HeadingLevel, BorderStyle, WidthType,
  ShadingType, VerticalAlign, PageNumber, LevelFormat, PageBreak
} = require('docx');
const fs = require('fs');

// ── colours & helpers ──────────────────────────────────────────────────────
const NAVY  = "1A3A5C";
const GREEN = "1E8449";
const RED   = "C0392B";
const AMBER = "B7770D";
const PURPLE= "884EA0";
const GRAY  = "555555";

const border  = { style: BorderStyle.SINGLE, size: 1, color: "CCCCCC" };
const hdrBorder = { style: BorderStyle.SINGLE, size: 1, color: "888888" };
const cellB   = { top: border, bottom: border, left: border, right: border };
const hdrCellB= { top: hdrBorder, bottom: hdrBorder, left: hdrBorder, right: hdrBorder };
const noB     = { style: BorderStyle.NONE, size: 0, color: "FFFFFF" };
const noBord  = { top: noB, bottom: noB, left: noB, right: noB };

const t  = (text, opts={}) => new TextRun({ text: String(text), ...opts });
const b  = (text) => t(text, { bold: true });
const it = (text, color=GRAY) => t(text, { italics: true, color });
const mono = (text) => t(text, { font: "Courier New", size: 18, color: NAVY });

function p(children, opts={}) {
  const arr = Array.isArray(children) ? children : [children];
  return new Paragraph({ spacing: { after: 80 }, ...opts, children: arr });
}
function h1(text) { return new Paragraph({ heading: HeadingLevel.HEADING_1, children: [t(text)] }); }
function h2(text) { return new Paragraph({ heading: HeadingLevel.HEADING_2, children: [t(text)] }); }
function spacer() { return new Paragraph({ spacing: { after: 120 }, children: [] }); }

function statusColor(s) {
  if (s === "PASS")    return GREEN;
  if (s === "FAIL")    return RED;
  if (s === "UNCLEAR") return AMBER;
  if (s === "VERIFY")  return PURPLE;
  return GRAY;
}
function statusFill(s) {
  if (s === "PASS")    return "D5F5E3";
  if (s === "FAIL")    return "FDEDEC";
  if (s === "UNCLEAR") return "FEF9E7";
  return "F4ECF7";
}

function cell(children, width, opts={}) {
  const arr = Array.isArray(children) ? children : [children];
  return new TableCell({
    borders: cellB,
    width: { size: width, type: WidthType.DXA },
    ...opts,
    children: arr.map(c => c instanceof Paragraph ? c : p([c], { spacing: { before: 60, after: 60 } }))
  });
}
function hdrCell(text, width, fill=NAVY) {
  return new TableCell({
    borders: hdrCellB,
    width: { size: width, type: WidthType.DXA },
    shading: { fill, type: ShadingType.CLEAR },
    verticalAlign: VerticalAlign.CENTER,
    children: [p([t(text, { bold: true, color: "FFFFFF", size: 19 })], { spacing: { before: 60, after: 60 } })]
  });
}
function statusCell(status, width) {
  const color = statusColor(status);
  const fill  = statusFill(status);
  return new TableCell({
    borders: cellB,
    width: { size: width, type: WidthType.DXA },
    shading: { fill, type: ShadingType.CLEAR },
    verticalAlign: VerticalAlign.CENTER,
    children: [p([t(status, { bold: true, color, size: 18 })], { alignment: AlignmentType.CENTER, spacing: { before: 60, after: 60 } })]
  });
}

function infoTable(rows) {
  // rows = [[label, value], ...]
  return new Table({
    columnWidths: [2400, 7680],
    margins: { top: 60, bottom: 60, left: 120, right: 120 },
    rows: rows.map(([label, value]) => new TableRow({ children: [
      new TableCell({ borders: noBord, width: { size: 2400, type: WidthType.DXA },
        children: [p([b(label)], { spacing: { before: 40, after: 40 } })] }),
      new TableCell({ borders: noBord, width: { size: 7680, type: WidthType.DXA },
        children: [p([t(String(value))], { spacing: { before: 40, after: 40 } })] })
    ]}))
  });
}

// ── load data ──────────────────────────────────────────────────────────────
const BASE = "demo-output/austin-sfr-review-2406euclid";
const summary  = JSON.parse(fs.readFileSync(`${BASE}/review_summary.json`));
const lot      = JSON.parse(fs.readFileSync(`${BASE}/lot_classification.json`));
const manifest = JSON.parse(fs.readFileSync(`${BASE}/sheet-manifest.json`));
const findings = JSON.parse(fs.readFileSync(`${BASE}/sheet_findings.json`));
const homeComp = JSON.parse(fs.readFileSync(`${BASE}/home_compliance.json`));
const stateComp= JSON.parse(fs.readFileSync(`${BASE}/state_compliance.json`));

// ── document ───────────────────────────────────────────────────────────────
const doc = new Document({
  numbering: {
    config: [{ reference: "bullets",
      levels: [{ level: 0, format: LevelFormat.BULLET, text: "•",
        alignment: AlignmentType.LEFT,
        style: { paragraph: { indent: { left: 720, hanging: 360 } } } }] }]
  },
  styles: {
    default: { document: { run: { font: "Arial", size: 20 } } },
    paragraphStyles: [
      { id: "Heading1", name: "Heading 1", basedOn: "Normal", next: "Normal", quickFormat: true,
        run: { size: 28, bold: true, color: NAVY, font: "Arial" },
        paragraph: { spacing: { before: 320, after: 120 }, outlineLevel: 0,
          border: { bottom: { style: BorderStyle.SINGLE, size: 1, color: "CCCCCC", space: 4 } } } },
      { id: "Heading2", name: "Heading 2", basedOn: "Normal", next: "Normal", quickFormat: true,
        run: { size: 22, bold: true, color: "2E4057", font: "Arial" },
        paragraph: { spacing: { before: 200, after: 80 }, outlineLevel: 1 } }
    ]
  },
  sections: [{
    properties: { page: { margin: { top: 900, right: 900, bottom: 900, left: 900 } } },
    headers: {
      default: new Header({ children: [
        new Table({ columnWidths: [6480, 3600],
          rows: [new TableRow({ children: [
            new TableCell({ borders: noBord, width: { size: 6480, type: WidthType.DXA },
              children: [p([t("City of Austin — Development Services Department", { bold: true, size: 18, color: NAVY })]),
                         p([it("Residential Plan Check — Technical Review Package", GRAY)])] }),
            new TableCell({ borders: noBord, width: { size: 3600, type: WidthType.DXA },
              verticalAlign: VerticalAlign.CENTER,
              children: [p([t("2406 Euclid Ave  |  2026-03-01", { size: 17, color: "888888" })], { alignment: AlignmentType.RIGHT })] })
          ]})] }),
        p([], { border: { bottom: { style: BorderStyle.SINGLE, size: 2, color: NAVY } }, spacing: { after: 0 } })
      ]})
    },
    footers: {
      default: new Footer({ children: [
        p([t("Page ", { size: 17, color: "888888" }),
           new TextRun({ children: [PageNumber.CURRENT], size: 17, color: "888888" }),
           t(" of ", { size: 17, color: "888888" }),
           new TextRun({ children: [PageNumber.TOTAL_PAGES], size: 17, color: "888888" }),
           t("   |   Technical Review Package — HOME Phase I Plan Check", { size: 16, color: "AAAAAA" })],
          { alignment: AlignmentType.CENTER,
            border: { top: { style: BorderStyle.SINGLE, size: 1, color: "CCCCCC" } },
            spacing: { before: 80 } })
      ]})
    },

    children: [

      // ── COVER ─────────────────────────────────────────────────────────────
      p([t("Technical Review Package", { size: 40, bold: true, color: NAVY })],
        { spacing: { before: 80, after: 60 } }),
      p([t("Austin Residential Plan Check  ·  HOME Phase I  ·  2406 Euclid Avenue", { size: 22, color: GRAY })],
        { spacing: { after: 280 } }),

      infoTable([
        ["Project",        summary.project],
        ["Review Date",    summary.review_date],
        ["Governing Phase",summary.governing_phase + " — " + summary.governing_ordinance],
        ["Use Type",       summary.use_type.replace(/_/g," ")],
        ["Sheets Reviewed",String(summary.totals.sheets_reviewed)],
        ["State Preemption","None triggered"],
      ]),

      spacer(),
      h2("Key Issues"),
      ...summary.key_issues.map(i => new Paragraph({ numbering: { reference: "bullets", level: 0 },
        spacing: { after: 60 }, children: [t(i)] })),

      spacer(),
      h2("At a Glance"),

      new Table({
        columnWidths: [2160, 2160, 2160, 2160, 1440],
        margins: { top: 80, bottom: 80, left: 120, right: 120 },
        rows: [
          new TableRow({ children: [
            hdrCell("PASS",      2160, "1E8449"),
            hdrCell("FAIL",      2160, RED),
            hdrCell("UNCLEAR",   2160, "9A7D0A"),
            hdrCell("Corrections",2160, NAVY),
            hdrCell("[VERIFY]",  1440, PURPLE),
          ]}),
          new TableRow({ children: [
            new TableCell({ borders: cellB, width:{size:2160,type:WidthType.DXA}, shading:{fill:"D5F5E3",type:ShadingType.CLEAR},
              children:[p([t(String(summary.totals.pass),{bold:true,size:36,color:GREEN})],{alignment:AlignmentType.CENTER})] }),
            new TableCell({ borders: cellB, width:{size:2160,type:WidthType.DXA}, shading:{fill:"FDEDEC",type:ShadingType.CLEAR},
              children:[p([t(String(summary.totals.fail),{bold:true,size:36,color:RED})],{alignment:AlignmentType.CENTER})] }),
            new TableCell({ borders: cellB, width:{size:2160,type:WidthType.DXA}, shading:{fill:"FEF9E7",type:ShadingType.CLEAR},
              children:[p([t(String(summary.totals.unclear),{bold:true,size:36,color:AMBER})],{alignment:AlignmentType.CENTER})] }),
            new TableCell({ borders: cellB, width:{size:2160,type:WidthType.DXA},
              children:[p([t(String(summary.totals.hard_corrections),{bold:true,size:36})],{alignment:AlignmentType.CENTER})] }),
            new TableCell({ borders: cellB, width:{size:1440,type:WidthType.DXA}, shading:{fill:"F4ECF7",type:ShadingType.CLEAR},
              children:[p([t(String(summary.totals.verify_items),{bold:true,size:36,color:PURPLE})],{alignment:AlignmentType.CENTER})] }),
          ]})
        ]
      }),

      spacer(),
      h2("Findings by Code Basis"),
      new Table({
        columnWidths: [4680, 4680 * 0.5 | 0, 4680],
        columnWidths: [3600, 3600, 2880],
        margins: { top: 60, bottom: 60, left: 120, right: 120 },
        rows: [
          new TableRow({ children: [hdrCell("Code Basis",3600), hdrCell("Findings",3600), hdrCell("Confidence Breakdown",2880)] }),
          new TableRow({ children: [
            cell([p([b("HOME Phase I: "), t(String(summary.by_code_basis.HOME_PHASE_I))]),
                  p([b("Subchapter F: "), t(String(summary.by_code_basis.LDC_SUBCHAPTER_F))]),
                  p([b("LDC Base District: "), t(String(summary.by_code_basis.LDC_BASE_DISTRICT))]),
                  p([b("IRC 2021: "), t(String(summary.by_code_basis.IRC_2021))]),
                  p([b("IBC 2021: "), t(String(summary.by_code_basis.IBC_2021))]),
                  p([b("TX State: "), t(String(summary.by_code_basis.TX_STATE))])], 3600),
            cell([p([b("Total: "), t(String(summary.totals.total_findings))]),
                  p([t("Pass: "+summary.totals.pass, {color:GREEN})]),
                  p([t("Fail: "+summary.totals.fail, {color:RED})]),
                  p([t("Unclear: "+summary.totals.unclear, {color:AMBER})])], 3600),
            cell([p([b("HIGH: "), t(String(summary.confidence_breakdown.HIGH))]),
                  p([b("MEDIUM: "), t(String(summary.confidence_breakdown.MEDIUM))]),
                  p([b("LOW: "), t(String(summary.confidence_breakdown.LOW))])], 2880),
          ]})
        ]
      }),

      // ── LOT CLASSIFICATION ────────────────────────────────────────────────
      new Paragraph({ pageBreakBefore: true, heading: HeadingLevel.HEADING_1, children: [t("Lot Classification")] }),
      p([it("Source: lot_classification.json", GRAY)], { spacing: { after: 120 } }),

      infoTable([
        ["Lot Area (permit app)",  lot.lot_area_sqft_permit_app + " sq ft"],
        ["Lot Area (site table)",  lot.lot_area_sqft_site_data_table + " sq ft  ⚠ DISCREPANCY"],
        ["Lot Area Used",          lot.lot_area_sqft_used_for_review + " sq ft (lower value, conservative)"],
        ["Lot Width (est.)",       lot.lot_width_at_setback],
        ["Flag Lot",               String(lot.flag_lot)],
        ["Zoning",                 lot.zoning + " — " + lot.neighborhood_plan + " Neighborhood Plan"],
        ["Units Proposed",         String(lot.unit_count_proposed)],
        ["Use Type",               lot.use_type.replace(/_/g," ")],
        ["Governing Phase",        lot.governing_phase],
        ["Governing Section",      lot.governing_section],
        ["Phase II Applicable",    "No — " + lot.phase_ii_note.split("—")[0].trim()],
        ["Subchapter F",           "Yes — FAR limits of §25-2-773(E) apply"],
        ["Confidence",             lot.measurement_confidence],
      ]),

      spacer(),
      h2("Unit Descriptions"),
      new Table({
        columnWidths: [900, 9180],
        margins: { top: 60, bottom: 60, left: 120, right: 120 },
        rows: [
          new TableRow({ children: [hdrCell("Unit", 900), hdrCell("Description", 9180)] }),
          ...lot.units.map(u => new TableRow({ children: [
            cell([p([b("Unit " + u.unit)])], 900),
            cell([t(u.description)], 9180),
          ]}))
        ]
      }),

      spacer(),
      p([b("Lot Area Discrepancy Note:  "), it(lot.lot_area_discrepancy_note, GRAY)],
        { indent: { left: 360 } }),

      // ── SHEET MANIFEST ────────────────────────────────────────────────────
      new Paragraph({ pageBreakBefore: true, heading: HeadingLevel.HEADING_1, children: [t("Sheet Manifest")] }),
      p([it("Source: sheet-manifest.json  ·  " + manifest.total_pages + " pages  ·  Stamp date: " + manifest.stamp_date, GRAY)],
        { spacing: { after: 120 } }),

      new Table({
        columnWidths: [600, 1400, 8080],
        margins: { top: 40, bottom: 40, left: 100, right: 100 },
        rows: [
          new TableRow({ children: [hdrCell("Pg", 600), hdrCell("Sheet ID", 1400), hdrCell("Description", 8080)] }),
          ...manifest.sheets.map(s => {
            const isUnknown = s.sheet_id.startsWith("UNKNOWN");
            return new TableRow({ children: [
              cell([t(String(s.page), { size: 18 })], 600),
              cell([mono(s.sheet_id)], 1400),
              cell([t(s.description, { size: 18, color: isUnknown ? AMBER : "000000" })], 8080),
            ]});
          })
        ]
      }),

      // ── FULL FINDINGS ─────────────────────────────────────────────────────
      new Paragraph({ pageBreakBefore: true, heading: HeadingLevel.HEADING_1, children: [t("Full Findings — All 23 Checks")] }),
      p([it("Source: sheet_findings.json", GRAY)], { spacing: { after: 80 } }),

      // by discipline
      ...["Administrative","Site","Architectural","Life Safety","Structure"].flatMap(disc => {
        const disc_key = disc.replace(" ","_");
        const group = findings.findings.filter(f =>
          f.discipline === disc || f.discipline === disc_key ||
          (disc === "Life Safety" && f.discipline === "Life Safety") ||
          (disc === "Structure" && f.discipline === "Structure")
        );
        if (!group.length) return [];
        return [
          h2(disc),
          new Table({
            columnWidths: [580, 3200, 780, 780, 1700, 1040],
            margins: { top: 40, bottom: 40, left: 80, right: 80 },
            rows: [
              new TableRow({ children: [
                hdrCell("ID",    580), hdrCell("Check", 3200), hdrCell("Status", 780),
                hdrCell("Conf",  780), hdrCell("Sheet",  1700), hdrCell("Page",   1040)
              ]}),
              ...group.map(f => new TableRow({ children: [
                cell([mono(f.id)], 580),
                cell([t(f.check, { size: 19 })], 3200),
                statusCell(f.status, 780),
                cell([t(f.confidence, { size: 18, color: f.confidence==="HIGH"?GREEN: f.confidence==="LOW"?RED:AMBER })], 780),
                cell([t(f.sheet_id, { size: 17, font: "Courier New" })], 1700),
                cell([t(String(f.page_number), { size: 17 })], 1040),
              ]}))
            ]
          }),
          spacer()
        ];
      }),

      // Observation detail for FAIL/UNCLEAR
      new Paragraph({ pageBreakBefore: true, heading: HeadingLevel.HEADING_1, children: [t("Finding Details — FAIL & UNCLEAR")] }),
      p([it("Observations and code references for all non-passing findings", GRAY)],
        { spacing: { after: 140 } }),

      ...findings.findings
        .filter(f => f.status === "FAIL" || f.status === "UNCLEAR")
        .flatMap(f => [
          p([mono(f.id + "  "), b(f.check),
             t("  [" + f.status + "]", { bold: true, color: statusColor(f.status) })]),
          p([b("Observation: "), t(f.observation)], { indent: { left: 360 }, spacing: { after: 60 } }),
          p([b("Code: "), it(f.code_ref, NAVY)], { indent: { left: 360 }, spacing: { after: 160 } }),
        ]),

      // ── HOME COMPLIANCE ───────────────────────────────────────────────────
      new Paragraph({ pageBreakBefore: true, heading: HeadingLevel.HEADING_1, children: [t("HOME Phase I/II Code Verification")] }),
      p([it("Source: home_compliance.json  ·  " + homeComp.verified_by, GRAY)],
        { spacing: { after: 80 } }),

      infoTable([
        ["Reference files", homeComp.reference_files_loaded.join("; ")],
        ["Findings reviewed", String(homeComp.findings_reviewed)],
        ["Verified",          String(homeComp.findings_verified)],
        ["Corrected",         String(homeComp.findings_corrected)],
        ["Dropped",           String(homeComp.findings_dropped)],
        ["Phase II applicable","No — " + homeComp.phase_ii_note],
        ["Summary",           homeComp.summary],
      ]),

      spacer(),
      h2("Per-Finding Verdicts"),
      new Table({
        columnWidths: [700, 900, 8480],
        margins: { top: 40, bottom: 40, left: 80, right: 80 },
        rows: [
          new TableRow({ children: [hdrCell("ID",700), hdrCell("Verified",900), hdrCell("Notes",8480)] }),
          ...homeComp.verdicts.map(v => new TableRow({ children: [
            cell([mono(v.id)], 700),
            new TableCell({ borders: cellB, width:{size:900,type:WidthType.DXA},
              shading:{fill: v.verified ? "D5F5E3" : "FDEDEC", type:ShadingType.CLEAR},
              children:[p([t(v.verified ? "✓ Yes" : "✗ No",
                {bold:true, color:v.verified?GREEN:RED, size:19})],
                {alignment:AlignmentType.CENTER,spacing:{before:60,after:60}})] }),
            cell([t(v.notes, {size:19})], 8480),
          ]}))
        ]
      }),

      // ── STATE LAW ─────────────────────────────────────────────────────────
      new Paragraph({ pageBreakBefore: true, heading: HeadingLevel.HEADING_1, children: [t("Texas State Law Analysis")] }),
      p([it("Source: state_compliance.json  ·  " + stateComp.verified_by, GRAY)],
        { spacing: { after: 80 } }),

      infoTable([
        ["Reference files",     stateComp.reference_files_loaded.join("; ")],
        ["Lot area",            stateComp.lot_facts.lot_area_sqft + " sq ft"],
        ["Is small lot (≤4,000 sf)", String(stateComp.lot_facts.is_small_lot) + " — SB 15 small-lot provisions DO NOT apply"],
        ["SB 15 in effect",     "Yes — effective " + stateComp.lot_facts.sb15_effective],
        ["SB 840 applicable",   "No — " + stateComp.lot_facts.sb840_note],
        ["HB 24 applicable",    "No — " + stateComp.lot_facts.hb24_note],
        ["Preemption found",    "None — " + stateComp.preemption_summary.substring(0, 100) + "..."],
        ["Local provisions prohibited", stateComp.local_provisions_prohibited_by_state_law],
      ]),

      spacer(),
      h2("Per-Finding Preemption Analysis"),
      new Table({
        columnWidths: [700, 1100, 8280],
        margins: { top: 40, bottom: 40, left: 80, right: 80 },
        rows: [
          new TableRow({ children: [hdrCell("ID",700), hdrCell("Preemption",1100), hdrCell("Notes",8280)] }),
          ...stateComp.findings.map(f => new TableRow({ children: [
            cell([mono(f.id)], 700),
            new TableCell({ borders: cellB, width:{size:1100,type:WidthType.DXA},
              shading:{fill: f.preemption ? "FDEDEC" : "D5F5E3", type:ShadingType.CLEAR},
              children:[p([t(f.preemption ? "⚠ YES" : "None",
                {bold:true, color:f.preemption?RED:GREEN, size:18})],
                {alignment:AlignmentType.CENTER,spacing:{before:60,after:60}})] }),
            cell([t(f.notes, {size:18})], 8280),
          ]}))
        ]
      }),

    ]
  }]
});

Packer.toBuffer(doc).then(buf => {
  fs.writeFileSync(`${BASE}/review-package.docx`, buf);
  console.log("Written: review-package.docx");
});
