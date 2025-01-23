var surface_elements = require('./surface_elements.js')
var makeSurfaceElements = surface_elements.makeSurfaceElements
var clearAllLeds = surface_elements.clearAllLeds

var page_controlroom = require('./page_controlroom.js')
var makePageRoomControl = page_controlroom.makePageRoomControl

var page_mixer = require('./page_mixer.js')
var makePageMixer = page_mixer.makePageMixer

var page_eq = require('./page_eq.js')
var makePageEQ = page_eq.makePageEQ

var page_cuesends = require('./page_cuesends.js')
var makePageCueSends = page_cuesends.makePageCueSends

var page_channelstrip = require('./page_channelstrip.js')
var makePageChannelStrip = page_channelstrip.makePageChannelStrip


var page_midi = require('./page_midi.js')
var makePageMidi = page_midi.makePageMidi

var midiremote_api = require('midiremote_api_v1')

var deviceDriver = midiremote_api.makeDeviceDriver('Yamaha', 'MotifES', 'Oussi')

var midiInput = deviceDriver.mPorts.makeMidiInput()
var midiOutput = deviceDriver.mPorts.makeMidiOutput()

var isSurfaceElementsInitialized = false

deviceDriver.mOnActivate = function (activeDevice) {
    console.log('Yaamaha Motif ES Activated')
    if (isSurfaceElementsInitialized) {
        clearAllLeds(activeDevice, midiOutput, surfaceElements)
    }
    activeDevice.setState('lastTime', Date.now().toString())
}

deviceDriver.makeDetectionUnit().detectPortPair(midiInput, midiOutput)
    .expectInputNameEquals('BMT 1')
    .expectOutputNameEquals('Yamaha MOTIF ES-4')

var surfaceElements = makeSurfaceElements(deviceDriver, midiInput, midiOutput)
isSurfaceElementsInitialized = true
var mixerPage = deviceDriver.mMapping.makePage('Mixer')
var eqSelectedTrackPage = deviceDriver.mMapping.makePage('SelectedTrack-EQ')
var cueSendsSelectedTrackPage = deviceDriver.mMapping.makePage('SelectedTrack-CueSends')
var channelStripPage = deviceDriver.mMapping.makePage('ChannelStrip')
var controlRoomPage = deviceDriver.mMapping.makePage('ControlRoom')
var midiPage = deviceDriver.mMapping.makePage('Midi')
makePageMixer(deviceDriver, mixerPage, midiOutput, surfaceElements)
makePageEQ(deviceDriver, eqSelectedTrackPage, midiOutput, surfaceElements)
makePageCueSends(deviceDriver, cueSendsSelectedTrackPage, midiOutput, surfaceElements)
makePageChannelStrip(deviceDriver, channelStripPage, midiOutput, surfaceElements)
makePageRoomControl(deviceDriver, controlRoomPage, midiOutput, surfaceElements)
makePageMidi(deviceDriver, midiPage, midiOutput, surfaceElements)

mixerPage.makeActionBinding(surfaceElements.btnEQ.mSurfaceValue, eqSelectedTrackPage.mAction.mActivate)
mixerPage.makeActionBinding(surfaceElements.btnDynamic.mSurfaceValue, channelStripPage.mAction.mActivate)

eqSelectedTrackPage.makeActionBinding(surfaceElements.btnPan.mSurfaceValue, mixerPage.mAction.mActivate)
eqSelectedTrackPage.makeActionBinding(surfaceElements.btnEQ.mSurfaceValue, cueSendsSelectedTrackPage.mAction.mActivate)
eqSelectedTrackPage.makeActionBinding(surfaceElements.btnDynamic.mSurfaceValue, channelStripPage.mAction.mActivate)

cueSendsSelectedTrackPage.makeActionBinding(surfaceElements.btnPan.mSurfaceValue, mixerPage.mAction.mActivate)
cueSendsSelectedTrackPage.makeActionBinding(surfaceElements.btnEQ.mSurfaceValue, eqSelectedTrackPage.mAction.mActivate)
cueSendsSelectedTrackPage.makeActionBinding(surfaceElements.btnDynamic.mSurfaceValue, channelStripPage.mAction.mActivate)

channelStripPage.makeActionBinding(surfaceElements.btnPan.mSurfaceValue, mixerPage.mAction.mActivate)
channelStripPage.makeActionBinding(surfaceElements.btnEQ.mSurfaceValue, eqSelectedTrackPage.mAction.mActivate)