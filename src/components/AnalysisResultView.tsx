import React, { useState } from 'react';
import {
  Volume2,
  VolumeX,
  Copy,
  Check,
  BookmarkCheck,
  Sparkles,
  Zap,
  Shield,
  Dumbbell,
  Brain,
  Rocket,
  Flame,
  ArrowRight,
  Share2,
  HelpCircle,
  Lightbulb
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { FoodAnalysisResult } from '../types';
import { speakText, stopSpeaking } from '../utils/speech';

interface AnalysisResultViewProps {
  result: FoodAnalysisResult;
  onSaveToDiary: (item: FoodAnalysisResult) => void;
  isAlreadySaved?: boolean;
  onAddXp?: (amount: number) => void;
}

export const AnalysisResultView: React.FC<AnalysisResultViewProps> = ({
  result,
  onSaveToDiary,
  isAlreadySaved = false,
  onAddXp,
}) => {
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [copied, setCopied] = useState(false);
  const [answeredQuestion, setAnsweredQuestion] = useState<string | null>(null);

  // Trigger confetti for healthy foods
  const triggerConfetti = () => {
    confetti({
      particleCount: 50,
      spread: 60,
      origin: { y: 0.7 },
      colors: ['#10B981', '#F59E0B', '#3B82F6', '#8B5CF6'],
    });
  };

  const handleSpeak = () => {
    if (isPlayingAudio) {
      stopSpeaking();
      setIsPlayingAudio(false);
      return;
    }

    const narrationText = `Halo Sobat Sehat! NutriBot berhasil mendeteksi ${result.foodName}, dengan perkiraan porsi ${result.portionEstimate}. Energi sekitar ${result.calories} kilokalori, dan protein ${result.protein} gram. Tips seru dari NutriBot: ${result.tipsSeru}`;

    setIsPlayingAudio(true);
    speakText(narrationText, () => {
      setIsPlayingAudio(false);
    });
  };

  const handleCopyText = () => {
    navigator.clipboard.writeText(result.formattedReport);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleAnswerQuestion = (answer: string) => {
    if (answeredQuestion) return;
    setAnsweredQuestion(answer);
    if (onAddXp) {
      onAddXp(15);
      triggerConfetti();
    }
  };

  const handleSave = () => {
    onSaveToDiary(result);
    triggerConfetti();
  };

  const getSuperpowerIcon = (category: string) => {
    switch (category) {
      case 'tinggi_badan':
        return <Rocket className="w-5 h-5 text-indigo-500" />;
      case 'kekuatan_otot':
        return <Dumbbell className="w-5 h-5 text-emerald-600" />;
      case 'kecerdasan_otak':
        return <Brain className="w-5 h-5 text-purple-500" />;
      case 'imun_tubuh':
        return <Shield className="w-5 h-5 text-amber-500" />;
      default:
        return <Zap className="w-5 h-5 text-teal-500" />;
    }
  };

  // If not food or blurred
  if (!result.isFood) {
    return (
      <div className="bg-amber-50 border-2 border-amber-300 rounded-3xl p-6 sm:p-8 text-center max-w-xl mx-auto my-6 shadow-sm">
        <div className="text-5xl mb-3">🧐</div>
        <h3 className="text-xl font-extrabold text-slate-900 font-['Fredoka',sans-serif]">
          Hmm, NutriBot Agak Bingung Nih!
        </h3>
        <p className="text-sm text-slate-600 mt-2 leading-relaxed">
          {result.warningOrNote ||
            'Gambarnya terlihat buram atau objeknya bukan makanan yang biasa dimakan. Coba potret ulang makananmu dari atas dengan cahaya yang lebih terang ya!'}
        </p>
        <div className="mt-4 inline-block bg-white border border-amber-200 text-amber-900 text-xs font-bold px-4 py-2 rounded-xl">
          Tips: Dekatkan piring makanan dan pastikan tidak ada bayangan gelap.
        </div>
      </div>
    );
  }

  // Daily target benchmarks for SMP kids (age 12-15): ~2100 kkal, ~65g protein, ~275g carbs, ~60g fat
  const caloriePercent = Math.min(100, Math.round((result.calories / 2100) * 100));
  const proteinPercent = Math.min(100, Math.round((result.protein / 65) * 100));

  return (
    <div className="bg-white rounded-3xl border border-emerald-200/90 shadow-md overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-300">
      {/* Top Banner with Food Name & Actions */}
      <div className="bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-700 text-white p-4 sm:p-6 lg:p-8">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="flex items-start sm:items-center space-x-4">
            {result.imageUrl && (
              <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl overflow-hidden bg-white/20 p-1 shrink-0 shadow-inner">
                <img
                  src={result.imageUrl}
                  alt={result.foodName}
                  className="w-full h-full object-cover rounded-xl"
                />
              </div>
            )}
            <div>
              <div className="flex items-center space-x-2">
                <span className="bg-amber-400 text-amber-950 text-xs font-black px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                  Hasil Deteksi NutriBot
                </span>
                <span className="bg-white/20 backdrop-blur-xs text-white text-xs font-bold px-2 py-0.5 rounded-full">
                  +{result.xpEarned} XP
                </span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold font-['Fredoka',sans-serif] mt-1 text-white">
                {result.foodName}
              </h2>
              <p className="text-emerald-100 text-xs sm:text-sm mt-0.5 font-medium">
                ⚖️ Perkiraan Porsi: <span className="font-bold text-white">{result.portionEstimate}</span>
              </p>
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={handleSpeak}
              className={`flex items-center space-x-1.5 px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${
                isPlayingAudio
                  ? 'bg-amber-400 text-amber-950 shadow-md ring-2 ring-white animate-pulse'
                  : 'bg-white/15 hover:bg-white/25 text-white backdrop-blur-xs'
              }`}
              title="Dengarkan pembacaan laporan ramah anak oleh NutriBot"
            >
              {isPlayingAudio ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
              <span>{isPlayingAudio ? 'Berhenti Suara' : 'Suara NutriBot'}</span>
            </button>

            <button
              onClick={handleCopyText}
              className="flex items-center space-x-1.5 px-3.5 py-2 bg-white/15 hover:bg-white/25 text-white rounded-xl text-xs font-bold backdrop-blur-xs transition-all"
              title="Salin laporan teks rapi untuk tugas sekolah atau catatan"
            >
              {copied ? <Check className="w-4 h-4 text-emerald-200" /> : <Copy className="w-4 h-4" />}
              <span>{copied ? 'Tersalin!' : 'Salin Laporan'}</span>
            </button>

            <button
              onClick={handleSave}
              disabled={isAlreadySaved}
              className={`flex items-center space-x-1.5 px-4 py-2 rounded-xl text-xs font-black shadow-md transition-all ${
                isAlreadySaved
                  ? 'bg-emerald-800/80 text-emerald-200 cursor-default'
                  : 'bg-amber-400 hover:bg-amber-300 text-amber-950 active:scale-95'
              }`}
            >
              <BookmarkCheck className="w-4 h-4" />
              <span>{isAlreadySaved ? 'Tersimpan di Buku Harian' : 'Simpan ke Buku Harian'}</span>
            </button>
          </div>
        </div>
      </div>

      <div className="p-4 sm:p-6 lg:p-8 space-y-8">
        {/* ⭐ SECTION 1: KARTU NUTRISI (PERKIRAAN) */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-base sm:text-lg font-extrabold text-slate-900 font-['Fredoka',sans-serif] flex items-center space-x-2">
              <span className="text-xl">⭐</span>
              <span>KARTU NUTRISI (Perkiraan)</span>
            </h3>
            <span className="text-xs text-slate-500 font-medium">
              Standar Kebutuhan Harian Anak SMP (~2100 kkal / hari)
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
            {/* Kalori */}
            <div className="bg-gradient-to-br from-amber-50 to-orange-50 border border-amber-200 rounded-2xl p-4 relative overflow-hidden">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-amber-800">⚡ Energi / Kalori</span>
                <span className="text-xs font-black bg-amber-200 text-amber-900 px-1.5 py-0.5 rounded-md">
                  {caloriePercent}% AKG
                </span>
              </div>
              <div className="text-2xl sm:text-3xl font-black text-amber-950 mt-1 font-['Fredoka',sans-serif]">
                {result.calories}{' '}
                <span className="text-xs font-bold text-amber-700">kkal</span>
              </div>
              <div className="w-full bg-amber-200/80 h-1.5 rounded-full overflow-hidden mt-2">
                <div
                  className="bg-amber-500 h-full rounded-full"
                  style={{ width: `${caloriePercent}%` }}
                />
              </div>
            </div>

            {/* Protein */}
            <div className="bg-gradient-to-br from-emerald-50 to-teal-50 border border-emerald-200 rounded-2xl p-4 relative overflow-hidden">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-emerald-800">💪 Protein Otot</span>
                <span className="text-xs font-black bg-emerald-200 text-emerald-900 px-1.5 py-0.5 rounded-md">
                  {proteinPercent}% AKG
                </span>
              </div>
              <div className="text-2xl sm:text-3xl font-black text-emerald-950 mt-1 font-['Fredoka',sans-serif]">
                {result.protein}{' '}
                <span className="text-xs font-bold text-emerald-700">gram</span>
              </div>
              <div className="w-full bg-emerald-200/80 h-1.5 rounded-full overflow-hidden mt-2">
                <div
                  className="bg-emerald-600 h-full rounded-full"
                  style={{ width: `${proteinPercent}%` }}
                />
              </div>
            </div>

            {/* Karbohidrat */}
            <div className="bg-gradient-to-br from-sky-50 to-blue-50 border border-blue-200 rounded-2xl p-4 relative overflow-hidden">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-blue-800">🍞 Karbohidrat</span>
                <span className="text-xs text-blue-600 font-semibold">Energi Belajar</span>
              </div>
              <div className="text-2xl sm:text-3xl font-black text-blue-950 mt-1 font-['Fredoka',sans-serif]">
                {result.carbs}{' '}
                <span className="text-xs font-bold text-blue-700">gram</span>
              </div>
              <p className="text-[11px] text-blue-600 mt-2">Bahan bakar otak konsentrasi</p>
            </div>

            {/* Lemak Sehat */}
            <div className="bg-gradient-to-br from-teal-50 to-lime-50 border border-teal-200 rounded-2xl p-4 relative overflow-hidden">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-teal-800">🥑 Lemak Sehat</span>
                <span className="text-xs text-teal-600 font-semibold">Pelindung Sel</span>
              </div>
              <div className="text-2xl sm:text-3xl font-black text-teal-950 mt-1 font-['Fredoka',sans-serif]">
                {result.fat}{' '}
                <span className="text-xs font-bold text-teal-700">gram</span>
              </div>
              <p className="text-[11px] text-teal-600 mt-2">Penyerapan vitamin A, D, E, K</p>
            </div>
          </div>

          {/* Vitamin & Mineral Utama Pills */}
          {result.mainVitaminsAndMinerals && result.mainVitaminsAndMinerals.length > 0 && (
            <div className="mt-4 p-3 bg-amber-50/60 rounded-2xl border border-amber-200/70 flex flex-wrap items-center gap-2">
              <span className="text-xs font-bold text-slate-700 flex items-center space-x-1">
                <span>🌟</span>
                <span>Vitamin & Mineral Utama:</span>
              </span>
              {result.mainVitaminsAndMinerals.map((vm, idx) => (
                <span
                  key={idx}
                  className="bg-white border border-amber-300 text-amber-900 font-bold text-xs px-2.5 py-1 rounded-full shadow-2xs"
                >
                  {vm}
                </span>
              ))}
            </div>
          )}
        </div>

        {/* 🦸‍♂️ SECTION 2: EFEK SUPER BUAT TUMBUH KEMBANGMU! */}
        <div>
          <div className="flex items-center space-x-2 mb-4">
            <span className="text-2xl">🦸‍♂️</span>
            <h3 className="text-base sm:text-lg font-extrabold text-slate-900 font-['Fredoka',sans-serif]">
              EFEK SUPER BUAT TUMBUH KEMBANGMU!
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {result.superpowerEffects.map((power, idx) => (
              <div
                key={idx}
                className="bg-gradient-to-br from-slate-50 to-emerald-50/40 border border-emerald-100 rounded-2xl p-4 hover:border-emerald-300 hover:shadow-xs transition-all"
              >
                <div className="flex items-start space-x-3">
                  <div className="w-10 h-10 rounded-xl bg-white border border-emerald-200 flex items-center justify-center shrink-0 shadow-2xs">
                    {getSuperpowerIcon(power.category)}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <h4 className="font-extrabold text-slate-900 text-sm">{power.name}</h4>
                      <span className="text-xs font-black text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full">
                        Daya {power.powerLevel}%
                      </span>
                    </div>
                    <span className="text-[11px] font-semibold text-emerald-600 block mt-0.5">
                      Zat Gizi: {power.nutrient}
                    </span>
                    <p className="text-xs text-slate-600 mt-2 leading-relaxed italic bg-white/70 p-2.5 rounded-xl border border-slate-100">
                      "{power.analogy}"
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 💡 SECTION 3: TIPS SERU DARI NUTRIBOT */}
        <div className="bg-gradient-to-r from-amber-50 to-yellow-50 border border-amber-200 rounded-2xl p-4 sm:p-5 flex items-start space-x-3.5">
          <div className="w-10 h-10 rounded-xl bg-amber-400 text-amber-950 flex items-center justify-center shrink-0 shadow-xs">
            <Lightbulb className="w-5 h-5" />
          </div>
          <div>
            <h4 className="font-extrabold text-amber-950 text-sm font-['Fredoka',sans-serif]">
              TIPS SERU DARI NUTRIBOT
            </h4>
            <p className="text-xs sm:text-sm text-amber-900 mt-1 leading-relaxed">
              {result.tipsSeru}
            </p>
          </div>
        </div>

        {/* ❓ SECTION 4: PERTANYAAN HARI INI (INTERACTIVE GAME) */}
        {result.pertanyaanHariIni && (
          <div className="bg-gradient-to-r from-indigo-50 via-purple-50 to-sky-50 border border-indigo-200 rounded-2xl p-4 sm:p-5">
            <div className="flex items-center space-x-2 text-indigo-900 font-extrabold text-sm mb-2 font-['Fredoka',sans-serif]">
              <HelpCircle className="w-5 h-5 text-indigo-600" />
              <span>PERTANYAAN HARI INI (+15 XP Bonus)</span>
            </div>
            <p className="text-sm font-bold text-slate-800">
              {result.pertanyaanHariIni}
            </p>

            {/* Quick Answer Buttons */}
            {result.quickAnswers && result.quickAnswers.length > 0 && (
              <div className="mt-3 flex flex-wrap gap-2">
                {result.quickAnswers.map((ans, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleAnswerQuestion(ans)}
                    className={`text-xs font-bold px-3.5 py-2 rounded-xl border transition-all ${
                      answeredQuestion === ans
                        ? 'bg-indigo-600 text-white border-indigo-600 shadow-xs scale-102'
                        : answeredQuestion
                        ? 'bg-white/60 text-slate-400 border-slate-200 opacity-60'
                        : 'bg-white text-indigo-700 border-indigo-200 hover:bg-indigo-50 hover:border-indigo-400'
                    }`}
                  >
                    {ans}
                  </button>
                ))}
              </div>
            )}

            {answeredQuestion && (
              <div className="mt-3 p-2.5 bg-emerald-100/80 border border-emerald-300 rounded-xl text-emerald-900 text-xs font-bold flex items-center space-x-2 animate-in fade-in">
                <Sparkles className="w-4 h-4 text-emerald-600" />
                <span>Jawabanmu tersimpan! Hebat, kamu dapat bonus +15 XP! 🎉</span>
              </div>
            )}
          </div>
        )}

        {/* Note / Disclaimer */}
        <p className="text-[11px] text-slate-400 italic text-center">
          *Estimasi nutrisi di atas dihitung dengan Google Gemini Multimodal Vision AI sebagai panduan edukasi gaya hidup sehat dan asupan gizi tumbuh kembang remaja.
        </p>
      </div>
    </div>
  );
};
