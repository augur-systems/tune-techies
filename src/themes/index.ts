'use client'

import { Roboto } from 'next/font/google'
import { createTheme, responsiveFontSizes } from '@mui/material/styles'

const roboto = Roboto({
  weight: ['300', '400', '500', '700'],
  subsets: ['latin'],
  display: 'swap',
})

let theme = createTheme({
  palette: {
    primary: {
      main: '#1976D2', // Calming blue
      contrastText: '#FFFFFF',
    },
    secondary: {
      main: '#FF9800', // Warm orange
      contrastText: '#FFFFFF',
    },
    success: {
      main: '#4CAF50', // Vibrant green
      contrastText: '#FFFFFF',
    },
    warning: {
      main: '#FFC107', // Strong yellow
      contrastText: '#FFFFFF',
    },
    info: {
      main: '#00ACC1', // Cool teal
      contrastText: '#FFFFFF',
    },
    error: {
      main: '#D32F2F', // Bold red
      contrastText: '#FFFFFF',
    },
    background: {
      default: '#FFFFFF', // Soft white
      paper: '#F5F5F5', // Very light gray
    },
    text: {
      primary: '#212121', // Dark gray
      secondary: '#757575', // Medium gray
    },
  },
  typography: {
    fontFamily: 'Roboto, Arial, sans-serif',
    h1: {
      fontWeight: 700,
      fontSize: '2.5rem',
      letterSpacing: '-0.01562em',
    },
    h2: {
      fontWeight: 700,
      fontSize: '2rem',
      letterSpacing: '-0.00833em',
    },
    h3: {
      fontWeight: 700,
      fontSize: '1.75rem',
      letterSpacing: '0em',
    },
    h4: {
      fontWeight: 700,
      fontSize: '1.5rem',
      letterSpacing: '0.00735em',
    },
    h5: {
      fontWeight: 700,
      fontSize: '1.25rem',
      letterSpacing: '0em',
    },
    h6: {
      fontWeight: 700,
      fontSize: '1rem',
      letterSpacing: '0.01562em',
    },
    subtitle1: {
      fontSize: '1rem',
      fontWeight: 400,
      letterSpacing: '0.00938em',
    },
    subtitle2: {
      fontSize: '0.875rem',
      fontWeight: 500,
      letterSpacing: '0.00714em',
    },
    body1: {
      fontSize: '1rem',
      fontWeight: 400,
      letterSpacing: '0.03125em',
    },
    body2: {
      fontSize: '0.875rem',
      fontWeight: 400,
      letterSpacing: '0.01786em',
    },
    button: {
      fontSize: '0.875rem',
      fontWeight: 500,
      letterSpacing: '0.02857em',
      textTransform: 'uppercase',
    },
    caption: {
      fontSize: '0.75rem',
      fontWeight: 400,
      letterSpacing: '0.03333em',
    },
    overline: {
      fontSize: '0.75rem',
      fontWeight: 400,
      letterSpacing: '0.08333em',
      textTransform: 'uppercase',
    },
  },
  shape: {
    borderRadius: 8,
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          padding: '16px',
          margin: '16px',
          backgroundColor: '#F5F5F5',
        },
      },
    },
  },
})

theme = responsiveFontSizes(theme)

export { theme }
