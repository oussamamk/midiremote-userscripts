var page_common = require('./page_common.js')
var makeSubPageTransportAndContols = page_common.makeSubPageTransportAndContols

/**
 * 
 * @param {MR_DeviceDriver} deviceDriver 
 * @param {MR_FactoryMappingPage} page 
 * @param {object} context
 * @returns
 */
function makePageCue(deviceDriver, page, context) {
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
}

/**
 * 
 * @param {MR_DeviceDriver} deviceDriver 
 * @param {MR_FactoryMappingPage} page 
 * @param {object} context
 * @returns
 */
function makePageSends(deviceDriver, page, context) {
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
}

module.exports = {
    makePageCue,
    makePageSends
}