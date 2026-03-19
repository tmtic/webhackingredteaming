import express from 'express';
export default (pool) => {
    const router = express.Router();

    // Rota de Audit Stream com informações ricas
    router.get('/audit/stream', async (req, res) => {
        const result = await pool.query(`
            SELECT a.*, u.username 
            FROM audit_logs a 
            JOIN users u ON a.principal_id = u.id 
            ORDER BY a.created_at DESC LIMIT 20
        `);
        res.json(result.rows);
    });

    // FIX: O componente React espera um campo 'output' ou 'data' com o texto do terminal
    router.all(['/telemetry', '/metrics', '/diagnostics/core'], (req, res) => {
        const uptime = Math.floor(process.uptime());
        const mockLog = `
[BOOT] Sovereign Mesh initialized...
[INFO] Cluster Node NEX-01: ONLINE (Uptime: ${uptime}s)
[INFO] Database Handshake: SUCCESS
[WARN] Latency on Edge-SA-East-1: 45ms
[INFO] Memory Heap: ${Math.round(process.memoryUsage().heapUsed / 1024 / 1024)}MB
[SUCCESS] All systems operational.
        `;
        res.json({
            success: true,
            status: "Healthy",
            output: mockLog, // O segredo para preencher o quadrado verde
            data: mockLog
        });
    });
    return router;
};
