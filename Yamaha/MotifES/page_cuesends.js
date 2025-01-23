var master_controls = require('./master_controls.js')
var makePageWithDefaults = master_controls.makePageWithDefaults

var deviceSurface = require('./surface_elements.js')
var clearAllLeds = deviceSurface.clearAllLeds
var clearChannelState = deviceSurface.clearChannelState

/**
 * 
 * @param {MR_DeviceDriver} deviceDriver 
 * @param {MR_FactoryMappingPage} page 
 * @param {MR_DeviceMidiOutput} midiOutput
 * @param {object} surfaceElements 
 * @returns
 */
function makePageCueSends(deviceDriver, page, midiOutput, surfaceElements) {
    makePageWithDefaults(deviceDriver, page, surfaceElements)
    var subPageArea = page.makeSubPageArea('FadersKnobs')
    var subPageEQ = subPageArea.makeSubPage('CueSendsSubPage')

    var selectedTrackChannel = page.mHostAccess.mTrackSelection.mMixerChannel
    page.makeValueBinding(surfaceElements.btnsRow1[7].devButton.mSurfaceValue, selectedTrackChannel.mCueSends.mBypass).setTypeToggle().setSubPage(subPageEQ)
    makeSubPageCueSend(page, subPageArea, subPageEQ, selectedTrackChannel.mCueSends.getByIndex(0), 0, 'CueSend1', midiOutput, surfaceElements)
    makeSubPageCueSend(page, subPageArea, subPageEQ, selectedTrackChannel.mCueSends.getByIndex(1), 1, 'CueSend2', midiOutput, surfaceElements)
    makeSubPageCueSend(page, subPageArea, subPageEQ, selectedTrackChannel.mCueSends.getByIndex(2), 2, 'CueSend3', midiOutput, surfaceElements)
    makeSubPageCueSend(page, subPageArea, subPageEQ, selectedTrackChannel.mCueSends.getByIndex(3), 3, 'CueSend4', midiOutput, surfaceElements)

    page.mOnActivate = function (/** @type {MR_ActiveDevice} */activeDevice) {
        activeDevice.setState('activePage', 'SelectedTrack-CueSends')
        clearAllLeds(activeDevice, midiOutput, surfaceElements)
        clearChannelState(activeDevice)
        midiOutput.sendMidi(activeDevice, [0x90, surfaceElements.btnsRow2[0].note, 127])
    }.bind({ midiOutput, surafceElements: surfaceElements })

    page.makeValueBinding(surfaceElements.btnsRow3[4].devButton.mSurfaceValue, page.mHostAccess.mTrackSelection.mMixerChannel.mValue.mAutomationRead).setTypeToggle().setSubPage(subPageEQ)
    page.makeValueBinding(surfaceElements.btnsRow3[5].devButton.mSurfaceValue, page.mHostAccess.mTrackSelection.mMixerChannel.mValue.mAutomationWrite).setTypeToggle().setSubPage(subPageEQ)
    page.makeValueBinding(surfaceElements.btnsRow3[6].devButton.mSurfaceValue, selectedTrackChannel.mValue.mEditorOpen).setTypeToggle().setSubPage(subPageEQ)
    page.makeValueBinding(surfaceElements.btnsRow3[7].devButton.mSurfaceValue, selectedTrackChannel.mValue.mInstrumentOpen).setTypeToggle().setSubPage(subPageEQ)

    page.makeValueBinding(surfaceElements.btnsRow4[4].devButton.mSurfaceValue, selectedTrackChannel.mValue.mMonitorEnable).setTypeToggle().setSubPage(subPageEQ)
    page.makeValueBinding(surfaceElements.btnsRow4[5].devButton.mSurfaceValue, selectedTrackChannel.mValue.mMute).setTypeToggle().setSubPage(subPageEQ)
    page.makeValueBinding(surfaceElements.btnsRow4[6].devButton.mSurfaceValue, selectedTrackChannel.mValue.mSolo).setTypeToggle().setSubPage(subPageEQ)
    page.makeValueBinding(surfaceElements.btnsRow4[7].devButton.mSurfaceValue, selectedTrackChannel.mValue.mRecordEnable).setTypeToggle().setSubPage(subPageEQ)

    return page
}

/**
 * 
 * @param {MR_FactoryMappingPage} page 
 * @param {MR_SubPageArea} subPageArea 
 * @param {MR_SubPage} subPageEQ 
 * @param {MR_ControlRoomCueSendSlot} cueSendSlot 
 * @param {number} i 
 * @param {string} subPageName
 * @param {MR_DeviceMidiOutput} midiOutput 
 * @param {object} surfaceElements 
 */
function makeSubPageCueSend(page, subPageArea, subPageEQ, cueSendSlot, i, subPageName, midiOutput, surfaceElements) {
    var subPageCueSends = subPageArea.makeSubPage(subPageName)
    page.makeValueBinding(surfaceElements.btnsRow1[i].devButton.mSurfaceValue, cueSendSlot.mOn).setTypeToggle().setSubPage(subPageEQ)
    page.makeActionBinding(surfaceElements.btnsRow2[i].devButton.mSurfaceValue, subPageCueSends.mAction.mActivate).setSubPage(subPageEQ)
    page.makeValueBinding(surfaceElements.knobs[0].mSurfaceValue, cueSendSlot.mPrePost).setTypeToggle().setSubPage(subPageCueSends)
    page.makeValueBinding(surfaceElements.knobs[1].mSurfaceValue, cueSendSlot.mLevel).setSubPage(subPageCueSends)
    page.makeValueBinding(surfaceElements.knobs[2].mSurfaceValue, cueSendSlot.mPan).setSubPage(subPageCueSends)

    subPageCueSends.mOnActivate = function (/** @type {MR_ActiveDevice} */ activeDevice) {
        clearAllLeds(activeDevice, this.midiOutput, this.surfaceElements)
        clearChannelState(activeDevice)
        this.midiOutput.sendMidi(activeDevice, [0x90, this.surfaceElements.btnsRow2[i].note, 127])
    }.bind({ midiOutput, surfaceElements })
}

module.exports = {
    makePageCueSends
}