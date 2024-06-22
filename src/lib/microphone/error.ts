export enum MicrophoneErrorType {
  PermissionDenied = 'PermissionDenied',
  DeviceNotFound = 'DeviceNotFound',
  DeviceNotReadable = 'DeviceNotReadable',
  Security = 'Security',
  Unsupported = 'NotSupported',
  Unexpected = 'Unexpected',
}

export type PermissionDeniedMicrophoneError = Readonly<{
  type: MicrophoneErrorType.PermissionDenied
  cause: DOMException
}>

export type UnsupportedMicrophoneError = Readonly<{
  type: MicrophoneErrorType.Unsupported
}>

export type DeviceNotFound = Readonly<{
  type: MicrophoneErrorType.DeviceNotFound
  cause: DOMException
}>

export type DeviceNotReadable = Readonly<{
  type: MicrophoneErrorType.DeviceNotReadable
  cause: DOMException
}>

export type SecurityMicrophoneError = Readonly<{
  type: MicrophoneErrorType.Security
  cause: DOMException
}>

export type UnexpectedMicrophoneError = Readonly<{
  type: MicrophoneErrorType.Unexpected
  cause: Error
}>

export type MicrophoneError =
  | UnsupportedMicrophoneError
  | PermissionDeniedMicrophoneError
  | DeviceNotFound
  | DeviceNotReadable
  | SecurityMicrophoneError
  | UnexpectedMicrophoneError

/**
 * Handles DOMException errors related to microphone access.
 * Maps each known DOMException name to a corresponding MicrophoneError.
 *
 * @param {DOMException} cause - The DOMException instance.
 * @returns {MicrophoneError} - The mapped MicrophoneError.
 */
function handleMicrophoneDOMException(cause: DOMException): MicrophoneError {
  const { name } = cause
  switch (name) {
    case 'NotAllowedError': {
      return {
        type: MicrophoneErrorType.PermissionDenied,
        cause,
      }
    }
    case 'SecurityError': {
      return {
        type: MicrophoneErrorType.Security,
        cause,
      }
    }
    case 'NotFoundError': {
      return {
        type: MicrophoneErrorType.DeviceNotFound,
        cause,
      }
    }
    case 'AbortError':
    case 'InvalidStateError':
    case 'NotReadableError': {
      return {
        type: MicrophoneErrorType.DeviceNotReadable,
        cause,
      }
    }
    case 'OverconstrainedError':
    case 'TypeError':
    default: {
      return {
        type: MicrophoneErrorType.Unexpected,
        cause,
      }
    }
  }
}

/**
 * Handles unknown errors related to microphone access.
 * Differentiates between DOMException, general Error, and other unknown errors.
 *
 * @param {unknown} cause - The error instance.
 * @returns {MicrophoneError} - The mapped MicrophoneError.
 */
export function handleUnknownMicrophoneError(cause: unknown): MicrophoneError {
  if (cause instanceof DOMException) {
    return handleMicrophoneDOMException(cause)
  }
  if (cause instanceof Error) {
    return {
      type: MicrophoneErrorType.Unexpected,
      cause,
    }
  }
  return {
    type: MicrophoneErrorType.Unexpected,
    cause: new Error('Unexpected Microphone Error!', { cause }),
  }
}
