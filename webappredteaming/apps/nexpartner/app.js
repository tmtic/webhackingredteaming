import express from 'express';
import pkg from 'pg';
const { Pool } = pkg;
import jwt from 'jsonwebtoken';
import cookieParser from 'cookie-parser';
import { exec } from 'child_process';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = express();
const JWT_SECRET = "NEX-2026-B2B-XF-99281-PRIVATE"; 

app.use(express.json());
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'dist'), { dotfiles: 'allow' }));

const pool = new Pool({ 
    connectionString: process.env.DB_URL,
    connectionTimeoutMillis: 10000,
    max: 20
});

// Teste de conexão com retry (Essencial para evitar ENOTFOUND no boot)
const connectWithRetry = () => {
  pool.query('SELECT NOW()', (err) => {
    if (err) {
      console.error('❌ Database not ready, retrying in 2s...', err.message);
      setTimeout(connectWithRetry, 2000);
    } else {
      console.log('✅ Connected to shared-db successfully');
    }
  });
};
connectWithRetry();

app.post('/api/v1/auth/session/init', async (req, res) => {
    const { user, pass } = req.body;
    try {
        const r = await pool.query(`SELECT * FROM users WHERE username = '${user}' AND password = '${pass}'`);
        if (r.rows.length === 1) {
            const token = jwt.sign({ id: r.rows[0].id, role: r.rows[0].role, name: r.rows[0].full_name }, JWT_SECRET);
            res.cookie('auth_token', token);
            return res.json({ success: true, role: r.rows[0].role, name: r.rows[0].full_name });
        }
        res.status(401).json({ error: "Invalid credentials" });
    } catch (e) {
        console.error("🔥 Login Crash Avoided:", e.message);
        res.status(500).json({ error: "Database communication failure" });
    }
});

app.post('/api/v1/services/health/ping', (req, res) => {
    exec(`ping -c 1 ${req.body.target}`, (e, so, se) => res.json({ result: so || se }));
});

app.get('/api/v1/billing/contracts/metadata', async (req, res) => {
    try {
        const r = await pool.query('SELECT * FROM nex_contracts WHERE id = $1', [req.query.id]);
        res.json(r.rows[0] || { status: "not_found" });
    } catch (e) {
        console.error("🎯 Planned DoS Triggered:", e.message);
        throw e; // Aqui deixamos crashar para o laboratório de DoS
    }
});

app.get('*', (req, res) => res.sendFile(path.join(__dirname, 'dist/index.html')));
app.listen(8080, () => console.log('🏢 NexPartner Core v113 Online'));
