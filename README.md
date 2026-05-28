# MyWebMail

Учебный веб-клиент почты: React (Frontend) + Spring Boot (Backend).

Репозиторий: [ZiroPoro/MyWebMail](https://github.com/ZiroPoro/MyWebMail)

## Требования

- Node.js 20+
- Java 21+
- Maven 3.9+

## Запуск Backend

```bash
cd Backend
mvn spring-boot:run
```

API: `http://localhost:8080/api/health`, `http://localhost:8080/api/mail/inbox`

## Запуск Frontend

```bash
cd Frontend
npm install
npm run dev
```

Откройте `http://localhost:5173`. Запросы к `/api/*` проксируются на Backend.

## Страницы

| Путь | Описание |
|------|----------|
| `/WebMail` | Входящие (список писем с API) |
| `/Login` | Демо-форма входа |
| `/Admin` | Статистика |
| `/About` | О проекте |

## Структура

- `Frontend/` — Vite + React + TypeScript
- `Backend/` — Spring Boot REST API с демо-входящими
