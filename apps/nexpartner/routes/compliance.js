import express from 'express';
const router = express.Router();

export default (pool, auth) => {
    // Função real: Atualiza perfil de conformidade do nó
    router.put('/node/:id/settings', auth, async (req, res) => {
        try {
            // FALHA ARQUITETURAL: Mass Assignment
            // O sistema aceita qualquer campo enviado no body (ex: clearance_level)
            // em vez de filtrar apenas os campos de 'settings'.
            const fields = Object.keys(req.body).map((key, i) => `${key} = $${i + 2}`).join(', ');
            const values = Object.values(req.body);
            await pool.query(`UPDATE users SET ${fields} WHERE id = $1`, [req.params.id, ...values]);
            res.json({ status: "Configuration Applied" });
        } catch (e) { res.status(500).json({ error: "ER_INTERNAL_DB" }); }
    });
    return router;
};
