import {
  getMicrophone,
  Microphone,
  MicrophoneError,
  MicrophoneErrorType,
} from './microphone'

import { Pitch, autocorrelatingPitchDetector } from './audio'

export type { MicrophoneError, Microphone }

export {
  getMicrophone,
  autocorrelatingPitchDetector,
  Pitch,
  MicrophoneErrorType,
}
