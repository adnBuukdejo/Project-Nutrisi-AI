import React from 'react';
import {
  Award,
  Sparkles,
  Lock,
  CheckCircle2,
  Flame,
  Zap,
  Star,
  ChevronRight,
  ShieldAlert
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { BADGES_LIST, LEVEL_TITLES } from '../data/mockData';
import { UserProfile } from '../types';

interface GamificationViewProps {
  profile: UserProfile;
  onClaimQuest?: (questId: string, xpReward: number) => void;
}

export const GamificationView: React.FC<GamificationViewProps> = ({
  profile,
  onClaimQuest,
}) => {
  const currentLevelInfo = LEVEL_TITLES.find((l) => l.level === profile.level) || LEVEL_TITLES[0];
  const nextLevelInfo = LEVEL_TITLES.find((l) => l.level === profile.level + 1);

  const xpCurrentLevelBase = currentLevelInfo.minXp;
  const xpNextLevelBase = nextLevelInfo ? nextLevelInfo.minXp : 2500;
  const progressPercent = Math.min(
    100,
    Math.max(0, Math.round(((profile.xp - xpCurrentLevelBase) / (xpNextLevelBase - xpCurrentLevelBase)) * 100))
  );

  const dailyQuests = [
    {
      id: 'quest-photo',
      title: 'Deteksi Menu Sehat Hari Ini',
      reward: 50,
      completed: true,
      hint: 'Ambil foto makanan bergizi',
    },
    {
      id: 'quest-water',
      title: 'Minum Minimal 6 Gelas Air Putih',
      reward: 40,
      completed: profile.waterCount >= 6,
      hint: `Tercapai ${profile.waterCount}/6 gelas`,
    },
    {
      id: 'quest-protein',
      title: 'Penuhi Target Protein Otot',
      reward: 60,
      completed: false,
      hint: 'Makan telur, tempe, ikan, atau susu',
    },
    {
      id: 'quest-veggie',
      title: 'Makan Sayuran Berwarna Hijau',
      reward: 50,
      completed: true,
      hint: 'Bayam, brokoli, kangkung, atau sawi',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Hero Level Card */}
      <div className="bg-gradient-to-r from-emerald-600 via-teal-600 to-indigo-700 rounded-3xl p-6 sm:p-8 text-white shadow-md relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-center space-x-4">
            <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-3xl bg-white/20 backdrop-blur-md flex items-center justify-center text-4xl sm:text-5xl border-2 border-white/30 shadow-inner">
              🦸‍♂️
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="bg-amber-400 text-amber-950 text-xs font-black px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                  Level {profile.level}
                </span>
                <span className="bg-white/20 text-white text-xs font-bold px-2 py-0.5 rounded-full">
                  {profile.grade}
                </span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold font-['Fredoka',sans-serif] mt-1">
                {currentLevelInfo.title}
              </h2>
              <p className="text-emerald-100 text-xs sm:text-sm mt-0.5">
                Kumpulkan XP dari deteksi makanan sehat untuk naik pangkat detektif!
              </p>
            </div>
          </div>

          {/* XP Progress Card */}
          <div className="bg-white/15 backdrop-blur-md rounded-2xl p-4 sm:p-5 border border-white/20 min-w-[240px]">
            <div className="flex items-center justify-between text-xs font-bold text-emerald-100">
              <span className="flex items-center space-x-1">
                <Sparkles className="w-4 h-4 text-amber-300" />
                <span>Total XP: {profile.xp}</span>
              </span>
              <span>
                {nextLevelInfo ? `${nextLevelInfo.minXp - profile.xp} XP lagi` : 'Level Maksimal'}
              </span>
            </div>

            <div className="w-full bg-black/20 h-3 rounded-full overflow-hidden mt-2 p-0.5">
              <div
                className="bg-gradient-to-r from-amber-400 to-emerald-400 h-full rounded-full transition-all duration-700"
                style={{ width: `${progressPercent}%` }}
              />
            </div>

            <div className="flex items-center justify-between text-[11px] text-white/80 mt-2 font-medium">
              <span>Lv {profile.level}</span>
              <span className="font-bold text-amber-300">{progressPercent}% Menuju Level {profile.level + 1}</span>
              <span>Lv {profile.level + 1}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Badges Collection Showcase */}
      <div className="bg-white rounded-3xl border border-amber-200/90 p-4 sm:p-6 lg:p-8 shadow-xs">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-lg font-extrabold text-slate-900 font-['Fredoka',sans-serif] flex items-center space-x-2">
              <Award className="w-5 h-5 text-amber-500" />
              <span>Koleksi Lencana Detektif Nutrisi</span>
            </h3>
            <p className="text-xs text-slate-500">
              Lencana kehormatan untuk anak yang disiplin menjaga gizi seimbang
            </p>
          </div>
          <span className="text-xs font-bold bg-amber-100 text-amber-900 px-3 py-1 rounded-full border border-amber-300">
            Terbuka: {profile.unlockedBadgeIds.length} dari {BADGES_LIST.length}
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {BADGES_LIST.map((badge) => {
            const isUnlocked = profile.unlockedBadgeIds.includes(badge.id);

            return (
              <div
                key={badge.id}
                className={`relative rounded-2xl p-4 border transition-all ${
                  isUnlocked
                    ? 'bg-gradient-to-br from-amber-50/60 to-emerald-50/60 border-amber-300 shadow-xs hover:-translate-y-0.5'
                    : 'bg-slate-50/60 border-slate-200 opacity-60'
                }`}
              >
                <div className="flex items-start space-x-3.5">
                  <div
                    className={`w-14 h-14 rounded-2xl flex items-center justify-center text-3xl shrink-0 shadow-xs border ${
                      isUnlocked
                        ? 'bg-white border-amber-300 ring-2 ring-amber-200'
                        : 'bg-slate-200 border-slate-300 text-slate-400 grayscale'
                    }`}
                  >
                    {isUnlocked ? badge.icon : '🔒'}
                  </div>

                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <h4 className="font-extrabold text-slate-900 text-sm">{badge.title}</h4>
                      <span className="text-[10px] font-bold text-amber-800 bg-amber-200/80 px-2 py-0.2 rounded-md">
                        +{badge.xpBonus} XP
                      </span>
                    </div>

                    <p className="text-xs text-slate-600 mt-1">{badge.description}</p>

                    <div className="mt-2.5 flex items-center justify-between text-[11px]">
                      <span className="text-slate-500">Syarat: {badge.requirement}</span>
                      {isUnlocked ? (
                        <span className="font-extrabold text-emerald-700 flex items-center space-x-1">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>Terbuka!</span>
                        </span>
                      ) : (
                        <span className="font-semibold text-slate-400 flex items-center space-x-1">
                          <Lock className="w-3 h-3" />
                          <span>Terkunci</span>
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Daily Quests Checklist */}
      <div className="bg-white rounded-3xl border border-amber-200/90 p-4 sm:p-6 lg:p-8 shadow-xs">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-lg font-extrabold text-slate-900 font-['Fredoka',sans-serif] flex items-center space-x-2">
              <Zap className="w-5 h-5 text-amber-500" />
              <span>Misi Harian Sobat Sehat</span>
            </h3>
            <p className="text-xs text-slate-500">
              Selesaikan misi harian untuk panen bonus XP dan naik level lebih cepat!
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {dailyQuests.map((quest) => (
            <div
              key={quest.id}
              className={`p-4 rounded-2xl border flex items-center justify-between gap-3 ${
                quest.completed
                  ? 'bg-emerald-50/60 border-emerald-200 text-emerald-950'
                  : 'bg-slate-50 border-slate-200 text-slate-700'
              }`}
            >
              <div className="flex items-center space-x-3">
                <div
                  className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 text-xs font-bold ${
                    quest.completed
                      ? 'bg-emerald-600 text-white'
                      : 'border-2 border-slate-300 text-slate-400'
                  }`}
                >
                  {quest.completed ? '✓' : ''}
                </div>
                <div>
                  <h4 className="font-bold text-xs sm:text-sm">{quest.title}</h4>
                  <p className="text-[11px] text-slate-500">{quest.hint}</p>
                </div>
              </div>

              <span
                className={`text-xs font-black px-2.5 py-1 rounded-xl shrink-0 ${
                  quest.completed
                    ? 'bg-emerald-200 text-emerald-900'
                    : 'bg-slate-200 text-slate-600'
                }`}
              >
                +{quest.reward} XP
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
