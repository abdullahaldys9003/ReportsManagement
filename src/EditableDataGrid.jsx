import React, { useEffect, useState } from 'react';
import {
  Grid,
  Paper,
  TextField,
  Typography,
  Box,
  createTheme,
  ThemeProvider
} from '@mui/material';
import CustomSelect from "./common/components/SelectField";
import { getAllItems } from './api/crudApi.js';

const hiddenFields = ["districts_id", "neighborhoods_id","id","reporter_neighborhood","reporter_governorate","district","governorate","neighborhood","reporter_district"];

const getDataDistricts = () =>
  getAllItems("index.php", { tableName: "districts", operation: "show" });

const getDataNeighborhoods = () =>
  getAllItems("index.php", { tableName: "neighborhoods", operation: "show" });

const EditableDataGrid = ({ personData, reporterData, onDataChange, dataDNs, dataDNr }) => {

  const theme = createTheme({
    direction: 'rtl',
    typography: {
      fontFamily: '"Cairo", "Arial", sans-serif',
    },
  });

  const [allNeighborhoods, setAllNeighborhoods] = useState([]);
  const [dataDistricts, setDataDistricts] = useState([]);
  
  // حالة للشخص
  const [filteredNeighborhoodsPerson, setFilteredNeighborhoodsPerson] = useState([]);
  const [selectedDistrictPerson, setSelectedDistrictPerson] = useState(dataDNs?.districts_id_suspect || "");
  const [selectedNeighborhoodPerson, setSelectedNeighborhoodPerson] = useState(dataDNs?.neighborhoods_id_suspect || "");
  
  // حالة للمبلغ
  const [filteredNeighborhoodsReporter, setFilteredNeighborhoodsReporter] = useState([]);
  const [selectedDistrictReporter, setSelectedDistrictReporter] = useState(dataDNr?.districts_id_reporter || "");
  const [selectedNeighborhoodReporter, setSelectedNeighborhoodReporter] = useState(dataDNr?.neighborhoods_id_reporter || "");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const neighborhoodsResult = await getDataNeighborhoods();
        const districtsResult = await getDataDistricts();

        setDataDistricts(districtsResult.data || districtsResult);
        setAllNeighborhoods(neighborhoodsResult.data || neighborhoodsResult);
        
        // تصفية أحياء الشخص بناءً على المديرية المحددة مسبقاً
        if (dataDNs?.districts_id_suspect) {
          const filteredPerson = (neighborhoodsResult.data || neighborhoodsResult)
            .filter(neighborhood => neighborhood.district_id === dataDNs.districts_id_suspect);
          setFilteredNeighborhoodsPerson(filteredPerson);
        } else {
          setFilteredNeighborhoodsPerson([]);
        }
        
        // تصفية أحياء المبلغ بناءً على المديرية المحددة مسبقاً
        if (dataDNr?.districts_id_reporter) {
          const filteredReporter = (neighborhoodsResult.data || neighborhoodsResult)
            .filter(neighborhood => neighborhood.district_id === dataDNr.districts_id_reporter);
          setFilteredNeighborhoodsReporter(filteredReporter);
        } else {
          setFilteredNeighborhoodsReporter([]);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
        alert("حدث خطأ في تحميل البيانات: " + error.message);
      }
    };

    fetchData();
  }, [dataDNs?.districts_id_suspect, dataDNr?.neighborhoods_id_reporter]);

  // معالجة تغيير مديرية الشخص
  const handleDistrictChangePerson = (event) => {
    const districtId = event.target.value;
    setSelectedDistrictPerson(districtId);
    
    const filtered = allNeighborhoods.filter(neighborhood => 
      neighborhood.district_id === districtId
    );
    setFilteredNeighborhoodsPerson(filtered);
    
    setSelectedNeighborhoodPerson("");
    handleFieldChange('districts_id', districtId, false);
    handleFieldChange('neighborhoods_id', "", false);
  };

  // معالجة تغيير حي الشخص
  const handleNeighborhoodChangePerson = (event) => {
    const neighborhoodId = event.target.value;
    setSelectedNeighborhoodPerson(neighborhoodId);
    handleFieldChange('neighborhoods_id', neighborhoodId, false);
  };

  // معالجة تغيير مديرية المبلغ
  const handleDistrictChangeReporter = (event) => {
    const districtId = event.target.value;
    setSelectedDistrictReporter(districtId);
    
    const filtered = allNeighborhoods.filter(neighborhood => 
      neighborhood.district_id === districtId
    );
    setFilteredNeighborhoodsReporter(filtered);
    
    setSelectedNeighborhoodReporter("");
    handleFieldChange('reporter_district', districtId, true);
    handleFieldChange('reporter_neighborhood', "", true);
  };

  // معالجة تغيير حي المبلغ
  const handleNeighborhoodChangeReporter = (event) => {
    const neighborhoodId = event.target.value;
    setSelectedNeighborhoodReporter(neighborhoodId);
    handleFieldChange('reporter_neighborhood', neighborhoodId, true);
  };

  const handleFieldChange = (key, value, isReporter = false) => {
    if (onDataChange) {
      onDataChange(key, value, isReporter);
    }
  };

  // تحويل البيانات إلى الصيغة المناسبة للمكون المنسدل
  const districtOptions = dataDistricts.map(item => ({
    value: item.id,
    label: item.name
  }));

  const neighborhoodOptionsPerson = filteredNeighborhoodsPerson.map(item => ({
    value: item.neighborhood_id,
    label: item.neighborhood_name
  }));

  const neighborhoodOptionsReporter = filteredNeighborhoodsReporter.map(item => ({
    value: item.neighborhood_id,
    label: item.neighborhood_name
  }));
  
  return (
    <ThemeProvider theme={theme}>
      <div dir="rtl" style={{ padding: '16px', fontFamily: 'Cairo, Arial, sans-serif' }}>
        <Typography variant="h4" gutterBottom align="center" sx={{ mb: 4, fontWeight: 'bold', color: '#1a237e' }}>
          نموذج بيانات  المبلغ والمبلغ
        </Typography>
        
        <Grid container spacing={4}>
          {/* بيانات الشخص */}
          <Grid item xs={12} md={12}>
            <Paper elevation={3} sx={{ p: 3, borderRadius: 2, background: 'linear-gradient(45deg, #e3f2fd 30%, #bbdefb 90%)' }}>
              <Typography variant="h5" gutterBottom sx={{ pb: 2, borderBottom: '2px solid #1976d2', color: '#0d47a1' }}>
                بيانات المبلغ عنه
              </Typography>
              <Grid container spacing={2} sx={{ mt: 1 }}>
                {personData.filter(item => !hiddenFields.includes(item.key)).map((item, index) => (
                  <Grid item xs={12} sm={6} key={index}>
                    <TextField
                      fullWidth
                      label={item.field}
                      value={item.value || ''}
                      onChange={(e) => handleFieldChange(item.key, e.target.value, false)}
                      variant="outlined"
                      size="small"
                    />
                  </Grid>
                ))}
                
                {/* اختيار المنطقة للشخص */}
                <Grid item xs={12} sm={6}>
                  <CustomSelect
                    label="المنطقة"
                    value={selectedDistrictPerson}
                    onChange={handleDistrictChangePerson}
                    options={districtOptions}
                  />
                </Grid>
                
                {/* اختيار الحي للشخص */}
                <Grid item xs={12} sm={6}>
                  <CustomSelect
                    label="الحي"
                    value={selectedNeighborhoodPerson}
                    onChange={handleNeighborhoodChangePerson}
                    options={neighborhoodOptionsPerson}
                    disabled={!selectedDistrictPerson}
                  />
                </Grid>
              </Grid>
            </Paper>
          </Grid>
          
          {/* بيانات المبلغ */}
          <Grid item xs={12} md={12}>
            <Paper elevation={3} sx={{ p: 3, borderRadius: 2, background: 'linear-gradient(45deg, #e8f5e9 30%, #c8e6c9 90%)' }}>
              <Typography variant="h5" gutterBottom sx={{ pb: 2, borderBottom: '2px solid #388e3c', color: '#1b5e20' }}>
                بيانات المبلغ
              </Typography>
              <Grid container spacing={2} sx={{ mt: 1 }}>
                {reporterData.filter(item => !hiddenFields.includes(item.key)).map((item, index) => (
                  <Grid item xs={12} sm={6} key={index}>
                    <TextField
                      fullWidth
                      label={item.field}
                      value={item.value || ''}
                      onChange={(e) => handleFieldChange(item.key, e.target.value, true)}
                      variant="outlined"
                      size="small"
                    />
                  </Grid>
                ))}
                
                {/* اختيار المنطقة للمبلغ */}
                <Grid item xs={12} sm={6}>
                  <CustomSelect
                    label="منطقة المبلغ"
                    value={selectedDistrictReporter}
                    onChange={handleDistrictChangeReporter}
                    options={districtOptions}
                  />
                </Grid>
                
                {/* اختيار الحي للمبلغ */}
                <Grid item xs={12} sm={6}>
                  <CustomSelect
                    label="حي المبلغ"
                    value={selectedNeighborhoodReporter}
                    onChange={handleNeighborhoodChangeReporter}
                    options={neighborhoodOptionsReporter}
                    disabled={!selectedDistrictReporter}
                  />
                </Grid>
              </Grid>
            </Paper>
          </Grid>
        </Grid>

        <Box sx={{ mt: 4, textAlign: 'center' }}>
          <Typography variant="body2" color="textSecondary">
            يمكنك تعديل أي حقل بالنقر عليه وتغيير قيمته
          </Typography>
        </Box>
      </div>
    </ThemeProvider>
  );
};

export default EditableDataGrid;