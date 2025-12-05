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

    context.btnControls[0].t = 'Commands Page'
    context.btnControls[1].t = 'Up'
    context.btnControls[2].t = 'Mixer'
    context.btnControls[3].t = 'Left'
    context.btnControls[4].t = 'Down'
    context.btnControls[5].t = 'Right'
}

/**
 * @param {MR_FactoryMappingPage} page 
 * @param {MR_SubPageArea} subPageArea
 * @param {object} context 
 * @return {MR_SubPage}
 */
function makeMarkerSubPage(page, subPageArea, context) {
    var subPage = subPageArea.makeSubPage('marker')
    page.makeCommandBinding(context.btnControls[1].d.mSurfaceValue, 'Marker', 'Insert Marker').setSubPage(subPage)
    page.makeCommandBinding(context.btnControls[3].d.mSurfaceValue, 'Transport', 'Locate Previous Event').setSubPage(subPage)
    page.makeCommandBinding(context.btnControls[5].d.mSurfaceValue, 'Transport', 'Locate Next Event').setSubPage(subPage)
    page.makeCommandBinding(context.btnControls[4].d.mSurfaceValue, 'Transport', '').setSubPage(subPage)

    return subPage
}

/**
 * @param {MR_FactoryMappingPage} page 
 * @param {MR_SubPageArea} subPageArea
 * @param {object} context 
 * @return {MR_SubPage}
 */
function makeZoomSubPage(page, subPageArea, context) {
    var subPage = subPageArea.makeSubPage('zoom')
    page.makeCommandBinding(context.btnControls[5].d.mSurfaceValue, 'Zoom', 'Zoom In').setSubPage(subPage)
    page.makeCommandBinding(context.btnControls[3].d.mSurfaceValue, 'Zoom', 'Zoom Out').setSubPage(subPage)
    page.makeCommandBinding(context.btnControls[4].d.mSurfaceValue, 'Zoom', 'Zoom In Vertically').setSubPage(subPage)
    page.makeCommandBinding(context.btnControls[1].d.mSurfaceValue, 'Zoom', 'Zoom Out Vertically').setSubPage(subPage)
    return subPage
}

/**
 * @param {MR_DeviceDriver} deviceDriver 
 * @param {object} context 
 */
function makePageMixer(deviceDriver, context) {
    var page = deviceDriver.mMapping.makePage('Mixer')

    var subPageArea = page.makeSubPageArea('mixer')
    var defaultSubPage = subPageArea.makeSubPage('default')

    var defaultVariable = deviceDriver.mSurface.makeCustomValueVariable('default')
    var markerVariable = deviceDriver.mSurface.makeCustomValueVariable('marker')
    var zoomVariable = deviceDriver.mSurface.makeCustomValueVariable('zoom')

    var defaultSubPage = makeSubPageTransportAndContols(page, subPageArea, context)
    var markerSubPage = makeMarkerSubPage(page, subPageArea, context)
    var zoomSubPage = makeZoomSubPage(page, subPageArea, context)

    page.makeActionBinding(defaultVariable, defaultSubPage.mAction.mActivate)

    page.makeActionBinding(zoomVariable, zoomSubPage.mAction.mActivate).setSubPage(defaultSubPage)
    page.makeActionBinding(markerVariable, markerSubPage.mAction.mActivate).setSubPage(defaultSubPage)

    page.makeActionBinding(zoomVariable, defaultSubPage.mAction.mActivate).setSubPage(zoomSubPage)
    page.makeActionBinding(markerVariable, markerSubPage.mAction.mActivate).setSubPage(zoomSubPage)

    page.makeActionBinding(zoomVariable, zoomSubPage.mAction.mActivate).setSubPage(markerSubPage)
    page.makeActionBinding(markerVariable, defaultSubPage.mAction.mActivate).setSubPage(markerSubPage)

    page.makeCommandBinding(context.btnsL1U[7].d.mSurfaceValue, 'Tool', 'Zoom Tool').setSubPage(defaultSubPage).mOnValueChange = function (activeDevice, activeMapping, arg2, arg3) {
        if (arg2 === 1) {
            zoomVariable.setProcessValue(activeDevice, 1)
            context.midiOutput4.sendMidi(activeDevice, [0x90, context.btnsL1U[7].note, 127])
        }
    }

    page.makeCommandBinding(context.btnsL1U[8].d.mSurfaceValue, 'Tool', 'Draw Tool').setSubPage(defaultSubPage).mOnValueChange = function (activeDevice, activeMapping, arg2, arg3) {
        if (arg2 === 1) { 
            markerVariable.setProcessValue(activeDevice, 1)
        }
    }

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

    page.mOnActivate = function (activeDevice) {
        context.midiOutput2.sendMidi(activeDevice, [0x90, context.btnsL1U[7].note, 0])
        context.midiOutput2.sendMidi(activeDevice, [0x90, context.btnsL1U[8].note, 0])
        defaultVariable.setProcessValue(activeDevice, 1)
        context.btnsL1U[7].t='Zoom'
        context.btnsL1U[8].t='Marker'
        setPageDefaultLabels(context)
        sendLableApp1(activeDevice, context)
        sendLableApp2(activeDevice, context)
    }.bind({ context })

    defaultSubPage.mOnActivate = function (activeDevice) {
        context.midiOutput2.sendMidi(activeDevice, [0x90, context.btnsL1U[7].note, 0])
        context.midiOutput2.sendMidi(activeDevice, [0x90, context.btnsL1U[8].note, 0])
    }

    zoomSubPage.mOnActivate = function (activeDevice) {
        console.log("zoomSubPage.mOnActivate")
        context.btnControls[5].t = 'Zoom++'
        context.btnControls[3].t = 'Zoom--'
        context.btnControls[4].t = 'V-Zoom++'
        context.btnControls[1].t = 'V-Zoom--'
        sendLableApp2(activeDevice, context)
        context.midiOutput2.sendMidi(activeDevice, [0x90, context.btnsL1U[7].note, 127])
        context.midiOutput4.sendMidi(activeDevice, [0x90, context.btnsL1U[7].note, 127])
    }

    zoomSubPage.mOnDeactivate = function (activeDevice) {
        context.midiOutput2.sendMidi(activeDevice, [0x90, context.btnsL1U[7].note, 0])
        context.midiOutput4.sendMidi(activeDevice, [0x90, context.btnsL1U[7].note, 0])
        context.btnControls[5].t = 'Up'
        context.btnControls[3].t = 'Down'
        context.btnControls[4].t = 'Right'
        context.btnControls[1].t = 'Left'
        sendLableApp2(activeDevice, context)
    }

    markerSubPage.mOnActivate = function (activeDevice) {
        context.btnControls[5].t = 'Next Marker'
        context.btnControls[3].t = 'Prev Marker'
        context.btnControls[4].t = ''
        context.btnControls[1].t = 'Add Marker'
        sendLableApp2(activeDevice, context)
        context.midiOutput2.sendMidi(activeDevice, [0x90, context.btnsL1U[8].note, 127])
        context.midiOutput4.sendMidi(activeDevice, [0x90, context.btnsL1U[8].note, 127])    
    }

    markerSubPage.mOnDeactivate = function (activeDevice) {
        context.midiOutput2.sendMidi(activeDevice, [0x90, context.btnsL1U[8].note, 0])
        context.midiOutput4.sendMidi(activeDevice, [0x90, context.btnsL1U[8].note, 0])
        context.btnControls[5].t = 'Up'
        context.btnControls[3].t = 'Down'
        context.btnControls[4].t = 'Right'
        context.btnControls[1].t = 'Left'
        sendLableApp2(activeDevice, context)
    }

    return page
}

module.exports = {
    makePageMixer
}