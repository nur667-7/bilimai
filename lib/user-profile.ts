import { z } from "zod";
import type { Language, TopicId } from "./curriculum";
import type { UntSubjectId } from "./unt-all-subjects";

export const userProfileStorageKey = "aniq-user-v1";
export const themeStorageKey = "aniq-theme";
export const navContextStorageKey = "bilimai-nav-context-v1";

export interface SavedNavContext {
  tab: string;
  topic: TopicId;
  subject: string;
  lang: Language;
  practiceIndex?: number;
  hasStartedSession?: boolean;
}

export function loadNavContext(): SavedNavContext | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(navContextStorageKey);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as Partial<SavedNavContext>;
    if (!parsed || typeof parsed !== "object" || !parsed.topic) return null;
    return {
      tab: typeof parsed.tab === "string" ? parsed.tab : "lesson",
      topic: parsed.topic as TopicId,
      subject: typeof parsed.subject === "string" ? parsed.subject : "math",
      lang:
        parsed.lang === "kk" || parsed.lang === "uz" || parsed.lang === "ru"
          ? parsed.lang
          : "ru",
      practiceIndex: typeof parsed.practiceIndex === "number" ? parsed.practiceIndex : 0,
      hasStartedSession: Boolean(parsed.hasStartedSession)
    };
  } catch {
    return null;
  }
}

export function saveNavContext(ctx: SavedNavContext): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(navContextStorageKey, JSON.stringify(ctx));
  } catch {}
}

export function resolveReturnHref(lang: Language): string {
  if (typeof window !== "undefined") {
    try {
      const params = new URLSearchParams(window.location.search);
      const returnTo = params.get("returnTo");
      if (returnTo && returnTo.startsWith("/") && !returnTo.startsWith("//")) {
        const u = new URL(returnTo, window.location.origin);
        u.searchParams.set("lang", lang);
        return `${u.pathname}${u.search}`;
      }
    } catch {}
    const saved = loadNavContext();
    if (saved) {
      const p = new URLSearchParams();
      p.set("lang", lang);
      if (saved.topic) p.set("topic", saved.topic);
      if (saved.tab) p.set("tab", saved.tab);
      if (saved.subject) p.set("subject", saved.subject);
      return `/?${p.toString()}`;
    }
  }
  return `/?lang=${lang}`;
}


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

export const profileSubjectOptions = [
  { id: "math", title: { ru: "Математика", kk: "Математика", uz: "Matematika" } },
  { id: "physics", title: { ru: "Физика", kk: "Физика", uz: "Fizika" } },
  { id: "informatics", title: { ru: "Информатика", kk: "Информатика", uz: "Informatika" } },
  { id: "chemistry", title: { ru: "Химия", kk: "Химия", uz: "Kimyo" } },
  { id: "biology", title: { ru: "Биология", kk: "Биология", uz: "Biologiya" } },
  { id: "geography", title: { ru: "География", kk: "География", uz: "Geografiya" } },
  { id: "history_kz", title: { ru: "История Казахстана", kk: "Қазақстан тарихы", uz: "Qozog‘iston tarixi" } },
  { id: "world_history", title: { ru: "Всемирная история", kk: "Дүниежүзі тарихы", uz: "Jahon tarixi" } },
  { id: "law", title: { ru: "Основы права", kk: "Құқық негіздері", uz: "Huquq asoslari" } },
  { id: "english", title: { ru: "Английский язык", kk: "Ағылшын тілі", uz: "Ingliz tili" } },
  { id: "math_lit", title: { ru: "Математическая грамотность", kk: "Математикалық сауаттылық", uz: "Matematik savodxonlik" } },
  { id: "reading_lit", title: { ru: "Грамотность чтения", kk: "Оқу сауаттылығы", uz: "O‘qish savodxonligi" } }
] as const satisfies ReadonlyArray<{ id: UntSubjectId; title: Record<Language, string> }>;

const subjectSchema = z.enum(["math", "physics", "informatics", "chemistry", "biology", "geography", "history_kz", "world_history", "law", "english", "math_lit", "reading_lit"]);
const gradeSchema = z.enum(["8", "9", "10", "11", "graduate", "university", "teacher"]);
const dateSchema = z.string().regex(/^\d{4}-\d{2}-\d{2}$/).refine((value) => {
  const date = new Date(`${value}T00:00:00.000Z`);
  return Number.isFinite(date.getTime()) && date.toISOString().slice(0, 10) === value;
});

export const userProfileSchema = z.object({
  version: z.literal(2),
  id: z.string().min(1).max(64),
  name: z.string().trim().max(80),
  identifier: z.string().max(120),
  role: z.enum(["student", "teacher"]),
  goal: z.enum(["exam", "learn", "teach"]).nullable(),
  subjects: z.array(subjectSchema).max(12).transform((subjects) => [...new Set(subjects)]),
  grade: gradeSchema.nullable(),
  targetUniversity: z.string().trim().min(1).max(120).nullable(),
  targetScore: z.number().int().min(0).max(50).nullable(),
  examDate: dateSchema.nullable(),
  preferencesConfirmed: z.boolean(),
  legacyPreferences: z.object({
    grade: gradeSchema.nullable(),
    targetUniversity: z.string().max(120).nullable(),
    targetScore: z.number().int().min(0).max(50).nullable()
  }).optional(),
  preferredLanguage: z.enum(["ru", "kk", "uz"]),
  trapBlitzBestStreak: z.number().int().min(0).max(999).default(0),
  disarmedTrapsCount: z.number().int().min(0).max(9999).default(0),
  createdAt: z.string()
});

export type UserProfile = z.infer<typeof userProfileSchema>;

/** Old forms silently preselected these fields. Preserve them for recovery,
 * but never use them as confirmed learner choices. Reading never overwrites storage. */
export function parseUserProfile(value: unknown): UserProfile | null {
  const current = userProfileSchema.safeParse(value);
  if (current.success) return current.data;
  if (!value || typeof value !== "object" || Array.isArray(value)) return null;
  const old = value as Record<string, unknown>;
  if (old.version !== undefined && old.version !== 1) return null;
  const legacySchema = z.object({
    id: z.string().min(1).max(64), name: z.string().min(1).max(80),
    identifier: z.string().min(2).max(120), role: z.enum(["student", "teacher"]),
    grade: gradeSchema, targetUniversity: z.string().min(1).max(120),
    targetScore: z.number().int().min(0).max(50),
    preferredLanguage: z.enum(["ru", "kk", "uz"]),
    trapBlitzBestStreak: z.number().int().min(0).max(999).default(0),
    disarmedTrapsCount: z.number().int().min(0).max(9999).default(0),
    createdAt: z.string()
  });
  const legacy = legacySchema.safeParse(value);
  if (!legacy.success) return null;
  const { grade, targetUniversity, targetScore, ...identity } = legacy.data;
  return {
    ...identity, version: 2, goal: null, subjects: [], grade: null,
    targetUniversity: null, targetScore: null, examDate: null, preferencesConfirmed: false,
    legacyPreferences: { grade, targetUniversity, targetScore }
  };
}

export function getProfileStartHref(profile: UserProfile, lang: Language = profile.preferredLanguage): string {
  const subject = profile.subjects[0];
  if (!profile.preferencesConfirmed || !subject) return `/register?lang=${lang}`;
  return `/?${new URLSearchParams({ lang, tab: subject === "math" && profile.goal === "learn" ? "lesson" : "exam", subject, ...(subject === "math" ? { topic: "linear" } : {}) }).toString()}`;
}

export function loadUserProfile(): UserProfile | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(userProfileStorageKey);
    if (!raw) return null;
    return parseUserProfile(JSON.parse(raw));
  } catch {
    return null;
  }
}

export function saveUserProfile(profile: UserProfile): boolean {
  if (typeof window === "undefined") return false;
  const parsed = userProfileSchema.safeParse(profile);
  if (!parsed.success) return false;
  try {
    window.localStorage.setItem(userProfileStorageKey, JSON.stringify(parsed.data));
    return true;
  } catch { return false; }
}

export function clearUserProfile(): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.removeItem(userProfileStorageKey);
  } catch {}
}

export function createDemoProfile(role: "student" | "teacher", lang: Language = "ru"): UserProfile {
  return {
    version: 2,
    id: `demo-${role}`,
    name: lang === "kk" ? "Демо-профиль" : lang === "uz" ? "Demo profil" : "Демо-профиль",
    identifier: "",
    role,
    goal: null, subjects: [], grade: null, targetUniversity: null, targetScore: null,
    examDate: null, preferencesConfirmed: false,
    preferredLanguage: lang,
    trapBlitzBestStreak: 0,
    disarmedTrapsCount: 0,
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
