const express = require('express');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

// ==========================================
// CORE: HELIX IDENTITY PROVIDER (IdP)
// ==========================================

// Endpoint de Healthcheck (Usado por orquestradores como Kubernetes)
app.get(['/health', '/status'], (req, res) => {
    res.json({ 
        service: 'Helix Identity Provider', 
        status: 'Operational', 
        version: '2.1.4',
        uptime: process.uptime() 
    });
});

// Mock de Autenticação Centralizada (SSO/OAuth2)
// VULNERABILIDADE DE NEGÓCIO: Aceita qualquer client_id não validado.
app.post('/api/v1/sso/authenticate', (req, res) => {
    const { client_id, client_secret } = req.body;
    
    if (client_id) {
        // Gera um token de sessão mockado
        return res.json({ 
            authenticated: true, 
            access_token: `hlx_tk_${Buffer.from(client_id).toString('base64')}_${Date.now()}`,
            token_type: "Bearer",
            expires_in: 3600
        });
    }
    res.status(401).json({ error: "Invalid or missing OAuth Client Credentials" });
});

// Tratamento de Erros Genéricos
app.all('*', (req, res) => {
    res.status(404).json({ error: "Helix Endpoint Not Found" });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, '0.0.0.0', () => {
    console.log(`Helix IdP listening on port ${PORT}`);
});
