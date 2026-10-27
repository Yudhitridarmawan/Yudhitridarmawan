/* Halaman beranda: hero, deretan kartu, pencarian, filter, modal detail. */

const ICON = {
  play: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M7 4.5v15a1 1 0 0 0 1.53.85l12-7.5a1 1 0 0 0 0-1.7l-12-7.5A1 1 0 0 0 7 4.5Z"/></svg>',
  info: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="12" cy="12" r="9.2"/><path d="M12 11v5.5M12 7.6v.1"/></svg>',
  plus: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"><path d="M12 5v14M5 12h14"/></svg>',
  check: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="m5 12.5 4.5 4.5L19 7"/></svg>',
  close: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"><path d="M6 6l12 12M18 6 6 18"/></svg>',
  chevL: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="m15 5-7 7 7 7"/></svg>',
  chevR: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="m9 5 7 7-7 7"/></svg>',
  search: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="11" cy="11" r="7"/><path d="m16.5 16.5 4 4"/></svg>',
};

const el = (sel, root = document) => root.querySelector(sel);
const els = (sel, root = document) => [...root.querySelectorAll(sel)];

const app = {
  view: "beranda",
  query: "",
};

/* ---------------- kartu ---------------- */

function cardHTML(item, { rank } = {}) {
  const prog = Store.progressFor(item.id);
  const pct = prog ? Math.min(100, (prog.t / prog.d) * 100) : 0;
  const kind = item.type === "series" ? `${episodeCount(item)} episode` : fmtDuration(item.duration);
  const badge = rank
    ? `<span class="card-badge top">#${rank} hari ini</span>`
    : item.isNew
    ? '<span class="card-badge">Baru</span>'
    : "";

  return `
    <button class="card" data-id="${item.id}" aria-label="${item.title}">
      <span class="card-poster" style="background-image:${ART.poster(item)}">
        ${badge}
        <span class="card-title-overlay">${item.title}</span>
        ${pct ? `<span class="card-progress"><i style="width:${pct.toFixed(1)}%"></i></span>` : ""}
      </span>
      <span class="card-info">
        <span class="match">${item.match}%</span>
        <span>${item.year}</span>
        <span>·</span>
        <span>${kind}</span>
      </span>
    </button>`;
}

/* ---------------- deret horizontal ---------------- */

function rowHTML(title, items, { ranked } = {}) {
  if (!items.length) return "";
  const cards = items.map((m, i) => cardHTML(m, { rank: ranked ? i + 1 : 0 })).join("");
  return `
    <section class="row">
      <div class="row-head">
        <h2>${title}</h2>
        <span class="count">${items.length} judul</span>
      </div>
      <div class="rail-wrap">
        <button class="rail-btn" data-dir="prev" aria-label="Geser kiri" hidden>${ICON.chevL}</button>
        <div class="rail">${cards}</div>
        <button class="rail-btn" data-dir="next" aria-label="Geser kanan">${ICON.chevR}</button>
      </div>
    </section>`;
}

function wireRails(root) {
  els(".rail-wrap", root).forEach((wrap) => {
    const rail = el(".rail", wrap);
    const prev = el('[data-dir="prev"]', wrap);
    const next = el('[data-dir="next"]', wrap);

    const sync = () => {
      const max = rail.scrollWidth - rail.clientWidth - 4;
      prev.hidden = rail.scrollLeft <= 4;
      next.hidden = rail.scrollLeft >= max;
    };

    prev.addEventListener("click", () => rail.scrollBy({ left: -rail.clientWidth * 0.85 }));
    next.addEventListener("click", () => rail.scrollBy({ left: rail.clientWidth * 0.85 }));
    rail.addEventListener("scroll", sync, { passive: true });
    addEventListener("resize", sync);
    sync();
  });
}

/* ---------------- hero ---------------- */

function renderHero() {
  const featured = [...CATALOG].sort((a, b) => (a.trending || 99) - (b.trending || 99))[0];
  const host = el("#hero");
  const inList = Store.inList(featured.id);
  const kind =
    featured.type === "series" ? `${episodeCount(featured)} episode` : fmtDuration(featured.duration);

  host.innerHTML = `
    <div class="hero-art" style="background-image:${ART.backdrop(featured)}"></div>
    <div class="hero-body">
      <p class="hero-kicker"><b>#1</b> Paling banyak ditonton minggu ini</p>
      <h1>${featured.title}</h1>
      <div class="meta">
        <span class="match">${featured.match}% cocok</span>
        <span>${featured.year}</span>
        <span class="pill">${featured.age}</span>
        <span>${kind}</span>
        <span>${featured.genres.join(" · ")}</span>
      </div>
      <p class="synopsis">${featured.synopsis}</p>
      <div class="hero-actions">
        <a class="btn btn-play" href="watch.html?id=${featured.id}">${ICON.play} Putar</a>
        <button class="btn btn-ghost" data-info="${featured.id}">${ICON.info} Info Selengkapnya</button>
        <button class="btn btn-icon ${inList ? "is-on" : ""}" data-list="${featured.id}"
          aria-label="${inList ? "Hapus dari Daftar Saya" : "Tambah ke Daftar Saya"}">
          ${inList ? ICON.check : ICON.plus}
        </button>
      </div>
    </div>`;
}

/* ---------------- view ---------------- */

function matchesQuery(item, q) {
  const hay = [item.title, ...item.genres, ...item.tags, ...item.cast, item.director || ""]
    .join(" ")
    .toLowerCase();
  return hay.includes(q);
}

function render() {
  const hero = el("#hero");
  const rows = el("#rows");
  const gridView = el("#grid-view");
  const q = app.query.trim().toLowerCase();

  els(".nav-links button").forEach((b) =>
    b.setAttribute("aria-current", String(b.dataset.view === app.view && !q))
  );

  if (q) {
    const hits = CATALOG.filter((m) => matchesQuery(m, q));
    hero.hidden = true;
    rows.hidden = true;
    gridView.hidden = false;
    gridView.innerHTML = `
      <h2>Hasil untuk “${app.query.trim()}”</h2>
      <p class="sub">${hits.length} judul ditemukan</p>
      ${
        hits.length
          ? `<div class="grid">${hits.map((m) => cardHTML(m)).join("")}</div>`
          : `<div class="empty"><strong>Tidak ada yang cocok</strong>Coba kata kunci lain, misalnya genre atau nama pemeran.</div>`
      }`;
    return;
  }

  if (app.view === "film" || app.view === "serial" || app.view === "list") {
    const map = {
      film: { title: "Film", items: CATALOG.filter((m) => m.type === "film") },
      serial: { title: "Serial", items: CATALOG.filter((m) => m.type === "series") },
      list: {
        title: "Daftar Saya",
        items: Store.list().map((id) => BY_ID[id]).filter(Boolean),
      },
    }[app.view];

    hero.hidden = true;
    rows.hidden = true;
    gridView.hidden = false;
    gridView.innerHTML = `
      <h2>${map.title}</h2>
      <p class="sub">${map.items.length} judul</p>
      ${
        map.items.length
          ? `<div class="grid">${map.items.map((m) => cardHTML(m)).join("")}</div>`
          : `<div class="empty"><strong>Masih kosong</strong>Tekan tombol + pada judul mana pun untuk menyimpannya di sini.</div>`
      }`;
    return;
  }

  /* beranda */
  hero.hidden = false;
  rows.hidden = false;
  gridView.hidden = true;
  renderHero();

  const trending = [...CATALOG].filter((m) => m.trending).sort((a, b) => a.trending - b.trending);
  const myList = Store.list().map((id) => BY_ID[id]).filter(Boolean);
  const resume = Store.continueWatching();

  rows.innerHTML = [
    rowHTML("Lanjutkan Menonton", resume),
    rowHTML("10 Teratas di Indonesia Hari Ini", trending.slice(0, 10), { ranked: true }),
    rowHTML("Daftar Saya", myList),
    rowHTML("Baru Ditambahkan", CATALOG.filter((m) => m.isNew)),
    rowHTML("Serial Original LAYARIN", CATALOG.filter((m) => m.type === "series")),
    rowHTML("Film Pilihan", CATALOG.filter((m) => m.type === "film")),
    rowHTML("Drama yang Menyentuh", CATALOG.filter((m) => m.genres.includes("Drama"))),
    rowHTML("Adrenalin Tinggi", CATALOG.filter((m) => ["Aksi", "Thriller", "Horor"].some((g) => m.genres.includes(g)))),
  ].join("");

  wireRails(rows);
}

/* ---------------- modal detail ---------------- */

function openModal(id) {
  const item = BY_ID[id];
  if (!item) return;

  const inList = Store.inList(id);
  const prog = Store.progressFor(id);
  const resumeEp = prog?.ep || 1;
  const kind =
    item.type === "series" ? `${episodeCount(item)} episode` : fmtDuration(item.duration);
  const playLabel = prog ? "Lanjutkan" : "Putar";
  const playHref = `watch.html?id=${id}${item.type === "series" ? `&ep=${resumeEp}` : ""}`;

  const episodes =
    item.type === "series"
      ? `<div class="eps">
          <h3>Episode <span style="color:var(--text-faint);font-weight:400">· Musim 1</span></h3>
          ${item.episodes
            .map(
              (e) => `
            <a class="ep" href="watch.html?id=${id}&ep=${e.n}">
              <span class="ep-num">${e.n}</span>
              <span class="ep-thumb" style="background-image:${ART.thumb(item)}"></span>
              <span>
                <span class="ep-title">${e.title}</span>
                <span class="ep-desc">${e.desc}</span>
              </span>
              <span class="ep-dur">${fmtDuration(e.dur)}</span>
            </a>`
            )
            .join("")}
        </div>`
      : "";

  const backdrop = document.createElement("div");
  backdrop.className = "modal-backdrop";
  backdrop.innerHTML = `
    <div class="modal" role="dialog" aria-modal="true" aria-label="${item.title}">
      <button class="modal-close" aria-label="Tutup">${ICON.close}</button>
      <div class="modal-hero" style="background-image:${ART.backdrop(item)}">
        <h2>${item.title}</h2>
      </div>
      <div class="modal-body">
        <div class="modal-actions">
          <a class="btn btn-play" href="${playHref}">${ICON.play} ${playLabel}</a>
          <button class="btn btn-icon ${inList ? "is-on" : ""}" data-list="${id}"
            aria-label="${inList ? "Hapus dari Daftar Saya" : "Tambah ke Daftar Saya"}">
            ${inList ? ICON.check : ICON.plus}
          </button>
        </div>
        <div class="modal-cols">
          <div>
            <div class="meta">
              <span class="match">${item.match}% cocok</span>
              <span>${item.year}</span>
              <span class="pill">${item.age}</span>
              <span>${kind}</span>
            </div>
            <p>${item.synopsis}</p>
          </div>
          <div class="facts">
            <b>Pemeran:</b> <span>${item.cast.join(", ")}</span><br>
            ${item.director ? `<b>Sutradara:</b> <span>${item.director}</span><br>` : ""}
            <b>Genre:</b> <span>${item.genres.join(", ")}</span><br>
            <b>Suasana:</b> <span>${item.tags.join(", ")}</span>
          </div>
        </div>
        ${episodes}
      </div>
    </div>`;

  document.body.appendChild(backdrop);
  document.body.classList.add("no-scroll");

  const close = () => {
    backdrop.remove();
    document.body.classList.remove("no-scroll");
    document.removeEventListener("keydown", onKey);
  };
  const onKey = (e) => e.key === "Escape" && close();

  backdrop.addEventListener("click", (e) => {
    if (e.target === backdrop || e.target.closest(".modal-close")) close();
  });
  document.addEventListener("keydown", onKey);
  el(".modal-close", backdrop).focus();
}

/* ---------------- daftar saya ---------------- */

function toggleList(id, btn) {
  const added = Store.toggle(id);
  btn.classList.toggle("is-on", added);
  btn.innerHTML = added ? ICON.check : ICON.plus;
  btn.setAttribute("aria-label", added ? "Hapus dari Daftar Saya" : "Tambah ke Daftar Saya");
  // Segarkan deret/grid "Daftar Saya"; modal tetap terbuka karena berada di body.
  if (app.view === "list" || (app.view === "beranda" && !app.query)) render();
}

/* ---------------- init ---------------- */

function init() {
  el("#year").textContent = new Date().getFullYear();
  render();

  /* klik global */
  document.addEventListener("click", (e) => {
    const listBtn = e.target.closest("[data-list]");
    if (listBtn) {
      e.preventDefault();
      toggleList(listBtn.dataset.list, listBtn);
      return;
    }

    const infoBtn = e.target.closest("[data-info]");
    if (infoBtn) {
      openModal(infoBtn.dataset.info);
      return;
    }

    const card = e.target.closest(".card");
    if (card) openModal(card.dataset.id);
  });

  /* navigasi */
  els(".nav-links button").forEach((btn) =>
    btn.addEventListener("click", () => {
      app.view = btn.dataset.view;
      app.query = "";
      el("#q").value = "";
      scrollTo({ top: 0 });
      render();
    })
  );

  /* pencarian */
  const input = el("#q");
  let t;
  input.addEventListener("input", () => {
    clearTimeout(t);
    t = setTimeout(() => {
      app.query = input.value;
      render();
    }, 160);
  });
  el(".search").addEventListener("click", () => input.focus());
  input.addEventListener("focus", () => el(".search").classList.add("is-open"));
  input.addEventListener("blur", () => {
    if (!input.value) el(".search").classList.remove("is-open");
  });

  /* pintasan: / untuk fokus ke pencarian */
  addEventListener("keydown", (e) => {
    if (e.key === "/" && !/^(INPUT|TEXTAREA)$/.test(document.activeElement.tagName)) {
      e.preventDefault();
      input.focus();
    }
  });

  /* navbar solid setelah scroll */
  const nav = el(".nav");
  const onScroll = () => nav.classList.toggle("is-stuck", scrollY > 24);
  addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  /* progres bisa berubah saat kembali dari halaman pemutar */
  addEventListener("pageshow", (e) => e.persisted && render());
}

document.addEventListener("DOMContentLoaded", init);
