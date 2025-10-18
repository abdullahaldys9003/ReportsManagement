import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { BarChart } from '@mui/x-charts/BarChart';
import { Card, CardContent, Typography, Box, Table, TableHead, TableBody, TableRow, TableCell } from '@mui/material';

function App() {
  const [price, setPrice] = useState(null);
  const [orderBook, setOrderBook] = useState({ bids: [], asks: [] });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const API_BASE = 'http://localhost:5000';

  const formatNumber = (num) => {
    const n = parseFloat(num);
    if (Number.isNaN(n)) return '--';
    return n.toLocaleString('en-US', { maximumFractionDigits: 8 });
  };

  useEffect(() => {
    let mounted = true;

    const fetchData = async () => {
      try {
        const [priceRes, depthRes] = await Promise.all([
          axios.get(`${API_BASE}/price`),
          axios.get(`${API_BASE}/depth?limit=20`)
        ]);
/*
{
  "code": 0,
  "data": {
    "bids": [
      ["0.00003500", "1000"],
      ["0.00003490", "2000"]
    ],
    "asks": [
      ["0.00003600", "1500"],
      ["0.00003610", "1700"]
    ]
  },
  "message": "success"
}
*/
        if (!mounted) return;
        setPrice(priceRes.data?.price || null);

        const bids = depthRes.data?.bids || [];
        const asks = depthRes.data?.asks || [];

        setOrderBook({ bids, asks });
        setLoading(false);
      } catch (err) {
        console.error('fetchData error:', err);
        if (!mounted) return;
        setError('فشل في جلب البيانات من السيرفر المحلي.');
        setLoading(false);
      }
    };

    fetchData();
    const interval = setInterval(fetchData, 5000);
    return () => { mounted = false; clearInterval(interval); };
  }, [API_BASE]);

  if (loading) return <div>جاري التحميل...</div>;
  if (error) return <div>خطأ: {error}</div>;

  // تحضير بيانات المخطط
  const prepareChartData = (data, type) => {
    return data.map((item, index) => ({
      id: `${type}-${index}`,
      price: parseFloat(item[0]),
      quantity: parseFloat(item[1]),
      value: parseFloat(item[0]) * parseFloat(item[1]),
      type: type
    }));
    /*
  [
  {
    id: "bid-0",
    price: 0.000035,
    quantity: 1000,
    value: 0.035,   // 0.000035 * 1000
    type: "bid"
  },
  {
    id: "bid-1",
    price: 0.0000349,
    quantity: 2000,
    value: 0.0698,
    type: "bid"
  }
]  
    */
  };

  const bidsData = prepareChartData(orderBook.bids, 'bid');
  const asksData = prepareChartData(orderBook.asks, 'ask');

  // إنشاء محور السعر للشراء والبيع
  const priceAxisData = [
    ...bidsData.map(item => item.price),
    ...asksData.map(item => item.price)
  ].sort((a, b) => a - b);

  return (
    <Box sx={{ padding: 3, fontFamily: 'Tajawal, sans-serif' }}>
      <Typography variant="h3" component="h1" gutterBottom>
        تتبع سعر SHIB/USDT - MEXC
      </Typography>

      <Card sx={{ marginBottom: 3 }}>
        <CardContent>
          <Typography variant="h5" component="h2">
            السعر الحالي: {price ? formatNumber(price) : '--'} USDT
          </Typography>
        </CardContent>
      </Card>

      <Box sx={{ marginBottom: 4 }}>
        <Typography variant="h4" component="h3" gutterBottom>
          مخطط أوامر البيع والشراء
        </Typography>
        <Box sx={{ height: 400 }}>
          <BarChart
            xAxis={[{
              scaleType: 'band',
              data: priceAxisData,
              label: 'السعر (USDT)',
              valueFormatter: (value) => formatNumber(value)
            }]}
            yAxis={[{ label: 'القيمة (USDT)' }]}
            series={[
              {
                data: bidsData.map(item => item.value),
                label: 'أوامر الشراء',
                color: '#00b894',
              },
              {
                data: asksData.map(item => item.value),
                label: 'أوامر البيع',
                color: '#d63031',
              }
            ]}
            layout="vertical"
            slotProps={{
              legend: {
                direction: 'row',
                position: { vertical: 'top', horizontal: 'middle' },
              },
            }}
          />
        </Box>
      </Box>

      <Box sx={{ marginBottom: 4 }}>
        <Typography variant="h4" component="h3" gutterBottom>
          أوامر البيع (Asks)
        </Typography>
        <Box sx={{ height: 300, overflow: 'auto' }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>السعر</TableCell>
                <TableCell>الكمية</TableCell>
                <TableCell>القيمة</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {orderBook.asks.map((ask, index) => {
                const priceNum = parseFloat(ask[0]);
                const qtyNum = parseFloat(ask[1]);
                return (
                  <TableRow key={`ask-${index}`}>
                    <TableCell sx={{ color: '#d63031' }}>{formatNumber(priceNum)}</TableCell>
                    <TableCell>{formatNumber(qtyNum)}</TableCell>
                    <TableCell>{formatNumber(priceNum * qtyNum)}</TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </Box>
      </Box>

      <Box sx={{ marginBottom: 4 }}>
        <Typography variant="h4" component="h3" gutterBottom>
          أوامر الشراء (Bids)
        </Typography>
        <Box sx={{ height: 300, overflow: 'auto' }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>السعر</TableCell>
                <TableCell>الكمية</TableCell>
                <TableCell>القيمة</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {orderBook.bids.map((bid, index) => {
                const priceNum = parseFloat(bid[0]);
                const qtyNum = parseFloat(bid[1]);
                return (
                  <TableRow key={`bid-${index}`}>
                    <TableCell sx={{ color: '#00b894' }}>{formatNumber(priceNum)}</TableCell>
                    <TableCell>{formatNumber(qtyNum)}</TableCell>
                    <TableCell>{formatNumber(priceNum * qtyNum)}</TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </Box>
      </Box>
    </Box>
  );
}

export default App;