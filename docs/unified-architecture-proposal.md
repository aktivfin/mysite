# OpenClaw OS — полный аудит и единая архитектура

## 1) Диагностика

### Критические
- Приложение может падать на старте: в `init()` вызывается `renderYT()`, но в коде определена только `loadYT()`. Это `ReferenceError`, который прерывает инициализацию, оставляя экран в непредсказуемом состоянии.
- Вся система держится на одном глобальном `STATE` + прямых мутациях + ручных `render*()` вызовах. Это ломает консистентность и создаёт «пропадающие» или устаревшие участки UI при любом пропуске нужного `render`.
- Слой данных неразделён: `localStorage`, Supabase и WebSocket смешаны в UI-обработчиках, без доменной модели и без транзакционного потока.
- Supabase sync реализован через destructive-подход (удалить всё и записать заново). Это высокий риск потерь, гонок и неконсистентности при сбоях сети.
- Аутентификация основана на хэше PIN в `localStorage`, без серверной проверки, без rate limit, без session hardening.

### Важные
- Значительная часть экранов/метрик имитирует данные (fake UI), не подтверждая интеграцию с реальными источниками.
- WebSocket-интеграция с OpenClaw не имеет ack/timeout/retry-idempotency-протокола и не связывает ответ со стабильным request-id.
- Массовое использование inline `onclick` и `innerHTML` повышает хрупкость и усложняет тесты/безопасность.
- Нет единого router/state-machine для навигации; экран переключается вручную через DOM-классы.
- Ошибки в `catch` часто «проглатываются» без UX-сигнала и без наблюдаемости.

### Средние
- Мобильный UX частично улучшен CSS-правилами, но логика остаётся desktop-first: отдельные fixed-элементы могут конфликтовать по высоте, а фокус/клавиатура не централизованы.
- Нет модульной типизации сущностей (Project/Task/Thread/Artifact), из-за чего поля дрейфуют между слоями.
- Нет политики версионирования/миграции client state.

## 2) Корневая причина

Система работает нестабильно из-за **отсутствия архитектурного разделения ответственности**:
- UI, бизнес-логика, транспорт и хранение данных слиты в один файл.
- Нет детерминированного потока состояния (single source of truth + предсказуемые переходы).
- Нет контрактов между модулями (domain model, events, adapters).

## 3) Единое архитектурное решение (одно целостное)

### Принцип
Переход на **Feature-Sliced SPA + Event-Driven State Core**:

1. **App Shell**: `Sidebar + Header + Content` как чистый layout.
2. **State Core** (Zustand/Redux Toolkit + finite-state для critical flows):
   - Единый store.
   - Все изменения только через events/actions.
   - Derived selectors для UI.
3. **Data Layer (Adapters)**:
   - `openclawWsAdapter` (WS, request-id, ack/timeout, reconnect policy).
   - `apiAdapter` (REST/HTTP).
   - `storageAdapter` (persist + schema versioning).
4. **Domain Modules**:
   - `chat`, `projects`, `tasks`, `habits`, `goals`, `artifacts`.
   - Каждый модуль: model + service + ui.
5. **Navigation**:
   - Router (React Router).
   - Sidebar работает от route config, а не от ручной DOM-манипуляции.
6. **Security Envelope**:
   - Пароль проверяется сервером (OpenClaw API), client хранит только short-lived token (httpOnly cookie preferred).
   - Ключи/API-secret никогда не в клиентском коде.
   - CSP + Trusted Types + строгая санитизация вывода.
7. **Reliability**:
   - Error boundaries, typed errors, retry policy.
   - Observability: event log + health panel + Sentry-like sink.

## 4) Референс-реализация

См. папку `reference-app/` — это рабочий каркас архитектуры, который закрывает текущие классы проблем единым способом.

## 5) Почему это работает

- Меню/навигация не «исчезают», потому что строятся из route-конфига и state-селектора, а не вручную через разрозненные `classList`.
- Состояние становится предсказуемым: любые изменения проходят через actions/events и можно воспроизводить баги.
- Интеграция OpenClaw становится надёжной: request-id, ack, timeout, reconnect, очередь pending.
- Безопасность повышается за счёт серверной auth и исключения секретов из браузера.
- Масштабируемость достигается через модульные домены и адаптеры, а не через рост одного HTML-файла.
