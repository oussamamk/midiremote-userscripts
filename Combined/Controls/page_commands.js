var helper = require("./helper.js")
var sendLableApp1 = helper.sendLableApp1

var page_common = require('./page_common.js')
var makeSubPageTransportAndContols = page_common.makeSubPageTransportAndContols
var resetLabels1 = page_common.resetLabels1
var resetLabels2 = page_common.resetLabels2

/**
 * 
 * @param {MR_ActiveDevice} activeDevice 
 * @param {object} context 
 */
function setCommandsPageLabels(activeDevice, context) {
    resetLabels1(context)
    resetLabels2(context)
    context.btnsRow1[0].t = 'Add Track Instrument'
    context.btnsRow1[1].t = 'Add Track Audio'
    context.btnsRow1[2].t = 'Add Track Audio Mono'
    context.btnsRow1[3].t = 'Add Track Marker'
    context.btnsRow1[4].t = 'Add Track Tempo'
    context.btnsRow1[7].t = 'Metronome Setup'
    context.btnsRow2[0].t = 'Duplicate Tracks'
    context.btnsRow4[0].t = 'Reset MIDI'
    sendLableApp1(activeDevice, context)
}

/**
 * 
 * @param {MR_DeviceDriver} deviceDriver 
 * @param {object} context
 * @returns
 */
function makePageCommands(deviceDriver, context) {
    var page = deviceDriver.mMapping.makePage('Commands')
    var subPageArea = page.makeSubPageArea('commands')
    var defaultSubPage = makeSubPageTransportAndContols(page, subPageArea, context)
    
    page.makeCommandBinding(context.btnsRow1[0].d.mSurfaceValue, 'AddTrack', 'Instrument').setSubPage(defaultSubPage)
    page.makeCommandBinding(context.btnsRow1[1].d.mSurfaceValue, 'AddTrack', 'Audio').setSubPage(defaultSubPage)
    page.makeCommandBinding(context.btnsRow1[2].d.mSurfaceValue, 'AddTrack', 'Audio Mono').setSubPage(defaultSubPage)
    page.makeCommandBinding(context.btnsRow1[3].d.mSurfaceValue, 'AddTrack', 'Marker').setSubPage(defaultSubPage)
    page.makeCommandBinding(context.btnsRow1[4].d.mSurfaceValue, 'AddTrack', 'Tempo').setSubPage(defaultSubPage)
    page.makeCommandBinding(context.btnsRow1[7].d.mSurfaceValue, 'Transport', 'Metronome Setup').setSubPage(defaultSubPage)
    page.makeCommandBinding(context.btnsRow2[0].d.mSurfaceValue, 'Macro', 'Duplicate Selected Tracks without Data').setSubPage(defaultSubPage)
    page.makeCommandBinding(context.btnsRow4[0].d.mSurfaceValue, 'MIDI', 'Reset').setSubPage(defaultSubPage)

    defaultSubPage.mOnActivate = function (activeDevice, activeMapping) {
        setCommandsPageLabels(activeDevice, context)
        context.midiOutput2.sendMidi(activeDevice, [0x90, context.btnControls[0].note, 127])
        context.midiOutput4.sendMidi(activeDevice, [0x90, context.btnControls[0].note, 127])
    }

    defaultSubPage.mOnDeactivate = function (activeDevice, activeMapping) {
        context.midiOutput2.sendMidi(activeDevice, [0x90, context.btnControls[0].note, 0])
        context.midiOutput4.sendMidi(activeDevice, [0x90, context.btnControls[0].note, 0])
    }

    return page
}




module.exports = {
    makePageCommands
}