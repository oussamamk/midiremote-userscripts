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
function makePageMixer(deviceDriver, page, midiOutput, surfaceElements) {
    makePageWithDefaults(deviceDriver, page, surfaceElements)

    var faderSubPageArea = page.makeSubPageArea('FadersKnobs')
    var subPageFaderVolume = faderSubPageArea.makeSubPage('Volume')

    var buttonSubPageArea = page.makeSubPageArea('Buttons')
    var subPageButtonDefaultSet = buttonSubPageArea.makeSubPage('DefaultSet')

    var hostMixerBankZone = page.mHostAccess.mMixConsole.makeMixerBankZone('AudioInstrBanks')
        .includeAudioChannels()
        .includeInstrumentChannels()
        .setFollowVisibility(true)

    for (var i = 0; i < surfaceElements.numStrips; i++) {
        var hostMixerBankChannel = hostMixerBankZone.makeMixerBankChannel()

        var knobSurfaceValue = surfaceElements.knobs[i].mSurfaceValue
        var faderSurfaceValue = surfaceElements.faders[i].mSurfaceValue
        var sel_buttonSurfaceValue = surfaceElements.btnsRow1[i].devButton.mSurfaceValue
        var mute_buttonSurfaceValue = surfaceElements.btnsRow2[i].devButton.mSurfaceValue
        var solo_buttonSurfaceValue = surfaceElements.btnsRow3[i].devButton.mSurfaceValue
        var rec_buttonSurfaceValue = surfaceElements.btnsRow4[i].devButton.mSurfaceValue

        page.makeValueBinding(knobSurfaceValue, hostMixerBankChannel.mValue.mPan).setValueTakeOverModeScaled().setSubPage(subPageFaderVolume)
        page.makeValueBinding(faderSurfaceValue, hostMixerBankChannel.mValue.mVolume).setValueTakeOverModeJump().setSubPage(subPageFaderVolume)
        page.makeValueBinding(sel_buttonSurfaceValue, hostMixerBankChannel.mValue.mSelected).setTypeToggle().setSubPage(subPageButtonDefaultSet)
        page.makeValueBinding(mute_buttonSurfaceValue, hostMixerBankChannel.mValue.mMute).setTypeToggle().setSubPage(subPageButtonDefaultSet)
        page.makeValueBinding(solo_buttonSurfaceValue, hostMixerBankChannel.mValue.mSolo).setTypeToggle().setSubPage(subPageButtonDefaultSet)
        page.makeValueBinding(rec_buttonSurfaceValue, hostMixerBankChannel.mValue.mRecordEnable).setTypeToggle().setSubPage(subPageButtonDefaultSet)
    }

    page.mOnActivate = function (/** @type {MR_ActiveDevice} */activeDevice) {
        activeDevice.setState('activePage', 'Mixer')
        clearAllLeds(activeDevice, this.midiOutput, this.surfaceElements)
        clearChannelState(activeDevice)
        activeDevice.setState('displayType', 'Knob-Fader')
    }.bind({ midiOutput, surfaceElements })

    return page
}

module.exports = {
    makePageMixer
}