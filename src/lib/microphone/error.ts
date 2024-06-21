export enum MicrophoneErrorType {
  Unsupported = 'NotSupported',
  PermissionDenied = 'Permission',
  Unexpected = 'Unexpected',
}

export type UnsupportedMicrophoneError = Readonly<{
  type: MicrophoneErrorType.Unsupported
}>

export type PermissionDeniedMicrophoneError = Readonly<{
  type: MicrophoneErrorType.PermissionDenied
  cause: DOMException
}>

export type UnexpectedMicrophoneError = Readonly<{
  type: MicrophoneErrorType.Unexpected
  cause: unknown
}>

export type MicrophoneError =
  | UnsupportedMicrophoneError
  | PermissionDeniedMicrophoneError
  | UnexpectedMicrophoneError

export function isMicrophoneError(error: unknown): error is MicrophoneError {
  return (
    typeof error === 'object' &&
    error !== null &&
    'type' in error &&
    typeof (error as { type: unknown }).type === 'string'
  )
}
