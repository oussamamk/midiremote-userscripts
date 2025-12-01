var page_common = require('./page_common.js')
var makeSubPageTransportAndContols = page_common.makeSubPageTransportAndContols

/**
 * 
 * @param {MR_DeviceDriver} deviceDriver 
 * @param {object} context
 * @returns
 */
function makePageCue(deviceDriver, context) {
    var page = deviceDriver.mMapping.makePage('Sends')
    var subPageArea = page.makeSubPageArea('Cue')
    var defaultSubPage = subPageArea.makeSubPage('default')

    makeSubPageTransportAndContols(page, subPageArea, context)

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
        context.btnsL1U[7].t=''
        context.btnsL1U[8].t=''
        context.midiOutput2.sendMidi(activeDevice, [0x90, context.btnsL1L[6].note, 127])
        context.midiOutput4.sendMidi(activeDevice, [0x90, context.btnsL1L[6].note, 127])
    }.bind({ context })

    defaultSubPage.mOnDeactivate = function (activeDevice) {
        context.midiOutput2.sendMidi(activeDevice, [0x90, context.btnsL1L[6].note, 0])
        context.midiOutput4.sendMidi(activeDevice, [0x90, context.btnsL1L[6].note, 0])
    }.bind({ context })

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
    var defaultSubPage = subPageArea.makeSubPage('default')

    makeSubPageTransportAndContols(page, subPageArea, context)

    var selectedTrackChannel = page.mHostAccess.mTrackSelection.mMixerChannel

    for (var idx = 0; idx < 8; idx++) {
        var sendSlot = selectedTrackChannel.mSends.getByIndex(idx)
        page.makeValueBinding(context.btnsRow1[idx].d.mSurfaceValue, sendSlot.mOn).setTypeToggle().setSubPage(defaultSubPage)
        page.makeValueBinding(context.btnsRow2[idx].d.mSurfaceValue, sendSlot.mPrePost).setTypeToggle().setSubPage(defaultSubPage)
        page.makeValueBinding(context.knobs1[idx].d.mSurfaceValue, sendSlot.mLevel).setSubPage(defaultSubPage)
    }

    defaultSubPage.mOnActivate = function (activeDevice) {
        context.btnsL1U[7].t = ''
        context.btnsL1U[8].t = ''
        context.midiOutput2.sendMidi(activeDevice, [0x90, context.btnsL1L[7].note, 127])
        context.midiOutput4.sendMidi(activeDevice, [0x90, context.btnsL1L[7].note, 127])
    }.bind({ context })

    defaultSubPage.mOnDeactivate = function (activeDevice) {
        context.midiOutput2.sendMidi(activeDevice, [0x90, context.btnsL1L[7].note, 0])
        context.midiOutput4.sendMidi(activeDevice, [0x90, context.btnsL1L[7].note, 0])
    }.bind({ context })

    return page
}

module.exports = {
    makePageCue,
    makePageSends
}