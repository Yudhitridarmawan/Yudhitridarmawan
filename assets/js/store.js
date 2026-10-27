/* Penyimpanan lokal: Daftar Saya + posisi tonton terakhir.
   Semua akses dibungkus try/catch karena localStorage bisa diblokir
   (mode penyamaran, cookie dimatikan). */

const Store = (() => {
  const KEY_LIST = "layarin.mylist";
  const KEY_PROG = "layarin.progress";

  function read(key, fallback) {
    try {
      const raw = localStorage.getItem(key);
      return raw ? JSON.parse(raw) : fallback;
    } catch {
      return fallback;
    }
  }

  function write(key, value) {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch {
      /* diabaikan — fitur ini opsional */
    }
  }

  return {
    list: () => read(KEY_LIST, []),

    inList(id) {
      return this.list().includes(id);
    },

    toggle(id) {
      const list = this.list();
      const i = list.indexOf(id);
      if (i === -1) list.unshift(id);
      else list.splice(i, 1);
      write(KEY_LIST, list);
      return i === -1;
    },

    /* progress: { [id]: { t, d, ep, at } } */
    progress: () => read(KEY_PROG, {}),

    progressFor(id) {
      return this.progress()[id] || null;
    },

    save(id, { time, duration, ep }) {
      if (!duration || !isFinite(duration)) return;
      const all = this.progress();
      const ratio = time / duration;
      if (ratio > 0.96) delete all[id];
      else all[id] = { t: Math.floor(time), d: Math.floor(duration), ep: ep || 1, at: Date.now() };
      write(KEY_PROG, all);
    },

    clear(id) {
      const all = this.progress();
      delete all[id];
      write(KEY_PROG, all);
    },

    /* Judul yang sedang ditonton, terbaru dulu. */
    continueWatching() {
      const all = this.progress();
      return Object.entries(all)
        .sort((a, b) => b[1].at - a[1].at)
        .map(([id]) => BY_ID[id])
        .filter(Boolean);
    },
  };
})();
