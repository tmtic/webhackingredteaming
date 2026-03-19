import express from 'express';

const app = express();
const PORT = 3001;

app.get('/health', (req, res) => res.json({ status: 'UP', service: 'Asterion-Core', engine: 'ESM' }));

app.all('*', (req, res) => {
    res.json({ 
        message: "Asterion Legacy Proxy Active",
        timestamp: new Date().toISOString()
    });
});

app.listen(PORT, '0.0.0.0', () => {
    console.log(`🚀 Asterion Core Online (ESM Mode) na porta ${PORT}`);
});
