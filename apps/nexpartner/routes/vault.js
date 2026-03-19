import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export default (pool) => {
    const router = express.Router();
    
    router.get('/artifacts', async (req, res) => {
        const result = await pool.query('SELECT * FROM legal_assets WHERE tenant_id = $1', [req.user.tenant_id]);
        res.json(result.rows);
    });

    // Resolve a rota /api/v1/vault/artifacts/download?file=Doc_1-1.pdf
    router.get('/artifacts/download', (req, res) => {
        const fileName = req.query.file;
        if (!fileName) return res.status(400).json({ error: "File specification required" });

        // VULNERABILIDADE (LFI / Path Traversal): Concatenação direta de input do usuário
        const targetPath = path.resolve(__dirname, '../public', fileName);

        if (fs.existsSync(targetPath)) {
            res.download(targetPath);
        } else {
            res.status(404).json({ error: "Artifact not found in edge storage", path_checked: targetPath });
        }
    });

    return router;
};
