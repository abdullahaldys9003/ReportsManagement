

import React, { useState, useMemo, useEffect } from 'react';
import IconButton from '@mui/material/IconButton';
import TextField from '@mui/material/TextField';
import Tooltip from '@mui/material/Tooltip';
import SearchIcon from '@mui/icons-material/Search';
import Stack from '@mui/material/Stack';
import { AppProvider } from '@toolpad/core/AppProvider';
import { DashboardLayout, ThemeSwitcher } from '@toolpad/core/DashboardLayout';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { arEG } from '@mui/material/locale';
import UserDashboard from "./police-department-ui/UserDashboard.jsx";
import AppRoutes from './routes/AppRoutes.tsx';
import NAVIGATION from './navigationConfig.tsx';
import Footer from './Footer';
import Login from './Login';
//import UserDashboard from './police-department-ui/UserDashboard'; // صفحة المستخدم المنفصلة

import { useNavigate } from 'react-router-dom';

// وظيفة التحقق من تسجيل الدخول
const isAuthenticated = () => {
  return !!localStorage.getItem('token');
};

function ToolbarActionsSearch() {
  return (
    <Stack direction="row" alignItems="center">
      <Tooltip title="بحث" enterDelay={1000}>
        <div>
          <IconButton
            type="button"
            aria-label="search"
            sx={{
              display: { xs: 'inline-flex', md: 'none' },
            }}
          >
            <SearchIcon />
          </IconButton>
        </div>
      </Tooltip>
      <TextField
        label="بحث"
        variant="outlined"
        size="small"
        slotProps={{
          input: {
            endAdornment: (
              <IconButton type="button" aria-label="search" size="small">
                <SearchIcon />
              </IconButton>
            ),
            sx: { 
              pr: 0.5,
              textAlign: 'right'
            },
          },
        }}
        sx={{ 
          display: { xs: 'none', md: 'inline-block' }, 
          mr: 1,
          width: '200px'
        }}
      />
      <ThemeSwitcher />
    </Stack>
  );
}

function App() {
  const [session, setSession] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
const navigate = useNavigate();
  // تحميل بيانات الجلسة من localStorage عند التحميل
  useEffect(() => {
    const loadSession = () => {
      if (isAuthenticated()) {
        const userData = localStorage.getItem('user');

        if (userData) {
          const user = JSON.parse(userData);
          setSession({
            user: {
              name: user.name_full || 'مستخدم',
              email: user.email || '',
              image: user.image || '',
            },
          });
        }
      }
      setIsLoading(false);
    };

    loadSession();
  }, []);

  const authentication = useMemo(() => {
    return {
      signIn: (userData) => {
        const user = {
          name: userData.name_full || 'مستخدم',
          email: userData.email || '',
          image: userData.image || '',
        };
        
        setSession({ user });
        localStorage.setItem('user', JSON.stringify(userData));
        localStorage.setItem('token', userData.token || 'demo-token');
      },
      signOut: () => {
        setSession(null);
        localStorage.removeItem('user');
      },
    };
  }, []);

  const theme = useMemo(
    () =>
      createTheme(
        {
          cssVariables: {
            colorSchemeSelector: 'data-toolpad-color-scheme',
          },
          colorSchemes: { light: true, dark: true },
          breakpoints: {
            values: {
              xs: 0,
              sm: 600,
              md: 900,
              lg: 1200,
              xl: 1536,
            },
          },
          direction: 'rtl',
          palette: {
            primary: { main: '#264653' },
            secondary: { main: '#2a9d8f' },
          },
          components: {
            MuiAppBar: {
              styleOverrides: {
                root: {
                  height: '64px',
                  minHeight: '64px',
                },
              },
            },
            MuiToolbar: {
              styleOverrides: {
                root: {
                  minHeight: '64px !important',
                  padding: '0 16px',
                },
              },
            },
            MuiTableCell: {
              styleOverrides: {
                root: {
                  textAlign: "center",
                  border: '0.001px solid white',
                },
              },
            },
            MuiTableHead: {
              styleOverrides: {
                root: {
                  '& th': {
                    textAlign: "center",
                  },
                },
              },
            },
            MuiTable: {
              styleOverrides: {
                root: {
                  borderCollapse: 'collapse',
                },
              },
            },
          },
        },
        arEG
      ),
    []
  );

  // إذا كان يحمل، عرض شاشة تحميل
  if (isLoading) {
    return (
      <ThemeProvider theme={theme}>
        <div style={{ 
          display: 'flex', 
          justifyContent: 'center', 
          alignItems: 'center', 
          height: '100vh' 
        }}>
          <div>جاري التحميل...</div>
        </div>
      </ThemeProvider>
    );
  }

  // إذا لم يكن مسجلاً دخول، عرض صفحة تسجيل الدخول
  if (!session) {
    return (
      <ThemeProvider theme={theme}>
        <Login 
          onLoginSuccess={(userData) => {
            authentication.signIn(userData);
          }} 
        />
      </ThemeProvider>
    );
  }

  // الحصول على بيانات المستخدم
  const userData = JSON.parse(localStorage.getItem('user') || '{}');
         // localStorage.removeItem('user');
  
  // إذا كان المستخدم عادي (user) يعرض صفحة منفصلة بدون القائمة
  if (userData.position_type === 'user') {
    //  navigate('/home');
    return (
      <ThemeProvider theme={theme}>
      <UserDashboard />
      </ThemeProvider>
    );
    
  }

  // إذا كان مدير أو admin يعرض التطبيق الكامل مع القائمة
  return (
    <ThemeProvider theme={theme}>
      <AppProvider 
        navigation={NAVIGATION} 
        branding={{
          logo: '',
          title: '',
        }}
        session={session}
        authentication={authentication} 
      >
        <DashboardLayout 
          slots={{ toolbarActions: ToolbarActionsSearch }}
          sx={{
            '& .MuiAppBar-root': { 
              height: 64,
              minHeight: 64
            },
            '& .MuiToolbar-root': { 
              minHeight: '64px !important'
            }
          }}
        >
          <AppRoutes />
        </DashboardLayout>
        <Footer />
      </AppProvider>
    </ThemeProvider>
  );
}

export default App;
