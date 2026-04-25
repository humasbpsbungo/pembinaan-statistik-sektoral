// ============================================================
// EPSS 2026 — Complete Indicator Data
// 5 Domain · 19 Aspek · 38 Indikator
// ============================================================

export interface Level {
  level: number;
  nama: string;
  warna: string;
  kriteria: string;
  buktiDukung: string[];
}

export interface Indikator {
  kode: string;
  nama: string;
  deskripsi: string;
  bobotRelatif: number; // percentage relative to total IPS
  isGeneral: boolean; // true = not tied to specific statistical activity
  levels: Level[];
  pdfPage?: number;
}

export interface Aspek {
  nama: string;
  bobotAspek: number; // percentage within domain
  indikators: Indikator[];
}

export interface Domain {
  id: number;
  kode: string;
  nama: string;
  namaShort: string;
  icon: string;
  bobotDomain: number; // percentage of total IPS
  deskripsi: string;
  pdfFile?: string;
  aspeks: Aspek[];
}

// ============================================================
// Maturity level templates
// ============================================================
const LEVEL_NAMES = [
  "Rintisan",
  "Terkelola",
  "Terdefinisi",
  "Terpadu & Terukur",
  "Optimum",
];
const LEVEL_COLORS = ["#F85149", "#F0883E", "#E3B341", "#58A6FF", "#3FB950"];

function makeLevel(
  level: number,
  kriteria: string,
  buktiDukung: string[],
): Level {
  return {
    level,
    nama: LEVEL_NAMES[level - 1],
    warna: LEVEL_COLORS[level - 1],
    kriteria,
    buktiDukung,
  };
}

// ============================================================
// DOMAIN 1 — Prinsip Satu Data Indonesia (28%)
// ============================================================
const domain1: Domain = {
  id: 1,
  kode: "D1",
  nama: "Prinsip Satu Data Indonesia",
  namaShort: "Satu Data",
  icon: "🗂️",
  bobotDomain: 28,
  deskripsi:
    "Penilaian penerapan prinsip-prinsip Satu Data Indonesia yang meliputi Standar Data Statistik, Metadata Statistik, Interoperabilitas Data, dan Kode Referensi.",
  pdfFile: "domain1.pdf",
  aspeks: [
    {
      nama: "Standar Data Statistik",
      bobotAspek: 25,
      indikators: [
        {
          kode: "10101",
          nama: "Penerapan Standar Data Statistik (SDS)",
          deskripsi:
            "Data yang dihasilkan oleh produsen data harus memenuhi standar data. Jika datanya lintas instansi, maka SDS ditetapkan oleh BPS melalui regulasi SDSN.",
          bobotRelatif: 7.0,
          isGeneral: false,
          pdfPage: 1,
          levels: [
            makeLevel(1, "Seluruh/sebagian produsen belum menerapkan SDS", [
              "Tidak terpenuhinya Kriteria Bukti Dukung",
            ]),
            makeLevel(
              2,
              "Seluruh produsen menerapkan SDS; belum ada kebijakan/prosedur baku se-instansi",
              [
                "Screenshot SDSN di Aplikasi INDAH atau ms-sds.web.bps.go.id",
                "Bukti penerapan SDSN (panduan pengumpulan, metadata, publikasi)",
              ],
            ),
            makeLevel(
              3,
              "Seluruh produsen menerapkan SDS; sudah ada kebijakan/prosedur baku se-instansi",
              [
                "Bukti Level 2",
                "Dokumen kebijakan/SOP/Peraturan se-instansi terkait SDS",
              ],
            ),
            makeLevel(
              4,
              "Seluruh produsen menerapkan SDS; sudah ada reviu dan evaluasi berkala",
              ["Bukti Level 3", "Notulen/laporan reviu & evaluasi periodik"],
            ),
            makeLevel(5, "Telah dilakukan pemutakhiran SDS bersama Walidata", [
              "Bukti Level 4",
              "Dokumentasi SDS sebelum & sesudah perbaikan",
            ]),
          ],
        },
      ],
    },
    {
      nama: "Metadata Statistik",
      bobotAspek: 25,
      indikators: [
        {
          kode: "10201",
          nama: "Penerapan Metadata Statistik",
          deskripsi:
            "Data yang dihasilkan oleh produsen data harus dilengkapi dengan metadata. Metadata statistik dilaporkan ke BPS melalui aplikasi indah.bps.go.id.",
          bobotRelatif: 7.0,
          isGeneral: false,
          pdfPage: 1,
          levels: [
            makeLevel(
              1,
              "Seluruh/sebagian produsen belum menerapkan Metadata Statistik",
              ["Tidak terpenuhinya Kriteria Bukti Dukung"],
            ),
            makeLevel(
              2,
              "Seluruh produsen menerapkan Metadata Statistik; belum ada kebijakan baku se-instansi",
              [
                "Screenshot metadata kegiatan, variabel, dan indikator utama di INDAH",
                "File/screenshot MS-Keg, MS-Var, dan MS-Ind sesuai struktur BPS",
              ],
            ),
            makeLevel(
              3,
              "Seluruh produsen menerapkan Metadata; sudah ada kebijakan baku se-instansi",
              [
                "Bukti Level 2",
                "Dokumen kebijakan/SOP/Peraturan se-instansi terkait Metadata",
              ],
            ),
            makeLevel(
              4,
              "Seluruh produsen menerapkan Metadata; sudah ada reviu dan evaluasi berkala",
              ["Bukti Level 3", "Notulen/laporan reviu & evaluasi periodik"],
            ),
            makeLevel(
              5,
              "Telah dilakukan pemutakhiran Metadata bersama Walidata",
              [
                "Bukti Level 4",
                "Dokumentasi Metadata sebelum & sesudah perbaikan",
              ],
            ),
          ],
        },
      ],
    },
    {
      nama: "Interoperabilitas Data",
      bobotAspek: 25,
      indikators: [
        {
          kode: "10301",
          nama: "Penerapan Interoperabilitas Data",
          deskripsi:
            "Kemampuan data untuk dibagipakaikan antar sistem elektronik. Data harus konsisten dalam sintaksis, struktur, dan semantik serta disimpan dalam format terbuka.",
          bobotRelatif: 7.0,
          isGeneral: false,
          pdfPage: 1,
          levels: [
            makeLevel(
              1,
              "Seluruh/sebagian produsen belum menerapkan kaidah Interoperabilitas Data",
              ["Tidak terpenuhinya Kriteria Bukti Dukung"],
            ),
            makeLevel(
              2,
              "Seluruh produsen menerapkan kaidah Interoperabilitas; belum ada kebijakan baku se-instansi",
              [
                "Screenshot ketersediaan web service / API / sistem lainnya",
                "Screenshot pendaftaran pada Katalog Nasional LID (splp.layanan.go.id)",
              ],
            ),
            makeLevel(
              3,
              "Seluruh produsen menerapkan Interoperabilitas; sudah ada kebijakan baku se-instansi",
              ["Bukti Level 2", "Dokumen kebijakan/SOP/Peraturan se-instansi"],
            ),
            makeLevel(
              4,
              "Sudah ada reviu dan evaluasi berkala antar Instansi Pusat/Pemda",
              ["Bukti Level 3", "Notulen/laporan reviu & evaluasi periodik"],
            ),
            makeLevel(
              5,
              "Telah dilakukan pemutakhiran oleh Walidata berdasarkan tindak lanjut reviu",
              ["Bukti Level 4", "Dokumentasi sebelum & sesudah perbaikan"],
            ),
          ],
        },
      ],
    },
    {
      nama: "Kode Referensi dan/atau Data Induk",
      bobotAspek: 25,
      indikators: [
        {
          kode: "10401",
          nama: "Penerapan Kode Referensi",
          deskripsi:
            "Kode Referensi dan/atau Data Induk dibahas dan disepakati dalam Forum SDI, mencakup NIK, kode kewilayahan, kode Fasyankes, serta standar internasional (KBLI, KBKI, KBJI).",
          bobotRelatif: 7.0,
          isGeneral: false,
          pdfPage: 1,
          levels: [
            makeLevel(
              1,
              "Seluruh/sebagian produsen belum menerapkan Kode Referensi",
              ["Tidak terpenuhinya Kriteria Bukti Dukung"],
            ),
            makeLevel(
              2,
              "Seluruh produsen menerapkan Kode Referensi; belum ada kebijakan baku se-instansi",
              [
                "Screenshot penggunaan kode referensi pada raw data",
                "Screenshot penggunaan kode referensi pada penyajian data",
              ],
            ),
            makeLevel(
              3,
              "Seluruh produsen menerapkan Kode Referensi; sudah ada kebijakan baku se-instansi",
              ["Bukti Level 2", "Dokumen kebijakan/SOP/Peraturan se-instansi"],
            ),
            makeLevel(4, "Sudah ada reviu dan evaluasi berkala", [
              "Bukti Level 3",
              "Notulen/laporan reviu & evaluasi periodik",
            ]),
            makeLevel(
              5,
              "Pemutakhiran berdasarkan kesepakatan Forum Satu Data Indonesia",
              ["Bukti Level 4", "Dokumentasi sebelum & sesudah perbaikan"],
            ),
          ],
        },
      ],
    },
  ],
};

// ============================================================
// DOMAIN 2 — Kualitas Data (24%)
// ============================================================
const domain2: Domain = {
  id: 2,
  kode: "D2",
  nama: "Kualitas Data",
  namaShort: "Kualitas",
  icon: "📊",
  bobotDomain: 24,
  deskripsi:
    "Penilaian dimensi kualitas data statistik yang meliputi relevansi, akurasi, aktualitas & ketepatan waktu, aksesibilitas, serta keterbandingan & konsistensi.",
  pdfFile: "domain2.pdf",
  aspeks: [
    {
      nama: "Relevansi",
      bobotAspek: 21,
      indikators: [
        {
          kode: "20101",
          nama: "Relevansi Data terhadap Pengguna",
          deskripsi:
            "Relevansi mencerminkan sejauh mana data/informasi statistik dapat memenuhi kebutuhan dan bermanfaat bagi para pengguna.",
          bobotRelatif: 3.02,
          isGeneral: false,
          pdfPage: 1,
          levels: [
            makeLevel(
              1,
              "Seluruh/sebagian produsen belum menerapkan proses identifikasi Relevansi Data",
              ["Tidak ada bukti dukung; atau bukti tidak relevan"],
            ),
            makeLevel(
              2,
              "Seluruh produsen telah menerapkan; namun belum ada kebijakan/prosedur baku se-instansi",
              [
                "Dokumen keselarasan data yang dibutuhkan dengan data yang dihasilkan",
                "Foto/screenshot/notulensi kegiatan identifikasi relevansi data",
              ],
            ),
            makeLevel(
              3,
              "Seluruh produsen telah menerapkan; sudah ada kebijakan/prosedur baku se-instansi",
              [
                "Bukti Level 2",
                "Dokumen kebijakan/prosedur baku (SOP, Peraturan, SE)",
              ],
            ),
            makeLevel(4, "Sudah ada reviu dan evaluasi berkala", [
              "Bukti Level 3",
              "Notulen/laporan/catatan reviu evaluasi berkala (isu dan rekomendasi)",
            ]),
            makeLevel(
              5,
              "Telah dilakukan perbaikan berdasarkan reviu/evaluasi",
              [
                "Bukti Level 4",
                "Dokumentasi sebelum perbaikan",
                "Dokumentasi setelah perbaikan/penyempurnaan",
              ],
            ),
          ],
        },
        {
          kode: "20102",
          nama: "Proses Identifikasi Kebutuhan Data",
          deskripsi:
            "Proses investigasi dan identifikasi output data yang dibutuhkan pengguna serta sumber daya yang dibutuhkan untuk menghasilkannya.",
          bobotRelatif: 2.02,
          isGeneral: false,
          pdfPage: 1,
          levels: [
            makeLevel(
              1,
              "Seluruh/sebagian produsen belum melaksanakan proses identifikasi Kebutuhan Data",
              ["Tidak ada bukti dukung; atau bukti tidak relevan"],
            ),
            makeLevel(
              2,
              "Seluruh produsen telah melaksanakan; namun belum diatur dalam prosedur baku",
              [
                "Daftar data yang dibutuhkan pengguna",
                "Undangan, daftar hadir, notulensi pembahasan kebutuhan data",
              ],
            ),
            makeLevel(
              3,
              "Seluruh produsen telah melaksanakan; sudah ada prosedur baku se-instansi",
              [
                "Bukti Level 2",
                "Dokumen kebijakan/prosedur baku (SOP, Peraturan, SE)",
              ],
            ),
            makeLevel(4, "Sudah ada reviu dan evaluasi berkala", [
              "Bukti Level 3",
              "Notulen/laporan reviu evaluasi berkala",
            ]),
            makeLevel(
              5,
              "Telah dilakukan perbaikan berdasarkan reviu/evaluasi",
              ["Bukti Level 4", "Dokumentasi sebelum dan setelah perbaikan"],
            ),
          ],
        },
      ],
    },
    {
      nama: "Akurasi",
      bobotAspek: 16,
      indikators: [
        {
          kode: "20201",
          nama: "Penilaian Akurasi Data",
          deskripsi:
            "Akurasi merujuk pada kemampuan data dalam menjelaskan kondisi yang sebenarnya, mencakup pemeriksaan sumber data, sampling error, rule validasi, dan supervisi.",
          bobotRelatif: 3.84,
          isGeneral: false,
          pdfPage: 1,
          levels: [
            makeLevel(
              1,
              "Seluruh/sebagian produsen belum melakukan Penilaian Akurasi Data",
              ["Tidak ada bukti dukung; atau bukti tidak relevan"],
            ),
            makeLevel(
              2,
              "Seluruh produsen telah melaksanakan penilaian akurasi; namun belum ada prosedur baku",
              [
                "Dokumentasi rule validasi",
                "Laporan supervisi pemeriksaan akurasi data",
              ],
            ),
            makeLevel(3, "Sudah ada prosedur baku se-instansi", [
              "Bukti Level 2",
              "SOP/petunjuk teknis pemeriksaan data",
            ]),
            makeLevel(4, "Sudah ada reviu dan evaluasi berkala", [
              "Bukti Level 3",
              "Notulen/laporan reviu evaluasi berkala",
            ]),
            makeLevel(
              5,
              "Telah dilakukan perbaikan berdasarkan reviu/evaluasi",
              ["Bukti Level 4", "Dokumentasi sebelum dan setelah perbaikan"],
            ),
          ],
        },
      ],
    },
    {
      nama: "Aktualitas & Ketepatan Waktu",
      bobotAspek: 21,
      indikators: [
        {
          kode: "20301",
          nama: "Penjaminan Aktualitas Data",
          deskripsi:
            "Seberapa cepat data/informasi tersedia bagi pengguna, dilihat dari jeda waktu antara periode data sampai data dirilis.",
          bobotRelatif: 2.52,
          isGeneral: false,
          pdfPage: 1,
          levels: [
            makeLevel(
              1,
              "Seluruh/sebagian produsen belum melakukan Penjaminan Aktualitas Data",
              ["Tidak ada bukti dukung"],
            ),
            makeLevel(
              2,
              "Seluruh produsen telah melaksanakan; namun belum ada prosedur baku",
              [
                "Data menyertakan informasi periode pendataan, pengolahan, hingga diseminasi",
              ],
            ),
            makeLevel(3, "Sudah ada prosedur baku se-instansi", [
              "Bukti Level 2",
              "SOP/Panduan penjaminan aktualitas data",
            ]),
            makeLevel(4, "Sudah ada reviu dan evaluasi berkala", [
              "Bukti Level 3",
              "Notulen/laporan reviu evaluasi berkala",
            ]),
            makeLevel(
              5,
              "Telah dilakukan perbaikan berdasarkan reviu/evaluasi",
              ["Bukti Level 4", "Dokumentasi sebelum dan setelah perbaikan"],
            ),
          ],
        },
        {
          kode: "20302",
          nama: "Pemantauan Ketepatan Waktu Diseminasi",
          deskripsi:
            "Apakah diseminasi data sudah sesuai jadwal rilis yang dijanjikan. Harus ada Advanced Release Calendar (ARC).",
          bobotRelatif: 2.52,
          isGeneral: false,
          pdfPage: 1,
          levels: [
            makeLevel(
              1,
              "Belum melakukan Pemantauan Ketepatan Waktu Diseminasi",
              ["Tidak ada bukti dukung"],
            ),
            makeLevel(
              2,
              "Seluruh produsen telah melaksanakan; namun belum ada prosedur baku",
              [
                "ARC atau senarai rencana terbit",
                "Laporan monitoring ketepatan waktu diseminasi",
              ],
            ),
            makeLevel(3, "Sudah ada prosedur baku se-instansi", [
              "Bukti Level 2",
              "SOP penjaminan ketepatan waktu diseminasi",
            ]),
            makeLevel(4, "Sudah ada reviu dan evaluasi berkala", [
              "Bukti Level 3",
              "Notulen/laporan reviu evaluasi berkala",
            ]),
            makeLevel(
              5,
              "Telah dilakukan perbaikan berdasarkan reviu/evaluasi",
              ["Bukti Level 4", "Dokumentasi sebelum dan setelah perbaikan"],
            ),
          ],
        },
      ],
    },
    {
      nama: "Aksesibilitas",
      bobotAspek: 21,
      indikators: [
        {
          kode: "20401",
          nama: "Ketersediaan Data untuk Pengguna Data",
          deskripsi:
            "Tersedianya data/informasi beserta metadatanya bagi pengguna agar dapat dimanfaatkan untuk berbagai kebutuhan.",
          bobotRelatif: 1.71,
          isGeneral: false,
          pdfPage: 1,
          levels: [
            makeLevel(1, "Belum melakukan penjaminan ketersediaan data", [
              "Tidak ada bukti dukung",
            ]),
            makeLevel(
              2,
              "Seluruh produsen telah melaksanakan; namun belum ada prosedur baku",
              [
                "E-katalog/katalog publikasi",
                "Data statistik disertai metadata yang dapat diakses pengguna",
              ],
            ),
            makeLevel(3, "Sudah ada prosedur baku se-instansi", [
              "Bukti Level 2",
              "Dokumen kebijakan penjaminan ketersediaan data",
            ]),
            makeLevel(4, "Sudah ada reviu dan evaluasi berkala", [
              "Bukti Level 3",
              "Notulen/laporan reviu evaluasi berkala",
            ]),
            makeLevel(
              5,
              "Telah dilakukan perbaikan berdasarkan reviu/evaluasi",
              ["Bukti Level 4", "Dokumentasi sebelum dan setelah perbaikan"],
            ),
          ],
        },
        {
          kode: "20402",
          nama: "Akses Media Penyebarluasan Data",
          deskripsi:
            "Ragam media/kanal yang digunakan untuk mengakses data sesuai kesepakatan dengan pengguna utama.",
          bobotRelatif: 1.66,
          isGeneral: false,
          pdfPage: 44,
          levels: [
            makeLevel(
              1,
              "Belum melakukan penjaminan akses media penyebarluasan",
              ["Tidak ada bukti dukung"],
            ),
            makeLevel(
              2,
              "Seluruh produsen telah melaksanakan; namun belum ada prosedur baku",
              [
                "Media penyajian data telah disesuaikan dengan kebutuhan pengguna",
              ],
            ),
            makeLevel(3, "Sudah ada prosedur baku se-instansi", [
              "Bukti Level 2",
              "SOP/petunjuk teknis penentuan media penyebarluasan",
            ]),
            makeLevel(4, "Sudah ada reviu dan evaluasi berkala", [
              "Bukti Level 3",
              "Notulen/laporan reviu evaluasi berkala",
            ]),
            makeLevel(
              5,
              "Telah dilakukan perbaikan berdasarkan reviu/evaluasi",
              ["Bukti Level 4", "Dokumentasi sebelum dan setelah perbaikan"],
            ),
          ],
        },
        {
          kode: "20403",
          nama: "Penyediaan Format Data",
          deskripsi:
            "Format umum data yang disediakan untuk kemudahan pengguna (xlsx, csv, html, json, dll).",
          bobotRelatif: 1.66,
          isGeneral: false,
          pdfPage: 1,
          levels: [
            makeLevel(1, "Belum melakukan penjaminan penyediaan format data", [
              "Tidak ada bukti dukung",
            ]),
            makeLevel(
              2,
              "Seluruh produsen telah melaksanakan; namun belum ada prosedur baku",
              [
                "Dokumen permintaan format data dari pengguna",
                "Screenshot portal data dengan berbagai format (xls, csv, json)",
              ],
            ),
            makeLevel(3, "Sudah ada prosedur baku se-instansi", [
              "Bukti Level 2",
              "Kebijakan/SOP penyediaan format data",
            ]),
            makeLevel(4, "Sudah ada reviu dan evaluasi berkala", [
              "Bukti Level 3",
              "Notulen/laporan reviu evaluasi berkala",
            ]),
            makeLevel(
              5,
              "Telah dilakukan perbaikan berdasarkan reviu/evaluasi",
              ["Bukti Level 4", "Dokumentasi sebelum dan setelah perbaikan"],
            ),
          ],
        },
      ],
    },
    {
      nama: "Keterbandingan & Konsistensi",
      bobotAspek: 21,
      indikators: [
        {
          kode: "20501",
          nama: "Keterbandingan Data",
          deskripsi:
            "Kemampuan data untuk dibandingkan secara konsisten antarwaktu dan/atau antarwilayah.",
          bobotRelatif: 2.52,
          isGeneral: false,
          pdfPage: 1,
          levels: [
            makeLevel(1, "Belum melakukan penjaminan keterbandingan data", [
              "Tidak ada bukti dukung",
            ]),
            makeLevel(
              2,
              "Seluruh produsen telah melaksanakan; namun belum ada prosedur baku",
              ["Dokumen analisis keterbandingan data antarwaktu/antarwilayah"],
            ),
            makeLevel(3, "Sudah ada prosedur baku se-instansi", [
              "Bukti Level 2",
              "SOP pemeriksaan keterbandingan data",
            ]),
            makeLevel(4, "Sudah ada reviu dan evaluasi berkala", [
              "Bukti Level 3",
              "Notulen/laporan reviu evaluasi berkala",
            ]),
            makeLevel(
              5,
              "Telah dilakukan perbaikan berdasarkan reviu/evaluasi",
              ["Bukti Level 4", "Dokumentasi sebelum dan setelah perbaikan"],
            ),
          ],
        },
        {
          kode: "20502",
          nama: "Konsistensi Statistik",
          deskripsi:
            "Kemampuan data untuk konsisten ketika diperbandingkan dengan berbagai sumber data.",
          bobotRelatif: 2.52,
          isGeneral: false,
          pdfPage: 1,
          levels: [
            makeLevel(1, "Belum melakukan penjaminan konsistensi statistik", [
              "Tidak ada bukti dukung",
            ]),
            makeLevel(
              2,
              "Seluruh produsen telah melaksanakan; namun belum ada prosedur baku",
              [
                "Dokumen analisis konsistensi data dengan sumber lain",
                "Rule/prosedur pemeriksaan konsistensi",
              ],
            ),
            makeLevel(3, "Sudah ada prosedur baku se-instansi", [
              "Bukti Level 2",
              "SOP pemeriksaan konsistensi data",
            ]),
            makeLevel(4, "Sudah ada reviu dan evaluasi berkala", [
              "Bukti Level 3",
              "Notulen/laporan reviu evaluasi berkala",
            ]),
            makeLevel(
              5,
              "Telah dilakukan perbaikan berdasarkan reviu/evaluasi",
              ["Bukti Level 4", "Dokumentasi sebelum dan setelah perbaikan"],
            ),
          ],
        },
      ],
    },
  ],
};

// ============================================================
// DOMAIN 3 — Proses Bisnis Statistik (19%)
// ============================================================
function makeD3Indikator(
  kode: string,
  nama: string,
  deskripsi: string,
  bobotRelatif: number,
): Indikator {
  return {
    kode,
    nama,
    deskripsi,
    bobotRelatif,
    isGeneral: false,
          pdfPage: 1,
    levels: [
      makeLevel(1, `${nama} belum dilakukan oleh seluruh Produsen Data`, [
        "Tidak ada bukti dukung; atau bukti tidak relevan",
      ]),
      makeLevel(
        2,
        `${nama} telah dilakukan oleh setiap Produsen Data sesuai standarnya masing-masing`,
        [
          "Laporan/dokumen formal yang menunjukkan adanya aktivitas pada masing-masing kegiatan statistik",
        ],
      ),
      makeLevel(
        3,
        `${nama} telah dilakukan berdasarkan prosedur baku yang berlaku untuk seluruh Produsen Data`,
        [
          "Bukti Level 2",
          "Dokumen pengelolaan/standarisasi aktivitas di lingkungan K/L/Pemda (dokumen SBFA)",
        ],
      ),
      makeLevel(
        4,
        `${nama} telah dilakukan reviu dan evaluasi secara berkala`,
        ["Bukti Level 3", "Notulen rapat reviu dan evaluasi secara berkala"],
      ),
      makeLevel(
        5,
        `${nama} telah dilakukan pemutakhiran dalam rangka peningkatan kualitas`,
        [
          "Bukti Level 4",
          "Perbaikan tata kelola berdasarkan hasil reviu dan evaluasi",
        ],
      ),
    ],
  };
}

const domain3: Domain = {
  id: 3,
  kode: "D3",
  nama: "Proses Bisnis Statistik",
  namaShort: "Proses Bisnis",
  icon: "⚙️",
  bobotDomain: 19,
  deskripsi:
    "Penilaian tahapan proses bisnis statistik berdasarkan Generic Statistical Business Process Model (GSBPM) yang meliputi perencanaan, pengumpulan, pemeriksaan, dan penyebarluasan data.",
  pdfFile: "domain3.pdf",
  aspeks: [
    {
      nama: "Perencanaan Data",
      bobotAspek: 43,
      indikators: [
        makeD3Indikator(
          "30101",
          "Pendefinisian Kebutuhan Statistik",
          "Proses menentukan kebutuhan data berdasarkan tujuan yang ingin dicapai, mengakomodasi kebutuhan stakeholders dan Forum Data.",
          2.71,
        ),
        makeD3Indikator(
          "30102",
          "Desain Statistik",
          "Proses membuat rancangan kegiatan statistik mencakup output, konsep, metode pengumpulan, sampling, pengolahan, dan alur kerja.",
          2.71,
        ),
        makeD3Indikator(
          "30103",
          "Penyiapan Instrumen",
          "Tahap pembangunan dan pengujian instrumen yang sudah dirancang hingga siap digunakan.",
          2.71,
        ),
      ],
    },
    {
      nama: "Pengumpulan Data",
      bobotAspek: 19,
      indikators: [
        makeD3Indikator(
          "30201",
          "Proses Pengumpulan Data/Akuisisi Data",
          "Tahapan mencari data/informasi di lapangan atau akuisisi dari sumber lain.",
          2.71,
        ),
      ],
    },
    {
      nama: "Pemeriksaan Data",
      bobotAspek: 19,
      indikators: [
        makeD3Indikator(
          "30301",
          "Pengolahan Data",
          "Tahapan pengolahan data yang sudah dikumpulkan: integrasi, klasifikasi, coding, validasi, imputasi, agregasi.",
          2.71,
        ),
        makeD3Indikator(
          "30302",
          "Analisis Data",
          "Tahapan analisis data: draf output, validasi output, interpretasi, disclosure control, finalisasi.",
          2.71,
        ),
      ],
    },
    {
      nama: "Penyebarluasan Data",
      bobotAspek: 19,
      indikators: [
        makeD3Indikator(
          "30401",
          "Diseminasi Data",
          "Kegiatan penyebaran informasi statistik melalui berbagai media/saluran kepada pengguna.",
          2.71,
        ),
      ],
    },
  ],
};

// ============================================================
// DOMAIN 4 — Kelembagaan (17%)
// ============================================================
const domain4: Domain = {
  id: 4,
  kode: "D4",
  nama: "Kelembagaan",
  namaShort: "Kelembagaan",
  icon: "🏛️",
  bobotDomain: 17,
  deskripsi:
    "Penilaian lingkungan kelembagaan statistik berdasarkan UN Quality Assurance Framework (UNQAF), meliputi profesionalitas, SDM, dan pengorganisasian statistik.",
  pdfFile: "domain4.pdf",
  aspeks: [
    {
      nama: "Profesionalitas",
      bobotAspek: 35,
      indikators: [
        {
          kode: "40101",
          nama: "Penjaminan Transparansi Informasi Statistik",
          deskripsi:
            "Menetapkan hak pengguna data dalam memanfaatkan data statistik, memastikan interpretasi yang benar.",
          bobotRelatif: 1.49,
          isGeneral: true,
          pdfPage: 1,
          levels: [
            makeLevel(
              1,
              "Bukti administrasi/pelaksanaan tidak ada atau tidak relevan",
              ["Tidak ada bukti dukung"],
            ),
            makeLevel(
              2,
              "Telah dilakukan oleh setiap Produsen Data sesuai standarnya masing-masing",
              [
                "Dokumen metadata kegiatan statistik yang memuat cara pengumpulan, sumber data, konsep, dan metodologi",
                "Informasi program kerja statistik dari PPID",
              ],
            ),
            makeLevel(3, "Sudah ada kebijakan/prosedur baku se-instansi", [
              "Bukti Level 2",
              "Dokumen kebijakan Penjaminan Transparansi Informasi Statistik (Peraturan SDI, SOP)",
            ]),
            makeLevel(4, "Sudah ada reviu dan evaluasi berkala", [
              "Bukti Level 3",
              "Bukti pelaksanaan 2x reviu/evaluasi (notula rapat)",
            ]),
            makeLevel(
              5,
              "Telah dilakukan perbaikan berdasarkan reviu/evaluasi",
              [
                "Bukti Level 4",
                "Dokumen screenshot/berkas sebelum dan setelah perbaikan",
              ],
            ),
          ],
        },
        {
          kode: "40102",
          nama: "Penjaminan Netralitas & Objektivitas",
          deskripsi:
            "Menjamin data/informasi yang dihasilkan objektif sesuai keilmuan statistik dengan rujukan standar nasional dan internasional.",
          bobotRelatif: 1.49,
          isGeneral: true,
          pdfPage: 1,
          levels: [
            makeLevel(
              1,
              "Bukti administrasi/pelaksanaan tidak ada atau tidak relevan",
              ["Tidak ada bukti dukung"],
            ),
            makeLevel(2, "Telah dilakukan sesuai standar masing-masing", [
              "Dokumen pemilihan sumber data dan metodologi secara objektif",
              "Screenshot waktu rencana rilis data pada web",
              "Dokumen rilis data kepada publik/media secara objektif",
            ]),
            makeLevel(3, "Sudah ada kebijakan baku se-instansi", [
              "Bukti Level 2",
              "Dokumen kebijakan Penjaminan Netralitas & Objektivitas",
            ]),
            makeLevel(4, "Sudah ada reviu dan evaluasi berkala", [
              "Bukti Level 3",
              "Bukti 2x reviu/evaluasi (notula rapat)",
            ]),
            makeLevel(
              5,
              "Telah dilakukan perbaikan berdasarkan reviu/evaluasi",
              ["Bukti Level 4", "Dokumen sebelum dan setelah perbaikan"],
            ),
          ],
        },
        {
          kode: "40103",
          nama: "Penjaminan Kualitas Data",
          deskripsi:
            "Memberikan data dan informasi yang berkualitas kepada pengguna melalui komitmen penjaminan kualitas.",
          bobotRelatif: 1.49,
          isGeneral: true,
          pdfPage: 1,
          levels: [
            makeLevel(
              1,
              "Bukti administrasi/pelaksanaan tidak ada atau tidak relevan",
              ["Tidak ada bukti dukung"],
            ),
            makeLevel(2, "Telah dilakukan sesuai standar masing-masing", [
              "Dokumen komitmen penjaminan kualitas data",
              "SK/Surat Tugas tim penjaminan kualitas data",
            ]),
            makeLevel(3, "Sudah ada kebijakan baku se-instansi", [
              "Bukti Level 2",
              "Dokumen kebijakan Penjaminan Kualitas Data (Quality Gates, SOP)",
            ]),
            makeLevel(4, "Sudah ada reviu dan evaluasi berkala", [
              "Bukti Level 3",
              "Bukti 2x reviu/evaluasi (notula rapat)",
            ]),
            makeLevel(
              5,
              "Telah dilakukan perbaikan berdasarkan reviu/evaluasi",
              [
                "Bukti Level 4",
                "Dokumen sebelum dan setelah perbaikan Penjaminan Kualitas Data",
              ],
            ),
          ],
        },
        {
          kode: "40104",
          nama: "Penjaminan Konfidensialitas Data",
          deskripsi:
            "Menjamin kerahasiaan data individu agar tidak disalahgunakan oleh pihak yang tidak bertanggung jawab.",
          bobotRelatif: 1.49,
          isGeneral: true,
          pdfPage: 1,
          levels: [
            makeLevel(
              1,
              "Bukti administrasi/pelaksanaan tidak ada atau tidak relevan",
              ["Tidak ada bukti dukung"],
            ),
            makeLevel(2, "Telah dilakukan sesuai standar masing-masing", [
              "Dokumen pelaksanaan manajemen risiko konfidensialitas",
              "Screenshot raw data yang dianonimisasi",
              "Sertifikat SNI/ISO terkait keamanan data",
            ]),
            makeLevel(3, "Sudah ada kebijakan baku se-instansi", [
              "Bukti Level 2",
              "Dokumen kebijakan Penjaminan Konfidensialitas Data",
            ]),
            makeLevel(4, "Sudah ada reviu dan evaluasi berkala", [
              "Bukti Level 3",
              "Bukti 2x reviu/evaluasi (notula rapat)",
            ]),
            makeLevel(
              5,
              "Telah dilakukan perbaikan berdasarkan reviu/evaluasi",
              ["Bukti Level 4", "Dokumen sebelum dan setelah perbaikan"],
            ),
          ],
        },
      ],
    },
    {
      nama: "SDM yang Memadai dan Kapabel",
      bobotAspek: 30,
      indikators: [
        {
          kode: "40201",
          nama: "Penerapan Kompetensi SDM Bidang Statistik",
          deskripsi:
            "Pemenuhan SDM bidang statistik dari segi kualitas maupun kuantitas melalui jalur jabatan, pendidikan, atau penugasan.",
          bobotRelatif: 2.55,
          isGeneral: true,
          pdfPage: 1,
          levels: [
            makeLevel(
              1,
              "Pemenuhan Kompetensi SDM Bidang Statistik belum dilakukan",
              ["Tidak ada bukti dukung"],
            ),
            makeLevel(2, "Telah dilakukan sesuai perencanaan masing-masing", [
              "ABK Jabatan Statistisi + Anjab Jabatan Statistisi",
              "Ijazah lulusan Statistika",
              "Surat Tugas melaksanakan kegiatan statistik",
            ]),
            makeLevel(
              3,
              "Telah dilakukan seluruhnya di bidang proses bisnis Statistik Sektoral",
              [
                "SK Pejabat Fungsional Statistisi",
                "Sertifikat Diklat dari Pusdiklat BPS atau Lembaga Statistik Internasional",
              ],
            ),
            makeLevel(
              4,
              "Telah dilakukan peningkatan, penilaian, reviu, dan evaluasi secara berkala",
              [
                "Bukti Level 3",
                "Sertifikat Diklat bidang statistik tahun 2025",
                "2 bukti reviu/evaluasi (notula rapat)",
              ],
            ),
            makeLevel(
              5,
              "Telah dilakukan pemutakhiran dalam rangka peningkatan kualitas",
              ["Bukti Level 4", "Dokumen sebelum dan setelah perbaikan"],
            ),
          ],
        },
        {
          kode: "40202",
          nama: "Penerapan Kompetensi SDM Bidang Manajemen Data",
          deskripsi:
            "Pemenuhan SDM bidang manajemen data agar diperoleh data yang akurat, mutakhir, dan terintegrasi.",
          bobotRelatif: 2.55,
          isGeneral: true,
          pdfPage: 1,
          levels: [
            makeLevel(
              1,
              "Pemenuhan Kompetensi SDM Bidang Manajemen Data belum dilakukan",
              ["Tidak ada bukti dukung"],
            ),
            makeLevel(2, "Telah dilakukan sesuai perencanaan masing-masing", [
              "ABK Jabatan Pranata Komputer + Anjab",
              "Ijazah lulusan manajemen data",
              "Surat Tugas kegiatan manajemen data",
            ]),
            makeLevel(
              3,
              "Telah dilakukan seluruhnya di bidang proses bisnis Statistik Sektoral",
              [
                "SK Pejabat Fungsional Pranata Komputer",
                "Sertifikat Diklat bidang manajemen data",
              ],
            ),
            makeLevel(
              4,
              "Telah dilakukan peningkatan, penilaian, reviu, dan evaluasi secara berkala",
              [
                "Bukti Level 3",
                "Sertifikat Diklat bidang manajemen data tahun 2025",
                "2 bukti reviu/evaluasi (notula rapat)",
              ],
            ),
            makeLevel(
              5,
              "Telah dilakukan pemutakhiran dalam rangka peningkatan kualitas",
              ["Bukti Level 4", "Dokumen sebelum dan setelah perbaikan"],
            ),
          ],
        },
      ],
    },
    {
      nama: "Pengorganisasian Statistik",
      bobotAspek: 35,
      indikators: [
        {
          kode: "40301",
          nama: "Kolaborasi Penyelenggaraan Kegiatan Statistik",
          deskripsi:
            "Kolaborasi di setiap tahapan penyelenggaraan statistik untuk menghindari tumpang tindih/duplikasi pekerjaan.",
          bobotRelatif: 1.49,
          isGeneral: true,
          pdfPage: 1,
          levels: [
            makeLevel(1, "Kolaborasi antar unit kerja belum dilaksanakan", [
              "Tidak ada bukti dukung",
            ]),
            makeLevel(2, "Kolaborasi telah dilaksanakan secara informal", [
              "Screenshot WA antara instansi/pemda",
              "Screenshot WA antara produsen data dan walidata",
            ]),
            makeLevel(
              3,
              "Kolaborasi telah dilaksanakan oleh tim yang dibentuk secara formal",
              [
                "Dokumen formal kolaborasi internal (risalah/notula + surat undangan)",
                "SK/Surat Tugas Tim",
              ],
            ),
            makeLevel(
              4,
              "Kolaborasi dikoordinasikan oleh Kepala Instansi; reviu dan evaluasi berkala",
              [
                "Bukti Level 3",
                "SK/Surat Tugas dari Kepala Instansi",
                "2x bukti reviu/evaluasi (notula rapat)",
              ],
            ),
            makeLevel(5, "Telah dilakukan pemutakhiran peningkatan kualitas", [
              "Bukti Level 4",
              "Dokumen sebelum dan setelah perbaikan Kolaborasi",
            ]),
          ],
        },
        {
          kode: "40302",
          nama: "Penyelenggaraan Forum Satu Data Indonesia",
          deskripsi:
            "Koordinasi pembina data dan walidata melalui Forum SDI sesuai Rencana Aksi SDI.",
          bobotRelatif: 1.49,
          isGeneral: true,
          pdfPage: 1,
          levels: [
            makeLevel(1, "Walidata belum terlibat dalam Forum SDI", [
              "Tidak ada bukti dukung",
            ]),
            makeLevel(2, "Walidata telah terlibat dalam Forum SDI", [
              "Dokumen keterlibatan Forum SDI (notula, daftar hadir)",
            ]),
            makeLevel(3, "Walidata telah melaksanakan rencana aksi Forum SDI", [
              "Bukti Level 2",
              "Dokumen pelaksanaan rencana aksi SDI di instansi",
            ]),
            makeLevel(
              4,
              "Walidata telah berkolaborasi dengan Walidata lain atau Pembina Data",
              [
                "Bukti Level 3",
                "Dokumen kolaborasi dengan Walidata lain/Pembina Data",
              ],
            ),
            makeLevel(
              5,
              "Walidata telah menindaklanjuti hasil reviu dan evaluasi",
              [
                "Bukti Level 4",
                "2x bukti reviu/evaluasi",
                "Dokumen tindak lanjut reviu/evaluasi",
              ],
            ),
          ],
        },
        {
          kode: "40303",
          nama: "Kolaborasi dengan Pembina Data Statistik",
          deskripsi:
            "Kolaborasi formal dengan BPS untuk meningkatkan kualitas tata kelola manajemen dan proses produksi statistik sektoral.",
          bobotRelatif: 1.49,
          isGeneral: true,
          pdfPage: 1,
          levels: [
            makeLevel(1, "Belum ada kolaborasi dengan Pembina Data", [
              "Tidak ada bukti dukung",
            ]),
            makeLevel(2, "Sudah kolaborasi secara informal", [
              "Screenshot percakapan WA dengan Pembina Data",
            ]),
            makeLevel(
              3,
              "Tersedia dokumen resmi kolaborasi dengan Pembina Data",
              [
                "Dokumen resmi kolaborasi (surat undangan dari instansi kepada Pembina Data)",
              ],
            ),
            makeLevel(
              4,
              "Tersedia dokumen resmi + reviu dan evaluasi berkala",
              ["Bukti Level 3", "2x notulen/laporan hasil reviu evaluasi"],
            ),
            makeLevel(
              5,
              "Tersedia dokumen resmi + perbaikan sebagai tindak lanjut",
              [
                "Bukti Level 4",
                "Dokumentasi kolaborasi sebelum dan setelah perbaikan",
              ],
            ),
          ],
        },
        {
          kode: "40304",
          nama: "Pelaksanaan Tugas sebagai Walidata",
          deskripsi:
            "Peran strategis Walidata dalam ekosistem SDI: mengumpulkan, memeriksa, mengelola, dan menyebarluaskan data.",
          bobotRelatif: 1.49,
          isGeneral: true,
          pdfPage: 1,
          levels: [
            makeLevel(1, "Walidata belum ditetapkan secara resmi", [
              "Tidak ada SK/dokumen penetapan walidata",
            ]),
            makeLevel(
              2,
              "Walidata ditetapkan; tugas belum dilakukan seluruhnya",
              ["Dokumen penetapan walidata beserta rincian tugasnya"],
            ),
            makeLevel(
              3,
              "Tugas/program kerja Walidata telah dilakukan seluruhnya",
              [
                "Dokumen penetapan walidata",
                "Bukti pengumpulan/pemeriksaan/pengelolaan data sesuai SDI",
                "Bukti penyebarluasan data di Portal SDI",
                "Bukti membantu Pembina Data membina Produsen Data",
              ],
            ),
            makeLevel(
              4,
              "Tugas terpadu dengan Forum SDI; reviu dan evaluasi berkala",
              [
                "Bukti Level 3",
                "Notulen Forum SDI",
                "2x bukti reviu/evaluasi",
                "Surat evaluasi walidata",
              ],
            ),
            makeLevel(
              5,
              "Tugas Walidata telah dilakukan pemutakhiran peningkatan kualitas",
              [
                "Bukti Level 4",
                "Dokumentasi tugas walidata sebelum dan setelah perbaikan",
              ],
            ),
          ],
        },
      ],
    },
  ],
};

// ============================================================
// DOMAIN 5 — Statistik Nasional (12%)
// ============================================================
const domain5: Domain = {
  id: 5,
  kode: "D5",
  nama: "Statistik Nasional",
  namaShort: "Statistik Nasional",
  icon: "📈",
  bobotDomain: 12,
  deskripsi:
    "Penilaian pemenuhan target pelaksanaan Sistem Statistik Nasional (SSN) meliputi pemanfaatan data, pengelolaan kegiatan statistik, dan penguatan SSN berkelanjutan.",
  pdfFile: "domain5.pdf",
  aspeks: [
    {
      nama: "Pemanfaatan Data Statistik",
      bobotAspek: 34,
      indikators: [
        {
          kode: "50101",
          nama: "Penggunaan Data Statistik Dasar",
          deskripsi:
            "Pemanfaatan statistik dasar (BPS) untuk perencanaan, monev, dan/atau penyusunan kebijakan.",
          bobotRelatif: 1.39,
          isGeneral: true,
          pdfPage: 1,
          levels: [
            makeLevel(1, "Penggunaan Data Statistik Dasar belum dilakukan", [
              "Tidak ada bukti dukung",
            ]),
            makeLevel(
              2,
              "Telah dilakukan setiap Produsen Data sesuai kepentingannya masing-masing",
              [
                "Penggunaan data statistik dasar pada LPPD (IPM, kemiskinan, pertumbuhan ekonomi)",
              ],
            ),
            makeLevel(
              3,
              "Telah dilakukan bersama Walidata sesuai kepentingan instansi",
              [
                "Bukti Level 2",
                "Dokumen koordinasi penggunaan data bersama Walidata",
              ],
            ),
            makeLevel(
              4,
              "Telah dilakukan koordinasi/konsultasi dengan Pembina Data; reviu evaluasi berkala",
              [
                "Bukti Level 3",
                "Dokumen koordinasi dengan Pembina Data",
                "2x bukti reviu/evaluasi",
              ],
            ),
            makeLevel(5, "Telah dilakukan pemutakhiran peningkatan kualitas", [
              "Bukti Level 4",
              "Dokumentasi sebelum dan setelah perbaikan",
            ]),
          ],
        },
        {
          kode: "50102",
          nama: "Penggunaan Data Statistik Sektoral",
          deskripsi:
            "Pemanfaatan statistik sektoral (internal/eksternal K/L/D/I) untuk perencanaan, monev, dan/atau penyusunan kebijakan.",
          bobotRelatif: 1.35,
          isGeneral: true,
          pdfPage: 1,
          levels: [
            makeLevel(1, "Penggunaan Data Statistik Sektoral belum dilakukan", [
              "Tidak ada bukti dukung",
            ]),
            makeLevel(
              2,
              "Telah dilakukan setiap Produsen Data sesuai kepentingannya",
              ["Penggunaan data statistik sektoral pada LPPD"],
            ),
            makeLevel(
              3,
              "Telah dilakukan bersama Walidata sesuai kepentingan instansi",
              ["Bukti Level 2", "Dokumen koordinasi dengan Walidata"],
            ),
            makeLevel(
              4,
              "Telah dilakukan koordinasi/konsultasi/rekomendasi dari Pembina Data; reviu berkala",
              [
                "Bukti Level 3",
                "Dokumen koordinasi dengan Pembina Data",
                "2x bukti reviu/evaluasi",
              ],
            ),
            makeLevel(5, "Telah dilakukan pemutakhiran peningkatan kualitas", [
              "Bukti Level 4",
              "Dokumentasi sebelum dan setelah perbaikan",
            ]),
          ],
        },
        {
          kode: "50103",
          nama: "Sosialisasi dan Literasi Data Statistik",
          deskripsi:
            "Kegiatan sosialisasi dan peningkatan literasi mengenai statistik yang dihasilkan, memberikan interpretasi yang benar kepada publik.",
          bobotRelatif: 1.35,
          isGeneral: true,
          pdfPage: 1,
          levels: [
            makeLevel(1, "Sosialisasi Data Statistik belum dilakukan", [
              "Tidak ada bukti dukung",
            ]),
            makeLevel(
              2,
              "Telah dilakukan setiap Produsen Data sesuai standarnya masing-masing",
              [
                "Kegiatan sosialisasi ketersediaan data (Webinar, Pojok Statistik)",
                "Kegiatan edukasi peningkatan literasi data",
              ],
            ),
            makeLevel(
              3,
              "Telah dilakukan berdasarkan prosedur baku untuk seluruh Produsen Data",
              ["Bukti Level 2", "Dokumen prosedur baku sosialisasi statistik"],
            ),
            makeLevel(4, "Telah dilakukan reviu dan evaluasi secara berkala", [
              "Bukti Level 3",
              "2x bukti reviu/evaluasi",
            ]),
            makeLevel(5, "Telah dilakukan pemutakhiran peningkatan kualitas", [
              "Bukti Level 4",
              "Dokumentasi sebelum dan setelah perbaikan",
            ]),
          ],
        },
      ],
    },
    {
      nama: "Pengelolaan Kegiatan Statistik",
      bobotAspek: 33,
      indikators: [
        {
          kode: "50201",
          nama: "Pelaksanaan Rekomendasi Kegiatan Statistik",
          deskripsi:
            "BPS memberikan rekomendasi dalam perencanaan pengumpulan data. Kegiatan statistik harus dilaporkan ke BPS melalui Romantik Online.",
          bobotRelatif: 3.96,
          isGeneral: false,
          pdfPage: 1,
          levels: [
            makeLevel(
              1,
              "Pemberitahuan rancangan kegiatan ke BPS belum dilaksanakan",
              ["Tidak ada bukti dukung"],
            ),
            makeLevel(
              2,
              "Telah dilaksanakan setiap Produsen Data sesuai standarnya",
              ["Bukti pengajuan rancangan kegiatan statistik ke BPS"],
            ),
            makeLevel(
              3,
              "Telah dilaksanakan berdasarkan prosedur baku; dikoordinasikan Walidata; telah menerima rekomendasi BPS",
              [
                "Pengajuan di Romantik Online dan telah menerima surat rekomendasi",
                "Nomor rekomendasi pada instrumen survei",
                "SOP panduan pengajuan rekomendasi",
              ],
            ),
            makeLevel(4, "Telah dilakukan reviu dan evaluasi secara berkala", [
              "Bukti Level 3",
              "2x notulen/laporan hasil reviu evaluasi",
            ]),
            makeLevel(5, "Telah dilakukan pemutakhiran peningkatan kualitas", [
              "Bukti Level 4",
              "Dokumentasi sebelum dan setelah perbaikan",
            ]),
          ],
        },
      ],
    },
    {
      nama: "Penguatan SSN Berkelanjutan",
      bobotAspek: 33,
      indikators: [
        {
          kode: "50301",
          nama: "Perencanaan Pembangunan Statistik",
          deskripsi:
            "Penyusunan dan pelaksanaan Rencana Aksi SDI sebagai turunan dari rekomendasi Forum SDI.",
          bobotRelatif: 1.31,
          isGeneral: true,
          pdfPage: 1,
          levels: [
            makeLevel(1, "Perencanaan Pembangunan Statistik belum disusun", [
              "Tidak ada bukti dukung",
            ]),
            makeLevel(2, "Perencanaan telah disusun dan ditetapkan", [
              "Rencana Aksi SDI (Kepgub/SK)",
              "Rencana kerja penyelenggaraan statistik sektoral",
            ]),
            makeLevel(3, "Perencanaan telah dilaksanakan", [
              "Bukti Level 2",
              "Bukti pelaksanaan rencana aksi/rencana kerja",
            ]),
            makeLevel(
              4,
              "Telah dilakukan reviu/evaluasi bersama Pembina Data Statistik",
              ["Bukti Level 3", "2x notula rapat reviu/evaluasi bersama BPS"],
            ),
            makeLevel(5, "Telah dilakukan pemutakhiran peningkatan kualitas", [
              "Bukti Level 4",
              "Dokumentasi sebelum dan setelah perbaikan",
            ]),
          ],
        },
        {
          kode: "50302",
          nama: "Penyebarluasan Data",
          deskripsi:
            "Penyebarluasan dilakukan satu pintu oleh walidata melalui portal SDI.",
          bobotRelatif: 1.31,
          isGeneral: true,
          pdfPage: 1,
          levels: [
            makeLevel(1, "Penyebarluasan Data belum dilakukan", [
              "Tidak ada bukti dukung",
            ]),
            makeLevel(
              2,
              "Dilakukan setiap Produsen Data untuk kepentingan masing-masing",
              ["Bukti penyebarluasan data secara mandiri"],
            ),
            makeLevel(
              3,
              "Telah dilakukan oleh Walidata untuk kepentingan instansi",
              ["Screenshot portal data instansi yang dikelola walidata"],
            ),
            makeLevel(
              4,
              "Telah dilakukan melalui Portal SDI (data.go.id) dan/atau JIGN; reviu evaluasi berkala",
              [
                "Bukti terhubung Portal SDI",
                "Screenshot monitoring portal",
                "2x bukti reviu/evaluasi",
              ],
            ),
            makeLevel(5, "Telah dilakukan pemutakhiran peningkatan kualitas", [
              "Bukti Level 4",
              "Dokumentasi sebelum dan setelah perbaikan",
            ]),
          ],
        },
        {
          kode: "50303",
          nama: "Pemanfaatan Big Data",
          deskripsi:
            "Pemanfaatan big data (3Vs/5Vs) dalam kegiatan statistik untuk real-time monitoring dan statistik pendukung.",
          bobotRelatif: 1.35,
          isGeneral: true,
          pdfPage: 1,
          levels: [
            makeLevel(1, "Pemanfaatan Big Data belum dilakukan", [
              "Tidak ada bukti dukung",
            ]),
            makeLevel(2, "Telah dilakukan dalam bentuk kajian dan eksperimen", [
              "Dokumen kajian/eksperimen/riset pemanfaatan big data",
            ]),
            makeLevel(
              3,
              "Telah dilakukan untuk menghasilkan data statistik pendukung",
              [
                "Laporan/publikasi yang memanfaatkan big data (web-scraping, sensor, streaming)",
              ],
            ),
            makeLevel(
              4,
              "Telah dilakukan reviu dan evaluasi bersama Pembina Data",
              [
                "Bukti Level 3",
                "Prosedur standar pemanfaatan big data",
                "2x bukti reviu/evaluasi bersama Pembina Data",
              ],
            ),
            makeLevel(5, "Telah dilakukan pemutakhiran peningkatan kualitas", [
              "Bukti Level 4",
              "Dokumentasi sebelum dan setelah perbaikan",
            ]),
          ],
        },
      ],
    },
  ],
};

// ============================================================
// EXPORT ALL DOMAINS
// ============================================================
export const domains: Domain[] = [domain1, domain2, domain3, domain4, domain5];

// Flat list of all indicators with domain reference
export interface FlatIndikator extends Indikator {
  domainId: number;
  domainNama: string;
  aspekNama: string;
}

export function getAllIndicators(): FlatIndikator[] {
  const result: FlatIndikator[] = [];
  for (const domain of domains) {
    for (const aspek of domain.aspeks) {
      for (const ind of aspek.indikators) {
        result.push({
          ...ind,
          domainId: domain.id,
          domainNama: domain.nama,
          aspekNama: aspek.nama,
        });
      }
    }
  }
  return result;
}

// IPS calculation
export function calculateIPS(scores: Record<string, number>): {
  ips: number;
  predikat: string;
  level: number;
  domainScores: Record<number, number>;
} {
  const allIndicators = getAllIndicators();
  let totalWeightedScore = 0;
  let totalWeight = 0;

  const domainWeightedScores: Record<number, number> = {};
  const domainTotalWeights: Record<number, number> = {};

  for (const ind of allIndicators) {
    const score = scores[ind.kode] || 1;
    const weight = ind.bobotRelatif / 100;
    totalWeightedScore += score * weight;
    totalWeight += weight;

    if (!domainWeightedScores[ind.domainId]) {
      domainWeightedScores[ind.domainId] = 0;
      domainTotalWeights[ind.domainId] = 0;
    }
    domainWeightedScores[ind.domainId] += score * weight;
    domainTotalWeights[ind.domainId] += weight;
  }

  const ips = totalWeight > 0 ? totalWeightedScore / totalWeight : 1;
  const domainScores: Record<number, number> = {};
  for (const domainId of Object.keys(domainWeightedScores)) {
    const did = Number(domainId);
    domainScores[did] =
      domainTotalWeights[did] > 0
        ? domainWeightedScores[did] / domainTotalWeights[did]
        : 1;
  }

  let predikat: string;
  let level: number;
  if (ips >= 4.2) {
    predikat = "Memuaskan";
    level = 5;
  } else if (ips >= 3.5) {
    predikat = "Sangat Baik";
    level = 4;
  } else if (ips >= 2.6) {
    predikat = "Baik";
    level = 3;
  } else if (ips >= 1.8) {
    predikat = "Cukup";
    level = 2;
  } else {
    predikat = "Kurang";
    level = 1;
  }

  return { ips: Math.round(ips * 100) / 100, predikat, level, domainScores };
}
