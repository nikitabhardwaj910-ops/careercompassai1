# Stage 1: Build the application
FROM eclipse-temurin:21-jdk-jammy AS build
WORKDIR /app

# Copy maven wrapper and pom.xml first to cache dependencies
COPY mvnw .
COPY .mvn .mvn
COPY pom.xml .

# Grant execution rights on mvnw
RUN chmod +x ./mvnw

# Download dependencies (cached if pom.xml doesn't change)
RUN ./mvnw dependency:go-offline -B

# Copy source code and build
COPY src src
RUN ./mvnw clean package -DskipTests

# Stage 2: Run the application
FROM eclipse-temurin:21-jre-jammy
WORKDIR /app

# Copy compiled jar from build stage
COPY --from=build /app/target/*.jar app.jar

# Expose port (default 8081, but cloud hosts set PORT env var)
EXPOSE 8081

# Run jar
ENTRYPOINT ["java", "-jar", "app.jar"]
