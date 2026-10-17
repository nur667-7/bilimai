# IC Hub на хостинге BilimAI

Адрес приложения: https://bilimai.dpdns.org/ic-hub/ . ЕНТ-платформа остаётся на главной странице. IC Hub использует HTTPS домена: iPhone не нужны локальный сертификат, работающий компьютер или общая Wi-Fi сеть.

## Хранение

Отдельный binding IC_DB подключён к D1 ic-hub-db (ea1df330-62e2-4e52-91a9-3afe11a0373d), account 47a49185ce37d4ab4bed323627e65687. База bilimai-db и её таблицы не изменяются.

- ic_records: аккаунты, профили, договоры, объекты, слоты, смены, фото-метаданные, замечания, штрафы, акты, платежи, сметы, уведомления и аудит. Ключ: kind + id; данные записи — JSON.
- ic_files: фотографии JPEG/PNG/WebP как BLOB до 1 МБ. Телефон уменьшает фото перед отправкой. Файлы находятся в облаке, а не в файловой системе Worker или на компьютере.
- ic_sessions: хеши восьмичасовых cookie-сессий, CSRF и срок действия. Сессия имеет отдельное имя и API path, не смешивается с аккаунтами BilimAI.
- ic_meta: версия данных, уникальный маркер атомарной операции и версия демонабора. Изменения выполняются одним D1 batch с проверкой версии и повторением при конфликте. Фото и отметка сохраняются вместе.

При первом обращении сервер однократно создаёт четыре MVP-кабинета, демонстрационный профиль оператора без реального ИИН, договор, объект, слот и назначенную двухчасовую смену. Повторный вход и публикация не возвращают записи к начальному состоянию. Просроченную неначатую демосмену можно явно перенести на сейчас из формы QR-входа. Демо-геозона привязывается к текущему месту телефона отдельной кнопкой; рабочие объекты оператор перемещать не может.

## Телефон и QR

Субподрядчик: «Смены → QR для оператора». Оператор сканирует QR камерой телефона, выбирает свой аккаунт и получает форму нужной смены. В приложении можно также открыть «Начать по QR» и отсканировать экран компьютера. QR фиксирует объект и назначение, а сервер дополнительно проверяет выбранного оператора, свежий GPS и 50-метровую геозону. Для конца нужны чек-лист, описание и обязательные фото. Повторная отправка не создаёт повторное начисление.

Уведомления и SLA обрабатываются при запросах и по минутному Cloudflare Cron. Фоновый системный push, банк, ЭЦП и государственный реестр не подключены. Вход без пароля сохранён для публичной демонстрации: выбор роли не является проверкой личности. Начальные суммы и допуски являются демоданными.

ИИН новых операторов хранится только как HMAC и последние четыре цифры. Ключ IC_IDENTITY_SECRET находится в Cloudflare secret и не хранится в GitHub. Не менять этот ключ без отдельной миграции существующих идентификаторов.

## Проверки и публикация

npm ci
npm test
npm run typecheck
npm run lint
npm run build

Миграции: node node_modules/wrangler/bin/wrangler.js d1 migrations apply ic-hub-db --remote --config ic-hub/wrangler.json

Публикация в существующий Worker, с сохранением runtime-переменных: задайте CLOUDFLARE_ACCOUNT_ID=47a49185ce37d4ab4bed323627e65687 и выполните node node_modules/wrangler/bin/wrangler.js deploy --config dist/server/wrangler.json --keep-vars.

Не публикуйте данные локального SQLite, локальные сертификаты или .dev.vars. Это самостоятельный deploy в пользовательский Cloudflare account; исходный .openai/hosting.json относится к более ранней публикации Sites.

Перед добавлением IC Hub активной была версия Worker 8a66d40e-0bf8-470c-9507-6c0b2a973f67. Откат кода не удаляет новую базу; перед откатом при необходимости экспортируйте IC_DB.

Проверено: 59 тестов (46 BilimAI + 13 IC Hub), TypeScript, ESLint без ошибок; четыре кабинета в локальном Workers/D1 и QR-переход в отдельном мобильном браузерном контексте. Начало/фото/завершение, повторные запросы, конкурирующие записи, SLA, АВР и выплаты проверяются на изолированной SQLite теми же подготовленными SQL-запросами.

## Дополнительные примеры кабинетов

Набор demo-accounts-v2 добавляет два договора и объекта, четыре принятые смены, забытый выход, два замечания, одно удержание, расчёт подрядчика, частичные демонстрационные выплаты, смету и АВР на приёмке клиента. Все примеры подписаны как демо; существующие записи и первая QR-смена не изменяются. При добавлении оператор получает пример заработка 10 000 ₸ и выплаты 2 500 ₸; это не реальная задолженность.

Подготовка SQL: node scripts/prepare-ic-hub-demo.mjs. После первого запуска базового приложения примените work/ic-hub-demo-accounts.sql через wrangler d1 execute ic-hub-db --remote --config ic-hub/wrangler.json --file work/ic-hub-demo-accounts.sql. Повторный импорт не перезаписывает данные: фиксированные ID и ON CONFLICT DO NOTHING сохраняют пользовательские правки. Резервную копию создавайте до импорта. SQL демонабора не является миграцией схемы.

## Неподтверждённые операторы в демонстрации

Для назначения на объект договора MVP-DEMO-SHIFT разрешён явный флаг demo_only=true. Он сохраняется у смены и показывается отдельной подписью в интерфейсе. Допуск и ИИН сотрудника при этом не меняются: UNKNOWN остаётся UNKNOWN. Правила пересечений, отдыха, слотов, бюджета, QR и GPS сохраняются. На остальных договорах этот флаг отклоняется. Обычное назначение без флага по-прежнему требует подтверждённого допуска. Начисления таких смен демонстрационные.

## Imported September register

The explicit `legacy-demo-v1` import adds 9 contracts, 14 contractor work packages for 11 physical facilities, 8 operator profiles, 22 source shifts, 5 complaints, 3 historical SLA deductions, 4 CPQ references and 18 scoped findings. Source snapshot is sanitized: no IINs, phone numbers, old PINs, old QR secrets or stock-photo evidence. Existing MVP accounts and Nurbek assignments are preserved. Contract budgets are allocated once across work packages.

`Контроль и риски` is scoped to manager, relevant contractor or the individual operator. Internal findings are never sent to clients. Contract risks also appear in the contract list, finance references in billing. Select September 2026 for historical records. Existing clients see only their contracts, objects, work status and complaints.

Source COMPLETED means completed, not manager approved: imported shifts await verification, earn zero pending review, and cannot be approved without a verified reconstruction. No payment or accepted act is fabricated from the report. The source contains 3 rejected OP-061 shifts, whereas the report claims 23; the discrepancy remains explicit. The reported 568,535 KZT already includes 15,000 KZT SLA and must not be added twice. September tax profile validity is not extended to today.

To refresh the sanitized snapshot, explicitly run `node scripts/import-ic-hub-legacy.mjs <source-db>`. Generate `legacyDemoSQL()` into an ignored work file and import into IC_DB after backup. Stable IDs use INSERT ON CONFLICT DO NOTHING, preserving user edits on repeated imports. The education database is separate.
