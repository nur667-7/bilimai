"use client";
import { useMemo, useRef, useState } from "react";
import {
  AlertTriangle,
  BookOpen,
  CheckCircle2,
  Compass,
  FlaskConical,
  GitBranch,
  Layers,
  Lock,
  Maximize2,
  Sun,
  Moon,
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
    headerTitle: "Карта знаний · «Второй мозг» ЕНТ (Obsidian Graph)",
    headerSub: "Направленный граф математических пререквизитов: показывает корневые пробелы, заблокированные темы и кратчайший маршрут к целевому баллу ЕНТ.",
    filterAll: "Все темы (10)",
    filterGaps: "Пробелы и Фронт",
    filterLit: "Мат. грамотность",
    filterAlg: "Алгебра и Анализ",
    filterGeo: "Геометрия и Триг.",
    modeGraph: "Граф Obsidian",
    modePath: "Маршрут по шагам",
    themeDark: "Obsidian Dark",
    themeLight: "Светлый холст",
    statusMastered: "Освоено (≥2 соло)",
    statusInProgress: "В закреплении",
    statusRootGap: "Корневой пробел",
    statusBlockedGap: "Блокировано базой",
    statusReady: "Фронт обучения",
    statusLocked: "Ожидает базу",
    summaryMastered: "Освоено узлов",
    summaryRootGaps: "Корневых пробелов",
    summaryAvg: "Индекс базы",
    summaryNext: "Приоритет #1",
    canvasHint: "Кликните или перетащите узел · Наведите для подсветки цепочки связей",
    prereqTitle: "От чего зависит (Пререквизиты)",
    unlocksTitle: "Что открывает (Зависимые темы)",
    noPrereq: "Фундаментальная тема Tier 0 (не требует пререквизитов)",
    noUnlocks: "Финальная вершина ветки профильной математики ЕНТ",
    blockedAlert: "Тема блокируется пробелом в фундаменте! Сначала закройте:",
    invariantLabel: "Ключевой инвариант темы",
    trapsLabel: "Частые потери баллов на ЕНТ",
    labStatLabel: "Самост. в /lab",
    examStatLabel: "Пробное ЕНТ",
    examNotTaken: "ещё не сдавалось",
    dueBadge: "Пора повторить (2/7 дн.)",
    btnLesson: "Урок и правило",
    btnLab: "Лаборатория (/lab)",
    btnExam: "Пробное ЕНТ",
    markGapBtn: "Отметить как пробел",
    unmarkGapBtn: "Убрать метку пробела",
    studyPlanTitle: "Адаптивный маршрут закрытия пробелов (по графу связей)",
    studyPlanSub: "Алгоритм ставит корневые пререквизиты перед сложными темами, которые от них зависят."
  },
  kk: {
    headerTitle: "Білім картасы · ҰБТ «Екінші ми» графы (Obsidian Graph)",
    headerSub: "Математикалық пререквизиттердің бағытталған графы: түпкі олқылықтарды, бұғатталған тақырыптарды және мақсатты балға жету жолын көрсетеді.",
    filterAll: "Барлығы (10)",
    filterGaps: "Олқылықтар мен Шеп",
    filterLit: "Мат. сауаттылық",
    filterAlg: "Алгебра мен Талдау",
    filterGeo: "Геометрия мен Триг.",
    modeGraph: "Obsidian графы",
    modePath: "Қадамдық бағыт",
    themeDark: "Obsidian Dark",
    themeLight: "Ашық кенеп",
    statusMastered: "Меңгерілді (≥2 өздік)",
    statusInProgress: "Бекіту үстінде",
    statusRootGap: "Түпкі олқылық",
    statusBlockedGap: "Базамен бұғатталған",
    statusReady: "Оқу шебі (дайын)",
    statusLocked: "Базаны күтуде",
    summaryMastered: "Меңгерілген түйін",
    summaryRootGaps: "Түпкі олқылық",
    summaryAvg: "База индексі",
    summaryNext: "Басымдық #1",
    canvasHint: "Түйінді басыңыз немесе сүйреңіз · Байланыс тізбегін көру үшін меңзерді апарыңыз",
    prereqTitle: "Неге сүйенеді (Тірек тақырыптар)",
    unlocksTitle: "Жол ашатын тақырыптар",
    noPrereq: "Іргелі Tier 0 тақырыбы (алғышарт талап етілмейді)",
    noUnlocks: "Бейіндік математика тармағының шыңы",
    blockedAlert: "Тірек тақырыптағы олқылықпен бұғатталған! Алдымен жабыңыз:",
    invariantLabel: "Тақырыптың негізгі инварианты",
    trapsLabel: "ҰБТ-да жиі балл жоғалатын тұстар",
    labStatLabel: "/lab өздік есеп",
    examStatLabel: "Байқау ҰБТ",
    examNotTaken: "әлі тапсырылмады",
    dueBadge: "Қайталау уақыты (2/7 күн)",
    btnLesson: "Сабақ пен ереже",
    btnLab: "Зертхана (/lab)",
    btnExam: "Байқау ҰБТ",
    markGapBtn: "Олқылық ретінде белгілеу",
    unmarkGapBtn: "Олқылық белгісін алу",
    studyPlanTitle: "Олқылықтарды жоюдың бейімделген бағыты (граф бойынша)",
    studyPlanSub: "Алгоритм күрделі тақырыптардың алдына олардың тірек пререквизиттерін қояды."
  },
  uz: {
    headerTitle: "Bilimlar xaritasi · «Ikkinchi miya» grafi (Obsidian Graph)",
    headerSub: "Matematik prerekvizitlarning yo‘naltirilgan grafi: asosiy bo‘shliqlarni, bloklangan mavzularni va eng qisqa o‘quv yo‘nalishini ko‘rsatadi.",
    filterAll: "Barchasi (10)",
    filterGaps: "Bo‘shliqlar va Front",
    filterLit: "Mat. savodxonlik",
    filterAlg: "Algebra va Tahlil",
    filterGeo: "Geometriya va Trig.",
    modeGraph: "Obsidian grafi",
    modePath: "Qadamlar yo‘nalishi",
    themeDark: "Obsidian Dark",
    themeLight: "Yorug‘ xolst",
    statusMastered: "O‘zlashtirildi (≥2 mustaqil)",
    statusInProgress: "Mustahkamlanmoqda",
    statusRootGap: "Asosiy bo‘shliq",
    statusBlockedGap: "Baza bilan bloklangan",
    statusReady: "O‘quv fronti",
    statusLocked: "Bazani kutmoqda",
    summaryMastered: "O‘zlashtirilgan",
    summaryRootGaps: "Asosiy bo‘shliq",
    summaryAvg: "Baza indeksi",
    summaryNext: "Ustuvorlik #1",
    canvasHint: "Tugunni bosing yoki suring · Bog‘lanish zanjirini ko‘rish uchun ustiga olib boring",
    prereqTitle: "Nimaga tayanadi (Tayanch mavzular)",
    unlocksTitle: "Ochadigan mavzulari",
    noPrereq: "Fundamental Tier 0 mavzu (prerekvizit talab qilinmaydi)",
    noUnlocks: "Yo‘nalishning yuqori cho‘qqisi",
    blockedAlert: "Tayanch mavzudagi bo‘shliq tufayli bloklangan! Avval yoping:",
    invariantLabel: "Mavzuning asosiy invarianti",
    trapsLabel: "Imtihonda ko‘p ball yo‘qotiladigan joylar",
    labStatLabel: "/lab mustaqil",
    examStatLabel: "Sinov UBT",
    examNotTaken: "hali topshirilmagan",
    dueBadge: "Takrorlash vaqti (2/7 kun)",
    btnLesson: "Dars va qoida",
    btnLab: "Laboratoriya (/lab)",
    btnExam: "Sinov UBT",
    markGapBtn: "Bo‘shliq deb belgilash",
    unmarkGapBtn: "Bo‘shliq belgisini olish",
    studyPlanTitle: "Bo‘shliqlarni yopishning adaptiv yo‘nalishi (graf bo‘yicha)",
    studyPlanSub: "Algoritm murakkab mavzulardan oldin ularning tayanch prerekvizitlarini qo‘yadi."
  }
} as const;

const NODE_COLORS: Record<
  GraphNodeStatus,
  { stroke: string; fillDark: string; fillLight: string; glow: string; badgeClass: string }
> = {
  mastered: {
    stroke: "#10b981",
    fillDark: "#064e3b",
    fillLight: "#d1fae5",
    glow: "rgba(16, 185, 129, 0.45)",
    badgeClass: "kg-badge-mastered"
  },
  in_progress: {
    stroke: "#38bdf8",
    fillDark: "#0c4a6e",
    fillLight: "#e0f2fe",
    glow: "rgba(56, 189, 248, 0.38)",
    badgeClass: "kg-badge-progress"
  },
  ready: {
    stroke: "#f59e0b",
    fillDark: "#78350f",
    fillLight: "#fef3c7",
    glow: "rgba(245, 158, 11, 0.45)",
    badgeClass: "kg-badge-ready"
  },
  root_gap: {
    stroke: "#f43f5e",
    fillDark: "#881337",
    fillLight: "#ffe4e6",
    glow: "rgba(244, 63, 94, 0.55)",
    badgeClass: "kg-badge-rootgap"
  },
  blocked_gap: {
    stroke: "#a855f7",
    fillDark: "#3b0764",
    fillLight: "#f3e8ff",
    glow: "rgba(168, 85, 247, 0.35)",
    badgeClass: "kg-badge-blocked"
  },
  locked: {
    stroke: "#64748b",
    fillDark: "#1e293b",
    fillLight: "#f1f5f9",
    glow: "rgba(100, 116, 139, 0.2)",
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
  const [displayMode, setDisplayMode] = useState<"graph" | "path">("graph");
  const [darkCanvas, setDarkCanvas] = useState(true);
  const [hoveredTopic, setHoveredTopic] = useState<TopicId | null>(null);
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [offsets, setOffsets] = useState<Partial<Record<TopicId, { dx: number; dy: number }>>>({});

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
  const activeLesson = lessons[lang].find((l) => l.id === activeNode.id)!;

  function getStatusLabel(status: GraphNodeStatus): string {
    switch (status) {
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
        node.status === "ready" ||
        node.unlocks.some((u) => {
          const child = nodeMap.get(u);
          return child?.status === "root_gap" || child?.status === "blocked_gap";
        })
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
    e.currentTarget.setPointerCapture(e.pointerId);
    const cur = offsets[id] ?? { dx: 0, dy: 0 };
    dragState.current = {
      kind: "node",
      topic: id,
      startX: e.clientX,
      startY: e.clientY,
      origX: cur.dx,
      origY: cur.dy
    };
    onSelectTopic(id);
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

  return (
    <div className="kg-root">
      {/* Сводные метрики Второго мозга */}
      <div className="kg-summary-bar">
        <div className="kg-metric">
          <span className="small">{t.summaryMastered}</span>
          <strong className="tabular-nums text-emerald-700">
            {graphState.summary.masteredCount} / 10
          </strong>
        </div>
        <div className="kg-metric">
          <span className="small">{t.summaryRootGaps}</span>
          <strong className="tabular-nums text-rose-700">
            {graphState.summary.rootGapCount}
          </strong>
        </div>
        <div className="kg-metric">
          <span className="small">{t.summaryAvg}</span>
          <strong className="tabular-nums">{graphState.summary.averageMastery}%</strong>
        </div>
        <div className="kg-metric">
          <span className="small">{t.summaryNext}</span>
          <button
            type="button"
            className="underline font-bold text-left text-sm text-primary"
            onClick={() => onSelectTopic(graphState.summary.nextBestTopic)}
          >
            {topicName(graphState.summary.nextBestTopic, lang)} →
          </button>
        </div>
      </div>

      {/* Панель фильтров и переключения режима */}
      <div className="flex flex-wrap items-center justify-between gap-2 my-3">
        <div className="flex flex-wrap gap-1.5" role="group" aria-label="Фильтр кластеров графа">
          {(
            [
              ["all", t.filterAll],
              ["gaps", t.filterGaps],
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
              onClick={() => setFilter(key)}
            >
              {label}
            </Button>
          ))}
        </div>

        <div className="flex items-center gap-1.5">
          <Button
            type="button"
            size="sm"
            variant={displayMode === "graph" ? "default" : "outline"}
            onClick={() => setDisplayMode("graph")}
          >
            <GitBranch size={14} />
            {t.modeGraph}
          </Button>
          <Button
            type="button"
            size="sm"
            variant={displayMode === "path" ? "default" : "outline"}
            onClick={() => setDisplayMode("path")}
          >
            <Layers size={14} />
            {t.modePath}
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

      {/* Легенда статусов узлов */}
      <div className="kg-legend">
        {(
          ["root_gap", "blocked_gap", "ready", "in_progress", "mastered"] as GraphNodeStatus[]
        ).map((st) => (
          <span key={st} className="kg-legend-item">
            <span
              className="kg-legend-dot"
              style={{
                backgroundColor: NODE_COLORS[st].stroke,
                boxShadow: `0 0 6px ${NODE_COLORS[st].glow}`
              }}
            />
            {getStatusLabel(st)}
          </span>
        ))}
      </div>

      {/* Двухколоночный макет: Холст Графа / Маршрут + Боковой инспектор узла */}
      <div className="kg-workspace mt-3">
        <div className="kg-main-col">
          {displayMode === "graph" ? (
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
                viewBox="0 0 880 460"
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
                  {/* Направленные рёбра пререквизитов */}
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

                  {/* Узлы тем ЕНТ */}
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
                        aria-label={`${node.orderNumber}. ${node.title} — ${getStatusLabel(
                          node.status
                        )} (${node.masteryPercent}%)`}
                        aria-pressed={isSelected}
                        style={{ opacity: nodeOpacity, cursor: "pointer" }}
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
                        {/* Внешнее кольцо выбранного или корневого узла */}
                        {(isSelected || node.status === "root_gap") && (
                          <circle
                            r={33}
                            fill="none"
                            stroke={isSelected ? "#38bdf8" : palette.stroke}
                            strokeWidth={isSelected ? 2.5 : 1.8}
                            strokeDasharray={node.status === "root_gap" && !isSelected ? "4 3" : undefined}
                          />
                        )}

                        {/* Основной круг узла */}
                        <circle
                          r={26}
                          fill={darkCanvas ? palette.fillDark : palette.fillLight}
                          stroke={palette.stroke}
                          strokeWidth={2.5}
                        />

                        {/* Номер темы и процент владения */}
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
                          {node.masteryPercent}%
                        </text>

                        {/* Подпись названия темы под узлом на контрастной плашке */}
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
          ) : (
            /* Пошаговый топологический маршрут закрытия пробелов */
            <div className="kg-path-list">
              <div className="mb-2">
                <h4 className="font-bold text-base m-0">{t.studyPlanTitle}</h4>
                <p className="small m-0">{t.studyPlanSub}</p>
              </div>
              {graphState.studyPlan.map((step) => {
                const palette = NODE_COLORS[step.status];
                return (
                  <div
                    key={step.topic}
                    className={`kg-step-card ${selectedTopic === step.topic ? "active" : ""}`}
                    onClick={() => onSelectTopic(step.topic)}
                  >
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <span className="kg-step-rank tabular-nums">#{step.rank}</span>
                        <strong>{step.title}</strong>
                      </div>
                      <span
                        className="kg-status-pill"
                        style={{ borderColor: palette.stroke }}
                      >
                        {getStatusLabel(step.status)} · {step.masteryPercent}%
                      </span>
                    </div>
                    <p className="small mt-1 mb-2">{step.reason}</p>
                    <div className="flex flex-wrap gap-2">
                      <Button
                        type="button"
                        size="sm"
                        variant="outline"
                        onClick={(e) => {
                          e.stopPropagation();
                          onOpenLesson(step.topic);
                        }}
                      >
                        <BookOpen size={13} />
                        {t.btnLesson}
                      </Button>
                      <a
                        className="cta-pill text-xs py-1 px-2.5"
                        href={`/lab?lang=${lang}&topic=${step.topic}`}
                        onClick={(e) => e.stopPropagation()}
                      >
                        <FlaskConical size={13} />
                        {t.btnLab}
                      </a>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Правая колонка: Инспектор выбранного узла («Второй мозг») */}
        <aside className="kg-inspector" aria-live="polite">
          <div className="flex items-start justify-between gap-2">
            <div>
              <span className="section-pill">{activeNode.untWeightLabel[lang]}</span>
              <h3 className="text-lg font-bold mt-1 mb-0">
                {activeNode.orderNumber}. {activeNode.title}
              </h3>
            </div>
            <span
              className="kg-status-pill"
              style={{ borderColor: NODE_COLORS[activeNode.status].stroke }}
            >
              {getStatusLabel(activeNode.status)}
            </span>
          </div>

          <div className="kg-inspector-stats mt-3">
            <div className="kg-mini-stat">
              <span className="small">{t.labStatLabel}</span>
              <strong className="tabular-nums">{activeNode.soloCount}/2</strong>
            </div>
            <div className="kg-mini-stat">
              <span className="small">{t.examStatLabel}</span>
              <strong className="tabular-nums">
                {activeNode.examRatio !== null
                  ? `${Math.round(activeNode.examRatio * 100)}%`
                  : t.examNotTaken}
              </strong>
            </div>
            <div className="kg-mini-stat">
              <span className="small">{t.summaryAvg}</span>
              <strong className="tabular-nums">{activeNode.masteryPercent}%</strong>
            </div>
          </div>

          {activeNode.dueForReview && (
            <div className="kg-due-banner mt-2">
              <Compass size={14} />
              <span>{t.dueBadge}</span>
            </div>
          )}

          {/* Предупреждение о блокирующем пререквизите */}
          {activeNode.missingPrerequisites.length > 0 && (
            <div className="kg-blocked-alert mt-3">
              <div className="flex items-center gap-1.5 font-bold text-xs">
                <Lock size={14} />
                <span>{t.blockedAlert}</span>
              </div>
              <div className="flex flex-wrap gap-1.5 mt-1.5">
                {activeNode.missingPrerequisites.map((preId) => (
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

          {/* Ключевой математический инвариант темы */}
          <div className="mt-3">
            <strong className="text-xs uppercase tracking-wider text-muted-foreground block mb-1">
              {t.invariantLabel}
            </strong>
            <div className="callout text-sm">{activeLesson.rule}</div>
          </div>

          {/* Типичные ловушки на ЕНТ */}
          <div className="mt-3">
            <strong className="text-xs uppercase tracking-wider text-muted-foreground block mb-1">
              {t.trapsLabel}
            </strong>
            <ul className="small list-disc pl-4 space-y-1 m-0">
              {activeNode.commonTraps[lang].map((trap) => (
                <li key={trap}>{trap}</li>
              ))}
            </ul>
          </div>

          {/* Связи графа: Пререквизиты и Зависимые темы */}
          <div className="mt-3">
            <strong className="text-xs uppercase tracking-wider text-muted-foreground block mb-1">
              {t.prereqTitle}
            </strong>
            {activeNode.prerequisites.length === 0 ? (
              <p className="small m-0">{t.noPrereq}</p>
            ) : (
              <div className="flex flex-wrap gap-1.5">
                {activeNode.prerequisites.map((preId) => {
                  const preNode = nodeMap.get(preId)!;
                  return (
                    <button
                      key={preId}
                      type="button"
                      className="kg-link-pill"
                      onClick={() => onSelectTopic(preId)}
                    >
                      <span>← {preNode.title}</span>
                      <small className="tabular-nums">({preNode.masteryPercent}%)</small>
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          <div className="mt-3">
            <strong className="text-xs uppercase tracking-wider text-muted-foreground block mb-1">
              {t.unlocksTitle}
            </strong>
            {activeNode.unlocks.length === 0 ? (
              <p className="small m-0">{t.noUnlocks}</p>
            ) : (
              <div className="flex flex-wrap gap-1.5">
                {activeNode.unlocks.map((depId) => {
                  const depNode = nodeMap.get(depId)!;
                  return (
                    <button
                      key={depId}
                      type="button"
                      className="kg-link-pill"
                      onClick={() => onSelectTopic(depId)}
                    >
                      <span>{depNode.title} →</span>
                      <small className="tabular-nums">({depNode.masteryPercent}%)</small>
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          {/* Целевые кнопки действий */}
          <div className="flex flex-wrap gap-2 mt-4 pt-3 border-t border-border">
            <Button type="button" size="sm" onClick={() => onOpenLesson(activeNode.id)}>
              <BookOpen size={14} />
              {t.btnLesson}
            </Button>
            <a
              className="cta-pill text-xs py-1.5 px-3"
              href={`/lab?lang=${lang}&topic=${activeNode.id}`}
            >
              <FlaskConical size={14} />
              {t.btnLab}
            </a>
            <Button type="button" size="sm" variant="outline" onClick={onOpenExam}>
              <CheckCircle2 size={14} />
              {t.btnExam}
            </Button>
            <Button
              type="button"
              size="sm"
              variant="ghost"
              onClick={() => onToggleWeakTopic(activeNode.id)}
            >
              {activeNode.isWeakMarked ? t.unmarkGapBtn : t.markGapBtn}
            </Button>
          </div>
        </aside>
      </div>
    </div>
  );
}
