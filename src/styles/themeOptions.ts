import { ThemeOptions } from '@mui/material/styles';

export const themeOptions: ThemeOptions = {
  palette: {},
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