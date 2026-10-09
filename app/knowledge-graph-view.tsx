"use client";
import { useMemo, useRef, useState } from "react";
import {
  AlertTriangle,
  BookOpen,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  Compass,
  FlaskConical,
  GitBranch,
  Layers,
  Lock,
  Maximize2,
  Moon,
  Sun,
  ZoomIn,
  ZoomOut
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  buildKnowledgeGraphState,
  type ComputedGraphNode,
  type GraphFilter,
  type GraphNodeStatus
} from "@/lib/knowledge-graph";
import { lessons, type Language, type TopicId } from "@/lib/lessons";
import { topicName, type Progress } from "@/lib/error-lab";
import type { UntAttemptSummary } from "@/lib/unt-exam";

const GRAPH_UI_COPY = {
  ru: {
    headerTitle: "Карта тем по математике (16 разделов)",
    headerSub:
      "Нажмите на любую тему в списке, чтобы сразу под ней увидеть главное правило, частые ловушки и перейти к уроку.",
    startHereTitle: "С чего начать сейчас",
    startHereUnassessed:
      "Базовая тема курса — начните с неё или пройдите диагностику на 18 заданий, чтобы отметить уже знакомые разделы.",
    filterAll: "Все темы (16)",
    filterGaps: "Нужно подтянуть",
    filterLit: "Мат. грамотность",
    filterAlg: "Алгебра и анализ",
    filterGeo: "Геометрия и триг.",
    modeGraph: "Показать граф",
    modePath: "Список тем",
    themeDark: "Тёмный фон",
    themeLight: "Светлый лист",
    statusMastered: "Освоено (≥2 задачи)",
    statusInProgress: "В работе",
    statusRootGap: "Базовый пробел",
    statusBlockedGap: "Нужна база",
    statusReady: "Можно изучать",
    statusLocked: "Следующий этап",
    notCheckedBadge: "Не проверено",
    summaryMastered: "Освоено тем",
    summaryRootGaps: "Найдено пробелов",
    summaryAvg: "Проверено базы",
    summaryNext: "Рекомендуемая тема",
    canvasHint: "Нажмите на узел графа, чтобы открыть карточку темы ниже",
    prereqTitle: "Опирается на темы",
    unlocksTitle: "Открывает темы",
    noPrereq: "Базовая тема курса — можно начинать сразу",
    noUnlocks: "Итоговая тема ветки профильной математики",
    blockedAlert: "Сначала рекомендуется закрыть пробел в базовой теме:",
    invariantLabel: "Главное правило темы",
    trapsLabel: "Частые ошибки на ЕНТ",
    labStatLabel: "Практика / ошибки",
    examStatLabel: "Пробное ЕНТ",
    examNotTaken: "не проверено",
    dueBadge: "Пора повторить",
    btnLesson: "Открыть занятие",
    btnLab: "Тренировка ошибок",
    btnExam: "Пробное ЕНТ",
    markGapBtn: "Добавить в план повторения",
    unmarkGapBtn: "Убрать из повторения",
    studyPlanTitle: "Все 16 тем по порядку изучения",
    studyPlanSub: "Нажмите на тему — карточка с правилом и действиями раскроется прямо под ней.",
    notAssessedLabel: "Не проверено",
    startDiagBtn: "Пройти диагностику (18 заданий)",
    expandBtn: "Подробнее",
    collapseBtn: "Свернуть"
  },
  kk: {
    headerTitle: "Математика тақырыптарының картасы (16 бөлім)",
    headerSub:
      "Негізгі ережені, жиі кездесетін қателерді көріп, сабаққа өту үшін тізімдегі кез келген тақырыпты басыңыз.",
    startHereTitle: "Неден бастау керек",
    startHereUnassessed:
      "Курстың базалық тақырыбы — осыдан бастаңыз немесе таныс бөлімдерді белгілеу үшін 18 тапсырмалық диагностикадан өтіңіз.",
    filterAll: "Барлығы (16)",
    filterGaps: "Қайталау керек",
    filterLit: "Мат. сауаттылық",
    filterAlg: "Алгебра мен талдау",
    filterGeo: "Геометрия мен триг.",
    modeGraph: "Графты көрсету",
    modePath: "Тақырыптар тізімі",
    themeDark: "Қараңғы фон",
    themeLight: "Ашық парақ",
    statusMastered: "Меңгерілді (≥2 есеп)",
    statusInProgress: "Жұмыс үстінде",
    statusRootGap: "Базалық олқылық",
    statusBlockedGap: "База қажет",
    statusReady: "Оқуға дайын",
    statusLocked: "Келесі кезең",
    notCheckedBadge: "Тексерілмеген",
    summaryMastered: "Меңгерілгені",
    summaryRootGaps: "Табылған олқылық",
    summaryAvg: "Тексерілген база",
    summaryNext: "Ұсынылатын тақырып",
    canvasHint: "Төменде тақырып картасын ашу үшін граф түйінін басыңыз",
    prereqTitle: "Қай тақырыптарға сүйенеді",
    unlocksTitle: "Қай тақырыптарға жол ашады",
    noPrereq: "Курстың базалық тақырыбы — бірден бастауға болады",
    noUnlocks: "Бейіндік математика тармағының қорытынды тақырыбы",
    blockedAlert: "Алдымен базалық тақырыптағы олқылықты жабу ұсынылады:",
    invariantLabel: "Тақырыптың негізгі ережесі",
    trapsLabel: "ҰБТ-да жиі кездесетін қателер",
    labStatLabel: "Практика / қателер",
    examStatLabel: "Сынақ ҰБТ",
    examNotTaken: "тексерілмеген",
    dueBadge: "Қайталау уақыты",
    btnLesson: "Сабақты ашу",
    btnLab: "Қатемен жұмыс",
    btnExam: "Сынақ ҰБТ",
    markGapBtn: "Қайталау тізіміне қосу",
    unmarkGapBtn: "Қайталаудан алу",
    studyPlanTitle: "Оқу реті бойынша барлық 16 тақырып",
    studyPlanSub: "Тақырыпты басыңыз — ереже мен әрекеттер дәл соның астында ашылады.",
    notAssessedLabel: "Тексерілмеген",
    startDiagBtn: "Диагностикадан өту (18 тапсырма)",
    expandBtn: "Толығырақ",
    collapseBtn: "Жию"
  },
  uz: {
    headerTitle: "Matematika mavzulari xaritasi (16 bo‘lim)",
    headerSub:
      "Asosiy qoida va ko‘p uchraydigan xatolarni ko‘rish hamda darsga o‘tish uchun ro‘yxatdagi istalgan mavzuni bosing.",
    startHereTitle: "Nimadan boshlash kerak",
    startHereUnassessed:
      "Kursning tayanch mavzusi — shundan boshlang yoki tanish bo‘limlarni aniqlash uchun 18 savollik diagnostikadan o‘ting.",
    filterAll: "Barchasi (16)",
    filterGaps: "Takrorlash kerak",
    filterLit: "Mat. savodxonlik",
    filterAlg: "Algebra va tahlil",
    filterGeo: "Geometriya va trig.",
    modeGraph: "Grafni ko‘rsatish",
    modePath: "Mavzular ro‘yxati",
    themeDark: "Qorong‘i fon",
    themeLight: "Yorug‘ varaq",
    statusMastered: "O‘zlashtirildi (≥2 masala)",
    statusInProgress: "Jarayonda",
    statusRootGap: "Tayanch bo‘shliq",
    statusBlockedGap: "Baza kerak",
    statusReady: "O‘qishga tayyor",
    statusLocked: "Keyingi bosqich",
    notCheckedBadge: "Tekshirilmagan",
    summaryMastered: "O‘zlashtirilgan",
    summaryRootGaps: "Topilgan bo‘shliq",
    summaryAvg: "Tekshirilgan baza",
    summaryNext: "Tavsiya etilgan mavzu",
    canvasHint: "Quyida mavzu kartasini ochish uchun graf tugunini bosing",
    prereqTitle: "Qaysi mavzularga tayanadi",
    unlocksTitle: "Qaysi mavzularga yo‘l ochadi",
    noPrereq: "Kursning tayanch mavzusi — darhol boshlash mumkin",
    noUnlocks: "Yo‘nalishning yakuniy mavzusi",
    blockedAlert: "Avval tayanch mavzudagi bo‘shliqni yopish tavsiya etiladi:",
    invariantLabel: "Mavzuning asosiy qoidasi",
    trapsLabel: "Imtihonda ko‘p uchraydigan xatolar",
    labStatLabel: "Amaliyot / xatolar",
    examStatLabel: "Sinov UBT",
    examNotTaken: "tekshirilmagan",
    dueBadge: "Takrorlash vaqti",
    btnLesson: "Darsni ochish",
    btnLab: "Xatolar ustida ishlash",
    btnExam: "Sinov UBT",
    markGapBtn: "Takrorlashga qo‘shish",
    unmarkGapBtn: "Takrorlashdan olish",
    studyPlanTitle: "O‘qish tartibi bo‘yicha 16 ta mavzu",
    studyPlanSub: "Mavzuni bosing — qoida va tugmalar uning ostida ochiladi.",
    notAssessedLabel: "Tekshirilmagan",
    startDiagBtn: "Diagnostikadan o‘tish (18 savol)",
    expandBtn: "Batafsil",
    collapseBtn: "Yopish"
  }
} as const;

const NODE_COLORS: Record<
  GraphNodeStatus,
  { stroke: string; fillDark: string; fillLight: string; glow: string; badgeClass: string }
> = {
  mastered: {
    stroke: "#15803d",
    fillDark: "#064e3b",
    fillLight: "#dcfce7",
    glow: "rgba(21, 128, 61, 0.28)",
    badgeClass: "kg-badge-mastered"
  },
  in_progress: {
    stroke: "#1B3B6F",
    fillDark: "#0c4a6e",
    fillLight: "#e0e7ff",
    glow: "rgba(27, 59, 111, 0.25)",
    badgeClass: "kg-badge-progress"
  },
  ready: {
    stroke: "#b45309",
    fillDark: "#78350f",
    fillLight: "#fef3c7",
    glow: "rgba(180, 83, 9, 0.28)",
    badgeClass: "kg-badge-ready"
  },
  root_gap: {
    stroke: "#b91c1c",
    fillDark: "#881337",
    fillLight: "#fee2e2",
    glow: "rgba(185, 28, 28, 0.32)",
    badgeClass: "kg-badge-rootgap"
  },
  blocked_gap: {
    stroke: "#6d28d9",
    fillDark: "#3b0764",
    fillLight: "#ede9fe",
    glow: "rgba(109, 40, 217, 0.22)",
    badgeClass: "kg-badge-blocked"
  },
  locked: {
    stroke: "#64748b",
    fillDark: "#1e293b",
    fillLight: "#f1f5f9",
    glow: "rgba(100, 116, 139, 0.16)",
    badgeClass: "kg-badge-locked"
  }
};

export interface KnowledgeGraphViewProps {
  lang: Language;
  progress: Progress;
  untAttempt: UntAttemptSummary | null;
  weakTopics: TopicId[];
  selectedTopic: TopicId;
  onSelectTopic: (topic: TopicId) => void;
  onOpenLesson: (topic: TopicId) => void;
  onOpenExam: () => void;
  onToggleWeakTopic: (topic: TopicId) => void;
}

export function KnowledgeGraphView({
  lang,
  progress,
  untAttempt,
  weakTopics,
  selectedTopic,
  onSelectTopic,
  onOpenLesson,
  onOpenExam,
  onToggleWeakTopic
}: KnowledgeGraphViewProps) {
  const t = GRAPH_UI_COPY[lang];
  const [filter, setFilter] = useState<GraphFilter>("all");
  // Default to compact topic list with inline expansion directly below the clicked topic
  const [displayMode, setDisplayMode] = useState<"graph" | "path">("path");
  const [darkCanvas, setDarkCanvas] = useState(false);
  const [hoveredTopic, setHoveredTopic] = useState<TopicId | null>(null);
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [offsets, setOffsets] = useState<Partial<Record<TopicId, { dx: number; dy: number }>>>({});

  const isAssessed = useMemo(() => {
    return progress.records.length > 0 || untAttempt !== null;
  }, [progress.records.length, untAttempt]);

  const dragState = useRef<{
    kind: "pan" | "node";
    topic?: TopicId;
    startX: number;
    startY: number;
    origX: number;
    origY: number;
  } | null>(null);

  const graphState = useMemo(
    () => buildKnowledgeGraphState(progress, untAttempt, weakTopics, lang),
    [progress, untAttempt, weakTopics, lang]
  );

  const nodeMap = useMemo(
    () => new Map(graphState.nodes.map((n) => [n.id, n])),
    [graphState.nodes]
  );

  const activeNode: ComputedGraphNode =
    nodeMap.get(selectedTopic) ?? graphState.nodes[0];
  const nextRecommendedTopic = graphState.summary.nextBestTopic;
  const nextRecommendedNode = nodeMap.get(nextRecommendedTopic) ?? graphState.nodes[0];

  function getStatusLabel(node: ComputedGraphNode): string {
    if (!node.hasEvidence) {
      return t.notCheckedBadge;
    }
    switch (node.status) {
      case "mastered":
        return t.statusMastered;
      case "in_progress":
        return t.statusInProgress;
      case "root_gap":
        return t.statusRootGap;
      case "blocked_gap":
        return t.statusBlockedGap;
      case "ready":
        return t.statusReady;
      case "locked":
        return t.statusLocked;
    }
  }

  function isVisibleInFilter(node: ComputedGraphNode): boolean {
    if (filter === "all") return true;
    if (filter === "gaps") {
      return (
        node.status === "root_gap" ||
        node.status === "blocked_gap" ||
        (node.hasEvidence && node.masteryPercent < 75)
      );
    }
    return node.cluster === filter;
  }

  function isInNeighborhood(nodeId: TopicId): boolean {
    const focus = hoveredTopic ?? selectedTopic;
    if (!focus) return true;
    if (nodeId === focus) return true;
    const fNode = nodeMap.get(focus);
    if (!fNode) return true;
    return fNode.prerequisites.includes(nodeId) || fNode.unlocks.includes(nodeId);
  }

  function getCoordinates(node: ComputedGraphNode) {
    const off = offsets[node.id] ?? { dx: 0, dy: 0 };
    return {
      x: node.baseX + off.dx,
      y: node.baseY + off.dy
    };
  }

  function handleCanvasPointerDown(e: React.PointerEvent<SVGSVGElement>) {
    if ((e.target as HTMLElement).closest("[data-kg-node]")) return;
    e.currentTarget.setPointerCapture(e.pointerId);
    dragState.current = {
      kind: "pan",
      startX: e.clientX,
      startY: e.clientY,
      origX: pan.x,
      origY: pan.y
    };
  }

  function handleNodePointerDown(e: React.PointerEvent<SVGGElement>, id: TopicId) {
    e.stopPropagation();
    onSelectTopic(id);
    try {
      e.currentTarget.setPointerCapture(e.pointerId);
    } catch {
      // Synthetic or assistive pointer events may not have an active hardware pointerId
    }
    const cur = offsets[id] ?? { dx: 0, dy: 0 };
    dragState.current = {
      kind: "node",
      topic: id,
      startX: e.clientX,
      startY: e.clientY,
      origX: cur.dx,
      origY: cur.dy
    };
  }

  function handlePointerMove(e: React.PointerEvent<SVGSVGElement>) {
    const d = dragState.current;
    if (!d) return;
    if (d.kind === "pan") {
      setPan({
        x: d.origX + (e.clientX - d.startX),
        y: d.origY + (e.clientY - d.startY)
      });
    } else if (d.kind === "node" && d.topic) {
      const dx = (e.clientX - d.startX) / zoom;
      const dy = (e.clientY - d.startY) / zoom;
      setOffsets((prev) => ({
        ...prev,
        [d.topic!]: {
          dx: Math.max(-95, Math.min(95, d.origX + dx)),
          dy: Math.max(-95, Math.min(95, d.origY + dy))
        }
      }));
    }
  }

  function handlePointerUp() {
    dragState.current = null;
  }

  function resetView() {
    setZoom(1);
    setPan({ x: 0, y: 0 });
    setOffsets({});
  }

  function renderNodeDetailsCard(node: ComputedGraphNode) {
    const nodeLesson = lessons[lang].find((l) => l.id === node.id)!;
    const palette = NODE_COLORS[node.status];
    return (
      <div
        className="kg-inline-inspector mt-3 pt-3 border-t border-border"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="kg-inspector-stats">
          <div className="kg-mini-stat">
            <span className="small">{t.labStatLabel}</span>
            <strong className="tabular-nums">{node.soloCount}/2</strong>
          </div>
          <div className="kg-mini-stat">
            <span className="small">{t.examStatLabel}</span>
            <strong className="tabular-nums">
              {node.examRatio !== null ? `${Math.round(node.examRatio * 100)}%` : t.examNotTaken}
            </strong>
          </div>
          <div className="kg-mini-stat">
            <span className="small">{t.summaryAvg}</span>
            <strong
              className="tabular-nums"
              style={{ color: node.hasEvidence ? palette.stroke : undefined }}
            >
              {node.hasEvidence ? `${node.masteryPercent}%` : t.notAssessedLabel}
            </strong>
          </div>
        </div>

        {node.dueForReview && (
          <div className="kg-due-banner mt-2">
            <Compass size={14} />
            <span>{t.dueBadge}</span>
          </div>
        )}

        {node.missingPrerequisites.length > 0 && (
          <div className="kg-blocked-alert mt-3">
            <div className="flex items-center gap-1.5 font-bold text-xs">
              <Lock size={14} />
              <span>{t.blockedAlert}</span>
            </div>
            <div className="flex flex-wrap gap-1.5 mt-1.5">
              {node.missingPrerequisites.map((preId) => (
                <button
                  key={preId}
                  type="button"
                  className="kg-link-pill critical"
                  onClick={() => onSelectTopic(preId)}
                >
                  <AlertTriangle size={12} />
                  {topicName(preId, lang)} →
                </button>
              ))}
            </div>
          </div>
        )}

        <div className="mt-3">
          <strong className="text-xs uppercase tracking-wider text-muted-foreground block mb-1">
            {t.invariantLabel}
          </strong>
          <div className="callout text-sm">{nodeLesson.rule}</div>
        </div>

        <div className="mt-3">
          <strong className="text-xs uppercase tracking-wider text-muted-foreground block mb-1">
            {t.trapsLabel}
          </strong>
          <ul className="small list-disc pl-4 space-y-1 m-0">
            {node.commonTraps[lang].map((trap) => (
              <li key={trap}>{trap}</li>
            ))}
          </ul>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-3">
          <div>
            <strong className="text-xs uppercase tracking-wider text-muted-foreground block mb-1">
              {t.prereqTitle}
            </strong>
            {node.prerequisites.length === 0 ? (
              <p className="small m-0">{t.noPrereq}</p>
            ) : (
              <div className="flex flex-wrap gap-1.5">
                {node.prerequisites.map((preId) => {
                  const preNode = nodeMap.get(preId)!;
                  return (
                    <button
                      key={preId}
                      type="button"
                      className="kg-link-pill"
                      onClick={() => onSelectTopic(preId)}
                    >
                      <span>← {preNode.title}</span>
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          <div>
            <strong className="text-xs uppercase tracking-wider text-muted-foreground block mb-1">
              {t.unlocksTitle}
            </strong>
            {node.unlocks.length === 0 ? (
              <p className="small m-0">{t.noUnlocks}</p>
            ) : (
              <div className="flex flex-wrap gap-1.5">
                {node.unlocks.map((depId) => {
                  const depNode = nodeMap.get(depId)!;
                  return (
                    <button
                      key={depId}
                      type="button"
                      className="kg-link-pill"
                      onClick={() => onSelectTopic(depId)}
                    >
                      <span>{depNode.title} →</span>
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        <div className="mt-3 pt-3 border-t border-border flex flex-wrap items-center justify-between gap-2">
          <div className="flex flex-wrap gap-2">
            <Button
              type="button"
              className="min-h-11"
              onClick={() => onOpenLesson(node.id)}
            >
              <BookOpen size={15} />
              <span>{t.btnLesson}</span>
            </Button>
            <a
              className="cta-pill text-xs py-2 px-3 inline-flex items-center gap-1.5 min-h-11"
              href={`/lab?lang=${lang}&topic=${node.id}`}
            >
              <FlaskConical size={14} />
              <span>{t.btnLab}</span>
            </a>
          </div>
          <button
            type="button"
            className="underline font-semibold text-xs inline-flex items-center min-h-9 py-1"
            onClick={() => onToggleWeakTopic(node.id)}
          >
            {node.isWeakMarked ? t.unmarkGapBtn : t.markGapBtn}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="kg-root">
      {/* 1. Одна главная рекомендация «С чего начать» сверху */}
      <div className="callout mb-3 flex flex-wrap items-center justify-between gap-3">
        <div>
          <span className="text-xs uppercase tracking-wider font-bold text-primary block">
            {t.startHereTitle}
          </span>
          <strong className="text-base block mt-0.5">
            {nextRecommendedNode.orderNumber}. {nextRecommendedNode.title}
          </strong>
          <p className="small m-0 mt-0.5">
            {isAssessed
              ? graphState.studyPlan[0]?.reason
              : t.startHereUnassessed}
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button
            type="button"
            className="min-h-11"
            onClick={() => onOpenLesson(nextRecommendedTopic)}
          >
            <BookOpen size={15} />
            <span>{t.btnLesson}</span>
          </Button>
          {!isAssessed && (
            <Button
              type="button"
              variant="outline"
              className="min-h-11"
              onClick={onOpenExam}
            >
              <CheckCircle2 size={15} />
              <span>{t.startDiagBtn}</span>
            </Button>
          )}
        </div>
      </div>

      {/* 2. Панель фильтров и переключения режима (Список тем по умолчанию / Граф как доп. режим) */}
      <div className="flex flex-wrap items-center justify-between gap-2 my-3">
        <div className="flex flex-wrap gap-1.5" role="group" aria-label="Фильтр разделов">
          {(
            [
              ["all", t.filterAll],
              ...(isAssessed ? ([["gaps", t.filterGaps]] as const) : []),
              ["literacy", t.filterLit],
              ["algebra", t.filterAlg],
              ["geometry", t.filterGeo]
            ] as const
          ).map(([key, label]) => (
            <Button
              key={key}
              type="button"
              size="sm"
              variant={filter === key ? "default" : "outline"}
              onClick={() => setFilter(key as GraphFilter)}
            >
              {label}
            </Button>
          ))}
        </div>

        <div className="flex flex-wrap items-center gap-1.5">
          <Button
            type="button"
            size="sm"
            variant={displayMode === "path" ? "default" : "outline"}
            onClick={() => setDisplayMode("path")}
          >
            <Layers size={14} />
            {t.modePath}
          </Button>
          <Button
            type="button"
            size="sm"
            variant={displayMode === "graph" ? "default" : "outline"}
            onClick={() => setDisplayMode("graph")}
          >
            <GitBranch size={14} />
            {t.modeGraph}
          </Button>
          {displayMode === "graph" && (
            <Button
              type="button"
              size="sm"
              variant="outline"
              onClick={() => setDarkCanvas((v) => !v)}
              aria-label={darkCanvas ? t.themeLight : t.themeDark}
            >
              {darkCanvas ? <Sun size={14} /> : <Moon size={14} />}
            </Button>
          )}
        </div>
      </div>

      {/* 3. Основное содержимое: Компактный список с раскрытием прямо под выбранной темой (или 2D Граф) */}
      {displayMode === "path" ? (
        <div className="kg-path-list">
          <div className="mb-2">
            <h3 className="font-bold text-base m-0">{t.studyPlanTitle}</h3>
            <p className="small m-0">{t.studyPlanSub}</p>
          </div>
          {graphState.studyPlan
            .filter((step) => {
              const n = nodeMap.get(step.topic);
              return n ? isVisibleInFilter(n) : true;
            })
            .map((step) => {
              const stepNode = nodeMap.get(step.topic)!;
              const palette = NODE_COLORS[step.status];
              const isExpanded = selectedTopic === step.topic;

              return (
                <div
                  key={step.topic}
                  className={`kg-step-card ${isExpanded ? "active" : ""}`}
                  onClick={() => onSelectTopic(step.topic)}
                >
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <span className="kg-step-rank tabular-nums">#{stepNode.orderNumber}</span>
                      <strong>{step.title}</strong>
                    </div>
                    <div className="flex items-center gap-2">
                      <span
                        className="kg-status-pill"
                        style={{
                          borderColor: stepNode.hasEvidence ? palette.stroke : undefined
                        }}
                      >
                        {getStatusLabel(stepNode)}
                        {stepNode.hasEvidence ? ` · ${step.masteryPercent}%` : ""}
                      </span>
                      <span className="small text-muted-foreground inline-flex items-center gap-0.5">
                        {isExpanded ? <ChevronUp size={15} /> : <ChevronDown size={15} />}
                      </span>
                    </div>
                  </div>
                  <p className="small mt-1 mb-0">{step.reason}</p>

                  {/* Раскрытие выбранной темы ПРЯМО ПОД НЕЙ (без прокрутки на 5000px вниз!) */}
                  {isExpanded && renderNodeDetailsCard(stepNode)}
                </div>
              );
            })}
        </div>
      ) : (
        <div>
          <div className={`kg-canvas-frame ${darkCanvas ? "dark-canvas" : "light-canvas"}`}>
            <div className="kg-canvas-controls">
              <button
                type="button"
                className="kg-ctrl-btn"
                aria-label="Zoom in"
                onClick={() => setZoom((z) => Math.min(1.45, Number((z + 0.15).toFixed(2))))}
              >
                <ZoomIn size={15} />
              </button>
              <button
                type="button"
                className="kg-ctrl-btn"
                aria-label="Zoom out"
                onClick={() => setZoom((z) => Math.max(0.75, Number((z - 0.15).toFixed(2))))}
              >
                <ZoomOut size={15} />
              </button>
              <button
                type="button"
                className="kg-ctrl-btn"
                aria-label="Reset graph view"
                onClick={resetView}
              >
                <Maximize2 size={15} />
              </button>
            </div>

            <svg
              viewBox="0 0 880 510"
              className="kg-svg"
              role="img"
              aria-label={t.headerTitle}
              onPointerDown={handleCanvasPointerDown}
              onPointerMove={handlePointerMove}
              onPointerUp={handlePointerUp}
              onPointerCancel={handlePointerUp}
            >
              <defs>
                <marker
                  id="kg-arrow-neutral"
                  viewBox="0 0 10 10"
                  refX="8"
                  refY="5"
                  markerWidth="6"
                  markerHeight="6"
                  orient="auto-start-reverse"
                >
                  <path d="M 0 1 L 10 5 L 0 9 z" fill="#64748b" />
                </marker>
                <marker
                  id="kg-arrow-critical"
                  viewBox="0 0 10 10"
                  refX="8"
                  refY="5"
                  markerWidth="6"
                  markerHeight="6"
                  orient="auto-start-reverse"
                >
                  <path d="M 0 1 L 10 5 L 0 9 z" fill="#f43f5e" />
                </marker>
                <marker
                  id="kg-arrow-mastered"
                  viewBox="0 0 10 10"
                  refX="8"
                  refY="5"
                  markerWidth="6"
                  markerHeight="6"
                  orient="auto-start-reverse"
                >
                  <path d="M 0 1 L 10 5 L 0 9 z" fill="#10b981" />
                </marker>
                <marker
                  id="kg-arrow-ready"
                  viewBox="0 0 10 10"
                  refX="8"
                  refY="5"
                  markerWidth="6"
                  markerHeight="6"
                  orient="auto-start-reverse"
                >
                  <path d="M 0 1 L 10 5 L 0 9 z" fill="#38bdf8" />
                </marker>
              </defs>

              <g
                transform={`translate(${pan.x}, ${pan.y}) scale(${zoom})`}
                style={{ transformOrigin: "440px 230px" }}
              >
                {graphState.edges.map((edge) => {
                  const fromNode = nodeMap.get(edge.from)!;
                  const toNode = nodeMap.get(edge.to)!;
                  const p1 = getCoordinates(fromNode);
                  const p2 = getCoordinates(toNode);
                  const dx = p2.x - p1.x;
                  const dy = p2.y - p1.y;
                  const dist = Math.hypot(dx, dy) || 1;
                  const startX = p1.x + (dx / dist) * 30;
                  const startY = p1.y + (dy / dist) * 30;
                  const endX = p2.x - (dx / dist) * 34;
                  const endY = p2.y - (dy / dist) * 34;
                  const midX = (startX + endX) / 2;
                  const pathD = `M ${startX} ${startY} C ${midX} ${startY}, ${midX} ${endY}, ${endX} ${endY}`;

                  const focus = hoveredTopic ?? selectedTopic;
                  const isFocusedEdge = edge.from === focus || edge.to === focus;
                  const visible =
                    isVisibleInFilter(fromNode) && isVisibleInFilter(toNode);

                  let strokeColor = darkCanvas ? "#334155" : "#cbd5e1";
                  let markerId = "url(#kg-arrow-neutral)";
                  if (edge.status === "critical") {
                    strokeColor = "#f43f5e";
                    markerId = "url(#kg-arrow-critical)";
                  } else if (edge.status === "mastered") {
                    strokeColor = "#10b981";
                    markerId = "url(#kg-arrow-mastered)";
                  } else if (isFocusedEdge) {
                    strokeColor = "#38bdf8";
                    markerId = "url(#kg-arrow-ready)";
                  }

                  return (
                    <path
                      key={edge.id}
                      d={pathD}
                      fill="none"
                      stroke={strokeColor}
                      strokeWidth={isFocusedEdge ? 2.8 : 1.8}
                      strokeDasharray={edge.status === "critical" ? "6 4" : undefined}
                      markerEnd={markerId}
                      opacity={!visible ? 0.12 : isFocusedEdge ? 1 : 0.45}
                    />
                  );
                })}

                {graphState.nodes.map((node) => {
                  const pos = getCoordinates(node);
                  const palette = NODE_COLORS[node.status];
                  const isSelected = node.id === selectedTopic;
                  const visible = isVisibleInFilter(node);
                  const inSpot = isInNeighborhood(node.id);
                  const nodeOpacity = !visible ? 0.18 : inSpot ? 1 : 0.32;
                  const shortLabel =
                    node.title.length > 22
                      ? `${node.title.slice(0, 20)}…`
                      : node.title;

                  return (
                    <g
                      key={node.id}
                      data-kg-node={node.id}
                      transform={`translate(${pos.x}, ${pos.y})`}
                      role="button"
                      tabIndex={0}
                      aria-label={`${node.orderNumber}. ${node.title} — ${getStatusLabel(node)}`}
                      aria-pressed={isSelected}
                      style={{ opacity: nodeOpacity, cursor: "pointer" }}
                      onClick={() => onSelectTopic(node.id)}
                      onPointerDown={(e) => handleNodePointerDown(e, node.id)}
                      onMouseEnter={() => setHoveredTopic(node.id)}
                      onMouseLeave={() => setHoveredTopic(null)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" || e.key === " ") {
                          e.preventDefault();
                          onSelectTopic(node.id);
                        }
                      }}
                    >
                      {(isSelected || node.status === "root_gap") && (
                        <circle
                          r={33}
                          fill="none"
                          stroke={isSelected ? "#38bdf8" : palette.stroke}
                          strokeWidth={isSelected ? 2.5 : 1.8}
                          strokeDasharray={
                            node.status === "root_gap" && !isSelected ? "4 3" : undefined
                          }
                        />
                      )}

                      <circle
                        r={26}
                        fill={darkCanvas ? palette.fillDark : palette.fillLight}
                        stroke={palette.stroke}
                        strokeWidth={2.5}
                      />

                      <text
                        y={-3}
                        textAnchor="middle"
                        fill={darkCanvas ? "#f8fafc" : "#0f172a"}
                        fontSize="12"
                        fontWeight="800"
                      >
                        {node.orderNumber}
                      </text>
                      <text
                        y={12}
                        textAnchor="middle"
                        fill={darkCanvas ? "#cbd5e1" : "#334155"}
                        fontSize="10"
                        fontWeight="700"
                      >
                        {node.hasEvidence ? `${node.masteryPercent}%` : "—"}
                      </text>

                      <rect
                        x={-74}
                        y={31}
                        width={148}
                        height={22}
                        rx={6}
                        fill={darkCanvas ? "rgba(15, 23, 42, 0.9)" : "rgba(255, 255, 255, 0.92)"}
                        stroke={isSelected ? "#38bdf8" : darkCanvas ? "#334155" : "#cbd5e1"}
                        strokeWidth={1}
                      />
                      <text
                        y={46}
                        textAnchor="middle"
                        fill={darkCanvas ? "#f1f5f9" : "#0f172a"}
                        fontSize="11"
                        fontWeight="600"
                      >
                        {shortLabel}
                      </text>
                    </g>
                  );
                })}
              </g>
            </svg>
            <div className="kg-canvas-footer">{t.canvasHint}</div>
          </div>

          <div className="kg-step-card active mt-3">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <strong>
                #{activeNode.orderNumber}. {activeNode.title}
              </strong>
              <span className="kg-status-pill">{getStatusLabel(activeNode)}</span>
            </div>
            {renderNodeDetailsCard(activeNode)}
          </div>
        </div>
      )}
    </div>
  );
}
