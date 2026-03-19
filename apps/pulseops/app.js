import express from 'express';
const app = express();
app.get('/health', (req, res) => res.json({ status: "online", service: "pulseops" }));
app.get('/v1/internal/vault', (req, res) => res.json({ service: "pulseops", token: "PLS-MON-552-RT" }));
app.listen(8085);
