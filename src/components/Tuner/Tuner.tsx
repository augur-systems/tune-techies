'use client'

import React, { useCallback, useEffect, useRef, useState } from 'react'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Stack from '@mui/material/Stack'
import Typography from '@mui/material/Typography'
import MicrophoneIcon from '@mui/icons-material/Mic'
import {
  getMicrophone,
  Microphone,
  MicrophoneError,
  MicrophoneErrorType,
} from '@/lib'
import { autocorrelatingPitchDetector } from '@/lib'
import { Result } from '@/core'
import { TuningErrorCard } from './TuningErrorCard'

function getTuningErrorProps(error: MicrophoneError) {
  switch (error.type) {
    case MicrophoneErrorType.Unsupported: {
      return {
        title: 'Unsupported Browser',
        description:
          'Your browser does not support microphone access. Please try using a different browser that supports microphone access.',
        suggestions: [
          'Use the latest version of Google Chrome, Mozilla Firefox, Safari, or Microsoft Edge.',
        ],
      }
    }
    case MicrophoneErrorType.PermissionDenied: {
      return {
        title: 'Permission Denied',
        description:
          'Access to the microphone was denied. Please follow the steps below to allow microphone access:',
        suggestions: [
          'Check your browser settings to ensure microphone access is allowed.',
          'Reload the page and try again.',
          'Ensure no other applications are using the microphone.',
        ],
      }
    }
    case MicrophoneErrorType.DeviceNotFound: {
      return {
        title: 'Microphone Not Found',
        description:
          'No microphone device was found. Please ensure your microphone is connected and recognized by your system:',
        suggestions: [
          'Check if the microphone is properly connected.',
          'Ensure the microphone is not muted.',
          'Check system settings to ensure the microphone is recognized.',
        ],
      }
    }
    case MicrophoneErrorType.DeviceNotReadable: {
      return {
        title: 'Microphone Not Readable',
        description:
          'The microphone device is not readable due to a hardware error. Please try the following solutions:',
        suggestions: [
          'Ensure the microphone is properly connected.',
          'Try using a different microphone.',
          'Restart your computer and try again.',
        ],
      }
    }
    case MicrophoneErrorType.Security: {
      return {
        title: 'Security Error',
        description:
          'Access to the microphone is blocked due to security settings. Please follow the steps below to fix this issue:',
        suggestions: [
          'Ensure your site is served over HTTPS.',
          'Check your browser settings to enable media access.',
          'Disable any browser extensions that might be blocking media access.',
          'Ensure all content on the page is served over HTTPS to avoid mixed content issues.',
        ],
      }
    }
    case MicrophoneErrorType.Unexpected:
    default: {
      return {
        title: 'Unknown Error',
        description:
          'An unexpected error occurred. Please try again or contact support if the issue persists.',
        suggestions: [
          'Reload the page and try again.',
          'If the issue persists, contact support for further assistance.',
        ],
      }
    }
  }
}

type IdleTunerProps = {
  onStart: () => void
}

function IdleTuner({ onStart }: IdleTunerProps) {
  return (
    <Box sx={{ textAlign: 'center', mt: 5 }}>
      <Button variant="contained" color="primary" onClick={onStart}>
        Start Tuner
      </Button>
    </Box>
  )
}

type ActiveTunerProps = {
  note: string
  frequency: number
  deviation: number
}

function ActiveTuner({ note, frequency, deviation }: ActiveTunerProps) {
  return (
    <Stack direction="column" spacing={1}>
      <Typography variant="h2" color="primary">
        {note}
      </Typography>
      <Typography variant="h6" color="secondary">
        {frequency.toFixed(2)} Hz
      </Typography>
      <Stack direction="row" spacing={2}>
        <Typography variant="subtitle2" color="info">
          {deviation.toFixed(2)} Cents
        </Typography>
        <MicrophoneIcon color="success" />
      </Stack>
    </Stack>
  )
}

export function Tuner() {
  const [note, setNote] = useState<string>('A')
  const [frequency, setFrequency] = useState<number>(440)
  const [deviation, setDeviation] = useState<number>(0)
  const [isTuning, setIsTuning] = useState<boolean>(false)
  const [microphoneError, setMicrophoneError] =
    useState<MicrophoneError | null>(null)

  const audioContextRef = useRef<AudioContext | null>(null)
  const analyserRef = useRef<AnalyserNode | null>(null)

  const startTuner = () => {
    const audioContext = new AudioContext()
    audioContextRef.current = audioContext
    const analyser = audioContext.createAnalyser()
    analyserRef.current = analyser

    getMicrophone().then((result: Result<Microphone, MicrophoneError>) => {
      result.peek({
        ok: (microphone: MediaStream) => {
          setIsTuning(true)
          const source = audioContext.createMediaStreamSource(microphone)
          source.connect(analyser)
          analyser.fftSize = 2048
          const bufferLength = analyser.fftSize
          const dataArray = new Float32Array(bufferLength)
          const detector = autocorrelatingPitchDetector(audioContext.sampleRate)
          const detectPitch = () => {
            analyser.getFloatTimeDomainData(dataArray)
            const pitch = detector(dataArray)
            const noteName = pitch.getNoteName()
            const frequency = pitch.getFrequency()
            if (noteName && !Number.isNaN(frequency)) {
              setFrequency(pitch.getFrequency())
              setNote(pitch.getNoteName())
              setDeviation(pitch.getDeviation())
            }

            requestAnimationFrame(detectPitch)
          }

          detectPitch()
        },
        fail: (error: MicrophoneError) => {
          setMicrophoneError(error)
          console.error(error)
        },
      })
    })
  }

  const handleRetry = useCallback(() => {
    if (!isTuning) {
      setMicrophoneError(null)
      setIsTuning(false)
    }
  }, [setMicrophoneError, setIsTuning, isTuning])

  useEffect(() => {
    return () => {
      if (audioContextRef.current) {
        audioContextRef.current.close()
      }
    }
  }, [])

  if (microphoneError) {
    const { title, description, suggestions } =
      getTuningErrorProps(microphoneError)
    return (
      <TuningErrorCard
        title={title}
        description={description}
        suggestions={suggestions}
        onRetry={handleRetry}
      />
    )
  }

  if (!isTuning) {
    return <IdleTuner onStart={startTuner} />
  }

  return <ActiveTuner note={note} frequency={frequency} deviation={deviation} />
}
