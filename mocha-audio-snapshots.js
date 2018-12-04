/**
 * Audio snapshot loader hook for Moacha
 *
 * Usage:
 *   beforeEach(fetchAudioSnapshots(new AudioContext()))
 *
 * The audio snapshot is fetched as WAV file under a URL generated from the test
 * name and exposed as an AudioBuffer at this.snapshot.
 *
 * @param {AudioContext} audioCtx
 * @returns {function} the beforeEach hook
 */
export function fetchAudioSnapshots (audioCtx) {
  return async function fetchAudioSnapshots () {
    // Load audio snapshot from an url derived from the test title
    const url = 'snapshots/' + this.currentTest.fullTitle() + '.wav'
    const arrayBuffer = await fetch(url, {credentials: 'same-origin'})
      .then(response => {
        if (response.ok) {
          return response.arrayBuffer()
        } else {
          console.warn(
            `Audio snapshot was not found for "${this.currentTest.fullTitle()}". ` +
            `Make sure there is a WAV file at "${url}"`)
        }
      })

    // Decode the snapshot if available or replace with an empty buffer
    const audioBuffer = arrayBuffer
      ? await decodeAudioData(arrayBuffer)
      : audioCtx.createBuffer(2, 2, 44100)

    this.snapshot = audioBuffer
  }

  // Safari does not have the promise based API for decodeAudioDataxw
  function decodeAudioData (arrayBuffer) {
    return new Promise (function (resolve, reject) {
      audioCtx.decodeAudioData(arrayBuffer, resolve, reject)
    })
  }
}
