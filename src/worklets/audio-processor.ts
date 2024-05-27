class AudioProcessor extends AudioWorkletProcessor {
  constructor() {
    super()
  }

  process(
    inputs: Float32Array[][],
    outputs: Float32Array[][],
    parameters: Record<string, Float32Array>
  ) {
    const input = inputs[0]
    const output = outputs[0]

    for (let channel = 0; channel < input.length; ++channel) {
      const inputChannel = input[channel]
      const outputChannel = output[channel]

      for (let i = 0; i < inputChannel.length; ++i) {
        outputChannel[i] = inputChannel[i]
      }
    }

    return true
  }
}

registerProcessor('audio-processor', AudioProcessor)
