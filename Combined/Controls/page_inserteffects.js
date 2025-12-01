var page_common = require('./page_common.js')
var makeSubPageTransportAndContols = page_common.makeSubPageTransportAndContols
var bindInstrumentKnobsButtons = page_common.bindInstrumentKnobsButtons

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
        mapping.smapping = true
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

    for (var i= 0; i < 8 ; i++) {
        var insertSlot = page.mHostAccess.mTrackSelection.mMixerChannel.mInsertAndStripEffects.makeInsertEffectViewer('insertsSlot' + 1)
        var slot = insertSlot.accessSlotAtIndex(i)
        page.makeValueBinding(context.btnsRow4[i].d.mSurfaceValue, slot.mEdit).setTypeToggle()
    }

    var buttons = []
    var knobs = []
    var faders = []
    insertViewer.mOnChangePluginIdentity = function (activeDevice, activeMapping, name, vendor, version, format) {
        if (effectsMapping[name] != null) {
            var mapping = getEffectsMappping(name)
            bindInstrumentKnobsButtons(page, defaultSubPage, customVar, insertViewer, context, activeDevice, activeMapping, buttons, knobs, faders, mapping, true)
        } else {
            var arr = ["name:", name, "vendor:", vendor, "version:", version, "format:", format]
            console.log(arr.join(' '))
        }
    }

    defaultSubPage.mOnActivate = function (activeDevice, activeMapping) {
        for (var i = 0; i < context.numStrips1; i++) {
            context.midiOutput1.sendMidi(activeDevice, [0x90, context.btnsRow1[i].note, 0])
            context.midiOutput1.sendMidi(activeDevice, [0x90, context.btnsRow2[i].note, 0])
        }
        context.midiOutput2.sendMidi(activeDevice, [0x90, context.btnsL1L[8].note, 127])
        context.midiOutput4.sendMidi(activeDevice, [0x90, context.btnsL1L[8].note, 127])
    }

    defaultSubPage.mOnDeactivate = function (activeDevice) {
        context.midiOutput2.sendMidi(activeDevice, [0x90, context.btnsL1L[8].note, 0])
        context.midiOutput4.sendMidi(activeDevice, [0x90, context.btnsL1L[8].note, 0])
    }.bind({ context })

    return page
}

module.exports = {
    makePageInsertEffects
}