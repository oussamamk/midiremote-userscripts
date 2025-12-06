var page_common = require('./page_common.js')
var makeSubPageTransportAndContols = page_common.makeSubPageTransportAndContols
var resetLabels1 = page_common.resetLabels1

var helper = require("./helper.js")
var sendLableApp1 = helper.sendLableApp1
var sendLableApp2 = helper.sendLableApp2

/**
 * @param {object} context
*/
function setPageSendsLabels(context) {
    for (var idx = 0; idx < 8; idx++) {
        context.btnsRow1[idx].t = 'On/Off'
        context.btnsRow2[idx].t = 'Pre/Post'
        context.knobs1[idx].t = 'Level'
    }
}

/**
 * 
 * @param {MR_DeviceDriver} deviceDriver 
 * @param {object} context
 * @returns
 */
function makePageCue(deviceDriver, context) {
    var page = deviceDriver.mMapping.makePage('Sends')
    var subPageArea = page.makeSubPageArea('Cue')
    var defaultSubPage = makeSubPageTransportAndContols(page, subPageArea, context)

    var selectedTrackChannel = page.mHostAccess.mTrackSelection.mMixerChannel
    page.makeValueBinding(context.btnsRow1[7].d.mSurfaceValue, selectedTrackChannel.mCueSends.mBypass).setTypeToggle().setSubPage(defaultSubPage)
    for (var idx = 0; idx < 4; idx++) {
        var cueSendSlot = selectedTrackChannel.mCueSends.getByIndex(idx)
        page.makeValueBinding(context.btnsRow1[idx].d.mSurfaceValue, cueSendSlot.mOn).setTypeToggle().setSubPage(defaultSubPage)
        page.makeValueBinding(context.btnsRow2[idx].d.mSurfaceValue, cueSendSlot.mPrePost).setTypeToggle().setSubPage(defaultSubPage)
        page.makeValueBinding(context.knobs1[idx * 2].d.mSurfaceValue, cueSendSlot.mPan).setSubPage(defaultSubPage)
        page.makeValueBinding(context.knobs1[idx * 2 + 1].d.mSurfaceValue, cueSendSlot.mLevel).setSubPage(defaultSubPage)
    }

    defaultSubPage.mOnActivate = function (activeDevice) {
        resetLabels1(context)
        setPageSendsLabels(context)
        sendLableApp1(activeDevice, context)
        sendLableApp2(activeDevice, context)
        context.midiOutput2.sendMidi(activeDevice, [0x90, context.btnsL1L[6].note, 127])
        context.midiOutput4.sendMidi(activeDevice, [0x90, context.btnsL1L[6].note, 127])
    }

    defaultSubPage.mOnDeactivate = function (activeDevice) {
        context.midiOutput2.sendMidi(activeDevice, [0x90, context.btnsL1L[6].note, 0])
        context.midiOutput4.sendMidi(activeDevice, [0x90, context.btnsL1L[6].note, 0])
    }

    return page
}

/**
 * 
 * @param {MR_DeviceDriver} deviceDriver 
 * @param {object} context
 * @returns
 */
function makePageSends(deviceDriver, context) {
    var page = deviceDriver.mMapping.makePage('Cue')
    var subPageArea = page.makeSubPageArea('Sends')
    var defaultSubPage = makeSubPageTransportAndContols(page, subPageArea, context)

    var selectedTrackChannel = page.mHostAccess.mTrackSelection.mMixerChannel

    for (var idx = 0; idx < 8; idx++) {
        var sendSlot = selectedTrackChannel.mSends.getByIndex(idx)
        page.makeValueBinding(context.btnsRow1[idx].d.mSurfaceValue, sendSlot.mOn).setTypeToggle().setSubPage(defaultSubPage)
        page.makeValueBinding(context.btnsRow2[idx].d.mSurfaceValue, sendSlot.mPrePost).setTypeToggle().setSubPage(defaultSubPage)
        page.makeValueBinding(context.knobs1[idx].d.mSurfaceValue, sendSlot.mLevel).setSubPage(defaultSubPage)
    }

    defaultSubPage.mOnActivate = function (activeDevice) {
        for (var i = 0; i < context.numStrips1; i++) {
            context.midiOutput1.sendMidi(activeDevice, [0x90, context.btnsRow3[i].note, 0])
            context.midiOutput3.sendMidi(activeDevice, [0x90, context.btnsRow3[i].note, 0])
            context.midiOutput1.sendMidi(activeDevice, [0x90, context.btnsRow4[i].note, 0])
            context.midiOutput3.sendMidi(activeDevice, [0x90, context.btnsRow4[i].note, 0])
        }
        resetLabels1(context)
        setPageSendsLabels(context)
        sendLableApp1(activeDevice, context)
        sendLableApp2(activeDevice, context)
        context.midiOutput2.sendMidi(activeDevice, [0x90, context.btnsL1L[7].note, 127])
        context.midiOutput4.sendMidi(activeDevice, [0x90, context.btnsL1L[7].note, 127])
    }

    defaultSubPage.mOnDeactivate = function (activeDevice) {
        context.midiOutput2.sendMidi(activeDevice, [0x90, context.btnsL1L[7].note, 0])
        context.midiOutput4.sendMidi(activeDevice, [0x90, context.btnsL1L[7].note, 0])
    }

    return page
}

module.exports = {
    makePageCue,
    makePageSends
}