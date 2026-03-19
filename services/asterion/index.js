import express from 'express';

const app = express();
const PORT = 3001;

// Rota de Healthcheck explícita
app.get('/health', (req, res) => {
    res.json({ status: 'UP', service: 'Asterion-Core', engine: 'ESM-Resilient' });
});

// SRE FIX: Usando middleware em vez de app.all('*') para evitar erro de matcher do Express
app.use((req, res) => {
    res.json({ 
        message: "Asterion Legacy Proxy Active",
        path: req.url,
        timestamp: new Date().toISOString()
    });
});

app.listen(PORT, '0.0.0.0', () => {
    console.log(`🚀 Asterion Core Online (Resilient Mode) na porta ${PORT}`);
});
