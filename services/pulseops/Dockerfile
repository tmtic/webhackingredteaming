# Estágio 1: Build real via Maven
FROM maven:3.8.4-eclipse-temurin-17-alpine AS build
WORKDIR /app
COPY pom.xml .
COPY src ./src
RUN mvn clean package -DskipTests

# Estágio 2: Runtime Estável
FROM eclipse-temurin:17-jre-alpine
WORKDIR /app
COPY --from=build /app/target/ops-engine-1.0.jar ops-engine.jar
# M5-L07: Actuators expostos para Recon/Exploitation
ENV MANAGEMENT_ENDPOINTS_WEB_EXPOSURE_INCLUDE=*
EXPOSE 8081
CMD ["java", "-jar", "ops-engine.jar"]
