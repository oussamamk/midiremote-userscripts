/**
 * @param {MR_DeviceSurface} surface
 * @param {object} context
 * @param {number} note
 * @param {number} x
 * @param {number} y
 * @param {number} w
 * @param {number} h
 * @param {number} idx
 */
function makeButton1(surface, context, note, x, y, w, h, idx) {
    var button = {}
    button.note = note
    button.d = surface.makeButton(x, y, w, h)
    button.d.mSurfaceValue.mMidiBinding
        .setIsConsuming(true)
        .setInputPort(context.midiInput1)
        .bindToNote(0, note)
    button.x = x
    button.y = y
    button.w = w
    button.h = h
    button.idx = idx

    button.d.mSurfaceValue.mOnProcessValueChange = function (activeDevice) {
        var value = button.d.mSurfaceValue.getProcessValue(activeDevice)
        context.midiOutput1.sendMidi(activeDevice, [0x90, this.note, value])
        context.midiOutput3.sendMidi(activeDevice, [0x90, this.note, value])
    }.bind({ context, note })

    return button
}

/**
 * @param {MR_DeviceSurface} surface
 * @param {object} context
 * @param {number} note
 * @param {number} x
 * @param {number} y
 * @param {number} w
 * @param {number} h
 * @param {number} idx
 */
function makeButton2(surface, context, note, x, y, w, h, idx) {
    var button = {}
    button.note = note
    button.d = surface.makeButton(x, y, w, h)
    button.d.mSurfaceValue.mMidiBinding
        .setIsConsuming(true)
        .setInputPort(context.midiInput2)
        .bindToNote(0, note)
    button.x = x
    button.y = y
    button.w = w
    button.h = h
    button.idx = idx

    button.d.mSurfaceValue.mOnProcessValueChange = function (activeDevice) {
        var value = button.d.mSurfaceValue.getProcessValue(activeDevice)
        context.midiOutput2.sendMidi(activeDevice, [0x90, this.note, value])
        context.midiOutput4.sendMidi(activeDevice, [0x90, this.note, value])
    }.bind({ context, note })

    return button
}

/**
 * @param {MR_DeviceDriver} deviceDriver 
 * @param {object} context 
 * @param {number} i 
 * @param {number} cc 
 * @param {number} x 
 * @param {number} y 
 * @param {number} w
 * @param {number} h 
 * @param {number} idx
 */
function makeKnob1(deviceDriver, context, i, cc, x, y, w, h, idx) {
    var knob = {}
    knob.d = deviceDriver.mSurface.makeKnob(x, y, w, h)
    knob.d.mSurfaceValue.mMidiBinding
        .setInputPort(context.midiInput1)
        .setOutputPort(context.midiOutput1)
        .bindToControlChange(0, cc)
        .setTypeRelativeSignedBit()

    knob.idx = idx
    knob.d.mSurfaceValue.mOnProcessValueChange = function (activeDevice, value) {
        var result = Math.round(value * 127)
        context.midiOutput3.sendMidi(activeDevice, [0xb0, this.cc, result])
    }.bind({ context, cc })

    return knob
}

/**
 * @param {MR_DeviceDriver} deviceDriver
 * @param {object} context
 * @param {Number} i    
 * @param {number} x          
 * @param {Number} y          
 * @param {Number} w           
 * @param {Number} h           
 * @param {Number} idx           
 */
function makeFader1(deviceDriver, context, i, x, y, w, h, idx) {
    var fader = {}
    fader.d = deviceDriver.mSurface.makeFader(x, y, w, h).setTypeVertical()
    fader.d.mSurfaceValue.mMidiBinding
        .setInputPort(context.midiInput1)
        .setOutputPort(context.midiOutput1)
        .bindToPitchBend(i)
    fader.idx = idx

    fader.d.mSurfaceValue.mOnProcessValueChange = function (activeDevice, value) {
        var result = Math.round(value * 127)
        context.midiOutput3.sendMidi(activeDevice, [0xE0 + this.i, 0, result])
    }.bind({ context, i })

    return fader
}

/**
 * @param {MR_DeviceDriver} deviceDriver 
 * @param {object} context 
 * @param {number} cc 
 * @param {number} x 
 * @param {number} y 
 * @param {number} w
 * @param {number} h 
 * @param {number} idx
 */
function makeKnob2(deviceDriver, context, cc, x, y, w, h, idx) {
    var knob = {}
    knob.d = deviceDriver.mSurface.makeKnob(x, y, w, h)
    knob.d.mSurfaceValue.mMidiBinding
        .setInputPort(context.midiInput2)
        .setOutputPort(context.midiOutput2)
        .bindToControlChange(0, cc)
        .setTypeAbsolute()

    knob.idx = idx
    knob.d.mSurfaceValue.mOnProcessValueChange = function (activeDevice, value) {
        var result = Math.round(value * 127)
        context.midiOutput4.sendMidi(activeDevice, [0xb0, this.cc, result])
    }.bind({ context, cc })


    return knob
}

/**
 * @param {MR_DeviceDriver} deviceDriver
 * @param {object} context
 * @param {Number} i    
 * @param {number} cc 
 * @param {number} x          
 * @param {Number} y          
 * @param {Number} w           
 * @param {Number} h           
 * @param {Number} idx
 */
function makeFader2(deviceDriver, context, i, cc, x, y, w, h, idx) {
    var fader = {}
    fader.d = deviceDriver.mSurface.makeFader(x, y, w, h).setTypeVertical()
    fader.d.mSurfaceValue.mMidiBinding
        .setInputPort(context.midiInput2)
        .setOutputPort(context.midiOutput2)
        .bindToControlChange(0, cc)
        .setTypeAbsolute()

    fader.idx = idx
    fader.d.mSurfaceValue.mOnProcessValueChange = function (activeDevice, value) {
        var result = Math.round(value * 127)
        context.midiOutput4.sendMidi(activeDevice, [0xb0, this.cc, result])
    }.bind({ context, cc })

    return fader
}

/**
 * @param {MR_FactoryMappingPage} page 
 * @param {object} surfaceObject
 * @param {MR_HostValue} hostValue
 * @param {string} text
 * @returns {MR_ValueBinding}
 */
function makeValueBinding(page, surfaceObject, hostValue, text) {
    var binding = page.makeValueBinding(surfaceObject.d.mSurfaceValue, hostValue)
    surfaceObject.t = text
    return binding
}

/**
 * @param {MR_DeviceDriver} deviceDriver
 * @param {object} context
 * @param {number} i
 */
function makeOneStrip1(deviceDriver, context, i) {
    var wButton = 4
    var hButton = 3
    var wKnob = 5
    var hKnob = 5
    var wFader = 3
    var hFader = (hButton + 1.5) * 4 + 1
    var wStrip = 9

    var x = i * wStrip
    var y = 0

    context.knobs1[i] = makeKnob1(deviceDriver, context, i, 16 + i, x, y + 2, wKnob, hKnob, i + 0)
    context.faders1[i] = makeFader1(deviceDriver, context, i, x + 1, y + 8, wFader, hFader, i + context.numStrips1)
    context.btnsRow1[i] = makeButton1(deviceDriver.mSurface, context, 16 + i, x + 4, y + 9, wButton, hButton, i + context.numStrips1 * 2)
    context.btnsRow2[i] = makeButton1(deviceDriver.mSurface, context, 8 + i, x + 4, y + 9 + (hButton + 1.5), wButton, hButton, i + context.numStrips1 * 3)
    context.btnsRow3[i] = makeButton1(deviceDriver.mSurface, context, 0 + i, x + 4, y + 9 + 2 * (hButton + 1.5), wButton, hButton, i + context.numStrips1 * 4)
    context.btnsRow4[i] = makeButton1(deviceDriver.mSurface, context, 24 + i, x + 4, y + 9 + 3 * (hButton + 1.5), wButton, hButton, i + context.numStrips1 * 5)
}

/**
 * @param {MR_DeviceDriver} deviceDriver
 * @param {object} context
 */
function createSurfaceElements1(deviceDriver, context) {
    for (var i = 0; i < context.numStrips1; i++) {
        makeOneStrip1(deviceDriver, context, i)
    }

    var wButton = 4.2
    var hButton = 2
    var x = 3
    var y = 29
    var spacer = wButton + 2.1
    context.btnStart = makeButton1(deviceDriver.mSurface, context, 0x5E, x, y, wButton, hButton, -1)
    context.btnStop = makeButton1(deviceDriver.mSurface, context, 0x5D, x + spacer, y, wButton, hButton, -1)
    context.btnRecord = makeButton1(deviceDriver.mSurface, context, 0x5F, x + 2 * spacer, y, wButton, hButton, -1)
    context.btnRewind = makeButton1(deviceDriver.mSurface, context, 0x5B, x + 3 * spacer, y, wButton, hButton, -1)
    context.btnForward = makeButton1(deviceDriver.mSurface, context, 0x5C, x + 4 * spacer, y, wButton, hButton, -1)
    context.btnBankPrev = makeButton1(deviceDriver.mSurface, context, 0x2E, x + 5 * spacer, y, wButton, hButton, -1)
    context.btnBankNext = makeButton1(deviceDriver.mSurface, context, 0x2F, x + 6 * spacer, y, wButton, hButton, -1)
    context.btnUp = makeButton1(deviceDriver.mSurface, context, 0x62, x + 7 * spacer, y, wButton, hButton, -1)
    context.btnDown = makeButton1(deviceDriver.mSurface, context, 0x63, x + 8 * spacer, y, wButton, hButton, -1)
    context.btnLeft = makeButton1(deviceDriver.mSurface, context, 0x64, x + 9 * spacer, y, wButton, hButton, -1)
    context.btnRight = makeButton1(deviceDriver.mSurface, context, 0x65, x + 10 * spacer, y, wButton, hButton, -1)
}

/**
 * @param {MR_DeviceDriver} deviceDriver
 * @param {object} context
 * @param {number} i
 */
function makeOneStrip2(deviceDriver, context, i) {
    var wButton = 4
    var hButton = 3
    var wKnob = 5
    var hKnob = 5
    var wFader = 3
    var hFader = (hButton + 1.5) * 4 + 1
    var wStrip = 9

    var x = 90 + i * wStrip
    var y = 0

    context.knobs2[i] = makeKnob2(deviceDriver, context, 10 + i, x, y + 2, wKnob, hKnob, i)
    context.faders2[i] = makeFader2(deviceDriver, context, i, 20 + i, x, y + 8, wFader, hFader, i + context.numStrips2)
    context.btnsL1U[i] = makeButton2(deviceDriver.mSurface, context, i, x - 4, + 9 + 2 * (hButton + 1.5), wButton, hButton, i + context.numStrips2 * 2)
    context.btnsL1L[i] = makeButton2(deviceDriver.mSurface, context, i + 9, x - 4, + 9 + 3 * (hButton + 1.5), wButton, hButton, i + context.numStrips2 * 3)
}

/**
 * @param {MR_DeviceDriver} deviceDriver
 * @param {object} context
 */
function createSurfaceElements2(deviceDriver, context) {
    context.btnControls = {}

    var x = 76
    var y = 2
    var w = 3
    var h = 3

    for (var i = 0; i < 6; i++) {
        if (i === 3) {
            y += 4
            x = 76
        }
        context.btnControls[i] = makeButton2(deviceDriver.mSurface, context, 90 + i, x + (i % 3) * 4, y, w, h, i + context.numStrips2 * 4)
    }

    y = 0
    x = 92
    for (var i = 0; i < context.numStrips2; i++) {
        makeOneStrip2(deviceDriver, context, i)
    }
}

/**
 * @param {MR_DeviceDriver} deviceDriver
 * @param {object} context
 */
function makeSurfaceElements(deviceDriver, context) {
    createSurfaceElements1(deviceDriver, context)
    createSurfaceElements2(deviceDriver, context)
}

module.exports = {
  makeSurfaceElements,
  makeValueBinding
}