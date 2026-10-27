/* Katalog demo.
   Semua judul & sinopsis di bawah ini fiktif (dibuat untuk demo UI).
   Tiap judul punya cuplikan demo 20 detik di assets/media/ yang ikut
   dihosting bersama situs, jadi pemutar jalan tanpa server video lain.
   Ganti `src` dengan sumber milikmu sendiri saat dipakai sungguhan. */

const MEDIA = "assets/media/";

const CATALOG = [
  {
    id: "senja-di-ujung-jalan",
    title: "Senja di Ujung Jalan",
    type: "film",
    year: 2024,
    age: "13+",
    duration: 7254,
    match: 97,
    hue: 18, hueShift: 34,
    genres: ["Drama", "Keluarga"],
    tags: ["Menyentuh", "Indonesia", "Pemenang Penghargaan"],
    trending: 1,
    isNew: true,
    director: "Ratna Ayuningtyas",
    cast: ["Dewi Anggraini", "Bima Prasetyo", "Laras Wijayanti"],
    synopsis:
      "Seorang sopir angkot di pinggiran kota menemukan buku harian penumpang yang tertinggal, dan perlahan ikut menelusuri kisah hidup pemiliknya sampai ke kampung halamannya sendiri.",
    src: MEDIA + "senja-di-ujung-jalan.mp4",
  },
  {
    id: "kode-merah",
    title: "Kode Merah",
    type: "series",
    year: 2025,
    age: "17+",
    match: 94,
    hue: 350, hueShift: -40,
    genres: ["Thriller", "Kriminal"],
    tags: ["Menegangkan", "Serial Original"],
    trending: 2,
    isNew: true,
    director: "Aldi Surya",
    cast: ["Reza Mahendra", "Nadia Kusuma", "Farhan Idris"],
    synopsis:
      "Tim forensik siber sebuah bank menemukan celah keamanan yang sudah dipakai orang dalam selama bertahun-tahun. Semakin dalam mereka menggali, semakin sedikit orang yang bisa dipercaya.",
    src: MEDIA + "kode-merah.mp4",
    episodes: [
      { n: 1, title: "Pintu Belakang", dur: 2820, desc: "Sebuah transaksi janggal jam tiga pagi memicu audit dadakan yang tidak diminta siapa pun." },
      { n: 2, title: "Jejak yang Dihapus", dur: 2760, desc: "Log server hilang semalam. Rekaman CCTV lantai sembilan ikut menyusul." },
      { n: 3, title: "Orang Dalam", dur: 2940, desc: "Sidik jari digital mengarah ke rekan sendiri — tapi alibinya nyaris sempurna." },
      { n: 4, title: "Kode Merah", dur: 3180, desc: "Empat puluh delapan jam sebelum rilis laporan, seluruh sistem dikunci dari jarak jauh." },
    ],
  },
  {
    id: "nadi-kota",
    title: "Nadi Kota",
    type: "series",
    year: 2023,
    age: "13+",
    match: 91,
    hue: 205, hueShift: 44,
    genres: ["Drama", "Medis"],
    tags: ["Emosional", "Serial Original"],
    trending: 5,
    director: "Sekar Pramudita",
    cast: ["Gilang Mahesa", "Ayu Ratnasari", "Dimas Hartono"],
    synopsis:
      "Unit gawat darurat rumah sakit tertua di kota harus bertahan dengan separuh anggaran dan dua kali lipat pasien, sementara para dokter mudanya belajar kapan harus melepaskan.",
    src: MEDIA + "nadi-kota.mp4",
    episodes: [
      { n: 1, title: "Shift Pertama", dur: 2640, desc: "Hari pertama seorang residen bertepatan dengan malam paling sibuk dalam setahun." },
      { n: 2, title: "Ruang Tunggu", dur: 2580, desc: "Keluarga pasien menunggu kabar yang tak kunjung datang dari balik pintu merah." },
      { n: 3, title: "Tiga Menit", dur: 2700, desc: "Satu keputusan cepat menentukan sisa karier seseorang." },
    ],
  },
  {
    id: "gerbang-antariksa",
    title: "Gerbang Antariksa",
    type: "film",
    year: 2025,
    age: "13+",
    duration: 8340,
    match: 96,
    hue: 262, hueShift: 58,
    genres: ["Fiksi Ilmiah", "Petualangan"],
    tags: ["Visual Megah", "Epik"],
    trending: 3,
    isNew: true,
    director: "Hendra Kusnadi",
    cast: ["Tara Widjaja", "Yosef Lumban", "Kirana Dewi"],
    synopsis:
      "Sebuah stasiun riset di orbit Jupiter menerima sinyal berulang dari bawah lapisan es Europa. Kru yang dikirim untuk memverifikasinya hanya punya bekal oksigen sembilan hari.",
    src: MEDIA + "gerbang-antariksa.mp4",
  },
  {
    id: "tawa-di-warung-kopi",
    title: "Tawa di Warung Kopi",
    type: "series",
    year: 2024,
    age: "SU",
    match: 88,
    hue: 38, hueShift: -22,
    genres: ["Komedi", "Slice of Life"],
    tags: ["Ringan", "Bikin Ketawa"],
    trending: 8,
    director: "Bayu Setiawan",
    cast: ["Rizky Aditya", "Mega Puspita", "Joko Pranoto"],
    synopsis:
      "Lima pelanggan tetap sebuah warung kopi 24 jam memperdebatkan segala hal kecuali masalah mereka sendiri. Setiap episode, satu kursi kosong.",
    src: MEDIA + "tawa-di-warung-kopi.mp4",
    episodes: [
      { n: 1, title: "Kopi Tubruk Terakhir", dur: 1440, desc: "Gilingan kopi rusak tepat saat pesanan paling penting datang." },
      { n: 2, title: "Wifi Gratis", dur: 1380, desc: "Kata sandi berganti dan seisi warung kehilangan arah hidup." },
      { n: 3, title: "Kursi Nomor Empat", dur: 1500, desc: "Seseorang tak datang dua minggu berturut-turut." },
    ],
  },
  {
    id: "bayang-di-hutan",
    title: "Bayang di Hutan",
    type: "film",
    year: 2023,
    age: "17+",
    duration: 6420,
    match: 85,
    hue: 140, hueShift: -56,
    genres: ["Horor", "Misteri"],
    tags: ["Mencekam", "Folklor"],
    trending: 6,
    director: "Ika Nurhaliza",
    cast: ["Panji Baskara", "Sinta Meilani", "Rangga Putra"],
    synopsis:
      "Tim pemetaan hutan menemukan desa yang tidak tercantum di peta mana pun. Penduduknya ramah, sopan, dan tak satu pun muncul di hasil foto udara.",
    src: MEDIA + "bayang-di-hutan.mp4",
  },
  {
    id: "lintasan-terakhir",
    title: "Lintasan Terakhir",
    type: "film",
    year: 2022,
    age: "13+",
    duration: 6960,
    match: 89,
    hue: 12, hueShift: 26,
    genres: ["Olahraga", "Drama"],
    tags: ["Inspiratif", "Berdasarkan Kisah Nyata"],
    trending: 11,
    director: "Marcel Tanuwijaya",
    cast: ["Andra Wibowo", "Cindy Halim", "Bagas Nugroho"],
    synopsis:
      "Pembalap reli yang dipaksa pensiun karena cedera melatih anak montir dari bengkel pinggir kota untuk satu musim terakhir yang mustahil.",
    src: MEDIA + "lintasan-terakhir.mp4",
  },
  {
    id: "arsip-1965",
    title: "Arsip Tak Terbaca",
    type: "series",
    year: 2025,
    age: "17+",
    match: 93,
    hue: 30, hueShift: -60,
    genres: ["Dokumenter", "Sejarah"],
    tags: ["Investigatif", "Serial Original"],
    isNew: true,
    trending: 9,
    director: "Wulan Maharani",
    cast: ["Narasi oleh Arif Santosa"],
    synopsis:
      "Empat kotak dokumen yang ditemukan di gudang sebuah percetakan tua membuka kembali pertanyaan yang sudah dianggap selesai selama enam dekade.",
    src: MEDIA + "arsip-1965.mp4",
    episodes: [
      { n: 1, title: "Kotak Pertama", dur: 3000, desc: "Segel yang tak pernah dibuka sejak percetakan berhenti beroperasi." },
      { n: 2, title: "Nama-nama", dur: 2880, desc: "Daftar panjang tanpa keterangan, ditulis dengan tiga jenis tinta berbeda." },
      { n: 3, title: "Yang Masih Hidup", dur: 3120, desc: "Dua saksi bersedia bicara, satu dengan syarat." },
    ],
  },
  {
    id: "besi-dan-air-mata",
    title: "Besi dan Air Mata",
    type: "film",
    year: 2024,
    age: "17+",
    duration: 7500,
    match: 92,
    hue: 195, hueShift: -35,
    genres: ["Aksi", "Fiksi Ilmiah"],
    tags: ["Penuh Aksi", "Distopia"],
    trending: 4,
    isNew: true,
    director: "Hendra Kusnadi",
    cast: ["Tara Widjaja", "Eko Mahendra", "Prita Larasati"],
    synopsis:
      "Di kota yang dijaga mesin otonom, seorang teknisi perbaikan menemukan bahwa robot-robot itu mulai menyimpan ingatan yang seharusnya dihapus setiap malam.",
    src: MEDIA + "besi-dan-air-mata.mp4",
  },
  {
    id: "pulau-tanpa-nama",
    title: "Pulau Tanpa Nama",
    type: "film",
    year: 2021,
    age: "SU",
    duration: 5940,
    match: 86,
    hue: 165, hueShift: 40,
    genres: ["Petualangan", "Keluarga"],
    tags: ["Ceria", "Untuk Semua Umur"],
    trending: 14,
    director: "Ratna Ayuningtyas",
    cast: ["Kenzo Aditama", "Nayla Sabrina", "Om Darmo"],
    synopsis:
      "Tiga anak nelayan berlayar mencari pulau yang katanya cuma ada di cerita kakek mereka — dan menemukan sesuatu yang jauh lebih aneh.",
    src: MEDIA + "pulau-tanpa-nama.mp4",
  },
  {
    id: "jalur-utara",
    title: "Jalur Utara",
    type: "series",
    year: 2022,
    age: "13+",
    match: 84,
    hue: 220, hueShift: -30,
    genres: ["Petualangan", "Dokumenter"],
    tags: ["Perjalanan", "Santai"],
    trending: 17,
    director: "Bayu Setiawan",
    cast: ["Tim Ekspedisi Jalur Utara"],
    synopsis:
      "Perjalanan darat 4.000 kilometer menyusuri jalur pantai utara, singgah di kota-kota yang tak pernah masuk brosur wisata.",
    src: MEDIA + "jalur-utara.mp4",
    episodes: [
      { n: 1, title: "Kilometer Nol", dur: 2400, desc: "Rencana enam bulan, dua mobil, dan satu peta yang sudah kedaluwarsa." },
      { n: 2, title: "Kota yang Dilewati", dur: 2340, desc: "Berhenti di tempat yang biasanya cuma jadi papan petunjuk." },
    ],
  },
  {
    id: "sebelum-hujan",
    title: "Sebelum Hujan Reda",
    type: "film",
    year: 2023,
    age: "13+",
    duration: 6600,
    match: 90,
    hue: 235, hueShift: 22,
    genres: ["Romansa", "Drama"],
    tags: ["Manis", "Indonesia"],
    trending: 12,
    director: "Sekar Pramudita",
    cast: ["Laras Wijayanti", "Bima Prasetyo"],
    synopsis:
      "Dua orang asing berteduh di halte yang sama setiap sore selama musim hujan, tanpa pernah bertukar nama sampai hari terakhir.",
    src: MEDIA + "sebelum-hujan.mp4",
  },
];

/* ---- turunan / helper ---- */

const BY_ID = Object.fromEntries(CATALOG.map((m) => [m.id, m]));

function totalDuration(item) {
  if (item.type === "film") return item.duration;
  return item.episodes.reduce((n, e) => n + e.dur, 0);
}

function episodeCount(item) {
  return item.type === "series" ? item.episodes.length : 0;
}

function fmtDuration(sec) {
  const h = Math.floor(sec / 3600);
  const m = Math.round((sec % 3600) / 60);
  return h ? `${h}j ${m}m` : `${m}m`;
}

function fmtClock(sec) {
  if (!isFinite(sec) || sec < 0) sec = 0;
  const h = Math.floor(sec / 3600);
  const m = Math.floor((sec % 3600) / 60);
  const s = Math.floor(sec % 60);
  const pad = (n) => String(n).padStart(2, "0");
  return h ? `${h}:${pad(m)}:${pad(s)}` : `${m}:${pad(s)}`;
}
