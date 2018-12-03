import sadtrombone from './sadtrombone.js'
import {fetchAudioSnapshots} from './mocha-audio-snapshots.js'

const OfflineCtx = window.OfflineAudioContext || window.webkitOfflineAudioContext
const audioCtx = new (window.AudioContext || window.webkitAudioContext)()

describe('Sad Trombone', function () {
  beforeEach(fetchAudioSnapshots(audioCtx))

  it('should render sad trombone', async function () {
    const offlineCtx = new OfflineCtx(2, 1.8 * 44100, 44100)
    sadtrombone(offlineCtx)
    const rendered = await offlineCtx.startRendering()
    rendered.should.be.eqlAudio(this.snapshot)
  })
})
