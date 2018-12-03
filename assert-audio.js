export default function assertEqualAudioBuffer (actual, expected, negate) {
  let isEqual = actual.duration === expected.duration &&
    actual.numberOfChannels === expected.numberOfChannels &&
    actual.length === expected.length

  for (
    let channel = 0;
    channel < actual.numberOfChannels && isEqual;
    channel++
  ) {
    isEqual = floatArrayEqual(
      actual.getChannelData(channel),
      expected.getChannelData(channel)
    )
  }

  if (negate ? isEqual : !isEqual) {
    const message = negate
      ? 'expected ' + inspectBuffer(actual) + ' to not be an equal audio buffer to ' + inspectBuffer(expected)
      : 'expected ' + inspectBuffer(actual) + ' to be an equal audio buffer to ' + inspectBuffer(expected)
    const assertionError = new Error(message)
    assertionError.actual = actual
    assertionError.expected = expected
    // When diffs are enabled Mocha turns AudioBuffers into useless strings
    assertionError.showDiff = false
    throw assertionError
  }
}

function inspectBuffer (buffer) {
  return `Buffer(numberOfChannels: ${buffer.numberOfChannels}, duration: ${buffer.duration}, length: ${buffer.length})`
}

// Magic number for how much difference between individual
// samples is tolerated
const sampleTolerance = 10e-2

function floatArrayEqual (a1, a2) {
  const length = a1.length

  if (length !== a2.length) {
    return false
  }
  if (length === 0) {
    return true
  }
  let index = -1
  while (++index < length) {
    if (Math.abs(a1[index] - a2[index]) > sampleTolerance) {
      return false
    }
  }
  return true
}
