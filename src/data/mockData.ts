import { Badge, FoodAnalysisResult, SampleFoodPlate, UserProfile } from '../types';

export const INITIAL_USER_PROFILE: UserProfile = {
  name: 'Sobat Nutrisi',
  grade: 'Kelas 8 SMP',
  age: 14,
  xp: 340,
  level: 2,
  waterCount: 5,
  streakDays: 3,
  unlockedBadgeIds: ['badge-first-scan', 'badge-water-champion'],
};

export const BADGES_LIST: Badge[] = [
  {
    id: 'badge-first-scan',
    title: 'Detektif Pemula',
    description: 'Berhasil memotret dan menganalisis makanan pertamamu!',
    icon: '🔍',
    category: 'Deteksi',
    requirement: 'Scan 1 makanan',
    xpBonus: 50,
  },
  {
    id: 'badge-veggie-hero',
    title: 'Penakluk Sayur Hijau',
    description: 'Makan sayuran hijau penuh zat besi & kalsium tinggi badan.',
    icon: '🥦',
    category: 'Gizi Seimbang',
    requirement: 'Scan menu ber-sayur',
    xpBonus: 80,
  },
  {
    id: 'badge-protein-titan',
    title: 'Titan Protein',
    description: 'Asupan protein harian mencapai target penguat otot!',
    icon: '💪',
    category: 'Pertumbuhan',
    requirement: 'Capai target protein',
    xpBonus: 100,
  },
  {
    id: 'badge-fruit-master',
    title: 'Master Buah Segar',
    description: 'Koleksi vitamin alami dari buah-buahan lezat.',
    icon: '🍎',
    category: 'Imun Tubuh',
    requirement: 'Scan buah 2x',
    xpBonus: 70,
  },
  {
    id: 'badge-water-champion',
    title: 'Penguasa Hidrasi',
    description: 'Rajin minum air putih untuk otak cerdas dan fokus.',
    icon: '💧',
    category: 'Hidrasi',
    requirement: 'Minum minimal 6 gelas',
    xpBonus: 50,
  },
  {
    id: 'badge-streak-fire',
    title: 'Detektif Konsisten',
    description: 'Catat nutrisi makanan 3 hari berturut-turut tanpa putus!',
    icon: '🔥',
    category: 'Kedisiplinan',
    requirement: 'Streak 3 hari',
    xpBonus: 120,
  },
];

export const LEVEL_TITLES = [
  { level: 1, title: 'Calon Detektif Nutrisi', minXp: 0, maxXp: 200, color: 'text-amber-600 bg-amber-100' },
  { level: 2, title: 'Penjelajah Pangan Bergizi', minXp: 200, maxXp: 500, color: 'text-emerald-700 bg-emerald-100' },
  { level: 3, title: 'Pahlawan Tumbuh Kembang', minXp: 500, maxXp: 900, color: 'text-cyan-700 bg-cyan-100' },
  { level: 4, title: 'Kapten Benteng Sehat', minXp: 900, maxXp: 1400, color: 'text-indigo-700 bg-indigo-100' },
  { level: 5, title: 'Master NutriBot Legendaris', minXp: 1400, maxXp: 2500, color: 'text-purple-700 bg-purple-100' },
];

export const SAMPLE_FOOD_PLATES: SampleFoodPlate[] = [
  {
    id: 'sample-sayur-bayam',
    title: 'Sayur Bayam Jagung & Tempe Goreng',
    category: 'Sayur & Nabati',
    description: 'Menu favorit nusantara kaya zat besi untuk energi sekolah dan tempe kaya protein nabati.',
    portion: '1 mangkuk sayur + 2 potong tempe (220g)',
    imageUrl: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=600&auto=format&fit=crop&q=80',
    nutritionPreview: { calories: 285, protein: 18, carbs: 24, fat: 12 },
  },
  {
    id: 'sample-pisang-apel',
    title: 'Pisang Cavendish & Apel Merah',
    category: 'Buah Segar',
    description: 'Camilan sehat kaya kalium untuk detak jantung sehat dan vitamin C pelindung imun.',
    portion: '1 pisang sedang + 1 apel segar (210g)',
    imageUrl: 'https://images.unsplash.com/photo-1619566636858-adf3ef46400b?w=600&auto=format&fit=crop&q=80',
    nutritionPreview: { calories: 195, protein: 2, carbs: 48, fat: 0.5 },
  },
  {
    id: 'sample-nasi-telur',
    title: 'Nasi Goreng Telur Ceplok & Lalap Timun',
    category: 'Menu Utama',
    description: 'Karbohidrat bahan bakar belajar dipadu telur ceplok kaya protein dan kolin untuk daya ingat.',
    portion: '1 piring sedang (sekitar 250g)',
    imageUrl: 'https://images.unsplash.com/photo-1603133872878-684f208fb84b?w=600&auto=format&fit=crop&q=80',
    nutritionPreview: { calories: 430, protein: 16, carbs: 58, fat: 14 },
  },
  {
    id: 'sample-oat-susu',
    title: 'Oatmeal Buah Beri & Segelas Susu',
    category: 'Sarapan Super',
    description: 'Kombinasi sarapan juara! Kalsium susu bikin tulang dan tinggi badan melesat.',
    portion: '1 mangkuk oatmeal + 200ml susu UHT (300g)',
    imageUrl: 'https://images.unsplash.com/photo-1517673132405-a56a62b18caf?w=600&auto=format&fit=crop&q=80',
    nutritionPreview: { calories: 340, protein: 17, carbs: 52, fat: 8 },
  },
  {
    id: 'sample-ayam-brokoli',
    title: 'Dada Ayam Panggang & Brokoli Rebus',
    category: 'Tinggi Protein',
    description: 'Paket superpower atlet muda: protein murni penguat serat otot dan brokoli antioksidan.',
    portion: '1 porsi dada ayam + brokoli (240g)',
    imageUrl: 'https://images.unsplash.com/photo-1532550907401-a500c9a57435?w=600&auto=format&fit=crop&q=80',
    nutritionPreview: { calories: 360, protein: 38, carbs: 12, fat: 15 },
  },
];

export const INITIAL_FOOD_HISTORY: FoodAnalysisResult[] = [
  {
    id: 'hist-1',
    timestamp: 'Pagi Hari (06:45)',
    imageUrl: 'https://images.unsplash.com/photo-1517673132405-a56a62b18caf?w=600&auto=format&fit=crop&q=80',
    isFood: true,
    foodName: 'Oatmeal Buah Beri & Segelas Susu UHT',
    portionEstimate: '1 mangkuk sedang + 1 gelas susu (280 gram)',
    calories: 340,
    carbs: 52,
    protein: 17,
    fat: 8,
    fiber: 6,
    healthScore: 95,
    mainVitaminsAndMinerals: ['Kalsium', 'Vitamin D', 'Vitamin B12', 'Zat Besi'],
    superpowerEffects: [
      {
        category: 'tinggi_badan',
        name: 'Roket Tinggi Badan',
        nutrient: 'Kalsium & Vitamin D',
        analogy: 'Bahan semen alami buat memanjangkan tulang kaki dan punggungmu agar cepat tinggi seperti pemain basket!',
        powerLevel: 94,
      },
      {
        category: 'kecerdasan_otak',
        name: 'Booster Fokus Belajar',
        nutrient: 'Serat Beta-Glukan & B-Kompleks',
        analogy: 'Melepaskan energi secara perlahan ke sel otak biar kamu nggak gampang ngantuk pas jam pelajaran matematika.',
        powerLevel: 88,
      },
      {
        category: 'kekuatan_otot',
        name: 'Pondasi Otot Tangguh',
        nutrient: 'Protein Susu & Oat',
        analogy: 'Membantu regenerasi sel otot setelah kamu beraktivitas jalan kaki atau upacara di sekolah.',
        powerLevel: 75,
      },
    ],
    tipsSeru: 'Keren banget sarapannya, Sobat Nutrisi! Buat besok pagi, coba taburkan sedikit biji chia atau potongan kacang almond ya biar makin renyah dan otak makin cerdas!',
    pertanyaanHariIni: 'Hari ini di sekolah ada pelajaran olahraga atau ekstrakurikuler apa nih?',
    quickAnswers: ['Ada PJOK lari & basket!', 'Hari ini fokus di kelas', 'Sore nanti mau main futsal/sepeda'],
    xpEarned: 85,
    formattedReport: `---
📸 **HASIL DETEKSI NUTRIBOT**
* **Nama Makanan:** Oatmeal Buah Beri & Segelas Susu UHT
* **Perkiraan Porsi:** 1 mangkuk sedang + 1 gelas susu (sekitar 280 gram)

⭐ **KARTU NUTRISI (Perkiraan)**
* ⚡ **Energi/Kalori:** 340 kkal
* 🍞 **Karbohidrat:** 52 gram
* 💪 **Protein:** 17 gram
* 🥑 **Lemak Sehat:** 8 gram
* 🌟 **Vitamin & Mineral Utama:** Kalsium, Vitamin D, Vitamin B12

🦸‍♂️ **EFEK SUPER BUAT TUMBUH KEMBANGMU!**
- **Kalsium & Vit D:** "Bahan semen alami buat memanjangkan tulang agar kamu cepat bertambah tinggi!"
- **Serat Beta-Glukan:** "Baterai stabil pengisi daya otak biar kamu konsentrasi penuh saat belajar di kelas!"

💡 **TIPS SERU DARI NUTRIBOT**
Kombinasi sarapan luar biasa! Besok bisa ditambah sepotong pisang atau madu alami ya!

❓ **PERTANYAAN HARI INI**
Hari ini di sekolah ada aktivitas olahraga atau ekstrakurikuler apa nih?
---
*Estimasi nutrisi ini merupakan panduan edukasi gaya hidup sehat untuk anak & remaja.*`,
  },
  {
    id: 'hist-2',
    timestamp: 'Siang Hari (12:30)',
    imageUrl: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=600&auto=format&fit=crop&q=80',
    isFood: true,
    foodName: 'Sayur Bening Bayam, Jagung Manis & Tempe Goreng',
    portionEstimate: '1 mangkuk sayur bayam + 2 potong tempe (220 gram)',
    calories: 285,
    carbs: 24,
    protein: 18,
    fat: 12,
    fiber: 7,
    healthScore: 92,
    mainVitaminsAndMinerals: ['Zat Besi', 'Vitamin A', 'Vitamin K', 'Asam Folat'],
    superpowerEffects: [
      {
        category: 'imun_tubuh',
        name: 'Perisai Anti-Penyakit',
        nutrient: 'Zat Besi & Vitamin A',
        analogy: 'Bayam bikin sel darah merahmu aktif mengangkut oksigen segar, badanmu jadi segar bugar dan nggak lemas!',
        powerLevel: 92,
      },
      {
        category: 'kekuatan_otot',
        name: 'Kekuatan Super Nabati',
        nutrient: 'Protein Fermentasi Tempe',
        analogy: 'Tempe adalah superfood asli Indonesia yang gampang diserap tubuh untuk membentuk serat otot yang padat.',
        powerLevel: 85,
      },
    ],
    tipsSeru: 'Bayam segar dan tempe adalah kombo juara! Kalau mau makin lengkap, kamu bisa minum jus jeruk setelahnya karena Vitamin C membantu penyerapan zat besi dari bayam secara maksimal!',
    pertanyaanHariIni: 'Sudah minum berapa gelas air putih sampai siang ini, Sobat Sehat?',
    quickAnswers: ['Sudah 4 gelas dong!', 'Baru 2 gelas, mau minum sekarang!', 'Lupa hitung tapi sudah cukup banyak'],
    xpEarned: 90,
    formattedReport: `---
📸 **HASIL DETEKSI NUTRIBOT**
* **Nama Makanan:** Sayur Bening Bayam, Jagung Manis & Tempe Goreng
* **Perkiraan Porsi:** 1 mangkuk sayur + 2 potong tempe (sekitar 220 gram)

⭐ **KARTU NUTRISI (Perkiraan)**
* ⚡ **Energi/Kalori:** 285 kkal
* 🍞 **Karbohidrat:** 24 gram
* 💪 **Protein:** 18 gram
* 🥑 **Lemak Sehat:** 12 gram
* 🌟 **Vitamin & Mineral Utama:** Zat Besi, Vitamin A, Vitamin K

🦸‍♂️ **EFEK SUPER BUAT TUMBUH KEMBANGMU!**
- **Zat Besi Bayam:** "Bahan bakar pembentuk sel darah merah biar kamu bertenaga dan wajah cerah ceria!"
- **Protein Tempe:** "Superfood pembangun jaringan otot yang kuat dan sehat!"

💡 **TIPS SERU DARI NUTRIBOT**
Minum segelas air perasan jeruk atau makan buah segar setelah makan bayam agar zat besinya terserap sempurna!

❓ **PERTANYAAN HARI INI**
Sudah minum berapa gelas air putih sampai siang ini, Sobat Sehat?
---
*Estimasi nutrisi ini merupakan panduan edukasi gaya hidup sehat untuk anak & remaja.*`,
  },
];
