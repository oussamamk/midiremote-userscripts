var helper = require("./helper.js")
var sendLableApp1 = helper.sendLableApp1
var sendLableApp2 = helper.sendLableApp2


var page_common = require('./page_common.js')
var makeSubPageTransportAndContols = page_common.makeSubPageTransportAndContols
var bindInstrumentKnobsButtons = page_common.bindInstrumentKnobsButtons
var resetLabels1 = page_common.resetLabels1
var resetLabels2 = page_common.resetLabels2
var updateEffectsKnobsButtons = page_common.updateEffectsKnobsButtons


var effectsMapping = {
    'CSR Hall': function () {
        return {
            knobs1: [4203, 4213, 4206, 4207, 4209, 4210],
            buttons: [4226],
            smapping: false
        }
    }

}

/**
 * @param {string} name
 */
function getEffectsMappping(name) {
    var mapping = {}
    if (effectsMapping[name]) {
        mapping = effectsMapping[name]()
    }
    else {
        mapping.ignore = ['MIDI CC', 'InVu', 'OutVu']
        mapping.smapping = false
    }
    return mapping
}

/**
 * @param {MR_DeviceDriver} deviceDriver 
 * @param {object} context
 */
function makePageInsertEffects(deviceDriver, context) {
    var page = deviceDriver.mMapping.makePage('InsertEffects')
    var subPageArea = page.makeSubPageArea('InserEffects')
    var defaultSubPage = subPageArea.makeSubPage('default')

    makeSubPageTransportAndContols(page, subPageArea, context)
    var customVar = page.mCustom.makeHostValueVariable('customVar');
    var insertViewer = page.mHostAccess.mTrackSelection.mMixerChannel.mInsertAndStripEffects.makeInsertEffectViewer('insertsViewer')
    insertViewer.followPluginWindowInFocus()

    for (var i = 0; i < context.numStrips1; i++) {
        page.makeCommandBinding(context.knobs1[i].d.mSurfaceValue, '', '')
        page.makeCommandBinding(context.btnsRow1[i].d.mSurfaceValue, '', '')
        page.makeCommandBinding(context.btnsRow2[i].d.mSurfaceValue, '', '')
    }

    for (var i = 0; i < context.numStrips2; i++) {
        page.makeCommandBinding(context.knobs2[i].d.mSurfaceValue, '', '')
    }

    for (var i = 0; i < 8; i++) {
        var insertSlot = page.mHostAccess.mTrackSelection.mMixerChannel.mInsertAndStripEffects.makeInsertEffectViewer('insertsSlot' + 1)
        var slot = insertSlot.accessSlotAtIndex(i)
        page.makeValueBinding(context.btnsRow4[i].d.mSurfaceValue, slot.mEdit).setTypeToggle()
    }

    var effectContext = {}
    effectContext.values = {}
    effectContext.values.buttons = [false, false, false, false, false, false, false, false,
        false, false, false, false, false, false, false, false]
    effectContext.values.knobs = [0, 0, 0, 0, 0, 0, 0, 0,
        0, 0, 0, 0, 0, 0, 0, 0, 0]
    effectContext.values.faders = [0, 0, 0, 0, 0, 0, 0, 0,
        0, 0, 0, 0, 0, 0, 0, 0, 0]
    effectContext.names = {}
    effectContext.names.buttons = ['', '', '', '', '', '', '', '',
        '', '', '', '', '', '', '', '']
    effectContext.names.knobs = ['', '', '', '', '', '', '', '',
        '', '', '', '', '', '', '', '', '']
    effectContext.names.faders = ['', '', '', '', '', '', '', '',
        '', '', '', '', '', '', '', '', '']
    insertViewer.mOnChangePluginIdentity = function (activeDevice, activeMapping, name, vendor, version, format) {
        resetLabels1(context)
        resetLabels2(context)
        if (effectsMapping[name] != null) {
            var mapping = getEffectsMappping(name)
            bindInstrumentKnobsButtons(page, defaultSubPage, customVar, insertViewer, context, activeDevice, activeMapping, effectContext, mapping, true)
        } else {
            var mapping = getEffectsMappping(name)
            bindInstrumentKnobsButtons(page, defaultSubPage, customVar, insertViewer, context, activeDevice, activeMapping, effectContext, mapping, true)
        }
        updateEffectsKnobsButtons(context, activeDevice, effectContext)
        sendLableApp1(activeDevice, context)
        sendLableApp2(activeDevice, context)
    }

    defaultSubPage.mOnActivate = function (activeDevice, activeMapping) {
        for (var i = 0; i < context.numStrips1; i++) {
            context.midiOutput1.sendMidi(activeDevice, [0x90, context.btnsRow1[i].note, 0])
            context.midiOutput1.sendMidi(activeDevice, [0x90, context.btnsRow2[i].note, 0])
            context.midiOutput1.sendMidi(activeDevice, [0x90, context.btnsRow3[i].note, 0])
            context.midiOutput1.sendMidi(activeDevice, [0x90, context.btnsRow4[i].note, 0])
            context.midiOutput3.sendMidi(activeDevice, [0x90, context.btnsRow1[i].note, 0])
            context.midiOutput3.sendMidi(activeDevice, [0x90, context.btnsRow2[i].note, 0])
            context.midiOutput3.sendMidi(activeDevice, [0x90, context.btnsRow3[i].note, 0])
            context.midiOutput3.sendMidi(activeDevice, [0x90, context.btnsRow4[i].note, 0])
            context.btnsRow4[i].d.mSurfaceValue.setProcessValue(activeDevice, 0)
        }

        context.btnsL1U[7].t = ''
        context.btnsL1U[8].t = ''
        context.midiOutput2.sendMidi(activeDevice, [0x90, context.btnsL1L[8].note, 127])
        context.midiOutput4.sendMidi(activeDevice, [0x90, context.btnsL1L[8].note, 127])
    }

    defaultSubPage.mOnDeactivate = function (activeDevice, activeMapping) {
        for (var i = 0; i < context.numStrips1; i++) {
            context.btnsRow4[i].d.mSurfaceValue.setProcessValue(activeDevice, 0)
        }
    }

    return page
}

module.exports = {
    makePageInsertEffects
}