// http://fmslogo.sourceforge.net/manual/midi-table.html
(function (context) {
  const state = {
    midi: {},
    inputs: [],
    outputs: []
  }

  const newDeviceEvent = new context.CustomEvent('device', {detail: state})

  // Map: parse devices list
  // params:
  //  list: {Iterator}
  //  callback: {Function}
  // return: Array of devices
  function map (list, callback) {
    const items = []
    let item = list.next()

    while (!item.done) {
      items.push(item.value)
      if (typeof callback === 'function') {
        item.value.onmidimessage = callback
      }
      item = list.next()
    }

    return items
  }

  // Midi Class
  function Midi () {
    // Create a dummy DOM element
    var dummy = document.createTextNode('')

    // Create custom wrappers with nicer names
    this.off = dummy.removeEventListener.bind(dummy)
    this.on = dummy.addEventListener.bind(dummy)

    // Send: Send Midi message
    // params:
    //  device: {string} device id
    //  command: {Array(int)}
    this.send = function (device, command) {
      let active = state.outputs.find(output => output.id === device)
      active.send(command)
    }

    context.navigator.requestMIDIAccess().then(function (MIDIAccess) {
      console.log('Midi Lib 🎹')
      state.midi = MIDIAccess
      MIDIAccess.onstatechange = onNewDevice
      console.warn(state);
      onNewDevice()
    })

    function onNewDevice (newDevice) {
      state.inputs = map(state.midi.inputs.values(), midiMessage)
      state.outputs = map(state.midi.outputs.values())
      dummy.dispatchEvent(newDeviceEvent)
    }

    function midiMessage (message) {
      const data = {
        target: message.currentTarget,
        value: message.data,
        cc: message.data[0] >= 176 && message.data[0] < 192,

        cmd: message.data[0] >> 4,
        channel: message.data[0] & 0xf,
        type: message.data[0] & 0xf0, // channel agnostic message type. Thanks, Phil Burk.
        note: message.data[1],
        velocity: message.data[2]
      }
      const newDeviceEvent = new context.CustomEvent('command', {detail: data})
      dummy.dispatchEvent(newDeviceEvent)
    }
  }

  context.midi = new Midi()
})(window)
