"use client";
import { useEffect, useState } from "react";
import {
  ArrowRight,
  CheckCircle2,
  Clock,
  Flame,
  GraduationCap,
  Info,
  Microscope,
  RotateCcw,
  ShieldAlert,
  Sparkles,
  Zap
} from "lucide-react";
import { Button } from "@/components/ui/button";
import type { Language, TopicId } from "@/lib/curriculum";
import { topicName } from "@/lib/error-lab";
import { analyzeCustomDraft, untTrapCases } from "@/lib/xray-trace";
import { calculateGrantRadar, type UniversityId, type UserProfile } from "@/lib/user-profile";

const xrayCopy = {
  ru: {
    title: "Проверка решения по шагам",
    sub: "Найдите строку, в которой впервые нарушилось математическое правило или область допустимых значений (ОДЗ). Верные шаги сохраняются, исправляется только причина ошибки.",
    modeBlitz: "Примеры решений с ошибкой",
    modeDraft: "Проверить свой черновик",
    modeGrant: "Ориентиры грантов РК (справочник)",
    streakLabel: "Серия верных",
    disarmedLabel: "Найдено ошибок",
    timerEnableBtn: "Режим на время (60 сек)",
    timerRunningLabel: "Осталось времени",
    timerReset: "Выключить таймер",
    selectTrapPrompt: "Нажмите на строку решения (01–04), в которой впервые допущена ошибка:",
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
    askClaudeBtn: "Задать вопрос ИИ-тьютору по этому шагу",
    openTopicBtn: "Открыть тему",
    nextTrapBtn: "Следующий пример",
    customDraftTitle: "Построчная проверка вашего черновика",
    customDraftSub: "Введите шаги решения (по одному переходу на строку) или выберите готовый пример ниже.",
    presetsLabel: "Примеры черновиков:",
    preset1: "Логарифм с основанием 0,5",
    preset2: "Корень из квадрата √((x−5)²)",
    preset3: "Знак при переносе 3x + 6 = 21",
    preset4: "Сумма корней Виета x² − 9x + 14 = 0",
    preset5: "Объём пирамиды без 1/3",
    claudeDeepCheckBtn: "Разобрать черновик с ИИ-тьютором",
    grantRadarTitle: "Справочные ориентиры грантов вузов РК по профильной математике",
    grantRadarSub: "Ориентировочное сопоставление балла по профильной математике (из 50) с порогами групп образовательных программ (ГОП) по открытым данным НЦТ РК (2024–2025).",
    notAssessedTitle: "Ваш уровень ещё не оценён — ниже показан демонстрационный пример расчёта (22/50)",
    notAssessedSub: "Решите задачи в разделе «Занятие» или пройдите диагностический вариант в «Пробном ЕНТ», чтобы расчёт опирался на ваши реальные ответы.",
    currentScoreLabel: "Текущий балл / пример",
    notAssessedBadge: "Ещё не оценено (пример 22/50)",
    trapLossLabel: "Потери на ОДЗ и знаках",
    theoryLossLabel: "Теоретические пробелы",
    afterFixLabel: "Ориентир без ошибок ОДЗ",
    uniColThreshold: "Ориентир по профильной мат.",
    uniColTotal140: "Итоговый ориентир ЕНТ",
    uniColCurrent: "Соответствие порогу сейчас",
    uniColAfter: "При устранении ошибок ОДЗ",
    targetBadge: "Выбранный ориентир",
    sourceLabel: "Источник данных: НЦТ РК (testcenter.kz)"
  },
  kk: {
    title: "Шешімді қадамдап тексеру",
    sub: "Математикалық ереже немесе анықталу облысы (АОО) алғаш бұзылған жолды табыңыз. Дұрыс қадамдар сақталады, тек қатенің себебі түзетіледі.",
    modeBlitz: "Қатесі бар шешім үлгілері",
    modeDraft: "Өз шешіміңді тексеру",
    modeGrant: "ҚР грант бағдарлары (анықтамалық)",
    streakLabel: "Дұрыс серия",
    disarmedLabel: "Табылған қателер",
    timerEnableBtn: "Уақытпен режим (60 сек)",
    timerRunningLabel: "Қалған уақыт",
    timerReset: "Таймерді өшіру",
    selectTrapPrompt: "Математикалық ереже алғаш бұзылған шешім жолын (01–04) басыңыз:",
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
    openTopicBtn: "Тақырыпты ашу",
    nextTrapBtn: "Келесі мысал",
    customDraftTitle: "Шешім жазбасын жолдап тексеру",
    customDraftSub: "Шешім қадамдарын (әр жолға 1 қадам) енгізіңіз немесе төмендегі дайын үлгіні таңдаңыз.",
    presetsLabel: "Жазба үлгілері:",
    preset1: "Негізі 0,5 логарифм",
    preset2: "Квадрат түбір √((x−5)²)",
    preset3: "3x + 6 = 21 таңба ауыстыру",
    preset4: "Виет қосындысы x² − 9x + 14 = 0",
    preset5: "Пирамида көлемі (1/3 коэффициенсіз)",
    claudeDeepCheckBtn: "Жазбаны ИИ-тьютормен тексеру",
    grantRadarTitle: "Профильдік математика бойынша ҚР ЖОО грант бағдарлары",
    grantRadarSub: "Профильдік математика балын (50-ден) ҚР ҰТО (2024–2025) ашық деректері бойынша БББ топтарының шекті балдарымен салыстыру.",
    notAssessedTitle: "Деңгейіңіз әлі бағаланбаған — төменде есептеудің демонстрациялық мысалы (22/50) көрсетілген",
    notAssessedSub: "Нақты жауаптарыңыз бойынша есептеу үшін «Сабақ» бөлімінде есеп шығарыңыз немесе «Сынақ ҰБТ» тапсырыңыз.",
    currentScoreLabel: "Ағымдағы балл / мысал",
    notAssessedBadge: "Әлі бағаланбаған (мысал 22/50)",
    trapLossLabel: "АОО және таңба жоғалтулары",
    theoryLossLabel: "Теориялық олқылық",
    afterFixLabel: "АОО қатесіз бағдар",
    uniColThreshold: "Профильдік мат. бағдары",
    uniColTotal140: "Жалпы ҰБТ бағдары",
    uniColCurrent: "Қазіргі сәйкестік",
    uniColAfter: "АОО қателерін түзеткен соң",
    targetBadge: "Таңдалған бағдар",
    sourceLabel: "Дереккөз: ҚР ҰТО (testcenter.kz)"
  },
  uz: {
    title: "Yechimni qadam-baqadam tekshirish",
    sub: "Matematik qoida yoki aniqlanish sohasi birinchi marta buzilgan qatorni toping. To‘g‘ri qadamlar saqlanadi, faqat xato sababi tuzatiladi.",
    modeBlitz: "Xatoli yechim namunalari",
    modeDraft: "O‘z qoralamangizni tekshirish",
    modeGrant: "OTM grant mo‘ljallari (ma’lumotnoma)",
    streakLabel: "To‘g‘ri seriya",
    disarmedLabel: "Topilgan xatolar",
    timerEnableBtn: "Vaqt rejimi (60 soniya)",
    timerRunningLabel: "Qolgan vaqt",
    timerReset: "Taymerni o‘chirish",
    selectTrapPrompt: "Matematik qoida birinchi marta buzilgan yechim qatorini (01–04) bosing:",
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
    openTopicBtn: "Mavzuni ochish",
    nextTrapBtn: "Keyingi misol",
    customDraftTitle: "Qoralamani qator-baqator tekshirish",
    customDraftSub: "Yechim qadamlarini (har bir qatorga 1 tadan) kiriting yoki quyidagi tayyor namunalardan birini tanlang.",
    presetsLabel: "Qoralama namunalari:",
    preset1: "Asosi 0,5 bo‘lgan logarifm",
    preset2: "Kvadrat ildiz √((x−5)²)",
    preset3: "3x + 6 = 21 ishora ko‘chirish",
    preset4: "Viyet yig‘indisi x² − 9x + 14 = 0",
    preset5: "Piramida hajmi (1/3 siz)",
    claudeDeepCheckBtn: "Qoralamani AI-tyutor bilan tekshirish",
    grantRadarTitle: "Matematika bo‘yicha OTM grant mo‘ljallari",
    grantRadarSub: "Matematika ballini (50 dan) 2024–2025 o‘quv yili ochiq ma’lumotlari asosida ta’lim dasturlari guruhlari (TDG) bilan taqqoslash.",
    notAssessedTitle: "Darajangiz hali baholanmagan — quyida hisoblashning namuna misoli (22/50) ko‘rsatilgan",
    notAssessedSub: "Haqiqiy javoblaringiz asosida hisoblash uchun «Mashg‘ulot» bo‘limida masalalar yeching yoki «Sinov UBT» topshiring.",
    currentScoreLabel: "Joriy ball / namuna",
    notAssessedBadge: "Hali baholanmagan (namuna 22/50)",
    trapLossLabel: "Ishora va AS yo‘qotishlari",
    theoryLossLabel: "Nazariy bo‘shliq",
    afterFixLabel: "Xatolarsiz mo‘ljal",
    uniColThreshold: "Matematika mo‘ljali",
    uniColTotal140: "Umumiy UBT mo‘ljali",
    uniColCurrent: "Hozirgi moslik",
    uniColAfter: "Xatolar tuzatilgach",
    targetBadge: "Tanlangan mo‘ljal",
    sourceLabel: "Manba: testcenter.kz"
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
  lastUntScaled50,
  masteredTopicsCount,
  weakTopics,
  userProfile,
  onUpdateStats,
  onSelectTopic,
  onAskClaude
}: {
  lang: Language;
  lastUntScaled50: number | null;
  masteredTopicsCount: number;
  weakTopics: TopicId[];
  userProfile: UserProfile | null;
  onUpdateStats: (streak: number, disarmedTotal: number, targetUni?: UniversityId) => void;
  onSelectTopic: (topic: TopicId) => void;
  onAskClaude: (topic: TopicId, prompt: string) => void;
}) {
  const c = xrayCopy[lang];
  const [subMode, setSubMode] = useState<"blitz" | "draft" | "grant">("blitz");
  const [caseIdx, setCaseIdx] = useState(0);
  const [pickedLine, setPickedLine] = useState<number | null>(null);
  const [streak, setStreak] = useState(userProfile?.trapBlitzBestStreak ?? 0);
  const [disarmed, setDisarmed] = useState(userProfile?.disarmedTrapsCount ?? 0);
  const [selectedUni, setSelectedUni] = useState<UniversityId>(userProfile?.targetUniversity ?? "kbtu");

  // Optional 60-second blitz timer — only shown when started
  const [secondsLeft, setSecondsLeft] = useState<number | null>(null);
  const [draftText, setDraftText] = useState<string>(customDraftPresets[0]);

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
      onUpdateStats(nextStreak, nextDisarmed, selectedUni);
    } else {
      setStreak(0);
    }
  }

  function handleNextTrap() {
    setPickedLine(null);
    setCaseIdx((prev) => (prev + 1) % untTrapCases.length);
  }

  const draftAnalysis = analyzeCustomDraft(draftText, lang);
  const grantRadar = calculateGrantRadar(lastUntScaled50, masteredTopicsCount, weakTopics, disarmed, lang);

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

        {/* Sub-mode switcher */}
        <div className="xray-mode-tabs" role="tablist">
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
            aria-selected={subMode === "grant"}
            className={`xray-mode-btn ${subMode === "grant" ? "active" : ""}`}
            onClick={() => setSubMode("grant")}
          >
            <GraduationCap size={14} />
            <span>{c.modeGrant}</span>
          </button>
        </div>
      </div>

      {/* MODE 1: STEP VERIFICATION EXAMPLES (+ OPTIONAL 60S TIMER) */}
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
                  #{idx + 1} · {topicName(tc.topic, lang)}
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
                <Button size="sm" onClick={handleNextTrap}>
                  <span>{c.nextTrapBtn}</span>
                  <ArrowRight size={14} />
                </Button>
                <Button
                  size="sm"
                  variant="outline"
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
        </div>
      )}

      {/* MODE 2: LIVE CUSTOM DRAFT DEBUGGER */}
      {subMode === "draft" && (
        <div className="xray-stage-card">
          <div className="xray-custom-head">
            <h3 className="xray-sub-heading">{c.customDraftTitle}</h3>
            <p className="small">{c.customDraftSub}</p>
          </div>

          <div className="xray-presets-bar">
            <span className="small font-semibold">{c.presetsLabel}</span>
            <div className="xray-preset-chips">
              {[c.preset1, c.preset2, c.preset3, c.preset4, c.preset5].map((label, i) => (
                <button
                  key={label}
                  type="button"
                  className="prompt-chip"
                  onClick={() => setDraftText(customDraftPresets[i])}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>

          <div className="xray-custom-split">
            <div className="xray-editor-col">
              <label htmlFor="xray-draft-textarea" className="field-label">
                Черновик по строкам (1 строка = 1 шаг)
              </label>
              <textarea
                id="xray-draft-textarea"
                rows={5}
                value={draftText}
                onChange={(e) => setDraftText(e.target.value)}
                className="xray-draft-textarea"
              />
              <div className="mt-3">
                <Button
                  size="sm"
                  onClick={() =>
                    onAskClaude(
                      "functions",
                      `Проверь по строкам мой черновик решения и укажи первую строку, где нарушена равносильность или потеряно ОДЗ:\n${draftText}`
                    )
                  }
                >
                  <Sparkles size={14} />
                  {c.claudeDeepCheckBtn}
                </Button>
              </div>
            </div>

            <div className="xray-trace-col">
              <div className="xray-trace-header">
                <strong>{draftAnalysis.detectedTrapTitle}</strong>
                <span className="xray-points-badge">
                  +{draftAnalysis.savedPointsEstimate} {c.ptsUnit}
                </span>
              </div>
              <p className="small mb-3">{draftAnalysis.summary}</p>
              <div className="xray-trace-items">
                {draftAnalysis.lines.map((line) => (
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
            </div>
          </div>
        </div>
      )}

      {/* MODE 3: KAZAKHSTAN UNIVERSITY GRANT ORIENTATION REFERENCE */}
      {subMode === "grant" && (
        <div className="xray-stage-card">
          <div className="xray-custom-head">
            <h3 className="xray-sub-heading">{c.grantRadarTitle}</h3>
            <p className="small">{c.grantRadarSub}</p>
          </div>

          {!grantRadar.isAssessed && (
            <div className="callout mb-4">
              <strong className="flex items-center gap-1.5 text-sm">
                <Info size={16} />
                <span>{c.notAssessedTitle}</span>
              </strong>
              <p className="small mt-1 mb-0">{c.notAssessedSub}</p>
            </div>
          )}

          <div className="grant-metrics-grid">
            <div className="grant-metric-box">
              <span className="grant-metric-lbl">{c.currentScoreLabel}</span>
              <strong className="grant-metric-val">
                {grantRadar.isAssessed
                  ? `${grantRadar.currentProjectedScore} / 50`
                  : c.notAssessedBadge}
              </strong>
            </div>
            <div className="grant-metric-box warn">
              <span className="grant-metric-lbl">{c.trapLossLabel}</span>
              <strong className="grant-metric-val">−{grantRadar.lostToCognitiveTraps} б.</strong>
            </div>
            <div className="grant-metric-box">
              <span className="grant-metric-lbl">{c.theoryLossLabel}</span>
              <strong className="grant-metric-val">−{grantRadar.lostToTheoryGaps} б.</strong>
            </div>
            <div className="grant-metric-box ok">
              <span className="grant-metric-lbl">{c.afterFixLabel}</span>
              <strong className="grant-metric-val">{grantRadar.scoreAfterTrapFix} / 50</strong>
            </div>
          </div>

          <div className="grant-uni-list">
            {grantRadar.universities.map((u) => {
              const isTarget = u.id === selectedUni;
              return (
                <div
                  key={u.id}
                  className={`grant-uni-row ${isTarget ? "target" : ""}`}
                  onClick={() => {
                    setSelectedUni(u.id);
                    onUpdateStats(streak, disarmed, u.id);
                  }}
                >
                  <div className="grant-uni-info">
                    <div className="grant-uni-title-line">
                      <GraduationCap size={16} />
                      <strong>{u.shortName}</strong>
                      <span className="section-pill">ГОП {u.gopCode}</span>
                      {isTarget && <span className="grant-target-pill">{c.targetBadge}</span>}
                    </div>
                    <span className="small">{u.fullName}</span>
                    <span className="grant-threshold-note">
                      {c.uniColThreshold}: <strong>{u.minMathScore}–{u.safeMathScore} / 50</strong> ·{" "}
                      {c.uniColTotal140}: <strong>{u.totalUntGrantRef140} / 140</strong> ({u.referenceYear})
                    </span>
                  </div>

                  <div className="grant-uni-bars">
                    <div className="grant-bar-group">
                      <div className="grant-bar-label">
                        <span>
                          {c.uniColCurrent} {!grantRadar.isAssessed ? "(пример)" : ""}
                        </span>
                        <strong>{u.currentChancePercent}%</strong>
                      </div>
                      <div className="grant-bar-track">
                        <div
                          className="grant-bar-fill current"
                          style={{ width: `${u.currentChancePercent}%` }}
                        />
                      </div>
                    </div>

                    <div className="grant-bar-group">
                      <div className="grant-bar-label">
                        <span>{c.uniColAfter}</span>
                        <strong className="text-emerald-700">
                          {u.afterFixChancePercent}% (+
                          {Math.max(0, u.afterFixChancePercent - u.currentChancePercent)}%)
                        </strong>
                      </div>
                      <div className="grant-bar-track">
                        <div
                          className="grant-bar-fill after"
                          style={{ width: `${u.afterFixChancePercent}%` }}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <p className="small text-muted-foreground mt-3 mb-0">
            {grantRadar.methodologyNote}{" "}
            <a
              href="https://testcenter.kz/?page_id=15074&lang=ru"
              target="_blank"
              rel="noopener noreferrer"
              className="underline font-semibold"
            >
              {c.sourceLabel}
            </a>
          </p>
        </div>
      )}
    </section>
  );
}
