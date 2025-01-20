var master_controls = require('./master_controls.js')
var makePageWithDefaults = master_controls.makePageWithDefaults

var surface_elements = require('./surface_elements.js')
var clearAllLeds = surface_elements.clearAllLeds
var clearChannelState = surface_elements.clearChannelState

/**
 * 
 * @param {MR_FactoryMappingPage} page 
 * @param {MR_SubPageArea} subPageArea 
 * @param {MR_SubPage} subPageEQ 
 * @param {MR_PreFilter} preFilter 
 * @param {MR_DeviceMidiOutput} midiOutput 
 * @param {object} surfaceElements 
 */
function makeSubPagePrefilter(page, subPageArea, subPageEQ, preFilter, midiOutput, surfaceElements) {
    var subPagePreFilter = subPageArea.makeSubPage("PreFilter")

    page.makeValueBinding(surfaceElements.btnsRow1[0].devButton.mSurfaceValue, preFilter.mBypass).setTypeToggle().setSubPage(subPageEQ)
    page.makeActionBinding(surfaceElements.btnsRow2[0].devButton.mSurfaceValue, subPagePreFilter.mAction.mActivate).setSubPage(subPageEQ)

    page.makeValueBinding(surfaceElements.knobs[0].mSurfaceValue, preFilter.mHighCutOn).setValueTakeOverModeJump().setSubPage(subPagePreFilter)
    page.makeValueBinding(surfaceElements.knobs[1].mSurfaceValue, preFilter.mHighCutFreq).setSubPage(subPagePreFilter)
    page.makeValueBinding(surfaceElements.knobs[2].mSurfaceValue, preFilter.mHighCutSlope).setSubPage(subPagePreFilter)
    page.makeValueBinding(surfaceElements.knobs[3].mSurfaceValue, preFilter.mLowCutOn).setValueTakeOverModeJump().setSubPage(subPagePreFilter)
    page.makeValueBinding(surfaceElements.knobs[4].mSurfaceValue, preFilter.mLowCutFreq).setSubPage(subPagePreFilter)
    page.makeValueBinding(surfaceElements.knobs[5].mSurfaceValue, preFilter.mLowCutSlope).setSubPage(subPagePreFilter)
    page.makeValueBinding(surfaceElements.knobs[6].mSurfaceValue, preFilter.mGain).setSubPage(subPagePreFilter)
    page.makeValueBinding(surfaceElements.knobs[7].mSurfaceValue, preFilter.mPhaseSwitch).setSubPage(subPagePreFilter)
    subPagePreFilter.mOnActivate = function (/** @type {MR_ActiveDevice} */ activeDevice) {
        clearAllLeds(activeDevice, midiOutput, surfaceElements)
        clearChannelState(activeDevice)
        midiOutput.sendMidi(activeDevice, [0x90, surfaceElements.btnsRow2[0].note, 127])
    }.bind({ midiOutput, surface: surfaceElements })
}

/**
 * 
 * @param {MR_FactoryMappingPage} page 
 * @param {MR_SubPageArea} subPageArea 
 * @param {MR_SubPage} subPageEQ 
 * @param {MR_ChannelEQBand} band 
 * @param {number} idx
 * @param {string} subPageName
 * @param {MR_DeviceMidiOutput} midiOutput 
 * @param {object} surfaceElements 
 */
function makeSubPageEQBand(page, subPageArea, subPageEQ, band, idx, subPageName, midiOutput, surfaceElements) {
    var subPageEQBand = subPageArea.makeSubPage(subPageName)
    page.makeValueBinding(surfaceElements.btnsRow1[idx].devButton.mSurfaceValue, band.mOn).setTypeToggle().setSubPage(subPageEQ)
    page.makeActionBinding(surfaceElements.btnsRow2[idx].devButton.mSurfaceValue, subPageEQBand.mAction.mActivate).setSubPage(subPageEQ)
    page.makeValueBinding(surfaceElements.knobs[0].mSurfaceValue, band.mFilterType).setSubPage(subPageEQBand)
    page.makeValueBinding(surfaceElements.knobs[1].mSurfaceValue, band.mGain).setSubPage(subPageEQBand)
    page.makeValueBinding(surfaceElements.knobs[2].mSurfaceValue, band.mFreq).setSubPage(subPageEQBand)
    page.makeValueBinding(surfaceElements.knobs[3].mSurfaceValue, band.mQ).setSubPage(subPageEQBand)
    for (var i = 4; i < surfaceElements.numStrips; i++) {
        page.makeCommandBinding(surfaceElements.knobs[i].mSurfaceValue, 'Video', 'Mute all vdeo tracks').setSubPage(subPageEQBand) //dummy bind
    }

    subPageEQBand.mOnActivate = function (/** @type {MR_ActiveDevice} */ activeDevice) {
        clearAllLeds(activeDevice, midiOutput, this.surfaceElements)
        clearChannelState(activeDevice)
        midiOutput.sendMidi(activeDevice, [0x90, this.surfaceElements.btnsRow2[idx].note, 127])
    }.bind({ idx, surfaceElements })
}

/**
 * 
 * @param {MR_DeviceDriver} deviceDriver 
 * @param {MR_FactoryMappingPage} page 
 * @param {MR_DeviceMidiOutput} midiOutput
 * @param {object} surfaceElements 
 * @returns
 */
function makePageEQ(deviceDriver, page, midiOutput, surfaceElements) {
    makePageWithDefaults(deviceDriver, page, surfaceElements)
    var subPageArea = page.makeSubPageArea('FadersKnobs')
    var subPageEQ = subPageArea.makeSubPage('EQSubPage')

    var selectedTrackChannel = page.mHostAccess.mTrackSelection.mMixerChannel
    makeSubPagePrefilter(page, subPageArea, subPageEQ, selectedTrackChannel.mPreFilter, midiOutput, surfaceElements)
    makeSubPageEQBand(page, subPageArea, subPageEQ, selectedTrackChannel.mChannelEQ.mBand1, 1, "BandEQ1", midiOutput, surfaceElements)
    makeSubPageEQBand(page, subPageArea, subPageEQ, selectedTrackChannel.mChannelEQ.mBand2, 2, "BandEQ2", midiOutput, surfaceElements)
    makeSubPageEQBand(page, subPageArea, subPageEQ, selectedTrackChannel.mChannelEQ.mBand3, 3, "BandEQ3", midiOutput, surfaceElements)
    makeSubPageEQBand(page, subPageArea, subPageEQ, selectedTrackChannel.mChannelEQ.mBand4, 4, "BandEQ4", midiOutput, surfaceElements)

    page.mOnActivate = function (/** @type {MR_ActiveDevice} */activeDevice) {
        activeDevice.setState("activePage", "SelectedTrack-EQ")
        clearAllLeds(activeDevice, this.midiOutput, this.surfaceElements)
        clearChannelState(activeDevice)
        this.midiOutput.sendMidi(activeDevice, [0x90, this.surfaceElements.btnsRow2[0].note, 127])
    }.bind({ midiOutput, surfaceElements })

    page.makeCommandBinding(surfaceElements.btnsRow1[7].devButton.mSurfaceValue, 'Process Project Logical Editor', 'Toggle EQ Bypass of Selected Tracks').setSubPage(subPageEQ)

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

module.exports = {
    makePageEQ
}