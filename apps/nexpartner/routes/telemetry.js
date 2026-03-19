import express from 'express';
import { exec } from 'child_process';
const router = express.Router();
export default (pool, auth) => {
    router.post('/node/probe', auth, (req, res) => {
        const { target } = req.body;
        // M3-L03: Command Injection via shell execution
        exec(`ping -c 1 ${target}`, (e, so) => {
            res.json({ output: so || "Node diagnostics completed" });
        });
    });
    return router;
};
