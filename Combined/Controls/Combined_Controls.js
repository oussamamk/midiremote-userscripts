var surface_elements = require('./surface_elements.js')
var makeSurfaceElements = surface_elements.makeSurfaceElements

var page_mixer = require('./page_mixer.js')
var makePageMixer = page_mixer.makePageMixer

var page_eq = require('./page_eq.js')
var makePageEQ = page_eq.makePageEQ

var page_channelstrip = require('./page_channelstrip.js')
var makePageChannelStrip = page_channelstrip.makePageChannelStrip

var page_cuesends = require('./page_cuesends.js')
var makePageCue = page_cuesends.makePageCue
var makePageSends = page_cuesends.makePageSends

var page_inserteffects = require('./page_inserteffects.js')
var makePageInsertEffects = page_inserteffects.makePageInsertEffects

var page_instrument = require('./page_instrument.js')
var makePageInstrument = page_instrument.makePageInstrument

var page_commands = require('./page_commands.js')
var makePageCommands = page_commands.makePageCommands

var helper = require("./helper.js")
var sendLableApp1 = helper.sendLableApp1
var sendLableApp2 = helper.sendLableApp2

var page_common = require("./page_common.js")
var resetLabels1 = page_common.resetLabels1
var resetLabels2 = page_common.resetLabels2

var midiremote_api = require('midiremote_api_v1')

var deviceDriver = midiremote_api.makeDeviceDriver('Controls', 'Combined', 'Oussi')
var detectUnit = deviceDriver.makeDetectionUnit()

var context = {}
context.midiInput1 = deviceDriver.mPorts.makeMidiInput('SMC-Mixer')
context.midiOutput1 = deviceDriver.mPorts.makeMidiOutput('SMC-Mixer')
detectUnit.detectPortPair(context.midiInput1, context.midiOutput1)
    .expectInputNameEquals('SMC-Mixer')
    .expectOutputNameEquals('SMC-Mixer')

context.midiInput2 = deviceDriver.mPorts.makeMidiInput('iCON iControls V2.05')
context.midiOutput2 = deviceDriver.mPorts.makeMidiOutput('iCON iControls V2.05')
detectUnit.detectPortPair(context.midiInput2, context.midiOutput2)
    .expectInputNameEquals('iCON iControls V2.05')
    .expectOutputNameEquals('iCON iControls V2.05')

context.midiInput3 = deviceDriver.mPorts.makeMidiInput('vtDev1')
context.midiOutput3 = deviceDriver.mPorts.makeMidiOutput('vtDev1')
detectUnit.detectPortPair(context.midiInput3, context.midiOutput3)
    .expectInputNameEquals('vtDev1')
    .expectOutputNameEquals('vtDev1')

context.midiInput4 = deviceDriver.mPorts.makeMidiInput('vtDev2')
context.midiOutput4 = deviceDriver.mPorts.makeMidiOutput('vtDev2')
detectUnit.detectPortPair(context.midiInput4, context.midiOutput4)
    .expectInputNameEquals('vtDev2')
    .expectOutputNameEquals('vtDev2')

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
context.btnControls = {}

function setLabelsTransportAndControls(context) {
    context.btnsL1U[0].t = 'Metronome'
    context.btnsL1U[1].t = 'Cycle'
    context.btnsL1U[2].t = 'Auto-Read'
    context.btnsL1U[3].t = 'Auto-Write'
    context.btnsL1U[4].t = 'Monitor'
    context.btnsL1U[5].t = 'Channel Settings'
    context.btnsL1U[6].t = 'Instrument'
    context.btnsL1U[7].t = 'Zoom'
    context.btnsL1U[8].t = 'Marker'

    context.btnsL1L[0].t = 'Undo'
    context.btnsL1L[1].t = 'Redo'
    context.btnsL1L[2].t = 'UnMute All'
    context.btnsL1L[3].t = 'UnSolo All'
    context.btnsL1L[4].t = 'EQ'
    context.btnsL1L[5].t = 'Channel Strip'
    context.btnsL1L[6].t = 'Cue'
    context.btnsL1L[7].t = 'Sends'
    context.btnsL1L[8].t = 'Insert Effects'
}

deviceDriver.mOnActivate = function (activeDevice) {
    context.midiOutput2.sendMidi(activeDevice, [0x90, context.btnsL1U[5].note, 0])
    context.midiOutput2.sendMidi(activeDevice, [0x90, context.btnsL1U[6].note, 0])
    context.midiOutput2.sendMidi(activeDevice, [0x90, context.btnsL1U[7].note, 0])
    context.midiOutput2.sendMidi(activeDevice, [0x90, context.btnsL1U[8].note, 0])
    context.midiOutput2.sendMidi(activeDevice, [0x90, context.btnsL1L[4].note, 0])
    context.midiOutput2.sendMidi(activeDevice, [0x90, context.btnsL1L[5].note, 0])
    context.midiOutput2.sendMidi(activeDevice, [0x90, context.btnsL1L[6].note, 0])
    context.midiOutput2.sendMidi(activeDevice, [0x90, context.btnsL1L[7].note, 0])
    context.midiOutput2.sendMidi(activeDevice, [0x90, context.btnsL1L[8].note, 0])
    resetLabels1(context)
    resetLabels2(context)
    setLabelsTransportAndControls(context)
    sendLableApp1(activeDevice, context)
    sendLableApp2(activeDevice, context)
}

makeSurfaceElements(deviceDriver, context)

var mixerPage = makePageMixer(deviceDriver, context)
var eqPage = makePageEQ(deviceDriver, context)
var channelStripPage = makePageChannelStrip(deviceDriver, context)
var cuePage = makePageCue(deviceDriver, context)
var sendsPage = makePageSends(deviceDriver, context)
var insertEffectsPage = makePageInsertEffects(deviceDriver, context)
var instrumentPage = makePageInstrument(deviceDriver, context)
var commandsPage = makePageCommands(deviceDriver, context)

mixerPage.makeActionBinding(context.btnsL1L[4].d.mSurfaceValue, eqPage.mAction.mActivate)
mixerPage.makeActionBinding(context.btnsL1L[5].d.mSurfaceValue, channelStripPage.mAction.mActivate)
mixerPage.makeActionBinding(context.btnsL1L[6].d.mSurfaceValue, cuePage.mAction.mActivate)
mixerPage.makeActionBinding(context.btnsL1L[7].d.mSurfaceValue, sendsPage.mAction.mActivate)
mixerPage.makeActionBinding(context.btnsL1L[8].d.mSurfaceValue, insertEffectsPage.mAction.mActivate)
mixerPage.makeActionBinding(context.btnControls[0].d.mSurfaceValue, commandsPage.mAction.mActivate)

eqPage.makeActionBinding(context.btnsL1L[4].d.mSurfaceValue, mixerPage.mAction.mActivate)
eqPage.makeActionBinding(context.btnsL1L[5].d.mSurfaceValue, channelStripPage.mAction.mActivate)
eqPage.makeActionBinding(context.btnsL1L[6].d.mSurfaceValue, cuePage.mAction.mActivate)
eqPage.makeActionBinding(context.btnsL1L[7].d.mSurfaceValue, sendsPage.mAction.mActivate)
eqPage.makeActionBinding(context.btnsL1L[8].d.mSurfaceValue, insertEffectsPage.mAction.mActivate)
eqPage.makeActionBinding(context.btnControls[0].d.mSurfaceValue, commandsPage.mAction.mActivate)

channelStripPage.makeActionBinding(context.btnsL1L[4].d.mSurfaceValue, eqPage.mAction.mActivate)
channelStripPage.makeActionBinding(context.btnsL1L[5].d.mSurfaceValue, mixerPage.mAction.mActivate)
channelStripPage.makeActionBinding(context.btnsL1L[6].d.mSurfaceValue, cuePage.mAction.mActivate)
channelStripPage.makeActionBinding(context.btnsL1L[7].d.mSurfaceValue, sendsPage.mAction.mActivate)
channelStripPage.makeActionBinding(context.btnsL1L[8].d.mSurfaceValue, insertEffectsPage.mAction.mActivate)
channelStripPage.makeActionBinding(context.btnControls[0].d.mSurfaceValue, commandsPage.mAction.mActivate)

cuePage.makeActionBinding(context.btnsL1L[4].d.mSurfaceValue, eqPage.mAction.mActivate)
cuePage.makeActionBinding(context.btnsL1L[5].d.mSurfaceValue, channelStripPage.mAction.mActivate)
cuePage.makeActionBinding(context.btnsL1L[6].d.mSurfaceValue, mixerPage.mAction.mActivate)
cuePage.makeActionBinding(context.btnsL1L[7].d.mSurfaceValue, sendsPage.mAction.mActivate)
cuePage.makeActionBinding(context.btnsL1L[8].d.mSurfaceValue, insertEffectsPage.mAction.mActivate)
cuePage.makeActionBinding(context.btnControls[0].d.mSurfaceValue, commandsPage.mAction.mActivate)

sendsPage.makeActionBinding(context.btnsL1L[4].d.mSurfaceValue, eqPage.mAction.mActivate)
sendsPage.makeActionBinding(context.btnsL1L[5].d.mSurfaceValue, channelStripPage.mAction.mActivate)
sendsPage.makeActionBinding(context.btnsL1L[6].d.mSurfaceValue, cuePage.mAction.mActivate)
sendsPage.makeActionBinding(context.btnsL1L[7].d.mSurfaceValue, mixerPage.mAction.mActivate)
sendsPage.makeActionBinding(context.btnsL1L[8].d.mSurfaceValue, insertEffectsPage.mAction.mActivate)
sendsPage.makeActionBinding(context.btnControls[0].d.mSurfaceValue, commandsPage.mAction.mActivate)

insertEffectsPage.makeActionBinding(context.btnsL1L[4].d.mSurfaceValue, eqPage.mAction.mActivate)
insertEffectsPage.makeActionBinding(context.btnsL1L[5].d.mSurfaceValue, channelStripPage.mAction.mActivate)
insertEffectsPage.makeActionBinding(context.btnsL1L[6].d.mSurfaceValue, cuePage.mAction.mActivate)
insertEffectsPage.makeActionBinding(context.btnsL1L[7].d.mSurfaceValue, sendsPage.mAction.mActivate)
insertEffectsPage.makeActionBinding(context.btnsL1L[8].d.mSurfaceValue, mixerPage.mAction.mActivate)
insertEffectsPage.makeActionBinding(context.btnControls[0].d.mSurfaceValue, commandsPage.mAction.mActivate)

instrumentPage.makeActionBinding(context.btnsL1L[4].d.mSurfaceValue, eqPage.mAction.mActivate)
instrumentPage.makeActionBinding(context.btnsL1L[5].d.mSurfaceValue, channelStripPage.mAction.mActivate)
instrumentPage.makeActionBinding(context.btnsL1L[6].d.mSurfaceValue, cuePage.mAction.mActivate)
instrumentPage.makeActionBinding(context.btnsL1L[7].d.mSurfaceValue, sendsPage.mAction.mActivate)
instrumentPage.makeActionBinding(context.btnsL1L[8].d.mSurfaceValue, mixerPage.mAction.mActivate)
instrumentPage.makeActionBinding(context.btnControls[0].d.mSurfaceValue, commandsPage.mAction.mActivate)

commandsPage.makeActionBinding(context.btnsL1L[4].d.mSurfaceValue, eqPage.mAction.mActivate)
commandsPage.makeActionBinding(context.btnsL1L[5].d.mSurfaceValue, channelStripPage.mAction.mActivate)
commandsPage.makeActionBinding(context.btnsL1L[6].d.mSurfaceValue, cuePage.mAction.mActivate)
commandsPage.makeActionBinding(context.btnsL1L[7].d.mSurfaceValue, sendsPage.mAction.mActivate)
commandsPage.makeActionBinding(context.btnsL1L[8].d.mSurfaceValue, insertEffectsPage.mAction.mActivate)
commandsPage.makeActionBinding(context.btnControls[0].d.mSurfaceValue, mixerPage.mAction.mActivate)

mixerPage.makeValueBinding(context.btnsL1U[6].d.mSurfaceValue, mixerPage.mHostAccess.mTrackSelection.mMixerChannel.mValue.mInstrumentOpen).setTypeToggle().mOnValueChange = function(activeDevice, activeMapping, value, diff) {
    if (value == 1) {
        instrumentPage.mAction.mActivate.trigger(activeMapping)
    }
}

eqPage.makeValueBinding(context.btnsL1U[6].d.mSurfaceValue, eqPage.mHostAccess.mTrackSelection.mMixerChannel.mValue.mInstrumentOpen).setTypeToggle().mOnValueChange = function(activeDevice, activeMapping, value, diff) {
    if (value == 1) {
        instrumentPage.mAction.mActivate.trigger(activeMapping)
    }
}

channelStripPage.makeValueBinding(context.btnsL1U[6].d.mSurfaceValue, channelStripPage.mHostAccess.mTrackSelection.mMixerChannel.mValue.mInstrumentOpen).setTypeToggle().mOnValueChange = function(activeDevice, activeMapping, value, diff) {
    if (value == 1) {
        instrumentPage.mAction.mActivate.trigger(activeMapping)
    }
}

cuePage.makeValueBinding(context.btnsL1U[6].d.mSurfaceValue, cuePage.mHostAccess.mTrackSelection.mMixerChannel.mValue.mInstrumentOpen).setTypeToggle().mOnValueChange = function(activeDevice, activeMapping, value, diff) {
    if (value == 1) {
        instrumentPage.mAction.mActivate.trigger(activeMapping)
    }
}

sendsPage.makeValueBinding(context.btnsL1U[6].d.mSurfaceValue, sendsPage.mHostAccess.mTrackSelection.mMixerChannel.mValue.mInstrumentOpen).setTypeToggle().mOnValueChange = function(activeDevice, activeMapping, value, diff) {
    if (value == 1) {
        instrumentPage.mAction.mActivate.trigger(activeMapping)
    }
}

insertEffectsPage.makeValueBinding(context.btnsL1U[6].d.mSurfaceValue, insertEffectsPage.mHostAccess.mTrackSelection.mMixerChannel.mValue.mInstrumentOpen).setTypeToggle().mOnValueChange = function(activeDevice, activeMapping, value, diff) {
    if (value == 1) {
        instrumentPage.mAction.mActivate.trigger(activeMapping)
    }
}

instrumentPage.makeValueBinding(context.btnsL1U[6].d.mSurfaceValue, instrumentPage.mHostAccess.mTrackSelection.mMixerChannel.mValue.mInstrumentOpen).setTypeToggle().mOnValueChange = function(activeDevice, activeMapping, value, diff) {
    if (value == 0) {
        mixerPage.mAction.mActivate.trigger(activeMapping)
    }
}

commandsPage.makeValueBinding(context.btnsL1U[6].d.mSurfaceValue, insertEffectsPage.mHostAccess.mTrackSelection.mMixerChannel.mValue.mInstrumentOpen).setTypeToggle().mOnValueChange = function(activeDevice, activeMapping, value, diff) {
    if (value == 1) {
        instrumentPage.mAction.mActivate.trigger(activeMapping)
    }
}

eqPage.mOnActivate = function (activeDevice) {
    context.midiOutput2.sendMidi(activeDevice, [0x90, context.btnsL1L[4].note, 127])
}

eqPage.mOnDeactivate = function (activeDevice) {
    context.midiOutput2.sendMidi(activeDevice, [0x90, context.btnsL1L[4].note, 0])
}

channelStripPage.mOnActivate = function (activeDevice) {
    context.midiOutput2.sendMidi(activeDevice, [0x90, context.btnsL1L[5].note, 127])
}

channelStripPage.mOnDeactivate = function (activeDevice) {
    context.midiOutput2.sendMidi(activeDevice, [0x90, context.btnsL1L[5].note, 0])
}

cuePage.mOnActivate = function (activeDevice) {
    context.midiOutput2.sendMidi(activeDevice, [0x90, context.btnsL1L[6].note, 127])
}

cuePage.mOnDeactivate = function (activeDevice) {
    context.midiOutput2.sendMidi(activeDevice, [0x90, context.btnsL1L[6].note, 0])
}

sendsPage.mOnActivate = function (activeDevice) {
    context.midiOutput2.sendMidi(activeDevice, [0x90, context.btnsL1L[7].note, 127])
}

sendsPage.mOnDeactivate = function (activeDevice) {
    context.midiOutput2.sendMidi(activeDevice, [0x90, context.btnsL1L[7].note, 0])
}

insertEffectsPage.mOnActivate = function (activeDevice) {
    context.midiOutput2.sendMidi(activeDevice, [0x90, context.btnsL1L[8].note, 127])
}

insertEffectsPage.mOnDeactivate = function (activeDevice) {
    context.midiOutput2.sendMidi(activeDevice, [0x90, context.btnsL1L[8].note, 0])
}

instrumentPage.mOnActivate = function (activeDevice) {
    context.midiOutput2.sendMidi(activeDevice, [0x90, context.btnsL1U[6].note, 127])
    context.btnsL1U[6].d.mSurfaceValue.setProcessValue(activeDevice, 1)
}

instrumentPage.mOnDeactivate = function (activeDevice) {
    context.midiOutput2.sendMidi(activeDevice, [0x90, context.btnsL1U[6].note, 0])
    context.btnsL1U[6].d.mSurfaceValue.setProcessValue(activeDevice, 0)
}

commandsPage.mOnActivate = function (activeDevice) {
    context.midiOutput2.sendMidi(activeDevice, [0x90, context.btnControls[0].note, 127])
}

commandsPage.mOnDeactivate = function (activeDevice) {
    context.midiOutput2.sendMidi(activeDevice, [0x90, context.btnControls[0].note, 0])
}
