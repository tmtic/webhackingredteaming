import express from 'express';
const app = express();
app.get('/health', (req, res) => res.json({ status: "online", service: "signaldesk" }));
app.get('/v1/internal/vault', (req, res) => res.json({ service: "signaldesk", token: "SIG-SUP-443-KV" }));
app.listen(8086);
