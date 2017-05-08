/* global midi */

const slide = document.querySelector('#slide')
slide.addEventListener('change', function ({target}) {
  midi.send('-1534782782', [176, 9, target.value])
}, true)

function format (i) {
  return `
    <div>
      <b>${i.id}</b>: ${i.name}
    </div>
  `
}

midi.on('device', function ({detail}) {
  info.innerHTML = `
    <h5>inputs</h5>
    ${detail.inputs.map(format).join('\n ')}
    <h5>outputs</h5>
    ${detail.outputs.map(format).join('\n ')}
  `
})

midi.on('command', function ({detail}) {
  cmd.innerHTML = `
    cmd: ${detail.cmd},
    channel: ${detail.channel},
    type: ${detail.type},
    note: ${detail.note},
    velocity: ${detail.velocity},
  `
})
