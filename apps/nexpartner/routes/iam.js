import express from 'express';
export default (pool) => {
    const router = express.Router();
    
    router.get('/profile', async (req, res) => {
        try {
            const result = await pool.query('SELECT id, username, full_name, email, profession, role, tenant_id, clearance_level FROM users WHERE id = $1', [req.user.id]);
            res.json(result.rows[0] || {});
        } catch (e) { res.status(500).json({ error: "Identity resolve failure" }); }
    });

    router.get('/team', async (req, res) => {
        try {
            const result = await pool.query('SELECT id, username, full_name, email, profession, role FROM users WHERE tenant_id = $1', [req.user.tenant_id]);
            res.json(result.rows);
        } catch (e) { res.status(500).json({ error: "Atlas sync failed" }); }
    });

    // VULNERABILIDADE (BOLA): Confia no parâmetro dinâmico 'tenant_id' em vez do contexto da sessão autenticada.
    router.get('/export', async (req, res) => {
        try {
            const targetContext = req.query.tenant_id || req.user.tenant_id;
            const result = await pool.query('SELECT id, username, full_name, email, role FROM users WHERE tenant_id = $1', [targetContext]);
            
            res.setHeader('Content-Disposition', 'attachment; filename="corporate_atlas_export.json"');
            res.setHeader('Content-Type', 'application/json');
            res.json({ exported_at: new Date(), scope: targetContext, data: result.rows });
        } catch (e) { res.status(500).json({ error: "Export engine failure" }); }
    });

    router.post('/member/provision', async (req, res) => {
        const { username, email, full_name, role, profession } = req.body;
        try {
            const result = await pool.query(
                'INSERT INTO users (username, full_name, email, role, profession, tenant_id, password) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING id, username, role',
                [username, full_name || username, email, role || 'Staff', profession || 'Analyst', req.user.tenant_id, 'TempPass123!']
            );
            res.json({ success: true, provisioned_identity: result.rows[0] });
        } catch (e) { res.status(400).json({ error: "Provisioning conflict", code: e.code }); }
    });

    return router;
};
