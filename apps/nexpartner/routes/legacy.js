import express from 'express';
const router = express.Router();

export default (pool) => {
    // M2-L12: Inventory Drift (Rota legada v0). 
    // Foi descontinuada, mas não removida do código e não exige JWT.
    router.get('/iam/team-sync', async (req, res) => {
        try {
            // Em 2024, não havia divisão de tenant estrita nesta rota
            const r = await pool.query('SELECT id, username, email, role, clearance_level FROM users');
            res.json({ _deprecated: true, warning: "Use /api/v1/iam/team instead", nodes: r.rows });
        } catch (e) { res.status(500).json({ error: "Legacy sync failed" }); }
    });
    return router;
};
