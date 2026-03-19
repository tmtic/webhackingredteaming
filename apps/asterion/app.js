import express from 'express';
const app = express();
app.get('/health', (req, res) => res.json({ status: "online", service: "asterion" }));
app.get('/v1/internal/vault', (req, res) => res.json({ service: "asterion", token: "AST-KEY-992-PX" }));
app.listen(8082);
