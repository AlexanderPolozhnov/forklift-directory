# Forklift Directory — Справочник погрузчиков

Full-Stack приложение для управления справочником погрузчиков с учётом инцидентов (простоев).

## Функциональность

- **Аутентификация** — JWT-based login, защищённые маршруты
- **Справочник погрузчиков** — CRUD операции, поиск по номеру (без учёта регистра), пагинация. Поле `number` является обязательным и уникальным.
- **Инциденты (простои)** — привязка к погрузчику, вычисление времени простоя в реальном времени
- **Безопасность** — запрет удаления погрузчика при наличии инцидентов (HTTP 409)
- **Аудит** — поле `modifiedBy` заполняется из JWT текущего пользователя

> Схема `forklift` и таблицы создаются миграциями Flyway при первом запуске приложения.

---

## Стек технологий

### Backend
- Java 21 + Spring Boot 4
- Spring Security + JWT (jjwt 0.12)
- Spring Data JPA + PostgreSQL
- Flyway (миграции БД)
- MapStruct + Lombok
- SpringDoc OpenAPI (Swagger UI)

### Frontend
- React 19 + TypeScript + Vite
- Ant Design 5
- TanStack Query v5
- Zustand
- Axios + React Router v7

## Prerequisites

- Java 21
- Node.js 20+
- PostgreSQL 16+
- Docker & Docker Compose — опционально, только для запуска через Docker

### Переменные окружения

Для запуска приложения (как локально, так и через Docker) необходимо настроить переменные окружения. Скопируйте `.env.example` в `.env` и установите свои значения:

```bash
cp .env.example .env
```

Основные переменные:
- `SPRING_DATASOURCE_URL` — URL подключения к БД (для локального запуска)
- `SPRING_DATASOURCE_USERNAME` — пользователь БД
- `SPRING_DATASOURCE_PASSWORD` — пароль БД
- `JWT_SECRET` — секретный ключ для подписи JWT (минимум 32 символа)
  Можно сгенерировать самостоятельно, например:

Linux / Mac:
  openssl rand -base64 32

Windows (PowerShell):
  [Convert]::ToBase64String((1..32 | ForEach-Object {Get-Random -Maximum 256}))
- `DB_USER` / `DB_PASSWORD` — используются в Docker Compose

## Запуск через Docker Compose

```bash
# Клонировать репозиторий
git clone <repo-url>
cd forklift-directory

# Запустить все сервисы
docker compose up --build

# Приложение доступно:
# Frontend: http://localhost:80
# Backend API: http://localhost:8080
# Swagger UI: http://localhost:8080/swagger-ui.html
```

## Запуск для разработки (Local profile)

Для локального запуска без Docker:

### 1. Подготовка PostgreSQL
Установите PostgreSQL и создайте базу данных:

```sql
CREATE DATABASE forklift_db;
```

### 2. Запуск Backend
Приложение настроено на использование профиля `local` для разработки. В этом профиле используются настройки из `application-local.yaml`.

```bash
# Запуск с профилем local через Maven
./mvnw spring-boot:run "-Dspring-boot.run.profiles=local"

# Или установите переменную окружения
export SPRING_PROFILES_ACTIVE=local
./mvnw spring-boot:run
```

### 3. Запуск Frontend

```bash
cd frontend
npm install
npm run dev
# Frontend: http://localhost:5173
```

## Учётные данные по умолчанию

| Поле     | Значение  |
|----------|-----------|
| Логин    | admin     |
| Пароль   | admin123  |

## API Endpoints

| Метод  | URL                                  | Описание                              |
|--------|--------------------------------------|---------------------------------------|
| POST   | /api/v1/auth/login                   | Авторизация, получение JWT            |
| GET    | /api/v1/forklifts?number=&page=&size= | Список погрузчиков с поиском          |
| POST   | /api/v1/forklifts                    | Создать погрузчик                     |
| PUT    | /api/v1/forklifts/{id}               | Обновить погрузчик                    |
| DELETE | /api/v1/forklifts/{id}               | Удалить погрузчик (409 если есть инциденты) |
| GET    | /api/v1/forklifts/{id}/incidents     | Инциденты погрузчика                  |
| POST   | /api/v1/forklifts/{id}/incidents     | Создать инцидент                      |
| PUT    | /api/v1/incidents/{id}               | Обновить инцидент                     |
| DELETE | /api/v1/incidents/{id}               | Удалить инцидент                      |

Полная документация API: [Swagger UI](http://localhost:8080/swagger-ui.html)

## Структура проекта

```
forklift-directory/
├── src/                          # Backend (Spring Boot)
│   ├── main/java/.../
│   │   ├── config/               # Security, OpenAPI конфигурации
│   │   ├── controller/           # REST контроллеры
│   │   ├── service/              # Бизнес-логика
│   │   ├── repository/           # JPA репозитории
│   │   ├── entity/               # JPA сущности
│   │   ├── dto/                  # Request/Response DTO
│   │   ├── mapper/               # MapStruct маперы
│   │   ├── security/             # JWT фильтр и сервис
│   │   └── exception/            # Глобальная обработка ошибок
│   └── main/resources/
│       └── db/migration/         # Flyway SQL миграции
├── frontend/                     # React + TypeScript
│   └── src/
│       ├── api/                  # Axios клиенты
│       ├── components/           # UI компоненты
│       ├── hooks/                # TanStack Query хуки
│       ├── pages/                # Страницы приложения
│       ├── store/                # Zustand store
│       ├── types/                # TypeScript типы
│       └── utils/                # Утилиты
├── docker-compose.yml
└── Dockerfile
```
