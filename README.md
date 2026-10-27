# LAYARIN

Antarmuka situs streaming ala Netflix — HTML, CSS, dan JavaScript murni.
Tanpa framework, tanpa build step, tanpa dependensi. Cukup buka `index.html`.

## Fitur

**Beranda**
- Hero judul unggulan dengan artwork dan ringkasan
- Deretan horizontal yang bisa digeser: Lanjutkan Menonton, 10 Teratas, Baru
  Ditambahkan, Serial, Film, dan beberapa deret berdasarkan genre
- Kartu dengan peringkat, label "Baru", dan bar progres tontonan
- Pencarian instan (judul, genre, pemeran, sutradara, suasana) — tekan `/`
- Filter Film / Serial / Daftar Saya
- Modal detail: sinopsis, pemeran, dan daftar episode untuk serial

**Pemutar** (`watch.html`)
- Kontrol sendiri: putar/jeda, maju–mundur 10 detik, volume, kecepatan
  (0,5×–2×), picture-in-picture, layar penuh
- Scrub bar dengan indikator buffer, tooltip waktu, drag, dan navigasi keyboard
- Melanjutkan otomatis dari posisi terakhir
- Kartu "Berikutnya" dan lanjut otomatis ke episode selanjutnya
- UI menghilang sendiri saat menonton
- State error yang jelas beserta tombol coba lagi kalau sumber gagal dimuat

**Pintasan keyboard pemutar**

| Tombol | Fungsi |
|---|---|
| `Space` / `K` | Putar / jeda |
| `←` `→` / `J` `L` | Mundur / maju 10 detik |
| `↑` `↓` | Volume |
| `M` | Bisukan |
| `F` | Layar penuh |
| `P` | Picture-in-picture |
| `0`–`9` | Lompat ke 0%–90% |
| `Esc` | Kembali ke beranda |

## Menjalankan

Butuh server statis karena halaman memuat beberapa berkas JS:

```bash
python3 -m http.server 8000
# lalu buka http://localhost:8000
```

Bisa juga dihosting apa adanya di GitHub Pages, Netlify, Vercel, atau
hosting statis mana pun — tidak ada proses build.

## Struktur

```
index.html          beranda
watch.html          halaman pemutar
assets/css/style.css
assets/js/art.js    artwork prosedural (SVG, tanpa berkas gambar)
assets/js/data.js   katalog + helper format
assets/js/store.js  localStorage: Daftar Saya & posisi tonton
assets/js/app.js    logika beranda
assets/js/watch.js  logika pemutar
```

## Mengganti isinya

Seluruh katalog ada di `assets/js/data.js` sebagai satu array. Tiap judul:

```js
{
  id: "slug-unik",           // dipakai di URL dan localStorage
  title: "Judul",
  type: "film",              // "film" atau "series"
  year: 2025,
  age: "13+",
  duration: 7200,            // detik — hanya untuk type "film"
  match: 95,                 // persentase "cocok"
  hue: 18, hueShift: 34,     // menentukan warna artwork
  genres: ["Drama"],
  tags: ["Menyentuh"],
  cast: ["Nama Pemeran"],
  director: "Nama Sutradara",
  synopsis: "…",
  src: "https://…/film.mp4", // sumber video
  episodes: [                // hanya untuk type "series"
    { n: 1, title: "Judul Episode", dur: 2820, desc: "…" },
  ],
}
```

Poster dan backdrop dibuat otomatis dari `id`, `hue`, dan `hueShift`, jadi
tidak perlu menyiapkan berkas gambar. Kalau mau memakai gambar sungguhan,
ganti pemanggilan `ART.poster()` / `ART.backdrop()` dengan URL gambarmu.

## Catatan

- Semua judul, sinopsis, nama pemeran, dan sutradara di katalog ini **fiktif**,
  dibuat untuk demo antarmuka.
- Berkas videonya memakai contoh publik dari *Google sample video bucket*
  supaya pemutar bisa diuji. Sumber ini di luar situs, jadi bisa terblokir
  jaringan tertentu — kalau itu terjadi, pemutar menampilkan pesan error dan
  tombol coba lagi. Ganti `src` dengan sumber milikmu untuk penggunaan nyata.
- Daftar Saya dan posisi tontonan disimpan di `localStorage` peramban, hanya di
  perangkat itu saja.
