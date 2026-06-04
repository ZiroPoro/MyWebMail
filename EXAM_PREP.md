# Подготовка к сдаче MyWebMail

Краткий конспект по контрольным точкам семестра с привязкой к **нашему проекту**.

См. также: [README.md](./README.md) (запуск), [BRANCHES.md](./BRANCHES.md) (этапы разработки).

---

## 1 КТ — Spring Core (IOC/DI)

| Тема | В проекте |
|------|-----------|
| **IOC/DI** | Spring сам создаёт бины и подставляет зависимости в конструктор |
| **@Component** | `DataSeeder`, `JwtAuthFilter` |
| **@Service** | `UserServiceImpl`, `MailServiceImpl`, `AuthServiceImpl`, `JwtService` |
| **@Bean** | `SecurityConfig.passwordEncoder()`, `securityFilterChain()`, `CorsConfig.corsConfigurationSource()` |
| **@Configuration** | `SecurityConfig`, `WebConfig`, `CorsConfig` |

**Пример DI:** `MailController` получает интерфейс `MailService` через конструктор — не `new MailServiceImpl()`.

**Файлы:** `Backend/src/main/java/org/example/mywebmail/config/`, `service/`, `security/`.

---

## 2 КТ — REST и DTO

| Тема | В проекте |
|------|-----------|
| **ResponseEntity** | `AuthController.register()` → `201 CREATED`; `AdminController.deleteUser()` → `204 NO_CONTENT` |
| **DTO vs Entity** | `UserDto`, `MailMessageDto`, `PageResponse` — наружу; `UserEntity`, `MessageEntity` — в БД |
| **HTTP-коды** | `401` неверный логин; `403` нет роли ADMIN; `404` нет пользователя/получателя; `409` email занят |

Пароль хранится только в entity (`passwordHash`), в DTO не отдаётся.

---

## 3 КТ — обработка ошибок

| Тема | В проекте |
|------|-----------|
| **@ControllerAdvice** | `GlobalExceptionHandler` |
| **ErrorResponse** | record: `timestamp`, `status`, `error`, `message`, `path` |

Сервисы бросают `ResponseStatusException` → клиент получает JSON, а не HTML.

**Файл:** `exception/GlobalExceptionHandler.java`, `dto/ErrorResponse.java`.

---

## 4 КТ — БД и транзакции

| Тема | В проекте |
|------|-----------|
| **@Transactional** | `MailServiceImpl.send()`, `UserServiceImpl.register()`, `readOnly = true` для чтения |
| **Тип данных из БД** | JPA: `UserEntity`, `MessageEntity`, `Page<MessageEntity>` |
| **Что дальше** | Entity → DTO (`MailMessageDto.from`) → `ResponseEntity` → JSON |
| **SQL-инъекции** | JPA/Hibernate — параметризованные запросы; сырой SQL с конкатенацией не используем |

**Подключение:** `application.properties` → `jdbc:postgresql://localhost:5433/mywebmail`.

---

## 5 КТ — JPA связи

| Тема | В проекте |
|------|-----------|
| **Элементы Entity** | `@Entity`, `@Table`, `@Id`, `@Column`, `@Enumerated`, `@ManyToOne`, `@JoinColumn` |
| **Связь** | `MessageEntity` → `sender` / `recipient` → `UserEntity` |
| **Односторонняя** | В `UserEntity` нет `List<MessageEntity>` |
| **mappedBy** | Нужен во **второй** стороне двусторонней связи. У нас FK в таблице `messages` — `mappedBy` не используем |

**Файлы:** `entity/UserEntity.java`, `entity/MessageEntity.java`.

---

## 6 КТ — запросы и пагинация

| Тема | В проекте |
|------|-----------|
| **@JoinTable** | Для **ManyToMany**. У нас только ManyToOne |
| **Query Method** | `findByEmailIgnoreCase`, `existsByEmailIgnoreCase`, `countByRole` |
| **@Query + пагинация** | `findInbox`, `findSent` + `Pageable` |
| **Пагинация** | `GET /api/mail/inbox?page=0&size=20` → `PageResponse` |

**Файл:** `repository/MessageRepository.java`.

---

## 7 КТ — производительность и транзакции

| Тема | В проекте |
|------|-----------|
| **EntityGraph** | `@EntityGraph(attributePaths = {"sender", "recipient"})` на inbox/sent |
| **N+1** | Без графа: много запросов к `users`. С графом — join при загрузке списка писем |
| **Lazy / Eager** | `@ManyToOne(fetch = LAZY)` в `MessageEntity` |
| **Propagation** | По умолчанию `REQUIRED`; для чтения — `readOnly = true` |
| **Isolation** | PostgreSQL: `READ_COMMITTED` (достаточно для учебного проекта) |

---

## 8–9 КТ — Security и JWT

| Тема | В проекте |
|------|-----------|
| **Как работает Security** | Запрос → `SecurityFilterChain` (правила URL) → `JwtAuthFilter` → `SecurityContext` → контроллер |
| **@EnableWebSecurity** | В `SecurityConfig` — без неё конфигурация не применится |
| **JWT** | Login → токен; дальше заголовок `Authorization: Bearer <token>` |
| **addFilterBefore** | `JwtAuthFilter` перед `UsernamePasswordAuthenticationFilter` |
| **OncePerRequestFilter** | `JwtAuthFilter` — фильтр один раз на HTTP-запрос |
| **Роли** | `UserPrincipal` → `ROLE_ADMIN` / `ROLE_USER`; в URL: `hasRole("ADMIN")` |

**Публичные пути:** `/api/health`, `/api/auth/login`, `/api/auth/register`.

**Файлы:** `security/JwtAuthFilter.java`, `security/JwtService.java`, `config/SecurityConfig.java`.

---

## 10 КТ — Docker и Flyway

| Тема | В проекте |
|------|-----------|
| **docker-compose.yaml** | Сервис `postgres:16-alpine`, порт хоста **5433** → 5432 в контейнере |
| **Как Flyway** | При старте читает `db/migration/V1__schema.sql`, пишет версию в `flyway_schema_history` |
| **Зачем Flyway** | Одна схема у всех; Hibernate только `ddl-auto=validate`, не создаёт таблицы сам |

**Схема:** таблицы `users`, `messages`. Тестовые пользователи — `DataSeeder` при первом запуске.

---

## SOLID в проекте

| Принцип | Реализация |
|---------|------------|
| **S** | `MailServiceImpl` — почта; `UserServiceImpl` — пользователи; `AuthServiceImpl` — вход |
| **O** | Новая реализация `MailService` без правки контроллера |
| **L** | `MailServiceImpl` подставляется везде, где ждут `MailService` |
| **I** | Отдельные интерфейсы `AuthService`, `UserService`, `MailService` |
| **D** | Контроллеры зависят от интерфейсов, Spring подставляет `*Impl` |

---

## Почта в проекте (демо на защите)

1. Войти как `user@mywebmail.local` / `user123`.
2. **Написать** → получатель `admin@mywebmail.local`.
3. Выйти, войти как админ → **Входящие** — письмо видно.
4. Админ: **Администрирование** — таблица пользователей и даты регистрации.

---

## Типичные проблемы (может спросить преподаватель)

| Симптом | Причина | Решение |
|---------|---------|---------|
| **404** на login | Старый backend без `/api/auth` | Перезапуск `mvn spring-boot:run`, health с `jwt-postgres-v2` |
| **Forbidden** | Прокси Vite на `127.0.0.1:8080` попал в Jenkins | Прокси на `localhost:8080`, перезапуск `npm run dev` |
| **Failed to fetch** | Не запущен Frontend или Backend | Оба терминала + `localhost:5173` |
| **role webmail does not exist** | Локальный Postgres на 5432 вместо Docker | БД в Docker на порту **5433** |

---

## Вопросы по коду на защите (2 примера)

1. **Почему JWT, а не сессия в памяти?**  
   API stateless, токен на клиенте, тема 9 КТ; после перезапуска сервера сессия в памяти пропала бы.

2. **Где защита админки?**  
   В `SecurityConfig`: `.requestMatchers("/api/admin/**").hasRole("ADMIN")` + проверка роли из БД в `JwtAuthFilter`. На фронте — `AdminRoute`.

3. **Почему `ddl-auto=validate`?**  
   Структуру меняем только миграциями Flyway; Hibernate не пересоздаёт таблицы.

4. **Зачем EntityGraph?**  
   Чтобы при списке писем не было N+1 запросов к таблице `users`.

---

## Чеклист перед защитой

```bash
docker compose up -d
cd Backend && mvn spring-boot:run
# другой терминал:
cd Frontend && npm install && npm run dev
```

- [ ] `curl http://localhost:8080/api/health` → `jwt-postgres-v2`
- [ ] `curl -X POST http://localhost:5173/api/auth/login ...` → JSON с `token`
- [ ] В браузере: вход, отправка письма, админка
- [ ] Прочитан [BRANCHES.md](./BRANCHES.md) — могу объяснить этапы веток

**Учётки:** `admin@mywebmail.local` / `admin123`, `user@mywebmail.local` / `user123`.
