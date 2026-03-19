import express from 'express';
const router = express.Router();
export default (pool, auth) => {
    // M2-L09: BOLA - Listagem confia no tenant_id do corpo/query
    router.get('/tickets', auth, async (req, res) => {
        const tid = req.query.tenant_id || req.user.tenant_id;
        const r = await pool.query('SELECT * FROM service_dispatches WHERE tenant_id = $1', [tid]);
        res.json(r.rows);
    });
    // M4-L02: Stored XSS - Sem sanitização no salvamento do ticket
    router.post('/open', auth, async (req, res) => {
        const { subject, description } = req.body;
        const ref = 'TCK-' + Math.floor(Math.random()*999);
        await pool.query('INSERT INTO service_dispatches (dispatch_ref, subject, description, priority, tenant_id, state) VALUES ($1, $2, $3, \'MEDIUM\', $4, \'OPEN\')', 
            [ref, subject, description, req.user.tenant_id]);
        res.json({ success: true, ref });
    });
    return router;
};
