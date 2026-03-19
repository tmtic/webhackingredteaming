const express = require('express');
const app = express();
app.get('/health', (req, res) => res.json({ status: 'UP', service: 'Asterion-Core' }));
app.all('*', (req, res) => res.json({ message: "Asterion Legacy Proxy Active" }));
app.listen(3001, '0.0.0.0', () => console.log("🚀 Asterion Core Online na porta 3001"));
