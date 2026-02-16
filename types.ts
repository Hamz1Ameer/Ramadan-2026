
export interface PrayerTime {
  name: string;
  time: string;
  icon: string;
}

export interface DayProgress {
  fasting: boolean;
  salah: {
    fajr: boolean;
    dhuhr: boolean;
    asr: boolean;
    maghrib: boolean;
    isha: boolean;
    taraweeh: boolean;
  };
  quranPages: number;
  charity: boolean;
}

export interface Dua {
  title: string;
  arabic: string;
  transliteration: string;
  translation: string;
  category: 'suhoor' | 'iftar' | 'general' | 'last10';
}

export interface Hadith {
  content: string;
  source: string;
  benefit: string;
}

export interface Qari {
  id: string;
  name: string;
  server: string;
  photo: string;
}

export enum NavigationTab {
  DASHBOARD = 'dashboard',
  CALENDAR = 'calendar',
  QURAN = 'quran',
  GUIDE = 'guide',
  DUAS = 'duas',
  AI_ASSISTANT = 'assistant'
}
