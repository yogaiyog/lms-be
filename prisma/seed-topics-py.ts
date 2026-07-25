import { PrismaClient } from "@prisma/client";

const PYTHON_EDITOR_URL =
  process.env.PYTHON_EDITOR_URL ?? "http://localhost:3000";

interface PythonLevel {
  code: string;
  label: string;
  instructions: string;
  defaultCode: string;
}

interface PythonUnit {
  id: string;
  title: string;
  goals: string;
  tools: string;
  levels: PythonLevel[];
  quiz: {
    code: string;
    label: string;
    questions: {
      question: string;
      choices: { content: string; isCorrect: boolean; feedback: string }[];
    }[];
  };
  capstone: {
    code: string;
    label: string;
    instructions: string;
    defaultCode: string;
  };
}

const pythonExplorerUnits: PythonUnit[] = [
  {
    id: "pe-intro",
    title: "Perkenalan Python & Hello World",
    goals: "Belajar fungsi print(), komentar (#), dan mengambil input dasar dengan Python",
    tools: "Python Editor",
    levels: [
      {
        code: "pe1",
        label: "1",
        instructions: `## Activity 1: Menampilkan Nama (Hello World)

Fungsi \`print()\` dalam Python dipakai untuk menampilkan output atau data ke layar komputer/console.

Buatkan baris kode untuk mencetak nama kamu di output/terminal.

Buat agar output-nya seperti ini:

\`\`\`text
nama saya lengkap (nama lengkap kamu)
saya biasa dipanggil (nama panggilan kamu)
\`\`\``,
        defaultCode: `# Tulis baris kode mu di bawah ini`,
      },
      {
        code: "pe2",
        label: "2",
        instructions: `## Activity 2: Mengenal Komentar (Comment)

Komentar diawali dengan tanda pagar \`#\`. Komentar digunakan untuk memberi catatan pada kode dan **tidak akan dijalankan** oleh komputer.

Di bawah ini ada beberapa baris kode. Ubahlah baris kode kedua menjadi komentar agar komputer hanya mencetak kalimat pertama dan ketiga!`,
        defaultCode: `print("Halo! Selamat datang di kelas Python.")
print("Baris ini rahasia, jangan sampai muncul di terminal!")
print("Ayo kita mulai belajar koding!")`,
      },
      {
        code: "pe3",
        label: "3",
        instructions: `## Activity 3: Mencetak Banyak Baris Teks

Kamu bisa menggunakan beberapa fungsi \`print()\` secara berurutan untuk mencetak teks yang terdiri dari beberapa baris.

Buatlah program yang mencetak 3 baris tentang hobi atau hal favoritmu!

Contoh output:

\`\`\`text
Hobi saya adalah bermain game.
Game favorit saya adalah Minecraft.
Saya suka bermain di akhir pekan.
\`\`\``,
        defaultCode: `# Gunakan 3 fungsi print() untuk mencetak 3 kalimat favoritmu`,
      },
      {
        code: "pe4",
        label: "4",
        instructions: `## Activity 4: Menampilkan Angka & Hitungan Dasar

Fungsi \`print()\` tidak hanya bisa mencetak teks (yang diapit tanda petik \`" "\`), tetapi juga bisa mencetak angka dan hasil perhitungan matematika tanpa tanda petik!

Cetak umurmu saat ini, lalu cetak perkiraan umurmu 5 tahun yang akan datang menggunakan penjumlahan (\`+\`).`,
        defaultCode: `# 1. Cetak umurmu saat ini (misal: 12)
print(12)

# 2. Cetak perkiraan umurmu 5 tahun lagi (gunakan operasi penjumlahan)`,
      },
      {
        code: "pe5",
        label: "5",
        instructions: `## Activity 5: Menggabungkan Teks dan Angka

Di dalam fungsi \`print()\`, kamu bisa memisahkan teks dan angka menggunakan tanda koma \`,\`. Koma akan otomatis memberi jarak satu spasi.

Lengkapi kode di bawah ini agar mencetak informasi kelas dan umurmu secara rapi!

Contoh output:

\`\`\`text
Saya saat ini duduk di kelas 7 dan berumur 13 tahun.
\`\`\``,
        defaultCode: `# Lengkapi bagian dalam print() menggunakan tanda koma ,
print("Saya saat ini duduk di kelas", ..., "dan berumur", ..., "tahun.")`,
      },
      {
        code: "pe6",
        label: "6",
        instructions: `## Activity 6: Mengambil Input Sederhana

Fungsi \`input()\` digunakan untuk meminta pengguna mengetikkan sesuatu dari keyboard. Hasilnya bisa langsung kita cetak kembali!

Lengkapi kode berikut agar program meminta nama pengguna, lalu menyapanya!`,
        defaultCode: `# Meminta pengguna memasukkan nama
nama = input("Masukkan nama kamu: ")

# Menampilkan sapaan
print("Halo,", nama, "! Senang berkenalan denganmu.")`,
      },
    ],
    quiz: {
      code: "pe-quiz",
      label: "Q",
      questions: [
        {
          question: "Apa fungsi utama dari print() dalam Python?",
          choices: [
            { content: "Menghapus teks di layar", isCorrect: false, feedback: "Bukan. print() tidak menghapus teks." },
            { content: "Menampilkan data/teks ke layar terminal", isCorrect: true, feedback: "Benar! print() digunakan untuk menampilkan output ke console." },
            { content: "Menyimpan file kode", isCorrect: false, feedback: "Itu fungsi save, bukan print()." },
            { content: "Menghentikan program", isCorrect: false, feedback: "print() tidak menghentikan program." },
          ],
        },
        {
          question: "Simbol apa yang digunakan untuk membuat komentar 1 baris di Python?",
          choices: [
            { content: "//", isCorrect: false, feedback: "Itu simbol komentar di JavaScript, bukan Python." },
            { content: "<!-- -->", isCorrect: false, feedback: "Itu simbol komentar di HTML." },
            { content: "#", isCorrect: true, feedback: "Benar! Tanda # digunakan untuk komentar 1 baris di Python." },
            { content: "*", isCorrect: false, feedback: "Tanda * bukan simbol komentar di Python." },
          ],
        },
        {
          question: "Manakah penulisan fungsi print() yang BENAR dan tidak menghasilkan Error?",
          choices: [
            { content: "Print(\"Halo\")", isCorrect: false, feedback: "Python case-sensitive, harus huruf kecil print()." },
            { content: "print \"Halo\"", isCorrect: false, feedback: "Itu cara Python 2, di Python 3 harus pakai tanda kurung." },
            { content: "print(\"Halo\")", isCorrect: true, feedback: "Benar! print() ditulis huruf kecil dengan tanda kurung dan tanda petik." },
            { content: "print(Halo)", isCorrect: false, feedback: "Tanpa tanda petik, Halo akan dianggap sebagai variabel." },
          ],
        },
        {
          question: 'Apa output dari kode berikut?\n\n# print("Kucing")\nprint("Anjing")',
          choices: [
            { content: "Kucing", isCorrect: false, feedback: "Baris Kucing adalah komentar (#), jadi tidak dijalankan." },
            { content: "Anjing", isCorrect: true, feedback: "Benar! Baris pertama adalah komentar, hanya baris kedua yang dijalankan." },
            { content: "Kucing Anjing", isCorrect: false, feedback: "Keduanya tidak dicetak bersamaan. Baris pertama adalah komentar." },
            { content: "Tidak ada output sama sekali", isCorrect: false, feedback: "Ada output karena baris print(\"Anjing\") tetap dijalankan." },
          ],
        },
        {
          question: "Apa perbedaan utama antara print(\"5 + 5\") dan print(5 + 5)?",
          choices: [
            { content: 'print("5 + 5") menghasilkan 10, print(5 + 5) menghasilkan "5 + 5"', isCorrect: false, feedback: "Terbalik. Coba perhatikan tanda petik." },
            { content: 'print("5 + 5") menghasilkan "5 + 5", print(5 + 5) menghasilkan 10', isCorrect: true, feedback: "Benar! Tanda petik membuat teks biasa, tanpa petik akan dihitung sebagai angka." },
            { content: "Keduanya menghasilkan angka 10", isCorrect: false, feedback: "print(\"5 + 5\") mencetak teks, bukan hasil perhitungan." },
            { content: "Keduanya akan menyebabkan Error", isCorrect: false, feedback: "Keduanya valid dan bisa dijalankan." },
          ],
        },
      ],
    },
    capstone: {
      code: "capstone-pe",
      label: "Capstone",
      instructions: `## Mini Project: Program "Kartu Perkenalan Digital"

Saatnya membuat program menyapa pengguna yang utuh! Buatlah program yang:
1. Menggunakan komentar \`#\` untuk memberi judul program di baris pertama.
2. Meminta pengguna memasukkan nama dan kota asal menggunakan \`input()\`.
3. Menampilkan kartu perkenalan ramah di terminal!

Contoh output yang diharapkan:

\`\`\`text
==================================
WELCOME TO PYTHON PROGRAMMER CLUB!
==================================
Halo Budi dari Jakarta!
Selamat, kamu resmi menjadi Python Coder hari ini!
\`\`\``,
      defaultCode: `# Tulis judul programmu dengan komentar di sini

# 1. Minta input nama dan kota dari pengguna
nama = input("Masukkan nama kamu: ")
kota = input("Masukkan kota tempat tinggalmu: ")

# 2. Tampilkan garis pembatas dan pesan sapaan menggunakan print()
print("==================================")

# Lengkapi baris di bawah ini`,
    },
  },
  {
    id: "pv-variable",
    title: "Variabel & Tipe Data",
    goals: "Belajar variabel, tipe data (str, int, float), type casting, dan input dari user",
    tools: "Python Editor",
    levels: [
      {
        code: "pv1",
        label: "1",
        instructions: `## Activity 1: Membuat Variabel Pertama (Kotak Penyimpanan)

Variabel adalah wadah untuk menyimpan data di ingatan komputer. Kita membuat variabel dengan cara menuliskan **nama_variabel = nilai_data**.

Buatlah 3 variabel untuk menyimpan data karakter game kamu:
- \`nama_hero\` berisi teks nama karakter kamu
- \`level\` berisi angka bulat level karakter
- \`kecepatan\` berisi angka desimal kecepatan bergerak`,
        defaultCode: `# Tulis variabel kamu di bawah ini
nama_hero = "Shadow Knight"
# Buat variabel level dan kecepatan di sini

# Menampilkan data ke layar
print("Nama Hero:", nama_hero)
print("Level:", level)
print("Kecepatan:", kecepatan)`,
      },
      {
        code: "pv2",
        label: "2",
        instructions: `## Activity 2: Mengenal Tipe Data (str, int, float)

Di Python ada beberapa tipe data utama:
1. \`str\` (String): Teks di dalam tanda petik \`"...)"\`
2. \`int\` (Integer): Angka bulat (tanpa tanda petik)
3. \`float\` (Float): Angka desimal (menggunakan titik \`.\`, bukan koma)

Periksa tipe data dari variabel-variabel yang sudah disiapkan menggunakan fungsi \`type()\`. Isilah bagian kosong di fungsi \`print()\`!`,
        defaultCode: `senjata = "Pedang Naga"
jumlah_nyawa = 3
tinggi_karakter = 175.5

# Gunakan type() di dalam print untuk mengecek tipe data
print("Tipe data senjata:", type(senjata))
print("Tipe data jumlah_nyawa:", ...)
print("Tipe data tinggi_karakter:", ...)`,
      },
      {
        code: "pv3",
        label: "3",
        instructions: `## Activity 3: Mengubah Nilai Variabel

Nilai dalam variabel bersifat **dinamis** (bisa berubah). Jika kita memasukkan nilai baru ke variabel yang sama, nilai lama akan tertimpa.

Karakter kamu baru saja mendapatkan koin dan naik level! Ubahlah nilai variabel \`koin\` dan \`level\` agar bertambah, lalu cetak nilainya ke layar.`,
        defaultCode: `koin = 50
level = 1

print("--- Sebelum Berpetualang ---")
print("Koin:", koin)
print("Level:", level)

# Ubah nilai koin menjadi 150 dan level menjadi 2 di bawah ini

print("--- Setelah Berpetualang ---")
print("Koin:", koin)
print("Level:", level)`,
      },
      {
        code: "pv4",
        label: "4",
        instructions: `## Activity 4: Menampung Input dari Pemain

Fungsi \`input()\` mengambil data yang diketik pemain dalam bentuk **teks (\`str\`)**. Kita bisa menyimpannya langsung ke dalam variabel.

Buatlah program yang meminta nama pet / hewan peliharaan karakter game dari pemain, lalu tampilkan hasilnya.`,
        defaultCode: `# 1. Minta pengguna memasukkan nama hewan peliharaan dan simpan di variabel nama_pet
nama_pet = input("Masukkan nama hewan peliharaan kamu: ")

# 2. Minta jenis hewan (misal: Kucing, Naga, Serigala) dan simpan di variabel jenis_pet

# 3. Cetak hasilnya
print("Selamat! Kamu mendapatkan", jenis_pet, "yang diberi nama", nama_pet)`,
      },
      {
        code: "pv5",
        label: "5",
        instructions: `## Activity 5: Konversi Tipe Data (Type Casting)

Secara bawaan, hasil dari \`input()\` **selalu berupa teks (\`str\`)**. Jika kita ingin menggunakannya untuk perhitungan matematika, kita harus mengubahnya (*type cast*) menjadi angka menggunakan \`int()\` atau \`float()\`.

Ubah input umur pemain menjadi angka bulat (\`int\`), lalu hitung berapa umur pemain di tahun depan!`,
        defaultCode: `# Minta input umur dari pengguna
umur_teks = input("Masukkan umur kamu saat ini: ")

# Ubah umur_teks menjadi integer
umur_angka = int(umur_teks)

# Hitung umur tahun depan
umur_tahun_depan = umur_angka + 1

print("Tahun depan, umur kamu adalah", umur_tahun_depan, "tahun!")`,
      },
      {
        code: "pv6",
        label: "6",
        instructions: `## Activity 6: Menghitung Total Skor Pemain

Seorang pemain menyelesaikan dua babak game. Minta input skor babak 1 dan babak 2 dari pemain, ubah menjadi \`int\`, lalu hitung total skornya!`,
        defaultCode: `# 1. Minta input skor babak 1 dan babak 2
skor1 = input("Masukkan skor Babak 1: ")
skor2 = input("Masukkan skor Babak 2: ")

# 2. Ubah kedua skor menjadi integer dan jumlahkan di variabel total_skor
total_skor = ...

# 3. Tampilkan total skor
print("Total skor keseluruhan kamu adalah:", total_skor)`,
      },
    ],
    quiz: {
      code: "pv-quiz",
      label: "Q",
      questions: [
        {
          question: "Manakah penulisan nama variabel yang BENAR dalam Python?",
          choices: [
            { content: '1st_player = "Budi"', isCorrect: false, feedback: "Nama variabel tidak boleh diawali angka." },
            { content: 'nama player = "Budi"', isCorrect: false, feedback: "Nama variabel tidak boleh menggunakan spasi." },
            { content: 'nama_player = "Budi"', isCorrect: true, feedback: "Benar! Nama variabel menggunakan underscore dan huruf kecil." },
            { content: 'nama-player = "Budi"', isCorrect: false, feedback: "Tanda hubung (-) tidak diizinkan dalam nama variabel." },
          ],
        },
        {
          question: "Apa tipe data dari nilai 45.5 dalam Python?",
          choices: [
            { content: "int", isCorrect: false, feedback: "int untuk angka bulat tanpa desimal." },
            { content: "str", isCorrect: false, feedback: "str untuk teks dalam tanda petik." },
            { content: "float", isCorrect: true, feedback: "Benar! Angka desimal bertipe float." },
            { content: "boolean", isCorrect: false, feedback: "boolean hanya bernilai True atau False." },
          ],
        },
        {
          question: 'Apa tipe data dari variabel x setelah menjalankan x = input("Masukkan angka: ")?',
          choices: [
            { content: "int", isCorrect: false, feedback: "Hasil input() selalu str, walaupun yang diketik adalah angka." },
            { content: "str", isCorrect: true, feedback: "Benar! Semua input dari fungsi input() selalu bertipe str." },
            { content: "float", isCorrect: false, feedback: "float untuk angka desimal, hasil input() selalu str." },
            { content: "number", isCorrect: false, feedback: "Tidak ada tipe number di Python." },
          ],
        },
        {
          question: "Apa hasil dari baris kode berikut?\n\na = \"10\"\nb = \"20\"\nprint(a + b)",
          choices: [
            { content: "30", isCorrect: false, feedback: "Ini akan terjadi jika keduanya int, tapi ini string." },
            { content: "1020", isCorrect: true, feedback: "Benar! Operator + pada string akan menggabungkannya (concatenation)." },
            { content: "10 20", isCorrect: false, feedback: "String tidak otomatis diberi spasi saat digabung dengan +." },
            { content: "Error", isCorrect: false, feedback: "Operasi ini valid, + pada string menghasilkan penggabungan." },
          ],
        },
        {
          question: 'Fungsi apa yang digunakan untuk mengubah teks berisi angka "100" menjadi tipe data angka bulat?',
          choices: [
            { content: "str(100)", isCorrect: false, feedback: "str() mengubah angka menjadi teks, bukan sebaliknya." },
            { content: 'float("100")', isCorrect: false, feedback: "float() mengubah menjadi angka desimal, bukan bulat." },
            { content: 'int("100")', isCorrect: true, feedback: "Benar! int() mengubah teks atau desimal menjadi angka bulat." },
            { content: 'convert("100")', isCorrect: false, feedback: "Tidak ada fungsi convert() di Python." },
          ],
        },
      ],
    },
    capstone: {
      code: "capstone-pv",
      label: "Capstone",
      instructions: `## Mini Project: Pembuat Profil Karakter Game

Buatlah program pembuat kartu profil karakter game! Program harus:
1. Meminta input: Nama Karakter, Jenis Kelas (Misal: Warrior/Mage), dan Jumlah Health/Darah.
2. Mengonversi Health/Darah menjadi tipe data angka bulat (\`int\`).
3. Menghitung Health Bonus jika karakter mendapat *buff* sebesar 50 point darah tambahan.
4. Menampilkan Kartu Status Karakter yang rapi!

Contoh output yang diharapkan:

\`\`\`text
========================================
CREATE YOUR HERO PROFILE
========================================
Nama Hero   : PyroKnight
Class       : Mage
Base Health : 100 HP
Total Health (+50 Bonus): 150 HP
========================================
\`\`\``,
      defaultCode: `print("========================================")
print("CREATE YOUR HERO PROFILE")
print("========================================")

# 1. Minta input dari pemain
nama = input("Masukkan Nama Hero: ")
kelas = input("Masukkan Class Hero (Warrior/Mage/Archer): ")
health_input = input("Masukkan Base Health (Angka): ")

# 2. Convert health_input menjadi int dan hitung total health (+50)
health = int(health_input)
total_health = ...

# 3. Tampilkan profil karakter secara rapi
print("========================================")
print("Nama Hero   :", nama)
print("Class       :", kelas)
print("Base Health :", health, "HP")
print("Total Health (+50 Bonus):", ..., "HP")
print("========================================")`,
    },
  },
  {
    id: "po-operator",
    title: "Kalkulator & Manipulasi Teks",
    goals: "Belajar operator aritmatika lengkap (+, -, *, /, //, %, **) dan formatting teks dengan f-string",
    tools: "Python Editor",
    levels: [
      {
        code: "po1",
        label: "1",
        instructions: `## Activity 1: Operasi Aritmatika Dasar

Python mendukung operasi matematika dasar: Penjumlahan (\`+\`), Pengurangan (\`-\`), Perkalian (\`*\`), dan Pembagian (\`/\`). Hasil pembagian biasa (\`/\`) **selalu bertipe data float**.

Hitunglah total harga barang dan kembalian pembeli menggunakan operator matematika yang tepat!`,
        defaultCode: `harga_item = 15000
jumlah_beli = 3
uang_diterima = 50000

# 1. Hitung total harga (harga_item dikali jumlah_beli)
total_harga = ...

# 2. Hitung uang kembalian (uang_diterima dikurangi total_harga)
kembalian = ...

print("Total Harga:", total_harga)
print("Uang Kembalian:", kembalian)`,
      },
      {
        code: "po2",
        label: "2",
        instructions: `## Activity 2: Operator Spesial (//, %, **)

Selain operasi dasar, Python punya operator khusus:
- Pembagian Bulat (\`//\`) : Membagi angka dan membuang koma/desimalnya.
- Sisa Bagi / Modulo (\`%\`) : Mengambil sisa dari hasil pembagian.
- Pangkat (\`**\`) : Menghitung perpangkatan.

Coba jalankan starter code di bawah dan lengkapi bagian Modulo untuk mencari sisa permen yang tidak terbagi rata!`,
        defaultCode: `total_permen = 25
jumlah_anak = 4

# Berapa permen yang didapat setiap anak? (Gunakan Pembagian Bulat //)
permen_per_anak = total_permen // jumlah_anak

# Berapa sisa permen yang tidak terbagi? (Gunakan Modulo %)
sisa_permen = ...

print("Setiap anak mendapat:", permen_per_anak, "permen")
print("Sisa permen di dalam wadah:", sisa_permen)`,
      },
      {
        code: "po3",
        label: "3",
        instructions: `## Activity 3: Berkenalan dengan f-String

Menggabungkan teks dan variabel memakai koma (\`,\`) kadang membingungkan. Di Python, kita bisa memakai **f-string**.

Caranya: tambahkan huruf \`f\` sebelum tanda petik, lalu masukkan nama variabel di dalam kurung kurawal \`{}\`.

Contoh: \`print(f"Nama saya {nama}, umur {umur} tahun.")\`

Ubahlah kode di bawah ini agar menggunakan format **f-string**!`,
        defaultCode: `nama_produk = "Buku Tulis"
stok = 12
harga = 5000

# UBAH BARIS DI BAWAH INI MENJADI SATU BARIS PRINT MENGGUNAKAN F-STRING
# Output yang diharapkan: Produk Buku Tulis memiliki stok 12 unit dengan harga Rp5000/unit.
print("Produk", nama_produk, "memiliki stok", stok, "unit dengan harga Rp", harga, "/unit.")`,
      },
      {
        code: "po4",
        label: "4",
        instructions: `## Activity 4: Kalkulator Umur (Tahun, Bulan, Hari)

Mari buat program yang menghitung umur seseorang dalam hitungan **tahun** dan estimasi total **bulan** serta **hari** yang sudah ia lewati (asumsi 1 tahun = 12 bulan, 1 tahun = 365 hari).

Gunakan operator perkalian \`*\` dan tampilkan hasilnya menggunakan **f-string**!`,
        defaultCode: `tahun_lahir = int(input("Masukkan tahun lahir kamu: "))
tahun_sekarang = 2026

# 1. Hitung umur dalam tahun
umur_tahun = tahun_sekarang - tahun_lahir

# 2. Hitung estimasi umur dalam bulan (* 12) dan hari (* 365)
umur_bulan = ...
umur_hari = ...

# 3. Cetak menggunakan f-string
print(f"Umur kamu saat ini adalah {umur_tahun} tahun.")
print(f"Atau setara dengan {umur_bulan} bulan / {umur_hari} hari!")`,
      },
      {
        code: "po5",
        label: "5",
        instructions: `## Activity 5: Menghitung Luas & Keliling Persegi Panjang

Minta pengguna memasukkan nilai \`panjang\` dan \`lebar\` persegi panjang. Jangan lupa ubah input menjadi angka (\`int\` atau \`float\`).

Hitunglah:
- \`luas\` = panjang * lebar
- \`keliling\` = 2 * (panjang + lebar)`,
        defaultCode: `# 1. Minta input panjang dan lebar (convert ke int)
panjang = int(input("Masukkan panjang (cm): "))
lebar = ...

# 2. Hitung Luas dan Keliling
luas = ...
keliling = ...

# 3. Tampilkan hasil dengan f-string
print(f"Persegi panjang dengan ukuran {panjang}x{lebar} cm:")
print(f"- Luas     : {luas} cm²")
print(f"- Keliling : {keliling} cm")`,
      },
      {
        code: "po6",
        label: "6",
        instructions: `## Activity 6: Menghitung Diskon Belanja

Sebuah toko memberikan diskon sebesar **20%** (0.20) untuk semua produk.

Hitunglah potongan harga diskon dan total harga akhir yang harus dibayar!

Rumus:
- \`potongan_diskon\` = total_belanja * 0.20
- \`harga_akhir\` = total_belanja - potongan_diskon`,
        defaultCode: `total_belanja = float(input("Masukkan total belanjaan (Rp): "))

# Hitung potongan diskon (20%) dan harga akhir
potongan_diskon = total_belanja * 0.20
harga_akhir = ...

print(f"Total Belanja awal : Rp {total_belanja}")
print(f"Diskon (20%)       : Rp {potongan_diskon}")
print(f"Total Bayar        : Rp {harga_akhir}")`,
      },
    ],
    quiz: {
      code: "po-quiz",
      label: "Q",
      questions: [
        {
          question: "Apa hasil dari operasi matematika 10 // 3 di Python?",
          choices: [
            { content: "3.3333", isCorrect: false, feedback: "Itu hasil pembagian biasa (/), bukan pembagian bulat (//)." },
            { content: "3", isCorrect: true, feedback: "Benar! // adalah pembagian bulat yang membuang angka desimal." },
            { content: "1", isCorrect: false, feedback: "Itu sisa bagi (modulo), bukan hasil pembagian." },
            { content: "30", isCorrect: false, feedback: "Itu hasil perkalian, bukan pembagian." },
          ],
        },
        {
          question: "Operator manakah yang digunakan untuk mencari sisa dari pembagian (Modulo)?",
          choices: [
            { content: "/", isCorrect: false, feedback: "/ adalah pembagian biasa yang menghasilkan float." },
            { content: "//", isCorrect: false, feedback: "// adalah pembagian bulat, bukan sisa bagi." },
            { content: "%", isCorrect: true, feedback: "Benar! % adalah operator Modulo yang menghasilkan sisa bagi." },
            { content: "**", isCorrect: false, feedback: "** adalah operator pangkat." },
          ],
        },
        {
          question: "Berapakah hasil dari baris kode 2 ** 3?",
          choices: [
            { content: "6", isCorrect: false, feedback: "Itu hasil 2 * 3, bukan 2 pangkat 3." },
            { content: "5", isCorrect: false, feedback: "Coba hitung lagi. 2 ** 3 = 2 x 2 x 2." },
            { content: "8", isCorrect: true, feedback: "Benar! 2 ** 3 = 2 x 2 x 2 = 8." },
            { content: "9", isCorrect: false, feedback: "Itu 3 pangkat 2, bukan 2 pangkat 3." },
          ],
        },
        {
          question: "Sintaks manakah yang BENAR untuk membuat f-string di Python?",
          choices: [
            { content: 'print("Nama saya {nama}")', isCorrect: false, feedback: "Ini string biasa, variabel tidak akan diganti dengan nilainya." },
            { content: 'print(f"Nama saya {nama}")', isCorrect: true, feedback: "Benar! f-string diawali huruf f dan variabel di dalam {}." },
            { content: 'print(f"Nama saya nama")', isCorrect: false, feedback: "Variabel harus di dalam kurung kurawal {}, bukan ditulis langsung." },
            { content: 'print(format"Nama saya {nama}")', isCorrect: false, feedback: "Tidak ada sintaks format\"...\" di Python." },
          ],
        },
        {
          question: "Apa hasil dari operasi matematika 2 + 3 * 4?",
          choices: [
            { content: "20", isCorrect: false, feedback: "Perkalian dikerjakan lebih dulu, bukan kiri ke kanan." },
            { content: "14", isCorrect: true, feedback: "Benar! Perkalian (3*4=12) dihitung dulu baru penjumlahan (2+12=14)." },
            { content: "24", isCorrect: false, feedback: "Terlalu besar. Ikuti urutan operasi matematika." },
            { content: "18", isCorrect: false, feedback: "Coba hitung ulang dengan urutan yang benar." },
          ],
        },
      ],
    },
    capstone: {
      code: "capstone-po",
      label: "Capstone",
      instructions: `## Mini Project: Kasir Toko Sederhana

Buatlah program Kasir Toko Sederhana yang mencetak struk belanja! Program harus:
1. Meminta input: Nama Barang, Harga Satuan, Jumlah Beli, dan Uang Bayar.
2. Menghitung \`total_harga\` (Harga Satuan x Jumlah Beli).
3. Menghitung \`kembalian\` (Uang Bayar - Total Harga).
4. Mencetak Struk Pembelian yang rapi menggunakan **f-string**!

Contoh output yang diharapkan:

\`\`\`text
========================================
            TOKO SERBA ADA
========================================
Barang Beli : Es Krim Cokelat
Harga Satuan: Rp 8000
Jumlah Beli : 3 item
----------------------------------------
Total Harga : Rp 24000
Uang Bayar  : Rp 50000
Kembalian   : Rp 26000
========================================
Terima kasih telah berbelanja!
\`\`\``,
      defaultCode: `print("========================================")
print("            TOKO SERBA ADA")
print("========================================")

# 1. Minta input dari kasir/pembeli
nama_barang = input("Nama Barang  : ")
harga_satuan = int(input("Harga Satuan : "))
jumlah_beli = int(input("Jumlah Beli  : "))
uang_bayar = int(input("Uang Bayar   : "))

# 2. Hitung total harga dan kembalian
total_harga = ...
kembalian = ...

# 3. Tampilkan Struk Pembelian menggunakan f-string
print("========================================")
print("            STRUK PEMBELIAN")
print("========================================")
print(f"Barang Beli : {nama_barang}")
print(f"Harga Satuan: Rp {harga_satuan}")
print(f"Jumlah Beli : {jumlah_beli} item")
print("----------------------------------------")
print(f"Total Harga : Rp {total_harga}")
print(f"Uang Bayar  : Rp {uang_bayar}")
print(f"Kembalian   : Rp {kembalian}")
print("========================================")
print("Terima kasih telah berbelanja!")`,
    },
  },
  {
    id: "pd-decision",
    title: "Pengambil Keputusan (If-Else)",
    goals: "Belajar tipe data boolean, operator komparasi (>, <, ==, !=, >=, <=), dan struktur if-else",
    tools: "Python Editor",
    levels: [
      {
        code: "pd1",
        label: "1",
        instructions: `## Activity 1: Berkenalan dengan Boolean & Operator Pembanding

Di Python, hasil dari perbandingan angka adalah tipe data **Boolean**, yaitu hanya bernilai \`True\` (Benar) atau \`False\` (Salah).

Operator Komparasi:
- \`>\` (lebih besar)
- \`<\` (lebih kecil)
- \`==\` (sama dengan)
- \`!=\` (tidak sama dengan)

Uji variabel \`nilai_ujian = 80\` dan \`nilai_kkm = 75\`. Cetak hasil perbandingannya menggunakan \`print()\` apakah \`nilai_ujian\` lebih besar atau sama dengan (\`>=\`) \`nilai_kkm\`!`,
        defaultCode: `# Tulis kode mu disini`,
      },
      {
        code: "pd2",
        label: "2",
        instructions: `## Activity 2: Percabangan Sederhana (if)

Pernyataan \`if\` digunakan untuk menjalankan perintah **HANYA JIKA** kondisinya bernilai \`True\`.

**Catatan Penting:** Jangan lupa tanda titik dua \`:\` di akhir baris \`if\` dan beri **4 spasi (indentasi)** pada baris perintah di bawahnya!

Minta input umur pengguna (convert ke \`int\`). Jika umurnya **12 tahun atau lebih**, tampilkan pesan: \`"Kamu sudah boleh membuat kartu perpustakaan!"\``,
        defaultCode: `# Tulis kode mu disini`,
      },
      {
        code: "pd3",
        label: "3",
        instructions: `## Activity 3: Keputusan Dua Arah (if-else)

Jika kondisi pada \`if\` bernilai \`False\`, kita bisa menggunakan \`else\` untuk menjalankan tindakan alternatif.

Buat program penguji tinggi badan minimal untuk naik *roller coaster* (minimal 140 cm):
- Jika tinggi >= 140 cm -> cetak \`"Selamat, kamu boleh naik roller coaster!"\`
- Jika kurang dari 140 cm -> cetak \`"Maaf, tinggi kamu belum mencukupi."\``,
        defaultCode: `# Tulis kode mu disini`,
      },
      {
        code: "pd4",
        label: "4",
        instructions: `## Activity 4: Program Cek Kelulusan Ujian

Minta pengguna memasukkan \`nilai_siswa\` (ubah ke angka bulat).
- Jika nilai siswa **70 atau lebih**, cetak: \`"Status: LULUS! Selamat ya!"\`
- Jika nilai di bawah 70, cetak: \`"Status: TIDAK LULUS. Ayo belajar lebih giat lagi!"\``,
        defaultCode: `# Tulis kode mu disini`,
      },
      {
        code: "pd5",
        label: "5",
        instructions: `## Activity 5: Membandingkan Teks (String Comparison)

Operator \`==\` juga bisa digunakan untuk membandingkan teks/string. Ingat bahwa Python bersifat *case-sensitive* (huruf besar dan kecil berpengaruh).

Minta pengguna menginputkan \`jawaban\` dari pertanyaan: *"Apa warna bendera negara Indonesia?"*
- Jika jawaban bernilai \`"merah putih"\`, cetak: \`"Jawaban kamu BENAR!"\`
- Jika bukan, cetak: \`"Jawaban kamu SALAH, coba lagi!"\``,
        defaultCode: `# Tulis kode mu disini`,
      },
      {
        code: "pd6",
        label: "6",
        instructions: `## Activity 6: Pengecekan Angka Genap atau Ganjil

Angka **Genap** adalah angka yang jika dibagi 2 sisa baginya adalah \`0\` (\`angka % 2 == 0\`). Jika sisa baginya bukan 0, maka angka tersebut adalah **Ganjil**.

Minta pengguna memasukkan sebuah angka bulat, lalu gunakan \`if-else\` dan operator Modulo \`%\` untuk menentukan apakah angka tersebut Genap atau Ganjil!`,
        defaultCode: `# Tulis kode mu disini`,
      },
    ],
    quiz: {
      code: "pd-quiz",
      label: "Q",
      questions: [
        {
          question: "Manakah operator yang digunakan untuk mengecek apakah dua nilai itu SAMA DENGAN?",
          choices: [
            { content: "=", isCorrect: false, feedback: "= digunakan untuk assignment (memasukkan nilai ke variabel)." },
            { content: "==", isCorrect: true, feedback: "Benar! == digunakan untuk membandingkan kesamaan dua nilai." },
            { content: ":=", isCorrect: false, feedback: ":= adalah operator walrus di Python, bukan untuk perbandingan." },
            { content: "equals", isCorrect: false, feedback: "Tidak ada operator equals di Python." },
          ],
        },
        {
          question: "Apa hasil dari ekspresi 15 != 10 di Python?",
          choices: [
            { content: "True", isCorrect: true, feedback: "Benar! != berarti tidak sama dengan, 15 memang tidak sama dengan 10." },
            { content: "False", isCorrect: false, feedback: "15 tidak sama dengan 10, jadi hasilnya True." },
            { content: "15", isCorrect: false, feedback: "Operator perbandingan menghasilkan boolean, bukan angka." },
            { content: "Error", isCorrect: false, feedback: "Operasi ini valid dan bisa dijalankan." },
          ],
        },
        {
          question: "Simbol apakah yang WAJIB diletakkan di akhir baris if dan else?",
          choices: [
            { content: "Tanda titik koma ;", isCorrect: false, feedback: "Python tidak menggunakan titik koma." },
            { content: "Tanda kurung {}", isCorrect: false, feedback: "Python menggunakan indentasi, bukan kurung kurawal." },
            { content: "Tanda titik dua :", isCorrect: true, feedback: "Benar! Tanda : wajib ditulis setelah kondisi if dan else." },
            { content: "Tanda koma ,", isCorrect: false, feedback: "Koma digunakan untuk separator, bukan di akhir baris kondisi." },
          ],
        },
        {
          question: "Mengapa baris kode di dalam if harus menjorok masuk ke dalam (Indentasi)?",
          choices: [
            { content: "Agar terlihat rapi saja", isCorrect: false, feedback: "Bukan hanya soal kerapian, ini soal sintaks." },
            { content: "Untuk memberi tahu Python bahwa baris tersebut merupakan bagian dari blok if", isCorrect: true, feedback: "Benar! Indentasi di Python berfungsi menentukan cakupan/blok kode." },
            { content: "Agar program berjalan lebih cepat", isCorrect: false, feedback: "Indentasi tidak mempengaruhi kecepatan program." },
            { content: "Memang aturan opsional yang boleh dilewati", isCorrect: false, feedback: "Indentasi WAJIB di Python, bukan opsional." },
          ],
        },
        {
          question: "Apa output dari kode berikut jika skor = 50?\n\nskor = 50\nif skor > 50:\n    print(\"A\")\nelse:\n    print(\"B\")",
          choices: [
            { content: "A", isCorrect: false, feedback: "skor > 50 adalah False (50 tidak lebih besar dari 50), jadi masuk ke else." },
            { content: "B", isCorrect: true, feedback: "Benar! Kondisi skor > 50 bernilai False karena 50 tidak lebih besar dari 50." },
            { content: "A dan B", isCorrect: false, feedback: "Hanya satu cabang yang akan dijalankan: if atau else." },
            { content: "Tidak muncul apa-apa", isCorrect: false, feedback: "Pasti ada output karena salah satu cabang akan dijalankan." },
          ],
        },
      ],
    },
    capstone: {
      code: "capstone-pd",
      label: "Capstone",
      instructions: `## Mini Project: Sistem Login & Gatekeeper Akses

Buatlah program simulasi **Sistem Login Sederhana**! Program harus:
1. Menentukan \`username_benar = "admin"\` dan \`password_benar = "python123"\`.
2. Meminta pengguna memasukkan \`username_input\` dan \`password_input\`.
3. Mengecek apakah \`username_input == username_benar\` DAN \`password_input == password_benar\`.
4. Jika KEDUANYA cocok: Cetak pesan sukses.
5. Jika ADA YANG SALAH: Cetak pesan gagal.

Contoh output sukses:

\`\`\`text
=========================
SELAMAT DATANG, ADMIN!
Akses diterima.
=========================
\`\`\`

Contoh output gagal:

\`\`\`text
=========================
LOGIN GAGAL!
Username atau Password salah.
=========================
\`\`\``,
      defaultCode: `# Tulis kode mu disini`,
    },
  },
  {
    id: "p5-decision2",
    title: "Percabangan Multi-Kondisi (elif, and, or, not)",
    goals: "Belajar percabangan multi-kondisi dengan elif dan operator logika (and, or, not)",
    tools: "Python Editor",
    levels: [
      {
        code: "p51",
        label: "1",
        instructions: `## Activity 1: Banyak Pilihan Keputusan dengan elif

Jika kamu memiliki lebih dari 2 pilihan keputusan, gunakan \`elif\` (singkatan dari *else if*). Komputer akan mengecek dari atas ke bawah dan menjalankan kode pertama yang bernilai \`True\`.

Minta input \`nilai\` ujian siswa (0–100), lalu kelompokkan predikatnya:
- Jika nilai >= 90 -> cetak \`"Predikat: A (Sangat Baik)"\`
- Jika nilai >= 80 -> cetak \`"Predikat: B (Baik)"\`
- Jika nilai >= 70 -> cetak \`"Predikat: C (Cukup)"\`
- Jika di bawah 70 -> cetak \`"Predikat: D (Perlu Belajar Lagi)"\``,
        defaultCode: `# Tulis kode mu disini`,
      },
      {
        code: "p52",
        label: "2",
        instructions: `## Activity 2: Operator Logika and (Keduanya Harus True)

Operator \`and\` digunakan ketika **semua syarat harus terpenuhi** agar kondisi bernilai \`True\`.

Sebuah wahana ekstrem membutuhkan dua syarat: umur minimal **12 tahun** DAN tinggi badan minimal **140 cm**.

Minta input \`umur\` dan \`tinggi\` dari pengguna.
- Jika \`umur >= 12\` **and** \`tinggi >= 140\` -> cetak \`"Kamu Boleh Naik Wahana!"\`
- Jika tidak memenuhi -> cetak \`"Maaf, kamu Belum Memenuhi Syarat."\``,
        defaultCode: `# Tulis kode mu disini`,
      },
      {
        code: "p53",
        label: "3",
        instructions: `## Activity 3: Operator Logika or (Salah Satu Cukup True)

Operator \`or\` digunakan jika **cukup salah satu syarat saja yang terpenuhi** agar kondisi bernilai \`True\`.

Toko memberikan diskon khusus jika pembeli adalah seorang **"Pelajar"** ATAU memiliki **"Kartu Member"**.

Minta pengguna menjawab \`"ya"\` atau \`"tidak"\` untuk dua pertanyaan:
1. Apakah kamu seorang Pelajar?
2. Apakah kamu punya Kartu Member?

Jika salah satu dijawab \`"ya"\`, tampilkan \`"Selamat! Kamu Mendapat Diskon 20%!"\`. Jika keduanya \`"tidak"\`, tampilkan \`"Harga Normal, Tidak Ada Diskon."\``,
        defaultCode: `# Tulis kode mu disini`,
      },
      {
        code: "p54",
        label: "4",
        instructions: `## Activity 4: Operator Logika not (Pembalik Kondisi)

Operator \`not\` digunakan untuk **membalikkan nilai Boolean**. Jika nilainya \`True\` akan menjadi \`False\`, dan sebaliknya.

Minta pengguna memasukkan status cuaca (\`"hujan"\` atau \`"cerah"\`).

Gunakan logika \`if not cuaca == "hujan":\` untuk mengecek jika cuaca **TIDAK** hujan:
- Jika tidak hujan -> cetak \`"Ayo Kita Pergi Piknik ke Taman!"\`
- Jika hujan -> cetak \`"Sebaiknya Diam di Rumah Saja."\``,
        defaultCode: `# Tulis kode mu disini`,
      },
      {
        code: "p55",
        label: "5",
        instructions: `## Activity 5: Penentuan Tiket Bioskop Berdasarkan Usia

Buat program penghitung harga tiket bioskop berdasarkan kategori usia pengguna:
- Usia di bawah 5 tahun (< 5) -> \`"Tiket Gratis!"\`
- Usia 5 sampai 17 tahun (>= 5 dan <= 17) -> \`"Harga Tiket Anak/Pelajar: Rp 25.000"\`
- Usia di atas 17 tahun (> 17) -> \`"Harga Tiket Dewasa: Rp 50.000"\`

Petunjuk: Gunakan \`elif\` dan operator \`and\` untuk kategori usia 5–17 tahun.`,
        defaultCode: `# Tulis kode mu disini`,
      },
      {
        code: "p56",
        label: "6",
        instructions: `## Activity 6: Cek Tahun Kabisat Sederhana

Tahun kabisat adalah tahun yang habis dibagi 4 (\`tahun % 4 == 0\`).

Minta pengguna memasukkan \`tahun\` (misal: 2024 atau 2026).
- Jika tahun habis dibagi 4 -> cetak \`f"{tahun} adalah Tahun Kabisat (Ada 29 Februari)"\`
- Jika tidak -> cetak \`f"{tahun} bukan Tahun Kabisat"\``,
        defaultCode: `# Tulis kode mu disini`,
      },
    ],
    quiz: {
      code: "p5-quiz",
      label: "Q",
      questions: [
        {
          question: "Kapan blok kode di dalam baris elif akan dijalankan?",
          choices: [
            { content: "Selalu dijalankan paling pertama", isCorrect: false, feedback: "Kondisi if lah yang dicek pertama, bukan elif." },
            { content: "Ketika kondisi if sebelumnya bernilai False dan kondisi elif tersebut bernilai True", isCorrect: true, feedback: "Benar! elif dicek hanya jika if di atasnya False, dan jalan hanya jika syaratnya sendiri True." },
            { content: "Ketika semua kondisi bernilai False", isCorrect: false, feedback: "Itu kondisi else, bukan elif." },
            { content: "Hanya jika kondisi else bernilai True", isCorrect: false, feedback: "else tidak punya kondisi, dia jalan jika semua if/elif False." },
          ],
        },
        {
          question: "Apa hasil dari ekspresi logika (10 > 5) and (3 > 7)?",
          choices: [
            { content: "True", isCorrect: false, feedback: "Karena menggunakan and, kedua syarat harus True. 3 > 7 adalah False." },
            { content: "False", isCorrect: true, feedback: "Benar! and membutuhkan semua syarat True, tapi 3 > 7 bernilai False." },
            { content: "None", isCorrect: false, feedback: "Hasil ekspresi boolean adalah True/False, bukan None." },
            { content: "Error", isCorrect: false, feedback: "Ekspresi ini valid dan bisa dijalankan." },
          ],
        },
        {
          question: "Apa hasil dari ekspresi logika (10 > 5) or (3 > 7)?",
          choices: [
            { content: "True", isCorrect: true, feedback: "Benar! or cukup salah satu True. 10 > 5 sudah True, maka hasilnya True." },
            { content: "False", isCorrect: false, feedback: "Karena 10 > 5 bernilai True, or akan menghasilkan True." },
            { content: "None", isCorrect: false, feedback: "Hasil ekspresi boolean adalah True/False." },
            { content: "Error", isCorrect: false, feedback: "Ekspresi ini valid." },
          ],
        },
        {
          question: "Apa output dari kode berikut?\n\nlampu = \"kuning\"\nif lampu == \"merah\":\n    print(\"Berhenti\")\nelif lampu == \"kuning\":\n    print(\"Hati-hati\")\nelse:\n    print(\"Jalan\")",
          choices: [
            { content: "Berhenti", isCorrect: false, feedback: "lampu == \"merah\" adalah False, jadi blok if tidak dijalankan." },
            { content: "Hati-hati", isCorrect: true, feedback: "Benar! Kondisi elif (lampu == \"kuning\") cocok, maka mencetak \"Hati-hati\"." },
            { content: "Jalan", isCorrect: false, feedback: "Blok else hanya jalan jika semua if dan elif False." },
            { content: "Error", isCorrect: false, feedback: "Kode ini valid." },
          ],
        },
        {
          question: "Apa fungsi dari operator not True di Python?",
          choices: [
            { content: "Mengubahnya menjadi True", isCorrect: false, feedback: "not membalikkan nilai, True jadi False." },
            { content: "Mengubahnya menjadi False", isCorrect: true, feedback: "Benar! not membalikkan nilai Boolean." },
            { content: "Menghasilkan angka 0", isCorrect: false, feedback: "not bekerja pada boolean, bukan angka." },
            { content: "Tidak terjadi apa-apa", isCorrect: false, feedback: "not mengubah nilai boolean." },
          ],
        },
      ],
    },
    capstone: {
      code: "capstone-p5",
      label: "Capstone",
      instructions: `## Mini Project: Game "Pilih Petualanganmu!"

Buatlah game petualangan berbasis teks (*Text-Based Adventure*) interaktif!

Alur Cerita:
1. Pemain berdiri di persimpangan jalan dan diminta memilih arah: \`"kiri"\` atau \`"kanan"\`.
2. Jika pemain memilih \`"kiri"\`:
   - Minta pilihan kedua: \`"renang"\` atau \`"tunggu"\` untuk menyeberangi sungai.
   - Jika \`"renang"\` -> Cetak: \`"Kamu diserang buaya! GAME OVER."\`
   - Jika \`"tunggu"\` -> Cetak: \`"Perahu datang menolongmu! KAMU MENANG!"\`
3. Jika pemain memilih \`"kanan"\`:
   - Cetak: \`"Kamu masuk ke sarang serigala! GAME OVER."\`
4. Jika pemain memasukkan pilihan selain \`"kiri"\` atau \`"kanan"\`:
   - Cetak: \`"Pilihan tidak valid! Kamu tersesat di hutan."\``,
      defaultCode: `# Tulis kode mu disini`,
    },
  },
  {
    id: "p6-while",
    title: "Perulangan while (Looping)",
    goals: "Belajar perulangan while, increment/decrement, break, dan menghindari infinite loop",
    tools: "Python Editor",
    levels: [
      {
        code: "p61",
        label: "1",
        instructions: `## Activity 1: while Loop Pertama Kamu (Hitung Maju 1–5)

Perulangan \`while\` akan terus mengulang baris kode di dalamnya **selama kondisinya bernilai True**.

Agar perulangan tidak berjalan selamanya (*infinite loop*), kita wajib menambah nilai variabel pengontrol di dalam loop (misalnya \`angka = angka + 1\` atau \`angka += 1\`).

Gunakan \`while\` loop untuk mencetak angka \`1\` sampai \`5\` di terminal!`,
        defaultCode: `# Tulis kode mu disini`,
      },
      {
        code: "p62",
        label: "2",
        instructions: `## Activity 2: Peluncuran Roket (Hitung Mundur)

Selain bertambah (*increment*), variabel pengontrol juga bisa berkurang (*decrement*) menggunakan \`angka -= 1\`.

Buat program hitung mundur peluncuran roket dari angka \`10\` sampai \`1\`. Setelah loop selesai, cetak kalimat \`"🚀 ROKET MELUNCUR!"\` di luar loop.`,
        defaultCode: `# Tulis kode mu disini`,
      },
      {
        code: "p63",
        label: "3",
        instructions: `## Activity 3: Mengulang Teks Sesuai Keinginan User

Minta pengguna memasukkan \`kata\` yang ingin diulang dan \`jumlah\` berapa kali kata tersebut harus dicetak (convert ke \`int\`).

Gunakan \`while\` loop untuk mencetak \`kata\` tersebut sebanyak \`jumlah\` yang diminta!`,
        defaultCode: `# Tulis kode mu disini`,
      },
      {
        code: "p64",
        label: "4",
        instructions: `## Activity 4: Menjebak User dengan Validasi Password

\`while\` loop sangat berguna untuk meminta input secara berulang sampai pengguna memasukkan jawaban yang benar.

Tentukan \`password_benar = "python123"\`.

Gunakan \`while\` loop untuk terus meminta input \`password\` dari user **selama** password yang dimasukkan **salah** (\`!= password_benar\`).

Jika sudah benar, keluarlah dari loop dan cetak \`"Akses Diterima!"\`.`,
        defaultCode: `# Tulis kode mu disini`,
      },
      {
        code: "p65",
        label: "5",
        instructions: `## Activity 5: Keluar Paksa dari Loop Menggunakan break

Perintah \`break\` digunakan untuk menghentikan dan keluar dari perulangan secara langsung saat itu juga, meskipun kondisi \`while\` masih bernilai \`True\`.

Buat perulangan \`while True:\` (loop tanpa henti). Di dalam loop, minta pengguna memasukkan kata. Jika pengguna memasukkan kata \`"keluar"\`, jalankan perintah \`break\` untuk menghentikan program!`,
        defaultCode: `# Tulis kode mu disini`,
      },
      {
        code: "p66",
        label: "6",
        instructions: `## Activity 6: Menghitung Total Penjumlahan Angka

Buat program yang menjumlahkan angka dari 1 hingga \`N\` (input dari pengguna).

Contoh: Jika user memasukkan \`5\`, program akan menghitung 1 + 2 + 3 + 4 + 5 = 15 dan menampilkan total akhirnya!`,
        defaultCode: `# Tulis kode mu disini`,
      },
    ],
    quiz: {
      code: "p6-quiz",
      label: "Q",
      questions: [
        {
          question: "Apa yang menyebabkan terjadinya Infinite Loop (perulangan tanpa henti)?",
          choices: [
            { content: "Menulis sintaks print() yang salah", isCorrect: false, feedback: "Sintaks print() tidak ada hubungannya dengan infinite loop." },
            { content: "Kondisi while selalu bernilai True dan tidak pernah berubah menjadi False", isCorrect: true, feedback: "Benar! Jika kondisi tidak pernah menjadi False, perulangan berjalan selamanya." },
            { content: "Lupa menggunakan tanda petik pada string", isCorrect: false, feedback: "Itu menghasilkan error sintaks, bukan infinite loop." },
            { content: "Menggunakan operator == alih-alih =", isCorrect: false, feedback: "Salah satu penyebab, tapi bukan yang paling tepat menggambarkan infinite loop." },
          ],
        },
        {
          question: "Perintah apa yang digunakan untuk memaksa perulangan BERHENTI saat itu juga?",
          choices: [
            { content: "stop", isCorrect: false, feedback: "Tidak ada perintah stop di Python untuk menghentikan loop." },
            { content: "exit", isCorrect: false, feedback: "exit() menghentikan seluruh program, bukan hanya loop." },
            { content: "break", isCorrect: true, feedback: "Benar! break menghentikan eksekusi perulangan secara instan." },
            { content: "end", isCorrect: false, feedback: "Tidak ada perintah end untuk menghentikan loop." },
          ],
        },
        {
          question: "Berapa kali teks \"Halo\" akan dicetak pada kode berikut?\n\nx = 1\nwhile x < 4:\n    print(\"Halo\")\n    x += 1",
          choices: [
            { content: "1 kali", isCorrect: false, feedback: "Loop berjalan untuk x = 1, 2, 3 — bukan hanya 1 kali." },
            { content: "3 kali", isCorrect: true, feedback: "Benar! Loop berjalan untuk x = 1, 2, 3. Saat x = 4, kondisi 4 < 4 menjadi False." },
            { content: "4 kali", isCorrect: false, feedback: "Saat x = 4, kondisi 4 < 4 sudah False, jadi loop berhenti." },
            { content: "Selamanya", isCorrect: false, feedback: "Tidak, karena x terus bertambah hingga kondisi menjadi False." },
          ],
        },
        {
          question: "Apa arti dari sintaks angka += 1 dalam Python?",
          choices: [
            { content: "angka = 1", isCorrect: false, feedback: "Itu assignment langsung ke 1, bukan increment." },
            { content: "angka = angka + 1", isCorrect: true, feedback: "Benar! += adalah bentuk singkat dari menambahkan nilai ke variabel." },
            { content: "angka == 1", isCorrect: false, feedback: "== adalah operator perbandingan, bukan assignment." },
            { content: "angka + 1 (tanpa mengubah variabel)", isCorrect: false, feedback: "+= mengubah nilai variabel, bukan hanya menghitung." },
          ],
        },
        {
          question: "Kapan perulangan while x <= 5: akan STOP berjalan?",
          choices: [
            { content: "Ketika nilai x bernilai 5", isCorrect: false, feedback: "Saat x = 5, kondisi 5 <= 5 masih True, loop lanjut." },
            { content: "Ketika nilai x bernilai 6 atau lebih", isCorrect: true, feedback: "Benar! Kondisi x <= 5 False saat x >= 6." },
            { content: "Ketika nilai x bernilai 0", isCorrect: false, feedback: "0 <= 5 adalah True, loop tetap jalan." },
            { content: "Tidak akan pernah berhenti", isCorrect: false, feedback: "Akan berhenti jika x terus bertambah hingga > 5." },
          ],
        },
      ],
    },
    capstone: {
      code: "capstone-p6",
      label: "Capstone",
      instructions: `## Mini Project: Game "Tebak Angka Rahasia"

Buatlah game interaktif Tebak Angka Rahasia! Program harus:
1. Tentukan satu angka rahasia, misal: \`angka_rahasia = 7\`.
2. Buat variabel \`tebakan = 0\` dan \`jumlah_percobaan = 0\`.
3. Gunakan \`while tebakan != angka_rahasia:\` untuk meminta user menebak angka.
4. Di setiap tebakan:
   - Tambahkan \`jumlah_percobaan\` sebanyak 1.
   - Jika tebakan **terlalu kecil** (< 7), cetak: \`"Terlalu kecil! Coba lagi."\`
   - Jika tebakan **terlalu besar** (> 7), cetak: \`"Terlalu besar! Coba lagi."\`
5. Ketika tebakan benar, loop berhenti dan cetak pesan selamat beserta total percobaan yang dibutuhkan!
   Contoh: \`"Selamat! Tebakanmu BENAR dalam 3 kali percobaan."\``,
      defaultCode: `# Tulis kode mu disini`,
    },
  },
  {
    id: "p7-for",
    title: "Perulangan for & range()",
    goals: "Belajar perulangan for, fungsi range() dengan 1, 2, dan 3 parameter, serta iterasi string",
    tools: "Python Editor",
    levels: [
      {
        code: "p71",
        label: "1",
        instructions: `## Activity 1: for Loop Pertama & range(n)

Fungsi \`range(n)\` akan menghasilkan urutan angka mulai dari \`0\` hingga \`n - 1\`.

Gunakan \`for\` loop dengan \`range(5)\` untuk mencetak pesan \`"Perulangan ke-"\` diikuti angka urutannya!`,
        defaultCode: `# Tulis kode mu disini`,
      },
      {
        code: "p72",
        label: "2",
        instructions: `## Activity 2: Menentukan Awal dan Akhir Angka range(start, stop)

Jika ingin menentukan angka awal, kita bisa menulis \`range(start, stop)\`.
*Ingat:* Angka pada \`stop\` **tidak ikut dicetak**. Jadi jika ingin mencetak angka 1 sampai 10, gunakan \`range(1, 11)\`.

Gunakan \`for\` loop untuk mencetak angka dari \`1\` sampai \`10\` di terminal!`,
        defaultCode: `# Tulis kode mu disini`,
      },
      {
        code: "p73",
        label: "3",
        instructions: `## Activity 3: Angka Loncat / Kelipatan range(start, stop, step)

Parameter ketiga pada \`range()\` adalah \`step\` (jarak/loncatan antar angka).

Contoh: \`range(2, 11, 2)\` akan mencetak angka genap dari 2 sampai 10.

Gunakan \`for\` loop untuk mencetak bilangan ganjil dari \`1\` sampai \`15\`!`,
        defaultCode: `# Tulis kode mu disini`,
      },
      {
        code: "p74",
        label: "4",
        instructions: `## Activity 4: Hitung Mundur dengan range()

\`step\` bernilai negatif (misal \`-1\`) digunakan untuk membuat urutan angka mundur.

Buatlah perulangan hitung mundur dari \`10\` sampai \`1\`, lalu cetak kalimat \`"🚀 ROKET MELUNCUR!"\` di luar loop!`,
        defaultCode: `# Tulis kode mu disini`,
      },
      {
        code: "p75",
        label: "5",
        instructions: `## Activity 5: Mengeja Karakter dalam Teks

\`for\` loop di Python juga bisa mengurai teks huruf demi huruf secara otomatis!

Minta pengguna memasukkan \`nama\` mereka, lalu gunakan \`for\` loop untuk mengeja huruf-huruf dalam nama tersebut ke bawah satu per satu.`,
        defaultCode: `# Tulis kode mu disini`,
      },
      {
        code: "p76",
        label: "6",
        instructions: `## Activity 6: Menghitung Total Angka

Minta pengguna memasukkan sebuah angka \`N\`. Gunakan \`for\` loop dan variabel penampung \`total = 0\` untuk menghitung jumlah dari 1 + 2 + ... + N.

Contoh: Jika \`N = 4\`, hasil akhirnya adalah 10 (karena 1 + 2 + 3 + 4 = 10).`,
        defaultCode: `# Tulis kode mu disini`,
      },
    ],
    quiz: {
      code: "p7-quiz",
      label: "Q",
      questions: [
        {
          question: "Output angka berapa sajakah yang dihasilkan oleh range(1, 5)?",
          choices: [
            { content: "1, 2, 3, 4, 5", isCorrect: false, feedback: "Angka stop (5) tidak ikut dicetak." },
            { content: "1, 2, 3, 4", isCorrect: true, feedback: "Benar! range(1,5) menghasilkan 1, 2, 3, 4 (stop tidak termasuk)." },
            { content: "0, 1, 2, 3, 4, 5", isCorrect: false, feedback: "range(1,5) mulai dari 1, bukan 0, dan 5 tidak termasuk." },
            { content: "0, 1, 2, 3, 4", isCorrect: false, feedback: "range(1,5) mulai dari 1, bukan 0." },
          ],
        },
        {
          question: 'Berapa kali teks "Python" akan dicetak pada kode for i in range(3): print("Python")?',
          choices: [
            { content: "2 kali", isCorrect: false, feedback: "range(3) = [0, 1, 2] → 3 iterasi." },
            { content: "3 kali", isCorrect: true, feedback: "Benar! range(3) berjalan untuk indeks 0, 1, dan 2 — total 3 kali." },
            { content: "4 kali", isCorrect: false, feedback: "range(3) hanya 3 iterasi (0, 1, 2)." },
            { content: "Selamanya", isCorrect: false, feedback: "for loop bukan infinite loop, jumlah iterasi sudah ditentukan." },
          ],
        },
        {
          question: "Manakah sintaks range() yang benar untuk mencetak angka kelipatan 5 dari 5 sampai 25 (termasuk 25)?",
          choices: [
            { content: "range(5, 25, 5)", isCorrect: false, feedback: "25 tidak termasuk karena stop = 25." },
            { content: "range(5, 26, 5)", isCorrect: true, feedback: "Benar! Agar 25 ikut, stop harus 26." },
            { content: "range(5, 25)", isCorrect: false, feedback: "Tanpa step, hanya mencetak 5 sampai 24." },
            { content: "range(25, 5, -5)", isCorrect: false, feedback: "Ini hitung mundur dari 25 ke 5." },
          ],
        },
        {
          question: "Apa hasil dari kode berikut?\n\nfor x in \"AKU\":\n    print(x)",
          choices: [
            { content: 'Mencetak "AKU" dalam 1 baris', isCorrect: false, feedback: "Setiap karakter dicetak terpisah, bukan sekali." },
            { content: "Mencetak A, K, U masing-masing di baris baru", isCorrect: true, feedback: "Benar! for pada string mengurai karakter satu per satu." },
            { content: "Error karena bukan angka", isCorrect: false, feedback: "String bisa diiterasi tanpa error." },
            { content: "Mencetak angka 3", isCorrect: false, feedback: "Bukan angka, tapi karakter-karakter string." },
          ],
        },
        {
          question: "Kapan kita sebaiknya memilih for loop dibanding while loop?",
          choices: [
            { content: "Ketika kita tidak tahu berapa kali kode harus diulang", isCorrect: false, feedback: "Itu saatnya pakai while." },
            { content: "Ketika jumlah perulangannya sudah pasti atau ingin mengurai elemen satu per satu", isCorrect: true, feedback: "Benar! for cocok untuk iterasi dengan jumlah pasti." },
            { content: "Ketika ingin membuat perulangan tanpa henti", isCorrect: false, feedback: "Infinite loop lebih cocok dengan while True." },
            { content: "Keduanya selalu sama persis dan tidak ada bedanya", isCorrect: false, feedback: "for dan while punya kegunaan berbeda." },
          ],
        },
      ],
    },
    capstone: {
      code: "capstone-p7",
      label: "Capstone",
      instructions: `## Mini Project: Pencetak Tabel Perkalian

Buatlah program generator **Tabel Perkalian Otomatis**! Program harus:
1. Meminta pengguna memasukkan angka perkalian yang diinginkan (misal: \`7\`).
2. Menggunakan \`for\` loop dengan \`range(1, 11)\` untuk mencetak tabel perkalian dari 1 sampai 10.
3. Menampilkan output yang rapi menggunakan **f-string**.

Contoh output jika pengguna memasukkan angka \`7\`:

\`\`\`text
========================================
           TABEL PERKALIAN 7
========================================
7 x 1 = 7
7 x 2 = 14
7 x 3 = 21
7 x 4 = 28
7 x 5 = 35
7 x 6 = 42
7 x 7 = 49
7 x 8 = 56
7 x 9 = 63
7 x 10 = 70
========================================
\`\`\``,
      defaultCode: `# Tulis kode mu disini`,
    },
  },
  {
    id: "p8-list",
    title: "Menyimpan Banyak Data (List)",
    goals: "Belajar struktur data list, indexing, manipulasi list (append, remove, len), dan menampilkan list dengan loop",
    tools: "Python Editor",
    levels: [
      {
        code: "p81",
        label: "1",
        instructions: `## Activity 1: Membuat List Pertama & Mengakses Index

List dibuat menggunakan kurung siku \`[]\`. Setiap data dipisahkan oleh tanda koma \`,\`.
Ingat! Indeks pertama selalu dimulai dari angka **\`0\`**.

Buatlah list bernama \`buah\` yang berisi 3 nama buah pilihanmu.
Cetak buah pertama (indeks \`0\`) dan buah terakhir (indeks \`2\`) ke terminal!`,
        defaultCode: `# Tulis kode mu disini`,
      },
      {
        code: "p82",
        label: "2",
        instructions: `## Activity 2: Mengetahui Panjang List dengan len()

Fungsi \`len()\` digunakan untuk menghitung **jumlah total elemen** yang ada di dalam sebuah list.

Buatlah list \`hobi\` yang berisi minimal 4 hobi kamu.
Hitung jumlah hobi menggunakan \`len()\` dan tampilkan hasilnya menggunakan **f-string**!`,
        defaultCode: `# Tulis kode mu disini`,
      },
      {
        code: "p83",
        label: "3",
        instructions: `## Activity 3: Menambahkan Elemen Baru dengan .append()

Method \`.append(data_baru)\` digunakan untuk **menambahkan data baru ke urutan paling akhir** dari sebuah list.

Diberikan list \`tas = ["Buku", "Pensil"]\`.
1. Tambahkan item \`"Penggaris"\` dan \`"Tipe-X"\` ke dalam list \`tas\` menggunakan \`.append()\`.
2. Cetak isi list \`tas\` setelah ditambahkan.`,
        defaultCode: `# Tulis kode mu disini`,
      },
      {
        code: "p84",
        label: "4",
        instructions: `## Activity 4: Menghapus Elemen dengan .remove()

Method \`.remove(nama_item)\` digunakan untuk **menghapus elemen tertentu** berdasarkan namanya dari dalam list.

Diberikan list \`belanja = ["Susu", "Roti", "Telur", "Permen"]\`.
Hapus item \`"Permen"\` dari daftar belanja tersebut, lalu tampilkan daftar belanja yang terbaru!`,
        defaultCode: `# Tulis kode mu disini`,
      },
      {
        code: "p85",
        label: "5",
        instructions: `## Activity 5: Menampilkan Semua Isian List dengan for Loop

Kita bisa menggunakan \`for\` loop untuk mencetak seluruh isi list satu per satu secara otomatis.

Buat list \`game_favorit\` berisi 3 judul game.
Gunakan \`for\` loop untuk mencetak setiap game dengan format: \`"Saya suka bermain [nama_game]"!\``,
        defaultCode: `# Tulis kode mu disini`,
      },
      {
        code: "p86",
        label: "6",
        instructions: `## Activity 6: Mengubah Nilai Elemen pada List

Kita bisa mengubah isi elemen list pada indeks tertentu dengan cara:
\`nama_list[indeks] = nilai_baru\`

Diberikan list \`juara = ["Budi", "Andi", "Cici"]\`.
Ternyata juara 2 (indeks \`1\`) didiskualifikasi dan digantikan oleh \`"Deni"\`. Ubah nama di indeks \`1\` menjadi \`"Deni"\` lalu cetak list terbarunya!`,
        defaultCode: `# Tulis kode mu disini`,
      },
    ],
    quiz: {
      code: "p8-quiz",
      label: "Q",
      questions: [
        {
          question: "Simbol apakah yang digunakan untuk membuat List di Python?",
          choices: [
            { content: "Kurung biasa ()", isCorrect: false, feedback: "() membuat tuple, bukan list." },
            { content: "Kurung kurawal {}", isCorrect: false, feedback: "{} membuat dictionary atau set." },
            { content: "Kurung siku []", isCorrect: true, feedback: "Benar! List menggunakan kurung siku []." },
            { content: "Tanda petik \"\"", isCorrect: false, feedback: "Tanda petik digunakan untuk string." },
          ],
        },
        {
          question: "Berapa angka indeks dari elemen PERTAMA di dalam list?",
          choices: [
            { content: "1", isCorrect: false, feedback: "Indeks dimulai dari 0, bukan 1." },
            { content: "0", isCorrect: true, feedback: "Benar! Indeks selalu dimulai dari angka 0." },
            { content: "-1", isCorrect: false, feedback: "-1 adalah indeks elemen terakhir." },
            { content: "Bervariasi tergantung isi", isCorrect: false, feedback: "Indeks selalu tetap: 0 untuk elemen pertama." },
          ],
        },
        {
          question: "Apa hasil dari kode berikut?\n\nhewan = [\"Kucing\", \"Anjing\", \"Kelinci\"]\nprint(hewan[1])",
          choices: [
            { content: "Kucing", isCorrect: false, feedback: "Indeks 0 = Kucing, indeks 1 = Anjing." },
            { content: "Anjing", isCorrect: true, feedback: "Benar! Indeks 1 adalah elemen kedua: Anjing." },
            { content: "Kelinci", isCorrect: false, feedback: "Kelinci ada di indeks 2." },
            { content: "Error", isCorrect: false, feedback: "Indeks 1 valid karena list punya 3 elemen." },
          ],
        },
        {
          question: "Method apakah yang digunakan untuk menambahkan elemen baru ke bagian akhir list?",
          choices: [
            { content: ".add()", isCorrect: false, feedback: "Tidak ada method .add() untuk list." },
            { content: ".insert()", isCorrect: false, feedback: ".insert() bisa tambah di posisi tertentu, tapi bukan di akhir." },
            { content: ".append()", isCorrect: true, feedback: "Benar! .append() menambah item ke posisi paling belakang." },
            { content: ".push()", isCorrect: false, feedback: ".push() adalah method di JavaScript, bukan Python." },
          ],
        },
        {
          question: "Apa yang terjadi jika kita mencoba mengakses angka[5] padahal list angka hanya berisi 3 elemen?",
          choices: [
            { content: "Mengembalikan nilai 0", isCorrect: false, feedback: "Tidak mengembalikan default, tapi error." },
            { content: "Mengembalikan string kosong", isCorrect: false, feedback: "Bukan, Python tidak mengembalikan default." },
            { content: "Terjadi Error (IndexError: list index out of range)", isCorrect: true, feedback: "Benar! Mengakses indeks di luar jangkauan memicu IndexError." },
            { content: "Otomatis menambah elemen baru sampai indeks ke-5", isCorrect: false, feedback: "List tidak otomatis diperluas." },
          ],
        },
      ],
    },
    capstone: {
      code: "capstone-p8",
      label: "Capstone",
      instructions: `## Mini Project: Aplikasi To-Do List Sederhana

Buatlah program **Aplikasi To-Do List (Daftar Tugas)** interaktif! Program harus:
1. Membuat list kosong bernama \`kegiatan = []\`.
2. Menggunakan \`while\` loop untuk menampilkan menu interaktif:
   - \`1\`: Lihat Semua Kegiatan
   - \`2\`: Tambah Kegiatan Baru
   - \`3\`: Hapus Kegiatan
   - \`4\`: Keluar
3. Jalankan logika sesuai nomor menu pilihan pengguna:
   - Jika pilih \`1\`: Cetak isi \`kegiatan\`. Jika kosong, cetak \`"Belum ada kegiatan."\`
   - Jika pilih \`2\`: Minta input nama kegiatan baru lalu tambahkan via \`.append()\`.
   - Jika pilih \`3\`: Minta input nama kegiatan yang ingin dihapus lalu hapus via \`.remove()\`.
   - Jika pilih \`4\`: Hentikan loop (\`break\`) dan cetak \`"Terima kasih!"\``,
      defaultCode: `# Tulis kode mu disini`,
    },
  },
  {
    id: "p9-dict",
    title: "Data Berpasangan (Dictionary)",
    goals: "Belajar struktur data dictionary, key-value, menambah/mengubah/menghapus data, dan mengakses data dengan key",
    tools: "Python Editor",
    levels: [
      {
        code: "p91",
        label: "1",
        instructions: `## Activity 1: Membuat Dictionary Pertama Kamu

Dictionary disimpan menggunakan kurung kurawal \`{}\` dengan format \`"key": "value"\`.

Buatlah sebuah dictionary bernama \`siswa\` yang menyimpan data berikut:
- \`"nama"\`: nama lengkapmu
- \`"umur"\`: umurmu saat ini (angka)
- \`"kelas"\`: kelasmu di sekolah

Lalu cetak dictionary tersebut menggunakan \`print()\`.`,
        defaultCode: `# Tulis kode mu disini`,
      },
      {
        code: "p92",
        label: "2",
        instructions: `## Activity 2: Mengakses Nilai Menggunakan Key

Untuk mengambil data di dictionary, tulis nama dictionary diikuti tanda kurung siku \`[]\` berisi **Key**-nya.
Contoh: \`print(siswa["nama"])\`

Buat dictionary \`game\` berisi \`"judul": "Minecraft"\` dan \`"genre": "Sandbox"\`. Tampilkan judul dan genre game tersebut dalam kalimat yang rapi menggunakan f-string!`,
        defaultCode: `# Tulis kode mu disini`,
      },
      {
        code: "p93",
        label: "3",
        instructions: `## Activity 3: Menambah & Mengubah Data di Dictionary

Untuk mengubah nilai atau menambah key baru, cukup gunakan format:
\`dictionary[key] = nilai_baru\`

Diberikan dictionary \`buah = {"nama": "Apel", "harga": 10000}\`:
1. Ubah \`harga\` menjadi \`15000\`.
2. Tambahkan key baru \`"stok"\` dengan nilai \`50\`.
3. Cetak isi dictionary \`buah\` yang terbaru.`,
        defaultCode: `# Tulis kode mu disini`,
      },
      {
        code: "p94",
        label: "4",
        instructions: `## Activity 4: Menghapus Data & Pengecekan Key

- Kita bisa menghapus data menggunakan perintah \`del dictionary[key]\`.
- Kita bisa mengecek apakah suatu key ada di dictionary menggunakan kata kunci \`in\`.

Diberikan dictionary \`item = {"hp": 100, "mp": 50, "potion": 3}\`:
1. Hapus key \`"mp"\` dari dictionary.
2. Cek apakah key \`"potion"\` ada di dalam \`item\` menggunakan \`if "potion" in item:\`. Cetak \`"Potion tersedia!"\` jika ada.`,
        defaultCode: `# Tulis kode mu disini`,
      },
      {
        code: "p95",
        label: "5",
        instructions: `## Activity 5: Menampilkan Semua Key & Value

Kita bisa mengambil semua key dengan \`.keys()\`, semua value dengan \`.values()\`, atau keduanya bersamaan dengan \`.items()\`.

Gunakan \`for key, value in dictionary.items():\` untuk mencetak seluruh isi dictionary \`biodata\` baris demi baris!`,
        defaultCode: `# Tulis kode mu disini`,
      },
      {
        code: "p96",
        label: "6",
        instructions: `## Activity 6: Kamus Bahasa Gaul / Istilah Internet

Buat program kamus istilah internet!
1. Buat dictionary \`kamus\` berisi 3 kata gaul beserta artinya (misal: \`"AFK"\`, \`"BRB"\`, \`"GG"\`).
2. Minta input kata dari pengguna.
3. Jika kata ada di kamus, tampilkan artinya. Jika tidak ada, cetak \`"Kata tidak ditemukan dalam kamus."\`.`,
        defaultCode: `# Tulis kode mu disini`,
      },
    ],
    quiz: {
      code: "p9-quiz",
      label: "Q",
      questions: [
        {
          question: "Simbol apakah yang digunakan untuk membuat Dictionary di Python?",
          choices: [
            { content: "Kurung siku []", isCorrect: false, feedback: "[] untuk list, bukan dictionary." },
            { content: "Kurung biasa ()", isCorrect: false, feedback: "() untuk tuple." },
            { content: "Kurung kurawal {}", isCorrect: true, feedback: "Benar! Dictionary menggunakan kurung kurawal {}." },
            { content: "Tanda petik \"\"", isCorrect: false, feedback: "Tanda petik untuk string." },
          ],
        },
        {
          question: 'Bagaimana cara mengambil nilai "Budi" dari dictionary user = {"nama": "Budi", "umur": 15}?',
          choices: [
            { content: "user[0]", isCorrect: false, feedback: "Dictionary tidak diakses dengan indeks angka." },
            { content: 'user["nama"]', isCorrect: true, feedback: "Benar! Akses data dictionary menggunakan nama Key-nya." },
            { content: "user.get(0)", isCorrect: false, feedback: "Key yang benar adalah \"nama\", bukan 0." },
            { content: "user.nama", isCorrect: false, feedback: "Python tidak menggunakan dot notation untuk dictionary." },
          ],
        },
        {
          question: "Apa yang terjadi jika kita mencoba mengakses key yang TIDAK ADA di dictionary tanpa penanganan khusus?",
          choices: [
            { content: "Mengembalikan nilai 0", isCorrect: false, feedback: "Dictionary tidak mengembalikan default." },
            { content: "Mengembalikan string kosong", isCorrect: false, feedback: "Tidak, akan terjadi error." },
            { content: "Terjadi Error (KeyError)", isCorrect: true, feedback: "Benar! Akses key yang tidak ada memicu KeyError." },
            { content: "Program otomatis menambah key tersebut", isCorrect: false, feedback: "Dictionary tidak otomatis menambah key." },
          ],
        },
        {
          question: 'Perintah manakah yang benar untuk menghapus key "umur" dari dictionary profil?',
          choices: [
            { content: 'del profil["umur"]', isCorrect: true, feedback: "Benar! del digunakan untuk menghapus key beserta valuenya." },
            { content: 'profil.remove("umur")', isCorrect: false, feedback: ".remove() adalah method list, bukan dictionary." },
            { content: 'delete profil["umur"]', isCorrect: false, feedback: "Python menggunakan del, bukan delete." },
            { content: 'profil.pop_index("umur")', isCorrect: false, feedback: "pop_index() bukan fungsi Python." },
          ],
        },
        {
          question: "Manakah pernyataan yang BENAR mengenai perbedaan List dan Dictionary?",
          choices: [
            { content: "List menggunakan kurung kurawal, Dictionary menggunakan kurung siku", isCorrect: false, feedback: "Terbalik. List = [], Dict = {}." },
            { content: "List diakses menggunakan angka indeks, Dictionary diakses menggunakan Key", isCorrect: true, feedback: "Benar! List = indeks numerik, Dict = key." },
            { content: "List tidak bisa diubah isinya, Dictionary bisa", isCorrect: false, feedback: "Keduanya bisa diubah (mutable)." },
            { content: "Dictionary hanya bisa menyimpan tipe data teks", isCorrect: false, feedback: "Dictionary bisa menyimpan berbagai tipe data." },
          ],
        },
      ],
    },
    capstone: {
      code: "capstone-p9",
      label: "Capstone",
      instructions: `## Mini Project: Buku Kontak Telepon Digital

Buatlah program **Buku Kontak Telepon Digital** interaktif! Program harus:
1. Memiliki dictionary \`kontak = {"Amir": "08123456789", "Beti": "08987654321"}\`.
2. Menampilkan menu interaktif dalam \`while\` loop:
   - \`1\`: Lihat Semua Kontak
   - \`2\`: Tambah Kontak Baru
   - \`3\`: Cari Kontak
   - \`4\`: Keluar
3. Jalankan fitur sesuai nomor menu yang dipilih pengguna!`,
      defaultCode: `# Tulis kode mu disini`,
    },
  },
  {
    id: "p10-function",
    title: "Membuat Fungsi (Function)",
    goals: "Belajar membuat fungsi dengan def, parameter, return, dan reusability kode",
    tools: "Python Editor",
    levels: [
      {
        code: "p101",
        label: "1",
        instructions: `## Activity 1: Membuat Fungsi Pertama Kamu (def)

Fungsi dibuat menggunakan kata kunci \`def\` diikuti \`nama_fungsi():\`.
Kode di dalam fungsi baru akan dijalankan ketika fungsi tersebut **dipanggil** (\`nama_fungsi()\`).

1. Buatlah fungsi bernama \`sapa_dunia()\` yang mencetak \`"Halo! Selamat datang di dunia Python!"\`.
2. Panggil fungsi tersebut sebanyak 2 kali!`,
        defaultCode: `# Tulis kode mu disini`,
      },
      {
        code: "p102",
        label: "2",
        instructions: `## Activity 2: Fungsi dengan Parameter (Menerima Input)

Parameter adalah variabel penampung di dalam tanda kurung \`()\` fungsi untuk menerima data dari luar.

Buatlah fungsi \`sapa_pemain(nama)\` yang menerima 1 parameter \`nama\`, lalu mencetak sapaan: \`"Selamat bertualang, [nama]!"\`.
Panggil fungsi tersebut dengan nama kamu dan nama temanmu!`,
        defaultCode: `# Tulis kode mu disini`,
      },
      {
        code: "p103",
        label: "3",
        instructions: `## Activity 3: Fungsi dengan Banyak Parameter

Fungsi bisa menerima lebih dari satu parameter, dipisahkan dengan tanda koma \`,\`.

Buat fungsi \`cetak_identitas(nama, umur, peran)\` yang mencetak 3 data tersebut dalam kalimat yang rapi menggunakan f-string.
Panggil fungsi tersebut dengan memasukkan 3 argumen!`,
        defaultCode: `# Tulis kode mu disini`,
      },
      {
        code: "p104",
        label: "4",
        instructions: `## Activity 4: Mengembalikan Nilai dengan return

Daripada langsung mencetak dengan \`print()\`, fungsi sering kali digunakan untuk **menghitung dan mengembalikan nilai** menggunakan kata kunci \`return\`. Hasilnya bisa disimpan ke dalam variabel baru.

Buat fungsi \`tambah(a, b)\` yang mengembalikan hasil penjumlahan \`a + b\`.
Simpan hasil pemanggilan \`tambah(10, 20)\` ke variabel \`total\`, lalu cetak \`total\`!`,
        defaultCode: `# Tulis kode mu disini`,
      },
      {
        code: "p105",
        label: "5",
        instructions: `## Activity 5: Menghitung Luas Segitiga dengan Fungsi

Rumus luas segitiga adalah 1/2 x alas x tinggi.

Buat fungsi \`hitung_luas_segitiga(alas, tinggi)\` yang mengembalikan nilai luasnya.
Minta input alas dan tinggi dari pengguna, panggil fungsinya, lalu tampilkan hasilnya!`,
        defaultCode: `# Tulis kode mu disini`,
      },
      {
        code: "p106",
        label: "6",
        instructions: `## Activity 6: Cek Bilangan Genap atau Ganjil via Fungsi

Buat fungsi \`is_genap(angka)\` yang mengembalikan nilai Boolean (\`True\` jika genap, \`False\` jika ganjil).

Gunakan fungsi tersebut di dalam kondisi \`if\` untuk mengecek angka dari pengguna dan tampilkan pesan apakah angka tersebut Genap atau Ganjil!`,
        defaultCode: `# Tulis kode mu disini`,
      },
    ],
    quiz: {
      code: "p10-quiz",
      label: "Q",
      questions: [
        {
          question: "Kata kunci apakah yang digunakan untuk mendefinisikan/membuat fungsi baru di Python?",
          choices: [
            { content: "function", isCorrect: false, feedback: "function adalah keyword di JavaScript, bukan Python." },
            { content: "def", isCorrect: true, feedback: "Benar! def adalah singkatan dari define." },
            { content: "create", isCorrect: false, feedback: "Tidak ada keyword create di Python." },
            { content: "make", isCorrect: false, feedback: "Tidak ada keyword make di Python." },
          ],
        },
        {
          question: "Apa yang dimaksud dengan Parameter pada fungsi?",
          choices: [
            { content: "Nama akhir dari sebuah fungsi", isCorrect: false, feedback: "Parameter bukan nama fungsi." },
            { content: "Variabel di dalam kurung fungsi yang berguna menerima input data", isCorrect: true, feedback: "Benar! Parameter sebagai wadah penampung data masukan." },
            { content: "Perintah untuk menghentikan fungsi", isCorrect: false, feedback: "Itu fungsi return atau break." },
            { content: "Hasil keluaran akhir dari fungsi", isCorrect: false, feedback: "Itu return value, bukan parameter." },
          ],
        },
        {
          question: "Apa perbedaan utama antara print() dan return di dalam sebuah fungsi?",
          choices: [
            { content: "Tidak ada perbedaan, keduanya sama persis", isCorrect: false, feedback: "Sangat berbeda cara kerjanya." },
            { content: "print() hanya menampilkan teks ke layar, sedangkan return mengembalikan nilai agar bisa disimpan ke variabel lain", isCorrect: true, feedback: "Benar! return mengalirkan data kembali ke pemanggil fungsi." },
            { content: "return hanya bisa digunakan untuk angka", isCorrect: false, feedback: "return bisa mengembalikan tipe data apapun." },
            { content: "print() otomatis menghentikan jalannya fungsi", isCorrect: false, feedback: "print() tidak menghentikan fungsi." },
          ],
        },
        {
          question: "Apa yang terjadi jika kita membuat fungsi tetapi TIDAK pernah memanggilnya?",
          choices: [
            { content: "Terjadi Error", isCorrect: false, feedback: "Mendefinisikan fungsi tanpa memanggilnya tidak menyebabkan error." },
            { content: "Kode di dalam fungsi tidak akan pernah dijalankan", isCorrect: true, feedback: "Benar! Fungsi hanya berjalan jika dipanggil." },
            { content: "Komputer akan menjalankan fungsi secara otomatis di akhir program", isCorrect: false, feedback: "Fungsi tidak jalan otomatis." },
            { content: "Fungsi akan terhapus sendiri", isCorrect: false, feedback: "Fungsi tetap tersimpan di memori." },
          ],
        },
        {
          question: "Apa output dari kode berikut?\n\ndef kali(x, y):\n    return x * y\n\nhasil = kali(4, 3)\nprint(hasil)",
          choices: [
            { content: "7", isCorrect: false, feedback: "7 adalah hasil 4 + 3, bukan 4 x 3." },
            { content: "12", isCorrect: true, feedback: "Benar! 4 x 3 = 12." },
            { content: "43", isCorrect: false, feedback: "Itu hasil concatenation string, bukan perkalian." },
            { content: "Error", isCorrect: false, feedback: "Kode ini valid." },
          ],
        },
      ],
    },
    capstone: {
      code: "capstone-p10",
      label: "Capstone",
      instructions: `## Mini Project: Modul Kalkulator Super Lengkap

Buatlah program **Kalkulator Berbasis Fungsi**! Program harus:
1. Membuat 4 fungsi terpisah:
   - \`tambah(a, b)\` -> return a + b
   - \`kurang(a, b)\` -> return a - b
   - \`kali(a, b)\` -> return a x b
   - \`bagi(a, b)\` -> return a / b
2. Menampilkan menu pilihan operasi (1. Tambah, 2. Kurang, 3. Kali, 4. Bagi).
3. Meminta pengguna memilih menu dan memasukkan 2 angka.
4. Memanggil fungsi yang sesuai dan menampilkan hasil perhitungannya!`,
      defaultCode: `# Tulis kode mu disini`,
    },
  },
  {
    id: "p11-string",
    title: "Bekerja dengan Teks (String Manipulation)",
    goals: "Belajar manipulasi string: kapitalisasi, strip, slicing, replace, split/join, dan pengecekan kata",
    tools: "Python Editor",
    levels: [
      {
        code: "p111",
        label: "1",
        instructions: `## Activity 1: Mengubah Kapitalisasi Teks

Python menyediakan *method* bawaan untuk mengubah bentuk huruf:
- \`.upper()\` : Mengubah semua huruf menjadi KAPITAL.
- \`.lower()\` : Mengubah semua huruf menjadi kecil.
- \`.title()\` : Mengubah Huruf Pertama Setiap Kata Menjadi Kapital.

Diberikan variabel \`pesan = "selamat datang di dunia python"\`.
Tampilkan teks tersebut dalam 3 bentuk: Kapital Semua, Huruf Kecil Semua, dan Format Judul (Title Case)!`,
        defaultCode: `# Tulis kode mu disini`,
      },
      {
        code: "p112",
        label: "2",
        instructions: `## Activity 2: Membersihkan Spasi Liar dengan .strip()

Pengguna sering kali tidak sengaja menekan spasi di awal atau akhir saat mengetik. Method \`.strip()\` berguna untuk **menghapus spasi liar** di awal dan akhir string.

Diberikan variabel \`email_input = "   user_keren@gmail.com   "\`.
1. Bersihkan spasi liar tersebut menggunakan \`.strip()\`.
2. Cetak email yang sudah bersih dan tampilkan jumlah karakternya menggunakan \`len()\`.`,
        defaultCode: `# Tulis kode mu disini`,
      },
      {
        code: "p113",
        label: "3",
        instructions: `## Activity 3: Memotong Teks (String Slicing)

Sama seperti List, elemen dalam String memiliki index. Kita bisa memotong teks menggunakan format \`string[start:stop]\`.
Catatan: Karakter pada posisi \`stop\` tidak ikut terbawa!

Diberikan variabel \`kode_produk = "PRD-98765-ID"\`.
1. Ambil 3 huruf pertama (\`"PRD"\`) menggunakan slicing \`[0:3]\`.
2. Ambil 5 digit angka di tengah (\`"98765"\`).
3. Cetak kedua hasil potongan tersebut!`,
        defaultCode: `# Tulis kode mu disini`,
      },
      {
        code: "p114",
        label: "4",
        instructions: `## Activity 4: Mengganti Kata dengan .replace()

Method \`.replace("kata_lama", "kata_baru")\` digunakan untuk mengganti kata tertentu di dalam string dengan kata lain.

Diberikan variabel \`kalimat = "Saya suka makan apel merah."\`.
Ubah kata \`"apel"\` menjadi \`"pisang"\` dan kata \`"merah"\` menjadi \`"manis"\`, lalu cetak kalimat terbarunya!`,
        defaultCode: `# Tulis kode mu disini`,
      },
      {
        code: "p115",
        label: "5",
        instructions: `## Activity 5: Memecah dan Menggabungkan Teks (.split() & .join())

- \`.split("pemisah")\` memecah string menjadi List.
- \`"pemisah".join(list)\` menggabungkan elemen List kembali menjadi satu string.

1. Diberikan string \`hobi_str = "Membaca, Melukis, Berenang"\`. Pecah string tersebut menjadi list menggunakan \`.split(", ")\`.
2. Gabungkan kembali list tersebut menggunakan tanda hubung \`"-"\` dengan \`.join()\`.`,
        defaultCode: `# Tulis kode mu disini`,
      },
      {
        code: "p116",
        label: "6",
        instructions: `## Activity 6: Cek Sensor Kata Terlarang (in)

Kata kunci \`in\` dapat mengecek apakah suatu kata/sub-string ada di dalam teks (mengembalikan \`True\` atau \`False\`).

1. Buat variabel \`komentar\` berisi input dari pengguna.
2. Ubah komentar menjadi huruf kecil semua (\`.lower()\`) agar mudah dicek.
3. Jika terdapat kata \`"spam"\` atau \`"toxic"\` di dalam komentar, cetak \`"Komentar Anda diblokir!"\`. Jika tidak, cetak \`"Komentar berhasil dipublikasikan!"\`.`,
        defaultCode: `# Tulis kode mu disini`,
      },
    ],
    quiz: {
      code: "p11-quiz",
      label: "Q",
      questions: [
        {
          question: "Method manakah yang digunakan untuk mengubah seluruh string menjadi huruf KAPITAL?",
          choices: [
            { content: ".capitalize()", isCorrect: false, feedback: ".capitalize() hanya mengubah huruf pertama." },
            { content: ".title()", isCorrect: false, feedback: ".title() mengubah huruf pertama setiap kata." },
            { content: ".upper()", isCorrect: true, feedback: "Benar! .upper() mengubah teks menjadi kapital semua." },
            { content: ".to_large()", isCorrect: false, feedback: "Tidak ada method .to_large() di Python." },
          ],
        },
        {
          question: "Apa fungsi utama dari method .strip()?",
          choices: [
            { content: "Menghapus semua angka dari teks", isCorrect: false, feedback: ".strip() tidak menghapus angka." },
            { content: "Menghapus spasi tambahan di awal dan akhir teks", isCorrect: true, feedback: "Benar! .strip() membuang spasi liar di ujung string." },
            { content: "Memotong string menjadi dua bagian", isCorrect: false, feedback: "Itu slicing, bukan .strip()." },
            { content: "Menghapus huruf vokal dari string", isCorrect: false, feedback: ".strip() tidak menghapus vokal." },
          ],
        },
        {
          question: "Apa hasil dari potongan kode berikut?\n\nteks = \"Python\"\nprint(teks[0:3])",
          choices: [
            { content: "Pyt", isCorrect: true, feedback: "Benar! Indeks 0, 1, 2 diambil, indeks 3 tidak ikut." },
            { content: "Pyth", isCorrect: false, feedback: "Indeks 3 tidak ikut terbawa dalam slicing [0:3]." },
            { content: "ytho", isCorrect: false, feedback: "Itu hasil dari [1:5]." },
            { content: "Python", isCorrect: false, feedback: "[0:3] hanya mengambil 3 karakter pertama." },
          ],
        },
        {
          question: "Method manakah yang digunakan untuk memecah kalimat menjadi sebuah List kata?",
          choices: [
            { content: ".break()", isCorrect: false, feedback: "Tidak ada method .break() untuk string." },
            { content: ".slice()", isCorrect: false, feedback: ".slice() tidak ada di Python." },
            { content: ".cut()", isCorrect: false, feedback: "Tidak ada method .cut() di Python." },
            { content: ".split()", isCorrect: true, feedback: "Benar! .split() memotong string berdasarkan pemisah menjadi list." },
          ],
        },
        {
          question: 'Apa hasil dari "Python".replace("o", "a")?',
          choices: [
            { content: "Pythan", isCorrect: true, feedback: "Benar! Huruf o diganti menjadi a." },
            { content: "Python", isCorrect: false, feedback: "replace akan mengubah o menjadi a." },
            { content: "Pythn", isCorrect: false, feedback: "replace mengganti, bukan menghapus." },
            { content: "Error", isCorrect: false, feedback: "Kode ini valid." },
          ],
        },
      ],
    },
    capstone: {
      code: "capstone-p11",
      label: "Capstone",
      instructions: `## Mini Project: Sistem Filter Sensor & Format Nama Otomatis

Buatlah program **Rapi Nama & Sensor Komentar Otomatis**! Program harus:
1. Meminta pengguna memasukkan nama mereka (yang mungkin tidak rapi, misal \`"  aMdi  sUpRaPtO  "\`).
2. Rapikan nama tersebut: hapus spasi liar dengan \`.strip()\` dan ubah ke format judul (\`.title()\`).
3. Meminta pengguna memasukkan kalimat komentar.
4. Cek komentar tersebut:
   - Jika ada kata terlarang (misal: \`"jelek"\`, \`"bodoh"\`, atau \`"hoax"\`), ganti kata tersebut dengan tanda sensor \`"***"\` menggunakan \`.replace()\`.
5. Tampilkan nama pengguna yang sudah rapi beserta komentar akhir yang sudah disensor!`,
      defaultCode: `# Tulis kode mu disini`,
    },
  },
  {
    id: "p12-cashier",
    title: "Mini Project - Aplikasi Kasir Toko",
    goals: "Proyek integrasi: List, Dictionary, Function, String Manipulation, Loops, dan Conditionals dalam aplikasi kasir CLI",
    tools: "Python Editor",
    levels: [
      {
        code: "p121",
        label: "1",
        instructions: `## Activity 1: Menyiapkan Database Menu Barang (Dictionary)

Aplikasi kasir membutuhkan daftar barang beserta harganya.

Buatlah dictionary \`menu_makanan\` yang berisi sekurang-kurangnya 4 daftar makanan dan harganya:
- \`"Nasi Goreng"\`: \`15000\`
- \`"Mie Goreng"\`: \`12000\`
- \`"Ayam Goreng"\`: \`18000\`
- \`"Es Teh"\`: \`5000\`

Gunakan \`for item, harga in menu_makanan.items():\` untuk menampilkan seluruh menu ke layar secara rapi!`,
        defaultCode: `# Tulis kode mu disini`,
      },
      {
        code: "p122",
        label: "2",
        instructions: `## Activity 2: Fungsi Format Rupiah (String Manipulation + Function)

Agar tampilan harga menarik, kita bisa membuat fungsi penyesuai format angka.

Buatlah fungsi \`format_rupiah(nominal)\` yang mengembalikan string berformat Rupiah.
Contoh: \`15000\` -> \`"Rp 15000"\`.

Gunakan f-string untuk menambahkan prefiks \`"Rp "\` lalu uji fungsi tersebut dengan angka \`25000\`!`,
        defaultCode: `# Tulis kode mu disini`,
      },
      {
        code: "p123",
        label: "3",
        instructions: `## Activity 3: Menambahkan Item ke Keranjang Belanja (List)

Keranjang belanja akan menyimpan daftar item yang dibeli oleh pelanggan.

1. Buat list kosong bernama \`keranjang = []\`.
2. Minta input nama makanan dari pengguna.
3. Ubah input tersebut menjadi format judul (\`.title()\`).
4. Tambahkan item tersebut ke dalam \`keranjang\` menggunakan \`.append()\`.
5. Cetak isi keranjang belanja.`,
        defaultCode: `# Tulis kode mu disini`,
      },
      {
        code: "p124",
        label: "4",
        instructions: `## Activity 4: Fungsi Menghitung Total Belanja (Function + Loops)

Buat fungsi \`hitung_total(daftar_belanja, menu)\` yang menerima 2 parameter:
- \`daftar_belanja\` (List berisi nama barang yang dibeli)
- \`menu\` (Dictionary berisi nama barang dan harganya)

Fungsi akan melakukan iterasi pada \`daftar_belanja\`, mencocokkannya dengan harga di \`menu\`, menjumlahkan totalnya, lalu mengembalikan (\`return\`) total harga tersebut.`,
        defaultCode: `# Tulis kode mu disini`,
      },
      {
        code: "p125",
        label: "5",
        instructions: `## Activity 5: Menghitung Diskon Pembayaran

Toko memberikan diskon 10% jika total belanja **minimal Rp 50.000**.

1. Buat variabel \`total_belanja\`.
2. Buat kondisi \`if\`: jika \`total_belanja >= 50000\`, hitung diskon 10% (0.10 x total_belanja).
3. Jika kurang dari Rp 50.000, diskon adalah \`0\`.
4. Tampilkan total akhir yang harus dibayar setelah dikurangi diskon!`,
        defaultCode: `# Tulis kode mu disini`,
      },
      {
        code: "p126",
        label: "6",
        instructions: `## Activity 6: Menghitung Kembalian & Validasi Uang

Minta input jumlah uang yang dibayarkan pelanggan (\`uang_bayar\`).

1. Gunakan \`while\` loop: Jika \`uang_bayar < total_bayar\`, cetak \`"Uang tidak cukup!"\` dan minta input uang kembali.
2. Hitung kembalian (\`uang_bayar - total_bayar\`).
3. Tampilkan pesan transaksi berhasil beserta nominal kembaliannya!`,
        defaultCode: `# Tulis kode mu disini`,
      },
    ],
    quiz: {
      code: "p12-quiz",
      label: "Q",
      questions: [
        {
          question: "Struktur data apakah yang paling cocok digunakan untuk menyimpan daftar menu beserta harganya?",
          choices: [
            { content: "List", isCorrect: false, feedback: "List tidak memiliki key-value." },
            { content: "String", isCorrect: false, feedback: "String hanya untuk teks." },
            { content: "Dictionary", isCorrect: true, feedback: "Benar! Dictionary sangat cocok untuk pasangan nama barang dan harga." },
            { content: "Integer", isCorrect: false, feedback: "Integer hanya untuk angka." },
          ],
        },
        {
          question: "Mengapa input nama menu dari pengguna sebaiknya diubah menggunakan .title() atau .lower() sebelum dicocokkan dengan dictionary menu?",
          choices: [
            { content: "Agar program berjalan lebih cepat", isCorrect: false, feedback: "Kecepatan tidak terpengaruh." },
            { content: "Agar tidak terjadi KeyError akibat perbedaan huruf besar/kecil", isCorrect: true, feedback: "Benar! Pencarian key Dictionary bersifat Case-Sensitive." },
            { content: "Agar otomatis mendapat diskon", isCorrect: false, feedback: "Diskon berdasarkan total, bukan format nama." },
            { content: "Karena Python wajib menggunakan huruf kapital", isCorrect: false, feedback: "Python tidak mewajibkan huruf kapital." },
          ],
        },
        {
          question: "Method apakah yang digunakan untuk memasukkan item pesanan baru ke dalam List keranjang belanja?",
          choices: [
            { content: ".append()", isCorrect: true, feedback: "Benar! .append() menambahkan item ke urutan terakhir list." },
            { content: ".update()", isCorrect: false, feedback: ".update() untuk dictionary, bukan list." },
            { content: ".add()", isCorrect: false, feedback: ".add() untuk set, bukan list." },
            { content: ".push()", isCorrect: false, feedback: ".push() untuk JavaScript, bukan Python." },
          ],
        },
        {
          question: "Kondisi manakah yang benar untuk memberikan diskon 10% saat total belanja mencapai atau melebihi Rp 100.000?",
          choices: [
            { content: "if total == 100000:", isCorrect: false, feedback: "== hanya tepat saat 100.000, bukan melebihi." },
            { content: "if total >= 100000:", isCorrect: true, feedback: "Benar! >= digunakan untuk minimal/mencapai atau melebihi." },
            { content: "if total < 100000:", isCorrect: false, feedback: "Ini kebalikannya (kurang dari)." },
            { content: "while total >= 100000:", isCorrect: false, feedback: "while untuk perulangan, bukan pengecekan kondisi." },
          ],
        },
        {
          question: "Apa fungsi dari kata kunci break di dalam while loop aplikasi kasir?",
          choices: [
            { content: "Menghapus seluruh pesanan pelanggan", isCorrect: false, feedback: "break tidak menghapus data." },
            { content: "Mengulang kembali proses pemesanan dari awal", isCorrect: false, feedback: "Itu continue atau loop restart." },
            { content: "Menghentikan loop pesanan jika pengguna selesai memilih menu", isCorrect: true, feedback: "Benar! break menghentikan pengerjaan perulangan." },
            { content: "Menampilkan pesan error", isCorrect: false, feedback: "break menghentikan loop, bukan menampilkan error." },
          ],
        },
      ],
    },
    capstone: {
      code: "capstone-p12",
      label: "Capstone",
      instructions: `## Mini Project: Sistem Kasir & Cetak Struk Pembayaran

Gabungkan seluruh modul untuk membuat **Aplikasi Kasir Warung Pintar** lengkap!

**Spesifikasi Program:**
1. Memiliki Dictionary \`menu = {"Nasi Goreng": 15000, "Mie Ayam": 12000, "Es Teh": 5000, "Ayam Bakar": 20000}\`.
2. Tampilkan daftar menu beserta harganya saat program dimulai.
3. Gunakan \`while\` loop untuk meminta pemesanan barang berulang kali sampai pengguna mengetik \`"selesai"\`.
4. Setiap item yang valid akan dimasukkan ke dalam List \`keranjang\`. Jika barang tidak ada di menu, tampilkan pesan warning.
5. Hitung total belanja. Berikan diskon **10%** jika total belanja **>= Rp 50.000**.
6. Minta input pembayaran uang dari kasir, pastikan uang cukup, lalu hitung kembalian.
7. Cetak **Struk Pembayaran** yang rapi berisi:
   - Daftar barang yang dibeli
   - Total Belanja
   - Diskon (jika ada)
   - Total Bayar Akhir
   - Uang Bayar & Kembalian`,
      defaultCode: `# Tulis kode mu disini`,
    },
  },
];

export async function seedPythonExplorer(
  prisma: PrismaClient,
  defaultAssessment: { id: string },
) {
  await prisma.studentTopicProgress.deleteMany({
    where: { topicTask: { topic: { curriculum: { name: "python-explorer" } } } },
  });
  await prisma.curriculum.deleteMany({ where: { name: "python-explorer" } });

  const curriculum = await prisma.curriculum.create({
    data: {
      name: "python-explorer",
      assessmentSetId: defaultAssessment.id,
      topics: {
        create: pythonExplorerUnits.map((unit, i) => ({
          title: unit.title,
          order: i,
          goals: unit.goals,
          tools: unit.tools,
        })),
      },
    },
    include: { topics: true },
  });

  for (const [unitIdx, unit] of pythonExplorerUnits.entries()) {
    const topicRow = curriculum.topics.find((t) => t.title === unit.title);
    if (!topicRow) continue;

    const tasksData = [
      ...unit.levels.map((lvl, j) => ({
        topicId: topicRow.id,
        code: lvl.code,
        label: lvl.label,
        url: `${PYTHON_EDITOR_URL}/project-editor`,
        order: j,
        isCapstone: false,
        type: "PYTHON" as const,
        instructions: lvl.instructions,
        defaultCode: lvl.defaultCode,
      })),
      {
        topicId: topicRow.id,
        code: unit.quiz.code,
        label: unit.quiz.label,
        url: null,
        order: unit.levels.length,
        isCapstone: false,
        type: "QUIZ" as const,
      },
      {
        topicId: topicRow.id,
        code: unit.capstone.code,
        label: unit.capstone.label,
        url: `${PYTHON_EDITOR_URL}/project-editor`,
        order: unit.levels.length + 1,
        isCapstone: true,
        type: "PYTHON" as const,
        instructions: unit.capstone.instructions,
        defaultCode: unit.capstone.defaultCode,
      },
    ];

    await prisma.topicTask.createMany({ data: tasksData });
  }

  for (const unit of pythonExplorerUnits) {
    const quizTask = await prisma.topicTask.findFirst({
      where: { code: unit.quiz.code },
    });

    if (quizTask) {
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
  }

  console.log("✓ Python Explorer curriculum seeded (12 topics, 96 tasks)");
}
