'use client'

import React from 'react'
import Box from '@mui/material/Box'

interface GaugeProps {
  deviation: number
}

export function Gauge({ deviation }: GaugeProps) {
  const rotation = deviation * 1.8 // Scale the deviation to fit the gauge
  return (
    <Box
      sx={{
        position: 'relative',
        height: '150px',
        width: '150px',
        margin: '0 auto',
      }}
    >
      <Box
        sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          width: '2px',
          height: '70px',
          backgroundColor: '#000',
          transformOrigin: 'bottom',
          transform: `rotate(${rotation}deg)`,
        }}
      />
      <Box
        sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          width: '150px',
          height: '75px',
          borderRadius: '75px 75px 0 0',
          border: '2px solid #000',
          borderBottom: 'none',
          transform: 'translate(-50%, -100%)',
        }}
      />
    </Box>
  )
}

export default Gauge
