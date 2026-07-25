Berikut adalah rancangan detail untuk **Pertemuan 5: Pengambil Keputusan (Part 2)** yang dirancang untuk durasi **1 jam**, berbasis website code editor, dan dilengkapi dengan **8 Activities** (6 latihan coding berjenjang, 1 kuis pilihan ganda, dan 1 mini-project).

Semua *starter code* diseragamkan dengan baris instruksi dasar `# Tulis kode mu disini`.

---

# Detail Topic Pertemuan 5

* **Topik:** Percabangan Multi-Kondisi (`elif`) dan Operator Logika (`and`, `or`, `not`).
* **Durasi:** 60 Menit
* **Target Output:** Game "Pilih Petualanganmu" (*Text-Based Adventure Game*) & Sistem Penilaian Multi-Kategori.

---

## ⏱ Rincian Durasi (60 Menit)

1. **Pengenalan Konsep Logika Kompleks (10 Menit)**
* Menjelaskan fungsi `elif` untuk menangani lebih dari 2 pilihan keputusan.
* Mengenal Operator Logika: `and` (harus benar semua), `or` (satu benar cukup), dan `not` (membalikkan nilai Boolean).


2. **Pengerjaan Activities 1–7 (35 Menit)**
* Menulis kondisi bertingkat, menggabungkan beberapa syarat dengan operator logika, serta mengerjakan kuis pemahaman.


3. **Pengerjaan Activity 8 / Mini Project (10 Menit)**
* Membuat game interaktif *Text-Based Adventure*.


4. **Review & Penutup (5 Menit)**
* Pembahasan evaluasi tentang urutan penulisan `if-elif-else` dari kondisi yang paling spesifik.



---

## 💻 8 Activities Pertemuan 5

### Activity 1: Banyak Pilihan Keputusan dengan `elif`

* **Instruksi:**
Jika kamu memiliki lebih dari 2 pilihan keputusan, gunakan `elif` (singkatan dari *else if*). Komputer akan mengecek dari atas ke bawah dan menjalankan kode pertama yang bernilai `True`.
Minta input `nilai` ujian siswa (0–100), lalu kelompokkan predikatnya:
* Jika nilai $\ge 90$ $\rightarrow$ cetak `"Predikat: A (Sangat Baik)"`
* Jika nilai $\ge 80$ $\rightarrow$ cetak `"Predikat: B (Baik)"`
* Jika nilai $\ge 70$ $\rightarrow$ cetak `"Predikat: C (Cukup)"`
* Jika di bawah 70 $\rightarrow$ cetak `"Predikat: D (Perlu Belajar Lagi)"`


* **Starter Code:**
```python
# Tulis kode mu disini

```



---

### Activity 2: Operator Logika `and` (Keduanya Harus True)

* **Instruksi:**
Operator `and` digunakan ketika **semua syarat harus terpenuhi** agar kondisi bernilai `True`.
Sebuah wahana ekstrem membutuhkan dua syarat: umur minimal **12 tahun** DAN tinggi badan minimal **140 cm**.
Minta input `umur` dan `tinggi` dari pengguna.
* Jika `umur >= 12` **and** `tinggi >= 140` $\rightarrow$ cetak `"Kamu Boleh Naik Wahana!"`
* Jika tidak memenuhi $\rightarrow$ cetak `"Maaf, kamu Belum Memenuhi Syarat."`


* **Starter Code:**
```python
# Tulis kode mu disini

```



---

### Activity 3: Operator Logika `or` (Salah Satu Cukup True)

* **Instruksi:**
Operator `or` digunakan jika **cukup salah satu syarat saja yang terpenuhi** agar kondisi bernilai `True`.
Toko memberikan diskon khusus jika pembeli adalah seorang **"Pelajar"** ATAU memiliki **"Kartu Member"**.
Minta pengguna menjawab `"ya"` atau `"tidak"` untuk dua pertanyaan:
1. Apakah kamu seorang Pelajar?
2. Apakah kamu punya Kartu Member?


Jika salah satu dijawab `"ya"`, tampilkan `"Selamat! Kamu Mendapat Diskon 20%!"`. Jika keduanya `"tidak"`, tampilkan `"Harga Normal, Tidak Ada Diskon."`.
* **Starter Code:**
```python
# Tulis kode mu disini

```



---

### Activity 4: Operator Logika `not` (Pembalik Kondisi)

* **Instruksi:**
Operator `not` digunakan untuk **membalikkan nilai Boolean**. Jika nilainya `True` akan menjadi `False`, dan sebaliknya.
Minta pengguna memasukkan status cuaca (`"hujan"` atau `"cerah"`).
Gunakan logika `if not cuaca == "hujan":` untuk mengecek jika cuaca **TIDAK** hujan:
* Jika tidak hujan $\rightarrow$ cetak `"Ayo Kita Pergi Piknik ke Taman!"`
* Jika hujan $\rightarrow$ cetak `"Sebaiknya Diam di Rumah Saja."`


* **Starter Code:**
```python
# Tulis kode mu disini

```



---

### Activity 5: Penentuan Tiket Bioskop Berdasarkan Usia

* **Instruksi:**
Buat program penghitung harga tiket bioskop berdasarkan kategori usia pengguna:
* Usia di bawah 5 tahun ($< 5$) $\rightarrow$ `"Tiket Gratis!"`
* Usia 5 sampai 17 tahun ($\ge 5$ dan $\le 17$) $\rightarrow$ `"Harga Tiket Anak/Pelajar: Rp 25.000"`
* Usia di atas 17 tahun ($> 17$) $\rightarrow$ `"Harga Tiket Dewasa: Rp 50.000"`


*Petunjuk:* Gunakan `elif` dan operator `and` untuk kategori usia 5–17 tahun.
* **Starter Code:**
```python
# Tulis kode mu disini

```



---

### Activity 6: Cek Tahun Kabisat Sederhana

* **Instruksi:**
Tahun kabisat adalah tahun yang habis dibagi 4 (`tahun % 4 == 0`).
Minta pengguna memasukkan `tahun` (misal: 2024 atau 2026).
* Jika tahun habis dibagi 4 $\rightarrow$ cetak `f"{tahun} adalah Tahun Kabisat (Ada 29 Februari)"`
* Jika tidak $\rightarrow$ cetak `f"{tahun} bukan Tahun Kabisat"`


* **Starter Code:**
```python
# Tulis kode mu disini

```



---

### Activity 7: Quiz Cepat Operator Logika & `elif`

* **Instruksi:**
Jawablah kuis pilihan ganda berikut untuk menguji pemahamanmu tentang `elif` dan Operator Logika!

1. **Kapan blok kode di dalam baris `elif` akan dijalankan?**
* A. Selalu dijalankan paling pertama
* B. Ketika kondisi `if` sebelumnya bernilai `False` dan kondisi `elif` tersebut bernilai `True`
* C. Ketika semua kondisi bernilai `False`
* D. Hanya jika kondisi `else` bernilai `True`


2. **Apa hasil dari ekspresi logika `(10 > 5) and (3 > 7)`?**
* A. `True`
* B. `False`
* C. `None`
* D. Error


3. **Apa hasil dari ekspresi logika `(10 > 5) or (3 > 7)`?**
* A. `True`
* B. `False`
* C. `None`
* D. Error


4. **Apa output dari kode berikut?**
```python
lampu = "kuning"
if lampu == "merah":
    print("Berhenti")
elif lampu == "kuning":
    print("Hati-hati")
else:
    print("Jalan")

```


* A. `Berhenti`
* B. `Hati-hati`
* C. `Jalan`
* D. Error


5. **Apa fungsi dari operator `not True` di Python?**
* A. Mengubahnya menjadi `True`
* B. Mengubahnya menjadi `False`
* C. Menghasilkan angka `0`
* D. Tidak terjadi apa-apa



* **Kunci Jawaban Quiz (Internal Pengajar/Sistem):**
1. **B** *(`elif` diuji jika `if` di atasnya `False`, dan hanya jalan jika syaratnya sendiri `True`)*
2. **B** *(Karena menggunakan `and`, kedua syarat harus `True`. Syarat `3 > 7` bernilai `False`, maka hasilnya `False`)*
3. **A** *(Karena menggunakan `or`, cukup salah satu `True`. Syarat `10 > 5` sudah `True`, maka hasilnya `True`)*
4. **B** *(Kondisi `lampu == "kuning"` cocok, maka mencetak `"Hati-hati"`)*
5. **B** *(`not` membalikkan nilai Boolean, dari `True` menjadi `False`)*



---

### Activity 8: Mini Project - Game "Pilih Petualanganmu!"

* **Instruksi:**
Buatlah game petualangan berbasis teks (*Text-Based Adventure*) interaktif!
Alur Cerita:
1. Pemain berdiri di persimpangan jalan dan diminta memilih arah: `"kiri"` atau `"kanan"`.
2. Jika pemain memilih `"kiri"`:
* Minta pilihan kedua: `"renang"` atau `"tunggu"` untuk menyeberangi sungai.
* Jika `"renang"` $\rightarrow$ Cetak: `"Kamu diserang buaya! GAME OVER."`
* Jika `"tunggu"` $\rightarrow$ Cetak: `"Perahu datang menolongmu! KAMU MENANG!"`


3. Jika pemain memilih `"kanan"`:
* Cetak: `"Kamu masuk ke sarang serigala! GAME OVER."`


4. Jika pemain memasukkan pilihan selain `"kiri"` atau `"kanan"`:
* Cetak: `"Pilihan tidak valid! Kamu tersesat di hutan."`




* **Starter Code:**
```python
# Tulis kode mu disini

```


Berikut adalah rancangan detail untuk **Pertemuan 6: Perulangan Otomatis (`while` Loop)** yang dirancang untuk durasi **1 jam**, berbasis website code editor, dan dilengkapi dengan **8 Activities** (6 latihan coding berjenjang, 1 kuis pilihan ganda, dan 1 mini-project).

Semua *starter code* diseragamkan dengan baris instruksi dasar `# Tulis kode mu disini`.

---

# Detail Topic Pertemuan 6

* **Topik:** Perulangan (*Looping*) dengan `while`, Pengubah Kondisi (*Increment/Decrement*), Penghentian Paksa (`break`), dan `infinite loop`.
* **Durasi:** 60 Menit
* **Target Output:** Game "Tebak Angka Rahasia" (*Guess the Number Game*).

---

## ⏱ Rincian Durasi (60 Menit)

1. **Pengenalan Konsep Perulangan `while` (10 Menit)**
* Menjelaskan cara kerja `while` (mengulang kode selama kondisi bernilai `True`).
* Bahaya *Infinite Loop* (loop tak terbatas) dan pentingnya mengupdate nilai variabel pengontrol (*increment* `angka += 1`).
* Mengenal perintah `break` untuk keluar dari perulangan.


2. **Pengerjaan Activities 1–7 (35 Menit)**
* Menulis perulangan hitung maju, hitung mundur, validasi input pengguna, serta mengerjakan kuis pemahaman.


3. **Pengerjaan Activity 8 / Mini Project (10 Menit)**
* Membuat game interaktif "Tebak Angka Rahasia".


4. **Review & Penutup (5 Menit)**
* Evaluasi pentingnya kondisi henti pada `while` loop.



---

## 💻 8 Activities Pertemuan 6

### Activity 1: `while` Loop Pertama Kamu (Hitung Maju 1–5)

* **Instruksi:**
Perulangan `while` akan terus mengulang baris kode di dalamnya **selama kondisinya bernilai `True**`.
Agar perulangan tidak berjalan selamanya (*infinite loop*), kita wajib menambah nilai variabel pengontrol di dalam loop (misalnya `angka = angka + 1` atau `angka += 1`).
Gunakan `while` loop untuk mencetak angka `1` sampai `5` di terminal!
* **Starter Code:**
```python
# Tulis kode mu disini

```



---

### Activity 2: Peluncuran Roket (Hitung Mundur)

* **Instruksi:**
Selain bertambah (*increment*), variabel pengontrol juga bisa berkurang (*decrement*) menggunakan `angka -= 1`.
Buat program hitung mundur peluncuran roket dari angka `10` sampai `1`. Setelah loop selesai, cetak kalimat `"🚀 ROKET MELUNCUR!"` di luar loop.
* **Starter Code:**
```python
# Tulis kode mu disini

```



---

### Activity 3: Mengulang Teks Sesuai Keinginan User

* **Instruksi:**
Minta pengguna memasukkan `kata` yang ingin diulang dan `jumlah` berapa kali kata tersebut harus dicetak (convert ke `int`).
Gunakan `while` loop untuk mencetak `kata` tersebut sebanyak `jumlah` yang diminta!
* **Starter Code:**
```python
# Tulis kode mu disini

```



---

### Activity 4: Menjebak User dengan Validasi Password

* **Instruksi:**
`while` loop sangat berguna untuk meminta input secara berulang sampai pengguna memasukkan jawaban yang benar.
Tentukan `password_benar = "python123"`.
Gunakan `while` loop untuk terus meminta input `password` dari user **selama** password yang dimasukkan **salah** (`!= password_benar`).
Jika sudah benar, keluarlah dari loop dan cetak `"Akses Diterima!"`.
* **Starter Code:**
```python
# Tulis kode mu disini

```



---

### Activity 5: Keluar Paksa dari Loop Menggunakan `break`

* **Instruksi:**
Perintah `break` digunakan untuk menghentikan dan keluar dari perulangan secara langsung saat itu juga, meskipun kondisi `while` masih bernilai `True`.
Buat perulangan `while True:` (loop tanpa henti). Di dalam loop, minta pengguna memasukkan kata. Jika pengguna memasukkan kata `"keluar"`, jalankan perintah `break` untuk menghentikan program!
* **Starter Code:**
```python
# Tulis kode mu disini

```



---

### Activity 6: Menghitung Total Penjumlahan Angka

* **Instruksi:**
Buat program yang menjumlahkan angka dari 1 hingga `N` (input dari pengguna).
Contoh: Jika user memasukkan `5`, program akan menghitung $1 + 2 + 3 + 4 + 5 = 15$ dan menampilkan total akhirnya!
* **Starter Code:**
```python
# Tulis kode mu disini

```



---

### Activity 7: Quiz Cepat Perulangan `while`

* **Instruksi:**
Jawablah kuis pilihan ganda berikut untuk menguji pemahamanmu tentang `while` Loop!

1. **Apa yang menyebabkan terjadinya *Infinite Loop* (perulangan tanpa henti)?**
* A. Menulis sintaks `print()` yang salah
* B. Kondisi `while` selalu bernilai `True` dan tidak pernah berubah menjadi `False`
* C. Lupa menggunakan tanda petik pada string
* D. Menggunakan operator `==` alih-alih `=`


2. **Perintah apa yang digunakan untuk memaksa perulangan BERHENTI saat itu juga?**
* A. `stop`
* B. `exit`
* C. `break`
* D. `end`


3. **Berapa kali teks `"Halo"` akan dicetak pada kode berikut?**
```python
x = 1
while x < 4:
    print("Halo")
    x += 1

```


* A. 1 kali
* B. 3 kali
* C. 4 kali
* D. Selamanya


4. **Apa arti dari sintaks `angka += 1` dalam Python?**
* A. `angka = 1`
* B. `angka = angka + 1`
* C. `angka == 1`
* D. `angka + 1` (tanpa mengubah variabel)


5. **Kapan perulangan `while x <= 5:` akan STOP berjalan?**
* A. Ketika nilai `x` bernilai `5`
* B. Ketika nilai `x` bernilai `6` atau lebih
* C. Ketika nilai `x` bernilai `0`
* D. Tidak akan pernah berhenti



* **Kunci Jawaban Quiz (Internal Pengajar/Sistem):**
1. **B** *(Jika kondisi tidak pernah menjadi `False`, komputer akan mengulang selamanya)*
2. **C** *(`break` menghentikan eksekusi perulangan secara instan)*
3. **B** *(Akan berjalan untuk `x = 1`, `x = 2`, dan `x = 3`. Ketika `x = 4`, kondisi `4 < 4` menjadi `False`)*
4. **B** *(`+=` adalah bentuk singkat dari menambahkan variabel dengan nilai baru)*
5. **B** *(Kondisi `x <= 5` bernilai `True` selama `x` kurang dari atau sama dengan 5. Begitu `x` bernilai 6, kondisi menjadi `False`)*



---

### Activity 8: Mini Project - Game "Tebak Angka Rahasia"

* **Instruksi:**
Buatlah game interaktif Tebak Angka Rahasia! Program harus:
1. Tentukan satu angka rahasia, misal: `angka_rahasia = 7`.
2. Buat variabel `tebakan = 0` dan `jumlah_percobaan = 0`.
3. Gunakan `while tebakan != angka_rahasia:` untuk meminta user menebak angka.
4. Di setiap tebakan:
* Tambahkan `jumlah_percobaan` sebanyak 1.
* Jika tebakan **terlalu kecil** ($< 7$), cetak: `"Terlalu kecil! Coba lagi."`
* Jika tebakan **terlalu besar** ($> 7$), cetak: `"Terlalu besar! Coba lagi."`


5. Ketika tebakan benar, loop berhenti dan cetak pesan selamat beserta total percobaan yang dibutuhkan!
*Contoh:* `"Selamat! Tebakanmu BENAR dalam 3 kali percobaan."`


* **Starter Code:**
```python
# Tulis kode mu disini

```



Berikut adalah rancangan detail untuk **Pertemuan 7: Perulangan Terstruktur (`for` Loop)** yang dirancang untuk durasi **1 jam**, berbasis website code editor, dan dilengkapi dengan **8 Activities** (6 latihan coding berjenjang, 1 kuis pilihan ganda, dan 1 mini-project).

Semua *starter code* diseragamkan dengan baris instruksi dasar `# Tulis kode mu disini`.

---

# Detail Topic Pertemuan 7

* **Topik:** Perulangan dengan `for`, Fungsi `range()` (1 parameter, 2 parameter, dan 3 parameter/step), serta Iterasi Teks (String).
* **Durasi:** 60 Menit
* **Target Output:** Program "Pencetak Tabel Perkalian" & "Simulator Hitung Mundur Peluncuran".

---

## ⏱ Rincian Durasi (60 Menit)

1. **Pengenalan Konsep Perulangan `for` & `range()` (10 Menit)**
* Perbedaan `while` (berdasarkan kondisi) dan `for` (berdasarkan jumlah/urutan yang sudah pasti).
* Cara kerja fungsi `range(start, stop, step)` — *ingat: angka `stop` tidak ikut dicetak!*
* Melakukan iterasi karakter pada string (teks).


2. **Pengerjaan Activities 1–7 (35 Menit)**
* Latihan membuat deret angka, lompatan angka (kelipatan), iterasi huruf pada nama, dan kuis pemahaman.


3. **Pengerjaan Activity 8 / Mini Project (10 Menit)**
* Membuat program Pencetak Tabel Perkalian Otomatis.


4. **Review & Penutup (5 Menit)**
* Evaluasi kapan sebaiknya menggunakan `for` vs `while`.



---

## 💻 8 Activities Pertemuan 7

### Activity 1: `for` Loop Pertama & `range(n)`

* **Instruksi:**
Fungsi `range(n)` akan menghasilkan urutan angka mulai dari `0` hingga `n - 1`.
Gunakan `for` loop dengan `range(5)` untuk mencetak pesan `"Perulangan ke-"` diikuti angka urutannya!
* **Starter Code:**
```python
# Tulis kode mu disini

```



---

### Activity 2: Menentukan Awal dan Akhir Angka `range(start, stop)`

* **Instruksi:**
Jika ingin menentukan angka awal, kita bisa menulis `range(start, stop)`.
*Ingat:* Angka pada `stop` **tidak ikut dicetak**. Jadi jika ingin mencetak angka 1 sampai 10, gunakan `range(1, 11)`.
Gunakan `for` loop untuk mencetak angka dari `1` sampai `10` di terminal!
* **Starter Code:**
```python
# Tulis kode mu disini

```



---

### Activity 3: Angka Loncat / Kelipatan `range(start, stop, step)`

* **Instruksi:**
Parameter ketiga pada `range()` adalah `step` (jarak/loncatan antar angka).
Contoh: `range(2, 11, 2)` akan mencetak angka genap dari 2 sampai 10.
Gunakan `for` loop untuk mencetak bilangan ganjil dari `1` sampai `15`!
* **Starter Code:**
```python
# Tulis kode mu disini

```



---

### Activity 4: Hitung Mundur dengan `range()`

* **Instruksi:**
`step` bernilai negatif (misal `-1`) digunakan untuk membuat urutan angka mundur.
Buatlah perulangan hitung mundur dari `10` sampai `1`, lalu cetak kalimat `"🚀 ROKET MELUNCUR!"` di luar loop!
* **Starter Code:**
```python
# Tulis kode mu disini

```



---

### Activity 5: Mengeja Karakter dalam Teks

* **Instruksi:**
`for` loop di Python juga bisa mengurai teks huruf demi huruf secara otomatis!
Minta pengguna memasukkan `nama` mereka, lalu gunakan `for` loop untuk mengeja huruf-huruf dalam nama tersebut ke bawah satu per satu.
* **Starter Code:**
```python
# Tulis kode mu disini

```



---

### Activity 6: Menghitung Total Angka

* **Instruksi:**
Minta pengguna memasukkan sebuah angka `N`. Gunakan `for` loop dan variabel penampung `total = 0` untuk menghitung jumlah dari $1 + 2 + \dots + N$.
Contoh: Jika `N = 4`, hasil akhirnya adalah $10$ (karena $1 + 2 + 3 + 4 = 10$).
* **Starter Code:**
```python
# Tulis kode mu disini

```



---

### Activity 7: Quiz Cepat Perulangan `for` & `range()`

* **Instruksi:**
Jawablah kuis pilihan ganda berikut untuk menguji pemahamanmu tentang `for` Loop!

1. **Output angka berapa sajakah yang dihasilkan oleh `range(1, 5)`?**
* A. `1, 2, 3, 4, 5`
* B. `1, 2, 3, 4`
* C. `0, 1, 2, 3, 4, 5`
* D. `0, 1, 2, 3, 4`


2. **Berapa kali teks `"Python"` akan dicetak pada kode `for i in range(3): print("Python")`?**
* A. 2 kali
* B. 3 kali
* C. 4 kali
* D. Selamanya


3. **Manakah sintaks `range()` yang benar untuk mencetak angka kelipatan 5 dari 5 sampai 25 (termasuk 25)?**
* A. `range(5, 25, 5)`
* B. `range(5, 26, 5)`
* C. `range(5, 25)`
* D. `range(25, 5, -5)`


4. **Apa hasil dari kode berikut?**
```python
for x in "AKU":
    print(x)

```


* A. Mencetak `AKU` dalam 1 baris
* B. Mencetak `A`, `K`, `U` masing-masing di baris baru
* C. Error karena bukan angka
* D. Mencetak angka `3`


5. **Kapan kita sebaiknya memilih `for` loop dibanding `while` loop?**
* A. Ketika kita tidak tahu berapa kali kode harus diulang
* B. Ketika jumlah perulangannya sudah pasti atau ingin mengurai elemen satu per satu
* C. Ketika ingin membuat perulangan tanpa henti
* D. Keduanya selalu sama persis dan tidak ada bedanya



* **Kunci Jawaban Quiz (Internal Pengajar/Sistem):**
1. **B** *(Angka `stop` yaitu 5 tidak diikutsertakan)*
2. **B** *(`range(3)` berjalan untuk indeks 0, 1, dan 2 — total 3 kali)*
3. **B** *(Agar angka 25 ikut dicetak, batas `stop` harus diset ke 26)*
4. **B** *(`for` pada string mengurai karakter satu per satu)*
5. **B** *(`for` sangat cocok jika jumlah iterasi sudah terdefinisi jelas)*



---

### Activity 8: Mini Project - Pencetak Tabel Perkalian

* **Instruksi:**
Buatlah program generator **Tabel Perkalian Otomatis**! Program harus:
1. Meminta pengguna memasukkan angka perkalian yang diinginkan (misal: `7`).
2. Menggunakan `for` loop dengan `range(1, 11)` untuk mencetak tabel perkalian dari 1 sampai 10.
3. Menampilkan output yang rapi menggunakan **f-string**.


Contoh output jika pengguna memasukkan angka `7`:
```text
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

```


* **Starter Code:**
```python
# Tulis kode mu disini

```

Berikut adalah rancangan detail untuk **Pertemuan 9: Data Berpasangan (Dictionary)** yang dirancang untuk durasi **1 jam**, berbasis website code editor, dan dilengkapi dengan **8 Activities** (6 latihan coding berjenjang, 1 kuis pilihan ganda, dan 1 mini-project).

Semua *starter code* diseragamkan dengan baris instruksi dasar `# Tulis kode mu disini`.

---

# Detail Topic Pertemuan 9

* **Topik:** Struktur Data Dictionary, Pasangan *Key-Value*, Menambah/Mengubah Data, Menghapus Data, dan Mengakses Data dengan Kunci.
* **Durasi:** 60 Menit
* **Target Output:** Program "Kamus Kata / Buku Kontak Telepon Digital".

---

## ⏱ Rincian Durasi (60 Menit)

1. **Pengenalan Konsep Dictionary (10 Menit)**
* Menjelaskan struktur data Dictionary menggunakan kurung kurawal `{}`.
* Konsep *Key-Value Pair* (Kata Kunci & Nilai) — analogi seperti kamus atau daftar kontak.
* Perbedaan akses data: List menggunakan angka *index* (`[0]`), sedangkan Dictionary menggunakan *key* (`["nama"]`).


2. **Pengerjaan Activities 1–7 (35 Menit)**
* Latihan membuat dictionary, mengambil nilai, menambahkan/mengubah isi, serta mengerjakan kuis pemahaman.


3. **Pengerjaan Activity 8 / Mini Project (10 Menit)**
* Membuat program "Buku Kontak Telepon Digital".


4. **Review & Penutup (5 Menit)**
* Evaluasi kapan harus memakai List vs Dictionary.



---

## 💻 8 Activities Pertemuan 9

### Activity 1: Membuat Dictionary Pertama Kamu

* **Instruksi:**
Dictionary disimpan menggunakan kurung kurawal `{}` dengan format `"key": "value"`.
Buatlah sebuah dictionary bernama `siswa` yang menyimpan data berikut:
* `"nama"`: nama lengkapmu
* `"umur"`: umurmu saat ini (angka)
* `"kelas"`: kelasmu di sekolah


Lalu cetak dictionary tersebut menggunakan `print()`.
* **Starter Code:**
```python
# Tulis kode mu disini

```



---

### Activity 2: Mengakses Nilai Menggunakan Key

* **Instruksi:**
Untuk mengambil data di dictionary, tulis nama dictionary diikuti tanda kurung siku `[]` berisi **Key**-nya.
*Contoh:* `print(siswa["nama"])`
Buat dictionary `game` berisi `"judul": "Minecraft"` dan `"genre": "Sandbox"`. Tampilkan judul dan genre game tersebut dalam kalimat yang rapi menggunakan f-string!
* **Starter Code:**
```python
# Tulis kode mu disini

```



---

### Activity 3: Menambah & Mengubah Data di Dictionary

* **Instruksi:**
Untuk mengubah nilai atau menambah key baru, cukup gunakan format:
`dictionary[key] = nilai_baru`
Diberikan dictionary `buah = {"nama": "Apel", "harga": 10000}`:
1. Ubah `harga` menjadi `15000`.
2. Tambahkan key baru `"stok"` dengan nilai `50`.
3. Cetak isi dictionary `buah` yang terbaru.


* **Starter Code:**
```python
# Tulis kode mu disini

```



---

### Activity 4: Menghapus Data & Pengecekan Key

* **Instruksi:**
* Kita bisa menghapus data menggunakan perintah `del dictionary[key]`.
* Kita bisa mengecek apakah suatu key ada di dictionary menggunakan kata kunci `in`.


Diberikan dictionary `item = {"hp": 100, "mp": 50, "potion": 3}`:
1. Hapus key `"mp"` dari dictionary.
2. Cek apakah key `"potion"` ada di dalam `item` menggunakan `if "potion" in item:`. Cetak `"Potion tersedia!"` jika ada.


* **Starter Code:**
```python
# Tulis kode mu disini

```



---

### Activity 5: Menampilkan Semua Key & Value

* **Instruksi:**
Kita bisa mengambil semua key dengan `.keys()`, semua value dengan `.values()`, atau keduanya bersamaan dengan `.items()`.
Gunakan `for key, value in dictionary.items():` untuk mencetak seluruh isi dictionary `biodata` baris demi baris!
* **Starter Code:**
```python
# Tulis kode mu disini

```



---

### Activity 6: Kamus Bahasa Gaul / Istilah Internet

* **Instruksi:**
Buat program kamus istilah internet!
1. Buat dictionary `kamus` berisi 3 kata gaul beserta artinya (misal: `"AFK"`, `"BRB"`, `"GG"`).
2. Minta input kata dari pengguna.
3. Jika kata ada di kamus, tampilkan artinya. Jika tidak ada, cetak `"Kata tidak ditemukan dalam kamus."`.


* **Starter Code:**
```python
# Tulis kode mu disini

```



---

### Activity 7: Quiz Cepat Dictionary

* **Instruksi:**
Jawablah kuis pilihan ganda berikut untuk menguji pemahamanmu tentang Dictionary!

1. **Simbol apakah yang digunakan untuk membuat Dictionary di Python?**
* A. Kurung siku `[]`
* B. Kurung biasa `()`
* C. Kurung kurawal `{}`
* D. Tanda petik `""`


2. **Bagaimana cara mengambil nilai `"Budi"` dari dictionary `user = {"nama": "Budi", "umur": 15}`?**
* A. `user[0]`
* B. `user["nama"]`
* C. `user.get(0)`
* D. `user.nama`


3. **Apa yang terjadi jika kita mencoba mengakses key yang TIDAK ADA di dictionary tanpa penanganan khusus?**
* A. Mengembalikan nilai `0`
* B. Mengembalikan string kosong `""`
* C. Terjadi Error (`KeyError`)
* D. Program otomatis menambah key tersebut


4. **Perintah manakah yang benar untuk menghapus key `"umur"` dari dictionary `profil`?**
* A. `del profil["umur"]`
* B. `profil.remove("umur")`
* C. `delete profil["umur"]`
* D. `profil.pop_index("umur")`


5. **Manakah pernyataan yang BENAR mengenai perbedaan List dan Dictionary?**
* A. List menggunakan kurung kurawal, Dictionary menggunakan kurung siku
* B. List diakses menggunakan angka indeks, Dictionary diakses menggunakan Key
* C. List tidak bisa diubah isinya, Dictionary bisa
* D. Dictionary hanya bisa menyimpan tipe data teks



* **Kunci Jawaban Quiz (Internal Pengajar/Sistem):**
1. **C** *(Dictionary menggunakan kurung kurawal `{}`)*
2. **B** *(Akses data dictionary menggunakan nama Key-nya)*
3. **C** *(Mengakses key yang tidak ada akan memicu `KeyError`)*
4. **A** *(`del` digunakan untuk menghapus key beserta valuenya)*
5. **B** *(List berbasis urutan angka index `0, 1, 2`, sedangkan Dictionary berbasis pasangan `Key-Value`)*



---

### Activity 8: Mini Project - Buku Kontak Telepon Digital

* **Instruksi:**
Buatlah program **Buku Kontak Telepon Digital** interaktif! Program harus:
1. Memiliki dictionary `kontak = {"Amir": "08123456789", "Beti": "08987654321"}`.
2. Menampilkan menu interaktif dalam `while` loop:
* `1`: Lihat Semua Kontak
* `2`: Tambah Kontak Baru
* `3`: Cari Kontak
* `4`: Keluar


3. Jalankan fitur sesuai nomor menu yang dipilih pengguna!


* **Starter Code:**
```python
# Tulis kode mu disini

```




Berikut adalah rancangan detail untuk **Pertemuan 8: Menyimpan Banyak Data (List)** yang dirancang untuk durasi **1 jam**, berbasis website code editor, dan dilengkapi dengan **8 Activities** (6 latihan coding berjenjang, 1 kuis pilihan ganda, dan 1 mini-project).

Semua *starter code* diseragamkan dengan baris instruksi dasar `# Tulis kode mu disini`.

---

# Detail Topic Pertemuan 8

* **Topik:** Structure Data `List`, Posisi Elemen (*Indexing* mulai dari 0), Manipulasi List (`append()`, `remove()`, `len()`), dan Menampilkan List dengan Loop.
* **Durasi:** 60 Menit
* **Target Output:** Aplikasi *To-Do List* (Daftar Tugas) CLI Sederhana.

---

## ⏱ Rincian Durasi (60 Menit)

1. **Pengenalan Konsep List & Indexing (10 Menit)**
* Menjelaskan kegunaan List untuk menyimpan banyak data dalam satu variabel menggunakan kurung siku `[]`.
* Konsep **Index** (posisi elemen) yang selalu dimulai dari `0` (bukan 1).
* Fungsi dan method penting: `len()` (panjang list), `.append()` (tambah data), `.remove()` (hapus data).


2. **Pengerjaan Activities 1–7 (35 Menit)**
* Latihan membuat list, mengakses elemen via index, menambah/menghapus isi list, serta mengerjakan kuis pemahaman.


3. **Pengerjaan Activity 8 / Mini Project (10 Menit)**
* Membuat aplikasi interaktif *To-Do List* sederhana di terminal.


4. **Review & Penutup (5 Menit)**
* Evaluasi pentingnya pemahaman index 0 dan penanganan error saat mengambil index di luar jangkauan (*IndexError*).



---

## 💻 8 Activities Pertemuan 8

### Activity 1: Membuat List Pertama & Mengakses Index

* **Instruksi:**
List dibuat menggunakan kurung siku `[]`. Setiap data dipisahkan oleh tanda koma `,`.
Ingat! Indeks pertama selalu dimulai dari angka **`0`**.
Buatlah list bernama `buah` yang berisi 3 nama buah pilihanmu.
Cetak buah pertama (indeks `0`) dan buah terakhir (indeks `2`) ke terminal!
* **Starter Code:**
```python
# Tulis kode mu disini

```



---

### Activity 2: Mengetahui Panjang List dengan `len()`

* **Instruksi:**
Fungsi `len()` digunakan untuk menghitung **jumlah total elemen** yang ada di dalam sebuah list.
Buatlah list `hobi` yang berisi minimal 4 hobi kamu.
Hitung jumlah hobi menggunakan `len()` dan tampilkan hasilnya menggunakan **f-string**!
* **Starter Code:**
```python
# Tulis kode mu disini

```



---

### Activity 3: Menambahkan Elemen Baru dengan `.append()`

* **Instruksi:**
Method `.append(data_baru)` digunakan untuk **menambahkan data baru ke urutan paling akhir** dari sebuah list.
Diberikan list `tas = ["Buku", "Pensil"]`.
1. Tambahkan item `"Penggaris"` dan `"Tipe-X"` ke dalam list `tas` menggunakan `.append()`.
2. Cetak isi list `tas` setelah ditambahkan.


* **Starter Code:**
```python
# Tulis kode mu disini

```



---

### Activity 4: Menghapus Elemen dengan `.remove()`

* **Instruksi:**
Method `.remove(nama_item)` digunakan untuk **menghapus elemen tertentu** berdasarkan namanya dari dalam list.
Diberikan list `belanja = ["Susu", "Roti", "Telur", "Permen"]`.
Hapus item `"Permen"` dari daftar belanja tersebut, lalu tampilkan daftar belanja yang terbaru!
* **Starter Code:**
```python
# Tulis kode mu disini

```



---

### Activity 5: Menampilkan Semua Isian List dengan `for` Loop

* **Instruksi:**
Kita bisa menggunakan `for` loop untuk mencetak seluruh isi list satu per satu secara otomatis.
Buat list `game_favorit` berisi 3 judul game.
Gunakan `for` loop untuk mencetak setiap game dengan format: `"Saya suka bermain [nama_game]"`!
* **Starter Code:**
```python
# Tulis kode mu disini

```



---

### Activity 6: Mengubah Nilai Elemen pada List

* **Instruksi:**
Kita bisa mengubah isi elemen list pada indeks tertentu dengan cara:
`nama_list[indeks] = nilai_baru`
Diberikan list `juara = ["Budi", "Andi", "Cici"]`.
Ternyata juara 2 (indeks `1`) didiskualifikasi dan digantikan oleh `"Deni"`. Ubah nama di indeks `1` menjadi `"Deni"` lalu cetak list terbarunya!
* **Starter Code:**
```python
# Tulis kode mu disini

```



---

### Activity 7: Quiz Cepat List & Indexing

* **Instruksi:**
Jawablah kuis pilihan ganda berikut untuk menguji pemahamanmu tentang List!

1. **Simbol apakah yang digunakan untuk membuat List di Python?**
* A. Kurung biasa `()`
* B. Kurung kurawal `{}`
* C. Kurung siku `[]`
* D. Tanda petik `""`


2. **Berapa angka indeks dari elemen PERTAMA di dalam list?**
* A. `1`
* B. `0`
* C. `-1`
* D. Bervariasi tergantung isi


3. **Apa hasil dari kode berikut?**
```python
hewan = ["Kucing", "Anjing", "Kelinci"]
print(hewan[1])

```


* A. `Kucing`
* B. `Anjing`
* C. `Kelinci`
* D. Error


4. **Method apakah yang digunakan untuk menambahkan elemen baru ke bagian akhir list?**
* A. `.add()`
* B. `.insert()`
* C. `.append()`
* D. `.push()`


5. **Apa yang terjadi jika kita mencoba mengakses `angka[5]` padahal list `angka` hanya berisi 3 elemen?**
* A. Mengembalikan nilai `0`
* B. Mengembalikan string kosong
* C. Terjadi Error (`IndexError: list index out of range`)
* D. Otomatis menambah elemen baru sampai indeks ke-5



* **Kunci Jawaban Quiz (Internal Pengajar/Sistem):**
1. **C** *(List menggunakan kurung siku `[]`)*
2. **B** *(Indeks selalu dimulai dari angka 0)*
3. **B** *(Indeks `0` = Kucing, Indeks `1` = Anjing)*
4. **C** *(`.append()` menambah item ke posisi paling belakang)*
5. **C** *(Mengakses indeks melebihi jumlah elemen akan memicu `IndexError`)*



---

### Activity 8: Mini Project - Aplikasi To-Do List Sederhana

* **Instruksi:**
Buatlah program **Aplikasi To-Do List (Daftar Tugas)** interaktif! Program harus:
1. Membuat list kosong bernama `kegiatan = []`.
2. Menggunakan `while` loop untuk menampilkan menu interaktif:
* `1`: Lihat Semua Kegiatan
* `2`: Tambah Kegiatan Baru
* `3`: Hapus Kegiatan
* `4`: Keluar


3. Jalankan logika sesuai nomor menu pilihan pengguna:
* Jika pilih `1`: Cetak isi `kegiatan`. Jika kosong, cetak `"Belum ada kegiatan."`
* Jika pilih `2`: Minta input nama kegiatan baru lalu tambahkan via `.append()`.
* Jika pilih `3`: Minta input nama kegiatan yang ingin dihapus lalu hapus via `.remove()`.
* Jika pilih `4`: Hentikan loop (`break`) dan cetak `"Terima kasih!"`




* **Starter Code:**
```python
# Tulis kode mu disini

```