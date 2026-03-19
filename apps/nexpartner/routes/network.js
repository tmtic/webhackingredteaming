import express from 'express';
import http from 'http';
import https from 'https';
import { URL } from 'url';

export default (pool) => {
    const router = express.Router();
    
    // Funcionalidade: Partner Connectivity Handshake
    // VULNERABILIDADE ARQUITETURAL: Server-Side Request Forgery (SSRF).
    // O sistema permite que o usuário teste a conexão com um webhook de parceiro (Partner API).
    // Ele faz o fetch diretamente pelo backend sem restrição de IP (pode acessar localhost/AWS Metadata).
    router.post('/edge/handshake', (req, res) => {
        const targetUrl = req.body.partner_url || req.body.endpoint || req.body.url;
        
        // Comportamento default se a UI apenas clicar no botão sem URL:
        if (!targetUrl) return res.json({ status: "Synchronized", node: "NEX-EDGE-01", latency: "12ms" });

        try {
            const parsedUrl = new URL(targetUrl);
            const client = parsedUrl.protocol === 'https:' ? https : http;
            
            client.get(targetUrl, { timeout: 3000 }, (resp) => {
                let data = '';
                resp.on('data', (chunk) => data += chunk);
                resp.on('end', () => {
                    // Retorna status e um pedaço da resposta (Blind SSRF mitigado para o Red Teamer)
                    res.json({ 
                        status: "Handshake Successful", 
                        partner_code: resp.statusCode,
                        response_preview: data.substring(0, 100) 
                    });
                });
            }).on('error', (e) => {
                res.status(502).json({ error: "Partner Gateway Unreachable", details: e.message });
            });
        } catch (e) {
            res.status(400).json({ error: "Invalid Partner URL Schema" });
        }
    });

    return router;
};
