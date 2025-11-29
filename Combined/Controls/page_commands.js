var page_common = require('./page_common.js')
var makeSubPageTransportAndContols = page_common.makeSubPageTransportAndContols

/**
 * 
 * @param {MR_DeviceDriver} deviceDriver 
 * @param {MR_FactoryMappingPage} page 
 * @param {object} context
 * @returns
 */
function makePageCommands(deviceDriver, page, context) {
    var subPageArea = page.makeSubPageArea('commands')
    var defaultSubPage = subPageArea.makeSubPage('default')

    makeSubPageTransportAndContols(page, subPageArea, context)

    page.makeCommandBinding(context.btnsRow1[0].d.mSurfaceValue, 'AddTrack', 'Instrument').setSubPage(defaultSubPage)
    page.makeCommandBinding(context.btnsRow1[1].d.mSurfaceValue, 'AddTrack', 'Audio').setSubPage(defaultSubPage)
    page.makeCommandBinding(context.btnsRow1[2].d.mSurfaceValue, 'Macro', 'Duplicate Selected Tracks without Data').setSubPage(defaultSubPage)
    page.makeCommandBinding(context.btnsRow4[0].d.mSurfaceValue, 'MIDI', 'Reset').setSubPage(defaultSubPage)
}

module.exports = {
    makePageCommands
}