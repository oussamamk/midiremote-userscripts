var page_common = require('./page_common.js')
var makeSubPageTransportAndContols = page_common.makeSubPageTransportAndContols
var bindEffectKnobsButtons = page_common.bindEffectKnobsButtons

/**
 * @param {MR_FactoryMappingPage} page 
 * @param {MR_SubPage} subPage
 * @param {MR_HostValueUndefined} customVar
 * @parm {MR_HostObject} stripEffectType
 * @param {object} context
 * @param {number} idx
 */
function makeStripEffectBinding(page, subPage, customVar, stripEffectType, context, idx) {
    var dam = page.mHostAccess.makeDirectAccess(stripEffectType);

    page.makeValueBinding(context.btnsRow1[idx].d.mSurfaceValue, stripEffectType.mOn).setTypeToggle().setSubPage(subPage)
    page.makeValueBinding(context.btnsRow2[idx].d.mSurfaceValue, stripEffectType.mBypass).setTypeToggle().setSubPage(subPage)

    var map1 = page.makeValueBinding(context.btnsRow3[idx].d.mSurfaceValue, customVar).setSubPage(subPage)
    map1.mOnValueChange = function (activeDevice, activeMapping, arg2) {
        if (arg2 === 0) {
            var baseID = dam.getBaseObjectID(activeMapping);
            var numChilds = dam.getNumberOfChildObjects(activeMapping, baseID)
            var tag = 4102;
            var val = 1
            if (numChilds > 0) {
                tag = 4125;
                val = 0
            }
            dam.setParameterProcessValue(activeMapping, baseID, tag, val);
        }
    }
}

var stripChannelEffectsMapping = {
    'Noise Gate': function () {
        return {
            knobs: ['Threshold', 'Range', 'Attack', 'Release', 'FilterFreq', 'Q-Factor'],
            buttons: ['Bypass', 'SCMonitor', 'SCOn', 'Auto Release'],
            ignore: ['InVu', 'OutVu', 'Live']
        }
    },
    'Standard Compressor': function () {
        return {
            knobs: ['Threshold', 'Ratio', 'Attack', 'Release', 'MakeUp'],
            buttons: ['Bypass', 'AutoMakeUp', 'Auto Release'],
            ignore: ['InVu', 'OutVu',  , 'Red', 'MakeupMode']
        }
    },
    'Tube Compressor': function () {
        return {
            knobs: ['Input Gain', 'Output Gain', 'Attack Time', 'Release Time', 'Drive', 'Mix'],
            buttons: ['Bypass', 'Attack Mode' , 'Auto Release'],
            ignore: ['Input Vu', 'Output Vu']
        }
    },
    'VintageCompressor': function () {
        return {
            knobs: ['Input Gain', 'Output Gain', 'Attack Time', 'Release Time', 'Mix', 'Ratio'],
            buttons: ['Bypass', 'Attack Mode', 'Auto Release'],
            ignore: ['Input Vu', 'Output Vu', 'Red']
        }
    },
   'DeEsser': function () {
        return {
            knobs: ['Threshold', 'Reduction', 'Release', 'LowFreq', 'HighFreq'],
            buttons: ['Bypass', 'Solo', 'Diff'],
            ignore: ['Input Vu', 'Output Vu']
        }
    },
    'EnvelopeShaper': function () {
        return {
            knobs: ['Attack Gain', 'Release Gain', 'Attack Length', 'Output'],
            buttons: ['Bypass'],
            ignore: ['OutVu']
        }
    },
    'Magneto II': function () {
        return {
            knobs: ['Saturation', 'Freq-Low', 'HF-Adjust', 'Freq-High', 'Output'],
            buttons: ['Bypass', 'HF-On', 'Solo'],
            ignore: ['InVu', 'OutVu']
        }
    },
    'Tape Saturation': function () {
        return {
            knobs: ['Drive', 'LF', 'HF', 'Output'],
            buttons: ['Bypass', 'Dual', 'Auto Gain'],
            ignore: ['OutVu']
        }
    },
    'Tube Saturation': function () {
        return {
            knobs: ['Drive', 'LF', 'HF', 'Output'],
            buttons: ['Bypass'],
            ignore: ['OutVu']
        }
    },
    'Brickwall Limiter': function () {
        return {
            knobs: ['Threshold', 'Release'],
            buttons: ['Bypass'],
            ignore: ['Input Vu', 'Output Vu', 'Red']
        }
    },
    'Maximizer': function () {
        return {
            knobs: ['Optimize', 'Mix', 'Output', 'Recover', 'Release'],
            buttons: ['Bypass', 'Modern Mode'],
            ignore: ['Input Vu', 'Output Vu', 'RMS', 'Red']
        }
    },
    'Standard Limiter': function () {
        return {
            knobs: ['Input', 'Release', 'Output'],
            buttons: ['Bypass', 'Auto Release'],
            ignore: ['Input Vu', 'Output Vu', 'Red']
        }
    }
}

/**
 * @param {string} name
 */
function getChannelStripPluginMappping(name) {
    var mapping = {}
    if (stripChannelEffectsMapping[name])  {
        mapping = stripChannelEffectsMapping[name]()
    }
    else {
        mapping.buttons = []
        mapping.knobs = []
        mapping.ignore = []
    }
    return mapping
}

/**
 * @param {object} context
 * @param {MR_ActiveDevice} activeDevice
 * @param {object} buttons
 * @param {object} knobs
 */
function updateEffectsKnobsButtons(context, activeDevice, buttons, knobs) {
    for (var i = 0; i < buttons.length; i++) {
        if (i < context.numStrips1) {
            context.btnsRow1[i].d.mSurfaceValue.setProcessValue(activeDevice, buttons[i])
            context.midiOutput1.sendMidi(activeDevice, [0x90, context.btnsRow1[i].note, buttons[i]])
        } else if (i < 2 * context.numStrips1) {
            context.btnsRow2[i - context.numStrips1].d.mSurfaceValue.setProcessValue(activeDevice, buttons[i])
            context.midiOutput1.sendMidi(activeDevice, [0x90, context.btnsRow2[i - context.numStrips1].note, buttons[i]])
        }
    }

    for (var i = 0; i < knobs.length; i++) {
        if (i < context.numStrips1) {
            context.knobs1[i].d.mSurfaceValue.setProcessValue(activeDevice, knobs[i])
        } else if (i < context.numStrips1 + context.numStrips2) {
            context.knobs2[i - context.numStrips1].d.mSurfaceValue.setProcessValue(activeDevice, knobs[i])
        }
    }

    for (i = buttons.length; i < (context.numStrips1 * 2); i++) {
        if (i < context.numStrips1) {
            context.btnsRow1[i].d.mSurfaceValue.setProcessValue(activeDevice, 0)
            context.midiOutput1.sendMidi(activeDevice, [0x90, context.btnsRow1[i].note, 0])
        } else if (i < 2 * context.numStrips1) {
            context.btnsRow2[i - context.numStrips1].d.mSurfaceValue.setProcessValue(activeDevice, 0)
            context.midiOutput1.sendMidi(activeDevice, [0x90, context.btnsRow2[i - context.numStrips1].note, 0])
        }
    }

}


/**
 * @param {MR_DeviceDriver} deviceDriver 
 * @param {MR_FactoryMappingPage} page 
 * @param {object} context
 */
function makePageChannelStrip(deviceDriver, page, context) {
    var subPageArea = page.makeSubPageArea('ChannelStrip')
    var defaultSubPage = subPageArea.makeSubPage('default')
    var gateSubPage = subPageArea.makeSubPage('gate')
    var compressorSubPage = subPageArea.makeSubPage('compressor')
    var toolsSubPage = subPageArea.makeSubPage('tools')
    var saturatorSubPage = subPageArea.makeSubPage('saturator')
    var limiterSubPage = subPageArea.makeSubPage('limiter')

    page.makeActionBinding(context.btnsRow4[0].d.mSurfaceValue, gateSubPage.mAction.mActivate).setSubPage(defaultSubPage)
    page.makeActionBinding(context.btnsRow4[1].d.mSurfaceValue, compressorSubPage.mAction.mActivate).setSubPage(defaultSubPage)
    page.makeActionBinding(context.btnsRow4[2].d.mSurfaceValue, toolsSubPage.mAction.mActivate).setSubPage(defaultSubPage)
    page.makeActionBinding(context.btnsRow4[3].d.mSurfaceValue, saturatorSubPage.mAction.mActivate).setSubPage(defaultSubPage)
    page.makeActionBinding(context.btnsRow4[4].d.mSurfaceValue, limiterSubPage.mAction.mActivate).setSubPage(defaultSubPage)

    page.makeActionBinding(context.btnsRow4[0].d.mSurfaceValue, defaultSubPage.mAction.mActivate).setSubPage(gateSubPage)
    page.makeActionBinding(context.btnsRow4[1].d.mSurfaceValue, compressorSubPage.mAction.mActivate).setSubPage(gateSubPage)
    page.makeActionBinding(context.btnsRow4[2].d.mSurfaceValue, toolsSubPage.mAction.mActivate).setSubPage(gateSubPage)
    page.makeActionBinding(context.btnsRow4[3].d.mSurfaceValue, saturatorSubPage.mAction.mActivate).setSubPage(gateSubPage)
    page.makeActionBinding(context.btnsRow4[4].d.mSurfaceValue, limiterSubPage.mAction.mActivate).setSubPage(gateSubPage)

    page.makeActionBinding(context.btnsRow4[0].d.mSurfaceValue, gateSubPage.mAction.mActivate).setSubPage(compressorSubPage)
    page.makeActionBinding(context.btnsRow4[1].d.mSurfaceValue, defaultSubPage.mAction.mActivate).setSubPage(compressorSubPage)
    page.makeActionBinding(context.btnsRow4[2].d.mSurfaceValue, toolsSubPage.mAction.mActivate).setSubPage(compressorSubPage)
    page.makeActionBinding(context.btnsRow4[3].d.mSurfaceValue, saturatorSubPage.mAction.mActivate).setSubPage(compressorSubPage)
    page.makeActionBinding(context.btnsRow4[4].d.mSurfaceValue, limiterSubPage.mAction.mActivate).setSubPage(compressorSubPage)

    page.makeActionBinding(context.btnsRow4[0].d.mSurfaceValue, gateSubPage.mAction.mActivate).setSubPage(toolsSubPage)
    page.makeActionBinding(context.btnsRow4[1].d.mSurfaceValue, compressorSubPage.mAction.mActivate).setSubPage(toolsSubPage)
    page.makeActionBinding(context.btnsRow4[2].d.mSurfaceValue, defaultSubPage.mAction.mActivate).setSubPage(toolsSubPage)
    page.makeActionBinding(context.btnsRow4[3].d.mSurfaceValue, saturatorSubPage.mAction.mActivate).setSubPage(toolsSubPage)
    page.makeActionBinding(context.btnsRow4[4].d.mSurfaceValue, limiterSubPage.mAction.mActivate).setSubPage(toolsSubPage)

    page.makeActionBinding(context.btnsRow4[0].d.mSurfaceValue, gateSubPage.mAction.mActivate).setSubPage(saturatorSubPage)
    page.makeActionBinding(context.btnsRow4[1].d.mSurfaceValue, compressorSubPage.mAction.mActivate).setSubPage(saturatorSubPage)
    page.makeActionBinding(context.btnsRow4[2].d.mSurfaceValue, toolsSubPage.mAction.mActivate).setSubPage(saturatorSubPage)
    page.makeActionBinding(context.btnsRow4[3].d.mSurfaceValue, defaultSubPage.mAction.mActivate).setSubPage(saturatorSubPage)
    page.makeActionBinding(context.btnsRow4[4].d.mSurfaceValue, limiterSubPage.mAction.mActivate).setSubPage(saturatorSubPage)

    page.makeActionBinding(context.btnsRow4[0].d.mSurfaceValue, gateSubPage.mAction.mActivate).setSubPage(limiterSubPage)
    page.makeActionBinding(context.btnsRow4[1].d.mSurfaceValue, compressorSubPage.mAction.mActivate).setSubPage(limiterSubPage)
    page.makeActionBinding(context.btnsRow4[2].d.mSurfaceValue, toolsSubPage.mAction.mActivate).setSubPage(limiterSubPage)
    page.makeActionBinding(context.btnsRow4[3].d.mSurfaceValue, saturatorSubPage.mAction.mActivate).setSubPage(limiterSubPage)
    page.makeActionBinding(context.btnsRow4[4].d.mSurfaceValue, defaultSubPage.mAction.mActivate).setSubPage(limiterSubPage)

    makeSubPageTransportAndContols(page, subPageArea, context)

    var customVar = page.mCustom.makeHostValueVariable('customVar');
    var selectedTrackChannel = page.mHostAccess.mTrackSelection.mMixerChannel
    var stripEffects = selectedTrackChannel.mInsertAndStripEffects.mStripEffects
    var types = ['mGate', 'mCompressor', 'mTools', 'mSaturator', 'mLimiter'];

    for (var i = 0; i < context.numStrips1; i++) {
        page.makeCommandBinding(context.knobs1[i].d.mSurfaceValue, '', '')
    }

    for (var i = 0; i < context.numStrips2; i++) {
        page.makeCommandBinding(context.knobs2[i].d.mSurfaceValue, '', '')
    }

    for (var i = 0; i < 5; i++) {
        var type = types[i];
        makeStripEffectBinding(page, defaultSubPage, customVar, stripEffects[type], context, i)
    }

    var gateButtons = []
    var gateKnobs = []
    stripEffects.mGate.mOnChangePluginIdentity = function (activeDevice, activeMapping, name, vendor, version, formatVersion) {
        var mapping = getChannelStripPluginMappping(name)
        bindEffectKnobsButtons(page, gateSubPage, customVar, stripEffects.mGate, context, activeDevice, activeMapping, gateButtons, gateKnobs, mapping)
    }

    var compButtons = []
    var compKnobs = []
    stripEffects.mCompressor.mOnChangePluginIdentity = function (activeDevice, activeMapping, name, vendor, version, formatVersion) {
        var mapping = getChannelStripPluginMappping(name)
        bindEffectKnobsButtons(page, compressorSubPage, customVar, stripEffects.mCompressor, context, activeDevice, activeMapping, compButtons, compKnobs, mapping)
    }

    var toolsButtons = []
    var toolsKnobs = []
    stripEffects.mTools.mOnChangePluginIdentity = function (activeDevice, activeMapping, name, vendor, version, formatVersion) {
        var mapping = getChannelStripPluginMappping(name)
        bindEffectKnobsButtons(page, toolsSubPage, customVar, stripEffects.mTools, context, activeDevice, activeMapping, toolsButtons, toolsKnobs, mapping)
    }

    var saturatorButtons = []
    var saturatorKnobs = []
    stripEffects.mSaturator.mOnChangePluginIdentity = function (activeDevice, activeMapping, name, vendor, version, formatVersion) {
        var mapping = getChannelStripPluginMappping(name)
        bindEffectKnobsButtons(page, saturatorSubPage, customVar, stripEffects.mSaturator, context, activeDevice, activeMapping, saturatorButtons, saturatorKnobs, mapping)
    }

    var limiterButtons = []
    var limiterKnobs = []
    stripEffects.mLimiter.mOnChangePluginIdentity = function (activeDevice, activeMapping, name, vendor, version, formatVersion) {
        var mapping = getChannelStripPluginMappping(name)
        bindEffectKnobsButtons(page, limiterSubPage, customVar, stripEffects.mLimiter, context, activeDevice, activeMapping, limiterButtons, limiterKnobs, mapping)
    }

    defaultSubPage.mOnActivate = function (activeDevice) {
        for (var i = 0; i < context.numStrips1; i++) {
            context.midiOutput1.sendMidi(activeDevice, [0x90, context.btnsRow1[i].note, 0])
            context.midiOutput1.sendMidi(activeDevice, [0x90, context.btnsRow2[i].note, 0])
            context.midiOutput1.sendMidi(activeDevice, [0x90, context.btnsRow3[i].note, 0])
            context.midiOutput1.sendMidi(activeDevice, [0x90, context.btnsRow4[i].note, 0])
        }
    }.bind({ context })

    gateSubPage.mOnActivate = function (activeDevice) {
        updateEffectsKnobsButtons(context, activeDevice, gateButtons, gateKnobs)
        context.midiOutput1.sendMidi(activeDevice, [0x90, context.btnsRow4[0].note, 127])
        context.midiOutput1.sendMidi(activeDevice, [0x90, context.btnsRow4[1].note, 0])
        context.midiOutput1.sendMidi(activeDevice, [0x90, context.btnsRow4[2].note, 0])
        context.midiOutput1.sendMidi(activeDevice, [0x90, context.btnsRow4[3].note, 0])
        context.midiOutput1.sendMidi(activeDevice, [0x90, context.btnsRow4[4].note, 0])
    }.bind({ context })

    gateSubPage.mOnDeactivate = function (activeDevice) {
        context.midiOutput1.sendMidi(activeDevice, [0x90, context.btnsRow4[0].note, 0])
    }.bind({ context })

    compressorSubPage.mOnActivate = function (activeDevice) {
        updateEffectsKnobsButtons(context, activeDevice, compButtons, compKnobs)
        context.midiOutput1.sendMidi(activeDevice, [0x90, context.btnsRow4[0].note, 0])
        context.midiOutput1.sendMidi(activeDevice, [0x90, context.btnsRow4[1].note, 127])
        context.midiOutput1.sendMidi(activeDevice, [0x90, context.btnsRow4[2].note, 0])
        context.midiOutput1.sendMidi(activeDevice, [0x90, context.btnsRow4[3].note, 0])
        context.midiOutput1.sendMidi(activeDevice, [0x90, context.btnsRow4[4].note, 0])
    }.bind({ context })

    compressorSubPage.mOnDeactivate = function (activeDevice) {
        context.midiOutput1.sendMidi(activeDevice, [0x90, context.btnsRow4[1].note, 0])
    }.bind({ context })

    toolsSubPage.mOnActivate = function (activeDevice) {
        updateEffectsKnobsButtons(context, activeDevice, toolsButtons, toolsKnobs)
        context.midiOutput1.sendMidi(activeDevice, [0x90, context.btnsRow4[0].note, 0])
        context.midiOutput1.sendMidi(activeDevice, [0x90, context.btnsRow4[1].note, 0])
        context.midiOutput1.sendMidi(activeDevice, [0x90, context.btnsRow4[2].note, 127])
        context.midiOutput1.sendMidi(activeDevice, [0x90, context.btnsRow4[3].note, 0])
        context.midiOutput1.sendMidi(activeDevice, [0x90, context.btnsRow4[4].note, 0])
    }.bind({ context })

    toolsSubPage.mOnDeactivate = function (activeDevice) {
        context.midiOutput1.sendMidi(activeDevice, [0x90, context.btnsRow4[2].note, 0])
    }.bind({ context })

    saturatorSubPage.mOnActivate = function (activeDevice) {
        updateEffectsKnobsButtons(context, activeDevice, saturatorButtons, saturatorKnobs)
        context.midiOutput1.sendMidi(activeDevice, [0x90, context.btnsRow4[0].note, 0])
        context.midiOutput1.sendMidi(activeDevice, [0x90, context.btnsRow4[1].note, 0])
        context.midiOutput1.sendMidi(activeDevice, [0x90, context.btnsRow4[2].note, 0])
        context.midiOutput1.sendMidi(activeDevice, [0x90, context.btnsRow4[3].note, 127])
        context.midiOutput1.sendMidi(activeDevice, [0x90, context.btnsRow4[4].note, 0])
    }.bind({ context })

    saturatorSubPage.mOnDeactivate = function (activeDevice) {
        context.midiOutput1.sendMidi(activeDevice, [0x90, context.btnsRow4[3].note, 0])
    }.bind({ context })

    limiterSubPage.mOnActivate = function (activeDevice) {
        context.midiOutput1.sendMidi(activeDevice, [0x90, context.btnsRow4[4].note, 127])
    }.bind({ context })

    limiterSubPage.mOnDeactivate = function (activeDevice) {
        updateEffectsKnobsButtons(context, activeDevice, limiterButtons, limiterKnobs)
        context.midiOutput1.sendMidi(activeDevice, [0x90, context.btnsRow4[0].note, 0])
        context.midiOutput1.sendMidi(activeDevice, [0x90, context.btnsRow4[1].note, 0])
        context.midiOutput1.sendMidi(activeDevice, [0x90, context.btnsRow4[2].note, 0])
        context.midiOutput1.sendMidi(activeDevice, [0x90, context.btnsRow4[3].note, 127])
        context.midiOutput1.sendMidi(activeDevice, [0x90, context.btnsRow4[4].note, 0])
    }.bind({ context })
}

module.exports = {
    makePageChannelStrip
}