var isSurfaceElementsInitialized = false
var midiremote_api = require('midiremote_api_v1')
var deviceDriver = midiremote_api.makeDeviceDriver('Controls', 'Combined', 'Oussi')

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
context.markerVariable = deviceDriver.mSurface.makeCustomValueVariable('marker')
context.zoomVariable = deviceDriver.mSurface.makeCustomValueVariable('zoom')

deviceDriver.mOnActivate = function (activeDevice) {
    if (isSurfaceElementsInitialized) {
        context.midiOutput2.sendMidi(activeDevice, [0x90, context.btnsL1U[0].note, 0])
        context.midiOutput2.sendMidi(activeDevice, [0x90, context.btnsL1U[1].note, 0])
        context.midiOutput2.sendMidi(activeDevice, [0x90, context.btnsL1L[0].note, 0])
        context.midiOutput2.sendMidi(activeDevice, [0x90, context.btnsL1L[1].note, 0])
        context.midiOutput2.sendMidi(activeDevice, [0x90, context.btnsL1L[2].note, 0])
        context.midiOutput2.sendMidi(activeDevice, [0x90, context.btnsL1L[3].note, 0])
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
 * @param {MR_DeviceSurface} surface
 * @param {MR_DeviceMidiInput} midiInput
 * @param {MR_DeviceMidiOutput} midiOutput
 * @param {number} note
 * @param {number} x
 * @param {number} y
 * @param {number} w
 * @param {number} h
 */
function makeButton(surface, midiInput, midiOutput, note, x, y, w, h) {
    var button = {}
    button.note = note
    button.d = surface.makeButton(x, y, w, h)
    button.d.mSurfaceValue.mMidiBinding.setIsConsuming(true).setInputPort(midiInput).bindToNote(0, note)
    button.x = x
    button.y = y
    button.w = w
    button.h = h
    button.state = false

    button.d.mSurfaceValue.mOnProcessValueChange = function (activeDevice) {
        var value = button.d.mSurfaceValue.getProcessValue(activeDevice)
        this.midiOutput.sendMidi(activeDevice, [0x90, this.note, value])
    }.bind({ midiOutput, note })

    return button
}

/**
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
    var knob = {} 
    knob.d = deviceDriver.mSurface.makeKnob(x, y, w, h)
    knob.d.mSurfaceValue.mMidiBinding
        .setInputPort(midiInput)
        .setOutputPort(midiOutput)
        .bindToControlChange(0, cc)
        .setTypeRelativeSignedBit()

    return knob
}

/**
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
    var knob = {}
    knob.d = deviceDriver.mSurface.makeKnob(x, y, w, h)
    knob.d.mSurfaceValue.mMidiBinding
        .setInputPort(midiInput)
        .setOutputPort(midiOutput)
        .bindToControlChange(0, cc)
        .setTypeAbsolute()

    return knob
}

/**
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
 * @param {MR_DeviceDriver} deviceDriver
 * @param {object} context
 * @param {number} i
 */
function makeOneStrip1(deviceDriver, context, i) {
    var midiInput = context.midiInput1
    var midiOutput = context.midiOutput1
    var wButton = 4
    var hButton = 3
    var wKnob = 5
    var hKnob = 5
    var wFader = 3
    var hFader = (hButton + 1.5) * 4 + 1
    var wStrip = 9

    var x = i * wStrip
    var y = 0

    context.knobs1[i] = makeKnob1(deviceDriver, midiInput, midiOutput, i, 16 + i, x,  y + 2 , wKnob ,  hKnob)
    context.faders1[i] = makeFader1(deviceDriver, midiInput, midiOutput, i, x + 1 ,  y + 8, wFader, hFader)
    context.btnsRow1[i] = makeButton(deviceDriver.mSurface, midiInput, midiOutput, 16 + i, x + 4, y + 9, wButton, hButton, true)
    context.btnsRow2[i] = makeButton(deviceDriver.mSurface, midiInput, midiOutput, 8 + i,  x + 4 , y + 9 + (hButton + 1.5), wButton, hButton, true)
    context.btnsRow3[i] = makeButton(deviceDriver.mSurface, midiInput, midiOutput, 0 + i, x + 4, y + 9 + 2*(hButton + 1.5), wButton, hButton, true)
    context.btnsRow4[i] = makeButton(deviceDriver.mSurface, midiInput, midiOutput, 24 + i, x + 4, y + 9 + 3*(hButton + 1.5), wButton, hButton, true)
}

/**
 * @param {MR_DeviceDriver} deviceDriver
 * @param {object} context
 */
function createSurfaceElements1(deviceDriver, context) {
    var midiInput = context.midiInput1
    var midiOutput = context.midiOutput1
    for (var i = 0; i < context.numStrips1; i++) {
        makeOneStrip1(deviceDriver, context, i)
    }

    var wButton = 4.2
    var hButton = 2
    var x = 3
    var y = 29
    var spacer = wButton + 2.1
    context.btnStart = makeButton(deviceDriver.mSurface, midiInput, midiOutput, 0x5E, x, y, wButton, hButton, false)
    context.btnStop = makeButton(deviceDriver.mSurface, midiInput, midiOutput, 0x5D, x + spacer, y, wButton, hButton, false)
    context.btnRecord = makeButton(deviceDriver.mSurface, midiInput, midiOutput, 0x5F, x + 2 * spacer, y, wButton, hButton, false)
    context.btnRewind = makeButton(deviceDriver.mSurface, midiInput, midiOutput, 0x5B, x + 3 * spacer, y, wButton, hButton, false)
    context.btnForward = makeButton(deviceDriver.mSurface, midiInput, midiOutput, 0x5C, x + 4 * spacer, y, wButton, hButton, false)
    context.btnBankPrev = makeButton(deviceDriver.mSurface, midiInput, midiOutput, 0x2E, x + 5 * spacer, y, wButton, hButton, false)
    context.btnBankNext = makeButton(deviceDriver.mSurface, midiInput, midiOutput, 0x2F, x + 6 * spacer, y, wButton, hButton, false)
    context.btnUp = makeButton(deviceDriver.mSurface, midiInput, midiOutput, 0x60, x + 7 * spacer, y, wButton, hButton, false)
    context.btnDown = makeButton(deviceDriver.mSurface, midiInput, midiOutput, 0x61, x + 8 * spacer, y, wButton, hButton, false)
    context.btnLeft = makeButton(deviceDriver.mSurface, midiInput, midiOutput, 0x62, x + 9 * spacer, y, wButton, hButton, false)
    context.btnRight = makeButton(deviceDriver.mSurface, midiInput, midiOutput, 0x63, x + 10 * spacer, y, wButton, hButton, false)
}

/**
 * @param {MR_DeviceDriver} deviceDriver
 * @param {object} context
 * @param {number} i
 */
function makeOneStrip2(deviceDriver, context, i) {
    var midiInput = context.midiInput2
    var midiOutput = context.midiOutput2
    var wButton = 4
    var hButton = 3
    var wKnob = 5
    var hKnob = 5
    var wFader = 3
    var hFader = (hButton + 1.5) * 4 + 1
    var wStrip = 9

    var x = 90 + i * wStrip
    var y = 0

    context.knobs2[i] = makeKnob2(deviceDriver, midiInput, midiOutput, i, 10 + i, x, y + 2, wKnob, hKnob)
    context.faders2[i] = makeFader2(deviceDriver, midiInput, midiOutput, i, 20 + i, x, y + 8, wFader, hFader)
    context.btnsL1U[i] = makeButton(deviceDriver.mSurface, midiInput, midiOutput, i, x - 4, + 9 + 2*(hButton + 1.5), wButton, hButton, true)
    context.btnsL1L[i] = makeButton(deviceDriver.mSurface, midiInput, midiOutput, i + 9, x - 4, + 9 + 3*(hButton + 1.5), wButton, hButton, true)
}

/**
 * @param {MR_DeviceDriver} deviceDriver
 * @param {object} context
 */
function createSurfaceElements2(deviceDriver, context) {
    var midiInput = context.midiInput2
    var midiOutput = context.midiOutput2
    context.btnContols = {}

    var x = 76
    var y = 2
    var w = 3
    var h = 3

    for (var i = 0; i < 6; i++) {
        if (i === 3) {
            y += 4
            x = 76
        }
        context.btnContols[i] = makeButton(deviceDriver.mSurface, midiInput, midiOutput, 90 + i, x + (i % 3) * 4, y, w, h, true)
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
function createSurfaceElements(deviceDriver, context) {
    createSurfaceElements1(deviceDriver, context)
    createSurfaceElements2(deviceDriver, context)
    isSurfaceElementsInitialized = true
}

/**
 * @param {MR_DeviceDriver} deviceDriver 
 * @param {MR_FactoryMappingPage} page 
 * @param {MR_SubPage} defaultSubPage 
 * @param {object} context 
 */
function createTransportAndContols(deviceDriver, page, defaultSubPage, context) {
    page.makeValueBinding(context.btnForward.d.mSurfaceValue, page.mHostAccess.mTransport.mValue.mForward).setSubPage(defaultSubPage)
    page.makeValueBinding(context.btnRewind.d.mSurfaceValue, page.mHostAccess.mTransport.mValue.mRewind).setSubPage(defaultSubPage)
    page.makeValueBinding(context.btnStart.d.mSurfaceValue, page.mHostAccess.mTransport.mValue.mStart).setTypeToggle().setSubPage(defaultSubPage)
    page.makeValueBinding(context.btnStop.d.mSurfaceValue, page.mHostAccess.mTransport.mValue.mStop).setTypeToggle().setSubPage(defaultSubPage)
    page.makeValueBinding(context.btnRecord.d.mSurfaceValue, page.mHostAccess.mTransport.mValue.mRecord).setTypeToggle().setSubPage(defaultSubPage)
    page.makeCommandBinding(context.btnRight.d.mSurfaceValue, 'Transport', '').setSubPage(defaultSubPage)
    page.makeCommandBinding(context.btnLeft.d.mSurfaceValue, 'Transport', '').setSubPage(defaultSubPage)
    page.makeActionBinding(context.btnDown.d.mSurfaceValue, page.mHostAccess.mTrackSelection.mAction.mNextTrack).setSubPage(defaultSubPage)
    page.makeActionBinding(context.btnUp.d.mSurfaceValue, page.mHostAccess.mTrackSelection.mAction.mPrevTrack).setSubPage(defaultSubPage)
    page.makeValueBinding(context.btnContols[3].d.mSurfaceValue, page.mHostAccess.mTransport.mValue.mRewind).setSubPage(defaultSubPage)
    page.makeValueBinding(context.btnContols[5].d.mSurfaceValue, page.mHostAccess.mTransport.mValue.mForward).setSubPage(defaultSubPage)
    page.makeActionBinding(context.btnContols[4].d.mSurfaceValue, page.mHostAccess.mTrackSelection.mAction.mNextTrack).setSubPage(defaultSubPage)
    page.makeActionBinding(context.btnContols[1].d.mSurfaceValue, page.mHostAccess.mTrackSelection.mAction.mPrevTrack).setSubPage(defaultSubPage)
    page.makeCommandBinding(context.btnContols[2].d.mSurfaceValue, 'Devices', 'Mixer').setSubPage(defaultSubPage)
    page.makeCommandBinding(context.btnsL1U[2].d.mSurfaceValue, 'Edit', 'Undo').setSubPage(defaultSubPage)
    page.makeCommandBinding(context.btnsL1U[3].d.mSurfaceValue, 'Edit', 'Redo').setSubPage(defaultSubPage)
    page.makeValueBinding(context.btnsL1U[4].d.mSurfaceValue, page.mHostAccess.mTrackSelection.mMixerChannel.mValue.mMonitorEnable).setTypeToggle().setSubPage(defaultSubPage)
    page.makeValueBinding(context.btnsL1U[5].d.mSurfaceValue, page.mHostAccess.mTransport.mValue.mMetronomeActive).setTypeToggle().setSubPage(defaultSubPage)
    page.makeValueBinding(context.btnsL1U[6].d.mSurfaceValue, page.mHostAccess.mTransport.mValue.mCycleActive).setTypeToggle().setSubPage(defaultSubPage)
    page.makeValueBinding(context.btnsL1U[7].d.mSurfaceValue, page.mHostAccess.mTrackSelection.mMixerChannel.mValue.mAutomationRead).setTypeToggle().setSubPage(defaultSubPage)
    page.makeValueBinding(context.btnsL1U[8].d.mSurfaceValue, page.mHostAccess.mTrackSelection.mMixerChannel.mValue.mAutomationWrite).setTypeToggle().setSubPage(defaultSubPage)
    page.makeValueBinding(context.btnsL1L[5].d.mSurfaceValue, page.mHostAccess.mTrackSelection.mMixerChannel.mValue.mEditorOpen).setTypeToggle().setSubPage(defaultSubPage)
    page.makeValueBinding(context.btnsL1L[6].d.mSurfaceValue, page.mHostAccess.mTrackSelection.mMixerChannel.mValue.mInstrumentOpen).setTypeToggle().setSubPage(defaultSubPage)
    page.makeCommandBinding(context.btnsL1L[7].d.mSurfaceValue, 'Edit', 'Unmute All').setSubPage(defaultSubPage)
    page.makeCommandBinding(context.btnsL1L[8].d.mSurfaceValue, 'Edit', 'Deactivate All Solo').setSubPage(defaultSubPage)
    page.makeActionBinding(context.defaultVariable, defaultSubPage.mAction.mActivate)
}

/**
 * @param {MR_DeviceDriver} deviceDriver 
 * @param {MR_FactoryMappingPage} page 
 * @param {object} context 
 */
function makePageMixer(deviceDriver, page, context) {
    var subPageArea = page.makeSubPageArea('mixer')
    var defaultSubPage = subPageArea.makeSubPage('default')
    var zoomSubPage = subPageArea.makeSubPage('zoom')
    var markerSubPage = subPageArea.makeSubPage('marker')

    createTransportAndContols(deviceDriver, page, defaultSubPage, context)

    page.makeCommandBinding(context.btnContols[1].d.mSurfaceValue, 'Marker', 'Insert Marker').setSubPage(markerSubPage)
    page.makeCommandBinding(context.btnContols[3].d.mSurfaceValue, 'Transport', 'Locate Previous Event').setSubPage(markerSubPage)
    page.makeCommandBinding(context.btnContols[5].d.mSurfaceValue, 'Transport', 'Locate Next Event').setSubPage(markerSubPage)
    page.makeCommandBinding(context.btnContols[4].d.mSurfaceValue, 'Transport', '').setSubPage(markerSubPage)

    page.makeCommandBinding(context.btnContols[5].d.mSurfaceValue, 'Zoom', 'Zoom In').setSubPage(zoomSubPage)
    page.makeCommandBinding(context.btnContols[3].d.mSurfaceValue, 'Zoom', 'Zoom Out').setSubPage(zoomSubPage)
    page.makeCommandBinding(context.btnContols[4].d.mSurfaceValue, 'Zoom', 'Zoom In Vertically').setSubPage(zoomSubPage)
    page.makeCommandBinding(context.btnContols[1].d.mSurfaceValue, 'Zoom', 'Zoom Out Vertically').setSubPage(zoomSubPage)

    page.makeActionBinding(context.zoomVariable, zoomSubPage.mAction.mActivate).setSubPage(defaultSubPage)
    page.makeActionBinding(context.markerVariable, markerSubPage.mAction.mActivate).setSubPage(defaultSubPage)

    page.makeActionBinding(context.zoomVariable, defaultSubPage.mAction.mActivate).setSubPage(zoomSubPage)
    page.makeActionBinding(context.markerVariable, markerSubPage.mAction.mActivate).setSubPage(zoomSubPage)

    page.makeActionBinding(context.zoomVariable, zoomSubPage.mAction.mActivate).setSubPage(markerSubPage)
    page.makeActionBinding(context.markerVariable, defaultSubPage.mAction.mActivate).setSubPage(markerSubPage)

    //zoomButton -> subpage.zoomSubPage
    var dummyZoomBtn = deviceDriver.mSurface.makeButton(context.btnsL1U[0].x, context.btnsL1U[0].y, context.btnsL1U[0].w, context.btnsL1U[0].h)
    //markerButton -> subpage.markerSubPage
    var dummyMarkerBtn = deviceDriver.mSurface.makeButton(context.btnsL1U[1].x, context.btnsL1U[1].y, context.btnsL1U[1].w, context.btnsL1U[1].h)

    page.makeCommandBinding(dummyZoomBtn.mSurfaceValue, 'Tool', 'Zoom Tool').setSubPage(defaultSubPage).mOnValueChange = function(activeDevide, activeMapping, arg2, arg3) {
    }
    context.btnsL1U[0].d.mSurfaceValue.mOnProcessValueChange = function (activeDevice, value) {
        if (value === 0) {
            context.zoomVariable.setProcessValue(activeDevice, 1)
        }
    }

    page.makeCommandBinding(dummyMarkerBtn.mSurfaceValue, 'Tool', 'Draw Tool').setSubPage(defaultSubPage).mOnValueChange = function (activeDevice, activeMapping , arg2, arg3) {
    }
    context.btnsL1U[1].d.mSurfaceValue.mOnProcessValueChange = function (activeDevice, value) {
        if (value === 0) {
            context.markerVariable.setProcessValue(activeDevice, 1)
        }
    }

    var hostMixerBankZone = page.mHostAccess.mMixConsole.makeMixerBankZone('AudioInstrBanks')
        .includeAudioChannels()
        .includeInstrumentChannels()
        .setFollowVisibility(true)

    page.makeActionBinding(context.btnBankPrev.d.mSurfaceValue, hostMixerBankZone.mAction.mPrevBank).setSubPage(defaultSubPage)
    page.makeActionBinding(context.btnBankNext.d.mSurfaceValue, hostMixerBankZone.mAction.mNextBank).setSubPage(defaultSubPage)

    for (var i = 0; i < context.numStrips1; i++) {
        var hostMixerBankChannel = hostMixerBankZone.makeMixerBankChannel()

        var knobSurfaceValue = context.knobs1[i].d.mSurfaceValue
        var faderSurfaceValue = context.faders1[i].mSurfaceValue
        var mute_buttonSurfaceValue = context.btnsRow1[i].d.mSurfaceValue
        var solo_buttonSurfaceValue = context.btnsRow2[i].d.mSurfaceValue
        var rec_buttonSurfaceValue = context.btnsRow3[i].d.mSurfaceValue
        var sel_buttonSurfaceValue = context.btnsRow4[i].d.mSurfaceValue

        page.makeValueBinding(knobSurfaceValue, hostMixerBankChannel.mValue.mPan).setSubPage(defaultSubPage)
        page.makeValueBinding(faderSurfaceValue, hostMixerBankChannel.mValue.mVolume).setSubPage(defaultSubPage)
        page.makeValueBinding(mute_buttonSurfaceValue, hostMixerBankChannel.mValue.mMute).setTypeToggle().setSubPage(defaultSubPage)
        page.makeValueBinding(solo_buttonSurfaceValue, hostMixerBankChannel.mValue.mSolo).setTypeToggle().setSubPage(defaultSubPage)
        page.makeValueBinding(rec_buttonSurfaceValue, hostMixerBankChannel.mValue.mRecordEnable).setTypeToggle().setSubPage(defaultSubPage)
        page.makeValueBinding(sel_buttonSurfaceValue, hostMixerBankChannel.mValue.mSelected).setTypeToggle().setSubPage(defaultSubPage)
    }

    page.mOnActivate = function (activeDevice) {
        context.midiOutput2.sendMidi(activeDevice, [0x90, context.btnsL1L[0].note, 0])
        context.midiOutput2.sendMidi(activeDevice, [0x90, context.btnsL1L[1].note, 0])
        context.midiOutput2.sendMidi(activeDevice, [0x90, context.btnsL1L[2].note, 0])
        context.midiOutput2.sendMidi(activeDevice, [0x90, context.btnsL1L[3].note, 0])
        context.midiOutput2.sendMidi(activeDevice, [0x90, context.btnsL1U[0].note, 0])
        context.midiOutput2.sendMidi(activeDevice, [0x90, context.btnsL1U[1].note, 0])
    }.bind({ context })

    zoomSubPage.mOnActivate = function(activeDevice) {
        context.midiOutput2.sendMidi(activeDevice, [0x90, context.btnsL1U[0].note, 127])
        dummyZoomBtn.mSurfaceValue.setProcessValue(activeDevice, 1)
    }

    zoomSubPage.mOnDeactivate = function(activeDevice) {
        context.midiOutput2.sendMidi(activeDevice, [0x90, context.btnsL1U[0].note, 0])
        dummyZoomBtn.mSurfaceValue.setProcessValue(activeDevice, 0)
    }

    markerSubPage.mOnActivate = function(activeDevice) {
        context.midiOutput2.sendMidi(activeDevice, [0x90, context.btnsL1U[1].note, 127])
        dummyMarkerBtn.mSurfaceValue.setProcessValue(activeDevice, 1)
    }

    markerSubPage.mOnDeactivate = function(activeDevice) {
        context.midiOutput2.sendMidi(activeDevice, [0x90, context.btnsL1U[1].note, 0])
        dummyMarkerBtn.mSurfaceValue.setProcessValue(activeDevice, 0)
    }

}

/**
 * @param {MR_FactoryMappingPage} page 
 * @param {MR_SubPage} defaultSubPage
 * @param {MR_SubPage} preFilterSupPage
 * @param {MR_PreFilter} preFilter 
 * @param {object} context 
 */
function makeSubPagePrefilter(page, defaultSubPage, preFilterSupPage, preFilter, context) {

    page.makeValueBinding(context.btnsRow1[0].d.mSurfaceValue, preFilter.mBypass).setTypeToggle().setSubPage(defaultSubPage)
    page.makeValueBinding(context.btnsRow2[0].d.mSurfaceValue, preFilter.mHighCutOn).setTypeToggle().setSubPage(preFilterSupPage)
    page.makeValueBinding(context.knobs1[0].d.mSurfaceValue, preFilter.mHighCutFreq).setSubPage(preFilterSupPage)
    page.makeValueBinding(context.knobs1[1].d.mSurfaceValue, preFilter.mHighCutSlope).setSubPage(preFilterSupPage)
    page.makeValueBinding(context.btnsRow3[0].d.mSurfaceValue, preFilter.mLowCutOn).setTypeToggle().setSubPage(preFilterSupPage)
    page.makeValueBinding(context.knobs1[2].d.mSurfaceValue, preFilter.mLowCutFreq).setSubPage(preFilterSupPage)
    page.makeValueBinding(context.knobs1[3].d.mSurfaceValue, preFilter.mLowCutSlope).setSubPage(preFilterSupPage)
    page.makeValueBinding(context.knobs1[4].d.mSurfaceValue, preFilter.mGain).setSubPage(preFilterSupPage)
    page.makeValueBinding(context.btnsRow4[0].d.mSurfaceValue, preFilter.mPhaseSwitch).setTypeToggle().setSubPage(preFilterSupPage)
    for (var i = 5; i < context.numStrips1; i++) {
        page.makeCommandBinding(context.knobs1[i].d.mSurfaceValue, 'Video', 'Mute all vdeo tracks').setSubPage(preFilterSupPage) //dummy bind
    }
}

/**
 * @param {MR_FactoryMappingPage} page 
 * @param {MR_SubPage} defaultSubPage 
 * @param {MR_ChannelEQBand} band 
 * @param {number} idx
 * @param {object} context
 */
function makeSubPageEQBand(page, defaultSubPage, band, idx, context) {
    page.makeValueBinding(context.btnsRow1[idx].d.mSurfaceValue, band.mOn).setTypeToggle().setSubPage(defaultSubPage)
    var auxVar = page.mCustom.makeHostValueVariable('auxVar');
    context.btnsRow2[idx].auxVar = page.mCustom.makeHostValueVariable('auxVar2' + idx);
    context.btnsRow3[idx].auxVar = page.mCustom.makeHostValueVariable('auxVar3' + idx);

    context.btnsRow4[idx].customVariable = deviceDriver.mSurface.makeCustomValueVariable('inc' + idx.toString())
    context.btnsRow4[idx].customValue = 0;
    context.btnsRow4[idx].customValueMax = 1;
    context.btnsRow4[idx].customMapping = page.makeValueBinding(context.btnsRow4[idx].customVariable, band.mFilterType).setSubPage(defaultSubPage)
    context.btnsRow4[idx].customMapping.setSubPage(defaultSubPage)
    band.mFilterType.mOnDisplayValueChange = function (activeDevice, activeMapping, arg2, arg4) {
        if (idx === 1) {
            switch (arg2) {
                case 'Parametric I':
                    context.btnsRow4[idx].customValue = 0
                    break

                case 'Low Shelf I':
                    context.btnsRow4[idx].customValue = 1
                    break

                case 'High Pass I':
                    context.btnsRow4[idx].customValue = 2
                    break

                case 'High Pass II':
                    context.btnsRow4[idx].customValue = 3
                    break

                case 'Parametric II':
                    context.btnsRow4[idx].customValue = 4
                    break

                case 'Low Shelf II':
                    context.btnsRow4[idx].customValue = 5
                    break

                case 'Low Shelf III':
                    context.btnsRow4[idx].customValue = 6
                    break


                case 'Low Shelf IV':
                    context.btnsRow4[idx].customValue = 7
                    break
                default:
                    if (arg2 === null || arg2 === '') {
                        break
                    }

                    console.log('Unkown filter ' + idx + ' type: ' + arg2 + ' ,' + arg4);
                    console.assert()
                    context.btnsRow4[idx].customValue = 0
                    break
            }
        } else if (idx === 2) {
            switch (arg2) {
                case 'Parametric I':
                    context.btnsRow4[idx].customValue = 0
                    break

                case 'Parametric II':
                    context.btnsRow4[idx].customValue = 1
                    break

                default:
                    if (arg2 === null || arg2 === '') {
                        break
                    }
                    console.log('Unkown filter ' + idx + ' type: ' + arg2 + ' ,' + arg4);
                    console.assert()
                    context.btnsRow4[idx].customValue = 0
                    break
            }
        } else if (idx === 3) {
            switch (arg2) {
                case 'Parametric I':
                    context.btnsRow4[idx].customValue = 0
                    break

                case 'Parametric II':
                    context.btnsRow4[idx].customValue = 1
                    break

                default:
                    if (arg2 === null || arg2 === '') {
                        break
                    }
                    console.log('Unkown filter ' + idx + ' type: ' + arg2 + ' ,' + arg4);
                    console.assert()
                    context.btnsRow4[idx].customValue = 0
                    break
            }
        } else if (idx === 4) {
            context.btnsRow4[idx].customValueMax = 7;
            switch (arg2) {
                case 'Parametric I':
                    context.btnsRow4[idx].customValue = 0
                    break

                case 'High Shelf I':
                    context.btnsRow4[idx].customValue = 1
                    break

                case 'Low Pass I':
                    context.btnsRow4[idx].customValue = 2
                    break

                case 'Low Pass II':
                    context.btnsRow4[idx].customValue = 3
                    break

                case 'Parametric II':
                    context.btnsRow4[idx].customValue = 4
                    break

                case 'High Shelf II':
                    context.btnsRow4[idx].customValue = 5
                    break

                case 'High Shelf III':
                    context.btnsRow4[idx].customValue = 6
                    break


                case 'High Shelf IV':
                    context.btnsRow4[idx].customValue = 7
                    break

                default:
                    if (arg2 === null || arg2 === '') {
                        break
                    }
                    console.log('Unkown filter ' + idx + ' type: ' + arg2 + ' ,' + arg4);
                    console.assert()
                    context.btnsRow4[idx].customValue = 0
                    break
            }
        }
    }

    page.makeValueBinding(context.btnsRow2[idx].d.mSurfaceValue, auxVar).setSubPage(defaultSubPage).mOnValueChange = function (activeDevice, activeMapping, value, diff) {
        if (value === 0 && context.btnsRow4[idx].customValue < context.btnsRow4[idx].customValueMax) {
            context.btnsRow4[idx].customValue += 1
            context.btnsRow4[idx].customVariable.setProcessValue(activeDevice, context.btnsRow4[idx].customValue / context.btnsRow4[idx].customValueMax)
        }
    }

    page.makeValueBinding(context.btnsRow3[idx].d.mSurfaceValue, auxVar).setSubPage(defaultSubPage).mOnValueChange = function (activeDevice, activeMapping, value, diff) {
        if (value === 0 && context.btnsRow4[idx].customValue > 0) {
            context.btnsRow4[idx].customValue -= 1
            context.btnsRow4[idx].customVariable.setProcessValue(activeDevice, context.btnsRow4[idx].customValue / context.btnsRow4[idx].customValueMax)
        }
    }

    page.makeValueBinding(context.faders1[idx].mSurfaceValue, band.mGain).setSubPage(defaultSubPage)
    page.makeValueBinding(context.knobs1[(idx - 1) * 2].d.mSurfaceValue, band.mFreq).setSubPage(defaultSubPage)
    page.makeValueBinding(context.knobs1[(idx - 1) * 2 + 1].d.mSurfaceValue, band.mQ).setSubPage(defaultSubPage)

   
}

/**
 * @param {MR_DeviceDriver} deviceDriver 
 * @param {MR_FactoryMappingPage} page 
 * @param {object} context 
 */
function makePageEQ(deviceDriver, page, context) {
    var subPageArea = page.makeSubPageArea('EQ')
    var defaultSubPage = subPageArea.makeSubPage('default')
    var preFilterSubPage = subPageArea.makeSubPage('eqBand')

    page.makeActionBinding(context.btnsL1U[0].d.mSurfaceValue, preFilterSubPage.mAction.mActivate).setSubPage(defaultSubPage)
    page.makeActionBinding(context.btnsL1U[0].d.mSurfaceValue, defaultSubPage.mAction.mActivate).setSubPage(preFilterSubPage)

    createTransportAndContols(deviceDriver, page, defaultSubPage, context)

    var selectedTrackChannel = page.mHostAccess.mTrackSelection.mMixerChannel
    makeSubPagePrefilter(page, defaultSubPage, preFilterSubPage, selectedTrackChannel.mPreFilter, context)
    makeSubPageEQBand(page, defaultSubPage, selectedTrackChannel.mChannelEQ.mBand1, 1, context)
    makeSubPageEQBand(page, defaultSubPage, selectedTrackChannel.mChannelEQ.mBand2, 2, context)
    makeSubPageEQBand(page, defaultSubPage, selectedTrackChannel.mChannelEQ.mBand3, 3, context)
    makeSubPageEQBand(page, defaultSubPage, selectedTrackChannel.mChannelEQ.mBand4, 4, context)
    page.makeCommandBinding(context.btnsRow1[7].d.mSurfaceValue, 'Process Project Logical Editor', 'Toggle EQ Bypass of Selected Tracks').setSubPage(defaultSubPage)

    page.mOnActivate = function (activeDevice) {
        context.midiOutput2.sendMidi(activeDevice, [0x90, context.btnsL1L[0].note, 127])
        context.midiOutput2.sendMidi(activeDevice, [0x90, context.btnsL1L[1].note, 0])
        context.midiOutput2.sendMidi(activeDevice, [0x90, context.btnsL1L[2].note, 0])
        context.midiOutput2.sendMidi(activeDevice, [0x90, context.btnsL1U[3].note, 0])
        context.midiOutput2.sendMidi(activeDevice, [0x90, context.btnsL1U[4].note, 0])
    }.bind({ context })

    page.mOnDeactivate = function (activeDevice) {
        context.midiOutput2.sendMidi(activeDevice, [0x90, context.btnsL1L[0].note, 0])
    }.bind({ context })

    preFilterSubPage.mOnActivate = function (activeDevice) {
        context.midiOutput2.sendMidi(activeDevice, [0x90, context.btnsL1U[0].note, 127])
    }.bind({ context })

    preFilterSubPage.mOnDeactivate = function (activeDevice) {
        context.midiOutput2.sendMidi(activeDevice, [0x90, context.btnsL1U[0].note, 0])
    }.bind({ context })
}

/**
 * @param {MR_DeviceDriver} deviceDriver 
 * @param {MR_FactoryMappingPage} page 
 * @param {object} context
 */
function makePageCueSends(deviceDriver, page, context) {
    var subPageArea = page.makeSubPageArea('CueSends')
    var defaultSubPage = subPageArea.makeSubPage('default')
    var sendsSubPage = subPageArea.makeSubPage('sends')

    page.makeActionBinding(context.btnsL1U[0].d.mSurfaceValue, sendsSubPage.mAction.mActivate).setSubPage(defaultSubPage)
    page.makeActionBinding(context.btnsL1U[0].d.mSurfaceValue, defaultSubPage.mAction.mActivate).setSubPage(sendsSubPage)

    createTransportAndContols(deviceDriver, page, defaultSubPage, context)

    var selectedTrackChannel = page.mHostAccess.mTrackSelection.mMixerChannel
    page.makeValueBinding(context.btnsRow1[7].d.mSurfaceValue, selectedTrackChannel.mCueSends.mBypass).setTypeToggle().setSubPage(defaultSubPage)
    for (var idx = 0; idx < 4; idx++) {
        var cueSendSlot = selectedTrackChannel.mCueSends.getByIndex(idx)
        page.makeValueBinding(context.btnsRow1[idx].d.mSurfaceValue, cueSendSlot.mOn).setTypeToggle().setSubPage(defaultSubPage)
        page.makeValueBinding(context.btnsRow2[idx].d.mSurfaceValue, cueSendSlot.mPrePost).setTypeToggle().setSubPage(defaultSubPage)
        page.makeValueBinding(context.knobs1[idx * 2].d.mSurfaceValue, cueSendSlot.mPan).setSubPage(defaultSubPage)
        page.makeValueBinding(context.knobs1[idx * 2 + 1].d.mSurfaceValue, cueSendSlot.mLevel).setSubPage(defaultSubPage)
    }

    for (var idx = 0; idx < 8; idx++) {
        var sendSlot = selectedTrackChannel.mSends.getByIndex(idx)
        page.makeValueBinding(context.btnsRow1[idx].d.mSurfaceValue, sendSlot.mOn).setTypeToggle().setSubPage(sendsSubPage)
        page.makeValueBinding(context.btnsRow2[idx].d.mSurfaceValue, sendSlot.mPrePost).setTypeToggle().setSubPage(sendsSubPage)
        page.makeValueBinding(context.knobs1[idx].d.mSurfaceValue, sendSlot.mLevel).setSubPage(sendsSubPage)
    }

    page.mOnActivate = function (activeDevice) {
        context.midiOutput2.sendMidi(activeDevice, [0x90, context.btnsL1L[0].note, 0])
        context.midiOutput2.sendMidi(activeDevice, [0x90, context.btnsL1L[1].note, 127])
        context.midiOutput2.sendMidi(activeDevice, [0x90, context.btnsL1L[2].note, 0])
        context.midiOutput2.sendMidi(activeDevice, [0x90, context.btnsL1L[3].note, 0])
        context.midiOutput2.sendMidi(activeDevice, [0x90, context.btnsL1L[2].note, 0])
        context.midiOutput2.sendMidi(activeDevice, [0x90, context.btnsL1U[0].note, 0])
    }.bind({ context })

    page.mOnDeactivate = function (activeDevice) {
        context.midiOutput2.sendMidi(activeDevice, [0x90, context.btnsL1L[1].note, 0])
    }.bind({ context })

    sendsSubPage.mOnActivate = function (activeDevice) {
        context.midiOutput2.sendMidi(activeDevice, [0x90, context.btnsL1U[0].note, 127])
    }.bind({ context })

    sendsSubPage.mOnDeactivate = function (activeDevice) {
        context.midiOutput2.sendMidi(activeDevice, [0x90, context.btnsL1U[0].note, 0])
    }.bind({ context })
}


/**
 * @param {MR_FactoryMappingPage} page 
 * @param {MR_SubPage} subPage
 * @param {MR_HostValueUndefined} customVar
 * @parm {MR_HostObject} stripEffectType
 * @param {object} context
 * @param {number} idx
 */
function makeStripEffectBinding(page, subPage, customVar, stripEffectType, context, idx) {
    var dam = page.mHostAccess.makeDirectAccess(stripEffectType);

    page.makeValueBinding(context.btnsRow1[idx].d.mSurfaceValue, stripEffectType.mOn).setTypeToggle().setSubPage(subPage)
    page.makeValueBinding(context.btnsRow2[idx].d.mSurfaceValue, stripEffectType.mBypass).setTypeToggle().setSubPage(subPage)

    var map1 = page.makeValueBinding(context.btnsRow3[idx].d.mSurfaceValue, customVar).setSubPage(subPage)
    map1.mOnValueChange = function (activeDevice, activeMapping, arg2) {
        if (arg2 === 0) {
            var baseID = dam.getBaseObjectID(activeMapping);
            var numChilds = dam.getNumberOfChildObjects(activeMapping, baseID)
            var tag = 4102;
            var val = 1
            if (numChilds > 0) {
                tag = 4125;
                val = 0
            }
            dam.setParameterProcessValue(activeMapping, baseID, tag, val);
        }
    }
}

var stripChannelEffectsMapping = {
    'Noise Gate': function () {
        return {
            knobs: ['Threshold', 'Range', 'Attack', 'Release', 'FilterFreq', 'Q-Factor'],
            buttons: ['Bypass', 'SCMonitor', 'SCOn', 'Auto Release'],
            ignore: ['InVu', 'OutVu', 'Live']
        }
    },
    'Standard Compressor': function () {
        return {
            knobs: ['Threshold', 'Ratio', 'Attack', 'Release', 'MakeUp'],
            buttons: ['Bypass', 'AutoMakeUp', 'Auto Release'],
            ignore: ['InVu', 'OutVu',  , 'Red', 'MakeupMode']
        }
    },
    'Tube Compressor': function () {
        return {
            knobs: ['Input Gain', 'Output Gain', 'Attack Time', 'Release Time', 'Drive', 'Mix'],
            buttons: ['Bypass', 'Attack Mode' , 'Auto Release'],
            ignore: ['Input Vu', 'Output Vu']
        }
    },
    'VintageCompressor': function () {
        return {
            knobs: ['Input Gain', 'Output Gain', 'Attack Time', 'Release Time', 'Mix', 'Ratio'],
            buttons: ['Bypass', 'Attack Mode', 'Auto Release'],
            ignore: ['Input Vu', 'Output Vu', 'Red']
        }
    },
   'DeEsser': function () {
        return {
            knobs: ['Threshold', 'Reduction', 'Release', 'LowFreq', 'HighFreq'],
            buttons: ['Bypass', 'Solo', 'Diff'],
            ignore: ['Input Vu', 'Output Vu']
        }
    },
    'EnvelopeShaper': function () {
        return {
            knobs: ['Attack Gain', 'Release Gain', 'Attack Length', 'Output'],
            buttons: ['Bypass'],
            ignore: ['OutVu']
        }
    },
    'Magneto II': function () {
        return {
            knobs: ['Saturation', 'Freq-Low', 'HF-Adjust', 'Freq-High', 'Output'],
            buttons: ['Bypass', 'HF-On', 'Solo'],
            ignore: ['InVu', 'OutVu']
        }
    },
    'Tape Saturation': function () {
        return {
            knobs: ['Drive', 'LF', 'HF', 'Output'],
            buttons: ['Bypass', 'Dual', 'Auto Gain'],
            ignore: ['OutVu']
        }
    },
    'Tube Saturation': function () {
        return {
            knobs: ['Drive', 'LF', 'HF', 'Output'],
            buttons: ['Bypass'],
            ignore: ['OutVu']
        }
    },
    'Brickwall Limiter': function () {
        return {
            knobs: ['Threshold', 'Release'],
            buttons: ['Bypass'],
            ignore: ['Input Vu', 'Output Vu', 'Red']
        }
    },
    'Maximizer': function () {
        return {
            knobs: ['Optimize', 'Mix', 'Output', 'Recover', 'Release'],
            buttons: ['Bypass', 'Modern Mode'],
            ignore: ['Input Vu', 'Output Vu', 'RMS', 'Red']
        }
    },
    'Standard Limiter': function () {
        return {
            knobs: ['Input', 'Release', 'Output'],
            buttons: ['Bypass', 'Auto Release'],
            ignore: ['Input Vu', 'Output Vu', 'Red']
        }
    }
}

/**
 * @param {string} name
 */
function getChannelStripPluginMappping(name) {
    var mapping = {}
    if (stripChannelEffectsMapping[name])  {
        mapping = stripChannelEffectsMapping[name]()
    }
    else {
        mapping.buttons = []
        mapping.knobs = []
        mapping.ignore = []
    }
    return mapping
}

/**
 * @param {MR_FactoryMappingPage} page 
 * @param {MR_SubPage} subPage
 * @param {MR_HostValueUndefined} customVar
 * @parm {MR_HostObject} stripEffect
 * @param {object} context
 * @param {MR_ActiveDevice} activeDevice
 * @param {MR_ActiveMapping} activeMapping
 * @param {object} buttons
 * @param {object} knobs
 * @param {object} mapping
 */
function bindEffectKnobsButtons(page, subPage, customVar, stripEffectType, context, activeDevice, activeMapping, buttons, knobs, mapping) {
    buttons.length = 0
    knobs.length = 0
    var pZone = stripEffectType.mParameterBankZone
    var dam2 = page.mHostAccess.makeDirectAccess(pZone)
    var baseID = dam2.getBaseObjectID(activeMapping);
    var numParams = dam2.getNumberOfParameters(activeMapping, baseID)
    var b = mapping.buttons.length
    var k = mapping.knobs.length

    for (var i = 0; i < b; i++) {
        buttons.push(false);
    }

    for (var i = 0; i < k; i++) {
        knobs.push(0);
    }

    // var arr = ['baseID:', baseID, 'numParams:', numParams]
    // console.log(arr.join(' '))
    for (var i = 0; i < numParams; i++) {
        var pTag = dam2.getParameterTagByIndex(activeMapping, baseID, i)
        var pName = dam2.getParameterTitle(activeMapping, baseID, pTag, 20)
        var skip = false
        for (var j = 0; j < mapping.ignore.length; j++) {
            if (pName.indexOf(mapping.ignore[j]) != -1) {
                skip = true
                break
            }
        }

        if (skip) {
            continue
        }

        var pDisplayValue = dam2.getParameterDisplayValue(activeMapping, baseID, pTag)
        var pValue = dam2.getParameterProcessValue(activeMapping, baseID, pTag)
        // arr = ['pTag:', pTag, 'pName:', pName, 'pDisplayValue:', pDisplayValue, 'pValue', pValue]
        // console.log(arr.join(' '))
        var sPos = 0
        var isButton = true
        
        // some knobs we want to force to on/off ->button
        var idx = mapping.buttons.indexOf(pName)
        if (idx < 0) {
            isButton = false
        }

        if (pDisplayValue == 'On' || pDisplayValue == 'Off' || isButton) {
            if (idx >= 0) {
                buttons[idx] = pValue
                sPos = idx
            } else {
                buttons.push(pValue)
                sPos = b
                b++
            }

            if (sPos < context.numStrips1) {
                page.makeValueBinding(context.btnsRow1[sPos].d.mSurfaceValue, customVar).setTypeToggle().setSubPage(subPage).mOnValueChange = function (activeDevice, activeMapping, value, arg3) {
                    dam2.setParameterProcessValue(activeMapping, baseID, this.pTag, value)
                    buttons[this.sPos] = value
                }.bind({ pTag, sPos })
                context.btnsRow1[sPos].d.mSurfaceValue.setProcessValue(activeDevice, pValue)
                context.midiOutput1.sendMidi(activeDevice, [0x90, context.btnsRow1[sPos].note, pValue])
            } else if (sPos < (2 * context.numStrips1)) {
                page.makeValueBinding(context.btnsRow2[sPos - context.numStrips1].d.mSurfaceValue, customVar).setTypeToggle().setSubPage(subPage).mOnValueChange = function (activeDevice, activeMapping, value, arg3) {
                    dam2.setParameterProcessValue(activeMapping, baseID, this.pTag, value)
                    buttons[this.sPos] = value
                }.bind({ pTag, sPos })
                context.btnsRow2[sPos - context.numStrips1].d.mSurfaceValue.setProcessValue(activeDevice, pValue)
                context.midiOutput1.sendMidi(activeDevice, [0x90, context.btnsRow2[sPos- context.numStrips1].note, pValue])
            }
        } else {
            idx = mapping.knobs.indexOf(pName)
            if (idx >= 0) {
                knobs[idx] = pValue
                sPos = idx
            } else {
                knobs.push(pValue)
                sPos = k
                k++
            }

            if (sPos < context.numStrips1) {
                page.makeValueBinding(context.knobs1[sPos].d.mSurfaceValue, customVar).setValueTakeOverModePickup().setSubPage(subPage).mOnValueChange = function (activeDevice, activeMapping, value, arg3) {
                    dam2.setParameterProcessValue(activeMapping, baseID, this.pTag, value)
                    knobs[this.sPos] = value
                }.bind({ pTag, sPos })
                context.knobs1[sPos].d.mSurfaceValue.setProcessValue(activeDevice, pValue)
            } else if (sPos < (context.numStrips1 + context.numStrips2)) {
                page.makeValueBinding(context.knobs2[sPos - context.numStrips1].d.mSurfaceValue, customVar).setValueTakeOverModePickup().setSubPage(subPage).mOnValueChange = function (activeDevice, activeMapping, value, arg3) {
                    dam2.setParameterProcessValue(activeMapping, baseID, this.pTag, value)
                    knobs[this.sPos] = value
                }.bind({ pTag, sPos })
                context.knobs2[sPos - context.numStrips1].d.mSurfaceValue.setProcessValue(activeDevice, pValue)
            }
        }
    }

    // bind the unused to dummy
    for (i = b; i < (context.numStrips1 * 2); i++) {
        if (i < context.numStrips1) {
            page.makeCommandBinding(context.btnsRow1[i].d.mSurfaceValue, '', '').setSubPage(subPage)
        } else {
            page.makeCommandBinding(context.btnsRow2[i - context.numStrips1].d.mSurfaceValue, '', '').setSubPage(subPage)            
        }
    }

    for (var i = 0; i < context.numStrips1; i++) {
        page.makeCommandBinding(context.btnsRow3[i].d.mSurfaceValue, '', '').setSubPage(subPage)
    }
}

/**
 * @param {object} context
 * @param {MR_ActiveDevice} activeDevice
 * @param {object} buttons
 * @param {object} knobs
 */
function updateEffectsKnobsButtons(context, activeDevice, buttons, knobs) {
    for (var i = 0; i < buttons.length; i++) {
        if (i < context.numStrips1) {
            context.btnsRow1[i].d.mSurfaceValue.setProcessValue(activeDevice, buttons[i])
            context.midiOutput1.sendMidi(activeDevice, [0x90, context.btnsRow1[i].note, buttons[i]])
        } else if (i < 2 * context.numStrips1) {
            context.btnsRow2[i - context.numStrips1].d.mSurfaceValue.setProcessValue(activeDevice, buttons[i])
            context.midiOutput1.sendMidi(activeDevice, [0x90, context.btnsRow2[i - context.numStrips1].note, buttons[i]])
        }
    }

    for (var i = 0; i < knobs.length; i++) {
        if (i < context.numStrips1) {
            context.knobs1[i].d.mSurfaceValue.setProcessValue(activeDevice, knobs[i])
        } else if (i < context.numStrips1 + context.numStrips2) {
            context.knobs2[i - context.numStrips1].d.mSurfaceValue.setProcessValue(activeDevice, knobs[i])
        }
    }

    for (i = buttons.length; i < (context.numStrips1 * 2); i++) {
        if (i < context.numStrips1) {
            context.btnsRow1[i].d.mSurfaceValue.setProcessValue(activeDevice, 0)
            context.midiOutput1.sendMidi(activeDevice, [0x90, context.btnsRow1[i].note, 0])
        } else if (i < 2 * context.numStrips1) {
            context.btnsRow2[i - context.numStrips1].d.mSurfaceValue.setProcessValue(activeDevice, 0)
            context.midiOutput1.sendMidi(activeDevice, [0x90, context.btnsRow2[i - context.numStrips1].note, 0])
        }
    }

}

/**
 * @param {MR_DeviceDriver} deviceDriver 
 * @param {MR_FactoryMappingPage} page 
 * @param {object} context
 */
function makePageChannelStrip(deviceDriver, page, context) {
    var subPageArea = page.makeSubPageArea('ChannelStrip')
    var defaultSubPage = subPageArea.makeSubPage('default')
    var gateSubPage = subPageArea.makeSubPage('gate')
    var compressorSubPage = subPageArea.makeSubPage('compressor')
    var toolsSubPage = subPageArea.makeSubPage('tools')
    var saturatorSubPage = subPageArea.makeSubPage('saturator')
    var limiterSubPage = subPageArea.makeSubPage('limiter')

    page.makeActionBinding(context.btnsRow4[0].d.mSurfaceValue, gateSubPage.mAction.mActivate).setSubPage(defaultSubPage)
    page.makeActionBinding(context.btnsRow4[1].d.mSurfaceValue, compressorSubPage.mAction.mActivate).setSubPage(defaultSubPage)
    page.makeActionBinding(context.btnsRow4[2].d.mSurfaceValue, toolsSubPage.mAction.mActivate).setSubPage(defaultSubPage)
    page.makeActionBinding(context.btnsRow4[3].d.mSurfaceValue, saturatorSubPage.mAction.mActivate).setSubPage(defaultSubPage)
    page.makeActionBinding(context.btnsRow4[4].d.mSurfaceValue, limiterSubPage.mAction.mActivate).setSubPage(defaultSubPage)

    page.makeActionBinding(context.btnsRow4[0].d.mSurfaceValue, defaultSubPage.mAction.mActivate).setSubPage(gateSubPage)
    page.makeActionBinding(context.btnsRow4[1].d.mSurfaceValue, compressorSubPage.mAction.mActivate).setSubPage(gateSubPage)
    page.makeActionBinding(context.btnsRow4[2].d.mSurfaceValue, toolsSubPage.mAction.mActivate).setSubPage(gateSubPage)
    page.makeActionBinding(context.btnsRow4[3].d.mSurfaceValue, saturatorSubPage.mAction.mActivate).setSubPage(gateSubPage)
    page.makeActionBinding(context.btnsRow4[4].d.mSurfaceValue, limiterSubPage.mAction.mActivate).setSubPage(gateSubPage)

    page.makeActionBinding(context.btnsRow4[0].d.mSurfaceValue, gateSubPage.mAction.mActivate).setSubPage(compressorSubPage)
    page.makeActionBinding(context.btnsRow4[1].d.mSurfaceValue, defaultSubPage.mAction.mActivate).setSubPage(compressorSubPage)
    page.makeActionBinding(context.btnsRow4[2].d.mSurfaceValue, toolsSubPage.mAction.mActivate).setSubPage(compressorSubPage)
    page.makeActionBinding(context.btnsRow4[3].d.mSurfaceValue, saturatorSubPage.mAction.mActivate).setSubPage(compressorSubPage)
    page.makeActionBinding(context.btnsRow4[4].d.mSurfaceValue, limiterSubPage.mAction.mActivate).setSubPage(compressorSubPage)

    page.makeActionBinding(context.btnsRow4[0].d.mSurfaceValue, gateSubPage.mAction.mActivate).setSubPage(toolsSubPage)
    page.makeActionBinding(context.btnsRow4[1].d.mSurfaceValue, compressorSubPage.mAction.mActivate).setSubPage(toolsSubPage)
    page.makeActionBinding(context.btnsRow4[2].d.mSurfaceValue, defaultSubPage.mAction.mActivate).setSubPage(toolsSubPage)
    page.makeActionBinding(context.btnsRow4[3].d.mSurfaceValue, saturatorSubPage.mAction.mActivate).setSubPage(toolsSubPage)
    page.makeActionBinding(context.btnsRow4[4].d.mSurfaceValue, limiterSubPage.mAction.mActivate).setSubPage(toolsSubPage)

    page.makeActionBinding(context.btnsRow4[0].d.mSurfaceValue, gateSubPage.mAction.mActivate).setSubPage(saturatorSubPage)
    page.makeActionBinding(context.btnsRow4[1].d.mSurfaceValue, compressorSubPage.mAction.mActivate).setSubPage(saturatorSubPage)
    page.makeActionBinding(context.btnsRow4[2].d.mSurfaceValue, toolsSubPage.mAction.mActivate).setSubPage(saturatorSubPage)
    page.makeActionBinding(context.btnsRow4[3].d.mSurfaceValue, defaultSubPage.mAction.mActivate).setSubPage(saturatorSubPage)
    page.makeActionBinding(context.btnsRow4[4].d.mSurfaceValue, limiterSubPage.mAction.mActivate).setSubPage(saturatorSubPage)

    page.makeActionBinding(context.btnsRow4[0].d.mSurfaceValue, gateSubPage.mAction.mActivate).setSubPage(limiterSubPage)
    page.makeActionBinding(context.btnsRow4[1].d.mSurfaceValue, compressorSubPage.mAction.mActivate).setSubPage(limiterSubPage)
    page.makeActionBinding(context.btnsRow4[2].d.mSurfaceValue, toolsSubPage.mAction.mActivate).setSubPage(limiterSubPage)
    page.makeActionBinding(context.btnsRow4[3].d.mSurfaceValue, saturatorSubPage.mAction.mActivate).setSubPage(limiterSubPage)
    page.makeActionBinding(context.btnsRow4[4].d.mSurfaceValue, defaultSubPage.mAction.mActivate).setSubPage(limiterSubPage)

    createTransportAndContols(deviceDriver, page, defaultSubPage, context)

    var customVar = page.mCustom.makeHostValueVariable('customVar');
    var selectedTrackChannel = page.mHostAccess.mTrackSelection.mMixerChannel
    var stripEffects = selectedTrackChannel.mInsertAndStripEffects.mStripEffects
    var types = ['mGate', 'mCompressor', 'mTools', 'mSaturator', 'mLimiter'];
    
    for (var i = 0; i < context.numStrips1; i++) {
        page.makeCommandBinding(context.knobs1[i].d.mSurfaceValue, '', '')
        page.makeCommandBinding(context.btnsRow1[i].d.mSurfaceValue, '', '')
        page.makeCommandBinding(context.btnsRow2[i].d.mSurfaceValue, '', '')
        page.makeCommandBinding(context.btnsRow3[i].d.mSurfaceValue, '', '')
    }

    for (var i = 0; i < context.numStrips2; i++) {
        page.makeCommandBinding(context.knobs2[i].d.mSurfaceValue, '', '')
    }

    for (var i = 0; i < 5; i++) {
        var type = types[i];
        makeStripEffectBinding(page, defaultSubPage, customVar, stripEffects[type], context, i)
    }

    var gateButtons = []
    var gateKnobs = []
    stripEffects.mGate.mOnChangePluginIdentity = function (activeDevice, activeMapping, name, vendor, version, formatVersion) {
        var mapping = getChannelStripPluginMappping(name)
        bindEffectKnobsButtons(page, gateSubPage, customVar, stripEffects.mGate, context, activeDevice, activeMapping, gateButtons, gateKnobs, mapping)
    }

    var compButtons = []
    var compKnobs = []
    stripEffects.mCompressor.mOnChangePluginIdentity = function (activeDevice, activeMapping, name, vendor, version, formatVersion) {
        var mapping = getChannelStripPluginMappping(name)
        bindEffectKnobsButtons(page, compressorSubPage, customVar, stripEffects.mCompressor, context, activeDevice, activeMapping, compButtons, compKnobs, mapping)
    }

    var toolsButtons = []
    var toolsKnobs = []
    stripEffects.mTools.mOnChangePluginIdentity = function (activeDevice, activeMapping, name, vendor, version, formatVersion) {
        var mapping = getChannelStripPluginMappping(name)
        bindEffectKnobsButtons(page, toolsSubPage, customVar, stripEffects.mTools, context, activeDevice, activeMapping, toolsButtons, toolsKnobs, mapping)
    }

    var saturatorButtons = []
    var saturatorKnobs = []
    stripEffects.mSaturator.mOnChangePluginIdentity = function (activeDevice, activeMapping, name, vendor, version, formatVersion) {
        var mapping = getChannelStripPluginMappping(name)
        bindEffectKnobsButtons(page, saturatorSubPage, customVar, stripEffects.mSaturator, context, activeDevice, activeMapping, saturatorButtons, saturatorKnobs, mapping)
    }

    var limiterButtons = []
    var limiterKnobs = []
    stripEffects.mLimiter.mOnChangePluginIdentity = function (activeDevice, activeMapping, name, vendor, version, formatVersion) {
        var mapping = getChannelStripPluginMappping(name)
        bindEffectKnobsButtons(page, limiterSubPage, customVar, stripEffects.mLimiter, context, activeDevice, activeMapping, limiterButtons, limiterKnobs, mapping)
    }

    page.mOnActivate = function (activeDevice) {
        context.midiOutput2.sendMidi(activeDevice, [0x90, context.btnsL1L[0].note, 0])
        context.midiOutput2.sendMidi(activeDevice, [0x90, context.btnsL1L[1].note, 0])
        context.midiOutput2.sendMidi(activeDevice, [0x90, context.btnsL1L[2].note, 127])
        context.midiOutput2.sendMidi(activeDevice, [0x90, context.btnsL1L[3].note, 0])
        for (var i = 0; i < context.numStrips1; i++) {
            context.midiOutput1.sendMidi(activeDevice, [0x90, context.btnsRow1[i].note, 0])
            context.midiOutput1.sendMidi(activeDevice, [0x90, context.btnsRow2[i].note, 0])
            context.midiOutput1.sendMidi(activeDevice, [0x90, context.btnsRow3[i].note, 0])
            context.midiOutput1.sendMidi(activeDevice, [0x90, context.btnsRow4[i].note, 0])
        }
    }.bind({ context })

    page.mOnDeactivate = function (activeDevice) {
        context.midiOutput2.sendMidi(activeDevice, [0x90, context.btnsL1L[2].note, 0])
    }.bind({ context })

    gateSubPage.mOnActivate = function (activeDevice) {
        updateEffectsKnobsButtons(context, activeDevice, gateButtons, gateKnobs)
        context.midiOutput1.sendMidi(activeDevice, [0x90, context.btnsRow4[0].note, 127])
        context.midiOutput1.sendMidi(activeDevice, [0x90, context.btnsRow4[1].note, 0])
        context.midiOutput1.sendMidi(activeDevice, [0x90, context.btnsRow4[2].note, 0])
        context.midiOutput1.sendMidi(activeDevice, [0x90, context.btnsRow4[3].note, 0])
        context.midiOutput1.sendMidi(activeDevice, [0x90, context.btnsRow4[4].note, 0])
    }.bind({ context })

    gateSubPage.mOnDeactivate = function (activeDevice) {
        context.midiOutput1.sendMidi(activeDevice, [0x90, context.btnsRow4[0].note, 0])
    }.bind({ context })

    compressorSubPage.mOnActivate = function (activeDevice) {
        updateEffectsKnobsButtons(context, activeDevice, compButtons, compKnobs)
        context.midiOutput1.sendMidi(activeDevice, [0x90, context.btnsRow4[0].note, 0])
        context.midiOutput1.sendMidi(activeDevice, [0x90, context.btnsRow4[1].note, 127])
        context.midiOutput1.sendMidi(activeDevice, [0x90, context.btnsRow4[2].note, 0])
        context.midiOutput1.sendMidi(activeDevice, [0x90, context.btnsRow4[3].note, 0])
        context.midiOutput1.sendMidi(activeDevice, [0x90, context.btnsRow4[4].note, 0])
    }.bind({ context })

    compressorSubPage.mOnDeactivate = function (activeDevice) {
        context.midiOutput1.sendMidi(activeDevice, [0x90, context.btnsRow4[1].note, 0])
    }.bind({ context })

    toolsSubPage.mOnActivate = function (activeDevice) {
        updateEffectsKnobsButtons(context, activeDevice, toolsButtons, toolsKnobs)
        context.midiOutput1.sendMidi(activeDevice, [0x90, context.btnsRow4[0].note, 0])
        context.midiOutput1.sendMidi(activeDevice, [0x90, context.btnsRow4[1].note, 0])
        context.midiOutput1.sendMidi(activeDevice, [0x90, context.btnsRow4[2].note, 127])
        context.midiOutput1.sendMidi(activeDevice, [0x90, context.btnsRow4[3].note, 0])
        context.midiOutput1.sendMidi(activeDevice, [0x90, context.btnsRow4[4].note, 0])
    }.bind({ context })

    toolsSubPage.mOnDeactivate = function (activeDevice) {
        context.midiOutput1.sendMidi(activeDevice, [0x90, context.btnsRow4[2].note, 0])
    }.bind({ context })

    saturatorSubPage.mOnActivate = function (activeDevice) {
        updateEffectsKnobsButtons(context, activeDevice, saturatorButtons, saturatorKnobs)
        context.midiOutput1.sendMidi(activeDevice, [0x90, context.btnsRow4[0].note, 0])
        context.midiOutput1.sendMidi(activeDevice, [0x90, context.btnsRow4[1].note, 0])
        context.midiOutput1.sendMidi(activeDevice, [0x90, context.btnsRow4[2].note, 0])
        context.midiOutput1.sendMidi(activeDevice, [0x90, context.btnsRow4[3].note, 127])
        context.midiOutput1.sendMidi(activeDevice, [0x90, context.btnsRow4[4].note, 0])
    }.bind({ context })

    saturatorSubPage.mOnDeactivate = function (activeDevice) {
        context.midiOutput1.sendMidi(activeDevice, [0x90, context.btnsRow4[3].note, 0])
    }.bind({ context })

    limiterSubPage.mOnActivate = function (activeDevice) {
        context.midiOutput1.sendMidi(activeDevice, [0x90, context.btnsRow4[4].note, 127])
    }.bind({ context })

    limiterSubPage.mOnDeactivate = function (activeDevice) {
        updateEffectsKnobsButtons(context, activeDevice, limiterButtons, limiterKnobs)
        context.midiOutput1.sendMidi(activeDevice, [0x90, context.btnsRow4[0].note, 0])
        context.midiOutput1.sendMidi(activeDevice, [0x90, context.btnsRow4[1].note, 0])
        context.midiOutput1.sendMidi(activeDevice, [0x90, context.btnsRow4[2].note, 0])
        context.midiOutput1.sendMidi(activeDevice, [0x90, context.btnsRow4[3].note, 127])
        context.midiOutput1.sendMidi(activeDevice, [0x90, context.btnsRow4[4].note, 0])
    }.bind({ context })
}

var effectsMapping = {
    'CSR Hall': function () {
        return {
            knobs: ['Mix', 'Diffusion', 'Rvb Time', 'Low Time', 'High Freq', 'High Damp'],
            buttons: ['Bypass'],
            ignore: ['In', 'Out']
        }
    },
    'Dual Spring': function () {
        return {
            knobs: [],
            buttons: ['Bypass', 'Mono A', 'Stretch A', 'Mono B', 'Stretch B'],
            ignore: []
        }
    },
    'RC 48': function () {
        return {
            knobs: [],
            buttons: ['Bypass', 'Algorithm', 'Mix Mode', 'Size Mode'],
            ignore: ['Echo']
        }
    }

}

/**
 * @param {string} name
 */
function getEffectsMappping(name) {
    var mapping = {}
    if (effectsMapping[name]) {
        mapping = effectsMapping[name]()
    }
    else {
        mapping.buttons = []
        mapping.knobs = []
        mapping.ignore = []
    }
    return mapping
}

/**
 * @param {MR_DeviceDriver} deviceDriver 
 * @param {MR_FactoryMappingPage} page 
 * @param {object} context
 */
function makePageInsertEffects(deviceDriver, page, context) {
    var subPageArea = page.makeSubPageArea('InserEffects')
    var defaultSubPage = subPageArea.makeSubPage('default')

    createTransportAndContols(deviceDriver, page, defaultSubPage, context)
    var customVar2 = page.mCustom.makeHostValueVariable('customVar2');
    var insertViewer = page.mHostAccess.mTrackSelection.mMixerChannel.mInsertAndStripEffects.makeInsertEffectViewer('insertsViewer')
    insertViewer.followPluginWindowInFocus()

    for (var i = 0; i < context.numStrips1; i++) {
        page.makeCommandBinding(context.knobs1[i].d.mSurfaceValue, '', '')
        page.makeCommandBinding(context.btnsRow1[i].d.mSurfaceValue, '', '')
        page.makeCommandBinding(context.btnsRow2[i].d.mSurfaceValue, '', '')
        page.makeCommandBinding(context.btnsRow3[i].d.mSurfaceValue, '', '')
    }

    for (var i = 0; i < context.numStrips2; i++) {
        page.makeCommandBinding(context.knobs2[i].d.mSurfaceValue, '', '')
    }

    for (var i= 0; i < 8 ; i++) {
        var insertSlot = page.mHostAccess.mTrackSelection.mMixerChannel.mInsertAndStripEffects.makeInsertEffectViewer('insertsSlot' + 1)
        var slot = insertSlot.accessSlotAtIndex(i)
        page.makeValueBinding(context.btnsRow4[i].d.mSurfaceValue, slot.mEdit).setTypeToggle()
    }

    var buttons = []
    var knobs = []
    insertViewer.mOnChangePluginIdentity = function (activeDevice, activeMapping, name, vendor, version, format) {
        // var arr = ["name:", name, "vendor:", vendor, "version:", version, "format:", format]
        // console.log(arr.join(' '))
        var mapping = getEffectsMappping(name)
        bindEffectKnobsButtons(page, defaultSubPage, customVar2, insertViewer, context, activeDevice, activeMapping, buttons, knobs, mapping)
    }

    page.mOnActivate = function (activeDevice, activeMapping) {
        context.midiOutput2.sendMidi(activeDevice, [0x90, context.btnsL1L[0].note, 0])
        context.midiOutput2.sendMidi(activeDevice, [0x90, context.btnsL1L[1].note, 0])
        context.midiOutput2.sendMidi(activeDevice, [0x90, context.btnsL1L[2].note, 0])
        context.midiOutput2.sendMidi(activeDevice, [0x90, context.btnsL1L[3].note, 127])

        for (var i = 0; i < context.numStrips1; i++) {
            context.midiOutput1.sendMidi(activeDevice, [0x90, context.btnsRow1[i].note, 0])
            context.midiOutput1.sendMidi(activeDevice, [0x90, context.btnsRow2[i].note, 0])
            context.midiOutput1.sendMidi(activeDevice, [0x90, context.btnsRow3[i].note, 0])
        }

    }

    page.mOnDeactivate = function (activeDevice) {
        context.midiOutput2.sendMidi(activeDevice, [0x90, context.btnsL1L[3].note, 0])
    }.bind({ context })
}
createSurfaceElements(deviceDriver, context)

var mixerPage = deviceDriver.mMapping.makePage('Mixer')
var eqPage = deviceDriver.mMapping.makePage('EQ')
var cueSendsPage = deviceDriver.mMapping.makePage('CueSends')
var channelStripPage = deviceDriver.mMapping.makePage('ChannelStrip')
var insertEffectsPage = deviceDriver.mMapping.makePage('InsertEffects')
makePageMixer(deviceDriver, mixerPage, context)
makePageEQ(deviceDriver, eqPage, context)
makePageCueSends(deviceDriver, cueSendsPage, context)
makePageChannelStrip(deviceDriver, channelStripPage, context)
makePageInsertEffects(deviceDriver, insertEffectsPage, context)

mixerPage.makeActionBinding(context.btnsL1L[0].d.mSurfaceValue, eqPage.mAction.mActivate)
mixerPage.makeActionBinding(context.btnsL1L[1].d.mSurfaceValue, cueSendsPage.mAction.mActivate)
mixerPage.makeActionBinding(context.btnsL1L[2].d.mSurfaceValue, channelStripPage.mAction.mActivate)
mixerPage.makeActionBinding(context.btnsL1L[3].d.mSurfaceValue, insertEffectsPage.mAction.mActivate)

eqPage.makeActionBinding(context.btnsL1L[0].d.mSurfaceValue, mixerPage.mAction.mActivate)
eqPage.makeActionBinding(context.btnsL1L[1].d.mSurfaceValue, cueSendsPage.mAction.mActivate)
eqPage.makeActionBinding(context.btnsL1L[2].d.mSurfaceValue, channelStripPage.mAction.mActivate)
eqPage.makeActionBinding(context.btnsL1L[3].d.mSurfaceValue, insertEffectsPage.mAction.mActivate)

cueSendsPage.makeActionBinding(context.btnsL1L[0].d.mSurfaceValue, eqPage.mAction.mActivate)
cueSendsPage.makeActionBinding(context.btnsL1L[1].d.mSurfaceValue, mixerPage.mAction.mActivate)
cueSendsPage.makeActionBinding(context.btnsL1L[2].d.mSurfaceValue, channelStripPage.mAction.mActivate)
cueSendsPage.makeActionBinding(context.btnsL1L[3].d.mSurfaceValue, insertEffectsPage.mAction.mActivate)

channelStripPage.makeActionBinding(context.btnsL1L[0].d.mSurfaceValue, eqPage.mAction.mActivate)
channelStripPage.makeActionBinding(context.btnsL1L[1].d.mSurfaceValue, cueSendsPage.mAction.mActivate)
channelStripPage.makeActionBinding(context.btnsL1L[2].d.mSurfaceValue, mixerPage.mAction.mActivate)
channelStripPage.makeActionBinding(context.btnsL1L[3].d.mSurfaceValue, insertEffectsPage.mAction.mActivate)

insertEffectsPage.makeActionBinding(context.btnsL1L[0].d.mSurfaceValue, eqPage.mAction.mActivate)
insertEffectsPage.makeActionBinding(context.btnsL1L[1].d.mSurfaceValue, cueSendsPage.mAction.mActivate)
insertEffectsPage.makeActionBinding(context.btnsL1L[2].d.mSurfaceValue, channelStripPage.mAction.mActivate)
insertEffectsPage.makeActionBinding(context.btnsL1L[3].d.mSurfaceValue, mixerPage.mAction.mActivate)
