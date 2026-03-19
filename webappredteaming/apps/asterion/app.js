import express from 'express';
const app = express();
app.get('/health', (req, res) => res.json({ status: "online", service: "asterion" }));
app.get('/v1/internal/vault', (req, res) => res.json({ 
    service: "asterion", 
    internal_token: "AST-KEY-992-PX",
    db_node: "shared-db"
}));
app.listen(8082, () => console.log('🚀 asterion Online on port 8082'));
