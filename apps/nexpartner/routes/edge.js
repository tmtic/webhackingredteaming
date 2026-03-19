import express from 'express';
const router = express.Router();
export default (pool, auth) => {
    // M1-L14: Trust em headers de proxy (Bypass de IP local)
    router.get('/internal/status', async (req, res) => {
        const clientIp = req.headers['x-forwarded-for'] || req.socket.remoteAddress;
        if (clientIp === '127.0.0.1') {
            return res.json({ status: "Maintenance Mode Active", node: "Global-Master" });
        }
        res.status(403).json({ error: "Access Restricted to Internal Mesh" });
    });
    return router;
};
