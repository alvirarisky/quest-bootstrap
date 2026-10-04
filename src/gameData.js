export const GAME_CONFIG = {
  TOTAL_MISSIONS: 8,

  STORAGE_KEY: "bootstrap-brainrot-v1",
};
const cdn =
  "https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css";
export const missions = [
  {
    id: 1,
    label: "CDN BIKIN KACAU",
    subtitle: "Connect the Framework",
    type: "resource",
    prompt:
      "Aktifkan styling Bootstrap untuk layout dan komponen halaman. Pilih tag yang memuat stylesheet Bootstrap dengan benar.",
    hint: "Browser memerlukan resource CSS dengan rel stylesheet. Script saja tidak memasang styling.",
    options: [
      `<script src="${cdn}"></script>`,
      `<link rel="stylesheet" href="${cdn}">`,
      `<link rel="stylesheet" href="city.css">`,
      `<link rel="icon" href="${cdn}">`,
    ],
    answers: ["1"],
    explanation:
      'Bootstrap menyediakan class siap pakai. Tag link dengan rel="stylesheet" memuat CSS; JavaScript tidak diperlukan untuk grid dan styling dasar.',
  },
  {
    id: 2,
    label: "CONTAINER KABUR",
    subtitle: "Choose the City Boundary",
    type: "match",
    prompt:
      "Pasangkan batas setiap karakter dengan class yang sesuai. Contoh ditampilkan pada lebar layar komputer.",
    hint: "Satu pembungkus menggunakan max-width yang berubah pada breakpoint, satu lagi selalu 100% lebar.",
    fields: [
      {
        label: "A · Konten dengan batas maksimum responsif",
        options: ["container-fluid", "container"],
      },
      {
        label: "B · Konten selebar viewport",
        options: ["container", "container-fluid"],
      },
    ],
    answers: ["container", "container-fluid"],
    explanation:
      ".container memiliki max-width pada breakpoint; .container-fluid selalu selebar 100% pembungkusnya. Keduanya memiliki padding horizontal.",
  },
  {
    id: 3,
    label: "REBUTAN 12 KOLOM",
    subtitle: "Repair the Building Grid",
    type: "assembly",
    prompt:
      "Bangun pembungkus container, satu row, lalu dua kolom sama lebar. Letakkan Twin A sebelum Twin B.",
    hint: "Grid memakai pembungkus luar, baris, dan kolom. Satu baris memiliki 12 unit; bagi rata untuk dua karakter.",
    blocks: [
      '<div class="col-6">Twin B</div>',
      "</div>",
      '<div class="row">',
      '<div class="col-6">Twin A</div>',
      "</div>",
      '<div class="container">',
    ],
    answers: [
      '<div class="container">',
      '<div class="row">',
      '<div class="col-6">Twin A</div>',
      '<div class="col-6">Twin B</div>',
      "</div>",
      "</div>",
    ],
    explanation:
      "Container membungkus row. Dua col-6 di dalam row masing-masing menggunakan 6 dari 12 unit.",
  },
  {
    id: 4,
    label: "SI PALING RESPONSIF",
    subtitle: "Make the City Responsive",
    type: "responsive",
    prompt:
      "Enam karakter harus tampil 2 kolom per baris pada layar kecil dan 3 kolom per baris mulai lebar 768px. Pilih class untuk setiap karakter.",
    hint: "Lebar kolom = jumlah unit ÷ 12. Breakpoint md mulai berlaku pada 768px.",
    options: [
      "col-12 col-md-6",
      "col-6 col-md-2",
      "col-6 col-md-4",
      "col-4 col-md-6",
    ],
    answers: ["col-6 col-md-4"],
    explanation:
      "col-6 memberi lebar 50%. Mulai 768px, col-md-4 menggantinya menjadi sepertiga baris.",
  },
  {
    id: 5,
    label: "GOBLIN TUKANG KETIK",
    subtitle: "Restore the City Signs",
    type: "typography",
    prompt:
      "Pasangkan setiap papan goblin dengan class utilitas yang menghasilkan efek targetnya.",
    hint: "Perhatikan posisi teks, perubahan kapital, ketebalan, dan kemiringan. Setiap papan menguji satu efek.",
    fields: [
      {
        label: "Rata tengah",
        sample: "Tokoh utama",
        style: "text-align:center",
      },
      {
        label: "Huruf kapital semua",
        sample: "serius nih",
        style: "text-transform:uppercase",
      },
      {
        label: "Tebal",
        sample: "Mental baja",
        style: "font-weight:700",
      },
      {
        label: "Miring",
        sample: "Lagi dibenerin",
        style: "font-style:italic",
      },
    ].map((f) => ({
      ...f,
      options: ["fst-italic", "fw-bold", "text-center", "text-uppercase"],
    })),
    answers: ["text-center", "text-uppercase", "fw-bold", "fst-italic"],
    explanation:
      "text-center mengatur perataan; text-uppercase mengubah tampilan kapital; fw-bold mengatur ketebalan; fst-italic membuat teks miring.",
  },
  {
    id: 6,
    label: "LAB KOMPONEN ANEH",
    subtitle: "Repair the Components",
    type: "components",
    prompt:
      "Perbaiki tabel selang-seling, tombol utama biru, dan gambar responsif yang menjaga rasio.",
    hint: "Tabel dan tombol perlu class dasar serta varian. Gambar harus dibatasi oleh lebar induknya sambil menjaga tinggi otomatis.",
    fields: [
      {
        label: "A · Tabel: baris selang-seling",
        options: [
          "table table-bordered",
          "table table-hover",
          "table table-striped",
        ],
      },
      {
        label: "B · Tombol utama biru",
        options: ["btn-primary", "btn btn-primary", "btn btn-success"],
      },
      {
        label: "C · Gambar: max-width 100%, tinggi otomatis",
        options: ["rounded", "img-fluid", "w-25"],
      },
    ],
    answers: ["table table-striped", "btn btn-primary", "img-fluid"],
    explanation:
      "table + table-striped memberi garis selang-seling. btn + btn-primary membentuk tombol utama. img-fluid menerapkan max-width:100% dan height:auto.",
  },
  {
    id: 7,
    label: "FORM LEPAS KENDALI",
    subtitle: "Fix the Broken Form",
    type: "form",
    prompt:
      "Perbaiki input, lalu buat form bertumpuk di bawah 576px dan horizontal dengan label 2 unit serta input 10 unit mulai 576px.",
    hint: "Styling input berbeda dengan styling tombol. Untuk layout horizontal, tentukan baris serta lebar label dan input pada breakpoint sm.",
    fields: [
      { label: 'Input · class="…"', options: ["form-control", "btn", "table"] },
      {
        label: "Pembungkus label dan input",
        options: ["col-sm-2", "row", "container-fluid"],
      },
      {
        label: "Lebar label mulai 576px",
        options: ["col-2", "col-sm-10", "col-sm-2"],
      },
      {
        label: "Lebar input mulai 576px",
        options: ["col-sm-10", "col-10", "row"],
      },
    ],
    answers: ["form-control", "row", "col-sm-2", "col-sm-10"],
    explanation:
      "form-control memberi styling input. row membungkus label col-sm-2 dan input col-sm-10; keduanya bertumpuk pada layar di bawah sm.",
  },
  {
    id: 8,
    label: "SI RAJA TANPA GAYA",
    subtitle: "Restore Web City",
    type: "build",
    prompt:
      "Bangun panel layanan: container dengan max-width, satu row, panel selebar layar pada layar kecil dan separuh mulai md, judul kapital, input Bootstrap, serta tombol utama biru.",
    hint: "Gabungkan pembungkus, baris, kolom responsif, utilitas teks, dan class dasar setiap komponen. Pratinjau mengikuti pilihanmu.",
    fields: [
      { label: "Pembungkus layout", options: ["container-fluid", "container"] },
      { label: "Baris panel", options: ["row", "col-6"] },
      {
        label: "Kolom panel",
        options: ["col-6", "col-12 col-md-6", "col-12 col-md-4"],
      },
      {
        label: "Judul kapital",
        options: ["text-center", "text-uppercase", "fst-italic"],
      },
      { label: "Input layanan", options: ["form-control", "table", "btn"] },
      {
        label: "Tombol layanan",
        options: ["btn btn-success", "btn-primary", "btn btn-primary"],
      },
    ],
    answers: [
      "container",
      "row",
      "col-12 col-md-6",
      "text-uppercase",
      "form-control",
      "btn btn-primary",
    ],
    explanation:
      "Panel menggabungkan container, row, kolom responsif, utilitas teks, input form-control, dan tombol btn btn-primary. Web yang kacau kembali rapi!",
  },
];

export const incidentFlavor = [
  {
    line: "INI WEB BELUM KENAL BOOTSTRAP.",
    win: "BOOTSTRAP DATANG, GAYA MENANG.",
    tag: "KONEKSI PUTUS",
  },
  {
    line: "CONTAINER-NYA KABUR, BRAY.",
    win: "AKHIRNYA TAU BATAS JUGA.",
    tag: "LUPA BATAS",
  },
  {
    line: "ADA YANG REBUTAN KOLOM.",
    win: "6 + 6. AKHIRNYA AKUR.",
    tag: "SI KEMBAR RIBUT",
  },
  {
    line: "LAH, KOK GANTI BENTUK?",
    win: "LAYAR GANTI, TETAP RAPI.",
    tag: "BERUBAH BENTUK",
  },
  {
    line: "SIAPA YANG KASIH DIA KEYBOARD?",
    win: "TEKS RAPI, GOBLIN DIAM.",
    tag: "TEKS BERANTAKAN",
  },
  {
    line: "LAB INI AGAK MENCURIGAKAN.",
    win: "WAH, JADI KEREN BENERAN.",
    tag: "EKSPERIMEN ANEH",
  },
  {
    line: "SIAPA YANG LEPASIN INPUT?",
    win: "INPUT-NYA UDAH JINAK.",
    tag: "INPUT KABUR",
  },
  {
    line: "INI RAJA BELUM PERNAH KENA BOOTSTRAP.",
    win: "RAJA TANPA GAYA TOBAT.",
    tag: "BOS TERAKHIR",
  },
];
