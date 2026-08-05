import { PrismaClient } from "@prisma/client";

const PYTHON_EDITOR_URL =
  process.env.PYTHON_EDITOR_URL ?? "http://localhost:3000";

export async function seedTrialPython(
  prisma: PrismaClient,
  defaultAssessment: { id: string },
  categoryIds?: { id: string }[],
) {
  await prisma.studentTopicProgress.deleteMany();
  const existing = await prisma.curriculum.findMany({
    where: { name: "Trial Python 6-9" },
    select: { id: true },
  });
  if (existing.length > 0) {
    await prisma.curriculum.deleteMany({
      where: { id: { in: existing.map((c) => c.id) } },
    });
  }

  const trialTasks = [
    {
      code: "trial-py-1",
      label: "1",
      type: "PYTHON" as const,
      url: `${PYTHON_EDITOR_URL}/project-editor`,
      isCapstone: false,
      instructions: `## Activity 1: Kenalan dengan print()

**print()** adalah perintah pertama yang kita pelajari di Python. Fungsinya menampilkan teks ke layar.

**Cara pakai:**
1. Ketik \`print("teks kamu")\` untuk menampilkan teks
2. Teks harus diapit tanda kutip \`"\`
3. Tekan Run/play untuk menjalankan

Coba tulis program yang menampilkan kata **"Halo, aku Python!"** di layar!

\`\`\`text
Output yang diharapkan:
Halo, aku Python!
\`\`\``,
      defaultCode: `# print() menampilkan teks ke layar
print("Halo dunia!")`,
    },
    {
      code: "trial-py-2",
      label: "2",
      type: "PYTHON" as const,
      url: `${PYTHON_EDITOR_URL}/project-editor`,
      isCapstone: false,
      instructions: `## Activity 2: print() dengan Variabel

Kita bisa menyimpan teks ke **variabel**, lalu menampilkannya dengan \`print()\`.

Contoh:
\`\`\`python
nama = "Budi"
print("Halo", nama)
print("Selamat datang", nama, "di kelas Python!")
\`\`\`

print() bisa menampilkan **beberapa nilai sekaligus** dengan memisahkannya pakai koma \`,\`.

Buat program yang menyimpan namamu di variabel \`nama\`, lalu menampilkannya **sebanyak 3 kali** (pakai \`print()\` sebanyak 3 baris)!

\`\`\`text
Output yang diharapkan:
Halo <nama-mu>!
Senang berkenalan, <nama-mu>!
Sampai jumpa, <nama-mu>!
\`\`\``,
      defaultCode: `# Simpan nama ke variabel
nama = "Budi"

# Tampilkan nama beberapa kali
print("Halo", nama)
print("Senang berkenalan,", nama)
print("Sampai jumpa,", nama)`,
    },
    {
      code: "trial-py-3",
      label: "3",
      type: "PYTHON" as const,
      url: `${PYTHON_EDITOR_URL}/project-editor`,
      isCapstone: false,
      instructions: `## Activity 3: print() dengan Loop for

**Loop \`for\`** membuat perintah diulang otomatis. Cocok untuk menampilkan teks berkali-kali tanpa menulis ulang!

Contoh:
\`\`\`python
for i in range(5):
    print("Halo!")
\`\`\`

\`range(5)\` berarti diulang 5 kali. Perintah di dalam loop harus **menjorok (indentasi)** 4 spasi.

Buat program yang menampilkan **"Halo Dunia!" sebanyak 5 kali** menggunakan loop \`for\`!

\`\`\`text
Output yang diharapkan:
Halo Dunia!
Halo Dunia!
Halo Dunia!
Halo Dunia!
Halo Dunia!
\`\`\``,
      defaultCode: `# Loop for mengulang perintah 5 kali
for i in range(5):
    print("Halo Dunia!")`,
    },
    {
      code: "trial-py-4",
      label: "4",
      type: "PYTHON" as const,
      url: `${PYTHON_EDITOR_URL}/project-editor`,
      isCapstone: false,
      instructions: `## Activity 4: Bikin Garis dengan Turtle

Python punya modul **turtle** untuk menggambar! Seperti kura-kura yang berjalan sambil membawa pulpen.

**Cara pakai turtle:**
1. \`import turtle\` untuk mengaktifkan modul turtle
2. \`t = turtle.Turtle()\` untuk membuat "kura-kura" baru
3. \`t.forward(100)\` untuk maju 100 langkah (membuat garis)
4. \`turtle.done()\` agar jendela gambar tetap terbuka

Buatlah program yang menggambar **satu garis lurus** sepanjang 200 pixel!

\`\`\`text
Output yang diharapkan: satu garis lurus horizontal sepanjang 200 pixel
\`\`\``,
      defaultCode: `import turtle

t = turtle.Turtle()

# Gambar garis lurus 100 pixel ke depan
t.forward(100)

turtle.done()`,
    },
    {
      code: "trial-py-5",
      label: "5",
      type: "PYTHON" as const,
      url: `${PYTHON_EDITOR_URL}/project-editor`,
      isCapstone: false,
      instructions: `## Activity 5: Bikin Kotak dengan Turtle

Untuk menggambar **persegi/kotak**, kura-kura harus:
1. Maju (\`forward\`)
2. Belok kanan 90° (\`right(90)\`)
3. Ulangi 4 kali!

Kamu sudah pernah belajar \`for\` loop. Gunakan \`for i in range(4):\` untuk mengulang 4 kali tanpa menulis ulang kode.

Buatlah program yang menggambar **kotak biru** dengan ukuran sisi 150 pixel!

\`\`\`text
Output yang diharapkan: kotak persegi berwarna biru dengan sisi 150 pixel
\`\`\``,
      defaultCode: `import turtle

t = turtle.Turtle()

# Atur warna pulpen jadi biru
t.color("blue")

\\tulis kode disini

turtle.done()`,
    },
    {
      code: "trial-py-quiz",
      label: "Quiz",
      type: "QUIZ" as const,
      url: null,
      isCapstone: false,
    },
    {
      code: "trial-py-capstone",
      label: "Capstone",
      type: "PYTHON" as const,
      url: `${PYTHON_EDITOR_URL}/project-editor`,
      isCapstone: true,
      instructions: `## Mini Project: Bikin Nama dengan Turtle!

Gunakan semua yang sudah kamu pelajari untuk **menulis nama panggilanmu** menggunakan turtle!

**Tantangan:**
1. Pakai \`t.forward()\`, \`t.right()\`, \`t.left()\` untuk menggambar setiap huruf
2. Gunakan \`t.penup()\` dan \`t.pendown()\` untuk pindah antar huruf tanpa menggambar garis
3. Gunakan \`t.color()\` untuk membuat setiap huruf warna berbeda
4. Gunakan loop \`for\` untuk mengulang pola yang sama

**Tips:** Setiap huruf bisa dibuat dari kombinasi garis lurus dan belokan. Misalnya:
- Huruf L: maju 100 → mundur 100 → belok kanan → maju 50
- Huruf I: maju 100
- Huruf T: maju 50 → mundur 25 → belok kanan → maju 80

\`\`\`text
Output: nama panggilan kamu ditulis dengan turtle graphics, warna-warni!
\`\`\``,
      defaultCode: `import turtle

t = turtle.Turtle()
t.speed(5)  # Kecepatan sedang

# Huruf pertama (contoh: L)
t.color("red")
t.forward(80)
t.backward(80)
t.right(90)
t.forward(50)

# Pindah ke huruf berikutnya tanpa menggambar
t.penup()
t.left(90)
t.forward(100)
t.pendown()

# Huruf kedua (tulis sendiri!)
t.color("blue")
# ... buat huruf kamu sendiri!

turtle.done()`,
    },
  ];

  const curriculum = await prisma.curriculum.create({
    data: {
      name: "Trial Python 6-9",
      assessmentSetId: defaultAssessment.id,
      ...(categoryIds?.length
        ? {
            categories: {
              create: categoryIds.map((cat) => ({ categoryId: cat.id })),
            },
          }
        : {}),
      topics: {
        create: {
          title: "Python Turtle Trial",
          order: 0,
          goals: "Pengenalan Python — print(), variabel, loop for, dan turtle graphics untuk menggambar garis, kotak, dan nama",
          tools: "Python Turtle Editor",
        },
      },
    },
    include: { topics: true },
  });

  const topicRow = curriculum.topics[0];
  if (!topicRow) return;

  await prisma.topicTask.createMany({
    data: trialTasks.map((task, i) => ({
      topicId: topicRow.id,
      code: task.code,
      label: task.label,
      url: task.url,
      order: i,
      type: task.type,
      isCapstone: task.isCapstone,
      ...(task.type === "PYTHON"
        ? {
            instructions: (task as typeof trialTasks[0] & { instructions?: string }).instructions,
            defaultCode: (task as typeof trialTasks[0] & { defaultCode?: string }).defaultCode,
          }
        : {}),
    })),
  });

  const quizTask = await prisma.topicTask.findFirst({
    where: { code: "trial-py-quiz", topicId: topicRow.id },
  });

  if (quizTask) {
    await prisma.quiz.create({
      data: {
        taskId: quizTask.id,
        questions: {
          create: [
            {
              question: "Apa fungsi perintah turtle.forward(100) dalam Python?",
              choices: [
                {
                  content: "Memutar kura-kura 100 derajat ke kanan",
                  isCorrect: false,
                  feedback: "Itu fungsi right(), bukan forward().",
                },
                {
                  content: "Menggerakkan kura-kura maju sejauh 100 pixel sambil menggambar garis",
                  isCorrect: true,
                  feedback: "Benar! forward() membuat kura-kura maju dan meninggalkan jejak garis.",
                },
                {
                  content: "Menghapus semua gambar di layar",
                  isCorrect: false,
                  feedback: "Itu fungsi clear(), bukan forward().",
                },
              ],
            },
            {
              question: "Berapa kali perulangan yang dibutuhkan untuk menggambar kotak/persegi dengan turtle?",
              choices: [
                {
                  content: "2 kali (maju, belok, maju, belok)",
                  isCorrect: false,
                  feedback: "2 kali baru menggambar 2 sisi, belum membentuk kotak.",
                },
                {
                  content: "3 kali (maju, belok × 3)",
                  isCorrect: false,
                  feedback: "3 kali menghasilkan segitiga, bukan kotak (perlu 90°).",
                },
                {
                  content: "4 kali (maju 100, belok kanan 90°)",
                  isCorrect: true,
                  feedback: "Benar! Kotak punya 4 sisi, jadi perlu 4 kali pengulangan dengan belokan 90°.",
                },
              ],
            },
            {
              question: "Apa kegunaan perintah t.penup() dan t.pendown()?",
              choices: [
                {
                  content: "penup() menyimpan gambar, pendown() membuka gambar",
                  isCorrect: false,
                  feedback: "Bukan untuk menyimpan/membuka file.",
                },
                {
                  content: "penup() mengangkat pulpen agar tidak menggambar saat pindah, pendown() menurunkan pulpen untuk mulai menggambar lagi",
                  isCorrect: true,
                  feedback: "Benar! penup() seperti mengangkat pulpen dari kertas, pendown() menempelkannya kembali.",
                },
                {
                  content: "penup() membuat kura-kura terbang, pendown() mendaratkan kura-kura",
                  isCorrect: false,
                  feedback: "Lucu! Tapi bukan itu fungsinya 😄. Ini tentang menggambar garis.",
                },
              ],
            },
          ],
        },
      },
    });
    console.log("✓ Mock quiz seeded for trial-py-quiz");
  }

  console.log("✓ Trial Python 6-9 curriculum seeded (7 tasks, 1 quiz)");
}
