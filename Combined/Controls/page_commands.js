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
}

module.exports = {
    makePageCommands
}