import { Maybe, Result } from '@/core'
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

function getMediaDevices(): Maybe<MediaDevices> {
  return typeof navigator != 'undefined' && navigator.mediaDevices
    ? Maybe.just(navigator.mediaDevices).filter(
        (devices) => typeof devices.getUserMedia === 'function'
      )
    : Maybe.nothing()
}

function getMediaProvider(devices: MediaDevices): MicrophoneProvider {
  return async (options) =>
    devices
      .getUserMedia({ audio: options })
      .then((stream: Microphone) =>
        Result.ok<Microphone, MicrophoneError>(stream)
      )
      .catch((cause: unknown) =>
        Result.fail(handleUnknownMicrophoneError(cause))
      )
}

function getMicrophoneProvider() {
  return getMediaDevices().handle<MicrophoneProvider>({
    nothing: () => UnsupportedMicrophoneProvider,
    just: (devices: MediaDevices) => getMediaProvider(devices),
  })
}

function getDefaultOptions() {
  return {
    echoCancellation: true,
    noiseSuppression: true,
  }
}

export async function getMicrophone(options?: MicrophoneOptions) {
  return getMicrophoneProvider()(options || getDefaultOptions())
}
