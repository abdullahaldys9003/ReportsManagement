
import { createTheme } from '@mui/material/styles'; //1-import methoed

const customTheme = createTheme({
  cssVariables: {

    colorSchemeSelector: 'data-toolpad-color-scheme',
  },
  colorSchemes: { light: true, dark: true },

  palette: {
    primary: {
      //لون الروابط والازرار
      main: '#2196f3', // اللون الأزرق الأساسي
    },
    background: {
    default: '#051C34', // لون الخلفية العام (أزرق داكن)
       paper: '#051C34', // لون خلفية الورق (أزرق أفتح)
    },
    text: {
      primary: 'white', // لون النص الرئيسي (أبيض)
      secondary: 'white', // لون النص الثانوي (أبيض)
    },
    action: {
      active: 'white', // لون الأيقونات
      hover: 'rgba(255, 255, 255, 0.7)', // لون الأيقونات عند التمرير
    },
  },
  breakpoints: {
    values: {
      xs: 0,
      sm: 600,
      md: 600,
      lg: 1200,
      xl: 1536,
    },
  },
  components: {
    MuiCard: {
      styleOverrides: {
        root: {
          color: 'white', // لون النص داخل  // زوايا دائرية
        },
      },
    },
  },
});

export default customTheme;



