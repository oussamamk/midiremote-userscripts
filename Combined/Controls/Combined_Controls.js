
var isSurfaceElementsInitialized = false

var midiremote_api = require('midiremote_api_v1')
var deviceDriver = midiremote_api.makeDeviceDriver('Controls', 'Combined', 'Oussi')
//var deviceDriver2 = midiremote_api.makeDeviceDriver('Controls', 'Combined', 'Oussi')

var midiInput1 = deviceDriver.mPorts.makeMidiInput('SMC-Mixer')
var midiOutput1 = deviceDriver.mPorts.makeMidiOutput('SMC-Mixer')
var midiInput2 = deviceDriver.mPorts.makeMidiInput('iCON iControls V2.05')
var midiOutput2 = deviceDriver.mPorts.makeMidiOutput('iCON iControls V2.05')

var context = {}
context.numStrips1 = 8
context.knobs1 = {}
context.faders1 = {}
context.btnsRow1 = {}
context.btnsRow2 = {}
context.btnsRow3 = {}
context.btnsRow4 = {}
context.transport = {}

context.numStrips2 = 9
context.knobs2 = {}
context.faders2 = {}
context.btnsL1U = {}
context.btnsL1L = {}
context.btnsL2U = {}
context.btnsL2L = {}
context.btnsL3U = {}
context.btnsL3L = {}
context.btnsL4U = {}
context.btnsL4L = {}
context.controls = {}

context.midiInput1 = midiInput1
context.midiOutput1 = midiOutput1
context.midiInput2 = midiInput2
context.midiOutput2 = midiOutput2

context.defaultVariable = deviceDriver.mSurface.makeCustomValueVariable('default')
context.shiftVariable = deviceDriver.mSurface.makeCustomValueVariable('shift')
context.markerVariable = deviceDriver.mSurface.makeCustomValueVariable('marker')
context.zoomVariable = deviceDriver.mSurface.makeCustomValueVariable('zoom')
context.scrubVariable = deviceDriver.mSurface.makeCustomValueVariable('scrub')
context.nudgeVariable = deviceDriver.mSurface.makeCustomValueVariable('nudge')


deviceDriver.mOnActivate = function (activeDevice) {
    console.log('Icontrols - iCON - Activated')
    if (isSurfaceElementsInitialized) {
    }
    activeDevice.setState('lastTime', Date.now().toString())
}

var detectUnit = deviceDriver.makeDetectionUnit()
var uint1Pair = detectUnit.detectPortPair(midiInput1, midiOutput1)
    .expectInputNameEquals('SMC-Mixer')
    .expectOutputNameEquals('SMC-Mixer')

var unit2Pair = detectUnit.detectPortPair(midiInput2, midiOutput2)
    .expectInputNameEquals('iCON iControls V2.05')
    .expectOutputNameEquals('iCON iControls V2.05')

/**
 * 
 * @param {MR_DeviceSurface} surface
 * @param {MR_DeviceMidiInput} midiInput
 * @param {MR_DeviceMidiOutput} midiOutput
 * @param {number} note
 * @param {number} x
 * @param {number} y
 * @param {number} w
 * @param {number} h
 * @param {boolean} isLed
 */
function makeButton(surface, midiInput, midiOutput, note, x, y, w, h, isLed) {
    var button = {}
    button.d = surface.makeButton(x, y, w, h)
    button.note = note
    button.d.mSurfaceValue.mMidiBinding.setIsConsuming(true).setInputPort(midiInput).bindToNote(0, note)

    if (isLed) {
        button.d.mSurfaceValue.mOnProcessValueChange = function (/** @type {MR_ActiveDevice} */activeDevice) {
            var value = button.d.mSurfaceValue.getProcessValue(activeDevice)
            this.midiOutput.sendMidi(activeDevice, [0x90, this.note, value])
        }.bind({ midiOutput, note })
    }
    return button
}


/**
   * 
   * @param {MR_DeviceDriver} deviceDriver 
   * @param {MR_DeviceMidiInput} midiInput 
   * @param {MR_DeviceMidiOutput} midiOutput 
   * @param {number} i 
   * @param {number} cc 
   * @param {number} x 
   * @param {number} y 
   * @param {number} w
   * @param {number} h 
   */
function makeKnob1(deviceDriver, midiInput, midiOutput, i, cc, x, y, w, h) {
    var knob = deviceDriver.mSurface.makeKnob(x, y, w, h)
    knob.mSurfaceValue.mMidiBinding
        .setInputPort(midiInput)
        .setOutputPort(midiOutput)
        .bindToControlChange(0, cc)
        .setTypeRelativeSignedBit()

    return knob
}


/**
 * 
 * @param {MR_DeviceDriver} deviceDriver
 * @param {MR_DeviceMidiInput} midiInput
 * @param {Number} i    
 * @param {number} x          
 * @param {Number} y          
 * @param {Number} w           
 * @param {Number} h           
 */
function makeFader1(deviceDriver, midiInput, midiOutput, i, x, y, w, h) {
  var fader = deviceDriver.mSurface.makeFader(x, y, w, h).setTypeVertical()
  fader.mSurfaceValue.mMidiBinding
    .setInputPort(midiInput)
    .setOutputPort(midiOutput)
    .bindToPitchBend(i)

    return fader
}


/**
   * 
   * @param {MR_DeviceDriver} deviceDriver 
   * @param {MR_DeviceMidiInput} midiInput 
   * @param {MR_DeviceMidiOutput} midiOutput 
   * @param {number} i 
   * @param {number} cc 
   * @param {number} x 
   * @param {number} y 
   * @param {number} w
   * @param {number} h 
   */
function makeKnob2(deviceDriver, midiInput, midiOutput, i, cc, x, y, w, h) {
    var knob = deviceDriver.mSurface.makeKnob(x, y, w, h)
    knob.mSurfaceValue.mMidiBinding
        .setInputPort(midiInput)
        .setOutputPort(midiOutput)
        .bindToControlChange(0, cc)
        .setTypeAbsolute()

    return knob
}


/**
 * 
 * @param {MR_DeviceDriver} deviceDriver
 * @param {MR_DeviceMidiInput} midiInput
 * @param {Number} i    
 * @param {number} cc 
 * @param {number} x          
 * @param {Number} y          
 * @param {Number} w           
 * @param {Number} h           
 */
function makeFader2(deviceDriver, midiInput, midiOutput, i, cc, x, y, w, h) {
  var fader = deviceDriver.mSurface.makeFader(x, y, w, h).setTypeVertical()
  fader.mSurfaceValue.mMidiBinding
    .setInputPort(midiInput)
    .setOutputPort(midiOutput)
    .bindToPitchBend(i)

    return fader
}
function createSurfaceElements1(deviceDriver, context) {
    var midiInput = context.midiInput1
    var midiOutput = context.midiOutput1

    var x = 0
    var y = 0
    var w = 3
    var h = 3

    for (var i = 0; i < context.numStrips1; i++) {
        context.knobs1[i] = makeKnob1(deviceDriver, midiInput, midiOutput, i, 16 + i, x + i * 7, y + 2, 4, 4)
        context.faders1[i] = makeFader1(deviceDriver, midiInput, midiOutput, i, x + i * 7, y + 7, 3, 18)
        context.btnsRow1[i] = makeButton(deviceDriver.mSurface, midiInput, midiOutput, 16 + i, x + i * 7 + 4, y + 10, w, h, true)
        context.btnsRow2[i] = makeButton(deviceDriver.mSurface, midiInput, midiOutput, 8 + i, x + i * 7 + 4, y + 14, w, h, true)
        context.btnsRow3[i] = makeButton(deviceDriver.mSurface, midiInput, midiOutput, 0 + i, x + i * 7 + 4, y + 18, w, h, true)
        context.btnsRow4[i] = makeButton(deviceDriver.mSurface, midiInput, midiOutput, 24 + i, x + i * 7 + 4, y + 22, w, h, true)
    }

    x=1
    h=2
    y=27
    context.btnPlay = makeButton(deviceDriver.mSurface, midiInput, midiOutput, 0x5E, x, y, w, h, true)
    context.btnStop = makeButton(deviceDriver.mSurface, midiInput, midiOutput, 0x5D, x + 5, y, w, h, true)
    context.btnRecord = makeButton(deviceDriver.mSurface, midiInput, midiOutput, 0x5F, x + 10, y, w, h, true)
    context.btnRewind = makeButton(deviceDriver.mSurface, midiInput, midiOutput, 0x5B, x + 15, y, w, h, true)
    context.btnForward = makeButton(deviceDriver.mSurface, midiInput, midiOutput, 0x5C, x + 20, y, w, h, true)
    context.btnBankPrev = makeButton(deviceDriver.mSurface, midiInput, midiOutput, 0x2E, x + 25, y, w, h, true)
    context.btnBankNext = makeButton(deviceDriver.mSurface, midiInput, midiOutput, 0x2F, x + 30, y, w, h, true)
    context.btnUp = makeButton(deviceDriver.mSurface, midiInput, midiOutput, 0x60, x + 35, y, w, h, true)
    context.btnDown = makeButton(deviceDriver.mSurface, midiInput, midiOutput, 0x61, x + 40, y, w, h, true)
    context.btnLeft = makeButton(deviceDriver.mSurface, midiInput, midiOutput, 0x62, x + 45, y, w, h, true)
    context.btnRight = makeButton(deviceDriver.mSurface, midiInput, midiOutput, 0x63, x + 50, y, w, h, true)
}

function createSurfaceElements2(deviceDriver, context) {
    var midiInput = context.midiInput2
    var midiOutput = context.midiOutput2
    context.btnContols = {}

    var x = 62
    var y = 2
    var w = 3
    var h = 3


    for (var i = 0; i < 6; i++) {
        if (i === 3) {
            y += 4
            x = 62
        }
        context.btnContols[i] = makeButton(deviceDriver.mSurface, midiInput, midiOutput, 90 + i, x + (i % 3) * 4, y, w, h, true)
    }


    y = 0
    x = 78
    for (var i = 0; i < context.numStrips2; i++) {
        context.knobs2[i] = makeKnob2(deviceDriver, midiInput, midiOutput, i, 10 + i, x + i * 7, y + 2, 4, 4)
        context.faders1[i] = makeFader2(deviceDriver, midiInput, midiOutput, i, 20 + i, x + i * 7, y + 7, 3, 18)
        context.btnsL1U[i] = makeButton(deviceDriver.mSurface, midiInput, midiOutput, 0 + i, x + i * 7 - 3, y + 10, w, h, true)
        context.btnsL1L[i] = makeButton(deviceDriver.mSurface, midiInput, midiOutput, 9 + i, x + i * 7 - 3, y + 14, w, h, true)
        context.btnsL2U[i] = makeButton(deviceDriver.mSurface, midiInput, midiOutput, 18 + i, x + i * 7 - 3, y + 18, w, h, true)
        context.btnsL2L[i] = makeButton(deviceDriver.mSurface, midiInput, midiOutput, 27 + i, x + i * 7 - 3, y + 22, w, h, true)
        // context.btnsL3U[i] = makeButton(deviceDriver.mSurface, midiInput, midiOutput, 36 + i, x + i * 7 - 3, y + 26, w, h, true)
        // context.btnsL3L[i] = makeButton(deviceDriver.mSurface, midiInput, midiOutput, 45 + i, x + i * 7 - 3, y + 30, w, h, true)
        // context.btnsL4U[i] = makeButton(deviceDriver.mSurface, midiInput, midiOutput, 54 + i, x + i * 7 - 3, y + 34, w, h, true)
        // context.btnsL4L[i] = makeButton(deviceDriver.mSurface, midiInput, midiOutput, 63 + i, x + i * 7 - 3, y + 38, w, h, true)
    }
}


function createSurfaceElements(deviceDriver, context) {
    createSurfaceElements1(deviceDriver, context)
    createSurfaceElements2(deviceDriver, context)
    isSurfaceElementsInitialized = true
}

createSurfaceElements(deviceDriver, context)

var mixerPage = deviceDriver.mMapping.makePage('mixer')
