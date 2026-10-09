import type { Metadata } from "next";
import { SCIENTIFIC_METHODS } from "@/lib/scientific-pedagogy";

export const metadata: Metadata = {
  title: "О проекте, методике и архитектуре",
  description:
    "Для кого создан BilimAI, как устроены 12 предметов ЕНТ по стандарту НЦТ РК, исследовательские основания методик и нейро-символьная архитектура на базе Claude API.",
  alternates: {
    canonical: "https://bilimai.dpdns.org/about"
  }
};

export default function About() {
  return (
    <main className="document textbook-shell">
      <a href="/">← BilimAI · к занятиям и практике</a>

      <div className="document-card">
        <span className="eyebrow">О проекте и методике · BilimAI</span>
        <h1>BilimAI — учебная платформа пошагового разбора задач и подготовки к ЕНТ (ҰБТ)</h1>

        <div className="grid gap-3 sm:grid-cols-3 my-5 p-4 rounded-xl border border-stone-200 bg-stone-50/70">
          <div>
            <div className="text-xs font-bold uppercase tracking-wider text-stone-500">Для кого продукт</div>
            <p className="text-sm mt-1 mb-0">
              Для школьников 9–11 классов, абитуриентов ЕНТ (ҰБТ) и учителей Казахстана и Центральной Азии (на русском, казахском и узбекском языках).
            </p>
          </div>
          <div>
            <div className="text-xs font-bold uppercase tracking-wider text-stone-500">Что делает платформа</div>
            <p className="text-sm mt-1 mb-0">
              Учит находить первый неверный шаг в решении, разбирает все 16 разделов математики ЕНТ и даёт тренировку по 12 предметам НЦТ РК без готовых ГДЗ-ответов.
            </p>
          </div>
          <div>
            <div className="text-xs font-bold uppercase tracking-wider text-stone-500">Кто отвечает за проект</div>
            <p className="text-sm mt-1 mb-0">
              Разработчик и основатель: <strong>Нурбек Сайдуалиев</strong> (Алматы, Казахстан ·{" "}
              <a href="mailto:nurbek@bilimai.dpdns.org">nurbek@bilimai.dpdns.org</a>).
            </p>
          </div>
        </div>

        <h2>1. Соответствие официальному формату ЕНТ НЦТ РК и тренировочные наборы</h2>
        <p>
          По официальному регламенту Национального центра тестирования РК ({" "}
          <a href="https://testcenter.kz/?page_id=15074&lang=ru" target="_blank" rel="noreferrer">
            Формат ЕНТ на testcenter.kz
          </a>
          ) структура экзамена различается для обязательных и профильных предметов:
        </p>
        <ul className="list-disc pl-5 space-y-1.5">
          <li>
            <strong>Математическая грамотность (обязательный):</strong> 10 заданий с выбором одного ответа из 4 (максимум 10 баллов, пороговый балл — 3).
          </li>
          <li>
            <strong>Грамотность чтения (обязательный):</strong> 10 контекстных заданий с выбором одного ответа из 4 (максимум 10 баллов, пороговый балл — 3).
          </li>
          <li>
            <strong>История Казахстана (обязательный):</strong> 20 заданий (10 тестовых + 2 контекстных блока по 5 вопросов, максимум 20 баллов, пороговый балл — 5).
          </li>
          <li>
            <strong>Профильные предметы (9 предметов: Математика, Физика, Информатика, Химия, Биология, География, Всемирная история, Основы права, Английский язык):</strong>{" "}
            40 заданий = 50 баллов (№1–25 с одним ответом по 1 баллу, №26–30 контекстные по 1 баллу, №31–35 на соответствие по 2 балла, №36–40 с множественным выбором 1–3 из 6 по 2 балла; пороговый балл — 5).
          </li>
        </ul>
        <p>
          В разделе <strong>«Пробное ЕНТ»</strong> по умолчанию включён <strong>официальный режим НЦТ РК</strong> (10, 20 или 40 заданий в зависимости от предмета), а отдельно можно переключиться на <strong>расширенный тренировочный набор (40 задач)</strong> для углублённой отработки всех разделов предмета.
        </p>

        <h2>2. Исследовательское основание педагогических механик</h2>
        <p>
          Ниже приведены научные публикации, на идеи которых опирается архитектура BilimAI. Показатели из этих статей характеризуют результаты академических исследований в изученных учебных условиях и <strong>не являются утверждением об измеренном эффекте самого сайта</strong>:
        </p>
        <div className="space-y-3 my-4">
          {SCIENTIFIC_METHODS.map((m) => (
            <div key={m.id} className="p-3.5 rounded-lg border border-stone-200 bg-white/80">
              <div className="flex flex-wrap items-baseline justify-between gap-2">
                <strong className="text-sm">{m.title.ru}</strong>
                <span className="text-xs font-mono text-stone-600">{m.effectMetric}</span>
              </div>
              <p className="text-xs text-stone-700 mt-1 mb-1">{m.evidenceSummary.ru}</p>
              <p className="text-xs text-stone-600 mb-1">{m.platformMechanism.ru}</p>
              <a
                href={m.sourceUrl}
                target="_blank"
                rel="noreferrer"
                className="text-xs font-medium underline"
              >
                Источник: {m.sourceCitation}
              </a>
            </div>
          ))}
        </div>

        <h2>3. Методика расчёта ориентиров по грантам ВУЗов РК</h2>
        <p>
          В разделе ориентировочной оценки баллов используются публичные минимальные и комфортные пороговые баллы по профильной математике (из 50) на основе статистики грантового конкурса 2024–2025 учебных годов по группам образовательных программ (ГОП: <code>B057 Информационные технологии</code>, <code>B059 Информационная безопасность</code>, <code>B055 Математика и статистика</code>, <code>B062 Электротехника и автоматизация</code>) и спецификации{" "}
          <a href="https://testcenter.kz/?page_id=15074&lang=ru" target="_blank" rel="noreferrer">
            НЦТ РК (testcenter.kz)
          </a>
          . Расчёт носит справочно-ориентировочный характер: фактическое присуждение государственного образовательного гранта МНВО РК зависит от суммарного балла ЕНТ (из 140), выбранной комбинации профильных предметов и квот текущего года.
        </p>

        <h2>4. Зачем в BilimAI используется Claude API (Нейро-символьная архитектура)</h2>
        <p>
          Детерминированное ядро проверяет численные и дробные ответы без галлюцинаций, а генеративная модель <strong>Anthropic Claude Haiku 4.5 (<code>claude-haiku-4-5-20251001</code>)</strong> отвечает за три открытые педагогические задачи:
        </p>
        <ol className="list-decimal pl-5 space-y-2">
          <li>
            <strong>Пояснение вопроса ученика (<code>POST /api/explain</code>):</strong> отвечает на вопрос в свободной форме на русском, казахском или узбекском языке с опорой на правило текущего урока и задаёт один встречный вопрос для самопроверки.
          </li>
          <li>
            <strong>Диагностика шага в Тренировке ошибок (<code>POST /api/lab-diagnose</code>):</strong> поясняет, какое тождество нарушено в выбранной строке решения, не раскрывая готовый численный ответ задачи на перенос.
          </li>
          <li>
            <strong>Составление учебного маршрута (<code>POST /api/roadmap</code>):</strong> помогает распределить темы для повторения по неделям с учётом цели ученика и графа пререквизитов.
          </li>
        </ol>

        <h2>5. Контакты и открытый код</h2>
        <ul className="list-disc pl-5 space-y-1">
          <li>
            <strong>Разработчик:</strong> Нурбек Сайдуалиев (Алматы, Казахстан ·{" "}
            <a href="mailto:nurbek@bilimai.dpdns.org">nurbek@bilimai.dpdns.org</a>)
          </li>
          <li>
            <strong>Платформа:</strong> <a href="https://bilimai.dpdns.org">https://bilimai.dpdns.org</a> ·{" "}
            <a href="/privacy">Политика приватности</a>
          </li>
          <li>
            <strong>Репозиторий:</strong>{" "}
            <a href="https://github.com/nur667-7/bilimai" target="_blank" rel="noreferrer">
              github.com/nur667-7/bilimai
            </a>
          </li>
        </ul>
      </div>
    </main>
  );
}
