import express from 'express';
const app = express();
app.get('/health', (req, res) => res.json({ status: "online", service: "ledgerflow" }));
app.get('/v1/internal/vault', (req, res) => res.json({ service: "ledgerflow", token: "LGR-FIN-110-WQ" }));
app.listen(8084);
