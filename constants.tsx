
import React from 'react';
import { 
  LayoutDashboard, 
  Calendar, 
  BookOpen, 
  MessageSquare, 
  Heart, 
  Music,
  Sunrise, 
  Sun, 
  Sunset, 
  Moon, 
  CloudMoon 
} from 'lucide-react';
import { Dua, NavigationTab, Qari, Hadith } from './types';

export const NAV_ITEMS = [
  { id: NavigationTab.DASHBOARD, label: 'Home', icon: <LayoutDashboard size={20} /> },
  { id: NavigationTab.CALENDAR, label: 'Prayers', icon: <Calendar size={20} /> },
  { id: NavigationTab.QURAN, label: 'Quran', icon: <Music size={20} /> },
  { id: NavigationTab.GUIDE, label: 'Guide', icon: <BookOpen size={20} /> },
  { id: NavigationTab.DUAS, label: 'Duas', icon: <Heart size={20} /> },
  { id: NavigationTab.AI_ASSISTANT, label: 'Ask AI', icon: <MessageSquare size={20} /> },
];

export const DUAS: Dua[] = [
  {
    title: 'Intention for Fasting (Suhoor)',
    arabic: 'وَبِصَوْمِ غَدٍ نَّوَيْتُ مِنْ شَهْرِ رَمَضَانَ',
    transliteration: 'Wa bi-sawmi ghadinn nawaiytu min shahri ramadan',
    translation: 'I intend to keep the fast for tomorrow in the month of Ramadan.',
    category: 'suhoor'
  },
  {
    title: 'Breaking the Fast (Iftar)',
    arabic: 'اللَّهُمَّ اِنِّى لَكَ صُمْتُ وَبِكَ اَمَنْتُ وَعَلَيْكَ تَوَكَّلْتُ وَعَلَى رِزْقِكَ اَفْطَرْتُ',
    transliteration: 'Allahumma inni laka sumtu wa bika aamantu wa alayka tawakkaltu wa ala rizq-ika aftartu',
    translation: 'O Allah! I fasted for You and I believe in You and I put my trust in You and I break my fast with Your sustenance.',
    category: 'iftar'
  },
  {
    title: 'Dua for Lailatul Qadr',
    arabic: 'اللْهُمَّ إِنَّكَ عَفُوٌّ تُحِبُّ الْعَفْوَ فَاعْفُ عَنِّي',
    transliteration: 'Allahumma innaka `afuwwun tuhibbul `afwa fa`fu `anni',
    translation: 'O Allah, You are Most Forgiving, and You love forgiveness; so forgive me.',
    category: 'last10'
  },
  {
    title: 'Dua for Parents',
    arabic: 'رَّبِّ ارْحَمْهُمَا كَمَا رَبَّيَانِي صَغِيرًا',
    transliteration: 'Rabbi irhamhuma kama rabbayani sagheera',
    translation: 'My Lord, have mercy upon them as they brought me up [when I was] small.',
    category: 'general'
  },
  {
    title: 'Dua for Guidance',
    arabic: 'اهْدِنَا الصِّرَاطَ الْمُسْتَقِيمَ',
    transliteration: 'Ihdinas-siratal-mustaqim',
    translation: 'Guide us to the straight path.',
    category: 'general'
  },
  {
    title: 'Dua for Forgiveness',
    arabic: 'رَبَّنَا فَاغْفِرْ لَنَا ذُنُوبَنَا وَكَفِّرْ عَنَّا سَيِّئَاتِنَا وَتَوَفَّنَا مَعَ الْأَبْرَارِ',
    transliteration: 'Rabbana faghfir lana dhunubana wa kaffir anna sayyiātina wa tawaffana ma\'al abrar',
    translation: 'Our Lord, forgive us our sins, remove from us our misdeeds, and grant that we die in the company of the righteous.',
    category: 'general'
  }
];

export const QARIS: Qari[] = [
  { id: '1', name: 'Mishary Rashid Al-Afasy', server: 'https://server8.mp3quran.net/afs/', photo: 'https://images.unsplash.com/photo-1590076214667-c0f33b98c442?auto=format&fit=crop&q=80&w=200' },
  { id: '2', name: 'Abdul Rahman Al-Sudais', server: 'https://server11.mp3quran.net/sds/', photo: 'https://images.unsplash.com/photo-1542810634-71277d95dcbb?auto=format&fit=crop&q=80&w=200' },
  { id: '3', name: 'Saud Al-Shuraim', server: 'https://server7.mp3quran.net/shur/', photo: 'https://images.unsplash.com/photo-1584551270911-6556117906a1?auto=format&fit=crop&q=80&w=200' },
  { id: '4', name: 'Maher Al-Muaiqly', server: 'https://server12.mp3quran.net/muaiqly/', photo: 'https://images.unsplash.com/photo-1542810634-71277d95dcbb?auto=format&fit=crop&q=80&w=200' },
  { id: '5', name: 'Saad Al-Ghamdi', server: 'https://server7.mp3quran.net/s_gmd/', photo: 'https://images.unsplash.com/photo-1584551270911-6556117906a1?auto=format&fit=crop&q=80&w=200' },
  { id: '6', name: 'Yasser Ad-Dussary', server: 'https://server11.mp3quran.net/yasser/', photo: 'https://images.unsplash.com/photo-1590076214667-c0f33b98c442?auto=format&fit=crop&q=80&w=200' },
];

export const SURAHS = Array.from({ length: 114 }, (_, i) => {
  const id = (i + 1).toString().padStart(3, '0');
  const names = [
    "Al-Fatihah", "Al-Baqarah", "Al-Imran", "An-Nisa", "Al-Ma'idah", "Al-An'am", "Al-A'raf", "Al-Anfal", "At-Tawbah", "Yunus",
    "Hud", "Yusuf", "Ar-Ra'd", "Ibrahim", "Al-Hijr", "An-Nahl", "Al-Isra", "Al-Kahf", "Maryam", "Ta-Ha",
    "Al-Anbiya", "Al-Hajj", "Al-Mu'minun", "An-Nur", "Al-Furqan", "Ash-Shu'ara", "An-Naml", "Al-Qasas", "Al-Ankabut", "Ar-Rum",
    "Luqman", "As-Sajdah", "Al-Ahzab", "Saba", "Fatir", "Ya-Sin", "As-Saffat", "Sad", "Az-Zumar", "Ghafir",
    "Fussilat", "Ash-Shura", "Az-Zukhruf", "Ad-Dukhan", "Al-Jathiyah", "Al-Ahqaf", "Muhammad", "Al-Fath", "Al-Hujurat", "Qaf",
    "Adh-Dhariyat", "At-Tur", "An-Najm", "Al-Qamar", "Ar-Rahman", "Al-Waqi'ah", "Al-Hadid", "Al-Mujadilah", "Al-Hashr", "Al-Mumtahanah",
    "As-Saff", "Al-Jumu'ah", "Al-Munafiqun", "At-Taghabun", "At-Talaq", "At-Tahrim", "Al-Mulk", "Al-Qalam", "Al-Haqqah", "Al-Ma'arij",
    "Nuh", "Al-Jinn", "Al-Muzzammil", "Al-Muddaththir", "Al-Qiyamah", "Al-Insan", "Al-Mursalat", "An-Naba", "An-Nazi'at", "Abasa",
    "At-Takwir", "Al-Infitar", "Al-Mutaffifin", "Al-Inshiqaq", "Al-Buruj", "At-Tariq", "Al-A'la", "Al-Ghashiyah", "Al-Fajr", "Al-Balad",
    "Ash-Shams", "Al-Layl", "Ad-Duha", "Ash-Sharh", "At-Tin", "Al-Alaq", "Al-Qadr", "Al-Bayyinah", "Az-Zalzalah", "Al-Adiyat",
    "Al-Qari'ah", "At-Takathur", "Al-Asr", "Al-Humazah", "Al-Fil", "Quraysh", "Al-Ma'un", "Al-Kawthar", "Al-Kafirun", "An-Nasr",
    "Al-Masad", "Al-Ikhlas", "Al-Falaq", "An-Nas"
  ];
  return { id, name: names[i] || `Surah ${i + 1}`, length: "--:--" };
});

export const HADITHS: Hadith[] = [
  {
    content: "When the month of Ramadan starts, the gates of heaven are opened and the gates of Hell are closed and the devils are chained.",
    source: "Sahih Bukhari",
    benefit: "Ramadan is a time of mercy and spiritual protection."
  },
  {
    content: "Whoever fasts Ramadan out of faith and in the hope of reward, his previous sins will be forgiven.",
    source: "Sahih Bukhari & Muslim",
    benefit: "Fasting with sincerity leads to complete spiritual renewal."
  },
  {
    content: "He who provides a fasting person something with which to break his fast, will earn the same reward as the one who was observing the fast.",
    source: "Tirmidhi",
    benefit: "Generosity in Ramadan multiplies your rewards manifold."
  }
];

export const RAMADAN_DOS_DONTS = [
  {
    title: 'Essential Pillars (The Dos)',
    items: [
      'Maintain five daily prayers (Salah) on time.',
      'Perform Suhoor (pre-dawn meal) as it carries blessings.',
      'Read and reflect upon the Holy Quran daily.',
      'Give generously (Sadaqah) to those in need.',
      'Maintain kinship and speak kindly to others.',
      'Perform Taraweeh and Tahajjud prayers when possible.'
    ]
  },
  {
    title: 'Avoid These (The Don\'ts)',
    items: [
      'Do not consume food, drink, or engage in marital relations from dawn to sunset.',
      'Avoid lying, backbiting, or engaging in useless arguments.',
      'Stay away from anger and losing your temper.',
      'Avoid overeating during Iftar and Suhoor.',
      'Don\'t waste time on excessive entertainment or social media.',
      'Never skip Fajr or any other mandatory prayer.'
    ]
  }
];
