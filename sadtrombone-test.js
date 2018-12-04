import sadtrombone from './sadtrombone.js'
import {fetchAudioSnapshots} from './mocha-audio-snapshots.js'

const OfflineCtx = window.OfflineAudioContext || window.webkitOfflineAudioContext
const audioCtx = new (window.AudioContext || window.webkitAudioContext)()

describe('Sad Trombone', function () {
  beforeEach(fetchAudioSnapshots(audioCtx))

  it('should render sad trombone', async function () {
    const rendered = await render(1.8, (offlineCtx) => {
      sadtrombone(offlineCtx)
    })

    rendered.should.be.eqlAudio(this.snapshot)
  })
})

/**
 * Render audio output to an "offline buffer"
 *
 * @param {number} length the length of the buffer to capture in seconds
 * @param {function} fn
 * @returns {AudioBuffer} the rendered buffer
 */
async function render (length, fn) {
  const offlineCtx = new OfflineCtx(2, length * 44100, 44100)
  fn(offlineCtx)
  offlineCtx.startRendering()
  // Safari does not have the promise based API for startRendering
  return new Promise(function (resolve) {
    offlineCtx.oncomplete = (e) => {
      resolve(e.renderedBuffer)
    }
  })
}
