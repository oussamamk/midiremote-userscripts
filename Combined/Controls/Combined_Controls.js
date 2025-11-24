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
context.controls = {}

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
    activeDevice.setState('lastTime', Date.now().toString())
}

makeSurfaceElements(deviceDriver, context)

var mixerPage = deviceDriver.mMapping.makePage('Mixer')
var eqPage = deviceDriver.mMapping.makePage('EQ')
var channelStripPage = deviceDriver.mMapping.makePage('ChannelStrip')
var cuePage = deviceDriver.mMapping.makePage('Cue')
var sendsPage = deviceDriver.mMapping.makePage('Sends')
var insertEffectsPage = deviceDriver.mMapping.makePage('InsertEffects')

makePageMixer(deviceDriver, mixerPage, context)
makePageEQ(deviceDriver, eqPage, context)
makePageChannelStrip(deviceDriver, channelStripPage, context)
makePageCue(deviceDriver, cuePage, context)
makePageSends(deviceDriver, sendsPage, context)
makePageInsertEffects(deviceDriver, insertEffectsPage, context)

mixerPage.makeActionBinding(context.btnsL1L[4].d.mSurfaceValue, eqPage.mAction.mActivate)
mixerPage.makeActionBinding(context.btnsL1L[5].d.mSurfaceValue, channelStripPage.mAction.mActivate)
mixerPage.makeActionBinding(context.btnsL1L[6].d.mSurfaceValue, cuePage.mAction.mActivate)
mixerPage.makeActionBinding(context.btnsL1L[7].d.mSurfaceValue, sendsPage.mAction.mActivate)
mixerPage.makeActionBinding(context.btnsL1L[8].d.mSurfaceValue, insertEffectsPage.mAction.mActivate)

eqPage.makeActionBinding(context.btnsL1L[4].d.mSurfaceValue, mixerPage.mAction.mActivate)
eqPage.makeActionBinding(context.btnsL1L[5].d.mSurfaceValue, channelStripPage.mAction.mActivate)
eqPage.makeActionBinding(context.btnsL1L[6].d.mSurfaceValue, cuePage.mAction.mActivate)
eqPage.makeActionBinding(context.btnsL1L[7].d.mSurfaceValue, sendsPage.mAction.mActivate)
eqPage.makeActionBinding(context.btnsL1L[8].d.mSurfaceValue, insertEffectsPage.mAction.mActivate)

channelStripPage.makeActionBinding(context.btnsL1L[4].d.mSurfaceValue, eqPage.mAction.mActivate)
channelStripPage.makeActionBinding(context.btnsL1L[5].d.mSurfaceValue, mixerPage.mAction.mActivate)
channelStripPage.makeActionBinding(context.btnsL1L[6].d.mSurfaceValue, cuePage.mAction.mActivate)
channelStripPage.makeActionBinding(context.btnsL1L[7].d.mSurfaceValue, sendsPage.mAction.mActivate)
channelStripPage.makeActionBinding(context.btnsL1L[8].d.mSurfaceValue, insertEffectsPage.mAction.mActivate)

cuePage.makeActionBinding(context.btnsL1L[4].d.mSurfaceValue, eqPage.mAction.mActivate)
cuePage.makeActionBinding(context.btnsL1L[5].d.mSurfaceValue, channelStripPage.mAction.mActivate)
cuePage.makeActionBinding(context.btnsL1L[6].d.mSurfaceValue, mixerPage.mAction.mActivate)
cuePage.makeActionBinding(context.btnsL1L[7].d.mSurfaceValue, sendsPage.mAction.mActivate)
cuePage.makeActionBinding(context.btnsL1L[8].d.mSurfaceValue, insertEffectsPage.mAction.mActivate)

sendsPage.makeActionBinding(context.btnsL1L[4].d.mSurfaceValue, eqPage.mAction.mActivate)
sendsPage.makeActionBinding(context.btnsL1L[5].d.mSurfaceValue, channelStripPage.mAction.mActivate)
sendsPage.makeActionBinding(context.btnsL1L[6].d.mSurfaceValue, cuePage.mAction.mActivate)
sendsPage.makeActionBinding(context.btnsL1L[7].d.mSurfaceValue, mixerPage.mAction.mActivate)
sendsPage.makeActionBinding(context.btnsL1L[8].d.mSurfaceValue, insertEffectsPage.mAction.mActivate)

insertEffectsPage.makeActionBinding(context.btnsL1L[4].d.mSurfaceValue, eqPage.mAction.mActivate)
insertEffectsPage.makeActionBinding(context.btnsL1L[5].d.mSurfaceValue, channelStripPage.mAction.mActivate)
insertEffectsPage.makeActionBinding(context.btnsL1L[6].d.mSurfaceValue, cuePage.mAction.mActivate)
insertEffectsPage.makeActionBinding(context.btnsL1L[7].d.mSurfaceValue, sendsPage.mAction.mActivate)
insertEffectsPage.makeActionBinding(context.btnsL1L[8].d.mSurfaceValue, mixerPage.mAction.mActivate)

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
