import {
  MicrophoneError,
  MicrophoneErrorType,
  isMicrophoneError,
} from './error'
import { getMicrophone } from './microphone'

export type { MicrophoneError }
export { getMicrophone, isMicrophoneError, MicrophoneErrorType }
