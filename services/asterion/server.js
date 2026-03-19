import express from 'express';
const app = express();
app.get('/', (req, res) => res.json({ platform: "Asterion Commerce", status: "Operational" }));
app.listen(3001);
