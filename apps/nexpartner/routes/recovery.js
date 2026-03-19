import express from 'express';
import nodemailer from 'nodemailer';
const router = express.Router();

const transporter = nodemailer.createTransport({
    host: 'shared-mail',
    port: 1025,
    secure: false
});

export default (pool) => {
    // M2-L03: Weak Reset - Token previsível (Base64)
    router.post('/handshake', async (req, res) => {
        const { endpoint } = req.body;
        try {
            const r = await pool.query('SELECT * FROM users WHERE LOWER(email) = LOWER($1) OR LOWER(username) = LOWER($1)', [endpoint]);
            if (r.rowCount === 0) return res.status(404).json({ error: "Identity endpoint not recognized in current mesh" });

            const user = r.rows[0];
            const token = Buffer.from(user.email).toString('base64');
            
            // SRE FIX: URL enviada via Query String na raiz para bypass de Nginx confusions
            await transporter.sendMail({
                from: '"NexPartner Security Mesh" <no-reply@nexpartner.cloud>',
                to: user.email,
                subject: "Identity Access Handshake Protocol",
                text: `Authorized recovery token for industrial node: ${token}\nEstablish new access key at: http://cloud.nexpartner.lab/?recovery_token=${token}`
            });

            res.json({ success: true, message: "Security token dispatched to identity endpoint" });
        } catch (e) { res.status(500).json({ error: "Mesh synchronization failure" }); }
    });

    router.post('/finalize', async (req, res) => {
        const { token, access_key } = req.body;
        try {
            const email = Buffer.from(token, 'base64').toString();
            await pool.query('UPDATE users SET password = $1 WHERE email = $2', [access_key, email]);
            res.json({ success: true, message: "Identity Key Synchronized" });
        } catch (e) { res.status(500).json({ error: "Handshake Finalization Failed" }); }
    });

    return router;
};
