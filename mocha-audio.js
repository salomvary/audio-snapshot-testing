/* global audioBufferToWav saveAs */

export default function mochaAudio (runner) {
  const audioCtx = new (window.AudioContext || window.webkitAudioContext)()

  runner.on('fail', (test) => {
    if (!(test.err.actual instanceof AudioBuffer && test.err.expected instanceof AudioBuffer)) {
      return
    }

    try {
      const testsReportsElements = document.getElementsByClassName('test')
      const testReport = testsReportsElements[testsReportsElements.length - 1]
      const wrapper = document.createElement('li')
      testReport.parentElement.appendChild(wrapper)

      addPlayer(wrapper, {
        title: 'Actual:',
        buffer: test.err.actual,
        fileName: test.fullTitle() + '.wav'
      })

      addPlayer(wrapper, {
        title: 'Expected:',
        buffer: test.err.expected,
        fileName: test.fullTitle() + '.wav'
      })
    } catch (e) {
      // Mocha swallows exceptions
      console.error('Error in audio snapshots reporter', e)
    }
  })

  function addPlayer (parent, {title, buffer, fileName}) {
    const label = document.createElement('span')
    label.textContent = title
    parent.appendChild(label)

    const playButton = document.createElement('button')
    playButton.innerHTML = '▶'
    label.appendChild(playButton)

    const downloadButton = document.createElement('button')
    downloadButton.innerHTML = '⬇︎'
    label.appendChild(downloadButton)

    let source

    function onEnded () {
      playButton.innerHTML = '▶'
      source = null
    }

    playButton.onclick = function () {
      if (source) {
        source.stop()
        source = null
        playButton.innerHTML = '▶'
      } else {
        source = audioCtx.createBufferSource()
        source.buffer = buffer
        source.connect(audioCtx.destination)
        source.start()
        source.onended = onEnded
        playButton.innerHTML = '◼'
      }
    }

    downloadButton.onclick = function () {
      exportWav(buffer, fileName)
    }
  }

  function exportWav (buffer, fileName) {
    const data = audioBufferToWav(buffer)
    const blob = new Blob(
      [new DataView(data)], {
        type: 'audio/wav'
      })
    saveAs(blob, fileName)
  }
}
