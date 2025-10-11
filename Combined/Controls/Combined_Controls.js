
var isSurfaceElementsInitialized = false
var isZoom = false
var isMarker = false
var isNudge = false
var isScrub = false
var isShift = false

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
detectUnit.detectPortPair(midiInput1, midiOutput1)
    .expectInputNameEquals('SMC-Mixer')
    .expectOutputNameEquals('SMC-Mixer')

detectUnit.detectPortPair(midiInput2, midiOutput2)
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
        .bindToControlChange(0, cc)
        .setTypeAbsolute()

    return fader
}

/**
 * 
 * @param {MR_DeviceDriver} deviceDriver
 * @param {object} context
 */
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

    x = 1
    h = 2
    y = 27
    context.btnStart = makeButton(deviceDriver.mSurface, midiInput, midiOutput, 0x5E, x, y, w, h, true)
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

/**
 * 
 * @param {MR_DeviceDriver} deviceDriver
 * @param {object} context
 */
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
        context.faders2[i] = makeFader2(deviceDriver, midiInput, midiOutput, i, 20 + i, x + i * 7, y + 7, 3, 18)
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

/**
 * 
 * @param {MR_DeviceDriver} deviceDriver
 * @param {object} context
 */
function createSurfaceElements(deviceDriver, context) {
    createSurfaceElements1(deviceDriver, context)
    createSurfaceElements2(deviceDriver, context)
    isSurfaceElementsInitialized = true
}

/**
 * 
 * @param {MR_DeviceDriver} deviceDriver 
 * @param {MR_FactoryMappingPage} page 
 * @param {object} context
 * @returns 
 */
function makePageWithDefaults(deviceDriver, page, context) {
}


/**
 * 
 * @param {MR_DeviceDriver} deviceDriver 
 * @param {MR_FactoryMappingPage} page 
 * @param {object} context 
 * @returns
 */
function makePageMixer(deviceDriver, page, context) {
    var subPageArea = page.makeSubPageArea('Transport')
    var defaultSubPage = subPageArea.makeSubPage('default')
    var shiftedSubPage = subPageArea.makeSubPage('shifted')
    var zoomSubPage = subPageArea.makeSubPage('zoom')
    var markerSubPage = subPageArea.makeSubPage('marker')
    var nudgeSubPage = subPageArea.makeSubPage('nudge')
    var scrubSubPage = subPageArea.makeSubPage('scrub')



    //page.makeActionBinding(context.btnPageUp.mSurfaceValue, deviceDriver.mAction.mPrevPage).setSubPage(defaultSubPage)
    //page.makeActionBinding(context.btnPageDown.mSurfaceValue, deviceDriver.mAction.mNextPage).setSubPage

    page.makeValueBinding(context.btnForward.d.mSurfaceValue, page.mHostAccess.mTransport.mValue.mForward).setSubPage(defaultSubPage)
    page.makeValueBinding(context.btnRewind.d.mSurfaceValue, page.mHostAccess.mTransport.mValue.mRewind).setSubPage(defaultSubPage)
    page.makeValueBinding(context.btnStart.d.mSurfaceValue, page.mHostAccess.mTransport.mValue.mStart).setTypeToggle().setSubPage(defaultSubPage)
    page.makeValueBinding(context.btnStop.d.mSurfaceValue, page.mHostAccess.mTransport.mValue.mStop).setTypeToggle().setSubPage(defaultSubPage)
    page.makeValueBinding(context.btnRecord.d.mSurfaceValue, page.mHostAccess.mTransport.mValue.mRecord).setTypeToggle().setSubPage(defaultSubPage)
    page.makeCommandBinding(context.btnRight.d.mSurfaceValue, 'Transport', '').setSubPage(defaultSubPage)
    page.makeCommandBinding(context.btnLeft.d.mSurfaceValue, 'Transport', '').setSubPage(defaultSubPage)
    page.makeActionBinding(context.btnDown.d.mSurfaceValue, page.mHostAccess.mTrackSelection.mAction.mNextTrack).setSubPage(defaultSubPage)
    page.makeActionBinding(context.btnUp.d.mSurfaceValue, page.mHostAccess.mTrackSelection.mAction.mPrevTrack).setSubPage(defaultSubPage)

    page.makeCommandBinding(context.btnContols[3].d.mSurfaceValue, 'Transport', '').setSubPage(defaultSubPage)
    page.makeCommandBinding(context.btnContols[5].d.mSurfaceValue, 'Transport', '').setSubPage(defaultSubPage)
    page.makeActionBinding(context.btnContols[4].d.mSurfaceValue, page.mHostAccess.mTrackSelection.mAction.mNextTrack).setSubPage(defaultSubPage)
    page.makeActionBinding(context.btnContols[1].d.mSurfaceValue, page.mHostAccess.mTrackSelection.mAction.mPrevTrack).setSubPage(defaultSubPage)

    page.makeCommandBinding(context.btnContols[3].d.mSurfaceValue, 'Transport', 'Nudge Cursor Left').setSubPage(nudgeSubPage)
    page.makeCommandBinding(context.btnContols[5].d.mSurfaceValue, 'Transport', 'Nudge Cursor Right').setSubPage(nudgeSubPage)
    page.makeCommandBinding(context.btnContols[1].d.mSurfaceValue, 'Transport', '').setSubPage(nudgeSubPage)
    page.makeCommandBinding(context.btnContols[4].d.mSurfaceValue, 'Transport', '').setSubPage(nudgeSubPage)
    //page.makeCommandBinding(context.wheelLeftVariable, 'Transport', 'Nudge -1 Frame').setSubPage(nudgeSubPage)
    //page.makeCommandBinding(context.wheelRightVariable, 'Transport', 'Nudge +1 Frame').setSubPage(nudgeSubPage)

    page.makeCommandBinding(context.btnContols[1].d.mSurfaceValue, 'Marker', 'Add Position Marker on Active Track').setSubPage(markerSubPage)
    page.makeCommandBinding(context.btnContols[3].d.mSurfaceValue, 'Transport', 'Locate Previous Event').setSubPage(markerSubPage)
    page.makeCommandBinding(context.btnContols[5].d.mSurfaceValue, 'Transport', 'Locate Next Event').setSubPage(markerSubPage)
    page.makeCommandBinding(context.btnContols[4].d.mSurfaceValue, 'Transport', '').setSubPage(markerSubPage)

    page.makeCommandBinding(context.btnContols[5].d.mSurfaceValue, 'Zoom', 'Zoom In').setSubPage(zoomSubPage)
    page.makeCommandBinding(context.btnContols[3].d.mSurfaceValue, 'Zoom', 'Zoom Out').setSubPage(zoomSubPage)
    page.makeCommandBinding(context.btnContols[4].d.mSurfaceValue, 'Zoom', 'Zoom In Vertically').setSubPage(zoomSubPage)
    page.makeCommandBinding(context.btnContols[1].d.mSurfaceValue, 'Zoom', 'Zoom Out Vertically').setSubPage(zoomSubPage)


    //zoomButton -> subpage.zoomSubPage
    context.btnsL1U[0].d.mSurfaceValue.mOnProcessValueChange = function (activeDevice, value) {
        if (value === 0) {
            isZoom = !isZoom
            if (isZoom) {
                context.zoomVariable.setProcessValue(activeDevice, 1)
                context.midiOutput2.sendMidi(activeDevice, [0x90, context.btnsL1U[0].note, 127])
                context.midiOutput2.sendMidi(activeDevice, [0x90, context.btnsL1U[1].note, 0])
                context.midiOutput2.sendMidi(activeDevice, [0x90, context.btnsL1U[2].note, 0])
                context.midiOutput2.sendMidi(activeDevice, [0x90, context.btnsL1U[3].note, 0])
            } else {
                context.zoomVariable.setProcessValue(activeDevice, 0)
                context.midiOutput2.sendMidi(activeDevice, [0x90, context.btnsL1U[0].note, 0])
                context.defaultVariable.setProcessValue(activeDevice, 1)
            }
        }
    }
    //markerButton -> subpage.markerSubPage
    context.btnsL1U[1].d.mSurfaceValue.mOnProcessValueChange = function (activeDevice, value) {
        if (value === 0) {
            isMarker = !isMarker
            if (isMarker) {
                context.markerVariable.setProcessValue(activeDevice, 1)
                context.midiOutput2.sendMidi(activeDevice, [0x90, context.btnsL1U[0].note, 0])
                context.midiOutput2.sendMidi(activeDevice, [0x90, context.btnsL1U[1].note, 127])
                context.midiOutput2.sendMidi(activeDevice, [0x90, context.btnsL1U[2].note, 0])
                context.midiOutput2.sendMidi(activeDevice, [0x90, context.btnsL1U[3].note, 0])
            } else {
                context.markerVariable.setProcessValue(activeDevice, 0)
                context.midiOutput2.sendMidi(activeDevice, [0x90, context.btnsL1U[1].note, 0])
                context.defaultVariable.setProcessValue(activeDevice, 1)
            }
        }
    }

    //nudgeButton -> subpage.nudgeSubPage
    context.btnsL1U[2].d.mSurfaceValue.mOnProcessValueChange = function (activeDevice, value) {
        if (value === 0) {
            isNudge = !isNudge
            if (isNudge) {
                context.nudgeVariable.setProcessValue(activeDevice, 1)
                context.midiOutput2.sendMidi(activeDevice, [0x90, context.btnsL1U[0].note, 0])
                context.midiOutput2.sendMidi(activeDevice, [0x90, context.btnsL1U[1].note, 0])
                context.midiOutput2.sendMidi(activeDevice, [0x90, context.btnsL1U[2].note, 127])
                context.midiOutput2.sendMidi(activeDevice, [0x90, context.btnsL1U[3].note, 0])
            } else {
                context.nudgeVariable.setProcessValue(activeDevice, 0)
                context.midiOutput2.sendMidi(activeDevice, [0x90, context.btnsL1U[0].note, 0])
                context.midiOutput2.sendMidi(activeDevice, [0x90, context.btnsL1U[1].note, 0])
                context.midiOutput2.sendMidi(activeDevice, [0x90, context.btnsL1U[2].note, 0])
                context.midiOutput2.sendMidi(activeDevice, [0x90, context.btnsL1U[3].note, 127])
                context.defaultVariable.setProcessValue(activeDevice, 1)
            }
        }
    }

    //scrubButton -> subpage.scrubSubPage
    context.btnsL1U[3].d.mSurfaceValue.mOnProcessValueChange = function (activeDevice, value) {
        if (value === 0) {
            isScrub = !isScrub
            if (isScrub) {
                context.scrubVariable.setProcessValue(activeDevice, 1)
                context.midiOutput2.sendMidi(activeDevice, [0x90, context.btnsL1U[3].note, 127])
            } else {
                context.scrubVariable.setProcessValue(activeDevice, 0)
                context.midiOutput2.sendMidi(activeDevice, [0x90, context.btnsL1U[3].note, 0])
                context.defaultVariable.setProcessValue(activeDevice, 1)
            }
        }
    }

    page.makeActionBinding(context.defaultVariable, defaultSubPage.mAction.mActivate)
    page.makeActionBinding(context.zoomVariable, zoomSubPage.mAction.mActivate)
    page.makeActionBinding(context.markerVariable, markerSubPage.mAction.mActivate)
    page.makeActionBinding(context.nudgeVariable, nudgeSubPage.mAction.mActivate)
    page.makeActionBinding(context.scrubVariable, scrubSubPage.mAction.mActivate)

    page.makeValueBinding(context.btnsL1L[0].d.mSurfaceValue, page.mHostAccess.mTrackSelection.mMixerChannel.mValue.mEditorOpen).setTypeToggle().setSubPage(defaultSubPage)
    page.makeValueBinding(context.btnsL1L[1].d.mSurfaceValue, page.mHostAccess.mTrackSelection.mMixerChannel.mValue.mInstrumentOpen).setTypeToggle().setSubPage(defaultSubPage)
    page.makeCommandBinding(context.btnContols[2].d.mSurfaceValue, 'Devices', 'Mixer').setSubPage(defaultSubPage)
    page.makeValueBinding(context.btnsL1U[4].d.mSurfaceValue, page.mHostAccess.mTrackSelection.mMixerChannel.mValue.mMonitorEnable).setTypeToggle().setSubPage(defaultSubPage)
    page.makeValueBinding(context.btnsL1U[5].d.mSurfaceValue, page.mHostAccess.mTransport.mValue.mMetronomeActive).setTypeToggle().setSubPage(defaultSubPage)
    page.makeValueBinding(context.btnsL1U[6].d.mSurfaceValue, page.mHostAccess.mTransport.mValue.mCycleActive).setTypeToggle().setSubPage(defaultSubPage)
    page.makeValueBinding(context.btnsL1U[7].d.mSurfaceValue, page.mHostAccess.mTrackSelection.mMixerChannel.mValue.mAutomationRead).setTypeToggle().setSubPage(defaultSubPage)
    page.makeValueBinding(context.btnsL1U[8].d.mSurfaceValue, page.mHostAccess.mTrackSelection.mMixerChannel.mValue.mAutomationWrite).setTypeToggle().setSubPage(defaultSubPage)


    var hostMixerBankZone = page.mHostAccess.mMixConsole.makeMixerBankZone('AudioInstrBanks')
        .includeAudioChannels()
        .includeInstrumentChannels()
        .setFollowVisibility(true)

    page.makeActionBinding(context.btnBankPrev.d.mSurfaceValue, hostMixerBankZone.mAction.mPrevBank).setSubPage(defaultSubPage)
    page.makeActionBinding(context.btnBankNext.d.mSurfaceValue, hostMixerBankZone.mAction.mNextBank).setSubPage(defaultSubPage)

    for (var i = 0; i < context.numStrips1; i++) {
        var hostMixerBankChannel = hostMixerBankZone.makeMixerBankChannel()

        var knobSurfaceValue = context.knobs1[i].mSurfaceValue
        var faderSurfaceValue = context.faders1[i].mSurfaceValue
        var mute_buttonSurfaceValue = context.btnsRow1[i].d.mSurfaceValue
        var solo_buttonSurfaceValue = context.btnsRow2[i].d.mSurfaceValue
        var rec_buttonSurfaceValue = context.btnsRow4[i].d.mSurfaceValue
        var sel_buttonSurfaceValue = context.btnsRow4[i].d.mSurfaceValue

        page.makeValueBinding(knobSurfaceValue, hostMixerBankChannel.mValue.mPan).setValueTakeOverModeScaled().setSubPage(defaultSubPage)
        page.makeValueBinding(faderSurfaceValue, hostMixerBankChannel.mValue.mVolume).setValueTakeOverModeJump().setSubPage(defaultSubPage)
        page.makeValueBinding(mute_buttonSurfaceValue, hostMixerBankChannel.mValue.mMute).setTypeToggle().setSubPage(defaultSubPage)
        page.makeValueBinding(solo_buttonSurfaceValue, hostMixerBankChannel.mValue.mSolo).setTypeToggle().setSubPage(defaultSubPage)
        page.makeValueBinding(rec_buttonSurfaceValue, hostMixerBankChannel.mValue.mRecordEnable).setTypeToggle().setSubPage(defaultSubPage)
        page.makeValueBinding(sel_buttonSurfaceValue, hostMixerBankChannel.mValue.mSelected).setTypeToggle().setSubPage(defaultSubPage)
    }
}


createSurfaceElements(deviceDriver, context)

var mixerPage = deviceDriver.mMapping.makePage('mixer')
makePageMixer(deviceDriver, mixerPage, context)
