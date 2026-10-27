/* Procedural artwork — every title gets a deterministic poster/backdrop built
   as an inline SVG, so the site has no external image dependencies. */

const ART = (() => {
  function seedFrom(str) {
    let h = 2166136261;
    for (let i = 0; i < str.length; i++) {
      h ^= str.charCodeAt(i);
      h = Math.imul(h, 16777619);
    }
    return h >>> 0;
  }

  // Small deterministic PRNG (mulberry32).
  function rng(seed) {
    let a = seed;
    return () => {
      a |= 0;
      a = (a + 0x6d2b79f5) | 0;
      let t = Math.imul(a ^ (a >>> 15), 1 | a);
      t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  }

  function svgToUrl(svg) {
    // Kutip tunggal, dan encode kedua jenis kutip, supaya aman dipakai di
    // dalam atribut style="..." pada HTML.
    const payload = encodeURIComponent(svg).replace(/'/g, "%27");
    return "url('data:image/svg+xml," + payload + "')";
  }

  function shapes(rand, w, h, hue, count) {
    let out = "";
    for (let i = 0; i < count; i++) {
      const cx = rand() * w;
      const cy = rand() * h;
      const r = (0.18 + rand() * 0.42) * Math.min(w, h);
      const l = 38 + rand() * 34;
      const hu = (hue + (rand() * 90 - 45) + 360) % 360;
      const op = (0.34 + rand() * 0.42).toFixed(2);
      out += `<circle cx="${cx.toFixed(1)}" cy="${cy.toFixed(1)}" r="${r.toFixed(1)}" fill="hsl(${hu.toFixed(0)} 78% ${l.toFixed(0)}%)" opacity="${op}"/>`;
    }
    for (let i = 0; i < 3; i++) {
      const y = rand() * h;
      const hu = (hue + rand() * 60) % 360;
      out += `<rect x="0" y="${y.toFixed(1)}" width="${w}" height="${(1 + rand() * 3).toFixed(1)}" fill="hsl(${hu.toFixed(0)} 90% 72%)" opacity="0.35"/>`;
    }
    return out;
  }

  function build(item, w, h, blurAmount, shapeCount) {
    const seed = seedFrom(item.id);
    const rand = rng(seed);
    const hue = item.hue;
    const hue2 = (hue + item.hueShift + 360) % 360;
    const gid = "g" + seed.toString(36);
    return `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}">
<defs>
<linearGradient id="${gid}" x1="0" y1="0" x2="1" y2="1">
<stop offset="0" stop-color="hsl(${hue} 62% 16%)"/>
<stop offset="0.55" stop-color="hsl(${hue2} 55% 23%)"/>
<stop offset="1" stop-color="hsl(${(hue2 + 30) % 360} 48% 9%)"/>
</linearGradient>
<filter id="b${gid}" x="-30%" y="-30%" width="160%" height="160%">
<feGaussianBlur stdDeviation="${blurAmount}"/>
</filter>
<filter id="n${gid}">
<feTurbulence type="fractalNoise" baseFrequency="0.85" numOctaves="3" seed="${seed % 500}"/>
<feColorMatrix type="saturate" values="0"/>
</filter>
</defs>
<rect width="${w}" height="${h}" fill="url(#${gid})"/>
<g filter="url(#b${gid})">${shapes(rand, w, h, hue, shapeCount)}</g>
<rect width="${w}" height="${h}" filter="url(#n${gid})" opacity="0.11"/>
<rect width="${w}" height="${h}" fill="hsl(${hue} 40% 4%)" opacity="0.22"/>
</svg>`;
  }

  return {
    poster: (item) => svgToUrl(build(item, 400, 600, 30, 7)),
    backdrop: (item) => svgToUrl(build(item, 1280, 720, 58, 8)),
    thumb: (item) => svgToUrl(build(item, 320, 180, 22, 5)),
  };
})();
