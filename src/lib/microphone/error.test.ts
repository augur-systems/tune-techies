import {
  MicrophoneErrorType,
  UnexpectedMicrophoneError,
  handleUnknownMicrophoneError,
} from './error'

describe('MicrophoneError', () => {
  describe('handleUnknownMicrophoneError', () => {
    it('should return PermissionDenied error for NotAllowedError', () => {
      const cause = new DOMException('Permission denied', 'NotAllowedError')
      const error = handleUnknownMicrophoneError(cause)
      expect(error).toEqual({
        type: MicrophoneErrorType.PermissionDenied,
        cause,
      })
    })

    it('should return Security error for SecurityError', () => {
      const cause = new DOMException('Security error', 'SecurityError')
      const error = handleUnknownMicrophoneError(cause)
      expect(error).toEqual({
        type: MicrophoneErrorType.Security,
        cause,
      })
    })

    it('should return DeviceNotFound error for NotFoundError', () => {
      const cause = new DOMException('Device not found', 'NotFoundError')
      const error = handleUnknownMicrophoneError(cause)
      expect(error).toEqual({
        type: MicrophoneErrorType.DeviceNotFound,
        cause,
      })
    })

    it('should return DeviceNotReadable error for NotReadableError', () => {
      const cause = new DOMException('Device not readable', 'NotReadableError')
      const error = handleUnknownMicrophoneError(cause)
      expect(error).toEqual({
        type: MicrophoneErrorType.DeviceNotReadable,
        cause,
      })
    })

    it('should return DeviceNotReadable error for AbortError', () => {
      const cause = new DOMException('Operation aborted', 'AbortError')
      const error = handleUnknownMicrophoneError(cause)
      expect(error).toEqual({
        type: MicrophoneErrorType.DeviceNotReadable,
        cause,
      })
    })

    it('should return DeviceNotReadable error for InvalidStateError', () => {
      const cause = new DOMException('Invalid state', 'InvalidStateError')
      const error = handleUnknownMicrophoneError(cause)
      expect(error).toEqual({
        type: MicrophoneErrorType.DeviceNotReadable,
        cause,
      })
    })

    it('should return Unexpected error for OverconstrainedError', () => {
      const cause = new DOMException(
        'Constraints not met',
        'OverconstrainedError'
      )
      const error = handleUnknownMicrophoneError(cause)
      expect(error).toEqual({
        type: MicrophoneErrorType.Unexpected,
        cause,
      })
    })

    it('should return Unexpected error for TypeError', () => {
      const cause = new DOMException('Type error', 'TypeError')
      const error = handleUnknownMicrophoneError(cause)
      expect(error).toEqual({
        type: MicrophoneErrorType.Unexpected,
        cause,
      })
    })

    it('should handle general Error instances', () => {
      const cause = new Error('General error')
      const error = handleUnknownMicrophoneError(cause)
      expect(error).toEqual({
        type: MicrophoneErrorType.Unexpected,
        cause,
      })
    })

    it('should handle unknown errors', () => {
      const cause = 'Unknown error'
      const error = handleUnknownMicrophoneError(
        cause
      ) as UnexpectedMicrophoneError

      expect(error.type).toEqual(MicrophoneErrorType.Unexpected)
      expect(error.cause.message).toEqual('Unexpected Microphone Error!')
      expect(error.cause.cause).toEqual(cause)
    })
  })
})
