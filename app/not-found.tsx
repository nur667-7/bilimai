export default function NotFound() {
  return (
    <main className="document agy-shell">
      <div className="document-card agy-floating-island">
        <span className="eyebrow">404 · Страница не найдена / Бет табылмады</span>
        <h1>Такой страницы нет</h1>
        <p>
          Проверьте адрес ссылки или вернитесь к базовым урокам и тренировке поиска ошибок по математике ЕНТ (ҰБТ).
        </p>
        <p className="small">
          Бұл бет табылмады. Негізгі сабақтарға немесе қателер зертханасына оралыңыз. · Sahifa topilmadi.
        </p>
        <div className="actions">
          <a href="/" className="btn-link primary">
            Перейти к урокам и практике →
          </a>
          <a href="/lab" className="btn-link outline">
            Открыть тренировку ошибок (/lab)
          </a>
        </div>
      </div>
    </main>
  );
}
