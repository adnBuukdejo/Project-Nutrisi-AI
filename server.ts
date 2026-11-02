import express from 'express';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI, Type } from '@google/genai';
import { createServer as createViteServer } from 'vite';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = Number(process.env.PORT) || 3000;

  // Allow larger payload for image uploads
  app.use(express.json({ limit: '30mb' }));
  app.use(express.urlencoded({ extended: true, limit: '30mb' }));

  const ai = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });

  // Health check endpoint
  app.get('/api/health', (_req, res) => {
    res.json({
      status: 'ok',
      hasApiKey: Boolean(process.env.GEMINI_API_KEY),
      service: 'NutriBot API',
    });
  });

  // Analyze Food Vision endpoint
  app.post('/api/analyze-food', async (req, res) => {
    try {
      const { imageBase64, mimeType = 'image/jpeg', userNote = '' } = req.body;

      if (!imageBase64) {
        return res.status(400).json({ error: 'Gambar tidak ditemukan' });
      }

      // Clean base64 data if it contains data prefix
      const cleanBase64 = imageBase64.replace(/^data:image\/\w+;base64,/, '');

      const systemInstruction = `Kamu adalah "NutriBot", detektif nutrisi dan sahabat tumbuh kembang anak yang ramah, seru, dan penuh semangat!

Tugas utamamu adalah:
1. Menganalisis gambar makanan atau buah yang diunggah oleh pengguna (anak-anak/remaja SMP atau orang tua).
2. Menebak nama makanan tersebut dan perkiraan porsinya.
3. Menjelaskan kandungan nutrisinya secara akurat namun mudah dipahami anak-anak dan remaja (10-15 tahun).
4. Menghubungkan nutrisi tersebut secara langsung dengan efek "Superpower" bagi tumbuh kembang tubuh (tinggi badan, kekuatan otot, kecerdasan otak, imun tubuh, energi).
5. Berikan format laporan rapi yang ceria, interaktif, gunakan emoji yang relevan, dan hindari istilah medis yang terlalu rumit.

Jika gambar BURAM atau BUKAN MAKANAN:
- Set isFood = false
- Berikan pesan sopan dan jenaka, minta mereka mengambil foto ulang makanan yang jelas dari atas (top-down) dengan pencahayaan cukup.

Format teks laporan rapi (formattedReport) HARUS mengikuti template ini:
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
- [Efek superpower dengan analogi seru, contoh: Protein: "Bahan bakar rahasia buat bikin otot makin kuat dan nambah tinggi badan!"]

💡 **TIPS SERU DARI NUTRIBOT**
[Tips sehat atau makanan pendamping agar gizi seimbang]

❓ **PERTANYAAN HARI INI**
[1 pertanyaan interaktif singkat untuk memancing interaksi pengguna]
---
Catatan kecil di akhir: Estimasi nutrisi ini merupakan panduan edukasi gaya hidup sehat untuk tumbuh kembang anak.`;

      const promptText = `Tolong analisis foto makanan ini secara detail untuk detektif nutrisi anak. ${
        userNote ? `Catatan dari pengguna: "${userNote}".` : ''
      } Berikan data nutrisi estimasi, efek superpower tumbuh kembang, tips seru, dan pertanyaan hari ini.`;

      const response = await ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: {
          parts: [
            {
              inlineData: {
                mimeType,
                data: cleanBase64,
              },
            },
            {
              text: promptText,
            },
          ],
        },
        config: {
          systemInstruction,
          responseMimeType: 'application/json',
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              isFood: {
                type: Type.BOOLEAN,
                description: 'True jika gambar adalah makanan/minuman/buah yang bisa diidentifikasi.',
              },
              foodName: {
                type: Type.STRING,
                description: 'Nama makanan atau buah dalam bahasa Indonesia yang ramah.',
              },
              portionEstimate: {
                type: Type.STRING,
                description: 'Perkiraan porsi (contoh: 1 piring sedang / 200 gram).',
              },
              calories: {
                type: Type.NUMBER,
                description: 'Perkiraan kalori (kkal).',
              },
              carbs: {
                type: Type.NUMBER,
                description: 'Karbohidrat dalam gram.',
              },
              protein: {
                type: Type.NUMBER,
                description: 'Protein dalam gram.',
              },
              fat: {
                type: Type.NUMBER,
                description: 'Lemak sehat / total lemak dalam gram.',
              },
              fiber: {
                type: Type.NUMBER,
                description: 'Serat dalam gram.',
              },
              mainVitaminsAndMinerals: {
                type: Type.ARRAY,
                items: { type: Type.STRING },
                description: 'Daftar 2-4 vitamin & mineral utama.',
              },
              healthScore: {
                type: Type.NUMBER,
                description: 'Skor kesehatan dari 1 sampai 100.',
              },
              superpowerEffects: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    category: {
                      type: Type.STRING,
                      description: 'Kategori: tinggi_badan, kekuatan_otot, kecerdasan_otak, imun_tubuh, atau energi_harian.',
                    },
                    name: {
                      type: Type.STRING,
                      description: 'Nama superpower (misal: "Bahan Bakar Otot Kuat", "Perisai Anti-Sakit", "Pengungkit Tinggi Badan").',
                    },
                    nutrient: {
                      type: Type.STRING,
                      description: 'Zat gizi yang berperan (misal: "Protein & Kalsium").',
                    },
                    analogy: {
                      type: Type.STRING,
                      description: 'Analogi seru yang menyenangkan untuk anak/remaja.',
                    },
                    powerLevel: {
                      type: Type.NUMBER,
                      description: 'Skor kekuatan dari 1 sampai 100.',
                    },
                  },
                  required: ['category', 'name', 'nutrient', 'analogy', 'powerLevel'],
                },
              },
              tipsSeru: {
                type: Type.STRING,
                description: 'Tips sehat atau saran makanan pendamping yang ceria.',
              },
              pertanyaanHariIni: {
                type: Type.STRING,
                description: 'Pertanyaan interaktif seru untuk anak.',
              },
              quickAnswers: {
                type: Type.ARRAY,
                items: { type: Type.STRING },
                description: '3 pilihan jawaban singkat untuk pertanyaan hari ini.',
              },
              xpEarned: {
                type: Type.NUMBER,
                description: 'Poin XP yang didapat anak (misal 50-120 XP berdasarkan kebaikan makanan/sayur/buah).',
              },
              formattedReport: {
                type: Type.STRING,
                description: 'Laporan teks rapi sesuai format standar NutriBot.',
              },
              warningOrNote: {
                type: Type.STRING,
                description: 'Catatan penting jika ada (atau pesan jika bukan makanan).',
              },
            },
            required: [
              'isFood',
              'foodName',
              'portionEstimate',
              'calories',
              'carbs',
              'protein',
              'fat',
              'mainVitaminsAndMinerals',
              'superpowerEffects',
              'tipsSeru',
              'pertanyaanHariIni',
              'xpEarned',
              'formattedReport',
            ],
          },
        },
      });

      const responseText = response.text?.trim() || '{}';
      const parsedData = JSON.parse(responseText);

      res.json({
        success: true,
        data: parsedData,
      });
    } catch (error: any) {
      console.error('Error in /api/analyze-food:', error);
      res.status(500).json({
        success: false,
        error: error.message || 'Gagal menganalisis gambar dengan NutriBot',
      });
    }
  });

  // Chat / Tanya NutriBot endpoint
  app.post('/api/ask-nutribot', async (req, res) => {
    try {
      const { message, currentFoodContext, history = [] } = req.body;

      if (!message) {
        return res.status(400).json({ error: 'Pesan tidak boleh kosong' });
      }

      const systemInstruction = `Kamu adalah "NutriBot", detektif nutrisi dan sahabat tumbuh kembang anak yang ramah, seru, dan penuh semangat!
Bantu jawab pertanyaan anak, remaja SMP, atau orang tua tentang makanan sehat, asupan gizi, pertumbuhan tinggi badan, kekuatan olahraga, konsentrasi belajar di sekolah, atau pertanyaan seputar makanan yang sedang mereka makan.
Gunakan nada bicara ceria, gunakan emoji yang relevan, ramah anak, dan berikan tips praktis.
Jawab secara ringkas, padat, dan mudah dimengerti (maksimal 2-3 paragraf singkat).`;

      const promptParts = [
        currentFoodContext
          ? `Konteks makanan yang sedang dibahas pengguna:\nNama Makanan: ${currentFoodContext.foodName}\nKalori: ${currentFoodContext.calories} kkal, Protein: ${currentFoodContext.protein}g, Karbo: ${currentFoodContext.carbs}g, Lemak: ${currentFoodContext.fat}g\n`
          : '',
        `Pertanyaan dari Sobat Sehat: "${message}"`,
      ].filter(Boolean).join('\n');

      const response = await ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: promptParts,
        config: {
          systemInstruction,
          temperature: 0.7,
        },
      });

      res.json({
        success: true,
        reply: response.text || 'Halo Sobat Sehat! Tetap semangat makan sehat dan raih superpower tumbuh kembangmu ya! 🚀',
      });
    } catch (error: any) {
      console.error('Error in /api/ask-nutribot:', error);
      res.status(500).json({
        success: false,
        error: error.message || 'Gagal menghubungi NutriBot',
      });
    }
  });

  // Production static files vs Vite middleware in development
  if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (_req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  } else {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`🚀 NutriBot server running on http://0.0.0.0:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('Failed to start server:', err);
  process.exit(1);
});
