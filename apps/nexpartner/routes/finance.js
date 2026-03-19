import express from 'express';
const router = express.Router();

export default (pool) => {
    // FIX: Resolvendo o erro 404 Cannot POST /api/v1/finance/settle
    router.post('/settle', async (req, res) => {
        const { amount } = req.body;
        // M4-L13: Wallet Abuse - Não há validação se 'amount' é negativo.
        // Enviar valores negativos irá adicionar fundos à conta em vez de deduzir.
        try {
            await pool.query('UPDATE financial_ledger SET balance = balance - $1 WHERE user_id = $2', [amount, req.user.id]);
            res.json({ success: true, message: "Settlement executed" });
        } catch(e) { res.status(500).json({ error: "Ledger transaction failed" }); }
    });
    return router;
};
