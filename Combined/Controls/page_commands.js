var page_common = require('./page_common.js')
var makeSubPageTransportAndContols = page_common.makeSubPageTransportAndContols

/**
 * 
 * @param {MR_DeviceDriver} deviceDriver 
 * @param {object} context
 * @returns
 */
function makePageCommands(deviceDriver, context) {
    var page = deviceDriver.mMapping.makePage('Commands')
    var subPageArea = page.makeSubPageArea('commands')
    var defaultSubPage = subPageArea.makeSubPage('default')

    makeSubPageTransportAndContols(page, subPageArea, context)

    page.makeCommandBinding(context.btnsRow1[0].d.mSurfaceValue, 'AddTrack', 'Instrument').setSubPage(defaultSubPage)
    page.makeCommandBinding(context.btnsRow1[1].d.mSurfaceValue, 'AddTrack', 'Audio').setSubPage(defaultSubPage)
    page.makeCommandBinding(context.btnsRow1[2].d.mSurfaceValue, 'Macro', 'Duplicate Selected Tracks without Data').setSubPage(defaultSubPage)
    page.makeCommandBinding(context.btnsRow4[0].d.mSurfaceValue, 'MIDI', 'Reset').setSubPage(defaultSubPage)

    return page
}

module.exports = {
    makePageCommands
}