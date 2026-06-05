# MyWebMail

Учебный веб-клиент почты: React + Spring Boot + PostgreSQL + JWT + Flyway + Docker.

Репозиторий: [ZiroPoro/MyWebMail](https://github.com/ZiroPoro/MyWebMail)

Подготовка к защите: **[EXAM_PREP.md](./EXAM_PREP.md)**

## Требования

- Docker
- Java 21+
- Maven 3.9+
- Node.js 20+

## 1. База данных (Docker)

```bash
docker compose up -d
```

PostgreSQL: `localhost:5433` (порт **5433**, чтобы не конфликтовать с локальным Postgres), БД `mywebmail`, user/pass `webmail`.

Проверка backend: `curl http://localhost:8080/api/health` — должно быть `"apiVersion":"jwt-postgres-v2"`. Если версии нет — запущена **старая** сборка без входа.

## 2. Backend

```bash
cd Backend
mvn spring-boot:run
```

Flyway создаст таблицы `users`, `messages`. Тестовые пользователи — при первом старте (`DataSeeder`).

## 3. Frontend

```bash
cd Frontend
npm install
npm run dev
```

`http://localhost:5173` — прокси `/api` → `8080`.

## Учётные записи

| Email | Пароль | Роль |
|-------|--------|------|
| `admin@mywebmail.local` | `admin123` | ADMIN |
| `user@mywebmail.local` | `user123` | USER |

Регистрация: `/Login` → вкладка «Регистрация».

## Функции

- Вход / регистрация (JWT)
- Входящие и отправленные письма
- Отправка письма другому пользователю по email
- Админка: список пользователей, дата регистрации, удаление

## API (кратко)

| Метод | Путь | Описание |
|-------|------|----------|
| POST | `/api/auth/login` | Вход |
| POST | `/api/auth/register` | Регистрация |
| GET | `/api/auth/me` | Текущий user (Bearer) |
| GET | `/api/mail/inbox` | Входящие (пагинация) |
| GET | `/api/mail/sent` | Отправленные |
| POST | `/api/mail/send` | Отправить письмо |
| GET | `/api/admin/users` | Список users (ADMIN) |
| DELETE | `/api/admin/users/{id}` | Удалить user (ADMIN) |

## Если при входе «Forbidden»

На macOS на порту **8080** иногда два сервиса: **Spring** на `localhost`, **Jenkins** на `127.0.0.1`.  
Прокси Vite должен идти на `http://localhost:8080` (уже так в `vite.config.ts`).

1. Перезапустите Frontend: `Ctrl+C` → `npm run dev`
2. Проверка:  
   `curl -X POST http://localhost:5173/api/auth/login -H "Content-Type: application/json" -d '{"email":"admin@mywebmail.local","password":"admin123"}'`  
   должен вернуть JSON с `token`, а не HTML.
3. Лишний Java на 8080: `lsof -i :8080` — оставьте только MyWebMail.

## Если при входе «Not Found»

1. Остановите старый Java на 8080: `lsof -i :8080` → `kill <PID>`
2. `docker compose up -d` (БД на порту **5433**)
3. `cd Backend && mvn spring-boot:run`
4. Убедитесь: `curl http://localhost:8080/api/health` содержит `jwt-postgres-v2`
5. Вход: `admin@mywebmail.local` / `admin123`

## Стек

- **Backend:** Spring Boot, JPA, Security, JWT (jjwt), Flyway, PostgreSQL
- **Frontend:** React, TypeScript, Vite
- **Infra:** docker-compose

## Структура Backend (SOLID)

- `entity/` — JPA сущности
- `repository/` — Spring Data
- `service/` — интерфейсы + `*Impl`
- `controller/` — REST
- `security/` — JWT, фильтр, `SecurityConfig`
- `exception/` — `@ControllerAdvice`
