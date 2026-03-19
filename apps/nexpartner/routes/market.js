import express from 'express';
export default (pool) => {
    const router = express.Router();
    global.LEDGER = global.LEDGER || [
        { id: "TRX-1001", amount: 15400.00, type: "LICENSE_RENEWAL", status: "CLEARED", date: new Date().toISOString() }
    ];
    router.get(['/', '/ledger'], (req, res) => res.json(global.LEDGER));
    return router;
};
