/* ==========================================================
   Portal content and unit register
   Edit this file to add units, documents or training videos.
   ========================================================== */

// Documents shared by every E-Compressor unit.
// `href` is relative to index.html so it works on the custom domain,
// on <user>.github.io/e-compressor-qr/ and when opened locally.
const DOCUMENTS = {
  operations: {
    title: "Operations manual",
    type: "PDF",
    meta: "2.9 MB",
    href: "manuals/E-Compressor-Operational-Manual.pdf"
  },
  service: {
    title: "Service manual",
    type: "PDF",
    meta: "1.3 MB",
    href: "manuals/english-user-manual-e-compressor.pdf"
  }
};

// Defaults applied to every unit. Override any field on a single unit if needed.
const DEFAULT_UNIT = {
  model: "E-Compressor 800L",
  documents: [DOCUMENTS.operations, DOCUMENTS.service],
  incidentFormBaseUrl: "https://forms.office.com/e/E5dxy8FYXc",
  supportEmail: "aston.ladzinski@einnovation.com.au"
};

// Unit register. Add a unit with { serial, status }.
const UNIT_DATA = [
  { serial: "63KZ-14600", status: "In Service" },
  { serial: "63KZ-14700", status: "new" },
  { serial: "63KZ-14800", status: "On Hire" },
  { serial: "63KZ-14900", status: "In Service" },
  { serial: "63KZ-15100", status: "On Hire" },
  { serial: "63KZ-15200", status: "On Hire" },
  { serial: "63KZ-15300", status: "Allocated" },
  { serial: "63KZ-15400", status: "Available" },
  { serial: "63KZ-15500", status: "Available" },
  { serial: "63KZ-15600", status: "Available" },
  { serial: "63KZ-15900", status: "Available" },
  { serial: "63KZ-16100", status: "On Hire" },
  { serial: "63KZ-16200", status: "Available" },
  { serial: "63KZ-16300", status: "Available" }
].map(unit => ({ ...DEFAULT_UNIT, ...unit }));

// Status text -> indicator tone (see .status--* in style.css)
const STATUS_TONES = {
  "on hire": "info",
  "in service": "ok",
  "available": "ok",
  "allocated": "warn",
  "new": "accent"
};

// Operator training videos (YouTube)
const TRAINING_VIDEOS = [
  {
    step: "01",
    title: "Start-up procedure",
    description: "Pre-start checks and bringing the unit online.",
    youtubeId: "Vn7Zdq4yWTA"
  },
  {
    step: "02",
    title: "Alarm procedure",
    description: "Identifying and responding to unit alarms.",
    youtubeId: "fwDWhOeyHmg"
  },
  {
    step: "03",
    title: "Shutdown procedure",
    description: "Safe shutdown and isolation of the unit.",
    youtubeId: "wYPIRiEjVtk"
  }
];

// Product attributes shown in the product information strip
const PRODUCT_ATTRIBUTES = [
  { label: "Power", value: "Electric powered" },
  { label: "Noise", value: "Low noise operation" },
  { label: "Support", value: "On-hire technical support" }
];
