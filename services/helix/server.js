const express = require('express');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

// Mock do IdP (Identity Provider) para o laboratório
app.get('/health', (req, res) => res.json({ status: 'UP', service: 'Helix-IdP' }));

// Rota de autenticação que o Gateway/App esperam
app.post('/api/v1/auth/sso', (req, res) => {
    res.json({ 
        success: true, 
        token: 'hlx_static_trusted_token_v1',
        user: { id: 'sso_admin', role: 'SSO_MASTER' } 
    });
});

// Fallback para evitar 404s internos
app.use((req, res) => res.status(404).json({ error: 'Helix endpoint not mapped' }));

const PORT = 3000;
app.listen(PORT, '0.0.0.0', () => {
    console.log(`🚀 Helix Identity Provider Online na porta ${PORT}`);
});
