import express from 'express';
const app = express();
app.get('/health', (req, res) => res.json({ status: "online", service: "signaldesk" }));
app.get('/v1/internal/vault', (req, res) => res.json({ 
    service: "signaldesk", 
    internal_token: "SIG-SUP-443-KV",
    db_node: "shared-db"
}));
app.listen(8086, () => console.log('🚀 signaldesk Online on port 8086'));
