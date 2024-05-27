'use client'

import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';

import CssBaseline from '@mui/material/CssBaseline'
import Container from '@mui/material/Container'
import Typography from '@mui/material/Typography'

import { Amplify } from 'aws-amplify'
import outputs from '@/amplify_outputs.json'

Amplify.configure(outputs)

export default function App() {
  return (
    <>
      <CssBaseline />
      <Container>
        <Typography variant='h1'>Tune Techies</Typography>
      </Container>
    </>
  )
}
