import express from 'express';
const router = express.Router();
export default (pool) => {
    // M1-L10: Debug/Actuator Exposure (Informação Sensível)
    router.get('/inspect', async (req, res) => {
        res.json({
            node_version: process.version,
            platform: process.platform,
            env: "enterprise_staging",
            trace_debug: "enabled",
            internal_registry: "10.0.0.5:5000"
        });
    });
    return router;
};
