/* ==========================================================
   App wiring: serial lookup, ?serial= QR parameter, rendering.
   Data lives in js/data.js, UI templates in js/components.js.
   ========================================================== */

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

function buildEmailLink(serial, to) {
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

  return `mailto:${to}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
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
  const $ = id => document.getElementById(id);

  $("year").textContent = new Date().getFullYear();

  const unitTitle = $("unitTitle");
  const unitSubtitle = $("unitSubtitle");
  const introEyebrow = $("introEyebrow");
  const unitMeta = $("unitMeta");
  const unitSection = $("unitSection");
  const errorSection = $("errorSection");
  const serialForm = $("unitSearch");
  const serialInput = $("serialInput");

  const defaultTitle = unitTitle.innerHTML;
  const defaultSubtitle = unitSubtitle.textContent.trim();
  const defaultEyebrow = introEyebrow.textContent;

  // Static content rendered from data
  UI.renderList($("videoGrid"), TRAINING_VIDEOS, UI.trainingVideoCard);
  UI.renderList($("productAttributes"), PRODUCT_ATTRIBUTES, UI.attribute);
  UI.renderList($("serialList"), UNIT_DATA, u => `<option value="${UI.esc(u.serial)}"></option>`);

  function renderForSerial(serial) {
    const unit = findUnitBySerial(serial);

    if (!unit) {
      introEyebrow.textContent = defaultEyebrow;
      unitTitle.innerHTML = defaultTitle;
      unitTitle.classList.remove("is-serial");
      unitSubtitle.textContent = defaultSubtitle;
      unitMeta.classList.add("hidden");
      unitSection.classList.add("hidden");
      errorSection.classList.remove("hidden");
      document.title = "Serial not recognised | E-Compressor Unit Support";
      return;
    }

    // Intro: serial as the heading, technical metadata beneath
    introEyebrow.textContent = "E-Compressor unit";
    unitTitle.textContent = unit.serial;
    unitTitle.classList.add("is-serial");
    unitSubtitle.textContent = "Manuals, training and support for this unit.";

    const docCount = unit.documents.length;
    unitMeta.innerHTML = [
      UI.metaItem({ label: "Model", value: unit.model || "–" }),
      UI.metaItem({ label: "Status", html: UI.status(unit.status || "Active") }),
      UI.metaItem({ label: "Documentation", value: `${docCount} manual${docCount === 1 ? "" : "s"}` })
    ].join("");
    unitMeta.classList.remove("hidden");

    // Documents
    UI.renderList($("docList"), unit.documents, UI.documentRow);

    // Support panel
    $("supportSerial").textContent = unit.serial;
    const btnIncident = $("btnIncident");
    btnIncident.href = buildIncidentUrl(unit.incidentFormBaseUrl, unit.serial);
    btnIncident.classList.toggle("hidden", !unit.incidentFormBaseUrl);
    $("btnEmail").href = buildEmailLink(unit.serial, unit.supportEmail);

    unitSection.classList.remove("hidden");
    errorSection.classList.add("hidden");

    document.title = `${unit.serial} | E-Compressor Unit Support`;
  }

  // Initial load: serial from QR code URL (?serial=63KZ-14600)
  const initialSerial = getQuerySerial();
  if (initialSerial) {
    serialInput.value = initialSerial;
    renderForSerial(initialSerial);
  }

  // Manual serial entry
  serialForm.addEventListener("submit", e => {
    e.preventDefault();
    const value = normaliseSerial(serialInput.value);
    if (!value) {
      serialInput.focus();
      return;
    }
    serialInput.value = value;
    renderForSerial(value);
    // Update URL without reload so the link can be shared
    const params = new URLSearchParams(window.location.search);
    params.set("serial", value);
    const newUrl =
      window.location.pathname + "?" + params.toString() + window.location.hash;
    window.history.replaceState({}, "", newUrl);
  });
});
