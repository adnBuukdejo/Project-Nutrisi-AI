import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import { Navbar } from './components/Navbar';
import { FoodScanner } from './components/FoodScanner';
import { AnalysisResultView } from './components/AnalysisResultView';
import { NutritionCharts } from './components/NutritionCharts';
import { FoodDiary } from './components/FoodDiary';
import { GamificationView } from './components/GamificationView';
import { AskNutriBotChat } from './components/AskNutriBotChat';
import { ProjectDocsView } from './components/ProjectDocsView';
import { INITIAL_FOOD_HISTORY, INITIAL_USER_PROFILE, LEVEL_TITLES, BADGES_LIST } from './data/mockData';
import { FoodAnalysisResult, UserProfile } from './types';
import { Camera, Sparkles, HeartHandshake, CheckCircle } from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState<string>('scan');
  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);
  const [currentAnalysis, setCurrentAnalysis] = useState<FoodAnalysisResult | null>(INITIAL_FOOD_HISTORY[0]);

  // Load profile from localStorage or fallback
  const [profile, setProfile] = useState<UserProfile>(() => {
    try {
      const saved = localStorage.getItem('nutribot_profile');
      return saved ? JSON.parse(saved) : INITIAL_USER_PROFILE;
    } catch {
      return INITIAL_USER_PROFILE;
    }
  });

  // Load diary from localStorage or fallback
  const [diary, setDiary] = useState<FoodAnalysisResult[]>(() => {
    try {
      const saved = localStorage.getItem('nutribot_diary');
      return saved ? JSON.parse(saved) : INITIAL_FOOD_HISTORY;
    } catch {
      return INITIAL_FOOD_HISTORY;
    }
  });

  // Toast notification state
  const [notification, setNotification] = useState<{ title: string; desc: string } | null>(null);

  // Save to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('nutribot_profile', JSON.stringify(profile));
    } catch (e) {
      console.warn('Could not save profile to localStorage', e);
    }
  }, [profile]);

  useEffect(() => {
    try {
      localStorage.setItem('nutribot_diary', JSON.stringify(diary));
    } catch (e) {
      console.warn('Could not save diary to localStorage', e);
    }
  }, [diary]);

  const showNotification = (title: string, desc: string) => {
    setNotification({ title, desc });
    setTimeout(() => {
      setNotification(null);
    }, 4000);
  };

  const handleAddXp = (amount: number, reason = 'Aktivitas Sehat') => {
    setProfile((prev) => {
      const newXp = prev.xp + amount;
      let newLevel = prev.level;

      // Check level upgrades
      for (const lvl of LEVEL_TITLES) {
        if (newXp >= lvl.minXp) {
          newLevel = Math.max(newLevel, lvl.level);
        }
      }

      if (newLevel > prev.level) {
        confetti({
          particleCount: 120,
          spread: 80,
          origin: { y: 0.6 },
        });
        showNotification(
          `🎉 NAIK LEVEL ${newLevel}!`,
          `Selamat! Pangkatmu naik menjadi ${LEVEL_TITLES.find((l) => l.level === newLevel)?.title}!`
        );
      } else {
        showNotification(`+${amount} XP Didapat!`, reason);
      }

      return {
        ...prev,
        xp: newXp,
        level: newLevel,
      };
    });
  };

  const handleAddWater = () => {
    setProfile((prev) => {
      const newCount = Math.min(12, prev.waterCount + 1);
      const unlocked = [...prev.unlockedBadgeIds];

      if (newCount >= 6 && !unlocked.includes('badge-water-champion')) {
        unlocked.push('badge-water-champion');
        showNotification('🏆 Lencana Baru Terbuka!', 'Kamu meraih lencana "Penguasa Hidrasi"!');
      }

      return {
        ...prev,
        waterCount: newCount,
        unlockedBadgeIds: unlocked,
      };
    });

    handleAddXp(10, 'Minum 1 Gelas Air Putih 💧');
    confetti({
      particleCount: 30,
      spread: 45,
      origin: { y: 0.8 },
      colors: ['#06B6D4', '#3B82F6', '#60A5FA'],
    });
  };

  const handleAnalysisComplete = (result: FoodAnalysisResult) => {
    setCurrentAnalysis(result);
    setActiveTab('scan');

    if (result.isFood) {
      const xp = result.xpEarned || 80;
      handleAddXp(xp, `Analisis gizi: ${result.foodName}`);

      // Check and unlock badges
      setProfile((prev) => {
        const unlocked = [...prev.unlockedBadgeIds];

        if (!unlocked.includes('badge-first-scan')) {
          unlocked.push('badge-first-scan');
          showNotification('🏆 Lencana Baru!', 'Lencana "Detektif Pemula" berhasil dibuka!');
        }

        // Check if veggie or fruit
        const lower = result.foodName.toLowerCase();
        if ((lower.includes('bayam') || lower.includes('sayur') || lower.includes('brokoli')) && !unlocked.includes('badge-veggie-hero')) {
          unlocked.push('badge-veggie-hero');
          showNotification('🥦 Lencana Baru!', 'Lencana "Penakluk Sayur Hijau" berhasil dibuka!');
        }

        if ((lower.includes('pisang') || lower.includes('apel') || lower.includes('buah')) && !unlocked.includes('badge-fruit-master')) {
          unlocked.push('badge-fruit-master');
          showNotification('🍎 Lencana Baru!', 'Lencana "Master Buah Segar" berhasil dibuka!');
        }

        return {
          ...prev,
          unlockedBadgeIds: unlocked,
        };
      });

      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
      });
    }
  };

  const handleSaveToDiary = (item: FoodAnalysisResult) => {
    // Check if already exists in diary
    const alreadySaved = diary.some((d) => d.id === item.id);
    if (alreadySaved) return;

    setDiary((prev) => [item, ...prev]);
    handleAddXp(30, 'Menyimpan menu ke Buku Harian Makanan 📖');
    showNotification('✅ Tersimpan di Buku Harian!', `${item.foodName} berhasil dicatat.`);
  };

  const handleDeleteDiaryEntry = (id: string) => {
    setDiary((prev) => prev.filter((d) => d.id !== id));
    showNotification('Dihapus', 'Menu telah dihapus dari buku harian.');
  };

  const isCurrentAnalysisSaved = Boolean(
    currentAnalysis && diary.some((d) => d.id === currentAnalysis.id)
  );

  return (
    <div className="min-h-screen flex flex-col bg-amber-50/40 text-slate-800">
      {/* Toast Notification */}
      {notification && (
        <div className="fixed top-20 right-4 z-50 bg-slate-900 text-white px-4 py-3 rounded-2xl shadow-xl flex items-center space-x-3 border border-emerald-400 animate-in slide-in-from-top-4 duration-300">
          <Sparkles className="w-5 h-5 text-amber-400 shrink-0" />
          <div>
            <div className="text-xs font-black text-amber-300 uppercase tracking-wide">
              {notification.title}
            </div>
            <div className="text-xs text-slate-200 mt-0.5">{notification.desc}</div>
          </div>
        </div>
      )}

      {/* Main Navigation Header */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        profile={profile}
        onAddWater={handleAddWater}
        onOpenQuickScan={() => {
          setActiveTab('scan');
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
      />

      {/* Main Workspace Body */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-6">
        {activeTab === 'scan' && (
          <div className="space-y-6">
            {/* Camera / Upload Section */}
            <FoodScanner
              onAnalysisComplete={handleAnalysisComplete}
              isAnalyzing={isAnalyzing}
              setIsAnalyzing={setIsAnalyzing}
            />

            {/* Analysis Result Showcase */}
            {currentAnalysis && (
              <AnalysisResultView
                result={currentAnalysis}
                onSaveToDiary={handleSaveToDiary}
                isAlreadySaved={isCurrentAnalysisSaved}
                onAddXp={handleAddXp}
              />
            )}
          </div>
        )}

        {activeTab === 'charts' && (
          <NutritionCharts
            diary={diary}
            profile={profile}
            onAddWater={handleAddWater}
          />
        )}

        {activeTab === 'diary' && (
          <FoodDiary
            diary={diary}
            onDeleteEntry={handleDeleteDiaryEntry}
            onSelectEntry={(entry) => {
              setCurrentAnalysis(entry);
              setActiveTab('scan');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
          />
        )}

        {activeTab === 'badges' && (
          <GamificationView profile={profile} />
        )}

        {activeTab === 'chat' && (
          <AskNutriBotChat currentFoodContext={currentAnalysis} />
        )}

        {activeTab === 'docs' && (
          <ProjectDocsView />
        )}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-amber-200/80 py-8 px-4 text-center mt-12">
        <div className="max-w-4xl mx-auto space-y-3">
          <div className="flex items-center justify-center space-x-2">
            <span className="text-xl">🤖</span>
            <span className="font-extrabold text-slate-900 font-['Fredoka',sans-serif] text-base">
              NutriBot - Detektif Nutrisi & Sahabat Tumbuh Kembang
            </span>
          </div>
          <p className="text-xs text-slate-500 max-w-xl mx-auto leading-relaxed">
            Proyek Sistem Informasi Kesehatan Siswa Kelas 8 SMP. Ditenagai oleh Google Gemini Multimodal Vision AI untuk menganalisis piring makanan, edukasi gizi dengan analogi superpower, dan pemantauan tumbuh kembang ceria.
          </p>
          <div className="flex items-center justify-center space-x-4 text-xs font-bold text-emerald-700 pt-2">
            <button onClick={() => setActiveTab('scan')} className="hover:underline">Detektif Kamera</button>
            <span>•</span>
            <button onClick={() => setActiveTab('charts')} className="hover:underline">Grafik Tumbuh Kembang</button>
            <span>•</span>
            <button onClick={() => setActiveTab('badges')} className="hover:underline">Pahlawan Nutrisi</button>
            <span>•</span>
            <button onClick={() => setActiveTab('docs')} className="hover:underline">Dokumentasi Proyek</button>
          </div>
        </div>
      </footer>
    </div>
  );
}
