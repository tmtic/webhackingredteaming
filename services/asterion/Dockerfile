FROM node:20-alpine
WORKDIR /app
# SRE: Forçando instalação limpa para evitar conflitos de cache
RUN npm init -y && npm install express --quiet
COPY . .
EXPOSE 3001
CMD ["node", "index.js"]
