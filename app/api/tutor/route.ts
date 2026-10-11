import type { Locale } from "../../../lib/curriculum.ts";
import {
  findSubjectLessonByIdOrSlug,
  getSubjectCurriculum,
  type UniversalLesson,
  type UniversalSubjectCurriculum
} from "../../../lib/universal-curriculum.ts";

export const dynamic = "force-dynamic";

export type TutorModeCode =
  | "simple"
  | "step_by_step"
  | "hint"
  | "check_solution"
  | "why_wrong"
  | "similar_task"
  | "memorize"
  | "exam_prep"
  | "socratic";

export interface TutorRequestPayload {
  subjectId?: string;
  topicId?: string;
  lessonId?: string;
  mode?: string;
  locale?: Locale;
  userMessage?: string;
  lessonContext?: string;
}

export interface TutorResponsePayload {
  reply: string;
  explanation: string;
  nextStepPrompt: string;
  mode: TutorModeCode;
  subjectId: string;
  lessonId: string;
  fallbackUsed: boolean;
  source: "deterministic_fallback";
}

function normalizeLocale(raw?: string): Locale {
  if (raw === "kk" || raw === "uz") return raw;
  return "ru";
}

function normalizeTutorMode(raw?: string): TutorModeCode {
  const valid: TutorModeCode[] = [
    "simple",
    "step_by_step",
    "hint",
    "check_solution",
    "why_wrong",
    "similar_task",
    "memorize",
    "exam_prep",
    "socratic"
  ];
  if (raw && (valid as string[]).includes(raw)) {
    return raw as TutorModeCode;
  }
  return "step_by_step";
}

export function buildSubjectTutorReply(
  curriculum: UniversalSubjectCurriculum,
  lesson: UniversalLesson,
  mode: TutorModeCode,
  locale: Locale,
  userMessage = ""
): TutorResponsePayload {
  const title = lesson.title[locale] ?? lesson.title.ru;
  const goal = lesson.learningGoal[locale] ?? lesson.learningGoal.ru;
  const simple = lesson.simpleExplanation[locale] ?? lesson.simpleExplanation.ru;
  const detailed = lesson.detailedExplanation[locale] ?? lesson.detailedExplanation.ru;
  const problem = lesson.workedExample.problem[locale] ?? lesson.workedExample.problem.ru;
  const steps = lesson.workedExample.steps[locale] ?? lesson.workedExample.steps.ru;
  const takeaway = lesson.workedExample.takeaway[locale] ?? lesson.workedExample.takeaway.ru;
  const summary = lesson.summary[locale] ?? lesson.summary.ru;
  const block = lesson.contentBlocks[0];
  const blockTitle = block ? block.title[locale] ?? block.title.ru : "";
  const blockBody = block ? block.body[locale] ?? block.body.ru : "";

  const practiceQ = lesson.questions[0];
  const secondQ = lesson.questions[1] ?? lesson.questions[0];
  const thirdQ = lesson.questions[2] ?? lesson.questions[0];

  const errorCase =
    curriculum.errorLabCases.find((c) => c.topicId === lesson.topicId) ??
    curriculum.errorLabCases[0];

  let explanation = "";
  let nextStepPrompt = "";

  switch (mode) {
    case "simple": {
      if (locale === "kk") {
        explanation = [
          `【Қарапайым тілмен: «${title}»】`,
          `• Басты мағынасы: ${simple}`,
          blockBody ? `• Негізгі тірек формула / ереже (${blockTitle}):\n${blockBody}` : "",
          `• Неліктен бұл маңызды: ${goal}`
        ]
          .filter(Boolean)
          .join("\n\n");
        nextStepPrompt = `Қорытынды ереже: ${takeaway}`;
      } else if (locale === "uz") {
        explanation = [
          `【Oddiy tilda: «${title}»】`,
          `• Asosiy mohiyati: ${simple}`,
          blockBody ? `• Tayanch formula / qoida (${blockTitle}):\n${blockBody}` : "",
          `• Nima uchun muhim: ${goal}`
        ]
          .filter(Boolean)
          .join("\n\n");
        nextStepPrompt = `Asosiy xulosa: ${takeaway}`;
      } else {
        explanation = [
          `【Простыми словами: «${title}»】`,
          `• Суть без перегруза: ${simple}`,
          blockBody ? `• Опорная схема / правило (${blockTitle}):\n${blockBody}` : "",
          `• Зачем это нужно на практике: ${goal}`
        ]
          .filter(Boolean)
          .join("\n\n");
        nextStepPrompt = `Главный ориентир: ${takeaway}`;
      }
      break;
    }

    case "step_by_step": {
      if (locale === "kk") {
        explanation = [
          `【Қадамдық талдау: «${title}»】`,
          `Есептің шарты: ${problem}`,
          `Шешу алгоритмі:\n${steps.join("\n")}`,
          `Тексеру ережесі: ${takeaway}`
        ].join("\n\n");
        nextStepPrompt = "Енді «3. Түсінуді тексеру» блогындағы тапсырманы осы алгоритммен орындап көріңіз.";
      } else if (locale === "uz") {
        explanation = [
          `【Qadam-baqadam tahlil: «${title}»】`,
          `Masala sharti: ${problem}`,
          `Yechish algoritmi:\n${steps.join("\n")}`,
          `Tekshirish qoidasi: ${takeaway}`
        ].join("\n\n");
        nextStepPrompt = "Endi «3. Tushunishni tekshirish» blokidagi topshiriqni shu algoritm bilan yechib ko‘ring.";
      } else {
        explanation = [
          `【Пошаговый разбор: «${title}»】`,
          `Условие задачи: ${problem}`,
          `Алгоритм решения по шагам:\n${steps.join("\n")}`,
          `Контрольный вывод: ${takeaway}`
        ].join("\n\n");
        nextStepPrompt = "Попробуйте применить эти же 3 шага к заданию в блоке «3. Проверка понимания».";
      }
      break;
    }

    case "hint": {
      const hintText = practiceQ ? practiceQ.hint[locale] ?? practiceQ.hint.ru : takeaway;
      const firstStep = steps[0] ?? simple;
      if (locale === "kk") {
        explanation = [
          `【Жауапсыз бағыттаушы кеңес: «${title}»】`,
          `1-қадам (неден бастау керек): ${firstStep}`,
          `Назар аударатын кілт: ${hintText}`,
          `Есте сақтаңыз: дайын жауапты бірден іздемей, алдымен шарттағы шамаларды негізгі ережемен салыстырыңыз.`
        ].join("\n\n");
        nextStepPrompt = `Өзіңізді тексеру сұрағы: осы қадамнан кейін қандай формуланы немесе ережені қолданасыз?`;
      } else if (locale === "uz") {
        explanation = [
          `【Javobsiz yo‘naltiruvchi maslahat: «${title}»】`,
          `1-qadam (nimadan boshlash kerak): ${firstStep}`,
          `E’tibor berish kerak bo‘lgan kalit: ${hintText}`,
          `Eslatma: tayyor javobga shoshilmang, avval shartdagi qiymatlarni qoida bilan solishtiring.`
        ].join("\n\n");
        nextStepPrompt = `O‘zingizni tekshiring: birinchi qadamdan so‘ng qaysi qoidani qo‘llaysiz?`;
      } else {
        explanation = [
          `【Наводящая подсказка без готового ответа: «${title}»】`,
          `• С чего начать (Шаг 1): ${firstStep}`,
          `• Ключевая зацепка: ${hintText}`,
          `• Ориентир без спойлера: выпишите исходные данные и сверьте ограничения правила перед подстановкой.`
        ].join("\n\n");
        nextStepPrompt = `Попробуйте самостоятельно выполнить второй шаг и нажать «Проверить ответ» в тренажёре.`;
      }
      break;
    }

    case "check_solution": {
      const errStep = errorCase ? errorCase.correctedStep[locale] ?? errorCase.correctedStep.ru : takeaway;
      if (locale === "kk") {
        explanation = [
          `【Шешімді тексеру чек-парағы: «${title}»】`,
          `Жауабыңызды мына 3 критерий бойынша тексеріңіз:`,
          `1. Бастапқы жазылу: ${steps[0] ?? simple}`,
          `2. Негізгі түрлендіру (жиі қате кететін жер): ${errStep}`,
          `3. Соңғы тексеру: ${takeaway}`,
          userMessage ? `Сіздің сұранысыңыз бойынша ескерту: «${userMessage.slice(0, 140)}» — өлшем бірліктері мен таңбаларды міндетті түрде салыстырыңыз.` : ""
        ]
          .filter(Boolean)
          .join("\n\n");
        nextStepPrompt = "Егер 2-тармақта ауытқу болса, «Қателер зертханасы» қойындысындағы талдауды ашыңыз.";
      } else if (locale === "uz") {
        explanation = [
          `【Yechimni tekshirish ro‘yxati: «${title}»】`,
          `Yechimingizni 3 меzon bo‘yicha tekshiring:`,
          `1. Dastlabki yozuv: ${steps[0] ?? simple}`,
          `2. Asosiy shakl almashtirish: ${errStep}`,
          `3. Yakuniy tekshiruv: ${takeaway}`
        ].join("\n\n");
        nextStepPrompt = "Agar 2-bandda farq bo‘lsa, «Xatolar laboratoriyasi» bo‘limini oching.";
      } else {
        explanation = [
          `【Чек-лист проверки вашего решения: «${title}»】`,
          `Сверьте свой черновик по 3 контрольным точкам:`,
          `1. Запись условия и единиц/терминов: ${steps[0] ?? simple}`,
          `2. Критический переход (где чаще всего теряют балл): ${errStep}`,
          `3. Финальная самопроверка: ${takeaway}`,
          userMessage ? `По вашему запросу («${userMessage.slice(0, 140)}»): убедитесь, что во втором шаге не пропущено ограничение правила.` : ""
        ]
          .filter(Boolean)
          .join("\n\n");
        nextStepPrompt = "Если все 3 контрольные точки совпали — вводите ответ в карточку проверки понимания.";
      }
      break;
    }

    case "why_wrong": {
      const trapTitle = errorCase ? errorCase.title[locale] ?? errorCase.title.ru : title;
      const whyBroken = errorCase ? errorCase.whyBroken[locale] ?? errorCase.whyBroken.ru : takeaway;
      const corrected = errorCase ? errorCase.correctedStep[locale] ?? errorCase.correctedStep.ru : steps.join(" → ");
      if (locale === "kk") {
        explanation = [
          `【Неліктен қате шығады: «${trapTitle}»】`,
          `• Қатенің түпкі себебі: ${whyBroken}`,
          `• Дұрыс орындау үлгісі: ${corrected}`,
          `• Ереже: ${detailed}`
        ].join("\n\n");
        nextStepPrompt = `Кеңес: «${takeaway}» ережесін әр есептің соңында тексеріңіз.`;
      } else if (locale === "uz") {
        explanation = [
          `【Nega javob xato chiqadi: «${trapTitle}»】`,
          `• Xatoning tub sababi: ${whyBroken}`,
          `• To‘g‘ri бажаrish namunasi: ${corrected}`,
          `• Qoida: ${detailed}`
        ].join("\n\n");
        nextStepPrompt = `Maslahat: «${takeaway}» qoidasini har bir masalada tekshiring.`;
      } else {
        explanation = [
          `【Разбор типичной ошибки: «${trapTitle}»】`,
          `• Почему возникает ошибка: ${whyBroken}`,
          `• Как правильно выполнить этот шаг: ${corrected}`,
          `• Полное правило темы: ${detailed}`
        ].join("\n\n");
        nextStepPrompt = `Правило защиты от ловушки: ${takeaway}`;
      }
      break;
    }

    case "similar_task": {
      const simPrompt = secondQ ? secondQ.prompt[locale] ?? secondQ.prompt.ru : problem;
      const simHint = secondQ ? secondQ.hint[locale] ?? secondQ.hint.ru : takeaway;
      if (locale === "kk") {
        explanation = [
          `【Өзін-өзі тексеруге арналған ұқсас тапсырма: «${title}»】`,
          `Тапсырма: ${simPrompt}`,
          `Бағыттаушы кеңес: ${simHint}`
        ].join("\n\n");
        nextStepPrompt = "Жауабыңызды «3. Түсінуді тексеру» блогында немесе «Практика» қойындысында тексере аласыз.";
      } else if (locale === "uz") {
        explanation = [
          `【Mustaqil mashq uchun o‘xshash topshiriq: «${title}»】`,
          `Topshiriq: ${simPrompt}`,
          `Yo‘naltiruvchi maslahat: ${simHint}`
        ].join("\n\n");
        nextStepPrompt = "Javobingizni «3. Tushunishni tekshirish» yoki «Amaliyot» bo‘limida tekshirishingiz mumkin.";
      } else {
        explanation = [
          `【Похожая задача для закрепления: «${title}»】`,
          `Условие: ${simPrompt}`,
          `Подсказка к решению: ${simHint}`
        ].join("\n\n");
        nextStepPrompt = "Решите эту задачу в блоке «3. Проверка понимания» (вопрос #2) и сверьте разбор.";
      }
      break;
    }

    case "memorize": {
      if (locale === "kk") {
        explanation = [
          `【Қысқаша конспект және формулалар: «${title}»】`,
          `1. Мақсат: ${goal}`,
          `2. Негізгі ереже: ${simple}`,
          blockBody ? `3. Формула / кесте (${blockTitle}):\n${blockBody}` : `3. Толық ереже: ${detailed}`,
          `4. Есте сақтау түйіні: ${summary}`
        ].join("\n\n");
        nextStepPrompt = `Түйінді қағида: ${takeaway}`;
      } else if (locale === "uz") {
        explanation = [
          `【Qisqa konspekt va qoidalar: «${title}»】`,
          `1. Maqsad: ${goal}`,
          `2. Asosiy qoida: ${simple}`,
          blockBody ? `3. Formula / jadval (${blockTitle}):\n${blockBody}` : `3. To‘liq qoida: ${detailed}`,
          `4. Xulosa: ${summary}`
        ].join("\n\n");
        nextStepPrompt = `Eslab qoling: ${takeaway}`;
      } else {
        explanation = [
          `【Краткий конспект и шпаргалка: «${title}»】`,
          `1. Цель темы: ${goal}`,
          `2. Базовое правило: ${simple}`,
          blockBody ? `3. Опорная формула / схема (${blockTitle}):\n${blockBody}` : `3. Углублённое правило: ${detailed}`,
          `4. Резюме урока: ${summary}`
        ].join("\n\n");
        nextStepPrompt = `Главная формула памяти: ${takeaway}`;
      }
      break;
    }

    case "exam_prep": {
      const trapWhy = errorCase ? errorCase.whyBroken[locale] ?? errorCase.whyBroken.ru : takeaway;
      const advPrompt = thirdQ ? thirdQ.prompt[locale] ?? thirdQ.prompt.ru : problem;
      if (locale === "kk") {
        explanation = [
          `【ҰБТ / емтиханға дайындық: «${title}»】`,
          `• Емтиханда не тексеріледі: ${goal}`,
          `• Басты емтихан тұзағы: ${trapWhy}`,
          `• Күрделі деңгейдегі типтік сұрақ (#3): ${advPrompt}`
        ].join("\n\n");
        nextStepPrompt = `Ұпай жоғалтпау ережесі: ${takeaway}`;
      } else if (locale === "uz") {
        explanation = [
          `【Imtihonga tayyorgarlik: «${title}»】`,
          `• Imtihonda nima tekshiriladi: ${goal}`,
          `• Asosiy tuzoq: ${trapWhy}`,
          `• Yuqori darajadagi savol namunasi (#3): ${advPrompt}`
        ].join("\n\n");
        nextStepPrompt = `Ball yo‘qotmaslik qoidasi: ${takeaway}`;
      } else {
        explanation = [
          `【Подготовка к тесту и ловушки ЕНТ: «${title}»】`,
          `• Что проверяет экзамен в этой теме: ${goal}`,
          `• Главная тестовая ловушка (дистрактор): ${trapWhy}`,
          `• Пример профильного вопроса повышенной сложности (#3): ${advPrompt}`
        ].join("\n\n");
        nextStepPrompt = `Золотое правило на экзамене: ${takeaway}`;
      }
      break;
    }

    case "socratic": {
      const socPrompt = thirdQ ? thirdQ.prompt[locale] ?? thirdQ.prompt.ru : problem;
      const socHint = thirdQ ? thirdQ.hint[locale] ?? thirdQ.hint.ru : takeaway;
      if (locale === "kk") {
        explanation = [
          `【Сократтық тексеру сұрағы: «${title}»】`,
          `Түсінгеніңізді тексеру үшін мына сұраққа жауап беріп көріңіз:`,
          `«${socPrompt}»`,
          `Ойлануға бағыт: ${socHint}`
        ].join("\n\n");
        nextStepPrompt = "Өз жауабыңызды төмендегі өріске жазыңыз немесе «3. Түсінуді тексеру» блогында тексеріңіз.";
      } else if (locale === "uz") {
        explanation = [
          `【Sokratik tekshiruv savoli: «${title}»】`,
          `Tushunganingizni синаб ko‘rish uchun savol:`,
          `«${socPrompt}»`,
          `O‘ylash uchun yo‘nalish: ${socHint}`
        ].join("\n\n");
        nextStepPrompt = "Javobingizni pastdagi майdonga yozing yoki «3. Tushunishni tekshirish» blokida tekshiring.";
      } else {
        explanation = [
          `【Сократический проверочный вопрос: «${title}»】`,
          `Проверим глубину понимания темы без подсказки готового ответа:`,
          `«${socPrompt}»`,
          `Наводящий вопрос: ${socHint}`
        ].join("\n\n");
        nextStepPrompt = "Напишите свой ход мысли в поле ниже или проверьте ответ в вопросе #3 текущего урока.";
      }
      break;
    }
  }

  const reply = `${explanation}\n\n${nextStepPrompt}`;

  return {
    reply,
    explanation,
    nextStepPrompt,
    mode,
    subjectId: curriculum.id,
    lessonId: lesson.id,
    fallbackUsed: true,
    source: "deterministic_fallback"
  };
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as TutorRequestPayload;
    const locale = normalizeLocale(body.locale);
    const mode = normalizeTutorMode(body.mode);
    const subjectId = body.subjectId && typeof body.subjectId === "string" ? body.subjectId : "math";

    const curriculum = getSubjectCurriculum(subjectId) ?? getSubjectCurriculum("math")!;
    const resolvedLesson =
      findSubjectLessonByIdOrSlug(curriculum, body.lessonId || body.topicId)?.lesson ??
      curriculum.lessons[0];

    const payload = buildSubjectTutorReply(
      curriculum,
      resolvedLesson,
      mode,
      locale,
      typeof body.userMessage === "string" ? body.userMessage : ""
    );

    return Response.json(payload, { status: 200 });
  } catch {
    const fallbackCurriculum = getSubjectCurriculum("math")!;
    const fallbackLesson = fallbackCurriculum.lessons[0];
    return Response.json(
      buildSubjectTutorReply(fallbackCurriculum, fallbackLesson, "step_by_step", "ru"),
      { status: 200 }
    );
  }
}
