/* ==========================================================
   UI components
   Small template functions that return HTML strings for UI
   rendered from data. Static components (Header, SectionHeader,
   UnitSearch, SupportPanel, Footer) are plain markup in index.html.
   Markup and class names are documented in DESIGN.md.
   ========================================================== */

const UI = (() => {
  function esc(value) {
    return String(value ?? "").replace(/[&<>"']/g, ch => ({
      "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;"
    })[ch]);
  }

  function icon(name) {
    return `<svg class="icon" aria-hidden="true"><use href="#i-${name}"/></svg>`;
  }

  // Status indicator: square marker + text, tone from STATUS_TONES
  function status(text) {
    const tone = STATUS_TONES[String(text).toLowerCase()] || "neutral";
    return `<span class="status status--${tone}">${esc(text)}</span>`;
  }

  // Metadata item: technical label/value pair (used inside <dl class="meta">)
  function metaItem({ label, value, html }) {
    return `
      <div class="meta__item">
        <dt class="meta__label">${esc(label)}</dt>
        <dd class="meta__value">${html ?? esc(value)}</dd>
      </div>`;
  }

  // DocumentRow: one technical document with a clear View action
  function documentRow(doc) {
    const details = [doc.type, doc.revision && `Rev ${doc.revision}`, doc.date, doc.meta]
      .filter(Boolean).map(esc).join(" · ");
    return `
      <li class="doc-row">
        <a class="doc-row__link" href="${esc(doc.href)}" target="_blank" rel="noopener">
          <span class="doc-row__type" aria-hidden="true">${esc(doc.type)}</span>
          <span class="doc-row__body">
            <span class="doc-row__title">${esc(doc.title)}</span>
            <span class="doc-row__details">${details}</span>
          </span>
          <span class="doc-row__action">View${icon("external")}</span>
        </a>
      </li>`;
  }

  // TrainingVideoCard: numbered procedure with thumbnail and play affordance
  function trainingVideoCard(video) {
    const url = `https://youtu.be/${encodeURIComponent(video.youtubeId)}`;
    const thumb = `https://i.ytimg.com/vi/${encodeURIComponent(video.youtubeId)}/hqdefault.jpg`;
    return `
      <li class="video-card">
        <a class="video-card__link" href="${url}" target="_blank" rel="noopener">
          <span class="video-card__thumb">
            <img src="${thumb}" alt="" loading="lazy" onerror="this.remove()" />
            <span class="video-card__play">${icon("play")}</span>
          </span>
          <span class="video-card__body">
            <span class="video-card__step">Procedure ${esc(video.step)}</span>
            <span class="video-card__title">${esc(video.title)}</span>
            <span class="video-card__desc">${esc(video.description)}</span>
            <span class="video-card__cta">Watch video${icon("external")}</span>
          </span>
        </a>
      </li>`;
  }

  // Product attribute row (product information strip)
  function attribute({ label, value }) {
    return `
      <div class="attr">
        <dt class="attr__label">${esc(label)}</dt>
        <dd class="attr__value">${esc(value)}</dd>
      </div>`;
  }

  // Render helper: fill a container with a list of items
  function renderList(container, items, component) {
    if (container) container.innerHTML = items.map(component).join("");
  }

  return { esc, icon, status, metaItem, documentRow, trainingVideoCard, attribute, renderList };
})();
