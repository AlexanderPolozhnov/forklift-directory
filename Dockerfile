FROM eclipse-temurin:21-jdk-alpine AS builder
WORKDIR /app

# Копируем maven wrapper и pom.xml для кэширования зависимостей
COPY mvnw pom.xml ./
COPY .mvn .mvn
RUN ./mvnw dependency:go-offline -B

# Копируем исходный код и собираем приложение
COPY src ./src
RUN ./mvnw package -DskipTests --no-transfer-progress

FROM eclipse-temurin:21-jre-alpine
WORKDIR /app
COPY --from=builder /app/target/*.jar app.jar
EXPOSE 8080
ENTRYPOINT ["java", "-jar", "app.jar"]
