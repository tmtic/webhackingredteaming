import express from 'express';
export default (pool) => {
    const router = express.Router();
    
    // Estado global corporativo para sincronizar o Ledger com as ações de Provisionamento
    global.LEDGER = global.LEDGER || [
        { id: "TRX-9001", amount: 15400.00, type: "ENTERPRISE_LICENSE", status: "CLEARED", date: new Date(Date.now() - 86400000).toISOString() },
        { id: "TRX-9002", amount: -450.00, type: "AWS_COMPUTE", status: "PENDING", date: new Date(Date.now() - 3600000).toISOString() },
        { id: "TRX-9003", amount: -125.50, type: "PROVISION_SEAT", status: "CLEARED", date: new Date(Date.now() - 1800000).toISOString() }
    ];

    router.get(['/', '/ledger'], (req, res) => {
        res.json(global.LEDGER);
    });

    return router;
};
