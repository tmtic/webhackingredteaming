FROM node:20-alpine
WORKDIR /app

# Injeção forçada de dependências críticas (SRE Hardening)
# Isso garante que mesmo que o package.json esteja incompleto, o app suba.
RUN npm init -y &&     npm install express cors --quiet

COPY . .

EXPOSE 3000
CMD ["node", "server.js"]
