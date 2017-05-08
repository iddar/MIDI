# MIDI Mapper

Simple MIDI Mapper

```js
{ // device object
  connection: String,
  id: String,
  manufacturer: String,
  name: String,
  onmidimessage: Function,
  onstatechange: Function,
  state: String,
  type: String,
  version String
}
```

## Methods

For send midi messages use `send` method

```js
midi.send(deviceId, commandArray)
```

## Events

The event `device` is called each adding or removing a MIDI device

```js
midi.on('device', function (event) {
  let state = event.detail
})
```

```js
{ // state object
  "midi": {...}, // raw midi state
  "inputs": [...], // Array of midi input device
  "outputs": [...] // Array of midi output device
}
```

The event `command` is called each MIDI messages

```js
midi.on('command', function (event) {
  let command = event.detail
})
```

```js
{ // command object
  target: {...}, // raw device object
  value: {...}, // raw message object
  cc: Boolean, // true if command is CC

  // midi command parsing
  cmd: Number,
  channel: Number,
  type: Number,
  note: Number,
  velocity: Number
}
```
