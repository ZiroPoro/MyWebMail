# Подготовка к сдаче MyWebMail

Краткий конспект по контрольным точкам семестра с привязкой к **нашему проекту**.

---

## 1 КТ — Spring Core (IOC/DI)

| Тема | В проекте |
|------|-----------|
| **IOC/DI** | Spring сам создаёт бины и подставляет зависимости в конструктор |
| **@Component** | `DataSeeder`, `JwtAuthFilter` |
| **@Service** | `UserServiceImpl`, `MailServiceImpl`, `AuthServiceImpl`, `JwtService` |
| **@Bean** | `SecurityConfig.passwordEncoder()`, `securityFilterChain()` |
| **@Configuration** | `SecurityConfig`, `WebConfig` |

**Пример DI:** `MailController` получает `MailService` через конструктор — не мы вызываем `new`, а контейнер.

---

## 2 КТ — REST и DTO

| Тема | В проекте |
|------|-----------|
| **ResponseEntity** | `AuthController.register()` → `201 CREATED`, `AdminController.deleteUser()` → `204 NO_CONTENT` |
| **DTO vs Entity** | `UserDto`, `MailMessageDto` — наружу; `UserEntity`, `MessageEntity` — JPA/БД |
| **HTTP-коды** | `401` неверный логин, `403` нет прав, `404` нет пользователя, `409` email занят |

DTO не содержат `passwordHash` — entity содержит.

---

## 3 КТ — обработка ошибок

| Тема | В проекте |
|------|-----------|
| **@ControllerAdvice** | `GlobalExceptionHandler` |
| **ErrorResponse** | record: `timestamp`, `status`, `error`, `message`, `path` |

`ResponseStatusException` в сервисах → единый JSON-ответ клиенту.

---

## 4 КТ — БД и транзакции

| Тема | В проекте |
|------|-----------|
| **@Transactional** | `MailServiceImpl.send()`, `UserServiceImpl.register()` |
| **Тип данных из БД** | JPA возвращает `UserEntity`, `MessageEntity` (объекты), не «сырой» ResultSet |
| **Что дальше** | Entity → DTO (`MailMessageDto.from(entity)`) → JSON в `ResponseEntity` |
| **SQL-инъекции** | **Prepared statements** через JPA/Hibernate (`?` в запросах). Не склеиваем SQL строкой с вводом пользователя |

---

## 5 КТ — JPA связи

| Тема | В проекте |
|------|-----------|
| **Элементы Entity** | `@Entity`, `@Table`, `@Id`, `@Column`, `@ManyToOne`, `@JoinColumn` |
| **Связь** | `MessageEntity` → `UserEntity` sender/recipient — **односторонняя** со стороны Message |
| **Как односторонняя** | Только в `MessageEntity` поля `sender`, `recipient`; в `UserEntity` нет `List<Message>` |
| **mappedBy** | Используется в **двусторонней** связи на стороне «не владельца» FK. У нас FK в `messages`, владелец — Message, `mappedBy` не нужен |

---

## 6 КТ — запросы и пагинация

| Тема | В проекте |
|------|-----------|
| **@JoinTable** | Для **ManyToMany**. У нас M:N нет; связь M:1 через `@JoinColumn` |
| **Query Method** | `UserRepository.findByEmailIgnoreCase`, `existsByEmailIgnoreCase` |
| **Пагинация** | `PageRequest.of(page, size)` + `Page<MessageEntity>` в `MessageRepository` |

API: `GET /api/mail/inbox?page=0&size=20`.

---

## 7 КТ — производительность и транзакции

| Тема | В проекте |
|------|-----------|
| **Join Fetch / EntityGraph** | `@EntityGraph(attributePaths = {"sender", "recipient"})` на inbox/sent — меньше N+1 |
| **N+1** | Без графа: 1 запрос писем + N запросов отправителей. Граф подгружает связи одним доп. join |
| **Lazy vs Eager** | `@ManyToOne(fetch = LAZY)` — грузим sender/recipient только когда обращаемся |
| **Propagation** | `REQUIRED` (по умолчанию) — метод в транзакции; `readOnly = true` для чтения |
| **Isolation** | `READ_COMMITTED` в PostgreSQL по умолчанию; для учебного проекта достаточно |

---

## 8–9 КТ — Security и JWT

| Тема | В проекте |
|------|-----------|
| **Как работает Security** | `SecurityFilterChain` → правила URL → `JwtAuthFilter` → `SecurityContext` |
| **Без @EnableWebSecurity** | `SecurityConfig` не применится |
| **JWT** | При login выдаём токен; клиент шлёт `Authorization: Bearer ...`; фильтр парсит и кладёт `UserPrincipal` |
| **addFilterBefore** | `jwtAuthFilter` **перед** `UsernamePasswordAuthenticationFilter` |
| **OncePerRequestFilter** | `JwtAuthFilter` — один раз на HTTP-запрос |

Файлы: `SecurityConfig.java`, `JwtAuthFilter.java`, `JwtService.java`.

---

## 10 КТ — Docker и Flyway

| Тема | В проекте |
|------|-----------|
| **docker-compose.yaml** | Сервис `postgres`, порт 5432, volume |
| **Как Flyway** | При старте приложения читает `db/migration/V1__schema.sql`, применяет если версии нет в `flyway_schema_history` |
| **Зачем Flyway** | Версионирование схемы БД, одинаковая структура у всех в команде/на сдаче |

Запуск: `docker compose up -d`, затем `mvn spring-boot:run`.

---

## SOLID в проекте

| Принцип | Реализация |
|---------|------------|
| **S** | `MailServiceImpl` только почта; `UserServiceImpl` только пользователи |
| **O** | Новый способ хранения — новая реализация интерфейса, не ломая контроллер |
| **L** | Реализации `MailService` взаимозаменяемы для контроллера |
| **I** | Узкие интерфейсы `AuthService`, `MailService`, `UserService` |
| **D** | Контроллеры зависят от **интерфейсов**, не от `*Impl` |

---

## Почта в проекте

1. Войти (JWT).
2. Вкладка **Написать** → `POST /api/mail/send` `{ toEmail, subject, body }`.
3. Получатель видит во **Входящих** (`GET /api/mail/inbox`).
4. Отправитель — в **Отправленных** (`GET /api/mail/sent`).

---

## Возможные вопросы по коду на защите

1. **Почему JWT, а не сессия в памяти?** Stateless API, масштабирование, тема 9 КТ.
2. **Где защита админки?** `hasRole("ADMIN")` в `SecurityConfig` + роль в токене/контексте.
3. **Почему `ddl-auto=validate`?** Схему меняем только Flyway, Hibernate только проверяет.
4. **Что будет без EntityGraph?** Риск N+1 при списке писем.

---

## Запуск перед сдачей

```bash
docker compose up -d
cd Backend && mvn spring-boot:run
cd Frontend && npm run dev
```

Учётки: `admin@mywebmail.local` / `admin123`, `user@mywebmail.local` / `user123`.
