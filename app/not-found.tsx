import Link from "next/link";

export default function NotFound() {
  return (
    <main className="document">
      <div className="document-card">
        <span className="eyebrow">404 · Страница не найдена / Бет табылмады</span>
        <h1>Такой страницы нет</h1>
        <p>
          Проверьте адрес ссылки или вернитесь к базовым урокам и тренировке поиска ошибок по математике ЕНТ (ҰБТ).
        </p>
        <p className="small">
          Бұл бет табылмады. Негізгі сабақтарға немесе қателер зертханасына оралыңыз. · Sahifa topilmadi.
        </p>
        <div className="actions">
          <Link href="/" className="btn-link primary">
            Перейти к урокам и практике →
          </Link>
          <Link href="/lab" className="btn-link outline">
            Открыть тренировку ошибок (/lab)
          </Link>
        </div>
      </div>
    </main>
  );
}
