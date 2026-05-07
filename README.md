# Forklift Directory — Справочник погрузчиков

Full-Stack приложение для управления справочником погрузчиков с учётом инцидентов (простоев).

## Функциональность

- **Аутентификация** — JWT-based login, защищённые маршруты
- **Справочник погрузчиков** — CRUD операции, поиск по номеру (без учёта регистра), пагинация
- **Инциденты (простои)** — привязка к погрузчику, вычисление времени простоя в реальном времени
- **Безопасность** — запрет удаления погрузчика при наличии инцидентов (HTTP 409)
- **Аудит** — поле `modifiedBy` заполняется из JWT текущего пользователя

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
- Docker & Docker Compose

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

### Переменные окружения (опционально)

Создайте `.env` файл в корне проекта:

```env
DB_USER=postgres
DB_PASSWORD=postgres
JWT_SECRET=your-secret-key-min-32-chars
```

## Запуск для разработки

### Backend

```bash
# Запустить PostgreSQL
docker compose up postgres -d

# Запустить backend
./mvnw spring-boot:run
```

### Frontend

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
