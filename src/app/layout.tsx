import '@fontsource/roboto/300.css'
import '@fontsource/roboto/400.css'
import '@fontsource/roboto/500.css'
import '@fontsource/roboto/700.css'

import CssBaseline from '@mui/material/CssBaseline'
import { ThemeProvider } from '@mui/material/styles'

import type { Metadata } from 'next'
import { Inter } from 'next/font/google'

import { ConfigureAmplifyClientSide } from '@/components'
import { theme } from '@/themes'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Tune Techies',
  description: 'Educational resources for music and technology',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <ConfigureAmplifyClientSide />
        <ThemeProvider theme={theme}>
          <CssBaseline />
          {children}
        </ThemeProvider>
      </body>
    </html>
  )
}
