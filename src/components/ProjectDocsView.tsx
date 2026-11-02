import React, { useState } from 'react';
import {
  Cpu,
  Copy,
  Check,
  Sparkles,
  BookOpen,
  Layers,
  Award,
  CheckCircle2,
  Terminal,
  Smartphone,
  Database
} from 'lucide-react';

export const ProjectDocsView: React.FC = () => {
  const [copiedPrompt, setCopiedPrompt] = useState(false);

  const SYSTEM_PROMPT_TEXT = `Kamu adalah "NutriBot", detektif nutrisi dan sahabat tumbuh kembang anak yang ramah, seru, dan penuh semangat! 

Tugas utamamu adalah:
1. Menganalisis gambar makanan atau buah yang diunggah oleh pengguna.
2. Menebak nama makanan tersebut dan perkiraan porsinya.
3. Menjelaskan kandungan nutrisinya secara akurat namun mudah dipahami anak-anak dan remaja.
4. Menghubungkan nutrisi tersebut secara langsung dengan efek "Superpower" bagi tumbuh kembang tubuh (tinggi badan, kekuatan otot, kecerdasan otak, imun tubuh).

Gunakan nada bicara yang ceria, interaktif, gunakan emoji yang relevan, dan hindari istilah medis yang terlalu rumit tanpa penjelasan sederhana.

Format respon kamu HARUS selalu rapi seperti berikut:

---
📸 **HASIL DETEKSI NUTRIBOT**
* **Nama Makanan:** [Nama makanan/buah]
* **Perkiraan Porsi:** [Misal: 1 buah sedang / 1 mangkuk kecil (sekitar ... gram)]

⭐ **KARTU NUTRISI (Perkiraan)**
* ⚡ **Energi/Kalori:** ... kkal
* 🍞 **Karbohidrat:** ... gram
* 💪 **Protein:** ... gram
* 🥑 **Lemak Sehat:** ... gram
* 🌟 **Vitamin & Mineral Utama:** [Sebutkan 1-3 vitamin/mineral terbanyak, misal: Vitamin C, Kalsium]

🦸‍♂️ **EFEK SUPER BUAT TUMBUH KEMBANGMU!**
[Jelaskan manfaatnya dengan analogi seru, contoh:
- Protein: "Bahan bakar rahasia buat bikin otot makin kuat dan nambah tinggi badan!"
- Vitamin C: "Perisai anti-penyakit biar kamu nggak gampang flu saat main!"]

💡 **TIPS SERU DARI NUTRIBOT**
[Berikan 1 tips sehat atau saran makanan pelengkap agar gizinya makin seimbang. Contoh: "Keren banget makan pisang! Biar makin mantap, bisa ditambah segelas susu ya!"]

❓ **PERTANYAAN HARI INI**
[Berikan 1 pertanyaan interaktif singkat untuk memancing interaksi pengguna, misal: "Hari ini kamu sudah minum berapa gelas air putih, Sobat Sehat?"]
---

Catatan Khusus:
- Jika gambar yang dikirim BURAM atau BUKAN MAKANAN, jawab dengan sopan dan jenaka, minta mereka mengambil foto ulang makanan yang jelas.
- Berikan catatan kecil di akhir bahwa ini adalah estimasi untuk panduan gaya hidup sehat.`;

  const handleCopy = () => {
    navigator.clipboard.writeText(SYSTEM_PROMPT_TEXT);
    setCopiedPrompt(true);
    setTimeout(() => setCopiedPrompt(false), 2500);
  };

  return (
    <div className="space-y-6">
      {/* Hero Header */}
      <div className="bg-gradient-to-r from-emerald-600 via-teal-600 to-indigo-700 rounded-3xl p-6 sm:p-8 text-white shadow-md">
        <div className="flex items-center space-x-2">
          <span className="bg-amber-400 text-amber-950 text-xs font-black px-2.5 py-0.5 rounded-full uppercase">
            Dokumentasi Proyek Kelas 8 SMP
          </span>
          <span className="text-xs text-emerald-100 font-medium">Sains, Informatika & Kesehatan</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-extrabold font-['Fredoka',sans-serif] mt-1">
          Arsitektur & Konsep NutriBot Vision AI
        </h2>
        <p className="text-emerald-100 text-xs sm:text-sm mt-1 max-w-2xl leading-relaxed">
          Panduan teknis dan materi presentasi proyek detektif nutrisi berbasis Multimodal Vision AI untuk mengatasi masalah malnutrisi dan stunting pada anak usia sekolah.
        </p>
      </div>

      {/* 1. Alur Kerja Sistem (Workflow Sederhana) */}
      <div className="bg-white rounded-3xl border border-amber-200/90 p-4 sm:p-6 lg:p-8 shadow-xs">
        <h3 className="text-lg font-extrabold text-slate-900 font-['Fredoka',sans-serif] flex items-center space-x-2">
          <Layers className="w-5 h-5 text-emerald-600" />
          <span>1. Alur Kerja Sistem (Workflow Sederhana)</span>
        </h3>
        <p className="text-xs sm:text-sm text-slate-600 mt-1">
          Berikut adalah 4 tahapan utama dari sistem NutriBot dari foto pengguna hingga visualisasi grafik:
        </p>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-4">
          <div className="bg-amber-50/60 border border-amber-200 p-4 rounded-2xl relative">
            <div className="w-8 h-8 rounded-full bg-amber-400 text-amber-950 font-black flex items-center justify-center text-xs mb-2">
              1
            </div>
            <h4 className="font-extrabold text-slate-900 text-sm">Input Foto</h4>
            <p className="text-xs text-slate-600 mt-1">
              Pengguna (anak atau orang tua) mengambil foto makanan/buah lewat kamera HP atau mengunggah gambar.
            </p>
          </div>

          <div className="bg-emerald-50/60 border border-emerald-200 p-4 rounded-2xl relative">
            <div className="w-8 h-8 rounded-full bg-emerald-500 text-white font-black flex items-center justify-center text-xs mb-2">
              2
            </div>
            <h4 className="font-extrabold text-slate-900 text-sm">Proses Vision AI</h4>
            <p className="text-xs text-slate-600 mt-1">
              Foto dikirim ke Google Gemini Multimodal Vision API bersama System Instructions berkarakter superhero.
            </p>
          </div>

          <div className="bg-blue-50/60 border border-blue-200 p-4 rounded-2xl relative">
            <div className="w-8 h-8 rounded-full bg-blue-500 text-white font-black flex items-center justify-center text-xs mb-2">
              3
            </div>
            <h4 className="font-extrabold text-slate-900 text-sm">Output Edukatif</h4>
            <p className="text-xs text-slate-600 mt-1">
              AI mengembalikan data nutrisi lengkap dengan analogi seru tumbuh kembang (otot, tinggi, otak, imun).
            </p>
          </div>

          <div className="bg-purple-50/60 border border-purple-200 p-4 rounded-2xl relative">
            <div className="w-8 h-8 rounded-full bg-purple-500 text-white font-black flex items-center justify-center text-xs mb-2">
              4
            </div>
            <h4 className="font-extrabold text-slate-900 text-sm">Monitoring & Gamifikasi</h4>
            <p className="text-xs text-slate-600 mt-1">
              Data disimpan ke buku harian untuk mencatat grafik tumbuh kembang harian/mingguan dan panen XP!
            </p>
          </div>
        </div>
      </div>

      {/* 2. System Prompt Interaktif */}
      <div className="bg-white rounded-3xl border border-amber-200/90 p-4 sm:p-6 lg:p-8 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
          <div>
            <h3 className="text-lg font-extrabold text-slate-900 font-['Fredoka',sans-serif] flex items-center space-x-2">
              <Terminal className="w-5 h-5 text-indigo-600" />
              <span>2. System Prompt Interaktif & Menyenangkan</span>
            </h3>
            <p className="text-xs text-slate-500">
              Prompt utama yang disuntikkan ke model Gemini Vision di backend server
            </p>
          </div>

          <button
            onClick={handleCopy}
            className="flex items-center space-x-1.5 px-3.5 py-2 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-200 rounded-xl text-xs font-bold transition-all self-start sm:self-auto active:scale-95"
          >
            {copiedPrompt ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
            <span>{copiedPrompt ? 'Prompt Berhasil Disalin!' : 'Salin System Prompt'}</span>
          </button>
        </div>

        <pre className="p-4 bg-slate-900 text-slate-100 rounded-2xl text-xs font-mono overflow-x-auto leading-relaxed border border-slate-800">
          {SYSTEM_PROMPT_TEXT}
        </pre>
      </div>

      {/* 3. Tips Tambahan untuk Proyek Sekolah */}
      <div className="bg-white rounded-3xl border border-amber-200/90 p-4 sm:p-6 lg:p-8 shadow-xs">
        <h3 className="text-lg font-extrabold text-slate-900 font-['Fredoka',sans-serif] flex items-center space-x-2">
          <Sparkles className="w-5 h-5 text-amber-500" />
          <span>3. Tips Tambahan & Rekomendasi Masa Depan</span>
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-4 text-xs text-slate-700">
          <div className="bg-amber-50/50 p-4 rounded-2xl border border-amber-200">
            <div className="font-extrabold text-amber-950 text-sm flex items-center space-x-1.5 mb-1.5">
              <Database className="w-4 h-4 text-amber-600" />
              <span>Format JSON & Grafik</span>
            </div>
            <p className="leading-relaxed">
              Respon AI diformat dalam struktur JSON standar, sehingga nilai kalori, protein, dan vitamin dapat langsung dihubungkan ke grafik mingguan dan disimpan di database.
            </p>
          </div>

          <div className="bg-emerald-50/50 p-4 rounded-2xl border border-emerald-200">
            <div className="font-extrabold text-emerald-950 text-sm flex items-center space-x-1.5 mb-1.5">
              <Award className="w-4 h-4 text-emerald-600" />
              <span>Fitur Gamifikasi (XP & Poin)</span>
            </div>
            <p className="leading-relaxed">
              Anak-anak termotivasi mengonsumsi sayuran hijau dan buah segar karena mendapatkan poin XP, naik level detektif, dan membuka lencana keren.
            </p>
          </div>

          <div className="bg-blue-50/50 p-4 rounded-2xl border border-blue-200">
            <div className="font-extrabold text-blue-950 text-sm flex items-center space-x-1.5 mb-1.5">
              <Smartphone className="w-4 h-4 text-blue-600" />
              <span>Aplikasi HP (Mobile)</span>
            </div>
            <p className="leading-relaxed">
              Bisa dikembangkan lebih lanjut menjadi aplikasi Android/iOS dengan Flutter, MIT App Inventor, atau dijadikan PWA (Progressive Web App) yang bisa diinstall di HP siswa!
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
