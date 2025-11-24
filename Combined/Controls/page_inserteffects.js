var page_common = require('./page_common.js')
var makeSubPageTransportAndContols = page_common.makeSubPageTransportAndContols
var bindEffectKnobsButtons = page_common.bindEffectKnobsButtons

var effectsMapping = {
    'CSR Hall': function () {
        return {
            knobs: ['Mix', 'Diffusion', 'Rvb Time', 'Low Time', 'High Freq', 'High Damp'],
            buttons: ['Bypass'],
            ignore: ['In', 'Out']
        }
    },
    'Dual Spring': function () {
        return {
            knobs: [],
            buttons: ['Bypass', 'Mono A', 'Stretch A', 'Mono B', 'Stretch B'],
            ignore: []
        }
    },
    'RC 48': function () {
        return {
            knobs: [],
            buttons: ['Bypass', 'Algorithm', 'Mix Mode', 'Size Mode'],
            ignore: ['Echo']
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
        mapping.buttons = []
        mapping.knobs = []
        mapping.ignore = []
    }
    return mapping
}

/**
 * @param {MR_DeviceDriver} deviceDriver 
 * @param {MR_FactoryMappingPage} page 
 * @param {object} context
 */
function makePageInsertEffects(deviceDriver, page, context) {
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
    insertViewer.mOnChangePluginIdentity = function (activeDevice, activeMapping, name, vendor, version, format) {
        // var arr = ["name:", name, "vendor:", vendor, "version:", version, "format:", format]
        // console.log(arr.join(' '))
        var mapping = getEffectsMappping(name)
        bindEffectKnobsButtons(page, defaultSubPage, customVar, insertViewer, context, activeDevice, activeMapping, buttons, knobs, mapping)
    }

    defaultSubPage.mOnActivate = function (activeDevice, activeMapping) {
        for (var i = 0; i < context.numStrips1; i++) {
            context.midiOutput1.sendMidi(activeDevice, [0x90, context.btnsRow1[i].note, 0])
            context.midiOutput1.sendMidi(activeDevice, [0x90, context.btnsRow2[i].note, 0])
        }

    }
}

module.exports = {
    makePageInsertEffects
}