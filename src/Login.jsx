import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { getAllItems,updateItem} from './api/crudApi.js';


import {
  Box,
  Paper,
  TextField,
  Button,
  Typography,
  Alert
} from '@mui/material';


const emp = async () => {
  const data= await getAllItems("index.php", { tableName: "employees", operation: "show" });
  alert(data);
  return data;
}


const Login = ({ onLoginSuccess }) => {
  const [formData, setFormData] = useState({
    username: '',
    password: ''
  });
  
  const [error, setError] = useState('');

  const navigate = useNavigate();
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    setError('');
  };

// في دالة handleSubmit في Login.js
const handleSubmit = async (e) => {
  e.preventDefault();
  setError('');

  // التحقق من تعبئة الحقول
  if (!formData.username || !formData.password) {
    setError('يرجى إدخال اسم المستخدم وكلمة المرور');
    return;
  }
alert("hello");
  try {
    const data = await emp(); // جلب بيانات الموظفين من الدالة emp()
    alert(data);
    if (!data || data.length === 0) {
      setError('لم يتم العثور على بيانات المستخدمين');
      return;
    }

    // البحث عن المستخدم المطابق
    const user = data.find(
      (item) =>
        item.username === formData.username &&
        item.password === formData.password
    );

    if (user) {
      const userData = {
        position_type: user.position_type,
        email: user.email,
        username: user.username,
      };

      onLoginSuccess(userData); // تسجيل الدخول الناجح
    } else {
      setError('اسم المستخدم أو كلمة المرور غير صحيحة');
    }
  } catch (err) {
    console.error(err);
    setError('حدث خطأ أثناء التحقق من البيانات');
  }
};

  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        padding: 2
      }}
    >
      <Paper
        elevation={10}
        sx={{
          padding: 4,
          width: '100%',
          maxWidth: 400,
          borderRadius: 2
        }}
      >
        <Typography variant="h4" component="h1" gutterBottom align="center" fontWeight="bold">
          تسجيل الدخول
        </Typography>
        
        <Typography variant="body2" color="textSecondary" align="center" sx={{ mb: 3 }}>
          أدخل بيانات الدخول للوصول إلى النظام
        </Typography>

        <form onSubmit={handleSubmit}>
          <TextField
            fullWidth
            label="اسم المستخدم"
            name="username"
            value={formData.username}
            onChange={handleChange}
            margin="normal"
            required
          />
          
          <TextField
            fullWidth
            label="كلمة المرور"
            name="password"
            type="password"
            value={formData.password}
            onChange={handleChange}
            margin="normal"
            required
          />

          {error && (
            <Alert severity="error" sx={{ mt: 2 }}>
              {error}
            </Alert>
          )}

          <Button
            type="submit"
            fullWidth
            variant="contained"
            size="large"
            sx={{ mt: 3, mb: 2 }}
          >
            تسجيل الدخول
          </Button>
        </form>

        <Box sx={{ mt: 2, p: 2, bgcolor: 'grey.100', borderRadius: 1 }}>
        </Box>
      </Paper>
    </Box>
  );
};

export default Login;