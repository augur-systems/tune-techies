import { Result } from '@/core'
import {
  handleUnknownMicrophoneError,
  MicrophoneError,
  MicrophoneErrorType,
} from './error'

export type Microphone = MediaStream

interface MicrophoneOptions {
  readonly deviceId?: string
  readonly echoCancellation?: boolean
  readonly noiseSuppression?: boolean
}

interface MicrophoneProvider {
  (options: MicrophoneOptions): Promise<Result<Microphone, MicrophoneError>>
}

const UnsupportedMicrophoneProvider: MicrophoneProvider = async (
  _: MicrophoneOptions
): Promise<Result<Microphone, MicrophoneError>> => {
  return Result.fail<Microphone, MicrophoneError>({
    type: MicrophoneErrorType.Unsupported,
  })
}

function getMediaDevices(): MediaDevices | undefined {
  return typeof navigator != 'undefined' && navigator.mediaDevices
    ? navigator.mediaDevices
    : undefined
}

function getMicrophoneProvider(): MicrophoneProvider {
  const devices = getMediaDevices()
  if (devices !== undefined && typeof devices.getUserMedia === 'function') {
    return async (options: MicrophoneOptions) => {
      return devices
        .getUserMedia({ audio: true, ...options })
        .then((stream: Microphone) => {
          return Result.ok<Microphone, MicrophoneError>(stream)
        })
        .catch((cause: unknown) => {
          return Result.fail(handleUnknownMicrophoneError(cause))
        })
    }
  }

  return UnsupportedMicrophoneProvider
}

function getDefaultOptions() {
  return {
    echoCancellation: true,
    noiseSuppression: true,
  }
}

export async function getMicrophone(
  options?: MicrophoneOptions
): Promise<Result<Microphone, MicrophoneError>> {
  const provider = getMicrophoneProvider()
  const result = await provider(options || getDefaultOptions())
  return result
}
