import { ThemeOptions, createTheme } from '@mui/material/styles';

const themeOptions: ThemeOptions = {
  palette: {
    mode: 'dark',
    primary: {
      main: '#3f51b5',
    },
    secondary: {
      main: '#f50057',
    },
  },
  components: {
    MuiInputBase: {
      styleOverrides: {
        input: {
          padding: '6.5px 14px',
        },
      }
    },
    MuiOutlinedInput: {
      styleOverrides: {
        input: {
          padding: '6.5px 14px',
        },
      },
    }
  }
};

export const theme = createTheme(themeOptions);