// --- Simple "database" of units ---
// Replace these with your real serials + URLs.
const UNIT_DATA = [
    {
      serial: "63KZ-14600",
      model: "E-Compressor 800L",
      status: "In Service",
      manualUrl: "https://ekmuguti.github.io/e-compressor-qr/manuals/E-Compressor-Operational-Manual.pdf",
      certsUrl: "https://ekmuguti.github.io/e-compressor-qr/manuals/english-user-manual-e-compressor",
      incidentFormBaseUrl: "https://forms.office.com/e/E5dxy8FYXc"
    },
    {
      serial: "63KZ-14700",
      model: "E-Compressor 800L",
      status: "On Hire",
      manualUrl: "https://ekmuguti.github.io/e-compressor-qr/manuals/E-Compressor-Operational-Manual.pdf",
      certsUrl: "https://ekmuguti.github.io/e-compressor-qr/manuals/english-user-manual-e-compressor",
      incidentFormBaseUrl: "https://forms.office.com/e/E5dxy8FYXc"
    },
    // Add more units here...
    {
      serial: "63KZ-14800",
      model: "E-Compressor 800L",
      status: "On Hire",
      manualUrl: "https://ekmuguti.github.io/e-compressor-qr/manuals/E-Compressor-Operational-Manual.pdf",
      certsUrl: "https://ekmuguti.github.io/e-compressor-qr/manuals/english-user-manual-e-compressor",
      incidentFormBaseUrl: "https://forms.office.com/e/E5dxy8FYXc"
    },
    {
      serial: "63KZ-14900",
      model: "E-Compressor 800L",
      status: "In Service",
      manualUrl: "https://ekmuguti.github.io/e-compressor-qr/manuals/E-Compressor-Operational-Manual.pdf",
      certsUrl: "https://ekmuguti.github.io/e-compressor-qr/manuals/english-user-manual-e-compressor",
      incidentFormBaseUrl: "https://forms.office.com/e/E5dxy8FYXc"
    }
  ];
  
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
  
    const detailSerial = document.getElementById("detailSerial");
    const detailModel = document.getElementById("detailModel");
    const detailStatus = document.getElementById("detailStatus");
  
    const btnManual = document.getElementById("btnManual");
    const btnCerts = document.getElementById("btnCerts");
    const btnIncident = document.getElementById("btnIncident");
    const btnEmail = document.getElementById("btnEmail");
  
    const serialInput = document.getElementById("serialInput");
    const serialGoButton = document.getElementById("serialGoButton");
  
    function renderForSerial(serial) {
      const unit = findUnitBySerial(serial);
  
      if (!unit) {
        // Nothing found: show error
        unitTitle.textContent = "Unit not recognised";
        unitSubtitle.textContent =
          "We couldn't match this serial to a known E-Compressor.";
        unitDetails.classList.add("hidden");
        actionsSection.classList.add("hidden");
        errorSection.classList.remove("hidden");
        return;
      }
  
      // Populate header and details
      unitTitle.textContent = unit.model || "E-Compressor Unit";
      unitSubtitle.textContent = "Support tools and documentation for this unit.";
      detailSerial.textContent = unit.serial;
      detailModel.textContent = unit.model || "–";
      detailStatus.textContent = unit.status || "Active";
  
      // Populate links
      btnManual.href = unit.manualUrl || "#";
      btnManual.classList.toggle("hidden", !unit.manualUrl);
  
      btnCerts.href = unit.certsUrl || "#";
      btnCerts.classList.toggle("hidden", !unit.certsUrl);
  
      btnIncident.href = buildIncidentUrl(unit.incidentFormBaseUrl, unit.serial);
      btnIncident.classList.toggle("hidden", !unit.incidentFormBaseUrl);
  
      unitDetails.classList.remove("hidden");
      actionsSection.classList.remove("hidden");
      errorSection.classList.add("hidden");

      btnEmail.href = buildEmailLink(unit.serial);
      btnEmail.classList.remove("hidden");

    }
  
    // Initial load: try URL param
    const initialSerial = getQuerySerial();
    if (initialSerial) {
      if (serialInput) serialInput.value = initialSerial;
      renderForSerial(initialSerial);
    } else {
      unitTitle.textContent = "Enter a unit serial number";
      unitSubtitle.textContent =
        "Scan the QR code on the compressor or type the serial number below.";
    }
  
    // Manual serial entry handler
    if (serialGoButton && serialInput) {
      serialGoButton.addEventListener("click", () => {
        const value = serialInput.value;
        if (!value.trim()) return;
        renderForSerial(value);
        // Optionally update URL without reload:
        const params = new URLSearchParams(window.location.search);
        params.set("serial", normaliseSerial(value));
        const newUrl =
          window.location.pathname + "?" + params.toString() + window.location.hash;
        window.history.replaceState({}, "", newUrl);
      });
  
      // Allow Enter key in the input
      serialInput.addEventListener("keydown", e => {
        if (e.key === "Enter") {
          e.preventDefault();
          serialGoButton.click();
        }
      });
    }
  });
  