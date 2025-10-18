import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { CacheProvider } from '@emotion/react';
import createCache from '@emotion/cache';
import { prefixer } from 'stylis';
import rtlPlugin from 'stylis-plugin-rtl';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { BrowserRouter } from 'react-router-dom';
import App from './App.tsx';

// 1. إنشاء كاش RTL مع دعم كامل للخصائص CSS
const cacheRtl = createCache({
  key: 'muirtl',
  stylisPlugins: [prefixer, rtlPlugin],
});

// 2. إنشاء ثيم MUI مع إعدادات RTL
const theme = createTheme({
  direction: 'rtl',
  typography: {
    fontFamily: [
      'Tajawal',
      '-apple-system',
      'BlinkMacSystemFont',
      '"Segoe UI"',
      'Roboto',
      '"Helvetica Neue"',
      'Arial',
      'sans-serif',
    ].join(','),
  },
  components: {
    MuiButton: {
      defaultProps: {
        sx: { fontFamily: 'Tajawal' },
      },
    },
  },
});

// 3. مكون RTL الأساسي
function RTLWrapper({ children }: { children: React.ReactNode }) {
  return (
    <CacheProvider value={cacheRtl}>
      <ThemeProvider theme={theme}>
        <div dir="rtl" style={{ minHeight: '100vh' }}>
          {children}
        </div>
      </ThemeProvider>
    </CacheProvider>
  );
}

// 4. Render التطبيق
createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <RTLWrapper>
        <App />
      </RTLWrapper>
    </BrowserRouter>
  </StrictMode>
);