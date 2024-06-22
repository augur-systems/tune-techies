/**
 * Audio Signals are represented as Float32Array of sampled audio data.
 */
export type AudioSignal = Float32Array

/**
 * Frequency is a number representing the frequency of a sound wave in Hertz.
 */
export type Frequency = number

/**
 * NoteName is a string representing the name of a musical note.
 */
export type NoteName =
  | 'C'
  | 'C#'
  | 'D'
  | 'D#'
  | 'E'
  | 'F'
  | 'F#'
  | 'G'
  | 'G#'
  | 'A'
  | 'A#'
  | 'B'

/**
 * NoteNames is an array of all possible NoteNames.
 */
export const NoteNames: NoteName[] = [
  'C',
  'C#',
  'D',
  'D#',
  'E',
  'F',
  'F#',
  'G',
  'G#',
  'A',
  'A#',
  'B',
]
