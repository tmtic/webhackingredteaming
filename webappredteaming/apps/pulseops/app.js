import express from 'express';
const app = express();
app.get('/health', (req, res) => res.json({ status: "online", service: "pulseops" }));
app.get('/v1/internal/vault', (req, res) => res.json({ 
    service: "pulseops", 
    internal_token: "PLS-MON-552-RT",
    db_node: "shared-db"
}));
app.listen(8085, () => console.log('🚀 pulseops Online on port 8085'));
