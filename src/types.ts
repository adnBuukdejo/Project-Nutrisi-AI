export interface SuperpowerEffect {
  category: 'tinggi_badan' | 'kekuatan_otot' | 'kecerdasan_otak' | 'imun_tubuh' | 'energi_harian' | string;
  name: string;
  nutrient: string;
  analogy: string;
  powerLevel: number; // 1-100
}

export interface FoodAnalysisResult {
  id?: string;
  timestamp?: string;
  imageUrl?: string;
  isFood: boolean;
  foodName: string;
  portionEstimate: string;
  calories: number;
  carbs: number;
  protein: number;
  fat: number;
  fiber?: number;
  healthScore?: number;
  mainVitaminsAndMinerals: string[];
  superpowerEffects: SuperpowerEffect[];
  tipsSeru: string;
  pertanyaanHariIni: string;
  quickAnswers?: string[];
  xpEarned: number;
  formattedReport: string;
  warningOrNote?: string;
}

export interface DailyTargets {
  calories: number; // e.g. 2100 kkal for SMP
  protein: number;  // e.g. 65 g
  carbs: number;    // e.g. 275 g
  fat: number;      // e.g. 60 g
  waterGlasses: number; // 8 glasses
}

export interface UserProfile {
  name: string;
  grade: string; // e.g. "Kelas 8 SMP"
  age: number;
  xp: number;
  level: number;
  waterCount: number; // glasses drank today
  streakDays: number;
  unlockedBadgeIds: string[];
}

export interface Badge {
  id: string;
  title: string;
  description: string;
  icon: string;
  category: string;
  requirement: string;
  xpBonus: number;
}

export interface SampleFoodPlate {
  id: string;
  title: string;
  category: string;
  description: string;
  portion: string;
  imageUrl: string;
  nutritionPreview: {
    calories: number;
    protein: number;
    carbs: number;
    fat: number;
  };
}
