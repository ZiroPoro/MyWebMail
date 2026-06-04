# Ветки проекта MyWebMail

Документ для защиты: показывает, что разработка шла **поэтапно**, с разными подходами.  
Актуальная рабочая версия — **`master`**.

## Схема эволюции

```
prototype/frontend-ui     →  только React, без нормального backend
        ↓
experiment/demo-api     →  Spring + демо-данные в памяти (без БД)
        ↓
feature/docker-flyway   →  PostgreSQL + Flyway + зависимости
        ↓
feature/jpa-entities    →  сущности и репозитории JPA
        ↓
feature/jwt-security    →  JWT и Spring Security
        ↓
feature/backend-api     →  REST, SOLID-сервисы, ControllerAdvice
        ↓
feature/frontend-auth   →  вход по JWT на фронте + админка
        ↓
feature/mail-ui         →  отправка писем между пользователями
        ↓
master                  →  README + EXAM_PREP (итог)
```

---

## Локальные ветки (мои эксперименты)

### `prototype/frontend-ui` (коммит `ef247a0`, ~30.04.2026)

**Что делал:** поднял React + TypeScript, роутер, страницы-заглушки (Login, Admin, About, WebMail), Navbar и Header.

**Зачем отдельная ветка:** сначала хотел убедиться, что UI и навигация работают, без привязки к серверу.

**Почему не остановился здесь:** не было реальных данных с сервера — только пустые страницы.

**Как посмотреть:**
```bash
git checkout prototype/frontend-ui
cd Frontend && npm install && npm run dev
```

---

### `experiment/demo-api` (коммит `5343dc6`, 28.05.2026)

**Что делал:** первый рабочий Spring Boot REST: `/api/health`, `/api/mail/inbox` с **фиктивными письмами в памяти**; на фронте — форма «входа» через `sessionStorage` (без проверки пароля на сервере).

**Зачем:** быстро показать связку Frontend ↔ Backend до подключения БД.

**Минусы подхода:** данные пропадают при перезапуске; «вход» не настоящий; не подходит для курса по Security/JWT.

**Вывод:** ушёл в ветки с PostgreSQL и JWT.

```bash
git checkout experiment/demo-api
cd Backend && mvn spring-boot:run
```

---

### `feature/docker-flyway` (коммит `8d0fd03`, 29.05.2026)

**Что делал:** `docker-compose.yml` для PostgreSQL, миграция Flyway `V1__schema.sql`, обновил `pom.xml` (JPA, Security, JWT, Flyway).

**Зачем:** отделить инфраструктуру БД от бизнес-логики — так проще отлаживать Flyway на сдаче (10 КТ).

**Что ещё не было:** Java-сущностей и контроллеров под новую схему.

---

### `feature/jpa-entities` (коммит `eb61eb1`, 30.05.2026)

**Что делал:** `UserEntity`, `MessageEntity` (односторонние `@ManyToOne`), репозитории с **Query Method** и **пагинацией**, DTO (`UserDto`, `MailMessageDto`, `ErrorResponse`).

**Зачем:** закрепить 5–6 КТ (Entity, связи, запросы) до включения Security.

**Связь с SOLID:** позже сервисы вынесены в интерфейсы на следующих ветках.

---

### `feature/jwt-security` (коммит `757ecff`, 30.05.2026)

**Что делал:** `SecurityConfig` + `@EnableWebSecurity`, `JwtService`, `JwtAuthFilter` (`OncePerRequestFilter`, `addFilterBefore`).

**Зачем:** пробовал stateless-авторизацию вместо токенов в памяти с прошлой ветки.

**Что ещё не было:** полных REST-эндпоинтов регистрации и почты на БД.

---

### `feature/backend-api` (коммит `a537ba4`, 01.06.2026)

**Что делал:** контроллеры `Auth`, `Admin`, `Mail`; `@ControllerAdvice` + `ErrorResponse`; сервисы `*Service` / `*Impl`; `DataSeeder`; убрал старый in-memory auth.

**Зачем:** собрать «скелет» backend под сдачу (2–4 КТ: ResponseEntity, DTO, ошибки, транзакции).

**Почему ветка не финал:** фронт ещё не переведён на JWT полностью.

---

### `feature/frontend-auth` (коммит `f08ae61`, 02.06.2026)

**Что делал:** `AuthContext`, `ProtectedRoute`, `AdminRoute`, API с `Bearer`-токеном; админ-панель (список пользователей, удаление, дата регистрации).

**Зачем:** проверить вход/роли на UI отдельно от почты.

---

### `feature/mail-ui` (коммит `550def6`, 03.06.2026)

**Что делал:** вкладки Входящие / Отправленные / Написать; `POST /api/mail/send`; убрал градиенты — простой «студенческий» стиль.

**Зачем:** основная фича проекта — письма **между пользователями** в БД.

---

### `master` (коммит `20dff66`, 04.06.2026) — **итог**

**Что делал:** `README.md`, `EXAM_PREP.md` (все КТ 1–10), финальная документация для защиты.

**Содержит всё** из веток выше в одной линии истории.

```bash
git checkout master
docker compose up -d
cd Backend && mvn spring-boot:run
cd Frontend && npm run dev
```

---

## Старые ветки на GitHub (из форка / ранних PR)

| Ветка | Назначение (кратко) |
|-------|---------------------|
| `origin/feature/add-dark-mode` | Эксперимент с тёмной темой UI (не вошло в master) |
| `origin/hotfix/anti-sql` | Правки по безопасности SQL (учебный hotfix) |

Их можно упомянуть на защите как «пробовал, но в финал не merge».

---

## Таблица для отчёта

| Ветка | Период | Главная идея | Результат |
|-------|--------|--------------|-----------|
| `prototype/frontend-ui` | апрель | UI + роутинг | Merge в общую историю |
| `experiment/demo-api` | 28.05 | API без БД | Заменён на JPA |
| `feature/docker-flyway` | 29.05 | Docker + Flyway | В master |
| `feature/jpa-entities` | 30.05 | Entity + Repo | В master |
| `feature/jwt-security` | 30.05 | JWT | В master |
| `feature/backend-api` | 01.06 | REST + SOLID | В master |
| `feature/frontend-auth` | 02.06 | JWT на React | В master |
| `feature/mail-ui` | 03.06 | Почта user→user | В master |
| `master` | 04.06 | Документация | **Сдаём** |

---

## Полезные команды

```bash
# список веток
git branch -v

# сравнить ветку с master
git log master..feature/jwt-security --oneline

# вернуться на итог
git checkout master
```

При push на GitHub:
```bash
git push origin --all
```
