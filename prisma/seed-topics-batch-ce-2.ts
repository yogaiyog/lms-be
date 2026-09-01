import { PrismaClient } from "@prisma/client";

interface BatchCode2Level {
  code: string;
  label: string;
  url: string;
}

interface BatchCode2Unit {
  id: string;
  title: string;
  goals: string;
  tools: string;
  materialLink: string | null;
  levels: BatchCode2Level[];
  quiz: {
    code: string;
    questions: {
      question: string;
      choices: { content: string; isCorrect: boolean; feedback: string }[];
    }[];
  };
}

interface BatchCode2Capstone {
  id: string;
  title: string;
  label: string;
  url: string;
  exampleProjectLink?: string;
}

const batchCode2Units: BatchCode2Unit[] = [
  {
    id: "dance",
    title: "Dance Party & Event",
    goals: "Belajar event-driven programming melalui Dance Party dan Sports",
    tools: "Browser, code.org",
    materialLink: "https://canva.link/v0yqt6azp0bca18",
    levels: [
      {
        code: "7a",
        label: "1",
        url: "https://studio.code.org/courses/dance/units/1/lessons/1/levels/1?section_id=6590433&viewAs=Instructor",
      },
      {
        code: "7b",
        label: "2",
        url: "https://studio.code.org/courses/sports/units/1/lessons/1/levels/1?section_id=6590433&viewAs=Instructor",
      },
    ],
    quiz: {
      code: "7-quiz",
      questions: [
        {
          question: "Apa yang dimaksud dengan event-driven programming?",
          choices: [
            { content: "Pemrograman yang berjalan berdasarkan urutan dari atas ke bawah", isCorrect: false, feedback: "Itu pemrograman sekuensial, bukan event-driven." },
            { content: "Pemrograman dimana kode berjalan sebagai respons terhadap event/kejadian", isCorrect: true, feedback: "Benar! Program menunggu event, lalu meresponsnya." },
            { content: "Pemrograman tanpa menggunakan kode", isCorrect: false, feedback: "Event-driven tetap pakai kode." },
            { content: "Pemrograman untuk membuat game dansa", isCorrect: false, feedback: "Bukan hanya untuk dansa." },
          ],
        },
        {
          question: "Dalam Dance Party, apa yang terjadi saat kamu menekan tombol panah?",
          choices: [
            { content: "Karakter menari mengikuti instruksi yang sudah diprogram", isCorrect: true, feedback: "Benar! Tombol panah memicu event yang membuat karakter melakukan gerakan dance." },
            { content: "Karakter berhenti bergerak", isCorrect: false, feedback: "Justru bergerak sesuai kode." },
            { content: "Musik berhenti", isCorrect: false, feedback: "Musik tidak otomatis berhenti." },
            { content: "Tidak terjadi apa-apa", isCorrect: false, feedback: "Pasti ada yang terjadi! Itu namanya event." },
          ],
        },
        {
          question: "Apa perbedaan antara event click dan event key press?",
          choices: [
            { content: "Click dengan mouse, key press dengan keyboard", isCorrect: true, feedback: "Benar! Click pakai mouse, key press pakai keyboard." },
            { content: "Click lebih cepat dari key press", isCorrect: false, feedback: "Kecepatan tergantung user, bukan jenis event." },
            { content: "Key press hanya untuk game", isCorrect: false, feedback: "Key press bisa dipakai di berbagai program." },
            { content: "Tidak ada perbedaan", isCorrect: false, feedback: "Sumber inputnya berbeda: mouse vs keyboard." },
          ],
        },
        {
          question: "Mengapa event penting dalam pembuatan game?",
          choices: [
            { content: "Agar game bisa berinteraksi dengan pemain", isCorrect: true, feedback: "Benar! Event memungkinkan pemain berinteraksi dengan game." },
            { content: "Agar game terlihat bagus", isCorrect: false, feedback: "Tampilan visual, bukan fungsi event." },
            { content: "Agar game tidak membosankan", isCorrect: false, feedback: "Interaksi membuat game seru, bukan event itu sendiri." },
            { content: "Agar game berjalan otomatis", isCorrect: false, feedback: "Event justru butuh input dari pemain." },
          ],
        },
        {
          question: "Manakah yang BUKAN merupakan contoh event?",
          choices: [
            { content: "Mengklik tombol", isCorrect: false, feedback: "Klik adalah event." },
            { content: "Menekan keyboard", isCorrect: false, feedback: "Key press adalah event." },
            { content: "Warna background biru", isCorrect: true, feedback: "Benar! Warna bukan event, hanya properti." },
            { content: "Menggerakkan mouse", isCorrect: false, feedback: "Mouse move adalah event." },
          ],
        },
      ],
    },
  },
  {
    id: "typing",
    title: "Mengetik 10 Jari",
    goals: "Belajar dasar-dasar mengetik dengan posisi jari yang benar dan mengenal tombol keyboard",
    tools: "Browser, edclub, code.org",
    materialLink: "https://canva.link/s5zgilny8t6rome",
    levels: [
      {
        code: "8a",
        label: "1",
        url: "https://www.edclub.com/sportal/program-16.game",
      },
      {
        code: "8b",
        label: "2",
        url: "https://studio.code.org/courses/gumball/units/1/lessons/1/levels/1",
      },
    ],
    quiz: {
      code: "8-quiz",
      questions: [
        {
          question: "Apa posisi jari yang benar saat mengetik?",
          choices: [
            { content: "Jari-jari diletakkan di atas tombol home row (ASDF JKL;)", isCorrect: true, feedback: "Benar! Home row adalah posisi awal jari yang benar." },
            { content: "Hanya menggunakan 2 jari telunjuk", isCorrect: false, feedback: "Mengetik 10 jari lebih cepat dan efisien." },
            { content: "Jari-jari diletakkan di sembarang tombol", isCorrect: false, feedback: "Posisi awal harus teratur untuk mengetik cepat." },
            { content: "Menggunakan satu tangan saja", isCorrect: false, feedback: "Gunakan kedua tangan untuk hasil maksimal." },
          ],
        },
        {
          question: "Mengapa kita perlu belajar mengetik dengan benar?",
          choices: [
            { content: "Agar bisa mengetik lebih cepat dan tidak melihat keyboard", isCorrect: true, feedback: "Benar! Mengetik 10 jari meningkatkan kecepatan dan efisiensi." },
            { content: "Agar jari tidak sakit", isCorrect: false, feedback: "Justru posisi salah yang bikin sakit." },
            { content: "Agar keyboard tidak cepat rusak", isCorrect: false, feedback: "Keyboard dirancang untuk dipakai." },
            { content: "Hanya untuk lomba mengetik", isCorrect: false, feedback: "Skill ini berguna sehari-hari." },
          ],
        },
        {
          question: "Tombol apakah yang disebut sebagai home row?",
          choices: [
            { content: "A S D F J K L ;", isCorrect: true, feedback: "Benar! Itu adalah baris tengah keyboard tempat jari beristirahat." },
            { content: "Q W E R T Y U I O P", isCorrect: false, feedback: "Itu baris atas, bukan home row." },
            { content: "Z X C V B N M", isCorrect: false, feedback: "Itu baris bawah." },
            { content: "1 2 3 4 5 6 7 8 9 0", isCorrect: false, feedback: "Itu baris angka." },
          ],
        },
        {
          question: "Apa yang dimaksud dengan touch typing?",
          choices: [
            { content: "Mengetik sambil melihat keyboard", isCorrect: false, feedback: "Touch typing justru tanpa melihat keyboard." },
            { content: "Mengetik tanpa melihat keyboard, mengandalkan rasa jari", isCorrect: true, feedback: "Benar! Touch typing adalah kemampuan mengetik buta." },
            { content: "Mengetik dengan satu jari", isCorrect: false, feedback: "Bukan. Touch typing pakai 10 jari." },
            { content: "Mengetik sambil tiduran", isCorrect: false, feedback: "Bukan masalah posisi tubuh." },
          ],
        },
        {
          question: "Skill mengetik yang baik membantu dalam hal apa?",
          choices: [
            { content: "Menulis kode program lebih cepat", isCorrect: true, feedback: "Benar! Coding butuh mengetik cepat dan akurat." },
            { content: "Membuat komputer lebih pintar", isCorrect: false, feedback: "Komputer tidak terpengaruh kecepatan ketik." },
            { content: "Membuat game lebih seru", isCorrect: false, feedback: "Bukan langsung ke game." },
            { content: "Menghemat listrik", isCorrect: false, feedback: "Tidak ada hubungannya." },
          ],
        },
      ],
    },
  },
  {
    id: "problem",
    title: "Problem Solving dengan Algoritma",
    goals: "Belajar cara memecahkan masalah dengan langkah-langkah algoritma yang sistematis",
    tools: "Browser, code.org",
    materialLink: "https://canva.link/yn6fnf59navxa9e",
    levels: [
      {
        code: "9a",
        label: "1",
        url: "https://studio.code.org/courses/spelling-bee-2021/units/1/lessons/1/levels/3",
      },
      {
        code: "9b",
        label: "2",
        url: "https://studio.code.org/courses/hero/units/1/lessons/1/levels/1?section_id=6590433&viewAs=Instructor",
      },
    ],
    quiz: {
      code: "9-quiz",
      questions: [
        {
          question: "Langkah pertama yang harus dilakukan saat menghadapi masalah adalah...",
          choices: [
            { content: "Langsung mencoba semua solusi", isCorrect: false, feedback: "Jangan terburu-buru. Pahami dulu masalahnya." },
            { content: "Memahami masalah dengan baik", isCorrect: true, feedback: "Benar! Pahami dulu masalahnya sebelum mencari solusi." },
            { content: "Menyerah", isCorrect: false, feedback: "Jangan menyerah! Setiap masalah pasti ada solusinya." },
            { content: "Bertanya ke teman", isCorrect: false, feedback: "Boleh bertanya, tapi pahami dulu masalahnya sendiri." },
          ],
        },
        {
          question: "Apa yang dimaksud dengan decomposition dalam problem solving?",
          choices: [
            { content: "Memecah masalah besar menjadi bagian-bagian kecil", isCorrect: true, feedback: "Benar! Masalah besar lebih mudah diselesaikan jika dipecah." },
            { content: "Menggabungkan beberapa masalah menjadi satu", isCorrect: false, feedback: "Kebalikannya. Justru dipecah, bukan digabung." },
            { content: "Mengabaikan masalah", isCorrect: false, feedback: "Tidak! Masalah harus dihadapi." },
            { content: "Mencari masalah baru", isCorrect: false, feedback: "Fokus pada masalah yang ada." },
          ],
        },
        {
          question: "Mengapa kita perlu menguji solusi setelah membuatnya?",
          choices: [
            { content: "Agar solusi terlihat keren", isCorrect: false, feedback: "Bukan untuk penampilan." },
            { content: "Untuk memastikan solusi berjalan dengan benar", isCorrect: true, feedback: "Benar! Pengujian memastikan tidak ada error." },
            { content: "Karena tutor menyuruh", isCorrect: false, feedback: "Bukan karena disuruh, tapi karena penting." },
            { content: "Tidak perlu diuji", isCorrect: false, feedback: "Pengujian penting untuk menemukan kesalahan." },
          ],
        },
        {
          question: "Apa itu pattern recognition dalam problem solving?",
          choices: [
            { content: "Mengenali pola yang sama dari masalah sebelumnya", isCorrect: true, feedback: "Benar! Jika polanya sama, solusinya mungkin mirip." },
            { content: "Membuat pola gambar", isCorrect: false, feedback: "Bukan masalah gambar." },
            { content: "Menghapal semua solusi", isCorrect: false, feedback: "Tidak perlu menghapal, cukup mengenali pola." },
            { content: "Menebak solusi secara acak", isCorrect: false, feedback: "Problem solving butuh logika, bukan tebakan." },
          ],
        },
        {
          question: "Apa yang harus dilakukan jika solusi pertama tidak berhasil?",
          choices: [
            { content: "Menyerah dan berhenti mencoba", isCorrect: false, feedback: "Jangan menyerah! Coba pendekatan lain." },
            { content: "Mencari tahu penyebabnya, lalu mencoba solusi lain", isCorrect: true, feedback: "Benar! Kegagalan adalah bagian dari proses belajar." },
            { content: "Memaksa solusi pertama tetap dipakai", isCorrect: false, feedback: "Jika tidak berhasil, cari alternatif." },
            { content: "Menyalahkan komputer", isCorrect: false, feedback: "Komputer hanya menjalankan perintah, evaluasi lagi kodenya." },
          ],
        },
      ],
    },
  },
  {
    id: "music",
    title: "Fungsi dengan Music",
    goals: "Belajar konsep fungsi melalui musik dan coding",
    tools: "Browser, code.org",
    materialLink: "https://canva.link/3vqipk892mrd2y0",
    levels: [
      {
        code: "10a",
        label: "1",
        url: "https://studio.code.org/courses/coding-with-music-2025/units/1/lessons/1/levels/2",
      },
    ],
    quiz: {
      code: "10-quiz",
      questions: [
        {
          question: "Apakah yang dimaksud dengan fungsi dalam pemrograman?",
          choices: [
            { content: "Blok kode yang bisa dipakai berulang kali dengan sekali panggil", isCorrect: true, feedback: "Benar! Fungsi membuat kode bisa dipakai lagi tanpa menulis ulang." },
            { content: "Tombol di keyboard", isCorrect: false, feedback: "Fungsi bukan tombol." },
            { content: "Jenis musik", isCorrect: false, feedback: "Bukan. Fungsi adalah konsep pemrograman." },
            { content: "Nama file program", isCorrect: false, feedback: "Fungsi bukan nama file." },
          ],
        },
        {
          question: "Dalam Coding with Music, apa gunanya membuat sebuah fungsi untuk sebuah nada?",
          choices: [
            { content: "Agar nada bisa dipakai berulang tanpa membuat ulang", isCorrect: true, feedback: "Benar! Fungsi nada bisa dipanggil kapan saja." },
            { content: "Agar nada terdengar lebih keras", isCorrect: false, feedback: "Volume diatur terpisah." },
            { content: "Agar nada berubah sendiri", isCorrect: false, feedback: "Fungsi tidak mengubah nada otomatis." },
            { content: "Tidak ada gunanya", isCorrect: false, feedback: "Fungsi sangat berguna!" },
          ],
        },
        {
          question: "Apa manfaat menggunakan fungsi dalam pembuatan program?",
          choices: [
            { content: "Kode menjadi lebih pendek dan tidak perlu ditulis berulang", isCorrect: true, feedback: "Benar! Fungsi membuat kode efisien." },
            { content: "Membuat komputer lebih mahal", isCorrect: false, feedback: "Tidak ada hubungannya dengan harga komputer." },
            { content: "Membuat program lebih lambat", isCorrect: false, feedback: "Fungsi tidak memperlambat." },
            { content: "Fungsi hanya untuk musik", isCorrect: false, feedback: "Fungsi bisa dipakai untuk semua jenis program." },
          ],
        },
        {
          question: "Apa yang dimaksud dengan parameter dalam fungsi?",
          choices: [
            { content: "Data yang dimasukkan ke dalam fungsi untuk diproses", isCorrect: true, feedback: "Benar! Parameter adalah input bagi fungsi." },
            { content: "Nama fungsi", isCorrect: false, feedback: "Nama fungsi bukan parameter." },
            { content: "Hasil akhir fungsi", isCorrect: false, feedback: "Itu return value, bukan parameter." },
            { content: "Jenis printer", isCorrect: false, feedback: "Tidak ada hubungannya." },
          ],
        },
        {
          question: "Manakah analogi yang tepat untuk fungsi dalam kehidupan sehari-hari?",
          choices: [
            { content: "Resep masakan — sekali dihafal, bisa dipakai kapan saja", isCorrect: true, feedback: "Benar! Seperti fungsi, resep bisa dipakai berulang kali." },
            { content: "Buku tulis baru", isCorrect: false, feedback: "Buku tulis tidak bisa dipakai ulang dengan cara yang sama." },
            { content: "Pensil warna", isCorrect: false, feedback: "Pensil bukan contoh fungsi." },
            { content: "Tas sekolah", isCorrect: false, feedback: "Tas bukan fungsi." },
          ],
        },
      ],
    },
  },
  {
    id: "eco",
    title: "Ekosistem Laut",
    goals: "Belajar tentang keseimbangan ekosistem laut dan dampak perubahan populasi makhluk hidup",
    tools: "Browser, code.org",
    materialLink: "https://canva.link/6139biq7yn6i3hu",
    levels: [
      {
        code: "11a",
        label: "1",
        url: "https://studio.code.org/courses/csc-ecosystems-2023/units/1/lessons/1/levels/1",
      },
    ],
    quiz: {
      code: "11-quiz",
      questions: [
        {
          question: "Apa yang akan terjadi jika terlalu banyak algae (ganggang) di laut?",
          choices: [
            { content: "Ikan-ikan akan senang karena banyak makanan", isCorrect: false, feedback: "Terlalu banyak algae justru berbahaya." },
            { content: "Keseimbangan ekosistem terganggu, oksigen berkurang di malam hari", isCorrect: true, feedback: "Benar! Algae berlebih menyebabkan eutrofikasi yang merusak ekosistem." },
            { content: "Air laut menjadi lebih bersih", isCorrect: false, feedback: "Justru sebaliknya, air bisa tercemar." },
            { content: "Tidak ada dampak apapun", isCorrect: false, feedback: "Pasti ada dampak pada ekosistem." },
          ],
        },
        {
          question: "Apa yang akan terjadi jika tidak ada algae di laut?",
          choices: [
            { content: "Ikan kehilangan sumber makanan utama", isCorrect: true, feedback: "Benar! Algae adalah dasar rantai makanan laut." },
            { content: "Ikan akan mencari makanan di darat", isCorrect: false, feedback: "Ikan tidak bisa hidup di darat." },
            { content: "Laut menjadi lebih jernih", isCorrect: false, feedback: "Mungkin iya, tapi ekosistem hancur." },
            { content: "Tidak berpengaruh", isCorrect: false, feedback: "Sangat berpengaruh! Algae adalah produsen." },
          ],
        },
        {
          question: "Apa yang terjadi jika populasi ikan terlalu banyak?",
          choices: [
            { content: "Ekosistem semakin sehat", isCorrect: false, feedback: "Terlalu banyak ikan juga tidak baik." },
            { content: "Algae akan habis dimakan, rantai makanan terganggu", isCorrect: true, feedback: "Benar! Overpopulasi ikan menguras sumber daya." },
            { content: "Ikan akan bermigrasi ke laut lain", isCorrect: false, feedback: "Bukan solusi, tetap mengganggu ekosistem." },
            { content: "Tidak ada efek samping", isCorrect: false, feedback: "Pasti ada efek pada keseimbangan." },
          ],
        },
        {
          question: "Apa yang dimaksud dengan rantai makanan di laut?",
          choices: [
            { content: "Urutan siapa memakan siapa di ekosistem laut", isCorrect: true, feedback: "Benar! Rantai makanan menunjukkan aliran energi." },
            { content: "Jaring-jaring untuk menangkap ikan", isCorrect: false, feedback: "Itu jaring nelayan, bukan rantai makanan." },
            { content: "Daftar harga ikan di pasar", isCorrect: false, feedback: "Bukan. Rantai makanan tentang hubungan makan-dimakan." },
            { content: "Jenis-jenis ikan di laut", isCorrect: false, feedback: "Itu keanekaragaman hayati, bukan rantai makanan." },
          ],
        },
        {
          question: "Mengapa keseimbangan ekosistem laut penting?",
          choices: [
            { content: "Agar semua makhluk hidup bisa hidup berdampingan dengan baik", isCorrect: true, feedback: "Benar! Keseimbangan menjaga keberlangsungan hidup semua makhluk." },
            { content: "Agar nelayan bisa menangkap ikan sebanyak mungkin", isCorrect: false, feedback: "Eksploitasi berlebihan merusak ekosistem." },
            { content: "Agar laut terlihat indah", isCorrect: false, feedback: "Bukan hanya soal keindahan." },
            { content: "Tidak penting sama sekali", isCorrect: false, feedback: "Sangat penting! Manusia juga bergantung pada laut." },
          ],
        },
      ],
    },
  },
  {
    id: "ml",
    title: "Machine Learning",
    goals: "Belajar dasar-dasar machine learning, cara kerja AI, dan etika penggunaannya",
    tools: "Browser, code.org, Teachable Machine",
    materialLink: "https://canva.link/2tsrpugtzo7h7s6",
    levels: [
      {
        code: "12a",
        label: "1",
        url: "https://studio.code.org/courses/oceans/units/1/lessons/1/levels/1?section_id=6590433",
      },
      {
        code: "12b",
        label: "2",
        url: "https://teachablemachine.withgoogle.com/train/image",
      },
    ],
    quiz: {
      code: "12-quiz",
      questions: [
        {
          question: "Apakah yang dimaksud dengan Machine Learning?",
          choices: [
            { content: "Komputer belajar dari data untuk mengenali pola dan membuat keputusan", isCorrect: true, feedback: "Benar! ML adalah cara komputer belajar dari contoh." },
            { content: "Mesin yang bisa berfikir seperti manusia sempurna", isCorrect: false, feedback: "ML belum bisa berpikir sempurna seperti manusia." },
            { content: "Komputer yang bisa diperbaiki sendiri", isCorrect: false, feedback: "Itu self-repair, bukan ML." },
            { content: "Robot raksasa", isCorrect: false, feedback: "Bukan. ML adalah software, bukan robot." },
          ],
        },
        {
          question: "Apa yang dimaksud dengan training data dalam ML?",
          choices: [
            { content: "Data contoh yang digunakan untuk mengajari komputer", isCorrect: true, feedback: "Benar! Training data adalah contoh-contoh yang dipelajari komputer." },
            { content: "Data nilai ulangan siswa", isCorrect: false, feedback: "Bukan. Training data khusus untuk ML." },
            { content: "Data yang dirahasiakan", isCorrect: false, feedback: "Training data justru harus tersedia untuk dipelajari." },
            { content: "Data kosong", isCorrect: false, feedback: "Data kosong tidak bisa dipakai untuk belajar." },
          ],
        },
        {
          question: "Manakah contoh penerapan Machine Learning dalam kehidupan sehari-hari?",
          choices: [
            { content: "Kalkulator menghitung 2+2", isCorrect: false, feedback: "Kalkulator pakai rumus, bukan ML." },
            { content: "Filter spam di email yang bisa mengenali email sampah", isCorrect: true, feedback: "Benar! Filter spam belajar dari pola email sebelumnya." },
            { content: "Lampu menyala saat ditekan", isCorrect: false, feedback: "Itu saklar, bukan ML." },
            { content: "Komputer yang menyala", isCorrect: false, feedback: "Itu hardware, bukan ML." },
          ],
        },
        {
          question: "Bagaimana cara Teachable Machine belajar mengenali gambar?",
          choices: [
            { content: "Dengan diberi kode program yang panjang", isCorrect: false, feedback: "Teachable Machine belajar dari contoh gambar, bukan dari kode." },
            { content: "Dengan diberi banyak contoh gambar lalu komputer mencari pola", isCorrect: true, feedback: "Benar! Semakin banyak contoh, semakin pintar ML-nya." },
            { content: "Dengan menebak secara acak", isCorrect: false, feedback: "ML tidak menebak acak, tapi belajar dari pola." },
            { content: "Dengan diinstal software khusus", isCorrect: false, feedback: "Software sudah ada, yang dibutuhkan adalah data latih." },
          ],
        },
        {
          question: "Apa yang harus diperhatikan agar AI/ML digunakan secara bertanggung jawab?",
          choices: [
            { content: "AI boleh menggantikan semua pekerjaan manusia", isCorrect: false, feedback: "AI harus membantu, bukan menggantikan manusia sepenuhnya." },
            { content: "Data yang digunakan harus adil, tidak bias, dan dijaga privasinya", isCorrect: true, feedback: "Benar! Etika AI sangat penting." },
            { content: "AI tidak perlu diawasi", isCorrect: false, feedback: "AI tetap perlu pengawasan manusia." },
            { content: "Semua keputusan bisa diserahkan ke AI", isCorrect: false, feedback: "Keputusan penting tetap harus melibatkan manusia." },
          ],
        },
      ],
    },
  },
];

const batchCode2Capstones: BatchCode2Capstone[] = [
  {
    id: "dance",
    title: "Dance Party Capstone",
    label: "Code JR Kids",
    url: "https://moshe1ch-kidi.github.io/codejrkids/",
    exampleProjectLink: "sample project 7 file download",
  },
  {
    id: "typing",
    title: "Mengetik 10 Jari Capstone",
    label: "Code JR Kids",
    url: "https://moshe1ch-kidi.github.io/codejrkids/",
    exampleProjectLink: "sample project 8 file download",
  },
  {
    id: "problem",
    title: "Problem Solving Capstone",
    label: "Code JR Kids",
    url: "https://moshe1ch-kidi.github.io/codejrkids/",
    exampleProjectLink: "sample project 9 file download",
  },
  {
    id: "music",
    title: "Fungsi dengan Music Capstone",
    label: "Music Lab",
    url: "https://studio.code.org/projects/music/",
    exampleProjectLink: "https://studio.code.org/projects/music/5424fc55-4ed3-4746-8f08-46bd0d89e350",
  },
  {
    id: "eco",
    title: "Ekosistem Laut Capstone",
    label: "Code JR Kids",
    url: "https://moshe1ch-kidi.github.io/codejrkids/",
    exampleProjectLink: "sample project 11 file download",
  },
  {
    id: "ml",
    title: "Machine Learning Capstone",
    label: "Pictoblox AI",
    url: "https://pictoblox.ai/",
    exampleProjectLink: "https://pictoblox.ai/p/xAbu6YJGRnu6xGtW6JNb",
  },
];

export async function seedBatchCodeExplorer2(
  prisma: PrismaClient,
  defaultAssessment: { id: string },
  categoryIds?: { id: string }[],
) {
  const name = "Batch-Code-Explorer-2";

  // Clean existing batch code explorer 2 tasks, topics, curriculum
  await prisma.quizQuestion.deleteMany({
    where: { quiz: { task: { topic: { curriculum: { name } } } } },
  });
  await prisma.quizAttempt.deleteMany({
    where: { quiz: { task: { topic: { curriculum: { name } } } } },
  });
  await prisma.quiz.deleteMany({
    where: { task: { topic: { curriculum: { name } } } },
  });
  await prisma.studentTopicProgress.deleteMany({
    where: { topicTask: { topic: { curriculum: { name } } } },
  });
  await prisma.curriculum.deleteMany({ where: { name } });

  const allTopics: {
    title: string;
    order: number;
    materialLink: string | null;
    goals: string;
    tools: string;
    exampleProjectLink?: string;
  }[] = [];

  for (let i = 0; i < batchCode2Units.length; i++) {
    const unit = batchCode2Units[i];
    const cap = batchCode2Capstones[i];

    allTopics.push({
      title: unit.title,
      order: i * 2,
      materialLink: unit.materialLink ?? null,
      goals: unit.goals,
      tools: unit.tools,
    });

    if (cap) {
      allTopics.push({
        title: cap.title,
        order: i * 2 + 1,
        materialLink: null,
        goals: `Proyek akhir: ${cap.title}`,
        tools: unit.tools,
        exampleProjectLink: cap.exampleProjectLink,
      });
    }
  }

  const curriculum = await prisma.curriculum.create({
    data: {
      name,
      assessmentSetId: defaultAssessment.id,
      priceBatch810: 49750,
      priceBatch35: 62250,
      pricePrivate: null,
      ...(categoryIds?.length
        ? {
            categories: {
              create: categoryIds.map((cat) => ({ categoryId: cat.id })),
            },
          }
        : {}),
      topics: {
        create: allTopics,
      },
    },
    include: { topics: true },
  });

  for (const unit of batchCode2Units) {
    const topicRow = curriculum.topics.find((t) => t.title === unit.title);
    if (!topicRow) continue;

    const tasksData = [
      ...unit.levels.map((lvl, j) => ({
        topicId: topicRow.id,
        code: `bce2_${lvl.code}`,
        label: lvl.label,
        url: lvl.url,
        order: j,
        isCapstone: false,
        type: "SCRATCH" as const,
        autoComplete: true,
      })),
      {
        topicId: topicRow.id,
        code: `bce2_${unit.quiz.code}`,
        label: "Q",
        url: null,
        order: unit.levels.length,
        isCapstone: false,
        type: "QUIZ" as const,
      },
    ];

    await prisma.topicTask.createMany({ data: tasksData });
  }

  for (const cap of batchCode2Capstones) {
    const topicRow = curriculum.topics.find((t) => t.title === cap.title);
    if (!topicRow) continue;

    await prisma.topicTask.create({
      data: {
        topicId: topicRow.id,
        code: `bce2cap-${cap.id}`,
        label: "Capstone",
        url: cap.url,
        order: 0,
        isCapstone: true,
        type: "SCRATCH",
        autoComplete: true,
      },
    });
  }

  for (const unit of batchCode2Units) {
    const topicRow = curriculum.topics.find((t) => t.title === unit.title);
    if (!topicRow) continue;

    const quizTask = await prisma.topicTask.findFirst({
      where: { code: `bce2_${unit.quiz.code}`, topicId: topicRow.id },
    });
    if (!quizTask) continue;

    await prisma.quiz.create({
      data: {
        taskId: quizTask.id,
        questions: {
          create: unit.quiz.questions.map((q) => ({
            question: q.question,
            choices: q.choices,
          })),
        },
      },
    });
  }

  const totalTasks =
    batchCode2Units.reduce((sum, u) => sum + u.levels.length + 1, 0) +
    batchCode2Capstones.length;
  console.log(
    `✓ Batch-Code-Explorer-2 curriculum seeded (${batchCode2Units.length + batchCode2Capstones.length} topics, ${totalTasks} tasks, ${batchCode2Units.length} quizzes)`,
  );
}
