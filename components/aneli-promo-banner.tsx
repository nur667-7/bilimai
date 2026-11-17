import {
  ArrowRight,
  AtSign,
  Clock,
  MessageCircle
} from "lucide-react";
import {
  ANELI_INSTAGRAM_URL,
  ANELI_THREADS_URL,
  ANELI_WHATSAPP_PHONE,
  buildWhatsAppOrderUrl
} from "@/lib/aneli-studio";

type AneliPromoBannerProps = {
  lang?: "ru" | "kk" | "uz";
  context?: "teacher" | "student" | "general";
  className?: string;
};

const COPY = {
  ru: {
    badge: "Партнёрская студия · Анели Продакшн (@anelii.y)",
    speed: "От 15 минут · Каз / Рус",
    titleGeneral:
      "Нужна презентация, ҚМЖ или СОР/СОЧ? Сделаем от 80 ₸ / слайд за 15 минут",
    titleTeacher:
      "Готовые презентации и ҚМЖ для открытых уроков — от 80 ₸/слайд и 500 ₸ за ҚМЖ",
    titleStudent:
      "Презентация к СРСП, уроку или диплому за 15 минут — 80 ₸/слайд (15 слайдов = 1 200 ₸)",
    desc: "Статика (80 ₸/слайд), анимация (150 ₸/слайд), ҚМЖ по стандарту МОН РК (500 ₸), СОР/СОЧ и рефераты (100 ₸/стр.). Титулка, план и список литературы — бесплатно. Оплата Kaspi после превью.",
    whatsappCta: `Заказать в WhatsApp · ${ANELI_WHATSAPP_PHONE}`,
    priceCta: "Прайс и калькулятор"
  },
  kk: {
    badge: "Серіктес студия · Анели Продакшн (@anelii.y)",
    speed: "15 минуттан бастап · Қаз / Орыс",
    titleGeneral:
      "Презентация, ҚМЖ немесе БЖБ/ТЖБ керек пе? 80 ₸/слайдтан бастап 15 минутта",
    titleTeacher:
      "Ашық сабаққа дайын презентация мен ҚМЖ — 80 ₸/слайд және ҚМЖ 500 ₸",
    titleStudent:
      "СӨЖ, сабақ немесе дипломға презентация 15 минутта — 80 ₸/слайд (15 слайд = 1 200 ₸)",
    desc: "Қарапайым слайд (80 ₸), анимациялық слайд (150 ₸), ҚМЖ (500 ₸), БЖБ/ТЖБ және реферат (100 ₸/бет). Титулка, жоспар, әдебиеттер — тегін. Төлем превьюден кейін Kaspi арқылы.",
    whatsappCta: `WhatsApp-қа жазу · ${ANELI_WHATSAPP_PHONE}`,
    priceCta: "Бағалар және калькулятор"
  },
  uz: {
    badge: "Hamkor studiya · Анели Продакшн (@anelii.y)",
    speed: "15 daqiqadan boshlab · Qoz / Rus",
    titleGeneral:
      "Taqdimot, ҚМЖ yoki referat kerakmi? 80 ₸/slayddan 15 daqiqada tayyor",
    titleTeacher:
      "Ochiq dars uchun tayyor taqdimot va ҚМЖ — 80 ₸/slayd, ҚМЖ 500 ₸",
    titleStudent:
      "Universitet va maktab uchun taqdimot 15 daqiqada — 80 ₸/slayd (15 slayd = 1 200 ₸)",
    desc: "Statik (80 ₸/slayd), animatsion (150 ₸/slayd), ҚМЖ (500 ₸), referatlar (100 ₸/bet). Titul, reja va adabiyotlar — bepul. To‘lov prevyudan keyin Kaspi orqali.",
    whatsappCta: `WhatsApp orqali buyurtma · ${ANELI_WHATSAPP_PHONE}`,
    priceCta: "Narxlar va kalkulyator"
  }
} as const;

function InstagramIcon() {
  return (
    <svg
      className="h-4 w-4 shrink-0"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
    </svg>
  );
}

export function AneliPromoBanner({
  lang = "ru",
  context = "general",
  className = ""
}: AneliPromoBannerProps) {
  const c = COPY[lang] ?? COPY.ru;
  const heading =
    context === "teacher"
      ? c.titleTeacher
      : context === "student"
        ? c.titleStudent
        : c.titleGeneral;

  const waHref = buildWhatsAppOrderUrl(
    lang === "kk"
      ? "Сәлеметсіз бе! BilimAI арқылы келдім, презентация / ҚМЖ жасатқым келеді:"
      : "Здравствуйте! Перешёл(а) с BilimAI, хочу заказать презентацию / ҚМЖ:"
  );

  return (
    <aside
      aria-label="Анели Продакшн (@anelii.y)"
      className={className}
      style={{
        backgroundColor: "var(--bilimai-surface, #FFFFFF)",
        border: "1px solid var(--bilimai-border, #D8E0EE)",
        borderRadius: 12,
        padding: "20px 22px",
        color: "var(--bilimai-text, #0F172A)"
      }}
    >
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          alignItems: "center",
          gap: 8,
          marginBottom: 10
        }}
      >
        <span
          style={{
            display: "inline-flex",
            alignItems: "center",
            padding: "3px 10px",
            borderRadius: 6,
            fontSize: 12,
            fontWeight: 700,
            backgroundColor: "var(--bilimai-selected-bg, #E0E7FF)",
            color: "var(--bilimai-selected-text, #1E3A8A)"
          }}
        >
          {c.badge}
        </span>
        <span
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 5,
            padding: "3px 10px",
            borderRadius: 6,
            fontSize: 12,
            fontWeight: 600,
            backgroundColor: "var(--bilimai-surface-raised, #EEF2F9)",
            color: "var(--bilimai-text-muted, #475569)"
          }}
        >
          <Clock className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
          <span>{c.speed}</span>
        </span>
      </div>

      <h3
        style={{
          margin: 0,
          fontSize: "1.08rem",
          fontWeight: 700,
          lineHeight: 1.3,
          color: "var(--bilimai-text, #0F172A)"
        }}
      >
        {heading}
      </h3>

      <p
        style={{
          margin: "8px 0 0",
          fontSize: "0.9rem",
          lineHeight: 1.5,
          maxWidth: "70ch",
          color: "var(--bilimai-text-muted, #475569)"
        }}
      >
        {c.desc}
      </p>

      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          alignItems: "center",
          gap: 10,
          marginTop: 14
        }}
      >
        <a
          href={waHref}
          target="_blank"
          rel="noopener noreferrer"
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 8,
            minHeight: 44,
            padding: "9px 16px",
            borderRadius: 8,
            backgroundColor: "var(--bilimai-brand, #254EDB)",
            color: "#FFFFFF",
            fontSize: 13.5,
            fontWeight: 600,
            textDecoration: "none"
          }}
        >
          <MessageCircle className="h-4 w-4 shrink-0" aria-hidden="true" />
          <span>{c.whatsappCta}</span>
        </a>

        <a
          href="/presentations"
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 6,
            minHeight: 44,
            padding: "9px 14px",
            borderRadius: 8,
            backgroundColor: "var(--bilimai-surface-raised, #EEF2F9)",
            border: "1px solid var(--bilimai-border, #D8E0EE)",
            color: "var(--bilimai-text, #0F172A)",
            fontSize: 13.5,
            fontWeight: 600,
            textDecoration: "none"
          }}
        >
          <span>{c.priceCta}</span>
          <ArrowRight className="h-4 w-4 shrink-0" aria-hidden="true" />
        </a>

        <a
          href={ANELI_THREADS_URL}
          target="_blank"
          rel="noopener noreferrer"
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 6,
            minHeight: 44,
            padding: "8px 10px",
            fontSize: 13,
            fontWeight: 600,
            color: "var(--bilimai-text, #0F172A)",
            textDecoration: "underline",
            textUnderlineOffset: 3
          }}
        >
          <AtSign className="h-4 w-4 shrink-0" aria-hidden="true" />
          <span>Threads @anelii.y</span>
        </a>

        <a
          href={ANELI_INSTAGRAM_URL}
          target="_blank"
          rel="noopener noreferrer"
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 6,
            minHeight: 44,
            padding: "8px 10px",
            fontSize: 13,
            fontWeight: 600,
            color: "var(--bilimai-text, #0F172A)",
            textDecoration: "underline",
            textUnderlineOffset: 3
          }}
        >
          <InstagramIcon />
          <span>Instagram @anelii.y</span>
        </a>
      </div>
    </aside>
  );
}
