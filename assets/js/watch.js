/* Pemutar video dengan kontrol sendiri. */

const P = {
  item: null,
  ep: 1,
  hideTimer: null,
  toastTimer: null,
  saveTick: 0,
  upNextShown: false,
};

const $ = (sel) => document.querySelector(sel);

const video = $("#video");
const shell = $("#shell");
const scrub = $("#scrub");
const played = $("#played");
const buffered = $("#buffered");
const knob = $("#knob");
const tip = $("#tip");
const toastEl = $("#toast");

/* ---------------- pemuatan judul ---------------- */

function parseParams() {
  const q = new URLSearchParams(location.search);
  const item = BY_ID[q.get("id")] || CATALOG[0];
  const ep = Math.max(1, Math.min(episodeCount(item) || 1, Number(q.get("ep")) || 0)) || 1;
  return { item, ep };
}

function currentEpisode() {
  return P.item.type === "series" ? P.item.episodes[P.ep - 1] : null;
}

function nextEpisode() {
  if (P.item.type !== "series") return null;
  return P.item.episodes[P.ep] || null;
}

function load() {
  const { item, ep } = parseParams();
  P.item = item;
  P.ep = ep;
  P.upNextShown = false;

  const epi = currentEpisode();
  document.title = `${item.title}${epi ? ` — E${epi.n} ${epi.title}` : ""} · LAYARIN`;
  $("#title").textContent = item.title;
  $("#subtitle").textContent = epi
    ? `Musim 1 · Episode ${epi.n} — ${epi.title}`
    : `${item.year} · ${item.genres.join(", ")}`;

  const errBox = document.getElementById("playerError");
  if (errBox) errBox.hidden = true;
  video.poster = "";
  shell.style.backgroundImage = ART.backdrop(item);
  video.src = item.src;
  video.load();

  /* lanjutkan dari posisi terakhir (episode yang sama saja) */
  const prog = Store.progressFor(item.id);
  if (prog && (P.item.type === "film" || prog.ep === ep) && prog.t > 12) {
    video.addEventListener(
      "loadedmetadata",
      () => {
        video.currentTime = Math.min(prog.t, video.duration - 5);
        toast(`Dilanjutkan dari ${fmtClock(prog.t)}`);
      },
      { once: true }
    );
  }

  renderUpNext();
}

/* ---------------- kontrol dasar ---------------- */

function togglePlay() {
  if (video.paused) video.play().catch(() => toast("Tidak bisa memutar sumber ini"));
  else video.pause();
}

function skip(sec) {
  video.currentTime = Math.max(0, Math.min(video.duration || 0, video.currentTime + sec));
  toast(`${sec > 0 ? "+" : ""}${sec} detik`);
}

function setVolume(v) {
  video.volume = Math.max(0, Math.min(1, v));
  video.muted = video.volume === 0;
  $("#volRange").value = video.muted ? 0 : video.volume;
  syncVolumeIcon();
}

function syncVolumeIcon() {
  const on = !video.muted && video.volume > 0;
  $("#volBtn").innerHTML = on
    ? '<svg viewBox="0 0 24 24"><path d="M4 9v6h4l5 4V5L8 9H4Z"/><path d="M16.5 8.5a5 5 0 0 1 0 7" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/><path d="M19 6a8.5 8.5 0 0 1 0 12" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/></svg>'
    : '<svg viewBox="0 0 24 24"><path d="M4 9v6h4l5 4V5L8 9H4Z"/><path d="m16 9.5 5 5M21 9.5l-5 5" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round"/></svg>';
  $("#volBtn").setAttribute("aria-label", on ? "Bisukan" : "Bunyikan");
}

function syncPlayIcon() {
  const paused = video.paused;
  $("#playBtn").innerHTML = paused
    ? '<svg viewBox="0 0 24 24"><path d="M7 4.5v15a1 1 0 0 0 1.53.85l12-7.5a1 1 0 0 0 0-1.7l-12-7.5A1 1 0 0 0 7 4.5Z"/></svg>'
    : '<svg viewBox="0 0 24 24"><path d="M7 4h3.4v16H7zM13.6 4H17v16h-3.4z"/></svg>';
  $("#playBtn").setAttribute("aria-label", paused ? "Putar" : "Jeda");
  $("#bigPlay").hidden = !paused || video.currentTime > 0;
}

const SPEEDS = [0.5, 0.75, 1, 1.25, 1.5, 2];
function cycleSpeed() {
  const i = SPEEDS.indexOf(video.playbackRate);
  const next = SPEEDS[(i + 1) % SPEEDS.length] ?? 1;
  video.playbackRate = next;
  $("#speedBtn").textContent = next + "×";
  toast(`Kecepatan ${next}×`);
}

async function toggleFullscreen() {
  try {
    if (document.fullscreenElement) await document.exitFullscreen();
    else await shell.requestFullscreen();
  } catch {
    toast("Layar penuh tidak tersedia");
  }
}

async function togglePip() {
  try {
    if (document.pictureInPictureElement) await document.exitPictureInPicture();
    else await video.requestPictureInPicture();
  } catch {
    toast("Picture-in-picture tidak tersedia");
  }
}

/* ---------------- progress bar ---------------- */

function ratioFromEvent(e) {
  const r = scrub.getBoundingClientRect();
  const x = (e.touches ? e.touches[0].clientX : e.clientX) - r.left;
  return Math.max(0, Math.min(1, x / r.width));
}

function syncProgress() {
  const d = video.duration;
  if (!isFinite(d) || d === 0) return;
  const pct = (video.currentTime / d) * 100;
  played.style.width = pct + "%";
  knob.style.left = pct + "%";
  $("#tCur").textContent = fmtClock(video.currentTime);
  $("#tDur").textContent = fmtClock(d);
  scrub.setAttribute("aria-valuenow", Math.round(video.currentTime));
  scrub.setAttribute("aria-valuemax", Math.round(d));
  scrub.setAttribute("aria-valuetext", `${fmtClock(video.currentTime)} dari ${fmtClock(d)}`);

  if (video.buffered.length) {
    const end = video.buffered.end(video.buffered.length - 1);
    buffered.style.width = Math.min(100, (end / d) * 100) + "%";
  }

  /* simpan posisi tiap ~5 detik */
  if (Date.now() - P.saveTick > 5000) {
    P.saveTick = Date.now();
    Store.save(P.item.id, { time: video.currentTime, duration: d, ep: P.ep });
  }

  /* tawarkan episode berikutnya di 60 detik terakhir */
  if (nextEpisode() && d - video.currentTime < 60 && !P.upNextShown) {
    P.upNextShown = true;
    $("#upNext").hidden = false;
  }
}

function wireScrub() {
  let dragging = false;

  const seekTo = (e) => {
    const d = video.duration;
    if (!isFinite(d)) return;
    video.currentTime = ratioFromEvent(e) * d;
    syncProgress();
  };

  scrub.addEventListener("pointerdown", (e) => {
    dragging = true;
    scrub.classList.add("is-dragging");
    scrub.setPointerCapture(e.pointerId);
    seekTo(e);
  });

  scrub.addEventListener("pointermove", (e) => {
    const d = video.duration;
    if (isFinite(d)) {
      const r = ratioFromEvent(e);
      tip.textContent = fmtClock(r * d);
      tip.style.left = r * 100 + "%";
    }
    if (dragging) seekTo(e);
  });

  const end = () => {
    dragging = false;
    scrub.classList.remove("is-dragging");
  };
  scrub.addEventListener("pointerup", end);
  scrub.addEventListener("pointercancel", end);

  scrub.addEventListener("keydown", (e) => {
    const step = e.shiftKey ? 30 : 5;
    if (e.key === "ArrowRight") { e.preventDefault(); skip(step); }
    if (e.key === "ArrowLeft") { e.preventDefault(); skip(-step); }
  });
}

/* ---------------- UI tambahan ---------------- */

function showError() {
  $("#spinner").hidden = true;
  $("#bigPlay").hidden = true;
  $("#playerError").hidden = false;
  shell.classList.remove("hide-ui");
}

function toast(msg) {
  toastEl.textContent = msg;
  toastEl.classList.add("show");
  clearTimeout(P.toastTimer);
  P.toastTimer = setTimeout(() => toastEl.classList.remove("show"), 1100);
}

function pokeUI() {
  shell.classList.remove("hide-ui");
  clearTimeout(P.hideTimer);
  P.hideTimer = setTimeout(() => {
    if (!video.paused) shell.classList.add("hide-ui");
  }, 2800);
}

function renderUpNext() {
  const next = nextEpisode();
  const box = $("#upNext");
  box.hidden = true;
  if (!next) return;
  $("#upNextThumb").style.backgroundImage = ART.thumb(P.item);
  $("#upNextTitle").textContent = `E${next.n} · ${next.title}`;
  $("#upNextDesc").textContent = fmtDuration(next.dur);
}

function goToEpisode(n) {
  Store.save(P.item.id, { time: video.currentTime, duration: video.duration, ep: P.ep });
  const url = `watch.html?id=${P.item.id}&ep=${n}`;
  history.pushState({}, "", url);
  load();
  video.play().catch(() => {});
}

/* ---------------- init ---------------- */

function init() {
  load();
  wireScrub();
  syncVolumeIcon();
  syncPlayIcon();

  $("#playBtn").addEventListener("click", togglePlay);
  $("#bigPlay").addEventListener("click", togglePlay);
  $("#back10").addEventListener("click", () => skip(-10));
  $("#fwd10").addEventListener("click", () => skip(10));
  $("#speedBtn").addEventListener("click", cycleSpeed);
  $("#fsBtn").addEventListener("click", toggleFullscreen);
  $("#pipBtn").addEventListener("click", togglePip);
  $("#volBtn").addEventListener("click", () => {
    video.muted = !video.muted;
    $("#volRange").value = video.muted ? 0 : video.volume;
    syncVolumeIcon();
  });
  $("#volRange").addEventListener("input", (e) => setVolume(Number(e.target.value)));
  $("#upNextGo").addEventListener("click", () => {
    const next = nextEpisode();
    if (next) goToEpisode(next.n);
  });

  video.addEventListener("click", togglePlay);
  video.addEventListener("dblclick", toggleFullscreen);
  video.addEventListener("play", () => { syncPlayIcon(); pokeUI(); });
  video.addEventListener("pause", () => {
    syncPlayIcon();
    shell.classList.remove("hide-ui");
    Store.save(P.item.id, { time: video.currentTime, duration: video.duration, ep: P.ep });
  });
  video.addEventListener("timeupdate", syncProgress);
  video.addEventListener("progress", syncProgress);
  video.addEventListener("loadedmetadata", syncProgress);
  video.addEventListener("waiting", () => ($("#spinner").hidden = false));
  video.addEventListener("playing", () => ($("#spinner").hidden = true));
  video.addEventListener("canplay", () => ($("#spinner").hidden = true));
  video.addEventListener("error", showError);
  video.addEventListener("stalled", () => ($("#spinner").hidden = false));
  video.addEventListener("loadstart", () => ($("#playerError").hidden = true));
  $("#retryBtn").addEventListener("click", () => {
    $("#playerError").hidden = true;
    $("#spinner").hidden = false;
    video.load();
    video.play().catch(() => {});
  });
  video.addEventListener("ended", () => {
    Store.clear(P.item.id);
    const next = nextEpisode();
    if (next) goToEpisode(next.n);
    else shell.classList.remove("hide-ui");
  });
  video.addEventListener("volumechange", syncVolumeIcon);

  /* simpan posisi saat halaman ditinggalkan */
  addEventListener("pagehide", () =>
    Store.save(P.item.id, { time: video.currentTime, duration: video.duration, ep: P.ep })
  );

  /* sembunyikan UI otomatis */
  ["pointermove", "pointerdown", "keydown"].forEach((ev) =>
    shell.addEventListener(ev, pokeUI)
  );
  pokeUI();

  /* pintasan papan ketik */
  addEventListener("keydown", (e) => {
    if (/^(INPUT|TEXTAREA)$/.test(document.activeElement.tagName)) return;
    // Scrub bar punya penanganan panah sendiri (langkah 5/30 detik).
    if (e.defaultPrevented || e.target === scrub) return;
    switch (e.key) {
      case " ":
      case "k": e.preventDefault(); togglePlay(); break;
      case "ArrowRight": e.preventDefault(); skip(10); break;
      case "ArrowLeft": e.preventDefault(); skip(-10); break;
      case "j": skip(-10); break;
      case "l": skip(10); break;
      case "ArrowUp": e.preventDefault(); setVolume(video.volume + 0.1); toast(`Volume ${Math.round(video.volume * 100)}%`); break;
      case "ArrowDown": e.preventDefault(); setVolume(video.volume - 0.1); toast(`Volume ${Math.round(video.volume * 100)}%`); break;
      case "m": video.muted = !video.muted; syncVolumeIcon(); toast(video.muted ? "Bisu" : "Suara aktif"); break;
      case "f": toggleFullscreen(); break;
      case "p": togglePip(); break;
      case "Escape": if (!document.fullscreenElement) location.href = "index.html"; break;
      default:
        if (/^[0-9]$/.test(e.key) && isFinite(video.duration)) {
          video.currentTime = (Number(e.key) / 10) * video.duration;
        }
    }
  });

  addEventListener("popstate", load);
}

document.addEventListener("DOMContentLoaded", init);
