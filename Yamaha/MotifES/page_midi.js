var master_controls = require('./master_controls.js')
var makePageWithDefaults = master_controls.makePageWithDefaults

var surface_elements = require('./surface_elements.js')
var clearAllLeds = surface_elements.clearAllLeds
var clearChannelState = surface_elements.clearChannelState

/**
 * @param {MR_DeviceDriver} deviceDriver 
 * @param {MR_FactoryMappingPage} page 
 * @param {MR_DeviceMidiOutput} midiOutput
 * @param {object} surfaceElements 
 * @returns
 */
function makePageMidi(deviceDriver, page, midiOutput, surfaceElements) {
    makePageWithDefaults(deviceDriver, page, surfaceElements)

    for (var i = 0; i < surfaceElements.numStrips; i++) {
        page.makeValueBinding(surfaceElements.knobs[i].mSurfaceValue, page.mHostAccess.mFocusedQuickControls.getByIndex(i)).setValueTakeOverModeScaled()
    }

    page.mOnActivate = function (/** @type {MR_ActiveDevice} */activeDevice) {
        var activePage = 'Midi'
        activeDevice.setState('activePage', activePage)
        clearAllLeds(activeDevice, this.midiOutput, this.surfaceElements)
        clearChannelState(activeDevice)
    }.bind({ midiOutput, surfaceElements })

    return page
}

module.exports = {
    makePageMidi
}