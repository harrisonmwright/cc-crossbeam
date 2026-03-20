const {
  Document, Packer, Paragraph, TextRun, Table, TableRow, TableCell,
  Header, Footer, AlignmentType, HeadingLevel, BorderStyle, WidthType,
  ShadingType, VerticalAlign, PageNumber, LevelFormat, PageBreak
} = require('docx');
const fs = require('fs');

const NAVY = "1B3A6B";
const DARK_GRAY = "333333";
const MED_GRAY = "666666";
const LIGHT_BLUE_BG = "E8EEF7";
const LIGHT_GRAY_BG = "F5F5F5";
const WARN_AMBER = "7A5500";
const WARN_BG = "FFF8E6";
const INFO_BG = "EAF4EA";
const INFO_GREEN = "1A5C1A";
const BORDER_LIGHT = { style: BorderStyle.SINGLE, size: 1, color: "CCCCCC" };
const BORDER_NONE = { style: BorderStyle.NIL, size: 0, color: "FFFFFF" };

function p(children, opts = {}) {
  return new Paragraph({ children, spacing: { before: 60, after: 60 }, ...opts });
}

function t(text, opts = {}) {
  return new TextRun({ text, font: "Arial", ...opts });
}

function sectionDivider() {
  return new Paragraph({
    border: { bottom: { style: BorderStyle.SINGLE, size: 2, color: "CCCCCC" } },
    spacing: { before: 200, after: 200 },
    children: []
  });
}

function correctionBlock(num, title, sheet, page, codeRef, requiredAction, notes, confidence) {
  const cellBorders = { top: BORDER_LIGHT, bottom: BORDER_LIGHT, left: BORDER_NONE, right: BORDER_NONE };
  const numCellBorders = { top: BORDER_LIGHT, bottom: BORDER_LIGHT, left: BORDER_NONE, right: BORDER_LIGHT };

  const actionLines = requiredAction.split('\n').filter(l => l.trim());
  const actionParagraphs = actionLines.map(line =>
    line.startsWith('•') || line.match(/^\d\./)
      ? new Paragraph({
          numbering: { reference: "action-bullets", level: 0 },
          spacing: { before: 40, after: 40 },
          children: [t(line.replace(/^[•\d\.]\s*/, ''), { size: 20 })]
        })
      : new Paragraph({
          spacing: { before: 60, after: 60 },
          children: [t(line, { size: 20 })]
        })
  );

  const notesParagraphs = notes ? [
    new Paragraph({
      spacing: { before: 80, after: 40 },
      shading: { fill: WARN_BG, type: ShadingType.CLEAR },
      indent: { left: 0 },
      children: [
        t("Note: ", { bold: true, color: WARN_AMBER, size: 19 }),
        t(notes, { color: WARN_AMBER, italics: true, size: 19 })
      ]
    })
  ] : [];

  return new Table({
    columnWidths: [700, 8660],
    margins: { top: 80, bottom: 80, left: 160, right: 160 },
    rows: [
      new TableRow({
        children: [
          new TableCell({
            borders: numCellBorders,
            width: { size: 700, type: WidthType.DXA },
            shading: { fill: NAVY, type: ShadingType.CLEAR },
            verticalAlign: VerticalAlign.CENTER,
            children: [new Paragraph({
              alignment: AlignmentType.CENTER,
              children: [t(String(num), { bold: true, color: "FFFFFF", size: 28 })]
            })]
          }),
          new TableCell({
            borders: numCellBorders,
            width: { size: 8660, type: WidthType.DXA },
            shading: { fill: LIGHT_BLUE_BG, type: ShadingType.CLEAR },
            children: [new Paragraph({
              spacing: { before: 60, after: 60 },
              children: [
                t(title, { bold: true, color: NAVY, size: 22 }),
                t("  |  Sheet " + sheet + "  ·  Page " + page, { color: MED_GRAY, size: 20 })
              ]
            })]
          })
        ]
      }),
      new TableRow({
        children: [
          new TableCell({
            borders: { top: BORDER_NONE, bottom: BORDER_NONE, left: BORDER_NONE, right: BORDER_LIGHT },
            width: { size: 700, type: WidthType.DXA },
            shading: { fill: LIGHT_GRAY_BG, type: ShadingType.CLEAR },
            children: [new Paragraph({ children: [] })]
          }),
          new TableCell({
            borders: { top: BORDER_NONE, bottom: BORDER_LIGHT, left: BORDER_NONE, right: BORDER_NONE },
            width: { size: 8660, type: WidthType.DXA },
            children: [
              new Paragraph({
                spacing: { before: 80, after: 60 },
                children: [
                  t("Code: ", { bold: true, size: 19, color: DARK_GRAY }),
                  t(codeRef, { size: 19, color: DARK_GRAY })
                ]
              }),
              new Paragraph({
                spacing: { before: 80, after: 40 },
                children: [t("Required action:", { bold: true, size: 20, color: DARK_GRAY })]
              }),
              ...actionParagraphs,
              ...notesParagraphs,
              new Paragraph({ spacing: { before: 60, after: 0 }, children: [] })
            ]
          })
        ]
      })
    ]
  });
}

function infoBlock(label, title, codeRef, body) {
  const cellBorders = { top: BORDER_LIGHT, bottom: BORDER_LIGHT, left: BORDER_NONE, right: BORDER_NONE };
  const labelBorders = { top: BORDER_LIGHT, bottom: BORDER_LIGHT, left: BORDER_NONE, right: BORDER_LIGHT };
  return new Table({
    columnWidths: [700, 8660],
    margins: { top: 80, bottom: 80, left: 160, right: 160 },
    rows: [
      new TableRow({
        children: [
          new TableCell({
            borders: labelBorders,
            width: { size: 700, type: WidthType.DXA },
            shading: { fill: INFO_GREEN, type: ShadingType.CLEAR },
            verticalAlign: VerticalAlign.CENTER,
            children: [new Paragraph({
              alignment: AlignmentType.CENTER,
              children: [t(label, { bold: true, color: "FFFFFF", size: 18 })]
            })]
          }),
          new TableCell({
            borders: cellBorders,
            width: { size: 8660, type: WidthType.DXA },
            shading: { fill: INFO_BG, type: ShadingType.CLEAR },
            children: [new Paragraph({
              spacing: { before: 60, after: 60 },
              children: [t(title, { bold: true, color: INFO_GREEN, size: 21 })]
            })]
          })
        ]
      }),
      new TableRow({
        children: [
          new TableCell({
            borders: { top: BORDER_NONE, bottom: BORDER_LIGHT, left: BORDER_NONE, right: BORDER_LIGHT },
            width: { size: 700, type: WidthType.DXA },
            shading: { fill: LIGHT_GRAY_BG, type: ShadingType.CLEAR },
            children: [new Paragraph({ children: [] })]
          }),
          new TableCell({
            borders: { top: BORDER_NONE, bottom: BORDER_LIGHT, left: BORDER_NONE, right: BORDER_NONE },
            width: { size: 8660, type: WidthType.DXA },
            children: [
              new Paragraph({
                spacing: { before: 60, after: 40 },
                children: [
                  t("Code: ", { bold: true, size: 19, color: DARK_GRAY }),
                  t(codeRef, { size: 19, color: DARK_GRAY })
                ]
              }),
              new Paragraph({
                spacing: { before: 40, after: 80 },
                children: [t(body, { size: 20, color: DARK_GRAY })]
              })
            ]
          })
        ]
      })
    ]
  });
}

function spacer(pts = 120) {
  return new Paragraph({ spacing: { before: pts, after: 0 }, children: [] });
}

const doc = new Document({
  styles: {
    default: { document: { run: { font: "Arial", size: 22 } } },
    paragraphStyles: [
      { id: "Heading1", name: "Heading 1", basedOn: "Normal", next: "Normal",
        run: { size: 28, bold: true, color: NAVY, font: "Arial" },
        paragraph: { spacing: { before: 280, after: 120 }, outlineLevel: 0 } },
      { id: "Heading2", name: "Heading 2", basedOn: "Normal", next: "Normal",
        run: { size: 24, bold: true, color: DARK_GRAY, font: "Arial" },
        paragraph: { spacing: { before: 200, after: 100 }, outlineLevel: 1 } },
    ]
  },
  numbering: {
    config: [
      { reference: "corrections-list",
        levels: [{ level: 0, format: LevelFormat.DECIMAL, text: "%1.", alignment: AlignmentType.LEFT,
          style: { paragraph: { indent: { left: 480, hanging: 360 } } } }] },
      { reference: "action-bullets",
        levels: [{ level: 0, format: LevelFormat.BULLET, text: "•", alignment: AlignmentType.LEFT,
          style: { paragraph: { indent: { left: 480, hanging: 360 } } } }] },
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
            columnWidths: [6000, 3360],
            margins: { top: 0, bottom: 0, left: 0, right: 0 },
            rows: [new TableRow({
              children: [
                new TableCell({
                  borders: { top: BORDER_NONE, bottom: BORDER_LIGHT, left: BORDER_NONE, right: BORDER_NONE },
                  width: { size: 6000, type: WidthType.DXA },
                  children: [new Paragraph({
                    spacing: { before: 40, after: 40 },
                    children: [
                      t("CITY OF PLACENTIA  —  Building & Safety Division", { bold: true, color: NAVY, size: 20 })
                    ]
                  })]
                }),
                new TableCell({
                  borders: { top: BORDER_NONE, bottom: BORDER_LIGHT, left: BORDER_NONE, right: BORDER_NONE },
                  width: { size: 3360, type: WidthType.DXA },
                  children: [new Paragraph({
                    alignment: AlignmentType.RIGHT,
                    spacing: { before: 40, after: 40 },
                    children: [
                      t("Plan Check Corrections  |  Page ", { color: MED_GRAY, size: 18 }),
                      new TextRun({ children: [PageNumber.CURRENT], font: "Arial", size: 18, color: MED_GRAY }),
                      t(" of ", { color: MED_GRAY, size: 18 }),
                      new TextRun({ children: [PageNumber.TOTAL_PAGES], font: "Arial", size: 18, color: MED_GRAY })
                    ]
                  })]
                })
              ]
            })]
          })
        ]
      })
    },
    footers: {
      default: new Footer({
        children: [
          new Paragraph({
            border: { top: BORDER_LIGHT },
            spacing: { before: 80, after: 0 },
            alignment: AlignmentType.CENTER,
            children: [
              t("This corrections letter was prepared with AI-assisted plan check technology (CrossBeam). ", { size: 17, color: MED_GRAY, italics: true }),
              t("All code citations reviewed against CA state law and Placentia Municipal Code.", { size: 17, color: MED_GRAY, italics: true })
            ]
          })
        ]
      })
    },
    children: [
      // ── TITLE BLOCK ──────────────────────────────────────────────────────────
      spacer(80),
      new Paragraph({
        spacing: { before: 0, after: 60 },
        children: [t("PLAN CHECK CORRECTIONS", { bold: true, color: NAVY, size: 40 })]
      }),
      new Paragraph({
        border: { bottom: { style: BorderStyle.SINGLE, size: 4, color: NAVY } },
        spacing: { before: 0, after: 0 },
        children: []
      }),
      spacer(60),

      // ── PROJECT INFO TABLE ────────────────────────────────────────────────────
      new Table({
        columnWidths: [2200, 7160],
        margins: { top: 80, bottom: 80, left: 160, right: 160 },
        rows: [
          ["Project", "New Detached Accessory Dwelling Unit"],
          ["Address", "1232 N. Jefferson St., Unit A, Placentia, CA 92870"],
          ["Job No.", "25-1232N.JEFFSON"],
          ["Applicant/Designer", "Ideal Designs / ADU Metric"],
          ["Plan Check Date", "March 5, 2026"],
          ["Review Cycle", "First Correction"],
        ].map(([label, value], i) => new TableRow({
          children: [
            new TableCell({
              borders: { top: BORDER_NONE, bottom: BORDER_NONE, left: BORDER_NONE, right: BORDER_LIGHT },
              width: { size: 2200, type: WidthType.DXA },
              shading: { fill: i % 2 === 0 ? LIGHT_BLUE_BG : "EEF3FB", type: ShadingType.CLEAR },
              children: [new Paragraph({ spacing: { before: 60, after: 60 }, children: [t(label, { bold: true, size: 20, color: NAVY })] })]
            }),
            new TableCell({
              borders: { top: BORDER_NONE, bottom: BORDER_NONE, left: BORDER_NONE, right: BORDER_NONE },
              width: { size: 7160, type: WidthType.DXA },
              shading: { fill: i % 2 === 0 ? LIGHT_GRAY_BG : "FAFAFA", type: ShadingType.CLEAR },
              children: [new Paragraph({ spacing: { before: 60, after: 60 }, children: [t(value, { size: 20 })] })]
            })
          ]
        }))
      }),

      spacer(160),

      // ── SUMMARY ───────────────────────────────────────────────────────────────
      new Paragraph({ heading: HeadingLevel.HEADING_1, children: [t("Summary", { bold: true, color: NAVY, size: 28, font: "Arial" })] }),
      new Paragraph({
        spacing: { before: 60, after: 120 },
        children: [
          t("This plan set was reviewed against the 2022 California Building Code, California Residential Code, 2022 California Energy Code, Government Code § 66310–66342, and Placentia Municipal Code Chapter 23.73. The plan set is well organized and demonstrates strong compliance overall — "),
          t("27 of 33 items reviewed passed on first check.", { bold: true }),
        ]
      }),
      new Paragraph({
        spacing: { before: 0, after: 60 },
        children: [
          t("8 corrections are required", { bold: true }),
          t(" before this permit can be issued. Items 6–8 are contingent on resolution of Item 2 (side setback dimensions) and may be resolved together once those dimensions are provided."),
        ]
      }),
      new Paragraph({
        spacing: { before: 40, after: 120 },
        children: [
          t("3 informational items", { bold: true }),
          t(" are included at the end of this letter regarding administrative requirements that must be satisfied before or at permit issuance."),
        ]
      }),

      // Stats table
      new Table({
        columnWidths: [2340, 2340, 2340, 2340],
        margins: { top: 80, bottom: 80, left: 160, right: 160 },
        rows: [
          new TableRow({
            children: [
              ["33", "Total Checks", NAVY],
              ["27", "Passed", "1A5C1A"],
              ["8", "Corrections Required", "7A1A1A"],
              ["3", "Informational", "5C4A00"],
            ].map(([num, label, color]) => new TableCell({
              borders: { top: BORDER_LIGHT, bottom: BORDER_LIGHT, left: BORDER_LIGHT, right: BORDER_LIGHT },
              width: { size: 2340, type: WidthType.DXA },
              shading: { fill: "FFFFFF", type: ShadingType.CLEAR },
              verticalAlign: VerticalAlign.CENTER,
              children: [
                new Paragraph({ alignment: AlignmentType.CENTER, spacing: { before: 80, after: 20 }, children: [t(num, { bold: true, size: 40, color })] }),
                new Paragraph({ alignment: AlignmentType.CENTER, spacing: { before: 0, after: 80 }, children: [t(label, { size: 18, color: MED_GRAY })] })
              ]
            }))
          })
        ]
      }),

      spacer(200),

      // ── REQUIRED CORRECTIONS ─────────────────────────────────────────────────
      new Paragraph({ heading: HeadingLevel.HEADING_1, children: [t("Required Corrections", { bold: true, color: NAVY, size: 28, font: "Arial" })] }),

      spacer(60),

      correctionBlock(
        1,
        "Update Title 24 Energy Code Edition",
        "CS", 1,
        "2022 California Energy Code (Title 24, Part 6), effective January 1, 2023",
        `Revise the Governing Codes block on the cover sheet to read: 2022 California Energy Code (Title 24, Part 6).\nConfirm that Title 24 compliance forms T-1, T-2, and T-3 were generated using the 2022 standard.\nIf compliance forms were prepared under the 2019 standard, submit updated CF1R forms and the 2022 Residential Mandatory Requirements Summary.`,
        null,
        "HIGH"
      ),
      spacer(80),

      correctionBlock(
        2,
        "Dimension ADU Side Setbacks on Site Plan",
        "A1", 4,
        "Gov. Code § 66314(c)(2)(C) / PMC § 23.73.060(C) — 4-foot minimum side setback for new detached ADU construction",
        "Add explicit dimension callouts on the New Site Plan (A1) showing the clear distance from each side wall of the proposed ADU to the nearest side property line. Both dimensions must be ≥4 ft.",
        "Resolution of this item will allow Items 6, 7, and 8 to be evaluated. If both sides are confirmed ≥5 ft from all property lines, Items 6–8 may be resolved with a single confirming note.",
        "HIGH"
      ),
      spacer(80),

      correctionBlock(
        3,
        "Add Lot Coverage Calculation to Site Plan",
        "A1", 4,
        "PMC Ch. 23.12 (R-1 Zone) — 50% maximum lot coverage; coverage calculation required on submitted plans",
        `Add a lot coverage table or note to Site Plan A1 that includes:\n• Total lot area (sq ft)\n• Existing SFR footprint (sq ft)\n• Proposed ADU footprint (sq ft)\n• Garage / other covered structures (sq ft)\n• Total lot coverage (sq ft and %)\nThe total coverage percentage must not exceed 50% for R-1 zoning.`,
        "[VERIFY] Reviewer to confirm lot area and all impervious coverage totals match the designer's stated calculation at over-the-counter review.",
        "MEDIUM"
      ),
      spacer(80),

      correctionBlock(
        4,
        "Dimension Building Separation — ADU to Primary Dwelling",
        "A1", 4,
        "PMC § 23.73.060(D) — 10-foot minimum building separation between detached ADU and primary dwelling",
        "Add a dimension callout on the New Site Plan (A1) showing the clear distance between the nearest wall of the new ADU and the nearest wall of the existing SFR. This dimension must be ≥10 ft.",
        null,
        "MEDIUM"
      ),
      spacer(80),

      correctionBlock(
        5,
        "Add Architectural Compatibility Statement",
        "A3", 7,
        "PMC § 23.73.080 — ADU exterior materials and roof pitch shall be compatible with primary dwelling (objective standard)",
        `Add a compatibility note on Sheet A3 (or the cover sheet) confirming:\n• ADU exterior finish material matches the primary dwelling (specify material)\n• ADU roof pitch matches or is compatible with the primary dwelling's roof pitch\nIf materials or pitch differ from the primary dwelling, a written justification must be submitted to the Planning Division prior to permit issuance.`,
        null,
        "MEDIUM"
      ),
      spacer(80),

      correctionBlock(
        6,
        "Identify Fire-Rated Wall Faces on Elevations",
        "A3", 7,
        "CBC § 705.5 — 1-hour fire-resistive exterior wall required on faces within 5 ft of property line",
        "After providing side setback dimensions (Item 2), add per-elevation keynotes on A3 identifying which wall faces are within 5 ft of any property line and confirming the 1-hour assembly applies to those faces. If no face is within 5 ft of any property line, add a note stating same and the 1-hour assembly notation may be removed or retained as shown.",
        "Contingent on Item 2 — resolves once side setback dimensions are confirmed.",
        "MEDIUM"
      ),
      spacer(80),

      correctionBlock(
        7,
        "Confirm Window Glazing on Faces Near Property Line",
        "A3", 7,
        "CBC § 705.8 — no unprotected openings within 3 ft of property line; fire-rated glazing (0.45-hr) required for openings 3–5 ft from property line",
        "After providing side setback dimensions (Item 2), confirm whether any window falls within 5 ft of a property line. If yes, add fire-rated glazing callout (0.45-hour rated assembly) for affected windows, or eliminate the opening. If no window is within 5 ft, add a confirming note on A3.",
        "Contingent on Item 2 — resolves once side setback dimensions are confirmed.",
        "MEDIUM"
      ),
      spacer(80),

      correctionBlock(
        8,
        "Confirm Eave Clearance from Property Line",
        "A3", 7,
        "CBC § 705.2 — eave projecting within 2 ft of property line requires fire-resistive construction on the underside",
        "After providing side setback dimensions (Item 2), confirm that the eave projection does not come within 2 ft of any property line. If it does, provide a fire-rated soffit assembly callout on A3. If eave clearance is ≥2 ft on all sides, add a note to that effect.",
        "[VERIFY] Low visual confidence on eave projection dimension. Field verification of eave-to-property-line clearance is recommended at framing inspection.",
        "LOW"
      ),

      spacer(200),

      // ── INFORMATIONAL ITEMS ───────────────────────────────────────────────────
      new Paragraph({ heading: HeadingLevel.HEADING_1, children: [t("Informational Items", { bold: true, color: NAVY, size: 28, font: "Arial" })] }),
      new Paragraph({
        spacing: { before: 0, after: 120 },
        children: [t("The following are not plan corrections. No plan revision is required. These items must be addressed before or at permit issuance.", { italics: true, color: MED_GRAY })]
      }),

      infoBlock(
        "Info A",
        "Deed Restriction Required Before Permit Issuance",
        "PMC § 23.73.050",
        "Before the building permit can be issued, the applicant must record a deed restriction with the Orange County Recorder's Office restricting the ADU to residential dwelling use only and acknowledging the AB 976 owner-occupancy waiver (effective January 1, 2025). A recorded copy must be provided to the Placentia Planning Division before the building permit is released at the counter."
      ),
      spacer(80),

      infoBlock(
        "Info B",
        "Development Impact Fee — Proportional (ADU >750 sq ft)",
        "Gov. Code § 66333.1 / Placentia Development Impact Fee Schedule",
        "The proposed ADU is 850 sq ft, above the 750 sq ft impact fee exemption threshold. A proportional development impact fee will be assessed at permit issuance. The applicant should contact the City's Finance Department for the current fee schedule and fee estimate."
      ),
      spacer(80),

      infoBlock(
        "Info C",
        "Water Service — Golden State Water Company Coordination Required",
        "GSWC Service Area — Placentia",
        "Water service in Placentia is provided by Golden State Water Company (GSWC), a private utility. Any new water service lateral, meter, or service upgrade must be coordinated directly with GSWC. The City of Placentia does not process water utility connections on GSWC's behalf. The applicant should contact GSWC early in the construction process."
      ),

      spacer(200),

      // ── RESUBMITTAL INSTRUCTIONS ──────────────────────────────────────────────
      new Paragraph({
        border: { top: { style: BorderStyle.SINGLE, size: 2, color: NAVY } },
        heading: HeadingLevel.HEADING_1,
        children: [t("Resubmittal Instructions", { bold: true, color: NAVY, size: 28, font: "Arial" })]
      }),
      new Paragraph({
        spacing: { before: 60, after: 60 },
        children: [t("Please respond to all 8 required corrections in your resubmittal. Revised sheets must be cloud-marked and revision-dated. Include a written response letter itemizing each correction and the action taken.")]
      }),
      new Paragraph({
        spacing: { before: 60, after: 60 },
        children: [t("Resubmittals are accepted at the Building & Safety counter or electronically via the City's permit portal. Allow 10 business days for second-cycle review.")]
      }),
      new Paragraph({
        spacing: { before: 60, after: 120 },
        children: [
          t("Questions: "),
          t("Building & Safety — (714) 993-8117  |  building@placentia.org", { bold: true, color: NAVY })
        ]
      }),
    ]
  }]
});

const outputPath = "demo-output/ca-adu-city-placentia-20260305-221052/corrections_letter.docx";
Packer.toBuffer(doc).then(buffer => {
  fs.writeFileSync(outputPath, buffer);
  console.log("Written:", outputPath);
});
