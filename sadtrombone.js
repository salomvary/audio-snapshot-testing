export default function sadtrombone (audioContext) {
  const base = 300
  const step = 6/5
  const tempo = 0.3

  const osc = audioContext.createOscillator()
  osc.type = 'sawtooth'
  osc.connect(audioContext.destination)
  osc.start()

  playNote(0, 0)
  playNote(1, 1)
  playNote(2, 2)
  playNote(3, 3)
  stop(6)

  function playNote (note, start) {
    const frequency = base / Math.pow(step, note)
    const time = audioContext.currentTime + start * tempo
    osc.frequency.setValueAtTime(frequency, time)
  }

  function stop (time) {
    osc.stop(audioContext.currentTime + time * tempo)
  }
}

