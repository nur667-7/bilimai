"use client";

import React, { useMemo, useState } from "react";
import {
  Award,
  BookOpen,
  CheckCircle2,
  FlaskConical,
  Gift,
  Lock,
  Play,
  ShieldAlert,
  Sparkles,
  Star,
  Target,
  Trophy,
  X
} from "lucide-react";
import { Button } from "@/components/ui/button";
import type { Language } from "@/lib/lessons";
import type { UntSubjectId } from "@/lib/unt-all-subjects";
import {
  getSubjectCurriculum,
  getSubjectShynKitapGuidebook,
  type UniversalLesson,
  type UniversalModule
} from "@/lib/universal-curriculum";
import type { SubjectLearningProgress } from "@/lib/universal-progress";

export interface DuolingoSkillPathProps {
  subjectId: UntSubjectId;
  lang: Language;
  subjectProgress?: SubjectLearningProgress;
  completedLessonIds?: string[];
  topicStats?: Record<string, { earned: number; max: number }>;
  activeLessonId?: string;
  onSelectLesson: (
    lesson: UniversalLesson,
    mode: "lesson" | "practice" | "error_lab" | "exam"
  ) => void;
}

type PathNodePos = "center" | "left" | "far-left" | "right" | "far-right";
type PathNodeKind = "lesson" | "chest" | "boss";
type PathNodeState = "mastered" | "active" | "available" | "review" | "locked";

interface SkillPathNodeItem {
  id: string;
  kind: PathNodeKind;
  pos: PathNodePos;
  state: PathNodeState;
  crowns: 0 | 1 | 2 | 3;
  title: string;
  subtitle: string;
  lesson: UniversalLesson;
  unitIndex: number;
}

const POS_CYCLE: PathNodePos[] = [
  "center",
  "left",
  "far-left",
  "left",
  "center",
  "right",
  "far-right",
  "right"
];

const UNIT_THEMES = [
  { bg: "#0d6e5b", lip: "#07473a" },
  { bg: "#1d4ed8", lip: "#1e3a8a" },
  { bg: "#6d28d9", lip: "#4c1d95" },
  { bg: "#b45309", lip: "#78350f" }
];

const COPY = {
  ru: {
    unitPrefix: "Раздел",
    guidebookBtn: "Справочник Шың-кітап",
    closeGuidebook: "Закрыть конспект",
    goldenRulesTitle: "Алтын ережелер · Золотые правила Шың-кітап",
    trapsTitle: "ҰБТ қақпандары · Типичные ловушки НЦТ",
    tablesTitle: "Опорная таблица раздела",
    startBadge: "НАЧАТЬ",
    reviewBadge: "ПОВТОРИТЬ",
    continueBadge: "ПРОДОЛЖИТЬ",
    chestTitle: "Сундук интервального повторения",
    chestSub: "Быстрый блиц по ключевым формулам и датам раздела",
    bossTitle: "Рубежный мини-ЕНТ раздела",
    bossSub: "Проверка всех навыков раздела в формате НЦТ",
    crownsLabel: "Уровень мастерства",
    step1Tab: "1. Правило",
    step2Tab: "2. Разбор шага",
    step3Tab: "3. Блиц-проверка",
    openLessonBtn: "Открыть полный урок",
    openPracticeBtn: "Тренировка (3 задачи)",
    openLabBtn: "Лаборатория ошибок",
    openExamBtn: "Пробный ЕНТ",
    checkBtn: "Проверить ответ",
    correctMsg: "Верно! Корона мастерства укреплена.",
    wrongMsg: "Обратите внимание на правило Шың-кітап:",
    revealStepBtn: "Показать все шаги решения"
  },
  kk: {
    unitPrefix: "Бөлім",
    guidebookBtn: "Шың-кітап анықтамалығы",
    closeGuidebook: "Анықтамалықты жабу",
    goldenRulesTitle: "Алтын ережелер · Шың-кітап негізгі қағидалары",
    trapsTitle: "ҰБТ қақпандары · Жиі кездесетін тұзақтар",
    tablesTitle: "Бөлімнің тірек кестесі",
    startBadge: "БАСТАУ",
    reviewBadge: "ҚАЙТАЛАУ",
    continueBadge: "ЖАЛҒАСТЫРУ",
    chestTitle: "Аралық қайталау сандығы",
    chestSub: "Бөлімнің негізгі формулалары мен даталары бойынша блиц",
    bossTitle: "Бөлімнің қорытынды мини-ҰБТ сынағы",
    bossSub: "ҰТО форматында бөлім дағдыларын тексеру",
    crownsLabel: "Меңгеру деңгейі",
    step1Tab: "1. Ереже",
    step2Tab: "2. Қадамдық талдау",
    step3Tab: "3. Блиц-тексеру",
    openLessonBtn: "Толық сабақты ашу",
    openPracticeBtn: "Жаттығу (3 есеп)",
    openLabBtn: "Қателер зертханасы",
    openExamBtn: "Сынақ ҰБТ",
    checkBtn: "Жауапты тексеру",
    correctMsg: "Дұрыс! Шеберлік тәжі нығайтылды.",
    wrongMsg: "Шың-кітап ережесіне назар аударыңыз:",
    revealStepBtn: "Шешімнің барлық қадамдарын көрсету"
  },
  uz: {
    unitPrefix: "Bo‘lim",
    guidebookBtn: "Shyn-kitap ma’lumotnomasi",
    closeGuidebook: "Yopish",
    goldenRulesTitle: "Oltin qoidalar · Shyn-kitap asosiy qoidalari",
    trapsTitle: "UBT tuzoqlari · Tipik xatolar",
    tablesTitle: "Bo‘lim tayanch jadvali",
    startBadge: "BOSHLASH",
    reviewBadge: "TAKRORLASH",
    continueBadge: "DAVOM ETISH",
    chestTitle: "Intervalli takrorlash sandig‘i",
    chestSub: "Bo‘limning asosiy formulalari va sanalari bo‘yicha blits",
    bossTitle: "Bo‘lim yakuniy mini-UBT sinovi",
    bossSub: "Bo‘lim ko‘nikmalarini UBT formatida tekshirish",
    crownsLabel: "O‘zlashtirish darajasi",
    step1Tab: "1. Qoida",
    step2Tab: "2. Qadam tahlili",
    step3Tab: "3. Blits-tekshiruv",
    openLessonBtn: "To‘liq darsni ochish",
    openPracticeBtn: "Mashq (3 masala)",
    openLabBtn: "Xatolar laboratoriyasi",
    openExamBtn: "Sinov UBT",
    checkBtn: "Javobni tekshirish",
    correctMsg: "To‘g‘ri! Mahorat toji mustahkamlandi.",
    wrongMsg: "Shyn-kitap qoidasiga e’tibor bering:",
    revealStepBtn: "Yechimning barcha qadamlarini ko‘rsatish"
  }
} as const;

export function DuolingoSkillPath({
  subjectId,
  lang,
  subjectProgress,
  completedLessonIds = [],
  topicStats = {},
  activeLessonId,
  onSelectLesson
}: DuolingoSkillPathProps) {
  const t = COPY[lang];
  const curriculum = useMemo(
    () => getSubjectCurriculum(subjectId) ?? getSubjectCurriculum("math")!,
    [subjectId]
  );
  const guidebook = useMemo(() => getSubjectShynKitapGuidebook(subjectId), [subjectId]);

  const [openGuidebookUnitId, setOpenGuidebookUnitId] = useState<string | null>(null);
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);
  const [popoverStep, setPopoverStep] = useState<1 | 2 | 3>(1);
  const [revealedWorkedStep, setRevealedWorkedStep] = useState(false);
  const [selectedQuizOption, setSelectedQuizOption] = useState<number | null>(null);
  const [quizSubmitted, setQuizSubmitted] = useState(false);
  const [localCrownBoost, setLocalCrownBoost] = useState<Record<string, number>>({});

  const unitsWithNodes = useMemo(() => {
    const modules: UniversalModule[] =
      curriculum.modules.length > 0
        ? curriculum.modules
        : [
            {
              id: `${subjectId}-unit-1`,
              title: curriculum.title,
              summary: curriculum.subtitle,
              topicIds: curriculum.lessons.map((l) => l.topicId)
            }
          ];

    const firstUnmasteredLessonId =
      curriculum.lessons.find((l) => {
        const progStat = subjectProgress?.topicStats?.[l.topicId] ?? topicStats[l.topicId];
        const accuracy =
          progStat && progStat.max > 0 ? Math.round((progStat.earned / progStat.max) * 100) : null;
        return accuracy === null || accuracy < 85;
      })?.id ?? curriculum.lessons[0]?.id;

    return modules.map((mod, unitIdx) => {
      const unitLessons = curriculum.lessons.filter(
        (l) =>
          mod.topicIds.includes(l.topicId) ||
          mod.topicIds.includes(l.id) ||
          l.moduleId === mod.id
      );

      const fallbackLessons =
        unitLessons.length > 0
          ? unitLessons
          : curriculum.lessons.slice(unitIdx * 2, unitIdx * 2 + 2);

      const baseRowOffset = unitIdx * 4;
      const lessonNodes: SkillPathNodeItem[] = fallbackLessons.map((lesson, lIdx) => {
        const progStat =
          subjectProgress?.topicStats?.[lesson.topicId] ?? topicStats[lesson.topicId];
        const lessonState = subjectProgress?.lessonStates?.[lesson.id];
        const accuracy =
          progStat && progStat.max > 0 ? Math.round((progStat.earned / progStat.max) * 100) : null;
        const isCompleted =
          completedLessonIds.includes(lesson.id) ||
          Boolean(subjectProgress?.completedLessonIds?.includes(lesson.id)) ||
          lessonState?.status === "completed";

        let crowns: 0 | 1 | 2 | 3 = 0;
        if (accuracy !== null && accuracy >= 85) {
          crowns = 3;
        } else if (
          (accuracy !== null && accuracy >= 60) ||
          (isCompleted && (accuracy ?? 0) >= 50)
        ) {
          crowns = 2;
        } else if (
          isCompleted ||
          lessonState?.status === "started" ||
          (progStat?.max ?? 0) > 0
        ) {
          crowns = 1;
        }
        const boosted = Math.min(3, crowns + (localCrownBoost[lesson.id] ?? 0)) as 0 | 1 | 2 | 3;

        let nodeState: PathNodeState = "available";
        if (boosted === 3) {
          nodeState = "mastered";
        } else if (accuracy !== null && accuracy < 55) {
          nodeState = "review";
        } else if (lesson.id === activeLessonId || lesson.id === firstUnmasteredLessonId) {
          nodeState = "active";
        } else {
          nodeState = "available";
        }

        const pos = POS_CYCLE[(baseRowOffset + lIdx) % POS_CYCLE.length];

        return {
          id: `node-lesson-${lesson.id}`,
          kind: "lesson",
          pos,
          state: nodeState,
          crowns: boosted,
          title: lesson.title[lang],
          subtitle: lesson.simpleExplanation[lang],
          lesson,
          unitIndex: unitIdx
        };
      });

      const extraNodes: SkillPathNodeItem[] = [];
      if (fallbackLessons.length > 0) {
        const anchorLesson = fallbackLessons[fallbackLessons.length - 1];
        const chestPos = POS_CYCLE[(baseRowOffset + fallbackLessons.length) % POS_CYCLE.length];
        const unitMasteredCount = lessonNodes.filter((n) => n.crowns >= 2).length;
        const chestCrowns = (
          unitMasteredCount >= fallbackLessons.length ? 3 : unitMasteredCount > 0 ? 1 : 0
        ) as 0 | 1 | 2 | 3;

        extraNodes.push({
          id: `node-chest-${mod.id}`,
          kind: "chest",
          pos: chestPos,
          state: chestCrowns >= 3 ? "mastered" : "available",
          crowns: chestCrowns,
          title: t.chestTitle,
          subtitle: t.chestSub,
          lesson: anchorLesson,
          unitIndex: unitIdx
        });

        const bossPos = POS_CYCLE[(baseRowOffset + fallbackLessons.length + 1) % POS_CYCLE.length];
        extraNodes.push({
          id: `node-boss-${mod.id}`,
          kind: "boss",
          pos: bossPos,
          state: chestCrowns >= 3 ? "mastered" : "available",
          crowns: chestCrowns,
          title: `${t.bossTitle} #${unitIdx + 1}`,
          subtitle: t.bossSub,
          lesson: anchorLesson,
          unitIndex: unitIdx
        });
      }

      const nodes = [...lessonNodes, ...extraNodes];
      const totalCrowns = nodes.reduce((acc, n) => acc + n.crowns, 0);
      const maxCrowns = Math.max(1, nodes.length * 3);
      const unitPct = Math.round((totalCrowns / maxCrowns) * 100);

      return {
        module: mod,
        unitIndex: unitIdx,
        theme: UNIT_THEMES[unitIdx % UNIT_THEMES.length],
        nodes,
        unitPct
      };
    });
  }, [
    curriculum,
    subjectId,
    subjectProgress,
    completedLessonIds,
    topicStats,
    activeLessonId,
    lang,
    t,
    localCrownBoost
  ]);

  function handleNodeClick(node: SkillPathNodeItem) {
    if (selectedNodeId === node.id) {
      setSelectedNodeId(null);
      return;
    }
    setSelectedNodeId(node.id);
    setPopoverStep(1);
    setRevealedWorkedStep(false);
    setSelectedQuizOption(null);
    setQuizSubmitted(false);
  }

  return (
    <div className="duo-path-shell" data-testid="duolingo-skill-path">
      {unitsWithNodes.map(({ module: mod, unitIndex, theme, nodes, unitPct }) => {
        const isGuidebookOpen = openGuidebookUnitId === mod.id;
        const unitDesc = mod.description?.[lang] ?? mod.summary?.[lang] ?? curriculum.subtitle[lang];

        return (
          <section key={mod.id} className="duo-unit-section">
            <header
              className="duo-unit-banner"
              style={
                {
                  "--unit-bg": theme.bg,
                  "--unit-lip": theme.lip
                } as React.CSSProperties
              }
            >
              <div className="duo-unit-meta">
                <span className="duo-unit-kicker">
                  <Sparkles size={13} />
                  {t.unitPrefix} {unitIndex + 1} · Шың-кітап
                </span>
                <h3 className="duo-unit-title">{mod.title[lang]}</h3>
                <p className="duo-unit-desc">{unitDesc}</p>
                <div className="duo-unit-progress-wrap">
                  <div className="duo-unit-progress-track" aria-hidden="true">
                    <div
                      className="duo-unit-progress-fill"
                      style={{ width: `${Math.max(12, unitPct)}%` }}
                    />
                  </div>
                  <span className="text-xs font-bold tabular-nums text-white/95">{unitPct}%</span>
                </div>
              </div>

              <button
                type="button"
                className="duo-guidebook-btn"
                data-testid={`duo-guidebook-btn-${unitIndex}`}
                aria-expanded={isGuidebookOpen}
                onClick={() => setOpenGuidebookUnitId(isGuidebookOpen ? null : mod.id)}
              >
                <BookOpen size={16} />
                <span>{isGuidebookOpen ? t.closeGuidebook : t.guidebookBtn}</span>
              </button>
            </header>

            {isGuidebookOpen && guidebook && (
              <div className="duo-guidebook-drawer" role="region" aria-label={t.guidebookBtn}>
                <div className="flex items-center justify-between gap-2 mb-3">
                  <div>
                    <span className="section-pill">Шың-кітап · Талапкер</span>
                    <h4 className="text-base font-bold mt-1 m-0">{guidebook.editionNote[lang]}</h4>
                  </div>
                  <Button
                    type="button"
                    size="sm"
                    variant="outline"
                    onClick={() => setOpenGuidebookUnitId(null)}
                  >
                    <X size={14} />
                    <span>{t.closeGuidebook}</span>
                  </Button>
                </div>

                <div className="mb-4">
                  <strong className="text-xs uppercase tracking-wider text-emerald-800 dark:text-emerald-300 block mb-2">
                    {t.goldenRulesTitle}
                  </strong>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    {guidebook.goldenRules.map((rule) => (
                      <div key={rule.id} className="shyn-rule-card">
                        <div className="flex items-center justify-between gap-2">
                          <strong className="text-xs font-bold">{rule.title[lang]}</strong>
                          <span className="section-pill text-[10px]">{rule.gradeBand}</span>
                        </div>
                        <code className="block text-xs font-mono font-bold mt-1 text-emerald-900 dark:text-emerald-200">
                          {rule.formulaOrFact[lang]}
                        </code>
                        <p className="small mt-1 mb-0">{rule.mnemonicOrTip[lang]}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {guidebook.referenceTables[unitIndex % guidebook.referenceTables.length] && (
                  <div className="mb-4">
                    <strong className="text-xs uppercase tracking-wider text-muted-foreground block mb-2">
                      {t.tablesTitle}:{" "}
                      {guidebook.referenceTables[unitIndex % guidebook.referenceTables.length].title[lang]}
                    </strong>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {guidebook.referenceTables[unitIndex % guidebook.referenceTables.length].rows.map(
                        (row, rIdx) => (
                          <div
                            key={rIdx}
                            className="p-2.5 rounded-lg border border-border bg-background/70 flex flex-col gap-0.5"
                          >
                            <strong className="text-xs font-bold">{row.key}</strong>
                            <span className="small">{row.value[lang]}</span>
                          </div>
                        )
                      )}
                    </div>
                  </div>
                )}

                <div>
                  <strong className="text-xs uppercase tracking-wider text-amber-800 dark:text-amber-300 block mb-2">
                    {t.trapsTitle}
                  </strong>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    {guidebook.untTraps.map((trap) => (
                      <div key={trap.id} className="shyn-trap-card">
                        <strong className="text-xs font-bold text-amber-900 dark:text-amber-200 block">
                          ⚠ {trap.trapTitle[lang]}
                        </strong>
                        <p className="small mt-1 mb-1">{trap.wrongHabit[lang]}</p>
                        <p className="small m-0 text-emerald-800 dark:text-emerald-300 font-semibold">
                          ✓ {trap.correctStrategy[lang]}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            <div className="duo-path-stage">
              <svg
                className="duo-path-svg"
                viewBox="0 0 400 500"
                preserveAspectRatio="none"
                aria-hidden="true"
              >
                <path
                  className="duo-path-line-bg"
                  d="M 200 20 C 110 120, 110 220, 200 290 C 290 360, 290 430, 200 485"
                />
                <path
                  className="duo-path-line-fill"
                  d="M 200 20 C 110 120, 110 220, 200 290 C 290 360, 290 430, 200 485"
                  strokeDasharray="600"
                  strokeDashoffset={Math.max(0, 600 - (unitPct / 100) * 600)}
                />
              </svg>

              {nodes.map((node) => {
                const isSelected = selectedNodeId === node.id;
                const shape =
                  node.kind === "chest"
                    ? "chest"
                    : node.kind === "boss"
                      ? "boss"
                      : node.state === "review"
                        ? "hex"
                        : "circle";

                const firstQuestion = node.lesson.questions[0];
                const isQuizCorrect =
                  firstQuestion &&
                  selectedQuizOption !== null &&
                  selectedQuizOption === (firstQuestion.correctIndex ?? 0);

                return (
                  <div key={node.id} className="duo-node-row" data-pos={node.pos}>
                    <div className="relative flex flex-col items-center">
                      {node.state === "active" && !isSelected && (
                        <div className="duo-floating-badge">
                          {node.crowns > 0 ? t.continueBadge : t.startBadge}
                        </div>
                      )}
                      {node.state === "review" && !isSelected && (
                        <div className="duo-floating-badge">{t.reviewBadge}</div>
                      )}

                      <button
                        type="button"
                        className="duo-node-btn"
                        data-testid={`duo-node-${node.id}`}
                        data-state={node.state}
                        data-shape={shape}
                        aria-expanded={isSelected}
                        aria-label={`${node.title} (${t.crownsLabel}: ${node.crowns}/3)`}
                        onClick={() => handleNodeClick(node)}
                      >
                        {node.state === "active" && (
                          <span className="duo-active-ring" aria-hidden="true" />
                        )}
                        {node.kind === "chest" ? (
                          <Gift size={26} />
                        ) : node.kind === "boss" ? (
                          <Trophy size={28} />
                        ) : node.state === "mastered" ? (
                          <CheckCircle2 size={26} />
                        ) : node.state === "review" ? (
                          <ShieldAlert size={25} />
                        ) : node.state === "locked" ? (
                          <Lock size={22} />
                        ) : (
                          <Star size={25} />
                        )}
                      </button>

                      <div className="duo-crowns-row" aria-hidden="true">
                        {[1, 2, 3].map((crownIdx) => (
                          <Star
                            key={crownIdx}
                            size={12}
                            className={`duo-crown ${
                              node.crowns >= crownIdx ? "filled fill-amber-400" : ""
                            }`}
                          />
                        ))}
                      </div>

                      <span className="duo-node-caption">{node.title}</span>
                    </div>

                    {isSelected && (
                      <div className="duo-node-popover" role="dialog" aria-label={node.title}>
                        <div className="flex items-start justify-between gap-2 mb-2">
                          <div>
                            <span className="section-pill text-[11px]">
                              {t.unitPrefix} {unitIndex + 1} · {t.crownsLabel} {node.crowns}/3
                            </span>
                            <h4 className="text-base font-bold mt-1 m-0">{node.title}</h4>
                          </div>
                          <button
                            type="button"
                            className="p-1 rounded-md hover:bg-muted"
                            aria-label="Close"
                            onClick={() => setSelectedNodeId(null)}
                          >
                            <X size={16} />
                          </button>
                        </div>

                        <div className="flex gap-1.5 my-2.5">
                          {([1, 2, 3] as const).map((stNum) => (
                            <button
                              key={stNum}
                              type="button"
                              onClick={() => setPopoverStep(stNum)}
                              className={`flex-1 py-1.5 px-2 rounded-lg text-xs font-bold border transition-all ${
                                popoverStep === stNum
                                  ? "bg-emerald-700 text-white border-emerald-800"
                                  : "bg-muted/60 text-foreground border-border"
                              }`}
                            >
                              {stNum === 1 ? t.step1Tab : stNum === 2 ? t.step2Tab : t.step3Tab}
                            </button>
                          ))}
                        </div>

                        {popoverStep === 1 && (
                          <div className="anim-step-enter space-y-2 my-2">
                            <div className="shyn-rule-card">
                              <strong className="text-xs uppercase tracking-wider block text-emerald-800 dark:text-emerald-300">
                                Алтын ереже · Шың-кітап
                              </strong>
                              <p className="small font-semibold mt-1 mb-0">
                                {node.lesson.simpleExplanation[lang]}
                              </p>
                            </div>
                            <div className="shyn-trap-card">
                              <strong className="text-xs uppercase tracking-wider block text-amber-800 dark:text-amber-300">
                                ҰБТ қақпаны · Вывод урока
                              </strong>
                              <p className="small mt-1 mb-0">{node.lesson.summary[lang]}</p>
                            </div>
                          </div>
                        )}

                        {popoverStep === 2 && (
                          <div className="anim-step-enter space-y-2 my-2">
                            <div className="p-2.5 rounded-lg border border-border bg-muted/40">
                              <strong className="text-xs block mb-1">
                                {node.lesson.workedExample.problem[lang]}
                              </strong>
                              <ol className="small pl-4 m-0 space-y-1">
                                {node.lesson.workedExample.steps[lang]
                                  .slice(0, revealedWorkedStep ? undefined : 1)
                                  .map((st, idx) => (
                                    <li key={idx} className="anim-step-enter">
                                      {st}
                                    </li>
                                  ))}
                              </ol>
                              {!revealedWorkedStep &&
                                node.lesson.workedExample.steps[lang].length > 1 && (
                                  <Button
                                    type="button"
                                    size="sm"
                                    variant="outline"
                                    className="mt-2 w-full text-xs"
                                    onClick={() => setRevealedWorkedStep(true)}
                                  >
                                    <Sparkles size={13} />
                                    <span>{t.revealStepBtn}</span>
                                  </Button>
                                )}
                              {revealedWorkedStep && (
                                <p className="small font-bold text-emerald-700 dark:text-emerald-300 mt-2 mb-0">
                                  ✓ {node.lesson.workedExample.takeaway[lang]}
                                </p>
                              )}
                            </div>
                          </div>
                        )}

                        {popoverStep === 3 && firstQuestion && (
                          <div className="anim-step-enter space-y-2 my-2">
                            <p className="small font-bold m-0">{firstQuestion.prompt[lang]}</p>
                            {firstQuestion.options && (
                              <div className="space-y-1.5">
                                {(firstQuestion.options[lang] ?? firstQuestion.options.ru)
                                  .slice(0, 4)
                                  .map((optText, oIdx) => {
                                    const active = selectedQuizOption === oIdx;
                                    return (
                                      <button
                                        key={oIdx}
                                        type="button"
                                        onClick={() => {
                                          setSelectedQuizOption(oIdx);
                                          setQuizSubmitted(false);
                                        }}
                                        className={`w-full text-left p-2 rounded-lg border text-xs font-medium transition-all ${
                                          active
                                            ? "border-emerald-700 bg-emerald-50/80 dark:bg-emerald-950/40 font-bold"
                                            : "border-border bg-background hover:bg-muted/50"
                                        }`}
                                      >
                                        {String.fromCharCode(65 + oIdx)}) {optText}
                                      </button>
                                    );
                                  })}
                              </div>
                            )}
                            {selectedQuizOption !== null && !quizSubmitted && (
                              <Button
                                type="button"
                                size="sm"
                                className="w-full"
                                onClick={() => {
                                  setQuizSubmitted(true);
                                  if (isQuizCorrect) {
                                    setLocalCrownBoost((prev) => ({
                                      ...prev,
                                      [node.lesson.id]: 1
                                    }));
                                  }
                                }}
                              >
                                <CheckCircle2 size={14} />
                                <span>{t.checkBtn}</span>
                              </Button>
                            )}
                            {quizSubmitted && (
                              <div
                                className={`p-2.5 rounded-lg text-xs ${
                                  isQuizCorrect
                                    ? "bg-emerald-50 dark:bg-emerald-950/50 text-emerald-900 dark:text-emerald-200 anim-correct-pop"
                                    : "bg-amber-50 dark:bg-amber-950/50 text-amber-900 dark:text-amber-200 anim-wrong-shake"
                                }`}
                              >
                                <strong>{isQuizCorrect ? t.correctMsg : t.wrongMsg}</strong>
                                <p className="mt-1 mb-0">{firstQuestion.explanation[lang]}</p>
                              </div>
                            )}
                          </div>
                        )}

                        <div className="grid grid-cols-2 gap-2 mt-3 pt-2.5 border-t border-border">
                          <Button
                            type="button"
                            size="sm"
                            onClick={() =>
                              onSelectLesson(
                                node.lesson,
                                node.kind === "boss" ? "exam" : "lesson"
                              )
                            }
                          >
                            <Play size={14} />
                            <span>
                              {node.kind === "boss" ? t.openExamBtn : t.openLessonBtn}
                            </span>
                          </Button>
                          <Button
                            type="button"
                            size="sm"
                            variant="outline"
                            onClick={() => onSelectLesson(node.lesson, "practice")}
                          >
                            <Target size={14} />
                            <span>{t.openPracticeBtn}</span>
                          </Button>
                          <Button
                            type="button"
                            size="sm"
                            variant="outline"
                            onClick={() => onSelectLesson(node.lesson, "error_lab")}
                          >
                            <FlaskConical size={14} />
                            <span>{t.openLabBtn}</span>
                          </Button>
                          <Button
                            type="button"
                            size="sm"
                            variant="outline"
                            onClick={() => onSelectLesson(node.lesson, "exam")}
                          >
                            <Award size={14} />
                            <span>{t.openExamBtn}</span>
                          </Button>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </section>
        );
      })}
    </div>
  );
}
