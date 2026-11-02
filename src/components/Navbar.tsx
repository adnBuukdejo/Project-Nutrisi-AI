import React from 'react';
import { Camera, BarChart3, BookOpen, Award, MessageCircleQuestion, Sparkles, Droplets, Flame, Cpu } from 'lucide-react';
import { UserProfile } from '../types';
import { LEVEL_TITLES } from '../data/mockData';

interface NavbarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  profile: UserProfile;
  onAddWater: () => void;
  onOpenQuickScan: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  profile,
  onAddWater,
  onOpenQuickScan,
}) => {
  const currentLevelInfo = LEVEL_TITLES.find((l) => l.level === profile.level) || LEVEL_TITLES[0];
  const nextLevelInfo = LEVEL_TITLES.find((l) => l.level === profile.level + 1);
  const xpCurrentLevelBase = currentLevelInfo.minXp;
  const xpNextLevelBase = nextLevelInfo ? nextLevelInfo.minXp : 2500;
  const progressPercent = Math.min(
    100,
    Math.max(0, Math.round(((profile.xp - xpCurrentLevelBase) / (xpNextLevelBase - xpCurrentLevelBase)) * 100))
  );

  const navItems = [
    { id: 'scan', label: 'Detektif Kamera', icon: Camera, badge: 'AI Vision' },
    { id: 'charts', label: 'Grafik Tumbuh Kembang', icon: BarChart3 },
    { id: 'diary', label: 'Buku Harian', icon: BookOpen },
    { id: 'badges', label: 'Pahlawan Nutrisi', icon: Award, count: `${profile.unlockedBadgeIds.length}/6` },
    { id: 'chat', label: 'Tanya NutriBot', icon: MessageCircleQuestion },
    { id: 'docs', label: 'Info Proyek SMP', icon: Cpu },
  ];

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-amber-200/80 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-18">
          {/* Logo & Brand */}
          <div className="flex items-center space-x-3 cursor-pointer" onClick={() => setActiveTab('scan')}>
            <div className="relative w-11 h-11 bg-gradient-to-tr from-emerald-500 via-teal-500 to-amber-400 rounded-2xl flex items-center justify-center shadow-md shadow-emerald-500/20 ring-2 ring-emerald-300">
              <span className="text-2xl select-none animate-bounce" style={{ animationDuration: '3s' }}>
                🤖
              </span>
              <div className="absolute -bottom-1 -right-1 bg-amber-400 text-amber-950 text-[10px] font-black px-1.5 py-0.5 rounded-full ring-2 ring-white">
                AI
              </div>
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="text-xl font-extrabold tracking-tight text-slate-900 font-['Fredoka',sans-serif]">
                  Nutri<span className="text-emerald-600">Bot</span>
                </span>
                <span className="text-[11px] font-bold bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full border border-emerald-300">
                  Kelas 8 SMP
                </span>
              </div>
              <p className="text-xs text-slate-500 font-medium hidden sm:block">
                Detektif Nutrisi & Sahabat Tumbuh Kembang 🚀
              </p>
            </div>
          </div>

          {/* Gamification Stats: Water, Streak & XP */}
          <div className="flex items-center space-x-2 sm:space-x-3">
            {/* Water Tracker Widget */}
            <button
              onClick={onAddWater}
              title="Klik untuk tambah minum 1 gelas air (target 8 gelas)"
              className="group flex items-center space-x-1.5 bg-blue-50 hover:bg-blue-100 text-blue-700 px-2.5 py-1.5 rounded-xl border border-blue-200 transition-all text-xs font-bold active:scale-95"
            >
              <Droplets className="w-4 h-4 text-blue-500 group-hover:scale-110 transition-transform" />
              <span>{profile.waterCount}/8 Gelas</span>
              <span className="text-blue-400 text-[10px] hidden md:inline">+1</span>
            </button>

            {/* Streak Counter */}
            <div
              className="flex items-center space-x-1 bg-orange-50 text-orange-700 px-2.5 py-1.5 rounded-xl border border-orange-200 text-xs font-bold"
              title="Streak 3 hari berturut-turut!"
            >
              <Flame className="w-4 h-4 text-orange-500 fill-orange-500 animate-pulse" />
              <span>{profile.streakDays} Hari</span>
            </div>

            {/* Level & XP Capsule */}
            <div
              onClick={() => setActiveTab('badges')}
              className="cursor-pointer flex items-center space-x-2 bg-gradient-to-r from-amber-50 to-emerald-50 border border-emerald-200 px-3 py-1.5 rounded-xl hover:shadow-xs transition-all"
            >
              <div className="w-7 h-7 rounded-lg bg-emerald-500 text-white font-extrabold flex items-center justify-center text-xs shadow-xs">
                L{profile.level}
              </div>
              <div className="hidden lg:block text-left">
                <div className="flex items-center space-x-1 text-xs font-bold text-slate-800">
                  <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                  <span>{profile.xp} XP</span>
                </div>
                <div className="w-20 bg-slate-200 h-1.5 rounded-full overflow-hidden mt-0.5">
                  <div
                    className="bg-emerald-500 h-full rounded-full transition-all duration-500"
                    style={{ width: `${progressPercent}%` }}
                  />
                </div>
              </div>
            </div>

            {/* Primary Action Button */}
            <button
              onClick={onOpenQuickScan}
              className="hidden sm:inline-flex items-center space-x-1.5 bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white text-xs sm:text-sm font-bold px-3.5 py-2 rounded-xl shadow-md shadow-emerald-600/20 transition-all"
            >
              <Camera className="w-4 h-4" />
              <span>Foto Makanan</span>
            </button>
          </div>
        </div>

        {/* Tab Navigation Navigation Bar */}
        <div className="flex items-center space-x-1 overflow-x-auto py-2 no-scrollbar border-t border-slate-100">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`flex items-center space-x-2 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-bold whitespace-nowrap transition-all ${
                  isActive
                    ? 'bg-emerald-600 text-white shadow-xs shadow-emerald-600/30'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-amber-100/60'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-500'}`} />
                <span>{item.label}</span>
                {item.badge && (
                  <span
                    className={`text-[10px] px-1.5 py-0.2 rounded-full font-black uppercase ${
                      isActive ? 'bg-emerald-500 text-white' : 'bg-emerald-100 text-emerald-800'
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
                {item.count && (
                  <span
                    className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${
                      isActive ? 'bg-emerald-700 text-emerald-100' : 'bg-slate-100 text-slate-600'
                    }`}
                  >
                    {item.count}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>
    </header>
  );
};
