FROM node:20-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install
# Adicionando Nodemailer (SMTP) e HTTP Proxy nativamente
RUN npm install http-proxy-middleware nodemailer
COPY . .
RUN mkdir -p /app/public/vault && \
    echo '%PDF-1.4 CORPORATE DOCUMENT - STRICTLY CONFIDENTIAL' > /app/public/Doc_1-1.pdf && \
    echo '%PDF-1.4 LEGAL VAULT ASSET' > /app/public/vault/f.pdf && \
    echo 'root:x:0:0:root:/root:/bin/sh' > /app/passwd.txt && \
    echo 'admin:x:1000:1000:admin:/home/admin:/bin/sh' >> /app/passwd.txt
RUN npm run build || true
EXPOSE 8080
CMD ["node", "app.js"]
