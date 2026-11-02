import React, { useState } from 'react';
import {
  BookOpen,
  Trash2,
  Share2,
  Calendar,
  Clock,
  Sparkles,
  Zap,
  Download,
  Eye,
  CheckCircle,
  FileText
} from 'lucide-react';
import { FoodAnalysisResult } from '../types';

interface FoodDiaryProps {
  diary: FoodAnalysisResult[];
  onDeleteEntry: (id: string) => void;
  onSelectEntry: (entry: FoodAnalysisResult) => void;
}

export const FoodDiary: React.FC<FoodDiaryProps> = ({
  diary,
  onDeleteEntry,
  onSelectEntry,
}) => {
  const [copiedSummary, setCopiedSummary] = useState(false);

  const totalCalories = diary.reduce((sum, item) => sum + (item.calories || 0), 0);
  const totalProtein = diary.reduce((sum, item) => sum + (item.protein || 0), 0);
  const totalCarbs = diary.reduce((sum, item) => sum + (item.carbs || 0), 0);

  const handleExportSummary = () => {
    let report = `📋 BUKU HARIAN MAKANAN & NUTRISI SISWA\nTanggal: ${new Date().toLocaleDateString('id-ID', { dateStyle: 'full' })}\n`;
    report += `Total Asupan: ${totalCalories} kkal | Protein: ${totalProtein}g | Karbohidrat: ${totalCarbs}g\n\n`;
    report += `Daftar Menu yang Dikonsumsi:\n`;

    diary.forEach((item, idx) => {
      report += `${idx + 1}. [${item.timestamp || 'Hari ini'}] ${item.foodName} (${item.portionEstimate})\n`;
      report += `   - Energi: ${item.calories} kkal, Protein: ${item.protein}g, Karbo: ${item.carbs}g, Lemak: ${item.fat}g\n`;
      report += `   - Tips NutriBot: ${item.tipsSeru}\n\n`;
    });

    navigator.clipboard.writeText(report);
    setCopiedSummary(true);
    setTimeout(() => setCopiedSummary(false), 2500);
  };

  return (
    <div className="bg-white rounded-3xl border border-amber-200/90 shadow-sm p-4 sm:p-6 lg:p-8 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
        <div>
          <div className="flex items-center space-x-2">
            <BookOpen className="w-6 h-6 text-emerald-600" />
            <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 font-['Fredoka',sans-serif]">
              Buku Harian Makanan & Nutrisi
            </h2>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Riwayat foto makanan yang telah kamu deteksi dengan NutriBot hari ini.
          </p>
        </div>

        {diary.length > 0 && (
          <button
            onClick={handleExportSummary}
            className="flex items-center space-x-2 px-4 py-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-300 rounded-xl text-xs font-bold transition-all active:scale-95 self-start sm:self-auto"
            title="Salin rangkuman teks untuk tugas sekolah"
          >
            {copiedSummary ? <CheckCircle className="w-4 h-4 text-emerald-600" /> : <FileText className="w-4 h-4" />}
            <span>{copiedSummary ? 'Rangkuman Tersalin!' : 'Ekspor Laporan Tugas'}</span>
          </button>
        )}
      </div>

      {/* Summary Stats Pill */}
      {diary.length > 0 && (
        <div className="bg-gradient-to-r from-emerald-50 via-amber-50 to-teal-50 border border-emerald-200 p-4 rounded-2xl flex flex-wrap items-center justify-between gap-4 text-xs">
          <div className="flex items-center space-x-6">
            <div>
              <span className="text-slate-500 font-medium">Menu Tercatat:</span>
              <span className="font-extrabold text-slate-900 ml-1.5">{diary.length} Porsi</span>
            </div>
            <div>
              <span className="text-slate-500 font-medium">Total Kalori:</span>
              <span className="font-extrabold text-amber-800 ml-1.5">{totalCalories} kkal</span>
            </div>
            <div>
              <span className="text-slate-500 font-medium">Total Protein:</span>
              <span className="font-extrabold text-emerald-800 ml-1.5">{totalProtein} gram</span>
            </div>
          </div>
          <span className="text-emerald-700 font-bold bg-white/80 px-2.5 py-1 rounded-full border border-emerald-200">
            ✅ Aktif Dipantau NutriBot
          </span>
        </div>
      )}

      {/* Diary List */}
      {diary.length === 0 ? (
        <div className="py-12 text-center bg-amber-50/50 rounded-2xl border border-dashed border-amber-300">
          <div className="text-4xl mb-2">🍽️</div>
          <h3 className="font-extrabold text-slate-900 text-base font-['Fredoka',sans-serif]">
            Belum Ada Makanan Tercatat Hari Ini
          </h3>
          <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
            Yuk ambil foto sarapan, buah, atau bekal makan siangmu lewat Detektif Kamera di atas!
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {diary.map((item, index) => (
            <div
              key={item.id || index}
              className="bg-amber-50/30 hover:bg-amber-50/70 border border-amber-200/80 rounded-2xl p-4 transition-all hover:shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4 group"
            >
              <div className="flex items-start sm:items-center space-x-4">
                {item.imageUrl ? (
                  <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-xl overflow-hidden bg-slate-200 shrink-0 border border-amber-300 shadow-2xs">
                    <img
                      src={item.imageUrl}
                      alt={item.foodName}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                    />
                  </div>
                ) : (
                  <div className="w-16 h-16 rounded-xl bg-emerald-100 text-2xl flex items-center justify-center shrink-0">
                    🍲
                  </div>
                )}

                <div>
                  <div className="flex items-center space-x-2">
                    <span className="text-xs font-bold text-slate-500 flex items-center space-x-1">
                      <Clock className="w-3.5 h-3.5" />
                      <span>{item.timestamp || 'Hari ini'}</span>
                    </span>
                    <span className="text-[11px] font-bold bg-emerald-100 text-emerald-800 px-2 py-0.2 rounded-full">
                      +{item.xpEarned} XP
                    </span>
                  </div>

                  <h3 className="font-extrabold text-slate-900 text-base font-['Fredoka',sans-serif] mt-0.5">
                    {item.foodName}
                  </h3>
                  <p className="text-xs text-slate-500">
                    Porsi: <span className="font-medium text-slate-700">{item.portionEstimate}</span>
                  </p>

                  {/* Nutrients Pills */}
                  <div className="flex flex-wrap items-center gap-2 mt-2">
                    <span className="bg-amber-100 text-amber-900 text-xs font-bold px-2 py-0.5 rounded-md">
                      ⚡ {item.calories} kkal
                    </span>
                    <span className="bg-emerald-100 text-emerald-900 text-xs font-bold px-2 py-0.5 rounded-md">
                      💪 {item.protein}g Protein
                    </span>
                    <span className="bg-blue-100 text-blue-900 text-xs font-bold px-2 py-0.5 rounded-md">
                      🍞 {item.carbs}g Karbo
                    </span>
                    <span className="bg-teal-100 text-teal-900 text-xs font-bold px-2 py-0.5 rounded-md">
                      🥑 {item.fat}g Lemak
                    </span>
                  </div>
                </div>
              </div>

              {/* Action buttons */}
              <div className="flex items-center space-x-2 self-end md:self-auto shrink-0 pt-2 md:pt-0 border-t md:border-0 border-slate-100 w-full md:w-auto justify-end">
                <button
                  onClick={() => onSelectEntry(item)}
                  className="flex items-center space-x-1 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition-all shadow-xs"
                >
                  <Eye className="w-3.5 h-3.5" />
                  <span>Lihat Detail</span>
                </button>
                <button
                  onClick={() => item.id && onDeleteEntry(item.id)}
                  className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-all"
                  title="Hapus dari buku harian"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
