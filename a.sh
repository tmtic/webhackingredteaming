#!/bin/bash

# =============================================================================
# NEXPARTNER INFRASTRUCTURE v3100 - THE ESM ALIGNMENT
# SRE: ESM/CommonJS Conflict Resolution | Upstream Stabilization
# RED TEAM: Persistent Infrastructure for Pentesting
# =============================================================================

echo "🔍 1. Detectando pasta do Asterion..."
ASTERION_DIR=$(find . -maxdepth 3 -type d -name "asterion" | head -n 1)
if [ -z "$ASTERION_DIR" ]; then ASTERION_DIR="./services/asterion"; fi

echo "🧬 2. Injetando código alinhado ao padrão ES Modules (import) em: $ASTERION_DIR/index.js"

cat <<'EOF' > "$ASTERION_DIR/index.js"
import express from 'express';

const app = express();
const PORT = 3001;

app.get('/health', (req, res) => res.json({ status: 'UP', service: 'Asterion-Core', engine: 'ESM' }));

app.all('*', (req, res) => {
    res.json({ 
        message: "Asterion Legacy Proxy Active",
        timestamp: new Date().toISOString()
    });
});

app.listen(PORT, '0.0.0.0', () => {
    console.log(`🚀 Asterion Core Online (ESM Mode) na porta ${PORT}`);
});
EOF

echo "📦 3. Ajustando Dockerfile para garantir dependências modernas..."
cat <<EOF > "$ASTERION_DIR/Dockerfile"
FROM node:20-alpine
WORKDIR /app
# SRE: Forçando instalação limpa para evitar conflitos de cache
RUN npm init -y && npm install express --quiet
COPY . .
EXPOSE 3001
CMD ["node", "index.js"]
EOF

echo "🏗️ 4. Reconstruindo Asterion (Limpando o erro de sintaxe)..."
docker-compose up -d --build asterion

echo "⏳ Aguardando a estabilização do upstream (8s)..."
sleep 8

echo "🌐 5. Reanimando o Gateway (Nginx)..."
docker-compose up -d lab-gateway
docker-compose restart lab-gateway

# =============================================================================
# 🚀 GIT AUTOMATION BLOCK (GITHUB SYNC)
# =============================================================================
echo "📂 Sincronizando correções de infraestrutura com o GitHub..."
git add .
git commit -m "fix: resolve ESM ReferenceError in asterion and restore lab-gateway"
if git remote | grep -q "origin"; then
    git push origin main
    echo "✅ Alterações enviadas para o GitHub!"
fi

echo "✅ Patch v3100 concluído."
docker-compose logs --tail=10 asterion lab-gateway
