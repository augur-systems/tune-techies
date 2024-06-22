'use client'

import { Roboto } from 'next/font/google'
import { createTheme } from '@mui/material/styles'

const roboto = Roboto({
  weight: ['300', '400', '500', '700'],
  subsets: ['latin'],
  display: 'swap',
})

const theme = createTheme({
  palette: {
    primary: {
      main: '#81A1C1',
    },
    secondary: {
      main: '#D08770',
    },
    success: {
      main: '#A3BE8C',
    },
    warning: {
      main: '#EBCB8B',
    },
    info: {
      main: '#88C0D0',
    },
    error: {
      main: '#BF616A',
    },
    background: {
      default: '#ECEFF4',
    },
  },
  typography: {
    fontFamily: 'Roboto, Arial, sans-serif',
  },
})

export { theme }
