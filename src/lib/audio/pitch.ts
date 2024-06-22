import { AudioSignal, NoteName, NoteNames } from './types'

export class Pitch {
  readonly #midiNoteNumber: number

  constructor(private readonly frequency: number) {
    this.#midiNoteNumber = Pitch.getMIDINoteNumber(frequency)
  }

  getFrequency(): number {
    return Math.round((this.frequency + Number.EPSILON) * 100) / 100
  }

  getNoteName(): NoteName {
    return NoteNames[this.#midiNoteNumber % 12]
  }

  getOctave(): number {
    return Math.floor(this.#midiNoteNumber / 12 - 1)
  }

  getDeviation(): number {
    const midi = this.#midiNoteNumber
    const base = this.getFrequencyFromMIDINoteNumber(midi)
    return Math.floor((1200 * Math.log(this.frequency / base)) / Math.log(2))
  }

  toString(): string {
    return `${this.getNoteName()}: ${this.getOctave()} (${this.getFrequency()} Hz)`
  }

  private static getMIDINoteNumber(frequency: number): number {
    return Math.round(12 * (Math.log(frequency / 440) / Math.log(2))) + 69
  }

  private getFrequencyFromMIDINoteNumber(note: number): number {
    return 440 * Math.pow(2, (note - 69) / 12)
  }
}

const rxx = (lag: number, N: number, audioSignal: Float32Array) => {
  var sum = 0
  for (var n = 0; n <= N - lag - 1; n++) {
    sum += audioSignal[n] * audioSignal[n + lag]
  }
  return sum
}

const autocorrelationWithLag = (signal: AudioSignal) => {
  let autocorrelation = []
  let rms = 0 //https://en.wikipedia.org/wiki/Root_mean_square

  for (var lag = 0; lag < signal.length; lag++) {
    autocorrelation[lag] = rxx(lag, signal.length, signal)
    rms += autocorrelation[lag] * autocorrelation[lag]
  }

  rms = Math.sqrt(rms / signal.length)

  if (rms < 0.05) {
    return []
  }
  return autocorrelation
}

const normalize = (data: number[]) => {
  var maxAbsX = Math.abs(Math.max(...data))
  return data.map((x) => x / maxAbsX)
}

export interface PitchDetector {
  (signal: AudioSignal): Pitch
}

export function autocorrelatingPitchDetector(
  sampleRate: number
): PitchDetector {
  return (signal: AudioSignal): Pitch => {
    const correlatedValues = normalize(autocorrelationWithLag(signal))
    const N = correlatedValues.length
    let largestPeakValue = 0
    let largestPeakIndex = -1

    for (let index = 1; index < N; index++) {
      const prev = correlatedValues[index - 1]
      const current = correlatedValues[index]
      const next = correlatedValues[index + 1]

      const isPeak = prev < current && next < current
      if (isPeak) {
        if (current > largestPeakValue) {
          largestPeakValue = current
          largestPeakIndex = index
        }
      }
    }

    const fundamentalFrequency = sampleRate / largestPeakIndex
    return new Pitch(fundamentalFrequency)
  }
}
