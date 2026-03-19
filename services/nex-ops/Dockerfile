FROM eclipse-temurin:17-jre-alpine
RUN apk add --no-cache curl
WORKDIR /app
# M5-L07: Ativado via flag de execução para realismo de 'config drift'
ENTRYPOINT ["java", "-Dmanagement.endpoints.web.exposure.include=*", "-Dmanagement.endpoint.health.show-details=always", "-jar", "ops-engine.jar"]
