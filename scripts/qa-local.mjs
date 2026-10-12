import { spawn, spawnSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT_DIR = path.resolve(__dirname, "..");
const ARTIFACTS_DIR = path.join(ROOT_DIR, "artifacts", "local-qa");

fs.mkdirSync(ARTIFACTS_DIR, { recursive: true });

async function loadPlaywright() {
  const candidates = [
    path.join(ROOT_DIR, "node_modules", "playwright", "index.mjs"),
    "C:/Users/NiTrOv15/AppData/Local/npm-cache/_npx/31e32ef8478fbf80/node_modules/playwright/index.mjs"
  ];
  for (const candidate of candidates) {
    if (fs.existsSync(candidate)) {
      return import(pathToFileURL(candidate).href);
    }
  }
  return import("playwright");
}

function runCommandStep(name, command, args) {
  const startedAt = Date.now();
  console.log(`\n[QA:LOCAL] Running step: ${name} (${command} ${args.join(" ")})...`);
  const result = spawnSync(command, args, {
    cwd: ROOT_DIR,
    shell: process.platform === "win32",
    encoding: "utf8",
    maxBuffer: 20 * 1024 * 1024
  });
  const durationMs = Date.now() - startedAt;
  const passed = result.status === 0;
  if (!passed) {
    console.error(`[QA:LOCAL] Step FAILED: ${name}`);
    if (result.stdout) console.error(result.stdout.slice(-2000));
    if (result.stderr) console.error(result.stderr.slice(-2000));
  } else {
    console.log(`[QA:LOCAL] Step PASSED: ${name} (${durationMs}ms)`);
  }
  return {
    name,
    command: `${command} ${args.join(" ")}`,
    passed,
    exitCode: result.status ?? 1,
    durationMs
  };
}

async function waitForLocalServer(url, timeoutMs = 45000) {
  const deadline = Date.now() + timeoutMs;
  while (Date.now() < deadline) {
    try {
      const res = await fetch(url);
      if (res.status >= 200 && res.status < 500) {
        return true;
      }
    } catch {
      // retry
    }
    await new Promise((r) => setTimeout(r, 600));
  }
  return false;
}

async function main() {
  const report = {
    timestamp: new Date().toISOString(),
    mode: "STRICT_LOCAL_ONLY",
    localOrigin: "",
    externalRequestViolations: [],
    consoleErrors: [],
    pageErrors: [],
    cliSteps: [],
    e2eScenarios: [],
    viewportChecks: [],
    a11yAndMotionChecks: [],
    screenshots: [],
    overallPassed: false
  };

  // 1. CLI Verification Steps (Unit/Integration Tests, TypeScript, ESLint, Build)
  const testStep = runCommandStep("Unit & Integration Tests", "npm", ["test"]);
  report.cliSteps.push(testStep);

  const typecheckStep = runCommandStep("TypeScript Typecheck", "npm", ["run", "typecheck"]);
  report.cliSteps.push(typecheckStep);

  const lintStep = runCommandStep("ESLint Static Analysis", "npm", ["run", "lint"]);
  report.cliSteps.push(lintStep);

  const buildStep = runCommandStep("Production Build", "npm", ["run", "build"]);
  report.cliSteps.push(buildStep);

  // 2. Start Strictly Local Server on 127.0.0.1
  const PORT = 4195;
  const BASE_URL = `http://127.0.0.1:${PORT}`;
  report.localOrigin = BASE_URL;

  console.log(`\n[QA:LOCAL] Starting local server on ${BASE_URL}...`);
  const serverArgs = [
    "./node_modules/vinext/dist/cli.js",
    "dev",
    "--port",
    String(PORT),
    "--host",
    "127.0.0.1"
  ];

  const serverProc = spawn(process.execPath, serverArgs, {
    cwd: ROOT_DIR,
    stdio: ["ignore", "pipe", "pipe"]
  });

  let serverLogs = "";
  serverProc.stdout?.on("data", (chunk) => {
    serverLogs += chunk.toString();
  });
  serverProc.stderr?.on("data", (chunk) => {
    serverLogs += chunk.toString();
  });

  const killServer = () => {
    try {
      if (process.platform === "win32" && serverProc.pid) {
        spawnSync("taskkill", ["/PID", String(serverProc.pid), "/T", "/F"], {
          stdio: "ignore"
        });
      } else {
        serverProc.kill("SIGTERM");
      }
    } catch {
      // ignore
    }
  };

  let browser = null;
  try {
    const ready = await waitForLocalServer(`${BASE_URL}/welcome`, 45000);
    if (!ready) {
      console.error("[QA:LOCAL] Server output:\n", serverLogs.slice(-2000));
      throw new Error(`Local server failed to start on ${BASE_URL} within 45s`);
    }
    console.log(`[QA:LOCAL] Local server ready at ${BASE_URL}`);

    const { chromium } = await loadPlaywright();
    const chromePath = "C:/Program Files/Google/Chrome/Application/chrome.exe";
    browser = await chromium.launch({
      headless: true,
      ...(fs.existsSync(chromePath) ? { executablePath: chromePath } : {})
    });

    const context = await browser.newContext({
      viewport: { width: 1440, height: 900 }
    });

    // STRICT LOCAL-ONLY NETWORK GUARD: block & record any non-localhost request
    await context.route("**/*", async (route) => {
      const reqUrl = route.request().url();
      if (reqUrl.startsWith("http://") || reqUrl.startsWith("https://")) {
        const parsed = new URL(reqUrl);
        if (parsed.hostname !== "127.0.0.1" && parsed.hostname !== "localhost") {
          report.externalRequestViolations.push(reqUrl);
          await route.abort("blockedbyclient");
          return;
        }
      }
      await route.continue();
    });

    const page = await context.newPage();
    page.on("pageerror", (err) => {
      report.pageErrors.push(String(err?.message || err));
    });
    page.on("console", (msg) => {
      if (msg.type() === "error") {
        const txt = msg.text();
        if (!txt.includes("favicon")) {
          report.consoleErrors.push(txt);
        }
      }
    });

    const saveShot = async (fileName) => {
      const fullPath = path.join(ARTIFACTS_DIR, fileName);
      await page.screenshot({ path: fullPath, fullPage: false });
      report.screenshots.push(fileName);
      return fileName;
    };

    // E2E-1: Welcome -> Home -> Subjects Catalog
    await page.goto(`${BASE_URL}/welcome`, { waitUntil: "networkidle" });
    const welcomeTitleVisible = await page.locator("h1").first().isVisible();
    await saveShot("01_welcome_desktop_1440.png");

    await page.goto(`${BASE_URL}/subjects`, { waitUntil: "networkidle" });
    const subjectsCount = await page.locator('a[href^="/subjects/"]').count();
    await saveShot("02_subjects_catalog_desktop_1440.png");
    report.e2eScenarios.push({
      id: "E2E-1",
      title: "Welcome -> Subjects Catalog (12 subjects)",
      passed: welcomeTitleVisible && subjectsCount >= 12,
      details: `welcomeTitleVisible=${welcomeTitleVisible}, subjectLinksCount=${subjectsCount}`
    });

    // E2E-2: Subject Overview -> Lesson -> Step-by-Step Study -> Question Check -> Practice
    await page.goto(`${BASE_URL}/subjects/history_kz`, { waitUntil: "networkidle" });
    const heroVisible = await page.locator('[data-testid="subject-overview-hero"]').isVisible();
    await saveShot("03_subject_history_kz_overview.png");

    await page.goto(`${BASE_URL}/subjects/history_kz/lessons/history_kz-lesson-hkz_ancient_saka`, {
      waitUntil: "networkidle"
    });
    const lessonHeading = await page.locator("h1, h2").first().innerText();
    await saveShot("04_subject_history_kz_lesson.png");
    report.e2eScenarios.push({
      id: "E2E-2",
      title: "Subject Overview & Lesson Deep-Link (history_kz)",
      passed: heroVisible && lessonHeading.length > 0,
      details: `heroVisible=${heroVisible}, lessonHeading="${lessonHeading.slice(0, 60)}"`
    });

    // E2E-3: CRITICAL Subject-Topic Mismatch Guard (subject=history_kz&topic=stereometry)
    await page.goto(`${BASE_URL}/?subject=history_kz&topic=stereometry`, {
      waitUntil: "networkidle"
    });
    const rootMismatchBanner = page.locator('[data-testid="subject-topic-mismatch-banner"]');
    const rootMismatchVisible = await rootMismatchBanner.isVisible();
    const rootMismatchText = rootMismatchVisible ? await rootMismatchBanner.innerText() : "";
    const redirectPanelVisible = await page
      .locator('[data-testid="cross-subject-redirect-panel"]')
      .isVisible();
    await saveShot("05_mismatch_guard_root_history_kz_stereometry.png");

    await page.goto(`${BASE_URL}/subjects/history_kz?topic=stereometry`, {
      waitUntil: "networkidle"
    });
    const subjMismatchBanner = page.locator('[data-testid="subject-topic-mismatch-banner"]');
    const subjMismatchVisible = await subjMismatchBanner.isVisible();
    await saveShot("06_mismatch_guard_subject_history_kz_stereometry.png");

    // Click resolution button to study history_kz and verify banner clears
    const openSelectedSubjBtn = page.locator('[data-testid="mismatch-open-selected-subject-btn"]');
    if (await openSelectedSubjBtn.isVisible()) {
      await openSelectedSubjBtn.click();
    }
    const bannerAfterResolve = await subjMismatchBanner.isVisible();

    report.e2eScenarios.push({
      id: "E2E-3",
      title: "Subject-Topic Mismatch Guard (subject=history_kz&topic=stereometry)",
      passed:
        rootMismatchVisible &&
        redirectPanelVisible &&
        subjMismatchVisible &&
        !bannerAfterResolve &&
        rootMismatchText.includes("Математика"),
      details: `rootMismatchVisible=${rootMismatchVisible}, redirectPanelVisible=${redirectPanelVisible}, subjMismatchVisible=${subjMismatchVisible}, clearedAfterResolve=${!bannerAfterResolve}`
    });

    // E2E-4: Error Lab (/lab)
    await page.goto(`${BASE_URL}/lab`, { waitUntil: "networkidle" });
    const labVisible = await page.locator("main").first().isVisible();
    await saveShot("07_error_lab_desktop.png");
    report.e2eScenarios.push({
      id: "E2E-4",
      title: "Error Lab (/lab) interactive workspace",
      passed: labVisible,
      details: `labVisible=${labVisible}`
    });

    // E2E-5: Knowledge Graph (/?tab=graph)
    await page.goto(`${BASE_URL}/?tab=graph`, { waitUntil: "networkidle" });
    const graphVisible = await page.locator("svg").first().isVisible();
    await saveShot("08_knowledge_graph_desktop.png");
    report.e2eScenarios.push({
      id: "E2E-5",
      title: "Interactive Knowledge Graph (/?tab=graph)",
      passed: graphVisible,
      details: `graphSvgVisible=${graphVisible}`
    });

    // E2E-6: Global Search Modal (valid search + empty state)
    await page.goto(`${BASE_URL}/`, { waitUntil: "networkidle" });
    const searchTrigger = page.locator('[data-testid="global-search-trigger"]');
    await searchTrigger.click();
    const searchDialog = page.locator('[data-testid="global-search-dialog"]');
    const searchInput = page.locator('[data-testid="global-search-input"]');
    await searchInput.fill("стереометрия");
    const stereoResultsCount = await page.locator('[data-testid="global-search-result-item"]').count();
    await saveShot("09_global_search_results.png");

    await searchInput.fill("nonexistent_query_xyz_98765");
    const emptyStateVisible = await page.locator('[data-testid="global-search-empty"]').isVisible();
    await page.keyboard.press("Escape");
    const dialogClosedOnEsc = !(await searchDialog.isVisible());

    report.e2eScenarios.push({
      id: "E2E-6",
      title: "Global Search (results, empty state, Escape close)",
      passed: stereoResultsCount >= 1 && emptyStateVisible && dialogClosedOnEsc,
      details: `stereoResults=${stereoResultsCount}, emptyStateVisible=${emptyStateVisible}, dialogClosedOnEsc=${dialogClosedOnEsc}`
    });

    // E2E-7: AI Tutor Local Deterministic Response (/subjects/physics?start=tutor)
    await page.goto(`${BASE_URL}/subjects/physics?start=tutor`, { waitUntil: "networkidle" });
    const tutorModeBtn = page.locator('[data-testid^="tutor-mode-"]').first();
    let tutorReplied = false;
    if (await tutorModeBtn.isVisible()) {
      await tutorModeBtn.click();
      await page.waitForTimeout(600);
      const badgeVisible = await page.locator('[data-testid="tutor-verification-badge"]').first().isVisible();
      const assistantMsgCount = await page.locator('[data-testid^="tutor-message-assistant-"]').count();
      tutorReplied = badgeVisible || assistantMsgCount > 0;
    }
    await saveShot("10_ai_tutor_physics_response.png");
    report.e2eScenarios.push({
      id: "E2E-7",
      title: "AI Tutor deterministic local response (/subjects/physics?start=tutor)",
      passed: tutorReplied,
      details: `tutorReplied=${tutorReplied}`
    });

    // E2E-8: UNT Mock Exam for Kazakhstan History (/?tab=exam&subject=history_kz)
    await page.goto(`${BASE_URL}/?tab=exam&subject=history_kz`, { waitUntil: "networkidle" });
    const startExamBtn = page
      .locator("button")
      .filter({ hasText: /Начать|Бастау|Boshlash/i })
      .first();
    let examResultHasRealHistoryTopics = false;
    if (await startExamBtn.isVisible()) {
      await startExamBtn.click();
      await page.waitForTimeout(300);
      const firstOption = page.locator(".unt-option-card, .unt-opt-btn").first();
      if (await firstOption.isVisible()) {
        await firstOption.click();
      }
      const finishBtn = page
        .locator("button")
        .filter({ hasText: /Завершить|Аяқтау|Yakunlash/i })
        .first();
      if (await finishBtn.isVisible()) {
        await finishBtn.click();
        await page.waitForTimeout(300);
      }
      const resultText = await page.locator("main").innerText();
      const hasMathTopicLeak =
        resultText.includes("Стереометрия") || resultText.includes("Тригонометрия");
      examResultHasRealHistoryTopics = !hasMathTopicLeak;
    }
    await saveShot("11_unt_exam_history_kz_result.png");
    report.e2eScenarios.push({
      id: "E2E-8",
      title: "UNT Mock Exam (history_kz) result screen without math topic leak",
      passed: examResultHasRealHistoryTopics,
      details: `examResultHasRealHistoryTopics=${examResultHasRealHistoryTopics}`
    });

    // E2E-9: 404 Not Found Page
    const res404 = await page.goto(`${BASE_URL}/non-existent-route-404-qa`, {
      waitUntil: "networkidle"
    });
    const status404 = res404?.status() ?? 0;
    const body404 = await page.locator("body").innerText();
    await saveShot("12_not_found_404.png");
    report.e2eScenarios.push({
      id: "E2E-9",
      title: "404 Not Found screen",
      passed: status404 === 404 || body404.includes("404") || body404.includes("не найдена"),
      details: `httpStatus=${status404}`
    });

    // E2E-10: Figma 2.0 Sidebar, Home Cards & Full Clickability Hit-Test Audit (Desktop 1440x900 + Mobile 390x844)
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto(`${BASE_URL}/?lang=ru`, { waitUntil: "networkidle" });
    const figmaSidebarVisible = await page.locator('[data-testid="figma-desktop-sidebar"]').isVisible();
    const figmaHomeOverviewVisible = await page.locator('[data-testid="figma-home-overview"]').isVisible();
    const figmaPrimaryCtaVisible = await page.locator('[data-testid="figma-home-primary-cta"]').isVisible();

    // Click Figma sidebar items and verify breadcrumb updates
    await page.locator('[data-testid="figma-nav-lesson"]').click();
    const bcLesson = await page.locator('[data-testid="figma-topbar-breadcrumb"]').innerText();
    await page.locator('[data-testid="figma-nav-graph"]').click();
    const bcGraph = await page.locator('[data-testid="figma-topbar-breadcrumb"]').innerText();
    await page.locator('[data-testid="figma-nav-exam"]').click();
    const bcExam = await page.locator('[data-testid="figma-topbar-breadcrumb"]').innerText();
    await page.locator('[data-testid="figma-nav-ai"]').click();
    const bcAi = await page.locator('[data-testid="figma-topbar-breadcrumb"]').innerText();
    await page.locator('[data-testid="figma-nav-profile"]').click();
    const bcProfile = await page.locator('[data-testid="figma-topbar-breadcrumb"]').innerText();
    await page.locator('[data-testid="figma-nav-today"]').click();
    const bcToday = await page.locator('[data-testid="figma-topbar-breadcrumb"]').innerText();

    // Hit-test audit across key routes on Desktop (1440x900) and Mobile (390x844)
    const auditRoutes = ["/?lang=ru", "/welcome?lang=ru", "/subjects?lang=ru", "/subjects/history_kz?lang=ru", "/lab?lang=ru", "/login?lang=ru"];
    let totalInteractiveChecked = 0;
    const hitTestFailures = [];

    for (const vp of [
      { width: 1440, height: 900, name: "desktop" },
      { width: 390, height: 844, name: "mobile" }
    ]) {
      await page.setViewportSize({ width: vp.width, height: vp.height });
      for (const route of auditRoutes) {
        await page.goto(`${BASE_URL}${route}`, { waitUntil: "networkidle" });
        const routeCheck = await page.evaluate((vw) => {
          const selectors = 'button, a[href], input, select, textarea, summary, [role="tab"]';
          const nodes = Array.from(document.querySelectorAll(selectors));
          let checked = 0;
          const issues = [];
          for (const el of nodes) {
            const style = window.getComputedStyle(el);
            if (
              style.display === "none" ||
              style.visibility === "hidden" ||
              parseFloat(style.opacity) === 0 ||
              style.pointerEvents === "none"
            ) {
              continue;
            }
            const rect = el.getBoundingClientRect();
            if (rect.width < 4 || rect.height < 4) continue;
            // Only hit-test elements currently inside the visible viewport
            if (rect.top < 0 || rect.bottom > window.innerHeight || rect.left < 0 || rect.right > vw) {
              if (rect.left < -2 || rect.right > vw + 2) {
                // Ignore elements inside horizontally scrollable containers
                let parent = el.parentElement;
                let inScrollable = false;
                while (parent) {
                  const ps = window.getComputedStyle(parent);
                  if (ps.overflowX === "auto" || ps.overflowX === "scroll" || ps.overflowX === "hidden") {
                    inScrollable = true;
                    break;
                  }
                  parent = parent.parentElement;
                }
                if (!inScrollable) {
                  issues.push(`Offscreen(${Math.round(rect.left)}..${Math.round(rect.right)}): ${el.tagName} "${(el.textContent || "").trim().slice(0, 30)}"`);
                }
              }
              continue;
            }
            const cx = rect.left + rect.width / 2;
            const cy = rect.top + rect.height / 2;
            const topEl = document.elementFromPoint(cx, cy);
            checked++;
            if (topEl && !el.contains(topEl) && !topEl.contains(el)) {
              const label = el.closest("label");
              if (!label || !label.contains(topEl)) {
                issues.push(
                  `Blocked: ${el.tagName} "${(el.textContent || "").trim().slice(0, 28)}" covered by <${topEl.tagName.toLowerCase()} class="${topEl.className}">`
                );
              }
            }
          }
          return { checked, issues };
        }, vp.width);
        totalInteractiveChecked += routeCheck.checked;
        for (const issue of routeCheck.issues) {
          hitTestFailures.push(`[${vp.name} ${route}] ${issue}`);
        }
      }
    }

    report.e2eScenarios.push({
      id: "E2E-10",
      title: "Figma 2.0 Navigation & Full Clickability Hit-Test Audit (Desktop & Mobile)",
      passed:
        figmaSidebarVisible &&
        figmaHomeOverviewVisible &&
        figmaPrimaryCtaVisible &&
        bcLesson.includes("Урок") &&
        bcGraph.includes("Карта") &&
        bcExam.includes("ЕНТ") &&
        bcAi.includes("ИИ") &&
        bcProfile.includes("Профиль") &&
        bcToday.includes("Главная") &&
        hitTestFailures.length === 0,
      details: `checkedElements=${totalInteractiveChecked}, hitTestFailures=${hitTestFailures.length}${hitTestFailures.length > 0 ? " (" + hitTestFailures.slice(0, 3).join("; ") + ")" : ""}`
    });

    // 3. Visual Regression & Horizontal Overflow Audit across all 6 required viewports
    const viewports = [
      { width: 360, height: 800, label: "360x800_mobile_small" },
      { width: 390, height: 844, label: "390x844_mobile_standard" },
      { width: 768, height: 1024, label: "768x1024_tablet" },
      { width: 1024, height: 768, label: "1024x768_laptop" },
      { width: 1440, height: 900, label: "1440x900_desktop" },
      { width: 1920, height: 1080, label: "1920x1080_wide" }
    ];

    for (const vp of viewports) {
      await page.setViewportSize({ width: vp.width, height: vp.height });
      await page.goto(`${BASE_URL}/?lang=ru`, { waitUntil: "networkidle" });
      const overflowInfo = await page.evaluate(() => ({
        scrollWidth: document.documentElement.scrollWidth,
        clientWidth: document.documentElement.clientWidth,
        hasHorizontalOverflow:
          document.documentElement.scrollWidth > document.documentElement.clientWidth + 1
      }));
      await saveShot(`vp_${vp.label}_home.png`);
      report.viewportChecks.push({
        viewport: `${vp.width}x${vp.height}`,
        route: "/?lang=ru",
        ...overflowInfo,
        passed: !overflowInfo.hasHorizontalOverflow
      });
    }

    // 4. Accessibility & Reduced Motion Verification
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.goto(`${BASE_URL}/?lang=ru`, { waitUntil: "networkidle" });
    const reducedMotionComputed = await page.evaluate(() => {
      const el = document.querySelector(".section-surface") || document.body;
      const cs = window.getComputedStyle(el);
      return {
        animationDuration: cs.animationDuration,
        transitionDuration: cs.transitionDuration
      };
    });
    const animSec = Number.parseFloat(reducedMotionComputed.animationDuration);
    const transSec = Number.parseFloat(reducedMotionComputed.transitionDuration);
    const reducedMotionPassed =
      !Number.isNaN(animSec) &&
      !Number.isNaN(transSec) &&
      animSec <= 0.001 &&
      transSec <= 0.001;

    await page.keyboard.press("Tab");
    const activeTag = await page.evaluate(() => document.activeElement?.tagName ?? "NONE");

    report.a11yAndMotionChecks.push({
      check: "prefers-reduced-motion: reduce",
      passed: reducedMotionPassed,
      details: JSON.stringify(reducedMotionComputed)
    });
    report.a11yAndMotionChecks.push({
      check: "Keyboard Tab focus navigation",
      passed: activeTag !== "BODY" && activeTag !== "NONE",
      details: `activeElement=${activeTag}`
    });
  } finally {
    if (browser) {
      await browser.close().catch(() => {});
    }
    killServer();
  }

  const allCliPassed = report.cliSteps.every((s) => s.passed);
  const allE2ePassed = report.e2eScenarios.every((s) => s.passed);
  const allVpPassed = report.viewportChecks.every((v) => v.passed);
  const allA11yPassed = report.a11yAndMotionChecks.every((a) => a.passed);
  const zeroExternalRequests = report.externalRequestViolations.length === 0;

  report.overallPassed =
    allCliPassed && allE2ePassed && allVpPassed && allA11yPassed && zeroExternalRequests;

  const jsonPath = path.join(ARTIFACTS_DIR, "qa-report.json");
  fs.writeFileSync(jsonPath, JSON.stringify(report, null, 2), "utf8");

  const mdLines = [
    "# BilimAI 2.0 — Local Automated QA Report",
    "",
    `- **Timestamp:** \`${report.timestamp}\``,
    `- **Execution Mode:** \`${report.mode}\` (\`${report.localOrigin}\`)`,
    `- **External Network Requests:** \`${report.externalRequestViolations.length}\` (Strictly 0 allowed)`,
    `- **Overall Status:** **${report.overallPassed ? "PASSED" : "FAILED"}**`,
    "",
    "## 1. CLI Verification Steps",
    "| Step | Command | Status | Duration |",
    "| --- | --- | --- | --- |",
    ...report.cliSteps.map(
      (s) => `| ${s.name} | \`${s.command}\` | ${s.passed ? "PASS" : "FAIL"} | ${s.durationMs}ms |`
    ),
    "",
    "## 2. Local Playwright E2E Scenarios",
    "| ID | Scenario | Status | Details |",
    "| --- | --- | --- | --- |",
    ...report.e2eScenarios.map(
      (e) => `| ${e.id} | ${e.title} | ${e.passed ? "PASS" : "FAIL"} | ${e.details} |`
    ),
    "",
    "## 3. Responsive Viewports (360, 390, 768, 1024, 1440, 1920px)",
    "| Viewport | Route | scrollWidth | clientWidth | Status |",
    "| --- | --- | --- | --- | --- |",
    ...report.viewportChecks.map(
      (v) =>
        `| ${v.viewport} | \`${v.route}\` | ${v.scrollWidth} | ${v.clientWidth} | ${
          v.passed ? "PASS (No overflow)" : "FAIL"
        } |`
    ),
    "",
    "## 4. Accessibility & Reduced Motion Checks",
    "| Check | Status | Details |",
    "| --- | --- | --- |",
    ...report.a11yAndMotionChecks.map(
      (a) => `| ${a.check} | ${a.passed ? "PASS" : "FAIL"} | \`${a.details}\` |`
    ),
    ""
  ];
  const mdPath = path.join(ARTIFACTS_DIR, "qa-report.md");
  fs.writeFileSync(mdPath, mdLines.join("\n"), "utf8");

  console.log(`\n[QA:LOCAL] Report saved to:`);
  console.log(`  - ${jsonPath}`);
  console.log(`  - ${mdPath}`);
  console.log(`[QA:LOCAL] Overall Status: ${report.overallPassed ? "PASSED" : "FAILED"}`);

  if (!report.overallPassed) {
    process.exit(1);
  }
}

main().catch((err) => {
  console.error("[QA:LOCAL] Fatal error:", err);
  process.exit(1);
});
