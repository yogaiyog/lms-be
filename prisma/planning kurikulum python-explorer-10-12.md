Berikut adalah rancangan detail untuk **Pertemuan 10: Membuat "Mantra" Kode (Fungsi / Function)** yang dirancang untuk durasi **1 jam**, berbasis website code editor, dan dilengkapi dengan **8 Activities** (6 latihan coding berjenjang, 1 kuis pilihan ganda, dan 1 mini-project).

Semua *starter code* diseragamkan dengan baris instruksi dasar `# Tulis kode mu disini`.

---

# Detail Modul Pertemuan 10

* **Topik:** Fungsi Dasar (`def`), Parameter & Argument, Mengembalikan Nilai (`return`), dan *Reusability* Kode.
* **Durasi:** 60 Menit
* **Target Output:** Modul Fungsi Matematika & Pembuat Sambutan Game Interaktif.

---

## ⏱ Rincian Durasi (60 Menit)

1. **Pengenalan Konsep Fungsi / Function (10 Menit)**
* Menjelaskan fungsi sebagai "Mantra / Mesin Otomatis" untuk membungkus blok kode agar bisa dipakai berulang kali.
* Kata kunci `def` untuk membuat fungsi.
* Parameter (bahan masuk) dan `return` (hasil keluaran mesin).


2. **Pengerjaan Activities 1–7 (35 Menit)**
* Menulis fungsi tanpa parameter, fungsi dengan parameter, fungsi dengan `return`, serta mengerjakan kuis pemahaman.


3. **Pengerjaan Activity 8 / Mini Project (10 Menit)**
* Membuat modul kumpulan fungsi kalkulator/game.


4. **Review & Penutup (5 Menit)**
* Evaluasi bedanya `print()` di dalam fungsi vs `return` nilai dari fungsi.



---

## 💻 8 Activities Pertemuan 10

### Activity 1: Membuat Fungsi Pertama Kamu (`def`)

* **Instruksi:**
Fungsi dibuat menggunakan kata kunci `def` diikuti `nama_fungsi():`.
Kode di dalam fungsi baru akan dijalankan ketika fungsi tersebut **dipanggil** (`nama_fungsi()`).
1. Buatlah fungsi bernama `sapa_dunia()` yang mencetak `"Halo! Selamat datang di dunia Python!"`.
2. Panggil fungsi tersebut sebanyak 2 kali!


* **Starter Code:**
```python
# Tulis kode mu disini

```



---

### Activity 2: Fungsi dengan Parameter (Menerima Input)

* **Instruksi:**
Parameter adalah variabel penampung di dalam tanda kurung `()` fungsi untuk menerima data dari luar.
Buatlah fungsi `sapa_pemain(nama)` yang menerima 1 parameter `nama`, lalu mencetak sapaan: `"Selamat bertualang, [nama]!"`.
Panggil fungsi tersebut dengan nama kamu dan nama temanmu!
* **Starter Code:**
```python
# Tulis kode mu disini

```



---

### Activity 3: Fungsi dengan Banyak Parameter

* **Instruksi:**
Fungsi bisa menerima lebih dari satu parameter, dipisahkan dengan tanda koma `,`.
Buat fungsi `cetak_identitas(nama, umur, peran)` yang mencetak 3 data tersebut dalam kalimat yang rapi menggunakan f-string.
Panggil fungsi tersebut dengan memasukkan 3 argumen!
* **Starter Code:**
```python
# Tulis kode mu disini

```



---

### Activity 4: Mengembalikan Nilai dengan `return`

* **Instruksi:**
Daripada langsung mencetak dengan `print()`, fungsi sering kali digunakan untuk **menghitung dan mengembalikan nilai** menggunakan kata kunci `return`. Hasilnya bisa disimpan ke dalam variabel baru.
Buat fungsi `tambah(a, b)` yang mengembalikan hasil penjumlahan `a + b`.
Simpan hasil pemanggilan `tambah(10, 20)` ke variabel `total`, lalu cetak `total`!
* **Starter Code:**
```python
# Tulis kode mu disini

```



---

### Activity 5: Menghitung Luas Segitiga dengan Fungsi

* **Instruksi:**
Rumus luas segitiga adalah $\frac{1}{2} \times \text{alas} \times \text{tinggi}$.
Buat fungsi `hitung_luas_segitiga(alas, tinggi)` yang mengembalikan nilai luasnya.
Minta input alas dan tinggi dari pengguna, panggil fungsinya, lalu tampilkan hasilnya!
* **Starter Code:**
```python
# Tulis kode mu disini

```



---

### Activity 6: Cek Bilangan Genap atau Ganjil via Fungsi

* **Instruksi:**
Buat fungsi `is_genap(angka)` yang mengembalikan nilai Boolean (`True` jika genap, `False` jika ganjil).
Gunakan fungsi tersebut di dalam kondisi `if` untuk mengecek angka dari pengguna dan tampilkan pesan apakah angka tersebut Genap atau Ganjil!
* **Starter Code:**
```python
# Tulis kode mu disini

```



---

### Activity 7: Quiz Cepat Fungsi / Function

* **Instruksi:**
Jawablah kuis pilihan ganda berikut untuk menguji pemahamanmu tentang Fungsi!

1. **Kata kunci apakah yang digunakan untuk mendefinisikan/membuat fungsi baru di Python?**
* A. `function`
* B. `def`
* C. `create`
* D. `make`


2. **Apa yang dimaksud dengan Parameter pada fungsi?**
* A. Nama akhir dari sebuah fungsi
* B. Variabel di dalam kurung fungsi yang berguna menerima input data
* C. Perintah untuk menghentikan fungsi
* D. Hasil keluaran akhir dari fungsi


3. **Apa perbedaan utama antara `print()` dan `return` di dalam sebuah fungsi?**
* A. Tidak ada perbedaan, keduanya sama persis
* B. `print()` hanya menampilkan teks ke layar, sedangkan `return` mengembalikan nilai agar bisa disimpan ke variabel lain
* C. `return` hanya bisa digunakan untuk angka
* D. `print()` otomatis menghentikan jalannya fungsi


4. **Apa yang terjadi jika kita membuat fungsi tetapi TIDAK pernah memanggilnya?**
* A. Terjadi Error
* B. Kode di dalam fungsi tidak akan pernah dijalankan
* C. Komputer akan menjalankan fungsi secara otomatis di akhir program
* D. Fungsi akan terhapus sendiri


5. **Apa output dari kode berikut?**
```python
def kali(x, y):
    return x * y

hasil = kali(4, 3)
print(hasil)

```


* A. `7`
* B. `12`
* C. `43`
* D. `Error`



* **Kunci Jawaban Quiz (Internal Pengajar/Sistem):**
1. **B** *(`def` adalah singkatan dari define)*
2. **B** *(Parameter berfungsi sebagai wadah penampung data masukan)*
3. **B** *(`return` mengalirkan data kembali ke pemanggil fungsi)*
4. **B** *(Fungsi hanya berjalan jika dipanggil)*
5. **B** *($4 \times 3 = 12$)*



---

### Activity 8: Mini Project - Modul Kalkulator Super Lengkap

* **Instruksi:**
Buatlah program **Kalkulator Berbasis Fungsi**! Program harus:
1. Membuat 4 fungsi terpisah:
* `tambah(a, b)` $\rightarrow$ return $a + b$
* `kurang(a, b)` $\rightarrow$ return $a - b$
* `kali(a, b)` $\rightarrow$ return $a \times b$
* `bagi(a, b)` $\rightarrow$ return $a / b$


2. Menampilkan menu pilihan operasi (1. Tambah, 2. Kurang, 3. Kali, 4. Bagi).
3. Meminta pengguna memilih menu dan memasukkan 2 angka.
4. Memanggil fungsi yang sesuai dan menampilkan hasil perhitungannya!


* **Starter Code:**
```python
# Tulis kode mu disini

```

Berikut adalah rancangan detail untuk **Pertemuan 11: Bekerja dengan Teks (String Manipulation)** yang dirancang untuk durasi **1 jam**, berbasis website code editor, dan dilengkapi dengan **8 Activities** (6 latihan coding berjenjang, 1 kuis pilihan ganda, dan 1 mini-project).

Semua *starter code* diseragamkan dengan baris instruksi dasar `# Tulis kode mu disini`.

---

# Detail Modul Pertemuan 11

* **Topik:** Manipulasi String (Kapitalisasi `.upper()`, `.lower()`, `.title()`), Pembersihan Teks (`.strip()`), Pencarian & Penggantian (`.replace()`, `in`), Pemotongan Teks (*Slicing* `[start:stop]`), dan Penggabungan/Pemisahan (`.split()`, `.join()`).
* **Durasi:** 60 Menit
* **Target Output:** Program "Filter Sensor Komentar & Format Nama Otomatis".

---

## ⏱ Rincian Durasi (60 Menit)

1. **Pengenalan Konsep String Manipulation (10 Menit)**
* Menjelaskan bahwa teks (String) di Python adalah kumpulan karakter yang bisa diubah formatnya, dipotong, dan dimanipulasi.
* *Method* umum: `.upper()`, `.lower()`, `.title()`, `.strip()`, `.replace()`, `.split()`.
* Konsep *String Slicing* menggunakan kurung siku `[awal:akhir]`.


2. **Pengerjaan Activities 1–7 (35 Menit)**
* Latihan mengubah kapitalisasi, membersihkan input pengguna, memotong karakter, merapikan teks, dan mengerjakan kuis pemahaman.


3. **Pengerjaan Activity 8 / Mini Project (10 Menit)**
* Membuat program "Filter Sensor Kata Kasar / Komentar Otomatis".


4. **Review & Penutup (5 Menit)**
* Evaluasi pentingnya manipulasi string untuk validasi input (misal: merapikan email, nama pengguna, atau kata sandi).



---

## 💻 8 Activities Pertemuan 11

### Activity 1: Mengubah Kapitalisasi Teks

* **Instruksi:**
Python menyediakan *method* bawaan untuk mengubah bentuk huruf:
* `.upper()` : Mengubah semua huruf menjadi KAPITAL.
* `.lower()` : Mengubah semua huruf menjadi kecil.
* `.title()` : Mengubah Huruf Pertama Setiap Kata Menjadi Kapital.


Diberikan variabel `pesan = "selamat datang di dunia python"`.
Tampilkan teks tersebut dalam 3 bentuk: Kapital Semua, Huruf Kecil Semua, dan Format Judul (Title Case)!
* **Starter Code:**
```python
# Tulis kode mu disini

```



---

### Activity 2: Membersihkan Spasi Liar dengan `.strip()`

* **Instruksi:**
Pengguna sering kali tidak sengaja menekan spasi di awal atau akhir saat mengetik. Method `.strip()` berguna untuk **menghapus spasi liar** di awal dan akhir string.
Diberikan variabel `email_input = "   user_keren@gmail.com   "`.
1. Bersihkan spasi liar tersebut menggunakan `.strip()`.
2. Cetak email yang sudah bersih dan tampilkan jumlah karakternya menggunakan `len()`.


* **Starter Code:**
```python
# Tulis kode mu disini

```



---

### Activity 3: Memotong Teks (String Slicing)

* **Instruksi:**
Sama seperti List, elemen dalam String memiliki index. Kita bisa memotong teks menggunakan format `string[start:stop]`.
*Catatan:* Karakter pada posisi `stop` tidak ikut terbawa!
Diberikan variabel `kode_produk = "PRD-98765-ID"`.
1. Ambil 3 huruf pertama (`"PRD"`) menggunakan slicing `[0:3]`.
2. Ambil 5 digit angka di tengah (`"98765"`).
3. Cetak kedua hasil potongan tersebut!


* **Starter Code:**
```python
# Tulis kode mu disini

```



---

### Activity 4: Mengganti Kata dengan `.replace()`

* **Instruksi:**
Method `.replace("kata_lama", "kata_baru")` digunakan untuk mengganti kata tertentu di dalam string dengan kata lain.
Diberikan variabel `kalimat = "Saya suka makan apel merah."`.
Ubah kata `"apel"` menjadi `"pisang"` dan kata `"merah"` menjadi `"manis"`, lalu cetak kalimat terbarunya!
* **Starter Code:**
```python
# Tulis kode mu disini

```



---

### Activity 5: Memecah dan Menggabungkan Teks (`.split()` & `.join()`)

* **Instruksi:**
* `.split("pemisah")` memecah string menjadi List.
* `"pemisah".join(list)` menggabungkan elemen List kembali menjadi satu string.


1. Diberikan string `hobi_str = "Membaca, Melukis, Berenang"`. Pecah string tersebut menjadi list menggunakan `.split(", ")`.
2. Gabungkan kembali list tersebut menggunakan tanda hubung `"-"` dengan `.join()`.


* **Starter Code:**
```python
# Tulis kode mu disini

```



---

### Activity 6: Cek Sensor Kata Terlarang (`in`)

* **Instruksi:**
Kata kunci `in` dapat mengecek apakah suatu kata/sub-string ada di dalam teks (mengembalikan `True` atau `False`).
1. Buat variabel `komentar` berisi input dari pengguna.
2. Ubah komentar menjadi huruf kecil semua (`.lower()`) agar mudah dicek.
3. Jika terdapat kata `"spam"` atau `"toxic"` di dalam komentar, cetak `"Komentar Anda diblokir!"`. Jika tidak, cetak `"Komentar berhasil dipublikasikan!"`.


* **Starter Code:**
```python
# Tulis kode mu disini

```



---

### Activity 7: Quiz Cepat String Manipulation

* **Instruksi:**
Jawablah kuis pilihan ganda berikut untuk menguji pemahamanmu tentang manipulasi teks!

1. **Method manakah yang digunakan untuk mengubah seluruh string menjadi huruf KAPITAL?**
* A. `.capitalize()`
* B. `.title()`
* C. `.upper()`
* D. `.to_large()`


2. **Apa fungsi utama dari method `.strip()`?**
* A. Menghapus semua angka dari teks
* B. Menghapus spasi tambahan di awal dan akhir teks
* C. Memotong string menjadi dua bagian
* D. Menghapus huruf vokal dari string


3. **Apa hasil dari potongan kode berikut?**
```python
teks = "Python"
print(teks[0:3])

```


* A. `Pyt`
* B. `Pyth`
* C. `ytho`
* D. `Python`


4. **Method manakah yang digunakan untuk memecah kalimat menjadi sebuah List kata?**
* A. `.break()`
* B. `.slice()`
* C. `.cut()`
* D. `.split()`


5. **Apa hasil dari `"Python".replace("o", "a")`?**
* A. `Pythan`
* B. `Python`
* C. `Pythn`
* D. `Error`



* **Kunci Jawaban Quiz (Internal Pengajar/Sistem):**
1. **C** *(`.upper()` mengubah teks menjadi kapital semua)*
2. **B** *(`.strip()` membuang spasi liar di ujung kiri dan kanan string)*
3. **A** *(Indeks `0`, `1`, `2` diambil, indeks `3` tidak ikut $\rightarrow$ `"Pyt"`)*
4. **D** *(`.split()` memotong string berdasarkan karakter pemisah dan mengembalikannya sebagai list)*
5. **A** *(Huruf `"o"` diganti menjadi `"a"`)*



---

### Activity 8: Mini Project - Sistem Filter Sensor & Format Nama Otomatis

* **Instruksi:**
Buatlah program **Rapi Nama & Sensor Komentar Otomatis**! Program harus:
1. Meminta pengguna memasukkan nama mereka (yang mungkin ketikannya tidak rapi, misal `"  aMdi  sUpRaPtO  "`).
2. Rapikan nama tersebut: hapus spasi liar dengan `.strip()` dan ubah ke format judul (`.title()`).
3. Meminta pengguna memasukkan kalimat komentar.
4. Cek komentar tersebut:
* Jika ada kata terlarang (misal: `"jelek"`, `"bodoh"`, atau `"hoax"`), ganti kata terlarang tersebut dengan tanda sensor `"***"` menggunakan `.replace()`.
* *Petunjuk:* Pastikan pengecekan kata terlarang aman dari masalah kapitalisasi.


5. Tampilkan nama pengguna yang sudah rapi beserta komentar akhir yang sudah disensor!


* **Starter Code:**
```python
# Tulis kode mu disini

```


Berikut adalah rancangan detail untuk **Pertemuan 12: Mini Project - Aplikasi Kasir / Toko Sederhana** yang dirancang untuk durasi **1 jam**, berbasis website code editor, dan dilengkapi dengan **8 Activities** (6 latihan komponen pendukung berjenjang, 1 kuis pilihan ganda, dan 1 mini-project utama).

Pertemuan ini merupakan **proyek integrasi (Capstione Project)** dari seluruh materi dasar yang telah dipelajari dari Pertemuan 8–11 (List, Dictionary, Function, dan String Manipulation).

Semua *starter code* diseragamkan dengan baris instruksi dasar `# Tulis kode mu disini`.

---

# Detail Modul Pertemuan 12

* **Topik:** Proyek Integrasi / Capstone (List, Dictionary, Function, String Manipulation, Loops, dan Conditionals).
* **Durasi:** 60 Menit
* **Target Output:** Aplikasi Kasir CLI (Command Line Interface) Toko Sederhana dengan Struk Pembayaran.

---

## ⏱ Rincian Durasi (60 Menit)

1. **Review & Pengenalan Arsitektur Proyek (10 Menit)**
* Meninjau kembali keterkaitan antar konsep: **Dictionary** untuk menu/stok barang, **Function** untuk modul kasir, **List** untuk keranjang belanja, dan **String Manipulation** untuk format struk.


2. **Pengerjaan Activities 1–7 (30 Menit)**
* Membangun komponen-komponen kecil aplikasi kasir secara bertahap serta pengerjaan kuis evaluasi.


3. **Pengerjaan Activity 8 / Mini Project Utama (15 Menit)**
* Menggabungkan seluruh komponen menjadi program Aplikasi Kasir Utuh.


4. **Review & Penutup (5 Menit)**
* Demonstrasi program, evaluasi bug, dan penutupan modul Python Dasar.



---

## 💻 8 Activities Pertemuan 12

### Activity 1: Menyiapkan Database Menu Barang (Dictionary)

* **Instruksi:**
Aplikasi kasir membutuhkan daftar barang beserta harganya.
Buatlah dictionary `menu_makanan` yang berisi sekurang-kurangnya 4 daftar makanan dan harganya:
* `"Nasi Goreng"`: `15000`
* `"Mie Goreng"`: `12000`
* `"Ayam Goreng"`: `18000`
* `"Es Teh"`: `5000`


Gunakan `for item, harga in menu_makanan.items():` untuk menampilkan seluruh menu ke layar secara rapi!
* **Starter Code:**
```python
# Tulis kode mu disini

```



---

### Activity 2: Fungsi Format Rupiah (String Manipulation + Function)

* **Instruksi:**
Agar tampilan harga menarik, kita bisa membuat fungsi penyesuai format angka.
Buatlah fungsi `format_rupiah(nominal)` yang mengembalikan string berformat Rupiah.
*Contoh:* `15000` $\rightarrow$ `"Rp15.000"` atau `"Rp 15000"`.
Gunakan f-string untuk menambahkan prefiks `"Rp "` lalu uji fungsi tersebut dengan angka `25000`!
* **Starter Code:**
```python
# Tulis kode mu disini

```



---

### Activity 3: Menambahkan Item ke Keranjang Belanja (List)

* **Instruksi:**
Keranjang belanja akan menyimpan daftar item yang dibeli oleh pelanggan.
1. Buat list kosong bernama `keranjang = []`.
2. Minta input nama makanan dari pengguna.
3. Ubah input tersebut menjadi format judul (`.title()`).
4. Tambahkan item tersebut ke dalam `keranjang` menggunakan `.append()`.
5. Cetak isi keranjang belanja.


* **Starter Code:**
```python
# Tulis kode mu disini

```



---

### Activity 4: Fungsi Menghitung Total Belanja (Function + Loops)

* **Instruksi:**
Buat fungsi `hitung_total(daftar_belanja, menu)` yang menerima 2 parameter:
* `daftar_belanja` (List berisi nama barang yang dibeli)
* `menu` (Dictionary berisi nama barang dan harganya)


Fungsi akan melakukan iterasi pada `daftar_belanja`, mencocokkannya dengan harga di `menu`, menjumlahkan totalnya, lalu mengembalikan (`return`) total harga tersebut.
* **Starter Code:**
```python
# Tulis kode mu disini

```



---

### Activity 5: Menghitung Diskon Pembayaran

* **Instruksi:**
Toko memberikan diskon 10% jika total belanja **minimal Rp 50.000**.
1. Buat variabel `total_belanja`.
2. Buat kondisi `if`: jika `total_belanja >= 50000`, hitung diskon 10% ($0.10 \times \text{total\_belanja}$).
3. Jika kurang dari Rp 50.000, diskon adalah `0`.
4. Tampilkan total akhir yang harus dibayar setelah dikurangi diskon!


* **Starter Code:**
```python
# Tulis kode mu disini

```



---

### Activity 6: Menghitung Kembalian & Validasi Uang

* **Instruksi:**
Minta input jumlah uang yang dibayarkan pelanggan (`uang_bayar`).
1. Gunakan `while` loop: Jika `uang_bayar < total_bayar`, cetak `"Uang tidak cukup!"` dan minta input uang kembali.
2. Hitung kembalian (`uang_bayar - total_bayar`).
3. Tampilkan pesan transaksi berhasil beserta nominal kembaliannya!


* **Starter Code:**
```python
# Tulis kode mu disini

```



---

### Activity 7: Quiz Cepat Logika Aplikasi Kasir

* **Instruksi:**
Jawablah kuis pilihan ganda berikut untuk mengevaluasi pemahaman integrasi kodingmu!

1. **Struktur data apakah yang paling cocok digunakan untuk menyimpan daftar menu beserta harganya?**
* A. List
* B. String
* C. Dictionary
* D. Integer


2. **Mengapa input nama menu dari pengguna sebaiknya diubah menggunakan `.title()` atau `.lower()` sebelum dicocokkan dengan dictionary menu?**
* A. Agar program berjalan lebih cepat
* B. Agar tidak terjadi `KeyError` akibat perbedaan huruf besar/kecil
* C. Agar otomatis mendapat diskon
* D. Karena Python wajib menggunakan huruf kapital


3. **Method apakah yang digunakan untuk memasukkan item pesanan baru ke dalam List keranjang belanja?**
* A. `.append()`
* B. `.update()`
* C. `.add()`
* D. `.push()`


4. **Kondisi manakah yang benar untuk memberikan diskon 10% saat total belanja mencapai atau melebihi Rp 100.000?**
* A. `if total == 100000:`
* B. `if total >= 100000:`
* C. `if total < 100000:`
* D. `while total >= 100000:`


5. **Apa fungsi dari kata kunci `break` di dalam `while` loop aplikasi kasir?**
* A. Menghapus seluruh pesanan pelanggan
* B. Mengulang kembali proses pemesanan dari awal
* C. Menghentikan loop pesanan jika pengguna selesai memilih menu
* D. Menampilkan pesan error



* **Kunci Jawaban Quiz (Internal Pengajar/Sistem):**
1. **C** *(Dictionary sangat pas karena pasangan Key/Nama Barang dan Value/Harga)*
2. **B** *(Pencarian key pada Dictionary bersifat Case-Sensitive)*
3. **A** *(`.append()` menambahkan item ke urutan terakhir list)*
4. **B** *(Operator `>=` digunakan untuk "minimal/mencapai atau melebihi")*
5. **C** *(`break` menghentikan pengerjaan perulangan)*



---

### Activity 8: Mini Project - Sistem Kasir & Cetak Struk Pembayaran

* **Instruksi:**
Gabungkan seluruh modul yang sudah dipelajari untuk membuat **Aplikasi Kasir Warung Pintar** lengkap!
**Spesifikasi Program:**
1. Memiliki Dictionary `menu = {"Nasi Goreng": 15000, "Mie Ayam": 12000, "Es Teh": 5000, "Ayam Bakar": 20000}`.
2. Tampilkan daftar menu beserta harganya saat program dimulai.
3. Gunakan `while` loop untuk meminta pemesanan barang berulang kali sampai pengguna mengetik `"selesai"`.
4. Setiap item yang valid akan dimasukkan ke dalam List `keranjang`. Jika barang tidak ada di menu, tampilkan pesan warning.
5. Hitung total belanja. Berikan diskon **10%** jika total belanja **>= Rp 50.000**.
6. Minta input pembayaran uang dari kasir, pastikan uang cukup, lalu hitung kembalian.
7. Cetak **Struk Pembayaran** yang rapi berisi:
* Daftar barang yang dibeli
* Total Belanja
* Diskon (jika ada)
* Total Bayar Akhir
* Uang Bayar & Kembalian




* **Starter Code:**
```python
# Tulis kode mu disini

```