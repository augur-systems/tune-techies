import { MicrophoneError, MicrophoneErrorType } from './error'

type Microphone = MediaStream | MicrophoneError

interface MicrophoneOptions {
  readonly deviceId?: string
  readonly echoCancellation?: boolean
  readonly noiseSuppression?: boolean
}

interface MicrophoneProvider {
  (options: MicrophoneOptions): Promise<Microphone>
}

const UnsupportedMicrophoneProvider: MicrophoneProvider = async () => {
  return { type: MicrophoneErrorType.Unsupported }
}

function getMediaDevices(): MediaDevices | undefined {
  return typeof navigator != 'undefined' && navigator.mediaDevices
    ? navigator.mediaDevices
    : undefined
}

function getMicrophoneProvider(): MicrophoneProvider {
  const devices = getMediaDevices()
  if (devices !== undefined && typeof devices.getUserMedia === 'function') {
    return async (options) =>
      devices
        .getUserMedia({ audio: true, ...options })
        .catch((cause: DOMException) => {
          const { name, message } = cause
          switch (name) {
            case 'NotAllowedError':
            case 'SecurityError': {
              return { type: MicrophoneErrorType.PermissionDenied, cause }
            }
            case 'NotFoundError':
            case 'NotReadableError':
            case 'OverconstrainedError':
            case 'AbortError':
            case 'TypeError':
            case 'InvalidStateError':
            default: {
              return {
                type: MicrophoneErrorType.Unexpected,
                message: `Unexpected Microphone Error: name: ${name}: message: ${message}`,
                cause,
              }
            }
          }
        })
  }

  return UnsupportedMicrophoneProvider
}

function getDefaultOptions() {
  return {
    echoCancellation: true,
    noiseSuppression: true,
  }
}

export function getMicrophone(
  options?: MicrophoneOptions
): Promise<Microphone> {
  return getMicrophoneProvider()(options || getDefaultOptions())
}
