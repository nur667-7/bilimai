"use client";
import { useEffect, useState } from "react";
import {
  ArrowRight,
  CheckCircle2,
  Clock,
  Eraser,
  Flame,
  FlaskConical,
  Microscope,
  RotateCcw,
  ShieldAlert,
  Sparkles,
  Zap
} from "lucide-react";
import { Button } from "@/components/ui/button";
import type { Language, TopicId } from "@/lib/curriculum";
import { topicName } from "@/lib/error-lab";
import { analyzeCustomDraft, untTrapCases, type CustomDraftAnalysis } from "@/lib/xray-trace";
import type { UniversityId, UserProfile } from "@/lib/user-profile";

const xrayCopy = {
  ru: {
    title: "Проверить черновик решения",
    sub: "Вставьте шаги своего решения (по одному переходу на строку), чтобы проверить, на какой строке нарушилось правило или область допустимых значений (ОДЗ).",
    modeDraft: "Проверить свой черновик",
    modeBlitz: "Примеры с ошибками (тренажёр)",
    exampleBadge: "Пример",
    streakLabel: "Серия верных",
    disarmedLabel: "Найдено ошибок",
    timerEnableBtn: "Режим на время (60 сек)",
    timerRunningLabel: "Осталось времени",
    timerReset: "Выключить таймер",
    selectTrapPrompt: "Пример чужого решения: нажмите на строку (01–04), в которой впервые допущена ошибка:",
    pointsAtStake: "Вес задания на ЕНТ:",
    ptsUnit: "балла",
    statusValid: "Верный шаг",
    statusFracture: "Первая ошибка",
    statusCascade: "Следствие предыдущей ошибки",
    foundCorrectTitle: "Верно! Найдена строка, где нарушено правило.",
    foundWrongTitle: "На этой строке переход корректен или является следствием более ранней ошибки.",
    correctedLabel: "Правильная запись шага:",
    whyLabel: "Причина ошибки:",
    preservedLabel: "Что решено верно:",
    askClaudeBtn: "Разобрать этот шаг с ИИ-тьютором",
    openTopicBtn: "Открыть урок темы",
    nextTrapBtn: "Следующий пример",
    customDraftTitle: "Введите свои шаги решения",
    customDraftSub:
      "Запишите каждый шаг с новой строки (например: 1-я строка — исходное уравнение, 2-я — преобразование, 3-я — ответ) и нажмите «Проверить черновик».",
    textareaLabel: "Ваше решение (1 строка = 1 шаг):",
    textareaPlaceholder:
      "Например:\n3x + 6 = 21\n3x = 27\nx = 9",
    checkDraftBtn: "Проверить черновик",
    clearDraftBtn: "Очистить поле",
    tryExampleBtn: "Заполнить примером",
    emptyResultTitle: "Результат проверки появится здесь",
    emptyResultSub:
      "Введите своё решение слева и нажмите «Проверить черновик», либо выберите один из готовых примеров ниже.",
    presetsLabel: "Или посмотрите готовый пример:",
    preset1: "Пример: логарифм с основанием 0,5",
    preset2: "Пример: корень из квадрата √((x−5)²)",
    preset3: "Пример: перенос слагаемого 3x + 6 = 21",
    preset4: "Пример: теорема Виета x² − 9x + 14 = 0",
    preset5: "Пример: объём пирамиды",
    claudeDeepCheckBtn: "Задать вопрос ИИ-тьютору по черновику",
    fullLabLink: "Открыть полную тренировку ошибок (поиск ошибки + своя задача)"
  },
  kk: {
    title: "Шешім жазбасын тексеру",
    sub: "Қай жолда математикалық ереже немесе анықталу облысы (АОО) бұзылғанын тексеру үшін өз шешіміңіздің қадамдарын енгізіңіз.",
    modeDraft: "Өз жазбамды тексеру",
    modeBlitz: "Қатесі бар мысалдар (жаттықтырғыш)",
    exampleBadge: "Мысал",
    streakLabel: "Дұрыс серия",
    disarmedLabel: "Табылған қателер",
    timerEnableBtn: "Уақытпен режим (60 сек)",
    timerRunningLabel: "Қалған уақыт",
    timerReset: "Таймерді өшіру",
    selectTrapPrompt: "Дайын мысал: математикалық ереже алғаш бұзылған жолды (01–04) басыңыз:",
    pointsAtStake: "ҰБТ-дағы салмағы:",
    ptsUnit: "балл",
    statusValid: "Дұрыс қадам",
    statusFracture: "Бірінші қате",
    statusCascade: "Алдыңғы қатенің салдары",
    foundCorrectTitle: "Дұрыс! Ереже бұзылған жол табылды.",
    foundWrongTitle: "Бұл жолдағы амал дұрыс немесе алдыңғы жолдың салдары.",
    correctedLabel: "Қадамның дұрыс жазылуы:",
    whyLabel: "Қатенің себебі:",
    preservedLabel: "Дұрыс орындалған бөлік:",
    askClaudeBtn: "Осы қадамды ИИ-тьютормен талдау",
    openTopicBtn: "Тақырып сабағын ашу",
    nextTrapBtn: "Келесі мысал",
    customDraftTitle: "Өз шешім қадамдарыңызды енгізіңіз",
    customDraftSub:
      "Әр қадамды жаңа жолдан жазып, «Жазбаны тексеру» батырмасын басыңыз.",
    textareaLabel: "Сіздің шешіміңіз (1 жол = 1 қадам):",
    textareaPlaceholder:
      "Мысалы:\n3x + 6 = 21\n3x = 27\nx = 9",
    checkDraftBtn: "Жазбаны тексеру",
    clearDraftBtn: "Тазарту",
    tryExampleBtn: "Мысалмен толтыру",
    emptyResultTitle: "Тексеру нәтижесі осында шығады",
    emptyResultSub:
      "Сол жаққа өз шешіміңізді жазып, «Жазбаны тексеру» батырмасын басыңыз немесе төмендегі дайын мысалды таңдаңыз.",
    presetsLabel: "Немесе дайын мысалды көріңіз:",
    preset1: "Мысал: негізі 0,5 логарифм",
    preset2: "Мысал: квадрат түбір √((x−5)²)",
    preset3: "Мысал: 3x + 6 = 21 таңба ауыстыру",
    preset4: "Мысал: Виет теоремасы x² − 9x + 14 = 0",
    preset5: "Мысал: пирамида көлемі",
    claudeDeepCheckBtn: "Жазба бойынша ИИ-тьюторға сұрақ қою",
    fullLabLink: "Қатемен жұмыс тренажерін толық ашу (қатені табу + жаңа есеп)"
  },
  uz: {
    title: "Yechim qoralamasini tekshirish",
    sub: "Qaysi qatorda matematik qoida yoki aniqlanish sohasi buzilganini tekshirish uchun o‘z yechimingiz qadamlarini kiriting.",
    modeDraft: "O‘z qoralamamni tekshirish",
    modeBlitz: "Xatoli misollar (trenajyor)",
    exampleBadge: "Namuna",
    streakLabel: "To‘g‘ri seriya",
    disarmedLabel: "Topilgan xatolar",
    timerEnableBtn: "Vaqt rejimi (60 soniya)",
    timerRunningLabel: "Qolgan vaqt",
    timerReset: "Taymerni o‘chirish",
    selectTrapPrompt: "Tayyor namuna: matematik qoida birinchi marta buzilgan qatorni (01–04) bosing:",
    pointsAtStake: "Imtihondagi vazni:",
    ptsUnit: "ball",
    statusValid: "To‘g‘ri qadam",
    statusFracture: "Birinchi xato",
    statusCascade: "Oldingi xato oqibati",
    foundCorrectTitle: "To‘g‘ri! Qoida buzilgan qator topildi.",
    foundWrongTitle: "Bu qatordagi amal to‘g‘ri yoki oldingi qator oqibati.",
    correctedLabel: "Qadamning to‘g‘ri yozilishi:",
    whyLabel: "Xato sababi:",
    preservedLabel: "To‘g‘ri bajarilgan qism:",
    askClaudeBtn: "Shu qadamni AI-tyutor bilan tahlil qilish",
    openTopicBtn: "Mavzu darsini ochish",
    nextTrapBtn: "Keyingi misol",
    customDraftTitle: "Yechim qadamlaringizni kiriting",
    customDraftSub:
      "Har bir qadamni yangi qatordan yozing va «Qoralamani tekshirish» tugmasini bosing.",
    textareaLabel: "Sizning yechimingiz (1 qator = 1 qadam):",
    textareaPlaceholder:
      "Masalan:\n3x + 6 = 21\n3x = 27\nx = 9",
    checkDraftBtn: "Qoralamani tekshirish",
    clearDraftBtn: "Tozalash",
    tryExampleBtn: "Namuna bilan to‘ldirish",
    emptyResultTitle: "Tekshiruv natijasi shu yerda chiqadi",
    emptyResultSub:
      "Chap tomonga o‘z yechimingizni yozib «Qoralamani tekshirish» tugmasini bosing yoki quyidagi tayyor namunalardan birini tanlang.",
    presetsLabel: "Yoki tayyor namunani ko‘ring:",
    preset1: "Namuna: asosi 0,5 bo‘lgan logarifm",
    preset2: "Namuna: kvadrat ildiz √((x−5)²)",
    preset3: "Namuna: 3x + 6 = 21 ishora ko‘chirish",
    preset4: "Namuna: Viyet teoremasi x² − 9x + 14 = 0",
    preset5: "Namuna: piramida hajmi",
    claudeDeepCheckBtn: "Qoralama bo‘yicha AI-tyutorga savol berish",
    fullLabLink: "Xatolar ustida ishlash trenajyorini to‘liq ochish"
  }
} as const;

const customDraftPresets = [
  "log_0.5(x - 3) > -2\nx - 3 > 4\nx > 7",
  "√((x - 5)²) + x при x = 2\nx - 5 + x = 2x - 5\n2·2 - 5 = -1",
  "3x + 6 = 21\n3x = 27\nx = 9",
  "x² - 9x + 14 = 0\nx₁ + x₂ = -9\nx₁ · x₂ = 14",
  "a = 6, h = 5 (правильная пирамида)\nS_осн = 6² = 36\nV = S_осн · h = 36 · 5 = 180"
];

function stripDuplicateStepPrefix(text: string): string {
  return text.replace(/^\s*\d+[\)\.]\s*/, "");
}

export function XrayTrapView({
  lang,
  userProfile,
  onUpdateStats,
  onSelectTopic,
  onAskClaude
}: {
  lang: Language;
  lastUntScaled50?: number | null;
  masteredTopicsCount?: number;
  weakTopics?: TopicId[];
  userProfile: UserProfile | null;
  onUpdateStats: (streak: number, disarmedTotal: number, targetUni?: UniversityId) => void;
  onSelectTopic: (topic: TopicId) => void;
  onAskClaude: (topic: TopicId, prompt: string) => void;
}) {
  const c = xrayCopy[lang];
  // Default to "draft" (Check my own draft) with an empty textarea!
  const [subMode, setSubMode] = useState<"draft" | "blitz">("draft");
  const [caseIdx, setCaseIdx] = useState(0);
  const [pickedLine, setPickedLine] = useState<number | null>(null);
  const [streak, setStreak] = useState(userProfile?.trapBlitzBestStreak ?? 0);
  const [disarmed, setDisarmed] = useState(userProfile?.disarmedTrapsCount ?? 0);

  // Optional 60-second blitz timer — only shown when started
  const [secondsLeft, setSecondsLeft] = useState<number | null>(null);
  // Start EMPTY so the user never sees a pre-filled foreign solution or fake "+2 points" before checking
  const [draftText, setDraftText] = useState<string>("");
  const [checkedReport, setCheckedReport] = useState<CustomDraftAnalysis | null>(null);
  const [isPresetExample, setIsPresetExample] = useState<boolean>(false);

  const currentTrap = untTrapCases[caseIdx % untTrapCases.length];
  const lines = currentTrap.draftLines[lang];
  const isFractureFound = pickedLine === currentTrap.fractureIndex;

  useEffect(() => {
    if (secondsLeft === null || secondsLeft <= 0) return;
    const id = window.setInterval(() => {
      setSecondsLeft((prev) => (prev !== null && prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => window.clearInterval(id);
  }, [secondsLeft]);

  function handlePickLine(idx: number) {
    setPickedLine(idx);
    if (idx === currentTrap.fractureIndex) {
      const nextStreak = streak + 1;
      const nextDisarmed = disarmed + 1;
      setStreak(nextStreak);
      setDisarmed(nextDisarmed);
      onUpdateStats(nextStreak, nextDisarmed);
    } else {
      setStreak(0);
    }
  }

  function handleNextTrap() {
    setPickedLine(null);
    setCaseIdx((prev) => (prev + 1) % untTrapCases.length);
  }

  function handleCheckDraft() {
    if (!draftText.trim()) return;
    setCheckedReport(analyzeCustomDraft(draftText, lang));
  }

  function handleLoadPreset(presetIdx: number) {
    const sample = customDraftPresets[presetIdx] ?? customDraftPresets[0];
    setDraftText(sample);
    setIsPresetExample(true);
    setCheckedReport(analyzeCustomDraft(sample, lang));
  }

  function handleClearDraft() {
    setDraftText("");
    setCheckedReport(null);
    setIsPresetExample(false);
  }

  return (
    <section className="xray-shell" aria-label={c.title}>
      {/* Header Banner */}
      <div className="xray-hero-card">
        <div className="xray-hero-top">
          <div>
            <h2 className="xray-title">{c.title}</h2>
            <p className="xray-sub">{c.sub}</p>
          </div>
          {(streak > 0 || disarmed > 0) && (
            <div className="xray-kpi-row">
              <div className="xray-kpi-pill">
                <Flame size={16} className="text-amber-700" />
                <div>
                  <div className="xray-kpi-val">{streak}</div>
                  <div className="xray-kpi-lbl">{c.streakLabel}</div>
                </div>
              </div>
              <div className="xray-kpi-pill">
                <Zap size={16} className="text-emerald-700" />
                <div>
                  <div className="xray-kpi-val">{disarmed}</div>
                  <div className="xray-kpi-lbl">{c.disarmedLabel}</div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Sub-mode switcher: 1. Проверить свой черновик (default) | 2. Примеры с ошибками */}
        <div className="xray-mode-tabs" role="tablist">
          <button
            type="button"
            role="tab"
            aria-selected={subMode === "draft"}
            className={`xray-mode-btn ${subMode === "draft" ? "active" : ""}`}
            onClick={() => setSubMode("draft")}
          >
            <Microscope size={14} />
            <span>{c.modeDraft}</span>
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={subMode === "blitz"}
            className={`xray-mode-btn ${subMode === "blitz" ? "active" : ""}`}
            onClick={() => setSubMode("blitz")}
          >
            <Zap size={14} />
            <span>{c.modeBlitz}</span>
          </button>
        </div>
      </div>

      {/* MODE 1 (DEFAULT): CHECK USER'S OWN DRAFT */}
      {subMode === "draft" && (
        <div className="xray-stage-card">
          <div className="xray-custom-head">
            <h3 className="xray-sub-heading">{c.customDraftTitle}</h3>
            <p className="small">{c.customDraftSub}</p>
          </div>

          <div className="xray-custom-split">
            <div className="xray-editor-col">
              <div className="flex items-center justify-between gap-2 mb-1.5">
                <label htmlFor="xray-draft-textarea" className="field-label m-0">
                  {c.textareaLabel}
                </label>
                {isPresetExample && (
                  <span className="section-pill">{c.exampleBadge}</span>
                )}
              </div>
              <textarea
                id="xray-draft-textarea"
                rows={5}
                value={draftText}
                placeholder={c.textareaPlaceholder}
                onChange={(e) => {
                  setDraftText(e.target.value);
                  setIsPresetExample(false);
                }}
                className="xray-draft-textarea"
              />
              <div className="flex flex-wrap items-center gap-2 mt-3">
                <Button
                  type="button"
                  className="min-h-11"
                  disabled={!draftText.trim()}
                  onClick={handleCheckDraft}
                >
                  <CheckCircle2 size={15} />
                  <span>{c.checkDraftBtn}</span>
                </Button>
                {draftText.trim() ? (
                  <Button
                    type="button"
                    variant="outline"
                    className="min-h-11"
                    onClick={handleClearDraft}
                  >
                    <Eraser size={15} />
                    <span>{c.clearDraftBtn}</span>
                  </Button>
                ) : (
                  <Button
                    type="button"
                    variant="outline"
                    className="min-h-11"
                    onClick={() => handleLoadPreset(0)}
                  >
                    <span>{c.tryExampleBtn}</span>
                  </Button>
                )}
                {draftText.trim() && (
                  <Button
                    type="button"
                    variant="outline"
                    className="min-h-11"
                    onClick={() =>
                      onAskClaude(
                        "functions",
                        `Проверь по строкам мой черновик решения и укажи первую строку, где нарушена равносильность или потеряно ОДЗ:\n${draftText}`
                      )
                    }
                  >
                    <Sparkles size={14} />
                    <span>{c.claudeDeepCheckBtn}</span>
                  </Button>
                )}
              </div>

              {/* Secondary preset examples clearly labeled as "Пример: ..." */}
              <div className="xray-presets-bar mt-4 pt-3 border-t border-border">
                <span className="small font-semibold block mb-1.5">{c.presetsLabel}</span>
                <div className="xray-preset-chips">
                  {[c.preset1, c.preset2, c.preset3, c.preset4, c.preset5].map((label, i) => (
                    <button
                      key={label}
                      type="button"
                      className="prompt-chip"
                      onClick={() => handleLoadPreset(i)}
                    >
                      {label}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="xray-trace-col">
              {!checkedReport ? (
                <div className="callout">
                  <strong className="block text-sm mb-1">{c.emptyResultTitle}</strong>
                  <p className="small m-0">{c.emptyResultSub}</p>
                </div>
              ) : (
                <>
                  <div className="xray-trace-header">
                    <div className="flex flex-wrap items-center gap-2">
                      {isPresetExample && (
                        <span className="section-pill">{c.exampleBadge}</span>
                      )}
                      <strong>{checkedReport.detectedTrapTitle}</strong>
                    </div>
                  </div>
                  <p className="small mb-3">{checkedReport.summary}</p>
                  <div className="xray-trace-items">
                    {checkedReport.lines.map((line) => (
                      <div key={line.lineNumber} className={`xray-trace-item trace-${line.status}`}>
                        <div className="xray-trace-item-top">
                          <span className="xray-line-num">0{line.lineNumber}</span>
                          <code className="xray-trace-expr">
                            {stripDuplicateStepPrefix(line.expression)}
                          </code>
                          <span className="xray-line-tag">{line.badge}</span>
                        </div>
                        <p className="xray-trace-note">{line.note}</p>
                        {line.correctedLine && (
                          <p className="xray-trace-fix inline-flex items-center gap-1">
                            <CheckCircle2 size={14} />
                            <span>
                              {c.correctedLabel}{" "}
                              <strong>{stripDuplicateStepPrefix(line.correctedLine)}</strong>
                            </span>
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      )}

      {/* MODE 2: EXAMPLE CASES WITH ERRORS (Explicitly badged as Examples) */}
      {subMode === "blitz" && (
        <div className="xray-stage-card">
          <div className="xray-blitz-bar">
            <div className="xray-trap-selector">
              {untTrapCases.map((tc, idx) => (
                <button
                  key={tc.id}
                  type="button"
                  className={`xray-case-chip ${idx === caseIdx ? "active" : ""}`}
                  onClick={() => {
                    setCaseIdx(idx);
                    setPickedLine(null);
                  }}
                >
                  {c.exampleBadge} #{idx + 1} · {topicName(tc.topic, lang)}
                </button>
              ))}
            </div>

            <div className="xray-timer-box">
              {secondsLeft === null ? (
                <Button size="sm" variant="outline" onClick={() => setSecondsLeft(60)}>
                  <Clock size={14} />
                  <span>{c.timerEnableBtn}</span>
                </Button>
              ) : (
                <>
                  <span className="xray-timer-text tabular-nums">
                    {c.timerRunningLabel}: <strong>{secondsLeft}s</strong>
                  </span>
                  <Button size="sm" variant="ghost" onClick={() => setSecondsLeft(null)}>
                    <RotateCcw size={14} />
                    <span>{c.timerReset}</span>
                  </Button>
                </>
              )}
            </div>
          </div>

          <div className="xray-problem-box">
            <div className="xray-problem-meta">
              <span className="section-pill">{c.exampleBadge}</span>
              <span className="xray-code-badge">{currentTrap.code}</span>
              <span className="xray-points-badge">
                {c.pointsAtStake} {currentTrap.pointsAtStake} {c.ptsUnit}
              </span>
            </div>
            <p className="xray-problem-math">{currentTrap.problem[lang]}</p>
            <p className="xray-prompt-hint">{c.selectTrapPrompt}</p>
          </div>

          <div className="xray-lines-list" role="group" aria-label={c.selectTrapPrompt}>
            {lines.map((rawLineText, idx) => {
              const lineText = stripDuplicateStepPrefix(rawLineText);
              const isSelected = pickedLine === idx;
              const showFullXray = isFractureFound;
              let statusClass = "";
              let statusLabel = "";

              if (showFullXray) {
                if (idx < currentTrap.fractureIndex) {
                  statusClass = "trace-valid";
                  statusLabel = c.statusValid;
                } else if (idx === currentTrap.fractureIndex) {
                  statusClass = "trace-fracture";
                  statusLabel = c.statusFracture;
                } else {
                  statusClass = "trace-cascade";
                  statusLabel = c.statusCascade;
                }
              } else if (isSelected && idx !== currentTrap.fractureIndex) {
                statusClass = "trace-wrong-pick";
                statusLabel = c.statusValid;
              }

              return (
                <button
                  key={idx}
                  type="button"
                  className={`xray-line-row ${statusClass} ${isSelected ? "selected" : ""}`}
                  onClick={() => handlePickLine(idx)}
                >
                  <span className="xray-line-num">0{idx + 1}</span>
                  <span className="xray-line-code">{lineText}</span>
                  {statusLabel && <span className="xray-line-tag">{statusLabel}</span>}
                </button>
              );
            })}
          </div>

          {pickedLine !== null && (
            <div
              className={`xray-diagnosis-panel ${isFractureFound ? "ok" : "warn"}`}
              role="status"
              aria-live="polite"
            >
              <div className="xray-diag-head">
                {isFractureFound ? (
                  <>
                    <CheckCircle2 size={18} className="text-emerald-700" />
                    <strong>{c.foundCorrectTitle}</strong>
                  </>
                ) : (
                  <>
                    <ShieldAlert size={18} className="text-amber-800" />
                    <strong>{c.foundWrongTitle}</strong>
                  </>
                )}
              </div>

              {isFractureFound && (
                <div className="xray-diag-grid">
                  <div className="xray-diag-block">
                    <span className="xray-diag-lbl">{c.correctedLabel}</span>
                    <p className="xray-diag-math">
                      {stripDuplicateStepPrefix(currentTrap.correctedLine[lang])}
                    </p>
                  </div>
                  <div className="xray-diag-block">
                    <span className="xray-diag-lbl">{c.whyLabel}</span>
                    <p>{currentTrap.whyFractured[lang]}</p>
                  </div>
                  <div className="xray-diag-block preserved">
                    <span className="xray-diag-lbl">{c.preservedLabel}</span>
                    <p>{currentTrap.preservedSkillNote[lang]}</p>
                  </div>
                </div>
              )}

              <div className="xray-diag-actions">
                <Button size="sm" className="min-h-10" onClick={handleNextTrap}>
                  <span>{c.nextTrapBtn}</span>
                  <ArrowRight size={14} />
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  className="min-h-10"
                  onClick={() => onAskClaude(currentTrap.topic, currentTrap.claudePrompt[lang])}
                >
                  <Sparkles size={14} />
                  {c.askClaudeBtn}
                </Button>
                <button
                  type="button"
                  className="quiet-text-action inline-flex items-center gap-1"
                  onClick={() => onSelectTopic(currentTrap.topic)}
                >
                  <span>
                    {c.openTopicBtn}: {topicName(currentTrap.topic, lang)}
                  </span>
                  <ArrowRight size={13} />
                </button>
              </div>
            </div>
          )}

          <div className="mt-4 pt-3 border-t border-border flex flex-wrap items-center justify-between gap-2">
            <a
              href={`/lab?lang=${lang}&topic=${currentTrap.topic}`}
              className="underline font-semibold text-xs inline-flex items-center gap-1.5 min-h-9"
            >
              <FlaskConical size={14} />
              <span>{c.fullLabLink}</span>
              <ArrowRight size={13} />
            </a>
          </div>
        </div>
      )}
    </section>
  );
}
