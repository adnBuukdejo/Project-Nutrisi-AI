import React, { useState } from 'react';
import {
  TrendingUp,
  Droplets,
  Zap,
  Target,
  Sparkles,
  Calendar,
  ChevronRight,
  Info,
  Award,
  Plus
} from 'lucide-react';
import { FoodAnalysisResult, UserProfile } from '../types';

interface NutritionChartsProps {
  diary: FoodAnalysisResult[];
  profile: UserProfile;
  onAddWater: () => void;
}

export const NutritionCharts: React.FC<NutritionChartsProps> = ({
  diary,
  profile,
  onAddWater,
}) => {
  // Aggregate today's nutrients from diary
  const totalCalories = diary.reduce((sum, item) => sum + (item.calories || 0), 0);
  const totalProtein = diary.reduce((sum, item) => sum + (item.protein || 0), 0);
  const totalCarbs = diary.reduce((sum, item) => sum + (item.carbs || 0), 0);
  const totalFat = diary.reduce((sum, item) => sum + (item.fat || 0), 0);

  // Benchmarks for Kelas 8 SMP (Age 13-15) based on Kemenkes AKG
  const TARGET_CALORIES = 2100;
  const TARGET_PROTEIN = 65;
  const TARGET_CARBS = 275;
  const TARGET_FAT = 60;
  const TARGET_WATER = 8;

  const calPercent = Math.min(100, Math.round((totalCalories / TARGET_CALORIES) * 100));
  const proteinPercent = Math.min(100, Math.round((totalProtein / TARGET_PROTEIN) * 100));
  const carbsPercent = Math.min(100, Math.round((totalCarbs / TARGET_CARBS) * 100));
  const fatPercent = Math.min(100, Math.round((totalFat / TARGET_FAT) * 100));
  const waterPercent = Math.min(100, Math.round((profile.waterCount / TARGET_WATER) * 100));

  // Weekly data simulation (Senin - Minggu)
  const weeklyData = [
    { day: 'Sen', cal: 1980, protein: 62, score: 90 },
    { day: 'Sel', cal: 2150, protein: 68, score: 95 },
    { day: 'Rab', cal: 1890, protein: 58, score: 85 },
    { day: 'Kam', cal: 2040, protein: 64, score: 92 },
    { day: 'Jum', cal: 1950, protein: 60, score: 88 },
    { day: 'Sab', cal: 2200, protein: 70, score: 96 },
    { day: 'Hari Ini', cal: totalCalories, protein: totalProtein, score: 94, isCurrent: true },
  ];

  return (
    <div className="space-y-6">
      {/* Overview Banner */}
      <div className="bg-gradient-to-r from-teal-600 via-emerald-600 to-amber-500 rounded-3xl p-6 sm:p-8 text-white shadow-md relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="flex items-center space-x-2">
              <span className="bg-white/20 backdrop-blur-xs text-xs font-bold px-2.5 py-0.5 rounded-full">
                Monitoring Gizi Anak
              </span>
              <span className="text-xs text-emerald-100 font-medium">
                Kategori: Remaja SMP (12-15 Tahun)
              </span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold font-['Fredoka',sans-serif] mt-1">
              Grafik Tumbuh Kembang Harian
            </h2>
            <p className="text-emerald-100 text-xs sm:text-sm max-w-xl mt-1">
              Pantau asupan energi, pertumbuhan tinggi badan lewat kalsium/protein, dan perisai imun harianmu agar selalu bugar berprestasi di sekolah!
            </p>
          </div>

          {/* Quick Score Badge */}
          <div className="bg-white/15 backdrop-blur-md rounded-2xl p-4 border border-white/20 text-center min-w-[140px]">
            <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-200">
              Skor Nutrisi Hari Ini
            </span>
            <div className="text-3xl font-black font-['Fredoka',sans-serif] text-white mt-0.5">
              {proteinPercent >= 80 ? '94' : '82'} <span className="text-xs font-bold text-amber-300">/ 100</span>
            </div>
            <span className="text-[11px] font-semibold text-emerald-100 mt-1 block">
              {proteinPercent >= 80 ? '🏆 Gizi Sangat Seimbang' : '🚀 Terus Lengkapi Porsi'}
            </span>
          </div>
        </div>
      </div>

      {/* Target Progress Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Kalori */}
        <div className="bg-white rounded-2xl border border-amber-200 p-4 shadow-xs">
          <div className="flex items-center justify-between text-xs font-bold text-amber-800">
            <span>⚡ Kalori Harian</span>
            <span>{calPercent}%</span>
          </div>
          <div className="mt-2 text-2xl font-black text-slate-900 font-['Fredoka',sans-serif]">
            {totalCalories} <span className="text-xs font-bold text-slate-400">/ {TARGET_CALORIES} kkal</span>
          </div>
          <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden mt-3">
            <div
              className="bg-amber-500 h-full rounded-full transition-all duration-700"
              style={{ width: `${calPercent}%` }}
            />
          </div>
          <p className="text-[11px] text-slate-500 mt-2">
            Tersisa {Math.max(0, TARGET_CALORIES - totalCalories)} kkal untuk porsi hari ini
          </p>
        </div>

        {/* Protein Otot & Tinggi */}
        <div className="bg-white rounded-2xl border border-emerald-200 p-4 shadow-xs">
          <div className="flex items-center justify-between text-xs font-bold text-emerald-800">
            <span>💪 Protein Otot</span>
            <span>{proteinPercent}%</span>
          </div>
          <div className="mt-2 text-2xl font-black text-slate-900 font-['Fredoka',sans-serif]">
            {totalProtein} <span className="text-xs font-bold text-slate-400">/ {TARGET_PROTEIN} gram</span>
          </div>
          <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden mt-3">
            <div
              className="bg-emerald-600 h-full rounded-full transition-all duration-700"
              style={{ width: `${proteinPercent}%` }}
            />
          </div>
          <p className="text-[11px] text-slate-500 mt-2">
            Pondasi utama pemanjangan tulang & otot anak
          </p>
        </div>

        {/* Karbohidrat */}
        <div className="bg-white rounded-2xl border border-blue-200 p-4 shadow-xs">
          <div className="flex items-center justify-between text-xs font-bold text-blue-800">
            <span>🍞 Karbohidrat</span>
            <span>{carbsPercent}%</span>
          </div>
          <div className="mt-2 text-2xl font-black text-slate-900 font-['Fredoka',sans-serif]">
            {totalCarbs} <span className="text-xs font-bold text-slate-400">/ {TARGET_CARBS} gram</span>
          </div>
          <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden mt-3">
            <div
              className="bg-blue-500 h-full rounded-full transition-all duration-700"
              style={{ width: `${carbsPercent}%` }}
            />
          </div>
          <p className="text-[11px] text-slate-500 mt-2">
            Energi konsentrasi belajar & olahraga
          </p>
        </div>

        {/* Hidrasi Air Putih */}
        <div className="bg-white rounded-2xl border border-cyan-200 p-4 shadow-xs">
          <div className="flex items-center justify-between text-xs font-bold text-cyan-800">
            <span>💧 Hidrasi Air Putih</span>
            <span>{waterPercent}%</span>
          </div>
          <div className="mt-2 text-2xl font-black text-slate-900 font-['Fredoka',sans-serif]">
            {profile.waterCount} <span className="text-xs font-bold text-slate-400">/ {TARGET_WATER} Gelas</span>
          </div>
          <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden mt-3">
            <div
              className="bg-cyan-500 h-full rounded-full transition-all duration-700"
              style={{ width: `${waterPercent}%` }}
            />
          </div>
          <button
            onClick={onAddWater}
            className="mt-2 w-full py-1 bg-cyan-50 hover:bg-cyan-100 text-cyan-700 border border-cyan-200 rounded-lg text-xs font-bold flex items-center justify-center space-x-1 active:scale-95 transition-all"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Tambah Minum 1 Gelas</span>
          </button>
        </div>
      </div>

      {/* Weekly Nutrition Trend Chart */}
      <div className="bg-white rounded-3xl border border-amber-200/90 p-4 sm:p-6 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-6">
          <div>
            <h3 className="text-lg font-extrabold text-slate-900 font-['Fredoka',sans-serif] flex items-center space-x-2">
              <TrendingUp className="w-5 h-5 text-emerald-600" />
              <span>Grafik Asupan Nutrisi Mingguan</span>
            </h3>
            <p className="text-xs text-slate-500">
              Evaluasi keteraturan gizi selama 7 hari terakhir
            </p>
          </div>
          <div className="flex items-center space-x-3 text-xs font-bold text-slate-600">
            <span className="flex items-center space-x-1">
              <span className="w-3 h-3 bg-emerald-500 rounded-xs" />
              <span>Kalori</span>
            </span>
            <span className="flex items-center space-x-1">
              <span className="w-3 h-3 bg-amber-400 rounded-xs" />
              <span>Protein</span>
            </span>
          </div>
        </div>

        {/* Visual Bar Chart */}
        <div className="grid grid-cols-7 gap-2 sm:gap-4 items-end h-48 pt-6 pb-2 border-b border-slate-100">
          {weeklyData.map((d, idx) => {
            const calHeight = Math.min(100, Math.round((d.cal / TARGET_CALORIES) * 100));
            const proHeight = Math.min(100, Math.round((d.protein / TARGET_PROTEIN) * 100));

            return (
              <div key={idx} className="flex flex-col items-center h-full justify-end group">
                <div className="w-full flex justify-center items-end space-x-1 sm:space-x-1.5 h-full">
                  {/* Calorie Bar */}
                  <div
                    className={`w-3 sm:w-5 rounded-t-lg transition-all duration-500 group-hover:brightness-95 ${
                      d.isCurrent ? 'bg-emerald-600 ring-2 ring-emerald-300' : 'bg-emerald-400'
                    }`}
                    style={{ height: `${Math.max(10, calHeight)}%` }}
                    title={`Kalori: ${d.cal} kkal`}
                  />
                  {/* Protein Bar */}
                  <div
                    className={`w-3 sm:w-5 rounded-t-lg transition-all duration-500 group-hover:brightness-95 ${
                      d.isCurrent ? 'bg-amber-500 ring-2 ring-amber-300' : 'bg-amber-400'
                    }`}
                    style={{ height: `${Math.max(10, proHeight)}%` }}
                    title={`Protein: ${d.protein} gram`}
                  />
                </div>
                <span
                  className={`text-[11px] font-bold mt-2 ${
                    d.isCurrent ? 'text-emerald-700 font-extrabold' : 'text-slate-500'
                  }`}
                >
                  {d.day}
                </span>
                <span className="text-[10px] text-slate-400 hidden sm:block">
                  {d.cal} kkal
                </span>
              </div>
            );
          })}
        </div>

        <div className="mt-4 p-3 bg-emerald-50 rounded-2xl flex items-center justify-between text-xs text-emerald-900">
          <div className="flex items-center space-x-2">
            <Sparkles className="w-4 h-4 text-emerald-600" />
            <span className="font-semibold">
              Keren! Konsistensi asupan proteinmu minggu ini rata-rata sudah di atas 90% dari target anak SMP.
            </span>
          </div>
          <span className="font-black text-emerald-700 hidden sm:inline">+50 XP Bonus Konsistensi</span>
        </div>
      </div>

      {/* Edukasi Gizi Anak Kelas 8 SMP */}
      <div className="bg-amber-50/60 rounded-3xl border border-amber-200 p-4 sm:p-6">
        <h4 className="font-extrabold text-slate-900 text-sm sm:text-base font-['Fredoka',sans-serif] flex items-center space-x-2">
          <span>📚</span>
          <span>Kenapa Nutrisi Seimbang Penting Saat Kelas 8 SMP?</span>
        </h4>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 mt-3">
          <div className="bg-white p-3.5 rounded-2xl border border-amber-200/80 shadow-2xs">
            <span className="text-xl">🚀</span>
            <h5 className="font-bold text-slate-900 text-xs sm:text-sm mt-1">Growth Spurt (Pacu Tumbuh)</h5>
            <p className="text-xs text-slate-600 mt-1">
              Usia 12-15 tahun adalah masa puncak pertumbuhan tinggi badan. Kalsium dan protein sangat krusial agar tulang tumbuh optimal.
            </p>
          </div>
          <div className="bg-white p-3.5 rounded-2xl border border-amber-200/80 shadow-2xs">
            <span className="text-xl">🧠</span>
            <h5 className="font-bold text-slate-900 text-xs sm:text-sm mt-1">Daya Pikir & Konsentrasi</h5>
            <p className="text-xs text-slate-600 mt-1">
              Otak membutuhkan pasokan glukosa stabil dan zat besi agar tidak mengantuk serta mudah memahami materi pelajaran sekolah.
            </p>
          </div>
          <div className="bg-white p-3.5 rounded-2xl border border-amber-200/80 shadow-2xs">
            <span className="text-xl">🛡️</span>
            <h5 className="font-bold text-slate-900 text-xs sm:text-sm mt-1">Daya Tahan Aktivitas</h5>
            <p className="text-xs text-slate-600 mt-1">
              Banyaknya kegiatan ekstrakurikuler, olahraga, dan belajar kelompok memerlukan vitamin C, zinc, dan hidrasi yang cukup.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
