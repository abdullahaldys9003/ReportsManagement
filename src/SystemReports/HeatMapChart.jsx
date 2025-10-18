import React, { useState, useEffect } from 'react';
import Box from '@mui/material/Box';
import { 
  Typography, 
  FormControl, 
  InputLabel, 
  Select, 
  MenuItem, 
  TextField,
  Paper,
  Grid,
  Chip
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';

// نستخدم ديناميك import لتحميل react-apexcharts فقط على جانب العميل
let ReactApexChart;
if (typeof window !== 'undefined') {
  import('react-apexcharts').then((module) => {
    ReactApexChart = module.default;
  });
}

// بيانات المناطق
const districts = [
  { id: 1, name: 'مديرية السلام', neighborhoods: ['حي المسبح', 'حي الروضة', 'حي التوحيد'] },
  { id: 2, name: 'مديرية المعافر', neighborhoods: ['حي التحرير', 'حي باب الكبير', 'حي بئر باشا'] },
  { id: 3, name: 'مديرية القاهرة', neighborhoods: ['حي الموشيكي', 'حي الثورة', 'حي الساحة'] },
  { id: 4, name: 'مديرية صالة', neighborhoods: ['حي الجديدة', 'حي القديمة', 'حي الشرقية'] },
];

// أنواع البلاغات
const reportTypes = [
  'سرقة',
  'حريق',
  'حادث مروري',
  'مشاجرة',
  'بلاغ طبي',
  'انقطاع خدمات',
  'مخالفات بناء',
  'أخرى'
];

// إنشاء بيانات عشوائية للبلاغات
const generateReportData = (selectedDistrict = null, searchQuery = '') => {
  const data = [];
  
  districts.forEach(district => {
    if (selectedDistrict && district.name !== selectedDistrict) return;
    
    district.neighborhoods.forEach(neighborhood => {
      if (searchQuery && !neighborhood.includes(searchQuery)) return;
      
      reportTypes.forEach(type => {
        if (searchQuery && !type.includes(searchQuery)) return;
        
        data.push({
          district: district.name,
          neighborhood,
          type,
          count: Math.floor(Math.random() * 100),
          date: new Date(Date.now() - Math.floor(Math.random() * 365) * 86400000).toLocaleDateString('ar-EG')
        });
      });
    });
  });
  
  return data;
};

// توليد بيانات للمخطط الحراري
const generateHeatmapData = (reports) => {
  const districtReports = {};
  
  reports.forEach(report => {
    if (!districtReports[report.district]) {
      districtReports[report.district] = {};
    }
    
    if (!districtReports[report.district][report.type]) {
      districtReports[report.district][report.type] = 0;
    }
    
    districtReports[report.district][report.type] += report.count;
  });
  
  return Object.keys(districtReports).map(district => ({
    name: district,
    data: reportTypes.map(type => ({
      x: type,
      y: districtReports[district][type] || 0
    }))
  }));
};

const HeatMapChart = () => {
  const [isClient, setIsClient] = useState(false);
  const [selectedDistrict, setSelectedDistrict] = useState('جميع المناطق');
  const [searchQuery, setSearchQuery] = useState('');
  const [reports, setReports] = useState([]);
  const [heatmapData, setHeatmapData] = useState({ series: [], options: {} });

  useEffect(() => {
    setIsClient(true);
    const generatedReports = generateReportData();
    setReports(generatedReports);
    updateHeatmapData(generatedReports);
  }, []);

  useEffect(() => {
    const filteredReports = generateReportData(
      selectedDistrict === 'جميع المناطق' ? null : selectedDistrict,
      searchQuery
    );
    setReports(filteredReports);
    updateHeatmapData(filteredReports);
  }, [selectedDistrict, searchQuery]);

  const updateHeatmapData = (reportsData) => {
    const series = generateHeatmapData(reportsData);
    
    setHeatmapData({
      series,
      options: {
        chart: {
          height: 500,
          type: 'heatmap',
          toolbar: {
            show: true,
          },
        },
        dataLabels: {
          enabled: true,
          style: {
            fontWeight: 'bold',
            fontSize: '10px',
            fontFamily: 'Arial, sans-serif',
          },
        },
        colors: ['#008FFB'],
        title: {
          text: 'كثافة البلاغات حسب المنطقة والنوع',
          align: 'center',
          style: {
            fontSize: '18px',
            fontWeight: 'bold',
            fontFamily: 'Arial, sans-serif',
          },
        },
        xaxis: {
          type: 'category',
          categories: reportTypes,
          labels: {
            style: {
              fontSize: '10px',
              fontFamily: 'Arial, sans-serif',
              fontWeight: 'bold'
            },
            rotate: -45,
          },
        },
        yaxis: {
          labels: {
            style: {
              fontSize: '12px',
              fontFamily: 'Arial, sans-serif',
              fontWeight: 'bold'
            }
          }
        },
        tooltip: {
          y: {
            formatter: (val) => `${val} بلاغ`,
          },
        },
        plotOptions: {
          heatmap: {
            radius: 3,
            enableShades: true,
            shadeIntensity: 0.5,
            reverseNegativeShade: true,
            distributed: false,
            useFillColorAsStroke: false,
            colorScale: {
              ranges: [
                { from: 0, to: 20, name: 'منخفض', color: '#00A300' },
                { from: 21, to: 50, name: 'متوسط', color: '#FFC40D' },
                { from: 51, to: 100, name: 'مرتفع', color: '#FF0000' },
              ],
            },
          },
        },
      }
    });
  };

  const totalReports = reports.reduce((sum, report) => sum + report.count, 0);

  return (
    <Box sx={{ p: 2 }}>
      <Typography variant="h4" component="h1" gutterBottom align="center" sx={{ mb: 3, fontWeight: 'bold', color: '#1976d2' }}>
        نظام رصد كثافة البلاغات
      </Typography>
      
      <Paper elevation={3} sx={{ p: 3, mb: 3 }}>
        <Grid container spacing={3} alignItems="center">
          <Grid item xs={12} md={6}>
            <FormControl fullWidth>
              <InputLabel>المديرية</InputLabel>
              <Select
                value={selectedDistrict}
                label="المديرية"
                onChange={(e) => setSelectedDistrict(e.target.value)}
              >
                <MenuItem value="جميع المناطق">جميع المناطق</MenuItem>
                {districts.map((district) => (
                  <MenuItem key={district.id} value={district.name}>
                    {district.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="بحث بحي أو نوع البلاغ"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              InputProps={{
                endAdornment: <SearchIcon />
              }}
            />
          </Grid>
        </Grid>
        
        <Box sx={{ mt: 2, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          <Chip 
            label={`إجمالي البلاغات: ${totalReports}`} 
            color="primary" 
            variant="outlined"
            sx={{ fontSize: '1rem', p: 2 }}
          />
        </Box>
      </Paper>
      
      <Paper elevation={3} sx={{ p: 2, mb: 3 }}>
        <Typography variant="h6" gutterBottom align="center">
          خريطة كثافة البلاغات
        </Typography>
        <Box sx={{ maxWidth: '100%', margin: '0 auto', fontFamily: 'Arial, sans-serif' }}>
          {isClient && ReactApexChart ? (
            <ReactApexChart 
              options={heatmapData.options} 
              series={heatmapData.series} 
              type="heatmap" 
              height={500} 
            />
          ) : (
            <Box sx={{ textAlign: 'center', padding: '100px 0' }}>
              <Typography>جاري تحميل مخطط خريطة الحرارة...</Typography>
            </Box>
          )}
        </Box>
      </Paper>
      
      <Paper elevation={3} sx={{ p: 3 }}>
        <Typography variant="h6" gutterBottom align="center">
          آخر البلاغات
        </Typography>
        <Box sx={{ maxHeight: 300, overflow: 'auto' }}>
          {reports.slice(0, 10).map((report, index) => (
            <Box 
              key={index} 
              sx={{ 
                p: 1, 
                mb: 1, 
                border: '1px solid #e0e0e0', 
                borderRadius: 1,
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
              }}
            >
              <Box>
                <Typography variant="body1" fontWeight="bold">
                  {report.type} في {report.neighborhood}
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  {report.district} - {report.date}
                </Typography>
              </Box>
              <Chip 
                label={`${report.count} بلاغ`} 
                color={
                  report.count > 50 ? "error" : 
                  report.count > 20 ? "warning" : "success"
                } 
              />
            </Box>
          ))}
        </Box>
      </Paper>
    </Box>
  );
};

export default HeatMapChart;