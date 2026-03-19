import express from 'express';
export default (pool) => {
    const router = express.Router();
    router.get(['/', '/entities', '/list'], async (req, res) => {
        try {
            const result = await pool.query('SELECT * FROM tenants ORDER BY id ASC');
            res.json(result.rows);
        } catch (e) { res.status(500).json({ error: "DB Error" }); }
    });
    router.post(['/', '/create'], async (req, res) => {
        const { name, domain } = req.body;
        try {
            const result = await pool.query('INSERT INTO tenants (name, domain) VALUES ($1, $2) RETURNING *', [name, domain]);
            res.json({ success: true, entity: result.rows[0] });
        } catch (e) { res.status(500).json({ error: "Creation fail" }); }
    });
    return router;
};
