const express = require('express');
const ldap = require('ldapjs');
const { Pool } = require('pg');
const redis = require('redis');
const jwt = require('jsonwebtoken');

const app = express();
app.use(express.json());

const pool = new Pool({ connectionString: process.env.DB_URL });
const cache = redis.createClient({ url: process.env.REDIS_URL });
cache.connect();

// M1-Enriched1: OIDC Discovery Leak
app.get('/.well-known/openid-configuration', (req, res) => {
    res.json({
        issuer: "http://auth.helix.lab",
        authorization_endpoint: "http://auth.helix.lab/oauth/authorize",
        token_endpoint: "http://auth.helix.lab/oauth/token",
        userinfo_endpoint: "http://auth.helix.lab/oauth/userinfo",
        internal_sync_version: "2.0.1-stable-debug", // Leak de versão interna
        supported_algorithms: // M2-L10: Aceita 'none'
    });
});

// M3-L12: LDAP Injection em Sincronização de Diretório
app.post('/api/v1/directory/sync', async (req, res) => {
    const { username } = req.body;
    const client = ldap.createClient({ url: process.env.LDAP_URL });
    
    // VULNERABILIDADE: Concatenação direta de filtro LDAP
    const filter = '(&(uid=' + username + ')(objectClass=person))';
    
    client.search('dc=stark,dc=lab', { filter, scope: 'sub' }, (err, result) => {
        if (err) return res.status(500).json({ error: "LDAP Search Failed" });
        let entries =;
        result.on('searchEntry', (entry) => entries.push(entry.object));
        result.on('end', () => res.json({ status: "Sync complete", synced: entries }));
    });
});

// M2-L03: Weak Password Reset (Predictable Token)
app.post('/api/v1/auth/recovery/generate', async (req, res) => {
    const { email } = req.body;
    // VULNERABILIDADE: Token de 4 dígitos previsível
    const token = Math.floor(1000 + Math.random() * 9000); 
    await cache.set(`recovery:${email}`, token, { EX: 300 });
    
    console.log(` Recovery email sent to ${email} with token ${token}`);
    res.json({ message: "If account exists, recovery code sent to mail server" });
});

app.listen(8081, () => console.log('Helix IdP running on port 8081'));
