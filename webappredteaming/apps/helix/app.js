import express from 'express';
const app = express();
app.get('/health', (req, res) => res.json({ status: "online", service: "helix" }));
app.get('/v1/internal/vault', (req, res) => res.json({ 
    service: "helix", 
    internal_token: "HLX-GEN-771-BZ",
    db_node: "shared-db"
}));
app.listen(8083, () => console.log('🚀 helix Online on port 8083'));
