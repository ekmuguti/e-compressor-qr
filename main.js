// --- Shared defaults for every E-Compressor unit ---
const DEFAULT_UNIT = {
  model: "E-Compressor 800L",
  manualUrl: "https://ekmuguti.github.io/e-compressor-qr/manuals/E-Compressor-Operational-Manual.pdf",
  certsUrl: "https://ekmuguti.github.io/e-compressor-qr/manuals/english-user-manual-e-compressor.pdf",
  incidentFormBaseUrl: "https://forms.office.com/e/E5dxy8FYXc"
};

// --- Simple "database" of units ---
// Add a unit with { serial, status }. Override any default field per unit if needed.
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

// Status -> colour class for the status chip
const STATUS_CLASSES = {
  "on hire": "is-blue",
  "in service": "is-green",
  "available": "is-green",
  "allocated": "is-amber",
  "new": "is-sky"
};

// --- Utility functions ---
function getQuerySerial() {
  const params = new URLSearchParams(window.location.search);
  const raw = params.get("serial");
  if (!raw) return "";
  return raw.trim().toUpperCase();
}

function normaliseSerial(input) {
  return (input || "").trim().toUpperCase();
}

function findUnitBySerial(serial) {
  const normalized = normaliseSerial(serial);
  return UNIT_DATA.find(u => normaliseSerial(u.serial) === normalized) || null;
}

function buildEmailLink(serial) {
  const subject = `Incident Report - Serial ${serial}`;
  const body =
`Please attach photos of the issue (e.g. gauges, filters, setup).

Include the following details:
• Unit Serial: ${serial}
• Location / Site:
• Description of issue:
• Your name / contact number:

Thank you.
Air2Work Support Team`;

  return `mailto:aston.ladzinski@einnovation.com.au?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
}

// Build incident form URL. If your form supports a "Serial" query param, append it.
function buildIncidentUrl(baseUrl, serial) {
  if (!baseUrl) return "#";
  const hasQuery = baseUrl.includes("?");
  const sep = hasQuery ? "&" : "?";
  return `${baseUrl}${sep}Serial=${encodeURIComponent(serial)}`;
}

// --- DOM wiring ---
document.addEventListener("DOMContentLoaded", () => {
  const yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  const unitTitle = document.getElementById("unitTitle");
  const unitSubtitle = document.getElementById("unitSubtitle");
  const unitDetails = document.getElementById("unitDetails");
  const actionsSection = document.getElementById("actionsSection");
  const errorSection = document.getElementById("errorSection");

  const detailModel = document.getElementById("detailModel");
  const detailStatus = document.getElementById("detailStatus");

  const btnManual = document.getElementById("btnManual");
  const btnCerts = document.getElementById("btnCerts");
  const btnIncident = document.getElementById("btnIncident");
  const btnEmail = document.getElementById("btnEmail");

  const serialForm = document.getElementById("manualSerialSection");
  const serialInput = document.getElementById("serialInput");
  const serialList = document.getElementById("serialList");

  // Suggest known serials while typing
  if (serialList) {
    UNIT_DATA.forEach(u => {
      const option = document.createElement("option");
      option.value = u.serial;
      serialList.appendChild(option);
    });
  }

  function renderForSerial(serial) {
    const unit = findUnitBySerial(serial);

    if (!unit) {
      // Nothing found: show error
      unitTitle.textContent = "Unit not recognised";
      unitTitle.classList.remove("is-serial");
      unitSubtitle.textContent =
        "We couldn't match this serial to a known E-Compressor.";
      unitDetails.classList.add("hidden");
      actionsSection.classList.add("hidden");
      errorSection.classList.remove("hidden");
      return;
    }

    // Populate header and details
    unitTitle.textContent = unit.serial;
    unitTitle.classList.add("is-serial");
    unitSubtitle.textContent = `${unit.model || "E-Compressor"}: support tools and documentation for this unit.`;
    detailModel.textContent = unit.model || "–";

    const status = unit.status || "Active";
    detailStatus.textContent = status;
    detailStatus.className = "status-chip " + (STATUS_CLASSES[status.toLowerCase()] || "");

    // Populate links
    btnManual.href = unit.manualUrl || "#";
    btnManual.classList.toggle("hidden", !unit.manualUrl);

    btnCerts.href = unit.certsUrl || "#";
    btnCerts.classList.toggle("hidden", !unit.certsUrl);

    btnIncident.href = buildIncidentUrl(unit.incidentFormBaseUrl, unit.serial);
    btnIncident.classList.toggle("hidden", !unit.incidentFormBaseUrl);

    btnEmail.href = buildEmailLink(unit.serial);
    btnEmail.classList.remove("hidden");

    unitDetails.classList.remove("hidden");
    actionsSection.classList.remove("hidden");
    errorSection.classList.add("hidden");

    document.title = `${unit.serial} | E-Compressor Support`;
  }

  // Initial load: try URL param
  const initialSerial = getQuerySerial();
  if (initialSerial) {
    if (serialInput) serialInput.value = initialSerial;
    renderForSerial(initialSerial);
  } else {
    unitTitle.textContent = "Find your compressor";
    unitSubtitle.textContent =
      "Scan the QR code on the compressor, or enter its serial number to get manuals, training and support.";
  }

  // Manual serial entry handler
  if (serialForm && serialInput) {
    serialForm.addEventListener("submit", e => {
      e.preventDefault();
      const value = serialInput.value;
      if (!value.trim()) return;
      serialInput.value = normaliseSerial(value);
      renderForSerial(value);
      // Update URL without reload so the link can be shared
      const params = new URLSearchParams(window.location.search);
      params.set("serial", normaliseSerial(value));
      const newUrl =
        window.location.pathname + "?" + params.toString() + window.location.hash;
      window.history.replaceState({}, "", newUrl);
    });
  }
});
