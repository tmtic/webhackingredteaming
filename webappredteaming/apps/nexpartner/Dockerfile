FROM node:20-alpine
WORKDIR /app

# Copia dependências primeiro
COPY package*.json ./
RUN npm install

# Copia o código fonte
COPY . .

# Build do frontend React (Gera M1-L02: Sourcemaps) 
RUN npm run build

EXPOSE 8080
CMD ["node", "app.js"]
