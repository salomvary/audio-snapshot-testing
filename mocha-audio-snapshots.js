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
      ? await audioCtx.decodeAudioData(arrayBuffer)
      : audioCtx.createBuffer(2, 2, 44100)

    this.snapshot = audioBuffer
  }
}
