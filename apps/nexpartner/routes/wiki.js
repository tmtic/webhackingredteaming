import express from 'express';
export default (pool) => {
    const router = express.Router();
    router.get('/articles', async (req, res) => {
        const result = await pool.query('SELECT * FROM wiki_articles WHERE tenant_id = $1', [req.user.tenant_id]);
        res.json(result.rows);
    });
    return router;
};
