import { z } from "zod";
import type { Language, TopicId } from "./curriculum";

export const userProfileStorageKey = "aniq-user-v1";
export const themeStorageKey = "aniq-theme";

export const kzUniversities = [
  {
    id: "kbtu",
    shortName: "KBTU (КБТУ)",
    gopCode: "B057 Информационные технологии (2024–2025)",
    name: {
      ru: "КБТУ · B057 Информационные технологии и мат. моделирование",
      kk: "ҚБТУ · B057 Ақпараттық технологиялар және мат. модельдеу",
      uz: "QBTU · B057 Axborot texnologiyalari va mat. modellashtirish"
    },
    minMathScore: 41,
    safeMathScore: 46
  },
  {
    id: "iitu",
    shortName: "IITU (МУИТ)",
    gopCode: "B057 / B059 Информационные технологии и ИБ (2024–2025)",
    name: {
      ru: "МУИТ · B057 Computer Science и B059 Кибербезопасность",
      kk: "ХATУ (IITU) · B057 Computer Science және B059 Киберқауіпсіздік",
      uz: "IITU · B057 Computer Science va B059 Kiberxavfsizlik"
    },
    minMathScore: 39,
    safeMathScore: 44
  },
  {
    id: "aitu",
    shortName: "Astana IT (AITU)",
    gopCode: "B057 Информационные технологии (2024–2025)",
    name: {
      ru: "Astana IT University · B057 Software Engineering & AI",
      kk: "Astana IT University · B057 Software Engineering & AI",
      uz: "Astana IT University · B057 Software Engineering & AI"
    },
    minMathScore: 38,
    safeMathScore: 43
  },
  {
    id: "sdu",
    shortName: "SDU University",
    gopCode: "B055 Математика и статистика / B057 IT (2024–2025)",
    name: {
      ru: "SDU University · B055 Математика и B057 Data Science",
      kk: "SDU University · B055 Математика және B057 Data Science",
      uz: "SDU University · B055 Matematika va B057 Data Science"
    },
    minMathScore: 40,
    safeMathScore: 45
  },
  {
    id: "satbayev",
    shortName: "Satbayev University",
    gopCode: "B062 Электротехника и автоматизация / B057 IT (2024–2025)",
    name: {
      ru: "Satbayev University · B062 Инженерия, автоматизация и IT",
      kk: "Satbayev University · B062 Инженерия, автоматтандыру және IT",
      uz: "Satbayev University · B062 Muhandislik va IT"
    },
    minMathScore: 34,
    safeMathScore: 40
  },
  {
    id: "kaznu",
    shortName: "КазНУ им. аль-Фараби",
    gopCode: "B055 Математика и статистика / B057 IT (2024–2025)",
    name: {
      ru: "КазНУ им. аль-Фараби · B055 Мехмат и B057 ИИ",
      kk: "Әл-Фараби ат. ҚазҰУ · B055 Мехмат және B057 ЖИ",
      uz: "Al-Farobiy nomidagi QozMU · B055 Mexmat va B057 SI"
    },
    minMathScore: 35,
    safeMathScore: 41
  }
] as const;

export type UniversityId = (typeof kzUniversities)[number]["id"];

export const userProfileSchema = z.object({
  id: z.string().min(1).max(64),
  name: z.string().min(1).max(80),
  identifier: z.string().min(2).max(120),
  role: z.enum(["student", "teacher"]),
  grade: z.enum(["8", "9", "10", "11", "teacher"]),
  targetUniversity: z.enum(["kbtu", "iitu", "aitu", "sdu", "satbayev", "kaznu"]),
  targetScore: z.number().int().min(20).max(50),
  preferredLanguage: z.enum(["ru", "kk", "uz"]),
  trapBlitzBestStreak: z.number().int().min(0).max(999).default(0),
  disarmedTrapsCount: z.number().int().min(0).max(9999).default(0),
  createdAt: z.string()
});

export type UserProfile = z.infer<typeof userProfileSchema>;

export function loadUserProfile(): UserProfile | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(userProfileStorageKey);
    if (!raw) return null;
    const parsed = userProfileSchema.safeParse(JSON.parse(raw));
    return parsed.success ? parsed.data : null;
  } catch {
    return null;
  }
}

export function saveUserProfile(profile: UserProfile): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(userProfileStorageKey, JSON.stringify(profile));
  } catch {}
}

export function clearUserProfile(): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.removeItem(userProfileStorageKey);
  } catch {}
}

export function createDemoProfile(role: "student" | "teacher", lang: Language = "ru"): UserProfile {
  if (role === "teacher") {
    return {
      id: "teacher-101",
      name: lang === "kk" ? "Айгүл Сәтбаева" : lang === "uz" ? "Aziza Karimova" : "Айгуль Сатпаева",
      identifier: "teacher@bilimai.dpdns.org",
      role: "teacher",
      grade: "teacher",
      targetUniversity: "kbtu",
      targetScore: 48,
      preferredLanguage: lang,
      trapBlitzBestStreak: 7,
      disarmedTrapsCount: 18,
      createdAt: new Date().toISOString()
    };
  }
  return {
    id: "student-1001",
    name: lang === "kk" ? "Әлихан Нұрланов" : lang === "uz" ? "Sardor Alimov" : "Алихан Нурланов",
    identifier: "1001",
    role: "student",
    grade: "11",
    targetUniversity: "kbtu",
    targetScore: 45,
    preferredLanguage: lang,
    trapBlitzBestStreak: 4,
    disarmedTrapsCount: 9,
    createdAt: new Date().toISOString()
  };
}

export interface GrantRadarEstimate {
  isAssessed: boolean;
  referenceYear: string;
  sourceUrl: string;
  methodologyNote: string;
  currentProjectedScore: number;
  scoreAfterTrapFix: number;
  lostToTheoryGaps: number;
  lostToCognitiveTraps: number;
  universities: {
    id: UniversityId;
    shortName: string;
    gopCode: string;
    fullName: string;
    minMathScore: number;
    safeMathScore: number;
    totalUntGrantRef140: number;
    referenceYear: string;
    currentChancePercent: number;
    afterFixChancePercent: number;
  }[];
}

export function calculateGrantRadar(
  lastUntScaled50: number | null,
  masteredTopicsCount: number,
  weakTopics: TopicId[],
  disarmedTrapsCount: number,
  lang: Language
): GrantRadarEstimate {
  const isAssessed = lastUntScaled50 !== null || masteredTopicsCount > 0 || disarmedTrapsCount > 0;
  const baseFromMastery = 22 + Math.round((masteredTopicsCount / 16) * 20);
  const rawBase = lastUntScaled50 !== null ? Math.max(18, lastUntScaled50) : baseFromMastery;
  const trapBonus = Math.min(4, Math.floor(disarmedTrapsCount / 3));
  const currentProjectedScore = Math.min(50, Math.max(18, rawBase + trapBonus));

  const totalMissing = Math.max(0, 50 - currentProjectedScore);
  const lostToCognitiveTraps = Math.min(totalMissing, Math.max(2, Math.round(totalMissing * 0.45)));
  const lostToTheoryGaps = Math.max(0, totalMissing - lostToCognitiveTraps);
  const scoreAfterTrapFix = Math.min(50, currentProjectedScore + lostToCognitiveTraps);

  const computeChance = (score: number, minScore: number, safeScore: number) => {
    if (score >= safeScore + 2) return 96;
    if (score >= safeScore) return 89;
    if (score >= minScore) {
      const span = Math.max(1, safeScore - minScore);
      return Math.round(58 + ((score - minScore) / span) * 28);
    }
    const deficit = minScore - score;
    return Math.max(12, Math.round(55 - deficit * 6.5));
  };

  const universities = kzUniversities.map((u) => ({
    id: u.id,
    shortName: u.shortName,
    gopCode: u.gopCode,
    fullName: u.name[lang],
    minMathScore: u.minMathScore,
    safeMathScore: u.safeMathScore,
    totalUntGrantRef140: Math.min(132, Math.round(u.minMathScore * 2.55)),
    referenceYear: "2024–2025",
    currentChancePercent: computeChance(currentProjectedScore, u.minMathScore, u.safeMathScore),
    afterFixChancePercent: computeChance(scoreAfterTrapFix, u.minMathScore, u.safeMathScore)
  }));

  const methodologyNote =
    lang === "kk"
      ? "Ескертпе: бағалау 2024–2025 оқу жылындағы жалпы конкурс гранттарының (B057 АТ, B059 Коммуникациялар, B055 Математика, B062 Электр техникасы) бағдарлы математика шектеріне негізделген индикативті модель болып табылады."
      : lang === "uz"
        ? "Izoh: hisob-kitob 2024–2025 o‘quv yilidagi davlat grantlari (B057 AT, B059, B055, B062) umumiy tanlov chegaralariga asoslangan indikativ modeldir."
        : "Примечание: расчёт является индикативной моделью по ориентирам профильной математики (из 50 баллов) и общего конкурса государственного образовательного заказа МНВО РК за 2024–2025 уч. год (ГОП B057 Информационные технологии, B059 Коммуникации, B055 Математика, B062 Электротехника).";

  return {
    isAssessed,
    referenceYear: "2024–2025",
    sourceUrl: "https://testcenter.kz/?page_id=15074&lang=ru",
    methodologyNote,
    currentProjectedScore,
    scoreAfterTrapFix,
    lostToTheoryGaps,
    lostToCognitiveTraps,
    universities
  };
}
