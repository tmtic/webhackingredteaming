import express from 'express';
export default (pool) => {
    const router = express.Router();
    
    // Recupera informações REAIS do banco de dados (Tenants)
    router.get(['/', '/entities', '/list'], async (req, res) => {
        try {
            const result = await pool.query('SELECT * FROM tenants ORDER BY created_at DESC');
            res.json(result.rows);
        } catch (e) { res.status(500).json({ error: "Governance directory offline" }); }
    });

    // VULNERABILIDADE: Mass Assignment no cadastro de Entidades
    router.post(['/', '/create', '/new'], async (req, res) => {
        try {
            // Aceita o body inteiro, permitindo injetar campos como 'id' ou 'internal_rating'
            const { name, domain } = req.body;
            const result = await pool.query(
                'INSERT INTO tenants (name, domain) VALUES ($1, $2) RETURNING *',
                [name || 'New Entity', domain || 'corporate.local']
            );
            res.json({ success: true, entity: result.rows[0] });
        } catch (e) { res.status(500).json({ error: "Failed to register entity" }); }
    });
    return router;
};
