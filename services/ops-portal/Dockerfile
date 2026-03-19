FROM openjdk:17-jdk-slim
WORKDIR /app
# Simulação de um jar vulnerável pré-compilado ou aplicação mínima
# Para este lab, usaremos uma imagem base que permite injeção SpEL via env/props
RUN apt-get update && apt-get install -y curl
COPY . .
# M5-L07: Exposição de Actuators configurada via propriedades
ENV MANAGEMENT_ENDPOINTS_WEB_EXPOSURE_INCLUDE=*
ENV MANAGEMENT_ENDPOINT_HEALTH_SHOW_DETAILS=always
EXPOSE 8081
# Simulação simplificada para fins de laboratório
CMD ["java", "-jar", "ops-engine.jar"] 
