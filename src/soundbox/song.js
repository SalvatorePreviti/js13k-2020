/* eslint-disable */
// STOLEN from https://sb.bitsnbites.eu/ (It's the Space Dist demo by m @ Bits'n'Bites)

// Song data
const song = {
  songData: [
    {
      // Instrument 0
      i: [
        0, // OSC1_WAVEFORM
        0, // OSC1_VOL
        140, // OSC1_SEMI
        0, // OSC1_XENV
        0, // OSC2_WAVEFORM
        0, // OSC2_VOL
        140, // OSC2_SEMI
        0, // OSC2_DETUNE
        0, // OSC2_XENV
        255, // NOISE_VOL
        158, // ENV_ATTACK
        158, // ENV_SUSTAIN
        158, // ENV_RELEASE
        0, // ARP_CHORD
        0, // ARP_SPEED
        0, // LFO_WAVEFORM
        51, // LFO_AMT
        2, // LFO_FREQ
        1, // LFO_FX_FREQ
        2, // FX_FILTER
        58, // FX_FREQ
        239, // FX_RESONANCE
        0, // FX_DIST
        32, // FX_DRIVE
        88, // FX_PAN_AMT
        1, // FX_PAN_FREQ
        157, // FX_DELAY_AMT
        2 // FX_DELAY_TIME
      ],
      // Patterns
      p: [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
      // Columns
      c: [{ n: [146], f: [] }]
    },
    {
      // Instrument 1
      i: [
        1, // OSC1_WAVEFORM
        23, // OSC1_VOL
        128, // OSC1_SEMI
        0, // OSC1_XENV
        1, // OSC2_WAVEFORM
        28, // OSC2_VOL
        116, // OSC2_SEMI
        9, // OSC2_DETUNE
        0, // OSC2_XENV
        0, // NOISE_VOL
        57, // ENV_ATTACK
        22, // ENV_SUSTAIN
        56, // ENV_RELEASE
        0, // ARP_CHORD
        0, // ARP_SPEED
        0, // LFO_WAVEFORM
        48, // LFO_AMT
        3, // LFO_FREQ
        1, // LFO_FX_FREQ
        1, // FX_FILTER
        2, // FX_FREQ
        51, // FX_RESONANCE
        0, // FX_DIST
        32, // FX_DRIVE
        77, // FX_PAN_AMT
        6, // FX_PAN_FREQ
        25, // FX_DELAY_AMT
        6 // FX_DELAY_TIME
      ],
      // Patterns
      p: [, , , , 1, 2, 1, 2, 3, 3, 3, 3, 3],
      // Columns
      c: [
        { n: [127, , , , , , , , , , , , , , , , 135], f: [] },
        { n: [127, , , , , , , , , , , , , , , , 140], f: [] },
        { n: [127, , , , , , , , 135, , , , , , , , 127, , , , , , , , 140], f: [] }
      ]
    },
    {
      // Instrument 2
      i: [
        0, // OSC1_WAVEFORM
        147, // OSC1_VOL
        116, // OSC1_SEMI
        1, // OSC1_XENV
        0, // OSC2_WAVEFORM
        158, // OSC2_VOL
        116, // OSC2_SEMI
        0, // OSC2_DETUNE
        1, // OSC2_XENV
        0, // NOISE_VOL
        4, // ENV_ATTACK
        6, // ENV_SUSTAIN
        35, // ENV_RELEASE
        0, // ARP_CHORD
        0, // ARP_SPEED
        0, // LFO_WAVEFORM
        0, // LFO_AMT
        0, // LFO_FREQ
        0, // LFO_FX_FREQ
        2, // FX_FILTER
        14, // FX_FREQ
        0, // FX_RESONANCE
        0, // FX_DIST
        32, // FX_DRIVE
        0, // FX_PAN_AMT
        0, // FX_PAN_FREQ
        0, // FX_DELAY_AMT
        0 // FX_DELAY_TIME
      ],
      // Patterns
      p: [, , , , , , , 1, 35, 35, 35, 35, 35],
      // Columns
      c: [
        { n: [, , , , , , , , , , , , , , , , , , , , , , , , , , , , 144, 144, 144, 144], f: [] },
        { n: [], f: [] },
        { n: [], f: [] },
        { n: [], f: [] },
        { n: [], f: [] },
        { n: [], f: [] },
        { n: [], f: [] },
        { n: [], f: [] },
        { n: [], f: [] },
        { n: [], f: [] },
        { n: [], f: [] },
        { n: [], f: [] },
        { n: [], f: [] },
        { n: [], f: [] },
        { n: [], f: [] },
        { n: [], f: [] },
        { n: [], f: [] },
        { n: [], f: [] },
        { n: [], f: [] },
        { n: [], f: [] },
        { n: [], f: [] },
        { n: [], f: [] },
        { n: [], f: [] },
        { n: [], f: [] },
        { n: [], f: [] },
        { n: [], f: [] },
        { n: [], f: [] },
        { n: [], f: [] },
        { n: [], f: [] },
        { n: [], f: [] },
        { n: [], f: [] },
        { n: [], f: [] },
        { n: [], f: [] },
        { n: [], f: [] },
        { n: [144, , , , 144, , , , 144, , , , 144, , , , 144, , , , 144, , , , 144, , , , 144], f: [] }
      ]
    },
    {
      // Instrument 3
      i: [
        1, // OSC1_WAVEFORM
        0, // OSC1_VOL
        128, // OSC1_SEMI
        0, // OSC1_XENV
        1, // OSC2_WAVEFORM
        0, // OSC2_VOL
        128, // OSC2_SEMI
        0, // OSC2_DETUNE
        0, // OSC2_XENV
        255, // NOISE_VOL
        158, // ENV_ATTACK
        100, // ENV_SUSTAIN
        158, // ENV_RELEASE
        0, // ARP_CHORD
        0, // ARP_SPEED
        3, // LFO_WAVEFORM
        67, // LFO_AMT
        4, // LFO_FREQ
        1, // LFO_FX_FREQ
        3, // FX_FILTER
        57, // FX_FREQ
        254, // FX_RESONANCE
        85, // FX_DIST
        171, // FX_DRIVE
        88, // FX_PAN_AMT
        1, // FX_PAN_FREQ
        157, // FX_DELAY_AMT
        2 // FX_DELAY_TIME
      ],
      // Patterns
      p: [, , , , , , , , , 1, , 1],
      // Columns
      c: [{ n: [134], f: [] }]
    }
  ],
  rowLen: 5513, // In sample lengths
  patternLen: 32, // Rows per pattern
  endPattern: 12, // End pattern
  numChannels: 4 // Number of channels
}

export { song }
