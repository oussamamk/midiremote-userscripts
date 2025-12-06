var page_common = require('./page_common.js')
var makeSubPageTransportAndContols = page_common.makeSubPageTransportAndContols

var helper = require("./helper.js")
var sendLableApp1 = helper.sendLableApp1
var sendLableApp2 = helper.sendLableApp2

function setPageDefaultLabels(context) {
    for (var i = 0; i < context.numStrips1; i++) {
        context.knobs1[i].t = 'Pan'
        context.faders1[i].t = 'Volume'
        context.btnsRow1[i].t = 'Mute'
        context.btnsRow2[i].t = 'Solo'
        context.btnsRow3[i].t = 'Rec'
        context.btnsRow4[i].t = 'Select'
    }
}


/**
 * @param {MR_DeviceDriver} deviceDriver 
 * @param {object} context 
 */
function makePageMixer(deviceDriver, context) {
    var page = deviceDriver.mMapping.makePage('Mixer')
    var subPageArea = page.makeSubPageArea('mixer')
    var defaultSubPage = makeSubPageTransportAndContols(page, subPageArea, context)

    var hostMixerBankZone = page.mHostAccess.mMixConsole.makeMixerBankZone('AudioInstrBanks')
        .includeAudioChannels()
        .includeInstrumentChannels()
        .setFollowVisibility(true)

    page.makeActionBinding(context.btnBankPrev.d.mSurfaceValue, hostMixerBankZone.mAction.mPrevBank).setSubPage(defaultSubPage)
    page.makeActionBinding(context.btnBankNext.d.mSurfaceValue, hostMixerBankZone.mAction.mNextBank).setSubPage(defaultSubPage)

    for (var i = 0; i < context.numStrips1; i++) {
        var hostMixerBankChannel = hostMixerBankZone.makeMixerBankChannel()

        var knobSurfaceValue = context.knobs1[i].d.mSurfaceValue
        var faderSurfaceValue = context.faders1[i].d.mSurfaceValue
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

    page.mOnActivate = function (activeDevice, activeMapping) {
        context.midiOutput2.sendMidi(activeDevice, [0x90, context.btnsL1U[7].note, 0])
        context.midiOutput2.sendMidi(activeDevice, [0x90, context.btnsL1U[8].note, 0])
        defaultSubPage.mAction.mActivate.trigger(activeMapping)
    }.bind({ context })

    defaultSubPage.mOnActivate = function (activeDevice) {
        context.midiOutput2.sendMidi(activeDevice, [0x90, context.btnsL1U[7].note, 0])
        context.midiOutput2.sendMidi(activeDevice, [0x90, context.btnsL1U[8].note, 0])
        setPageDefaultLabels(context)
        sendLableApp1(activeDevice, context)
        sendLableApp2(activeDevice, context)
    }

    return page
}

module.exports = {
    makePageMixer
}