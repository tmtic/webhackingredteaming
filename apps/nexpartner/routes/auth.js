import express from 'express';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
const router = express.Router();
const JWT_SECRET = "NEX-2026-B2B-XF-99281-PRIVATE";

export default (pool, redisClient) => {
    router.post('/session/init', async (req, res) => {
        const { user, pass } = req.body;
        
        // M2-L04: Session Fixation (Fixação de Sessão)
        // Se o navegador já envia um ID de sessão de rastreamento (sid), o servidor confia nele 
        // em vez de gerar um novo. Isso permite que um atacante pré-defina a sessão.
        const sid = req.cookies.mesh_sid || crypto.randomUUID();

        const r = await pool.query('SELECT * FROM users WHERE (username=$1 OR email=$1) AND password=$2', [user, pass]);
        if (r.rowCount > 0) {
            const u = r.rows[0];
            const token = jwt.sign({ id: u.id, username: u.username, role: u.role, tenant_id: u.tenant_id, clearance_level: u.clearance_level }, JWT_SECRET, { expiresIn: '15m' });
            const refreshToken = crypto.randomBytes(32).toString('hex');

            // Armazenando o estado da sessão no Redis atrelado ao SID
            await redisClient.set(`session:${sid}`, JSON.stringify({ userId: u.id, status: 'ESTABLISHED' }), { EX: 86400 });
            await redisClient.set(`refresh:${refreshToken}`, u.id, { EX: 86400 });

            res.cookie('auth_token', token, { httpOnly: true, path: '/' });
            res.cookie('refresh_token', refreshToken, { httpOnly: true, path: '/api/v1/auth/session/refresh' });
            res.cookie('mesh_sid', sid, { path: '/' }); // Cookie de rastreio de sessão

            res.json({ success: true, user: { id: u.id, username: u.username, tenant_id: u.tenant_id } });
        } else { res.status(401).json({ error: "Identity Rejection" }); }
    });

    router.get('/session/verify', (req, res) => {
        const token = req.cookies.auth_token;
        if (!token) return res.status(401).json({ error: "No active mesh handshake" });
        try {
            const decoded = jwt.verify(token, JWT_SECRET);
            res.json({ user: decoded });
        } catch(e) { res.status(401).json({ error: "Mesh session expired" }); }
    });

    // M2-L05: Refresh Token Reuse (Lógica de Negócio Falha)
    router.post('/session/refresh', async (req, res) => {
        const refreshToken = req.cookies.refresh_token;
        if (!refreshToken) return res.status(401).json({ error: "Missing refresh token" });

        const userId = await redisClient.get(`refresh:${refreshToken}`);
        if (!userId) return res.status(403).json({ error: "Invalid or expired refresh token" });

        const r = await pool.query('SELECT * FROM users WHERE id=$1', [userId]);
        if (r.rowCount === 0) return res.status(404).json({ error: "Principal not found" });

        const u = r.rows[0];
        const newToken = jwt.sign({ id: u.id, username: u.username, role: u.role, tenant_id: u.tenant_id, clearance_level: u.clearance_level }, JWT_SECRET, { expiresIn: '15m' });
        
        // VULNERABILIDADE AQUI: O desenvolvedor esqueceu de deletar o token de refresh antigo do Redis.
        // await redisClient.del(`refresh:${refreshToken}`); -> DEVERIA EXISTIR!
        // Como não existe, o token pode ser usado infinitamente (Replay).

        res.cookie('auth_token', newToken, { httpOnly: true, path: '/' });
        res.json({ success: true, message: "Handshake refreshed" });
    });

    router.post('/session/terminate', async (req, res) => {
        const sid = req.cookies.mesh_sid;
        if (sid) await redisClient.del(`session:${sid}`); // Limpa no Redis, mas JWT continua vivo (M2-L08 mantido)
        
        res.clearCookie('auth_token', { path: '/' });
        res.clearCookie('refresh_token', { path: '/api/v1/auth/session/refresh' });
        res.clearCookie('mesh_sid', { path: '/' });
        res.json({ success: true, message: "Mesh handshake revoked locally" });
    });

    return router;
};
