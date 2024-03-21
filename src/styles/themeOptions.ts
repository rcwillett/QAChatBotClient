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
    },
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
        },
        text: {
          padding: '0px',
          textTransform: 'none',
          lineHeight: '1.5',
          '&:hover': {
            backgroundColor: 'transparent',
            textDecoration: 'underline',
          }
        }
      }
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          borderWidth: '2px',
          padding: '8px',
          whiteSpace: 'pre-line', 
          overflow: 'hidden',
        },
      },
    },
  }
};

export const theme = createTheme(themeOptions);