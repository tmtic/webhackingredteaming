FROM node:20-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install --quiet
COPY . .
EXPOSE 8081
USER node
CMD ["node", "app.js"]
