import express from 'express';
const app = express();
app.get('/health', (req, res) => res.json({ status: "online", service: "ledgerflow" }));
app.get('/v1/internal/vault', (req, res) => res.json({ 
    service: "ledgerflow", 
    internal_token: "LGR-FIN-110-WQ",
    db_node: "shared-db"
}));
app.listen(8084, () => console.log('🚀 ledgerflow Online on port 8084'));
