'use client'

import React, { useEffect, useRef, useState } from 'react';
import { Box, Button, Typography, Grid } from '@mui/material';
import MicrophoneIcon from '@mui/icons-material/Mic';
import Gauge from './Gauge';

const noteStrings = ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"];

const getNote = (frequency: number) => {
  const noteNum = 12 * (Math.log(frequency / 440) / Math.log(2));
  return Math.round(noteNum) + 69;
};

const getNoteString = (note: number) => {
  return noteStrings[note % 12];
};

function getPitch(buffer: Float32Array, sampleRate: number) {
  let SIZE = buffer.length;
  let MAX_SAMPLES = Math.floor(SIZE / 2);
  let bestOffset = -1;
  let bestCorrelation = 0;
  let rms = 0;

  for (let i = 0; i < SIZE; i++) {
    let val = buffer[i];
    rms += val * val;
  }
  rms = Math.sqrt(rms / SIZE);

  if (rms < 0.01) return -1; // Not enough signal

  let correlations = new Array(MAX_SAMPLES);

  for (let offset = 0; offset < MAX_SAMPLES; offset++) {
    let correlation = 0;

    for (let i = 0; i < MAX_SAMPLES; i++) {
      correlation += buffer[i] * buffer[i + offset];
    }
    correlations[offset] = correlation;

    if (correlation > bestCorrelation) {
      bestCorrelation = correlation;
      bestOffset = offset;
    }
  }

  if (bestCorrelation > 0.01) {
    let shift = (correlations[bestOffset + 1] - correlations[bestOffset - 1]) / correlations[bestOffset];
    return sampleRate / (bestOffset + (8 * shift));
  }

  return -1;
}

export function Tuner() {
  const [note, setNote] = useState<string>('A');
  const [frequency, setFrequency] = useState<number>(440);
  const [deviation, setDeviation] = useState<number>(0);
  const [isTuning, setIsTuning] = useState<boolean>(false);

  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);

  const startTuner = () => {
    const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    audioContextRef.current = audioContext;
    const analyser = audioContext.createAnalyser();
    analyserRef.current = analyser;

    navigator.mediaDevices.getUserMedia({ audio: true }).then((stream) => {
      const source = audioContext.createMediaStreamSource(stream);
      source.connect(analyser);
      analyser.fftSize = 2048;
      const bufferLength = analyser.fftSize;
      const dataArray = new Float32Array(bufferLength);

      const detectPitch = () => {
        analyser.getFloatTimeDomainData(dataArray);
        const pitch = getPitch(dataArray, audioContext.sampleRate);
        if (pitch !== -1) {
          const detectedNote = getNoteString(getNote(pitch));
          setFrequency(pitch);
          setNote(detectedNote);
          const deviation = Math.round(1200 * Math.log2(pitch / (440 * Math.pow(2, (getNote(pitch) - 69) / 12))));
          setDeviation(deviation);
        }
        requestAnimationFrame(detectPitch);
      };

      detectPitch();
    });

    setIsTuning(true);
  };

  useEffect(() => {
    return () => {
      if (audioContextRef.current) {
        audioContextRef.current.close();
      }
    };
  }, []);

  return (
    <Box sx={{ textAlign: 'center', mt: 5 }}>
      {!isTuning ? (
        <Button variant="contained" color="primary" onClick={startTuner}>
          Start Tuner
        </Button>
      ) : (
        <>
          <Gauge deviation={deviation} />
          <Typography variant="h1" sx={{ mt: 2, fontWeight: 'bold', color: '#E53935' }}>
            {note}
          </Typography>
          <Typography variant="h4" sx={{ mt: 1, color: '#757575' }}>
            {frequency.toFixed(2)} Hz
          </Typography>
          <MicrophoneIcon sx={{ mt: 2, color: '#E53935', fontSize: '3rem' }} />
          <Grid container justifyContent="center" spacing={2} sx={{ mt: 2 }}>
            <Grid item>
              <Typography variant="h6" sx={{ color: '#757575' }}>
                F
              </Typography>
            </Grid>
            <Grid item>
              <Typography variant="h6" sx={{ color: '#757575' }}>
                F#
              </Typography>
            </Grid>
            <Grid item>
              <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#E53935' }}>
                G
              </Typography>
            </Grid>
            <Grid item>
              <Typography variant="h6" sx={{ color: '#757575' }}>
                G#
              </Typography>
            </Grid>
            <Grid item>
              <Typography variant="h6" sx={{ color: '#757575' }}>
                A
              </Typography>
            </Grid>
          </Grid>
        </>
      )}
    </Box>
  );
};

export default Tuner;

