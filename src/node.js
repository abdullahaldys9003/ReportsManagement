// server.js
import express from 'express';
import axios from 'axios';
import cors from 'cors';

const app = express();
app.use(cors()); // يسمح بالوصول من المتصفح
const PORT = process.env.PORT || 5000;

// GET /price  -> يُرجع سعر SHIBUSDT
app.get('/price', async (req, res) => {
  try {
    const r = await axios.get('https://api.mexc.com/api/v3/ticker/price', {
      params: { symbol: 'SHIBUSDT' }
    });
    return res.json(r.data);
  } catch (err) {
    console.error('price error:', err.message || err);
    return res.status(500).json({ error: 'failed to fetch price', details: err.message });
  }
});

// GET /depth?limit=10  -> يُرجع دفتر الأوامر
app.get('/depth', async (req, res) => {
  const limit = req.query.limit || 10;
  try {
    const r = await axios.get('https://api.mexc.com/api/v3/depth', {
      params: { symbol: 'SHIBUSDT', limit }
    });
    return res.json(r.data);
  } catch (err) {
    console.error('depth error:', err.message || err);
    return res.status(500).json({ error: 'failed to fetch depth', details: err.message });
  }
});

app.listen(PORT, () => {
  console.log(`MEXC proxy running on http://localhost:${PORT}`);
});