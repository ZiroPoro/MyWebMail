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

PostgreSQL: `localhost:5432`, БД `mywebmail`, user/pass `webmail`.

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
