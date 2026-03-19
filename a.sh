#!/bin/bash

# =============================================================================
# NEXPARTNER INFRASTRUCTURE v3100 - THE AUTOMATED PIPELINE
# SRE: Logic Convergence | Cross-Module Sync | Git Auto-Commit
# RED TEAM: RCE (Telemetry) | Parameter Tampering (Ledger) | Mass Assignment
# =============================================================================

PATCH_VERSION="v3100"
COMMIT_MSG="fix: logic convergence $PATCH_VERSION (Telemetry, Ledger, Governance)"
CORE_DIR="./apps/nexpartner"
ROUTE_DIR="$CORE_DIR/routes"

echo "🧬 1. Sincronizando Regras de Negócio..."

# --- MARKET LEDGER (Estado Global) ---
cat <<'EOF' > "$ROUTE_DIR/market.js"
import express from 'express';
export default (pool) => {
    const router = express.Router();
    global.LEDGER = global.LEDGER || [
        { id: "TRX-1001", amount: 15400.00, type: "LICENSE_RENEWAL", status: "CLEARED", date: new Date().toISOString() }
    ];
    router.get(['/', '/ledger'], (req, res) => res.json(global.LEDGER));
    return router;
};
EOF

# --- PROVISIONING HUB (Impacta Ledger e Auditoria) ---
cat <<'EOF' > "$ROUTE_DIR/provision.js"
import express from 'express';
export default (pool) => {
    const router = express.Router();
    router.post(['/', '/execute', '/sync'], async (req, res) => {
        const { resource, cost_override } = req.body;
        const billedAmount = cost_override ? parseFloat(cost_override) : -150.00;
        
        // SRE: Sincronização em tempo real entre módulos
        if (global.LEDGER) {
            global.LEDGER.unshift({
                id: `PRV-${Math.floor(Math.random()*9000)+1000}`,
                amount: billedAmount,
                type: `PROVISION_${(resource || 'NODE').toUpperCase()}`,
                status: "BILLED",
                date: new Date().toISOString()
            });
        }
        
        try {
            await pool.query("INSERT INTO audit_logs (tenant_id, principal_id, action, details) VALUES (1, 1, 'RESOURCE_PROVISION', $1)",
            [JSON.stringify({ resource, billed: billedAmount, ip: req.ip })]);
        } catch(e) { console.error("Audit Fail"); }

        res.json({ success: true, message: "Provisioning successful", billed: billedAmount });
    });
    return router;
};
EOF

# --- SYSTEM & TELEMETRY (RCE no Quadrado Verde e Audit Real) ---
cat <<'EOF' > "$ROUTE_DIR/system.js"
import express from 'express';
import { execSync } from 'child_process';
export default (pool) => {
    const router = express.Router();
    
    router.get('/audit/stream', async (req, res) => {
        try {
            const result = await pool.query('SELECT a.*, u.username FROM audit_logs a JOIN users u ON a.principal_id = u.id ORDER BY a.created_at DESC LIMIT 50');
            res.json(result.rows);
        } catch (e) { res.status(500).json({ error: "Audit Error" }); }
    });

    router.all(['/telemetry', '/metrics', '/diagnostics/core'], (req, res) => {
        const filter = req.body.node_filter || req.query.node_filter || '';
        let terminal = `[SYSTEM] NexPartner Sovereign Mesh Diagnostics\n[TIME] ${new Date().toISOString()}\n`;
        try {
            if (filter) {
                terminal += `> Filtering Node: ${filter}\n`;
                terminal += execSync(`echo "Node Result: ${filter}"`).toString();
            }
        } catch(e) { terminal += `[ERR] Execution Error.\n`; }
        
        terminal += `\n[OK] Core status: Healthy.`;
        res.json({ success: true, output: terminal, data: terminal });
    });
    return router;
};
EOF

# --- ENTITY GOVERNANCE (DB Real e Mass Assignment) ---
cat <<'EOF' > "$ROUTE_DIR/governance.js"
import express from 'express';
export default (pool) => {
    const router = express.Router();
    router.get(['/', '/entities', '/list'], async (req, res) => {
        try {
            const result = await pool.query('SELECT * FROM tenants ORDER BY id ASC');
            res.json(result.rows);
        } catch (e) { res.status(500).json({ error: "DB Error" }); }
    });
    router.post(['/', '/create'], async (req, res) => {
        const { name, domain } = req.body;
        try {
            const result = await pool.query('INSERT INTO tenants (name, domain) VALUES ($1, $2) RETURNING *', [name, domain]);
            res.json({ success: true, entity: result.rows[0] });
        } catch (e) { res.status(500).json({ error: "Creation fail" }); }
    });
    return router;
};
EOF

echo "⚙️ 2. Estabilizando Orquestração..."
docker-compose restart nexpartner-app

# =============================================================================
# 🚀 3. GIT AUTOMATION BLOCK (GITHUB SYNC)
# =============================================================================
echo "📂 Sincronizando mudanças com o GitHub..."

# Inicializa se não houver git (idempotência)
if [ ! -d ".git" ]; then
    git init
    git branch -M main
fi

# Adiciona mudanças, faz commit e tenta o push
git add .
git commit -m "$COMMIT_MSG"

# Tenta o push apenas se houver uma origin configurada
if git remote | grep -q "origin"; then
    git push origin main
    echo "✅ Alterações enviadas para o GitHub com sucesso!"
else
    echo "⚠️ Git Origin não configurada. Use 'git remote add origin URL' para habilitar o push automático."
fi

echo "✅ Patch $PATCH_VERSION Finalizado."
