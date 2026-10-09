"use client";
import { useEffect, useState } from "react";
import { ArrowRight, CheckCircle2, Flame, GraduationCap, Microscope, RotateCcw, ShieldAlert, Sparkles, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { Language, TopicId } from "@/lib/curriculum";
import { topicName } from "@/lib/error-lab";
import { analyzeCustomDraft, untTrapCases } from "@/lib/xray-trace";
import { calculateGrantRadar, kzUniversities, type UniversityId, type UserProfile } from "@/lib/user-profile";

const xrayCopy = {
  ru: {
    kicker: "УНИКАЛЬНАЯ ТЕХНОЛОГИЯ ANIQ AI · LOGIC FRACTURE X-RAY",
    title: "Рентген черновика, 60-сек детектор ловушек и Радар гранта РК",
    sub: "Обычные тесты ставят 0 баллов за всю задачу из-за одной забытой скобки ОДЗ. Aniq AI находит точную строку излома логики, не штрафует усвоенные темы и считает прирост шансов на госгрант в вузы Казахстана.",
    modeBlitz: "Блиц «Детектор ловушки за 60 сек»",
    modeDraft: "Рентген своего черновика",
    modeGrant: "Радар гранта ВУЗов РК",
    streakLabel: "Серия без ошибок",
    disarmedLabel: "Обезврежено ловушек",
    timerLabel: "Таймер блица",
    timerStart: "Запустить 60 сек",
    timerReset: "Сбросить",
    selectTrapPrompt: "Кликни прямо на строку решения (1–4), в которой впервые сломалась математическая логика:",
    pointsAtStake: "Цена ловушки на ЕНТ:",
    ptsUnit: "балла",
    statusValid: "ВЕРНЫЙ ШАГ · НАВЫК ЗАСЧИТАН",
    statusFracture: "ТОЧКА ИЗЛОМА ЛОГИКИ",
    statusCascade: "КАСКАДНОЕ СЛЕДСТВИЕ (НЕ ШТРАФУЕТСЯ)",
    foundCorrectTitle: "Точное попадание! Ловушка ЕНТ обезврежена.",
    foundWrongTitle: "На этой строке переход корректен или является следствием. Ищи первопричину!",
    correctedLabel: "Правильная запись этой строки:",
    whyLabel: "Почему здесь теряют баллы:",
    preservedLabel: "Сохранённый навык (не требует переучивания):",
    askClaudeBtn: "Разобрать эту ловушку с Claude API",
    openTopicBtn: "Открыть урок по теме",
    nextTrapBtn: "Следующая ловушка",
    customDraftTitle: "Построчный дебаггер твоего черновика решения",
    customDraftSub: "Вставь шаги своего решения (по 1 переходу на строку) или выбери частый черновик абитуриента ниже. Движок отделит верные шаги от точки излома.",
    presetsLabel: "Примеры черновиков с ловушками ЕНТ:",
    preset1: "Логарифм с основанием 0,5",
    preset2: "Корень из квадрата √((x−5)²)",
    preset3: "Знак при переносе 3x + 6 = 21",
    preset4: "Сумма корней Виета x² − 9x + 14 = 0",
    preset5: "Объём пирамиды без 1/3",
    claudeDeepCheckBtn: "Глубокая проверка черновика через Claude API",
    grantRadarTitle: "Радар государственного гранта РК по профильной математике",
    grantRadarSub: "Декомпозиция твоего прогнозного балла ЕНТ (из 50): сколько баллов теряется из-за незнания формул, а сколько — из-за когнитивных ловушек (ОДЗ, знак, модуль), которые закрываются за 3 вечера.",
    currentScoreLabel: "Текущий прогноз ЕНТ",
    trapLossLabel: "Потери на ловушках (ОДЗ/знак)",
    theoryLossLabel: "Теоретические пробелы",
    afterFixLabel: "Прогноз без ловушек",
    uniColName: "ВУЗ и образовательная программа РК",
    uniColThreshold: "Порог / Грант по мат.",
    uniColCurrent: "Шанс сейчас",
    uniColAfter: "После закрытия ловушек",
    targetBadge: "Твоя цель"
  },
  kk: {
    kicker: "ANIQ AI БІРЕГЕЙ ТЕХНОЛОГИЯСЫ · LOGIC FRACTURE X-RAY",
    title: "Шешім рентгені, 60-сек тұзақ детекторы және ҚР грант радары",
    sub: "Кәдімгі тесттер бір ғана АОО (ОДЗ) жақшасы үшін бүкіл есепке 0 балл қояды. Aniq AI логика үзілген нақты жолды табады, меңгерілген тақырыптарды айыппұлсыз сақтайды және ҚР ЖОО грантына түсу мүмкіндігін есептейді.",
    modeBlitz: "60 сек «ҰБТ тұзағын тап» блиці",
    modeDraft: "Өз шешіміңнің рентгені",
    modeGrant: "ҚР ЖОО грант радары",
    streakLabel: "Қатесіз серия",
    disarmedLabel: "Залалсызданған тұзақ",
    timerLabel: "Блиц таймері",
    timerStart: "60 сек бастау",
    timerReset: "Қайтару",
    selectTrapPrompt: "Математикалық логика алғаш бұзылған шешім жолын (1–4) тікелей басыңыз:",
    pointsAtStake: "ҰБТ-дағы салмағы:",
    ptsUnit: "балл",
    statusValid: "ДҰРЫС ҚАДАМ · ДАҒДЫ ЕСЕПТЕЛДІ",
    statusFracture: "ЛОГИКАЛЫҚ СЫНУ НҮКТЕСІ",
    statusCascade: "КАСКАДТЫҚ САЛДАР (АЙЫППҰЛ ЖОҚ)",
    foundCorrectTitle: "Дәл таптыңыз! ҰБТ тұзағы залалсыздандырылды.",
    foundWrongTitle: "Бұл жолдағы амал дұрыс немесе алдыңғы жолдың салдары. Түпкі себепті іздеңіз!",
    correctedLabel: "Осы жолдың дұрыс жазылуы:",
    whyLabel: "Неліктен мұнда балл жоғалады:",
    preservedLabel: "Сақталған дағды (қайта оқуды қажет етпейді):",
    askClaudeBtn: "Осы тұзақты Claude API-мен талдау",
    openTopicBtn: "Тақырып сабағын ашу",
    nextTrapBtn: "Келесі тұзақ",
    customDraftTitle: "Шешім жазбасының жолдық дебаггері",
    customDraftSub: "Шешім қадамдарын (әр жолға 1 қадам) енгізіңіз немесе төмендегі дайын үлгіні таңдаңыз.",
    presetsLabel: "ҰБТ тұзақтары бар жазба үлгілері:",
    preset1: "Негізі 0,5 логарифм",
    preset2: "Квадрат түбір √((x−5)²)",
    preset3: "3x + 6 = 21 таңба ауыстыру",
    preset4: "Виет қосындысы x² − 9x + 14 = 0",
    preset5: "Пирамида көлемі (1/3 коэффициенсіз)",
    claudeDeepCheckBtn: "Claude API арқылы терең тексеру",
    grantRadarTitle: "Профильдік математика бойынша ҚР мемлекеттік грант радары",
    grantRadarSub: "50 балдық ҰБТ болжамының жіктелуі: қанша балл теориялық олқылықтан, ал қаншасы 3 кеште түзетілетін когнитивтік тұзақтардан (АОО, таңба, модуль) жоғалады.",
    currentScoreLabel: "Қазіргі ҰБТ болжамы",
    trapLossLabel: "Тұзақтардағы жоғалту",
    theoryLossLabel: "Теориялық олқылық",
    afterFixLabel: "Тұзақсыз болжам",
    uniColName: "ҚР ЖОО және білім беру бағдарламасы",
    uniColThreshold: "Шекті / Грант балы",
    uniColCurrent: "Қазіргі мүмкіндік",
    uniColAfter: "Тұзақтарды жойған соң",
    targetBadge: "Таңдалған ЖОО"
  },
  uz: {
    kicker: "ANIQ AI NOYOB TEXNOLOGIYASI · LOGIC FRACTURE X-RAY",
    title: "Qoralama rentgeni, 60-soniya tuzoq detektori va Grant radari",
    sub: "Oddiy testlar bitta unutilgan qavs uchun butun masalaga 0 ball qo‘yadi. Aniq AI mantiq buzilgan aniq qatorni topadi, o‘zlashtirilgan mavzularni jarimasiz saqlaydi va grant imkoniyatini hisoblaydi.",
    modeBlitz: "60 soniya «Tuzoqni top» blitsi",
    modeDraft: "O‘z qoralamangiz rentgeni",
    modeGrant: "OTM grant radari",
    streakLabel: "Xatosiz seriya",
    disarmedLabel: "Topilgan tuzoqlar",
    timerLabel: "Blits taymeri",
    timerStart: "60 soniya boshlash",
    timerReset: "Tiklash",
    selectTrapPrompt: "Matematik mantiq birinchi marta buzilgan yechim qatorini (1–4) bosing:",
    pointsAtStake: "Imtihondagi vazni:",
    ptsUnit: "ball",
    statusValid: "TO‘G‘RI QADAM · KO‘NIKMA TASDIQLANDI",
    statusFracture: "MANTIQIY SINISH NUQTASI",
    statusCascade: "KASKADLI OQIBAT (JARIMA YO‘Q)",
    foundCorrectTitle: "Aniq topdingiz! Imtihon tuzog‘i zararsizlantirildi.",
    foundWrongTitle: "Bu qatordagi amal to‘g‘ri yoki oldingi qator oqibati. Asosiy sababni toping!",
    correctedLabel: "Ushbu qatorning to‘g‘ri yozilishi:",
    whyLabel: "Nega bu yerda ball yo‘qotiladi:",
    preservedLabel: "Saqlangan ko‘nikma (qayta o‘qish shart emas):",
    askClaudeBtn: "Claude API bilan tahlil qilish",
    openTopicBtn: "Mavzu darsini ochish",
    nextTrapBtn: "Keyingi tuzoq",
    customDraftTitle: "Yechim qoralamasining qator-baqator debaggeri",
    customDraftSub: "Yechim qadamlarini (har bir qatorga 1 tadan) kiriting yoki quyidagi tayyor namunalardan birini tanlang.",
    presetsLabel: "Tuzoqli qoralama namunalari:",
    preset1: "Asosi 0,5 bo‘lgan logarifm",
    preset2: "Kvadrat ildiz √((x−5)²)",
    preset3: "3x + 6 = 21 ishora ko‘chirish",
    preset4: "Viyet yig‘indisi x² − 9x + 14 = 0",
    preset5: "Piramida hajmi (1/3 siz)",
    claudeDeepCheckBtn: "Claude API orqali chuqur tekshirish",
    grantRadarTitle: "Matematika bo‘yicha davlat granti radari",
    grantRadarSub: "50 ballik prognoz tahlili: qancha ball nazariy bo‘shliqdan, qanchasi esa kognitiv tuzoqlardan (aniqlanish sohasi, ishora, modul) yo‘qotiladi.",
    currentScoreLabel: "Joriy prognoz",
    trapLossLabel: "Tuzoqlardagi yo‘qotish",
    theoryLossLabel: "Nazariy bo‘shliq",
    afterFixLabel: "Tuzoqlarsiz prognoz",
    uniColName: "OTM va ta’lim dasturi",
    uniColThreshold: "Min / Grant bali",
    uniColCurrent: "Hozirgi imkoniyat",
    uniColAfter: "Tuzoqlar yopilgach",
    targetBadge: "Maqsadli OTM"
  }
} as const;

const customDraftPresets = [
  "log_0.5(x - 3) > -2\nx - 3 > 4\nx > 7",
  "√((x - 5)²) + x при x = 2\nx - 5 + x = 2x - 5\n2·2 - 5 = -1",
  "3x + 6 = 21\n3x = 27\nx = 9",
  "x² - 9x + 14 = 0\nx₁ + x₂ = -9\nx₁ · x₂ = 14",
  "a = 6, h = 5 (правильная пирамида)\nS_осн = 6² = 36\nV = S_осн · h = 36 · 5 = 180"
];

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

  // 60-second blitz timer
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
            <span className="xray-kicker">
              <Microscope size={14} />
              {c.kicker}
            </span>
            <h1 className="xray-title">{c.title}</h1>
            <p className="xray-sub">{c.sub}</p>
          </div>
          <div className="xray-kpi-row">
            <div className="xray-kpi-pill">
              <Flame size={16} className="text-amber-600" />
              <div>
                <div className="xray-kpi-val">{streak}</div>
                <div className="xray-kpi-lbl">{c.streakLabel}</div>
              </div>
            </div>
            <div className="xray-kpi-pill">
              <Zap size={16} className="text-emerald-600" />
              <div>
                <div className="xray-kpi-val">{disarmed}</div>
                <div className="xray-kpi-lbl">{c.disarmedLabel}</div>
              </div>
            </div>
          </div>
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

      {/* MODE 1: 60-SECOND UNT TRAP BLITZ */}
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
              <span className="xray-timer-text">
                {c.timerLabel}: <strong>{secondsLeft !== null ? `${secondsLeft}s` : "60s"}</strong>
              </span>
              {secondsLeft === null || secondsLeft === 0 ? (
                <Button size="sm" variant="outline" onClick={() => setSecondsLeft(60)}>
                  {c.timerStart}
                </Button>
              ) : (
                <Button size="sm" variant="ghost" onClick={() => setSecondsLeft(null)}>
                  <RotateCcw size={14} />
                  {c.timerReset}
                </Button>
              )}
            </div>
          </div>

          <div className="xray-problem-box">
            <div className="xray-problem-meta">
              <span className="xray-code-badge">{currentTrap.code}</span>
              <span className="xray-points-badge">
                {c.pointsAtStake} +{currentTrap.pointsAtStake} {c.ptsUnit}
              </span>
            </div>
            <p className="xray-problem-math">{currentTrap.problem[lang]}</p>
            <p className="xray-prompt-hint">{c.selectTrapPrompt}</p>
          </div>

          <div className="xray-lines-list" role="group" aria-label={c.selectTrapPrompt}>
            {lines.map((lineText, idx) => {
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
                    <ShieldAlert size={18} className="text-amber-700" />
                    <strong>{c.foundWrongTitle}</strong>
                  </>
                )}
              </div>

              {isFractureFound && (
                <div className="xray-diag-grid">
                  <div className="xray-diag-block">
                    <span className="xray-diag-lbl">{c.correctedLabel}</span>
                    <p className="xray-diag-math">{currentTrap.correctedLine[lang]}</p>
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

      {/* MODE 2: LIVE CUSTOM DRAFT X-RAY DEBUGGER */}
      {subMode === "draft" && (
        <div className="xray-stage-card">
          <div className="xray-custom-head">
            <h2 className="xray-sub-heading">{c.customDraftTitle}</h2>
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
                <span className="xray-points-badge">+{draftAnalysis.savedPointsEstimate} {c.ptsUnit}</span>
              </div>
              <p className="small mb-3">{draftAnalysis.summary}</p>
              <div className="xray-trace-items">
                {draftAnalysis.lines.map((line) => (
                  <div key={line.lineNumber} className={`xray-trace-item trace-${line.status}`}>
                    <div className="xray-trace-item-top">
                      <span className="xray-line-num">0{line.lineNumber}</span>
                      <code className="xray-trace-expr">{line.expression}</code>
                      <span className="xray-line-tag">{line.badge}</span>
                    </div>
                    <p className="xray-trace-note">{line.note}</p>
                    {line.correctedLine && (
                      <p className="xray-trace-fix inline-flex items-center gap-1">
                        <CheckCircle2 size={14} />
                        <span>
                          {c.correctedLabel} <strong>{line.correctedLine}</strong>
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

      {/* MODE 3: KAZAKHSTAN UNIVERSITY GRANT RADAR */}
      {subMode === "grant" && (
        <div className="xray-stage-card">
          <div className="xray-custom-head">
            <h2 className="xray-sub-heading">{c.grantRadarTitle}</h2>
            <p className="small">{c.grantRadarSub}</p>
          </div>

          <div className="grant-metrics-grid">
            <div className="grant-metric-box">
              <span className="grant-metric-lbl">{c.currentScoreLabel}</span>
              <strong className="grant-metric-val">{grantRadar.currentProjectedScore} / 50</strong>
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
                      {isTarget && <span className="grant-target-pill">{c.targetBadge}</span>}
                    </div>
                    <span className="small">{u.fullName}</span>
                    <span className="grant-threshold-note">
                      {c.uniColThreshold}: <strong>{u.minMathScore}–{u.safeMathScore} / 50</strong>
                    </span>
                  </div>

                  <div className="grant-uni-bars">
                    <div className="grant-bar-group">
                      <div className="grant-bar-label">
                        <span>{c.uniColCurrent}</span>
                        <strong>{u.currentChancePercent}%</strong>
                      </div>
                      <div className="grant-bar-track">
                        <div className="grant-bar-fill current" style={{ width: `${u.currentChancePercent}%` }} />
                      </div>
                    </div>

                    <div className="grant-bar-group">
                      <div className="grant-bar-label">
                        <span>{c.uniColAfter}</span>
                        <strong className="text-emerald-700">
                          {u.afterFixChancePercent}% (+{Math.max(0, u.afterFixChancePercent - u.currentChancePercent)}%)
                        </strong>
                      </div>
                      <div className="grant-bar-track">
                        <div className="grant-bar-fill after" style={{ width: `${u.afterFixChancePercent}%` }} />
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </section>
  );
}
