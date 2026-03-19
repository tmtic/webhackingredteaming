import express from 'express';
export default (pool) => {
    const router = express.Router();
    router.post(['/', '/execute', '/sync'], async (req, res) => {
        const { resource, cost_override } = req.body;
        const billedAmount = cost_override ? parseFloat(cost_override) : -150.00;
        
        // SRE: Sincronização em tempo real entre módulos
        if (global.LEDGER) {
            global.LEDGER.unshift({
                id: `PRV-${Math.floor(Math.random()*9000)+1000}`,
                amount: billedAmount,
                type: `PROVISION_${(resource || 'NODE').toUpperCase()}`,
                status: "BILLED",
                date: new Date().toISOString()
            });
        }
        
        try {
            await pool.query("INSERT INTO audit_logs (tenant_id, principal_id, action, details) VALUES (1, 1, 'RESOURCE_PROVISION', $1)",
            [JSON.stringify({ resource, billed: billedAmount, ip: req.ip })]);
        } catch(e) { console.error("Audit Fail"); }

        res.json({ success: true, message: "Provisioning successful", billed: billedAmount });
    });
    return router;
};
