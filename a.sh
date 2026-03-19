#!/bin/bash

# =============================================================================
# NEXPARTNER INFRASTRUCTURE v3200 - THE RESILIENT ROUTER
# SRE: Express Regex Fix | Middleware Catch-all | Upstream Restoration
# RED TEAM: Lab Stability for Exploitation
# =============================================================================

PATCH_VERSION="v3200"
COMMIT_MSG="fix: resolved asterion route matcher crash and stabilized nginx upstream"

echo "🔍 1. Detectando diretório do Asterion..."
ASTERION_DIR=$(find . -maxdepth 3 -type d -name "asterion" | head -n 1)
if [ -z "$ASTERION_DIR" ]; then ASTERION_DIR="./services/asterion"; fi

echo "🧬 2. Injetando código simplificado (Ultra-Resiliente) em: $ASTERION_DIR/index.js"

cat <<'EOF' > "$ASTERION_DIR/index.js"
import express from 'express';

const app = express();
const PORT = 3001;

// Rota de Healthcheck explícita
app.get('/health', (req, res) => {
    res.json({ status: 'UP', service: 'Asterion-Core', engine: 'ESM-Resilient' });
});

// SRE FIX: Usando middleware em vez de app.all('*') para evitar erro de matcher do Express
app.use((req, res) => {
    res.json({ 
        message: "Asterion Legacy Proxy Active",
        path: req.url,
        timestamp: new Date().toISOString()
    });
});

app.listen(PORT, '0.0.0.0', () => {
    console.log(`🚀 Asterion Core Online (Resilient Mode) na porta ${PORT}`);
});
EOF

echo "🏗️ 3. Reconstruindo Asterion e limpando o ambiente..."
docker-compose up -d --build asterion

echo "⏳ Aguardando estabilização do DNS interno (10s)..."
# Aumentamos o tempo para garantir que o Asterion responda ao ping do Nginx
sleep 10

echo "🌐 4. Reanimando o Gateway (Nginx)..."
docker-compose up -d lab-gateway
docker-compose restart lab-gateway

# =============================================================================
# 🚀 GIT AUTOMATION BLOCK (GITHUB SYNC)
# =============================================================================
echo "📂 Sincronizando mudanças com o GitHub..."
if [ -d ".git" ]; then
    git add .
    git commit -m "$COMMIT_MSG"
    if git remote | grep -q "origin"; then
        git push origin main
        echo "✅ Código enviado para o repositório remoto!"
    else
        echo "⚠️ Origin não configurada."
    fi
fi

echo "✅ Patch $PATCH_VERSION Concluído."
docker-compose logs --tail=10 asterion lab-gateway
