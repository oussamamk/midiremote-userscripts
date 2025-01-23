var master_controls = require('./master_controls.js')
var makePageWithDefaults = master_controls.makePageWithDefaults

var surface_elements = require('./surface_elements.js')
var clearAllLeds = surface_elements.clearAllLeds
var clearChannelState = surface_elements.clearChannelState

/**
 * 
 * @param {MR_DeviceDriver} deviceDriver 
 * @param {MR_FactoryMappingPage} page 
 * @param {MR_DeviceMidiOutput} midiOutput
 * @param {object} surfaceElements 
 * @returns
 */
function makePageChannelStrip(deviceDriver, page, midiOutput, surfaceElements) {
    makePageWithDefaults(deviceDriver, page, surfaceElements)

    var strip = page.makeSubPageArea('Strip')
    var stripPage = strip.makeSubPage('Gate')
    var gatePage = strip.makeSubPage('Gate')
    var compressorPage = strip.makeSubPage('Compressor')
    var toolsPage = strip.makeSubPage('Tools')
    var saturatorPage = strip.makeSubPage('Saturator')
    var limiterPage = strip.makeSubPage('Limiter')

    var selectedTrackChannel = page.mHostAccess.mTrackSelection.mMixerChannel
    var stripEffects = selectedTrackChannel.mInsertAndStripEffects.mStripEffects

    for (var i = 0; i < surfaceElements.numStrips; i++) {
        var knobsSurfaceValue = surfaceElements.knobs[i].mSurfaceValue

        var gate = stripEffects.mGate.mParameterBankZone.makeParameterValue()
        var compressor = stripEffects.mCompressor.mParameterBankZone.makeParameterValue()
        var tools = stripEffects.mTools.mParameterBankZone.makeParameterValue()
        var saturator = stripEffects.mSaturator.mParameterBankZone.makeParameterValue()
        var limiter = stripEffects.mLimiter.mParameterBankZone.makeParameterValue()

        page.makeValueBinding(knobsSurfaceValue, gate).setSubPage(gatePage)
        page.makeValueBinding(knobsSurfaceValue, compressor).setSubPage(compressorPage)
        page.makeValueBinding(knobsSurfaceValue, tools).setSubPage(toolsPage)
        page.makeValueBinding(knobsSurfaceValue, saturator).setSubPage(saturatorPage)
        page.makeValueBinding(knobsSurfaceValue, limiter).setSubPage(limiterPage)
    }

    for (var i = 0; i < 5; i++) {
        var type = ['mGate', 'mCompressor', 'mTools', 'mSaturator', 'mLimiter'][i]
        page.makeValueBinding(surfaceElements.btnsRow1[i].devButton.mSurfaceValue, stripEffects[type].mOn).setTypeToggle()
        page.makeValueBinding(surfaceElements.btnsRow2[i].devButton.mSurfaceValue, stripEffects[type].mBypass).setTypeToggle()
    }

    page.makeActionBinding(surfaceElements.btnsRow4[0].devButton.mSurfaceValue, gatePage.mAction.mActivate)
    page.makeActionBinding(surfaceElements.btnsRow4[1].devButton.mSurfaceValue, compressorPage.mAction.mActivate)
    page.makeActionBinding(surfaceElements.btnsRow4[2].devButton.mSurfaceValue, toolsPage.mAction.mActivate)
    page.makeActionBinding(surfaceElements.btnsRow4[3].devButton.mSurfaceValue, saturatorPage.mAction.mActivate)
    page.makeActionBinding(surfaceElements.btnsRow4[4].devButton.mSurfaceValue, limiterPage.mAction.mActivate)

    gatePage.mOnActivate = function (/** @type {MR_ActiveDevice} */ activeDevice) {
        clearAllLeds(activeDevice, this.midiOutput, this.surfaceElements)
        clearChannelState(activeDevice)
        this.midiOutput.sendMidi(activeDevice, [0x90, this.surfaceElements.btnsRow4[0].note, 127])
    }.bind({ midiOutput, surfaceElements })

    compressorPage.mOnActivate = function (/** @type {MR_ActiveDevice} */ activeDevice) {
        clearAllLeds(activeDevice, this.midiOutput, this.surfaceElements)
        clearChannelState(activeDevice)
        this.midiOutput.sendMidi(activeDevice, [0x90, this.surfaceElements.btnsRow4[1].note, 127])
    }.bind({ midiOutput, surfaceElements })

    toolsPage.mOnActivate = function (/** @type {MR_ActiveDevice} */ activeDevice) {
        clearAllLeds(activeDevice, this.midiOutput, this.surfaceElements)
        clearChannelState(activeDevice)
        this.midiOutput.sendMidi(activeDevice, [0x90, this.surfaceElements.btnsRow4[2].note, 127])
    }.bind({ midiOutput, surfaceElements })

    saturatorPage.mOnActivate = function (/** @type {MR_ActiveDevice} */ activeDevice) {
        clearAllLeds(activeDevice, this.midiOutput, this.surfaceElements)
        clearChannelState(activeDevice)
        this.midiOutput.sendMidi(activeDevice, [0x90, this.surfaceElements.btnsRow4[3].note, 127])
    }.bind({ midiOutput, surfaceElements })

    limiterPage.mOnActivate = function (/** @type {MR_ActiveDevice} */ activeDevice) {
        clearAllLeds(activeDevice, this.midiOutput, this.surfaceElements)
        clearChannelState(activeDevice)
        midiOutput.sendMidi(activeDevice, [0x90, this.surfaceElements.btnsRow4[4].note, 127])
    }.bind({ midiOutput, surfaceElements })

    page.mOnActivate = function (/** @type {MR_ActiveDevice} */activeDevice) {
        activeDevice.setState("activePage", "ChannelStrip")
        clearAllLeds(activeDevice, this.midiOutput, this.surfaceElements)
        clearChannelState(activeDevice)
    }.bind({ midiOutput, surfaceElements })

    return page
}

module.exports = {
    makePageChannelStrip
}