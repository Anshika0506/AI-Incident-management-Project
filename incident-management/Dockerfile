# ========================================================
# Stage 1: Build JAR with Maven & Eclipse Temurin JDK 21
# ========================================================
FROM maven:3.9.6-eclipse-temurin-21-alpine AS builder
WORKDIR /build

# Cache Maven dependencies
COPY pom.xml .
RUN mvn dependency:go-offline -B

# Copy source and package application
COPY src ./src
RUN mvn clean package -DskipTests -B

# ========================================================
# Stage 2: Production JRE 21 Runtime Container
# ========================================================
FROM eclipse-temurin:21-jre-alpine
WORKDIR /app

# Create non-root system user for security
RUN addgroup -S appgroup && adduser -S appuser -G appgroup
USER appuser

# Copy compiled JAR from builder stage
COPY --from=builder /build/target/*.jar app.jar

# Expose Spring Boot HTTP port
EXPOSE 8080

# Environment variables with safe defaults
ENV SPRING_PROFILES_ACTIVE=prod
ENV SERVER_PORT=8080

ENTRYPOINT ["java", "-XX:+UseContainerSupport", "-XX:MaxRAMPercentage=75.0", "-jar", "app.jar"]
