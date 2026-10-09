import { z } from "zod";
import type { Language, TopicId } from "./curriculum";

export const userProfileStorageKey = "aniq-user-v1";
export const themeStorageKey = "aniq-theme";

export const kzUniversities = [
  {
    id: "kbtu",
    shortName: "KBTU (КБТУ)",
    name: {
      ru: "КБТУ · Информационные технологии и мат. моделирование",
      kk: "ҚБТУ · Ақпараттық технологиялар және мат. модельдеу",
      uz: "QBTU · Axborot texnologiyalari va mat. modellashtirish"
    },
    minMathScore: 41,
    safeMathScore: 46
  },
  {
    id: "iitu",
    shortName: "IITU (МУИТ)",
    name: {
      ru: "МУИТ · Computer Science и кибербезопасность",
      kk: "ХATУ (IITU) · Computer Science және киберқауіпсіздік",
      uz: "IITU · Computer Science va kiberxavfsizlik"
    },
    minMathScore: 39,
    safeMathScore: 44
  },
  {
    id: "aitu",
    shortName: "Astana IT (AITU)",
    name: {
      ru: "Astana IT University · Software Engineering & AI",
      kk: "Astana IT University · Software Engineering & AI",
      uz: "Astana IT University · Software Engineering & AI"
    },
    minMathScore: 38,
    safeMathScore: 43
  },
  {
    id: "sdu",
    shortName: "SDU University",
    name: {
      ru: "SDU University · Прикладная математика и Data Science",
      kk: "SDU University · Қолданбалы математика және Data Science",
      uz: "SDU University · Amaliy matematika va Data Science"
    },
    minMathScore: 40,
    safeMathScore: 45
  },
  {
    id: "satbayev",
    shortName: "Satbayev University",
    name: {
      ru: "Satbayev University · Инженерия, автоматизация и IT",
      kk: "Satbayev University · Инженерия, автоматтандыру және IT",
      uz: "Satbayev University · Muhandislik va IT"
    },
    minMathScore: 34,
    safeMathScore: 40
  },
  {
    id: "kaznu",
    shortName: "КазНУ им. аль-Фараби",
    name: {
      ru: "КазНУ им. аль-Фараби · Мехмат и ИИ",
      kk: "Әл-Фараби ат. ҚазҰУ · Мехмат және ЖИ",
      uz: "Al-Farobiy nomidagi QozMU · Mexmat va SI"
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
  currentProjectedScore: number;
  scoreAfterTrapFix: number;
  lostToTheoryGaps: number;
  lostToCognitiveTraps: number;
  universities: {
    id: UniversityId;
    shortName: string;
    fullName: string;
    minMathScore: number;
    safeMathScore: number;
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
  const baseFromMastery = 22 + Math.round((masteredTopicsCount / 16) * 20);
  const rawBase = lastUntScaled50 !== null ? Math.max(18, lastUntScaled50) : baseFromMastery;
  const trapBonus = Math.min(4, Math.floor(disarmedTrapsCount / 3));
  const currentProjectedScore = Math.min(50, Math.max(18, rawBase + trapBonus));

  const totalMissing = Math.max(0, 50 - currentProjectedScore);
  // On UNT, ~45% of lost points in profile math come from cognitive traps (ODZ, sign flips, |x|, extraneous roots)
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
    fullName: u.name[lang],
    minMathScore: u.minMathScore,
    safeMathScore: u.safeMathScore,
    currentChancePercent: computeChance(currentProjectedScore, u.minMathScore, u.safeMathScore),
    afterFixChancePercent: computeChance(scoreAfterTrapFix, u.minMathScore, u.safeMathScore)
  }));

  return {
    currentProjectedScore,
    scoreAfterTrapFix,
    lostToTheoryGaps,
    lostToCognitiveTraps,
    universities
  };
}
