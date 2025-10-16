var isSurfaceElementsInitialized = false
var isZoom = false
var isMarker = false

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
    console.log('Icontrols - iCON - Activated')
    if (isSurfaceElementsInitialized) {
        context.midiOutput2.sendMidi(activeDevice, [0x90, context.btnsL1U[0].note, 0])
        context.midiOutput2.sendMidi(activeDevice, [0x90, context.btnsL1U[1].note, 0])
        context.midiOutput2.sendMidi(activeDevice, [0x90, context.btnsL1L[0].note, 0])
        context.midiOutput1.sendMidi(activeDevice, [0x90, context.btnsRow2[0].note, 0])
        context.midiOutput1.sendMidi(activeDevice, [0x90, context.btnsRow3[0].note, 0])
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
 * @param {boolean} withLamp
 */
function makeButton(surface, midiInput, midiOutput, note, x, y, w, h, withLamp) {
    var button = {}
    button.note = note

    if (withLamp) {
        button.d = surface.makeButton(x, y, w, h - 1)
        button.l = surface.makeLamp(x, y + h - 1, w, 1)
        button.v = surface.makeCustomValueVariable("note" + note)
    }
    else {
        button.d = surface.makeButton(x, y, w, h)
        button.v = surface.makeCustomValueVariable("note" + note)
    }

    button.d.mSurfaceValue.mMidiBinding.setIsConsuming(true).setInputPort(midiInput).bindToNote(0, note)
    button.x = x
    button.y = y
    button.w = w
    button.h = h
    button.state = false

    button.d.mSurfaceValue.mOnProcessValueChange = function (/** @type {MR_ActiveDevice} */activeDevice) {
        var value = button.d.mSurfaceValue.getProcessValue(activeDevice)
        this.midiOutput.sendMidi(activeDevice, [0x90, this.note, value])
        if (withLamp) {
            if (value > 0) {
                button.l.mSurfaceValue.setProcessValue(activeDevice, 1)
            }
            else {
                button.l.mSurfaceValue.setProcessValue(activeDevice, 0)
            }
        }
    }.bind({ midiOutput, note })

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
    context.btnStart = makeButton(deviceDriver.mSurface, midiInput, midiOutput, 0x5E, x, y, w, h, false)
    context.btnStop = makeButton(deviceDriver.mSurface, midiInput, midiOutput, 0x5D, x + 5, y, w, h, false)
    context.btnRecord = makeButton(deviceDriver.mSurface, midiInput, midiOutput, 0x5F, x + 10, y, w, h, false)
    context.btnRewind = makeButton(deviceDriver.mSurface, midiInput, midiOutput, 0x5B, x + 15, y, w, h, false)
    context.btnForward = makeButton(deviceDriver.mSurface, midiInput, midiOutput, 0x5C, x + 20, y, w, h, false)
    context.btnBankPrev = makeButton(deviceDriver.mSurface, midiInput, midiOutput, 0x2E, x + 25, y, w, h, false)
    context.btnBankNext = makeButton(deviceDriver.mSurface, midiInput, midiOutput, 0x2F, x + 30, y, w, h, false)
    context.btnUp = makeButton(deviceDriver.mSurface, midiInput, midiOutput, 0x60, x + 35, y, w, h, false)
    context.btnDown = makeButton(deviceDriver.mSurface, midiInput, midiOutput, 0x61, x + 40, y, w, h, false)
    context.btnLeft = makeButton(deviceDriver.mSurface, midiInput, midiOutput, 0x62, x + 45, y, w, h, false)
    context.btnRight = makeButton(deviceDriver.mSurface, midiInput, midiOutput, 0x63, x + 50, y, w, h, false)
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
        context.btnsL1U[i] = makeButton(deviceDriver.mSurface, midiInput, midiOutput, 0 + i, x + i * 7 - 3, y + 18, w, h, true)
        context.btnsL1L[i] = makeButton(deviceDriver.mSurface, midiInput, midiOutput, 9 + i, x + i * 7 - 3, y + 22, w, h, true)
        // context.btnsL2U[i] = makeButton(deviceDriver.mSurface, midiInput, midiOutput, 18 + i, x + i * 7 - 3, y + 18, w, h, true)
        // context.btnsL2L[i] = makeButton(deviceDriver.mSurface, midiInput, midiOutput, 27 + i, x + i * 7 - 3, y + 22, w, h, true)
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
 * @param {MR_SubPage} defaultSubPage 
 * @param {object} context 
 * @returns
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
 * 
 * @param {MR_DeviceDriver} deviceDriver 
 * @param {MR_FactoryMappingPage} page 
 * @param {object} context 
 * @returns
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

    page.makeActionBinding(context.defaultVariable, defaultSubPage.mAction.mActivate)
    page.makeActionBinding(context.zoomVariable, zoomSubPage.mAction.mActivate)
    page.makeActionBinding(context.markerVariable, markerSubPage.mAction.mActivate)

    //zoomButton -> subpage.zoomSubPage
    var dummyZoomBtn = deviceDriver.mSurface.makeButton(context.btnsL1U[0].x, context.btnsL1U[0].y, context.btnsL1U[0].w, context.btnsL1U[0].h - 1)
    page.makeCommandBinding(dummyZoomBtn.mSurfaceValue, 'Tool', 'Zoom Tool').setSubPage(defaultSubPage) //dummy bind
    context.btnsL1U[0].d.mSurfaceValue.mOnProcessValueChange = function (activeDevice, value) {
        if (value === 0) {
            isZoom = !isZoom
            context.markerVariable.setProcessValue(activeDevice, isZoom ? 1 : 0)
            context.midiOutput2.sendMidi(activeDevice, [0x90, context.btnsL1U[0].note, isZoom ? 127 : 0])
            context.midiOutput2.sendMidi(activeDevice, [0x90, context.btnsL1U[1].note, 0])
            context.btnsL1U[0].l.mSurfaceValue.setProcessValue(activeDevice, isZoom ? 1 : 0)
            isMarker = false;
        }
    }

    //markerButton -> subpage.markerSubPage
    var dummyMarkerBtn = deviceDriver.mSurface.makeButton(context.btnsL1U[1].x, context.btnsL1U[1].y, context.btnsL1U[1].w, context.btnsL1U[1].h - 1)
    page.makeCommandBinding(dummyMarkerBtn.mSurfaceValue, 'AddTrack', 'Marker').setSubPage(defaultSubPage) //dummy bind
    context.btnsL1U[1].d.mSurfaceValue.mOnProcessValueChange = function (activeDevice, value) {
        if (value === 0) {
            isMarker = !isMarker
            context.markerVariable.setProcessValue(activeDevice, isMarker ? 1 : 0)
            context.midiOutput2.sendMidi(activeDevice, [0x90, context.btnsL1U[0].note, 0])
            context.midiOutput2.sendMidi(activeDevice, [0x90, context.btnsL1U[1].note, isMarker ? 127 : 0])
            context.btnsL1U[1].l.mSurfaceValue.setProcessValue(activeDevice, isMarker ? 1 : 0)
            isZoom = false;
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

        var knobSurfaceValue = context.knobs1[i].mSurfaceValue
        var faderSurfaceValue = context.faders1[i].mSurfaceValue
        var mute_buttonSurfaceValue = context.btnsRow1[i].d.mSurfaceValue
        var solo_buttonSurfaceValue = context.btnsRow2[i].d.mSurfaceValue
        var rec_buttonSurfaceValue = context.btnsRow3[i].d.mSurfaceValue
        var sel_buttonSurfaceValue = context.btnsRow4[i].d.mSurfaceValue

        page.makeValueBinding(knobSurfaceValue, hostMixerBankChannel.mValue.mPan).setValueTakeOverModeScaled().setSubPage(defaultSubPage)
        page.makeValueBinding(faderSurfaceValue, hostMixerBankChannel.mValue.mVolume).setValueTakeOverModeJump().setSubPage(defaultSubPage)
        page.makeValueBinding(mute_buttonSurfaceValue, hostMixerBankChannel.mValue.mMute).setTypeToggle().setSubPage(defaultSubPage)
        page.makeValueBinding(solo_buttonSurfaceValue, hostMixerBankChannel.mValue.mSolo).setTypeToggle().setSubPage(defaultSubPage)
        page.makeValueBinding(rec_buttonSurfaceValue, hostMixerBankChannel.mValue.mRecordEnable).setTypeToggle().setSubPage(defaultSubPage)
        page.makeValueBinding(sel_buttonSurfaceValue, hostMixerBankChannel.mValue.mSelected).setTypeToggle().setSubPage(defaultSubPage)
    }

    page.mOnActivate = function (/** @type {MR_ActiveDevice} */activeDevice) {
        console.log('Mixer Page Activated')
        context.midiOutput2.sendMidi(activeDevice, [0x90, context.btnsL1L[0].note, 0])
        context.midiOutput2.sendMidi(activeDevice, [0x90, context.btnsL1L[1].note, 0])
        context.midiOutput2.sendMidi(activeDevice, [0x90, context.btnsL1L[2].note, 0])
        context.midiOutput2.sendMidi(activeDevice, [0x90, context.btnsL1L[3].note, 0])
        context.midiOutput2.sendMidi(activeDevice, [0x90, context.btnsL1U[0].note, 0])
        context.midiOutput2.sendMidi(activeDevice, [0x90, context.btnsL1U[1].note, 0])
    }.bind({ context })
}

/**
 * 
 * @param {MR_FactoryMappingPage} page 
 * @param {MR_SubPage} defaultSubPage
 * @param {MR_SubPage} preFilterSupPage
 * @param {MR_PreFilter} preFilter 
 * @param {object} context 
 */
function makeSubPagePrefilter(page, defaultSubPage, preFilterSupPage, preFilter, context) {

    page.makeValueBinding(context.btnsRow1[0].d.mSurfaceValue, preFilter.mBypass).setTypeToggle().setSubPage(defaultSubPage)
    page.makeValueBinding(context.btnsRow2[0].d.mSurfaceValue, preFilter.mHighCutOn).setTypeToggle().setSubPage(preFilterSupPage)
    page.makeValueBinding(context.knobs1[0].mSurfaceValue, preFilter.mHighCutFreq).setSubPage(preFilterSupPage)
    page.makeValueBinding(context.knobs1[1].mSurfaceValue, preFilter.mHighCutSlope).setSubPage(preFilterSupPage)
    page.makeValueBinding(context.btnsRow3[0].d.mSurfaceValue, preFilter.mLowCutOn).setTypeToggle().setSubPage(preFilterSupPage)
    page.makeValueBinding(context.knobs1[2].mSurfaceValue, preFilter.mLowCutFreq).setSubPage(preFilterSupPage)
    page.makeValueBinding(context.knobs1[3].mSurfaceValue, preFilter.mLowCutSlope).setSubPage(preFilterSupPage)
    page.makeValueBinding(context.knobs1[4].mSurfaceValue, preFilter.mGain).setSubPage(preFilterSupPage)
    page.makeValueBinding(context.btnsRow4[0].d.mSurfaceValue, preFilter.mPhaseSwitch).setTypeToggle().setSubPage(preFilterSupPage)
    for (var i = 5; i < context.numStrips1; i++) {
        page.makeCommandBinding(context.knobs1[i].mSurfaceValue, 'Video', 'Mute all vdeo tracks').setSubPage(preFilterSupPage) //dummy bind
    }
}

/**
 * 
 * @param {MR_FactoryMappingPage} page 
 * @param {MR_SubPage} defaultSubPage 
 * @param {MR_ChannelEQBand} band 
 * @param {number} idx
 * @param {object} context
 */
function makeSubPageEQBand(page, defaultSubPage, band, idx, context) {
    page.makeValueBinding(context.btnsRow1[idx].d.mSurfaceValue, band.mOn).setTypeToggle().setSubPage(defaultSubPage)
    var auxVar = page.mCustom.makeHostValueVariable("auxVar");
    context.btnsRow2[idx].auxVar = page.mCustom.makeHostValueVariable("auxVar2" + idx);
    context.btnsRow3[idx].auxVar = page.mCustom.makeHostValueVariable("auxVar3" + idx);

    context.btnsRow4[idx].customVariable = deviceDriver.mSurface.makeCustomValueVariable('inc' + idx.toString())
    context.btnsRow4[idx].customValue = 0;
    context.btnsRow4[idx].customValueMax = 1;
    context.btnsRow4[idx].customMapping = page.makeValueBinding(context.btnsRow4[idx].customVariable, band.mFilterType).setSubPage(defaultSubPage)
    context.btnsRow4[idx].customMapping.setSubPage(defaultSubPage)

    band.mFilterType.mOnDisplayValueChange = function (activeDevice, activeMapping, arg2, arg4) {
        if (idx === 1) {
            context.btnsRow4[idx].customValueMax = 7;
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
                    if (arg2 === null || arg2 === "") {
                        break
                    }

                    console.log('Unkown filter ' + idx + ' type: ' + arg2 + " ," + arg4);
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
                    if (arg2 === null || arg2 === "") {
                        break
                    }
                    console.log('Unkown filter ' + idx + ' type: ' + arg2 + " ," + arg4);
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
                    if (arg2 === null || arg2 === "") {
                        break
                    }
                    console.log('Unkown filter ' + idx + ' type: ' + arg2 + " ," + arg4);
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
                    if (arg2 === null || arg2 === "") {
                        break
                    }
                    console.log('Unkown filter ' + idx + ' type: ' + arg2 + " ," + arg4);
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
    page.makeValueBinding(context.knobs1[(idx - 1) * 2].mSurfaceValue, band.mFreq).setSubPage(defaultSubPage)
    page.makeValueBinding(context.knobs1[(idx - 1) * 2 + 1].mSurfaceValue, band.mQ).setSubPage(defaultSubPage)
}

/**
 * 
 * @param {MR_DeviceDriver} deviceDriver 
 * @param {MR_FactoryMappingPage} page 
 * @param {object} context 
 * @returns
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

    page.mOnActivate = function (/** @type {MR_ActiveDevice} */activeDevice) {
        context.midiOutput2.sendMidi(activeDevice, [0x90, context.btnsL1L[0].note, 127])
        context.midiOutput2.sendMidi(activeDevice, [0x90, context.btnsL1L[1].note, 0])
        context.midiOutput2.sendMidi(activeDevice, [0x90, context.btnsL1L[2].note, 0])
        context.midiOutput2.sendMidi(activeDevice, [0x90, context.btnsL1U[0].note, 0])
    }.bind({ context })

    page.mOnDeactivate = function (/** @type {MR_ActiveDevice} */activeDevice) {
        context.midiOutput2.sendMidi(activeDevice, [0x90, context.btnsL1L[0].note, 0])
    }.bind({ context })

    preFilterSubPage.mOnActivate = function (/** @type {MR_ActiveDevice} */ activeDevice) {
        context.midiOutput2.sendMidi(activeDevice, [0x90, context.btnsL1U[0].note, 127])
    }.bind({ context })

    preFilterSubPage.mOnDeactivate = function (/** @type {MR_ActiveDevice} */ activeDevice) {
        context.midiOutput2.sendMidi(activeDevice, [0x90, context.btnsL1U[0].note, 0])
    }.bind({ context })
}

/**
 * 
 * @param {MR_DeviceDriver} deviceDriver 
 * @param {MR_FactoryMappingPage} page 
 * @param {object} context
 * @returns
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
        page.makeValueBinding(context.knobs1[idx * 2].mSurfaceValue, cueSendSlot.mPan).setSubPage(defaultSubPage)
        page.makeValueBinding(context.knobs1[idx * 2 + 1].mSurfaceValue, cueSendSlot.mLevel).setSubPage(defaultSubPage)
    }

    for (var idx = 0; idx < 8; idx++) {
        var sendSlot = selectedTrackChannel.mSends.getByIndex(idx)
        page.makeValueBinding(context.btnsRow1[idx].d.mSurfaceValue, sendSlot.mOn).setTypeToggle().setSubPage(sendsSubPage)
        page.makeValueBinding(context.btnsRow2[idx].d.mSurfaceValue, sendSlot.mPrePost).setTypeToggle().setSubPage(sendsSubPage)
        page.makeValueBinding(context.knobs1[idx].mSurfaceValue, sendSlot.mLevel).setSubPage(sendsSubPage)
    }

    page.mOnActivate = function (/** @type {MR_ActiveDevice} */activeDevice) {
        context.midiOutput2.sendMidi(activeDevice, [0x90, context.btnsL1L[0].note, 0])
        context.midiOutput2.sendMidi(activeDevice, [0x90, context.btnsL1L[1].note, 127])
        context.midiOutput2.sendMidi(activeDevice, [0x90, context.btnsL1L[2].note, 0])
        context.midiOutput2.sendMidi(activeDevice, [0x90, context.btnsL1L[3].note, 0])
        context.midiOutput2.sendMidi(activeDevice, [0x90, context.btnsL1L[2].note, 0])
        context.midiOutput2.sendMidi(activeDevice, [0x90, context.btnsL1U[0].note, 0])
    }.bind({ context })

    page.mOnDeactivate = function (/** @type {MR_ActiveDevice} */activeDevice) {
        context.midiOutput2.sendMidi(activeDevice, [0x90, context.btnsL1L[1].note, 0])
    }.bind({ context })

    sendsSubPage.mOnActivate = function (/** @type {MR_ActiveDevice} */ activeDevice) {
        context.midiOutput2.sendMidi(activeDevice, [0x90, context.btnsL1U[0].note, 127])
    }.bind({ context })

    sendsSubPage.mOnDeactivate = function (/** @type {MR_ActiveDevice} */ activeDevice) {
        context.midiOutput2.sendMidi(activeDevice, [0x90, context.btnsL1U[0].note, 0])
    }.bind({ context })
}


/**
 * 
 * @param {MR_FactoryMappingPage} page 
 * @param {MR_SubPage} subPage
 * @param {MR_HostValueUndefined} customVar
 * @parm {MR_HostObject} stripEffect
 * @param {object} context
 * @param {number} idx
 * @returns
 */
function makeStripEffectBinding(page, subPage, customVar, stripEffectType, context, idx) {
    var dam = page.mHostAccess.makeDirectAccess(stripEffectType);

    page.makeValueBinding(context.btnsRow1[idx].d.mSurfaceValue, stripEffectType.mOn).setTypeToggle().setSubPage(subPage)
    page.makeValueBinding(context.btnsRow2[idx].d.mSurfaceValue, stripEffectType.mBypass).setTypeToggle().setSubPage(subPage)

    var b = page.makeValueBinding(context.btnsRow3[idx].d.mSurfaceValue, customVar).setSubPage(subPage)
    page.makeValueBinding(context.btnsRow3[idx].d.mSurfaceValue, customVar).mOnValueChange = function (activeDevice, activeMapping, arg2) {
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

/**
 * 
 * @param {MR_DeviceDriver} deviceDriver 
 * @param {MR_FactoryMappingPage} page 
 * @param {object} context
 * @returns
 */
function makePageChannelStrip(deviceDriver, page, context) {
    var subPageArea = page.makeSubPageArea('ChannelStrip')
    var defaultSubPage = subPageArea.makeSubPage('default')
    var gateSubPage = subPageArea.makeSubPage('gate')
    var compressorSubPage = subPageArea.makeSubPage('compressor')
    var toolsSubPage = subPageArea.makeSubPage('tools')
    var saturatorubPage = subPageArea.makeSubPage('saturator')
    var limiterSubPage = subPageArea.makeSubPage('limiter')

    page.makeActionBinding(context.btnsRow4[0].d.mSurfaceValue, gateSubPage.mAction.mActivate).setSubPage(defaultSubPage)
    page.makeActionBinding(context.btnsRow4[1].d.mSurfaceValue, compressorSubPage.mAction.mActivate).setSubPage(defaultSubPage)
    page.makeActionBinding(context.btnsRow4[2].d.mSurfaceValue, toolsSubPage.mAction.mActivate).setSubPage(defaultSubPage)
    page.makeActionBinding(context.btnsRow4[3].d.mSurfaceValue, saturatorubPage.mAction.mActivate).setSubPage(defaultSubPage)
    page.makeActionBinding(context.btnsRow4[4].d.mSurfaceValue, limiterSubPage.mAction.mActivate).setSubPage(defaultSubPage)

    page.makeActionBinding(context.btnsRow4[0].d.mSurfaceValue, defaultSubPage.mAction.mActivate).setSubPage(gateSubPage)
    page.makeActionBinding(context.btnsRow4[1].d.mSurfaceValue, compressorSubPage.mAction.mActivate).setSubPage(gateSubPage)
    page.makeActionBinding(context.btnsRow4[2].d.mSurfaceValue, toolsSubPage.mAction.mActivate).setSubPage(gateSubPage)
    page.makeActionBinding(context.btnsRow4[3].d.mSurfaceValue, saturatorubPage.mAction.mActivate).setSubPage(gateSubPage)
    page.makeActionBinding(context.btnsRow4[4].d.mSurfaceValue, limiterSubPage.mAction.mActivate).setSubPage(gateSubPage)

    page.makeActionBinding(context.btnsRow4[0].d.mSurfaceValue, gateSubPage.mAction.mActivate).setSubPage(compressorSubPage)
    page.makeActionBinding(context.btnsRow4[1].d.mSurfaceValue, defaultSubPage.mAction.mActivate).setSubPage(compressorSubPage)
    page.makeActionBinding(context.btnsRow4[2].d.mSurfaceValue, toolsSubPage.mAction.mActivate).setSubPage(compressorSubPage)
    page.makeActionBinding(context.btnsRow4[3].d.mSurfaceValue, saturatorubPage.mAction.mActivate).setSubPage(compressorSubPage)
    page.makeActionBinding(context.btnsRow4[4].d.mSurfaceValue, limiterSubPage.mAction.mActivate).setSubPage(compressorSubPage)

    page.makeActionBinding(context.btnsRow4[0].d.mSurfaceValue, gateSubPage.mAction.mActivate).setSubPage(toolsSubPage)
    page.makeActionBinding(context.btnsRow4[1].d.mSurfaceValue, compressorSubPage.mAction.mActivate).setSubPage(toolsSubPage)
    page.makeActionBinding(context.btnsRow4[2].d.mSurfaceValue, defaultSubPage.mAction.mActivate).setSubPage(toolsSubPage)
    page.makeActionBinding(context.btnsRow4[3].d.mSurfaceValue, saturatorubPage.mAction.mActivate).setSubPage(toolsSubPage)
    page.makeActionBinding(context.btnsRow4[4].d.mSurfaceValue, limiterSubPage.mAction.mActivate).setSubPage(toolsSubPage)

    page.makeActionBinding(context.btnsRow4[0].d.mSurfaceValue, gateSubPage.mAction.mActivate).setSubPage(saturatorubPage)
    page.makeActionBinding(context.btnsRow4[1].d.mSurfaceValue, compressorSubPage.mAction.mActivate).setSubPage(saturatorubPage)
    page.makeActionBinding(context.btnsRow4[2].d.mSurfaceValue, toolsSubPage.mAction.mActivate).setSubPage(saturatorubPage)
    page.makeActionBinding(context.btnsRow4[3].d.mSurfaceValue, defaultSubPage.mAction.mActivate).setSubPage(saturatorubPage)
    page.makeActionBinding(context.btnsRow4[4].d.mSurfaceValue, limiterSubPage.mAction.mActivate).setSubPage(saturatorubPage)

    page.makeActionBinding(context.btnsRow4[0].d.mSurfaceValue, gateSubPage.mAction.mActivate).setSubPage(limiterSubPage)
    page.makeActionBinding(context.btnsRow4[1].d.mSurfaceValue, compressorSubPage.mAction.mActivate).setSubPage(limiterSubPage)
    page.makeActionBinding(context.btnsRow4[2].d.mSurfaceValue, toolsSubPage.mAction.mActivate).setSubPage(limiterSubPage)
    page.makeActionBinding(context.btnsRow4[3].d.mSurfaceValue, saturatorubPage.mAction.mActivate).setSubPage(limiterSubPage)
    page.makeActionBinding(context.btnsRow4[4].d.mSurfaceValue, defaultSubPage.mAction.mActivate).setSubPage(limiterSubPage)


    createTransportAndContols(deviceDriver, page, defaultSubPage, context)
    var customVar = page.mCustom.makeHostValueVariable("customVar");
    var selectedTrackChannel = page.mHostAccess.mTrackSelection.mMixerChannel
    var stripEffects = selectedTrackChannel.mInsertAndStripEffects.mStripEffects
    var types = ['mGate', 'mCompressor', 'mTools', 'mSaturator', 'mLimiter'];

    for (var i = 0; i < 5; i++) {
        var type = types[i];
        makeStripEffectBinding(page, defaultSubPage, customVar, stripEffects[type], context, i)
    }

    for (var i = 0; i < context.numStrips2; i++) {
        var gate = stripEffects.mGate.mParameterBankZone.makeParameterValue()
        var compressor = stripEffects.mCompressor.mParameterBankZone.makeParameterValue()
        var tools = stripEffects.mTools.mParameterBankZone.makeParameterValue()
        var saturator = stripEffects.mSaturator.mParameterBankZone.makeParameterValue()
        var limiter = stripEffects.mLimiter.mParameterBankZone.makeParameterValue()
        page.makeValueBinding(context.knobs2[i].mSurfaceValue, gate).setSubPage(gateSubPage)
        page.makeValueBinding(context.knobs2[i].mSurfaceValue, compressor).setSubPage(compressorSubPage)
        page.makeValueBinding(context.knobs2[i].mSurfaceValue, tools).setSubPage(toolsSubPage)
        page.makeValueBinding(context.knobs2[i].mSurfaceValue, saturator).setSubPage(saturatorubPage)
        page.makeValueBinding(context.knobs2[i].mSurfaceValue, limiter).setSubPage(limiterSubPage)
    }

    for (var i = 0; i < context.numStrips1; i++) {
        var gate = stripEffects.mGate.mParameterBankZone.makeParameterValue()
        var compressor = stripEffects.mCompressor.mParameterBankZone.makeParameterValue()
        var tools = stripEffects.mTools.mParameterBankZone.makeParameterValue()
        var saturator = stripEffects.mSaturator.mParameterBankZone.makeParameterValue()
        var limiter = stripEffects.mLimiter.mParameterBankZone.makeParameterValue()
        page.makeValueBinding(context.knobs1[i].mSurfaceValue, gate).setSubPage(gateSubPage)
        page.makeValueBinding(context.knobs1[i].mSurfaceValue, compressor).setSubPage(compressorSubPage)
        page.makeValueBinding(context.knobs1[i].mSurfaceValue, tools).setSubPage(toolsSubPage)
        page.makeValueBinding(context.knobs1[i].mSurfaceValue, saturator).setSubPage(saturatorubPage)
        page.makeValueBinding(context.knobs1[i].mSurfaceValue, limiter).setSubPage(limiterSubPage)
    }

    page.mOnActivate = function (/** @type {MR_ActiveDevice} */activeDevice) {
        context.midiOutput2.sendMidi(activeDevice, [0x90, context.btnsL1L[0].note, 0])
        context.midiOutput2.sendMidi(activeDevice, [0x90, context.btnsL1L[1].note, 0])
        context.midiOutput2.sendMidi(activeDevice, [0x90, context.btnsL1L[2].note, 127])
        context.midiOutput2.sendMidi(activeDevice, [0x90, context.btnsL1L[3].note, 0])
        context.midiOutput1.sendMidi(activeDevice, [0x90, context.btnsRow4[0].note, 0])
        context.midiOutput1.sendMidi(activeDevice, [0x90, context.btnsRow4[1].note, 0])
        context.midiOutput1.sendMidi(activeDevice, [0x90, context.btnsRow4[2].note, 0])
        context.midiOutput1.sendMidi(activeDevice, [0x90, context.btnsRow4[3].note, 0])
        context.midiOutput1.sendMidi(activeDevice, [0x90, context.btnsRow4[4].note, 0])
    }.bind({ context })

    page.mOnDeactivate = function (/** @type {MR_ActiveDevice} */activeDevice) {
        context.midiOutput2.sendMidi(activeDevice, [0x90, context.btnsL1L[2].note, 0])
    }.bind({ context })

    gateSubPage.mOnActivate = function (/** @type {MR_ActiveDevice} */ activeDevice) {
        context.midiOutput1.sendMidi(activeDevice, [0x90, context.btnsRow4[0].note, 127])
    }.bind({ context })

    gateSubPage.mOnDeactivate = function (/** @type {MR_ActiveDevice} */ activeDevice) {
        context.midiOutput1.sendMidi(activeDevice, [0x90, context.btnsRow4[0].note, 0])
    }.bind({ context })

    compressorSubPage.mOnActivate = function (/** @type {MR_ActiveDevice} */ activeDevice) {
        context.midiOutput1.sendMidi(activeDevice, [0x90, context.btnsRow4[1].note, 127])
    }.bind({ context })

    compressorSubPage.mOnDeactivate = function (/** @type {MR_ActiveDevice} */ activeDevice) {
        context.midiOutput1.sendMidi(activeDevice, [0x90, context.btnsRow4[1].note, 0])
    }.bind({ context })

    toolsSubPage.mOnActivate = function (/** @type {MR_ActiveDevice} */ activeDevice) {
        context.midiOutput1.sendMidi(activeDevice, [0x90, context.btnsRow4[2].note, 127])
    }.bind({ context })

    toolsSubPage.mOnDeactivate = function (/** @type {MR_ActiveDevice} */ activeDevice) {
        context.midiOutput1.sendMidi(activeDevice, [0x90, context.btnsRow4[2].note, 0])
    }.bind({ context })

    saturatorubPage.mOnActivate = function (/** @type {MR_ActiveDevice} */ activeDevice) {
        context.midiOutput1.sendMidi(activeDevice, [0x90, context.btnsRow4[3].note, 127])
    }.bind({ context })

    saturatorubPage.mOnDeactivate = function (/** @type {MR_ActiveDevice} */ activeDevice) {
        context.midiOutput1.sendMidi(activeDevice, [0x90, context.btnsRow4[3].note, 0])
    }.bind({ context })

    limiterSubPage.mOnActivate = function (/** @type {MR_ActiveDevice} */ activeDevice) {
        context.midiOutput1.sendMidi(activeDevice, [0x90, context.btnsRow4[4].note, 127])
    }.bind({ context })

    limiterSubPage.mOnDeactivate = function (/** @type {MR_ActiveDevice} */ activeDevice) {
        context.midiOutput1.sendMidi(activeDevice, [0x90, context.btnsRow4[4].note, 0])
    }.bind({ context })
}

/**
 * 
 * @param {MR_DeviceDriver} deviceDriver 
 * @param {MR_FactoryMappingPage} page 
 * @param {object} context
 * @returns
 */
function makePageInsertEffects(deviceDriver, page, context) {
    var subPageArea = page.makeSubPageArea('InserEffects')
    var defaultSubPage = subPageArea.makeSubPage('default')

    createTransportAndContols(deviceDriver, page, defaultSubPage, context)
    var customVar = page.mCustom.makeHostValueVariable("customVar");

    var lstOfNonEmptySlotsBeforeActivation = []

    var insertsViewer = page.mHostAccess.mTrackSelection.mMixerChannel.mInsertAndStripEffects.makeInsertEffectViewer("insertsViewer")
    insertsViewer.followPluginWindowInFocus()

    for (var i = 0; i < context.numStrips1; i++) {
        var insertSlot = page.mHostAccess.mTrackSelection.mMixerChannel.mInsertAndStripEffects.makeInsertEffectViewer("insertSlot" + i)
        insertSlot.accessSlotAtIndex(i)
        page.makeValueBinding(context.btnsRow1[i].d.mSurfaceValue, insertSlot.mEdit).setTypeToggle().setSubPage(defaultSubPage)
        insertSlot.mOnChangePluginIdentity = function (activeDevice, activeMapping, pluginName, pluginVendor, pluginVersion, formatVersion) {
            if (pluginName == "") {
                //context.midiOutput1.sendMidi(activeDevice, [0x90, context.btnsRow1[i].note, 0])
            } if (pageActivated == false) {
                lstOfNonEmptySlotsBeforeActivation.push(this.i)
            } else {
                //context.midiOutput1.sendMidi(activeDevice, [0x90, context.btnsRow1[i].note, 127])
            }
        }.bind({ i })
    }

    var pageActivated = false
    page.mOnActivate = function (activeDevice, activeMapping) {
        context.midiOutput2.sendMidi(activeDevice, [0x90, context.btnsL1L[0].note, 0])
        context.midiOutput2.sendMidi(activeDevice, [0x90, context.btnsL1L[1].note, 0])
        context.midiOutput2.sendMidi(activeDevice, [0x90, context.btnsL1L[2].note, 0])
        context.midiOutput2.sendMidi(activeDevice, [0x90, context.btnsL1L[3].note, 127])
        pageActivated = true
        //This is necessary since the mOnPluginChange will get triggered before the page activation at first start, but it will not alter the pseudoButton.mSurfaceValue

        if (lstOfNonEmptySlotsBeforeActivation.length > 0) {
            for (var i = 0; i < lstOfNonEmptySlotsBeforeActivation.length; i++) {
                context.midiOutput1.sendMidi(activeDevice, [0x90, context.btnsRow1[lstOfNonEmptySlotsBeforeActivation[i]].note, 127])
            }
            lstOfNonEmptySlotsBeforeActivation = []
        }

        page.mOnDeactivate = function (/** @type {MR_ActiveDevice} */activeDevice) {
            context.midiOutput2.sendMidi(activeDevice, [0x90, context.btnsL1L[3].note, 0])
        }.bind({ context })
    }
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
