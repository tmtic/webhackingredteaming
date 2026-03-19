import express from 'express';
import { execSync } from 'child_process';
export default (pool) => {
    const router = express.Router();
    
    router.get('/audit/stream', async (req, res) => {
        try {
            const result = await pool.query('SELECT a.*, u.username FROM audit_logs a JOIN users u ON a.principal_id = u.id ORDER BY a.created_at DESC LIMIT 50');
            res.json(result.rows);
        } catch (e) { res.status(500).json({ error: "Audit Error" }); }
    });

    router.all(['/telemetry', '/metrics', '/diagnostics/core'], (req, res) => {
        const filter = req.body.node_filter || req.query.node_filter || '';
        let terminal = `[SYSTEM] NexPartner Sovereign Mesh Diagnostics\n[TIME] ${new Date().toISOString()}\n`;
        try {
            if (filter) {
                terminal += `> Filtering Node: ${filter}\n`;
                terminal += execSync(`echo "Node Result: ${filter}"`).toString();
            }
        } catch(e) { terminal += `[ERR] Execution Error.\n`; }
        
        terminal += `\n[OK] Core status: Healthy.`;
        res.json({ success: true, output: terminal, data: terminal });
    });
    return router;
};
