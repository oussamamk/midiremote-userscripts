var helper = require('./helper.js')
var makeLabel = helper.makeLabel
var setTextOfColumn = helper.setTextOfColumn

/**
 * 
 * @param {MR_ActiveDevice} activeDevice 
 */
function clearChannelState(activeDevice) {
  var activePage = activeDevice.getState("activePage")
  activeDevice.setState(activePage + ' - Fader - Titles', "")
  activeDevice.setState(activePage + ' - Fader - ValueTitles', "")
  activeDevice.setState(activePage + ' - Fader - Values', "")
  activeDevice.setState(activePage + ' - Knob - Titles', "")
  activeDevice.setState(activePage + ' - Knob - ValueTitles', "")
  activeDevice.setState(activePage + ' - Knob - Values', "")

  activeDevice.setState("displayType", "Knob")
}

/**
 * 
 * @param {string} idRow1 
 * @param {string} idRow2 
 * @param {string} idAltRow1 
 * @param {string} idAltRow2 
 * @param {MR_ActiveDevice} activeDevice 
 * @param {MR_DeviceMidiOutput} midiOutput 
 */
function updateDisplay(idRow1, idRow2, idAltRow1, idAltRow2, activeDevice, midiOutput) {
  function _sendDisplayData(row, text, activeDevice, midiOutput) {
    var lenText = text.length < 56 ? text.length : 56
    var data = [0xf0, 0x00, 0x00, 0x66, 0x14, 0x12]
    var out = data.concat(56 * row)

    for (var i = 0; i < lenText; i++)
      out.push(text.charCodeAt(i))
    while (lenText++ < 56)
      out.push(0x20)
    out.push(0xf7)
    midiOutput.sendMidi(activeDevice, out)
  }

  activeDevice.setState('Display - idRow1', idRow1)
  activeDevice.setState('Display - idRow2', idRow2)
  activeDevice.setState('Display - idAltRow1', idAltRow1)
  activeDevice.setState('Display - idAltRow2', idAltRow2)

  var row1 = activeDevice.getState(idRow1)
  var row2 = activeDevice.getState(idRow2)
  var altRow1 = activeDevice.getState(idAltRow1)
  var altRow2 = activeDevice.getState(idAltRow2)

  var displayType = activeDevice.getState("displayType")

  switch (displayType) {
    case "Knob":
      _sendDisplayData(1, altRow1, activeDevice, midiOutput)
      _sendDisplayData(0, altRow2, activeDevice, midiOutput)
      break
    case "Knob-Fader":
      _sendDisplayData(1, row1, activeDevice, midiOutput)
      _sendDisplayData(0, altRow2, activeDevice, midiOutput)
      break
    default:
      _sendDisplayData(1, row1, activeDevice, midiOutput)
      _sendDisplayData(0, row2, activeDevice, midiOutput)
      break
  }
}

/**
 * 
 * @param {MR_DeviceSurface} surface
 * @param {MR_DeviceMidiInput} midiInput
 * @param {number} note
 * @param {number} x
 * @param {number} y
 * @param {number} w
 * @param {number} h
 */
function makeButton(surface, midiInput, note, x, y, w, h) {
  var button = surface.makeButton(x, y, w, h)
  button.mSurfaceValue.mMidiBinding.setIsConsuming(true).setInputPort(midiInput).bindToNote(0, note)
  return button
}

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
 */
function makeLedButton(surface, midiInput, midiOutput, note, x, y, w, h) {
  var ledButton = {}
  ledButton.devButton = surface.makeButton(x, y, w, h)
  ledButton.note = note
  ledButton.devButton.mSurfaceValue.mMidiBinding.setIsConsuming(true).setInputPort(midiInput).bindToNote(0, note)

  ledButton.devButton.mSurfaceValue.mOnProcessValueChange = function (/** @type {MR_ActiveDevice} */activeDevice) {
    var value = ledButton.devButton.mSurfaceValue.getProcessValue(activeDevice)
    this.midiOutput.sendMidi(activeDevice, [0x90, this.note, value])
  }.bind({ midiOutput, note })
  return ledButton
}

/**
 * 
 * @param {MR_ActiveDevice} activeDevice
 * @param {MR_DeviceMidiOutput} midiOutput
 * @param {object} surfaceElements
 */
function clearAllLeds(activeDevice, midiOutput, surfaceElements) {
  for (var i = 0; i < surfaceElements.numStrips; i++) {
    midiOutput.sendMidi(activeDevice, [0x90, surfaceElements.btnsRow0[i].note, 0])
    midiOutput.sendMidi(activeDevice, [0x90, surfaceElements.btnsRow1[i].note, 0])
    midiOutput.sendMidi(activeDevice, [0x90, surfaceElements.btnsRow2[i].note, 0])
    midiOutput.sendMidi(activeDevice, [0x90, surfaceElements.btnsRow3[i].note, 0])
    midiOutput.sendMidi(activeDevice, [0x90, surfaceElements.btnsRow4[i].note, 0])
  }
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
 * @param {number} h 
 * @param {number} w 
 */
function makeKnob(deviceDriver, midiInput, midiOutput, i, cc, x, y, h, w) {
  var knob = deviceDriver.mSurface.makeKnob(x, y, h, w)
  knob.mSurfaceValue.mMidiBinding
    .setInputPort(midiInput)
    .bindToControlChange(0, cc)
    .setTypeRelativeSignedBit()

  knob.mSurfaceValue.mOnTitleChange = function (activeDevice, objectTitle, valueTitle) {
    //console.log("Knob Title Changed:" + objectTitle + ":" + valueTitle)
    var activePage = activeDevice.getState("activePage")

    var knobTitles = activeDevice.getState(activePage + ' - Knob - Titles')
    var knobValueTitles = activeDevice.getState(activePage + ' - Knob - ValueTitles')

    activeDevice.setState(activePage + ' - Knob - Titles', setTextOfColumn(this.i, makeLabel(objectTitle, 6), knobTitles))
    activeDevice.setState(activePage + ' - Knob - ValueTitles', setTextOfColumn(this.i, makeLabel(valueTitle, 6), knobValueTitles))
    updateDisplay(activePage + ' - Fader - Titles', activePage + ' - Fader - Values', activePage + ' - Knob - ValueTitles', activePage + ' - Knob - Values', activeDevice, midiOutput)
  }.bind({ midiOutput, i })

  knob.mSurfaceValue.mOnDisplayValueChange = function (activeDevice, value, units) {
    var activePage = activeDevice.getState("activePage")
    var knobValues = activeDevice.getState(activePage + ' - Knob - Values')

    activeDevice.setState(activePage + ' - Knob - Values', setTextOfColumn(this.i, makeLabel(value, 6), knobValues))
    updateDisplay(activeDevice.getState('Display - idRow1'), activeDevice.getState('Display - idRow2'), activeDevice.getState('Display - idAltRow1'), activePage + ' - Knob - Values', activeDevice, midiOutput)
  }.bind({ midiOutput, i })

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
function makeFader(deviceDriver, midiInput, midiOutput, i, x, y, w, h) {
  var fader = deviceDriver.mSurface.makeFader(x, y, w, h).setTypeVertical()
  fader.mSurfaceValue.mMidiBinding
    .setInputPort(midiInput)
    .setOutputPort(midiOutput)
    .bindToPitchBend(i)

  fader.mSurfaceValue.mOnTitleChange = function (activeDevice, objectTitle, valueTitle) {
    var activePage = activeDevice.getState("activePage")
    var faderTitles = activeDevice.getState(activePage + ' - Fader - Titles')
    var faderValueTitles = activeDevice.getState(activePage + ' - Fader - ValueTitles')
    activeDevice.setState(activePage + ' - Fader - Titles', setTextOfColumn(this.i, makeLabel(objectTitle, 6), faderTitles))
    activeDevice.setState(activePage + ' - Fader - ValueTitles', setTextOfColumn(this.i, makeLabel(valueTitle, 6), faderValueTitles))
    updateDisplay(activePage + ' - Fader - Titles', activePage + ' - Fader - Values', activePage + ' - Knob - ValueTitles', activePage + ' - Knob - Values', activeDevice, this.midiOutput)
  }.bind({ i, midiOutput })

  fader.mSurfaceValue.mOnDisplayValueChange = function (activeDevice, value, units) {
    var activePage = activeDevice.getState("activePage")
    var faderValues = activeDevice.getState(activePage + ' - Fader - Values')

    activeDevice.setState(activePage + ' - Fader - Values', setTextOfColumn(this.i, makeLabel(value, 6), faderValues))
    updateDisplay(activeDevice.getState('Display - idRow1'), activePage + ' - Fader - Values', activeDevice.getState('Display - idAltRow1'), activeDevice.getState('Display - idAltRow2'), activeDevice, midiOutput)
  }.bind({ midiOutput, i })
  return fader
}

/**
 * 
 * @param {MR_SurfaceElementValue} knob
 * @param {MR_SurfaceCustomValueVariable} commandIncrease
 * @param {MR_SurfaceCustomValueVariable} commandDecrease
 */
function bindCommandKnob(knob, commandIncrease, commandDecrease) {
  // console.log('from script: createCommandKnob')
  knob.mOnProcessValueChange = function (activeDevice, value) {
    // console.log('value changed: ' + value)
    if (value < 0.5) {
      commandIncrease.setProcessValue(activeDevice, 1);
    } else if (value > 0.5) {
      commandDecrease.setProcessValue(activeDevice, 1);
    }
  }
}

/**
 * 
 * @param {MR_DeviceDriver} deviceDriver 
 * @param {MR_DeviceMidiInput} midiInput 
 * @param {MR_DeviceMidiOutput} midiOutput 
 * @returns 
 */
function makeSurfaceElements(deviceDriver, midiInput, midiOutput) {
  var surfaceElements = {}
  surfaceElements.d2Display = deviceDriver.mSurface.makeBlindPanel(0, 0, 56, 6)
  surfaceElements.numStrips = 8
  surfaceElements.channelControls = {}
  surfaceElements.knobs = {}
  surfaceElements.faders = {}
  surfaceElements.btnsRow0 = {}
  surfaceElements.btnsRow1 = {}
  surfaceElements.btnsRow2 = {}
  surfaceElements.btnsRow3 = {}
  surfaceElements.btnsRow4 = {}

  var x = 0
  var y = 5
  var w = 3
  var h = 3

  for (var i = 0; i < surfaceElements.numStrips; i++) {
    surfaceElements.knobs[i] = makeKnob(deviceDriver, midiInput, midiOutput, i, 16 + i, x + i * 7, y + 2, 4, 4)
    surfaceElements.faders[i] = makeFader(deviceDriver, midiInput, midiOutput, i, x + i * 7, y + 7, 3, 18)
    surfaceElements.btnsRow1[i] = makeLedButton(deviceDriver.mSurface, midiInput, midiOutput, 0 + i, x + i * 7 + 4, y + 13, w, h)
    surfaceElements.btnsRow2[i] = makeLedButton(deviceDriver.mSurface, midiInput, midiOutput, 8 + i, x + i * 7 + 4, y + 16, w, h)
    surfaceElements.btnsRow3[i] = makeLedButton(deviceDriver.mSurface, midiInput, midiOutput, 16 + i, x + i * 7 + 4, y + 19, w, h)
    surfaceElements.btnsRow4[i] = makeLedButton(deviceDriver.mSurface, midiInput, midiOutput, 24 + i, x + i * 7 + 4, y + 22, w, h)
  }

  x = 63
  y = 4

  for (var i = 0; i < surfaceElements.numStrips; i++) {
    surfaceElements.btnsRow0[i] = makeLedButton(deviceDriver.mSurface, midiInput, midiOutput, 32 + i, x + 3 * i, y, w, h)
  }

  surfaceElements.btnRewind = makeButton(deviceDriver.mSurface, midiInput, 91, x + 3, y + 6, w, h)
  surfaceElements.btnForward = makeButton(deviceDriver.mSurface, midiInput, 92, x + 6, y + 6, w, h)

  surfaceElements.btnRecord = makeButton(deviceDriver.mSurface, midiInput, 95, x, y + 9, w, h)
  surfaceElements.btnStop = makeButton(deviceDriver.mSurface, midiInput, 93, x + 3, y + 9, w, h)
  surfaceElements.btnStart = makeButton(deviceDriver.mSurface, midiInput, 94, x + 6, y + 9, w, h)

  surfaceElements.defaultVariable = deviceDriver.mSurface.makeCustomValueVariable('default')
  surfaceElements.shiftVariable = deviceDriver.mSurface.makeCustomValueVariable('shift')
  surfaceElements.wheelLeftVariable = deviceDriver.mSurface.makeCustomValueVariable('wheelLeft')
  surfaceElements.wheelRightVariable = deviceDriver.mSurface.makeCustomValueVariable('wheelRight')

  surfaceElements.btnCycle = makeButton(deviceDriver.mSurface, midiInput, 86, x + 3, y + 12, w, h)

  surfaceElements.wheel = deviceDriver.mSurface.makeKnob(x, y + 17, 6, 6)
  surfaceElements.wheel.mSurfaceValue.mMidiBinding
    .setInputPort(midiInput)
    .setIsConsuming(true)
    .bindToControlChange(0, 60)
    .setTypeAbsolute()

  bindCommandKnob(surfaceElements.wheel.mSurfaceValue, surfaceElements.wheelRightVariable, surfaceElements.wheelLeftVariable)

  surfaceElements.btnLeft = makeButton(deviceDriver.mSurface, midiInput, 98, x + 6, y + 15, w, h)
  surfaceElements.btnRight = makeButton(deviceDriver.mSurface, midiInput, 99, x + 9, y + 15, w, h)
  surfaceElements.btnDown = makeButton(deviceDriver.mSurface, midiInput, 97, x + 6, y + 18, w, h)
  surfaceElements.btnUp = makeButton(deviceDriver.mSurface, midiInput, 96, x + 9, y + 18, w, h)

  surfaceElements.btnPageUp = makeButton(deviceDriver.mSurface, midiInput, 41, x + 1, y + 23, w, h)
  surfaceElements.btnPlugIn = makeButton(deviceDriver.mSurface, midiInput, 43, x + 4, y + 23, w, h)
  surfaceElements.btnDynamic = makeButton(deviceDriver.mSurface, midiInput, 45, x + 7, y + 23, w, h)

  surfaceElements.btnPageDown = makeButton(deviceDriver.mSurface, midiInput, 40, x, y + 26, w, h)
  surfaceElements.btnPan = makeButton(deviceDriver.mSurface, midiInput, 42, x + 3, y + 26, w, h)
  surfaceElements.btnEQ = makeButton(deviceDriver.mSurface, midiInput, 44, x + 6, y + 26, w, h)
  surfaceElements.btnBankPrev = makeButton(deviceDriver.mSurface, midiInput, 46, x + 9, y + 26, w, h)
  surfaceElements.btnBankNext = makeButton(deviceDriver.mSurface, midiInput, 47, x + 12, y + 26, w, h)
  surfaceElements.btnShift = makeButton(deviceDriver.mSurface, midiInput, 83, x + 15, y + 26, w, h)

  return surfaceElements
}

module.exports = {
  makeSurfaceElements,
  clearAllLeds,
  updateDisplay,
  clearChannelState
}