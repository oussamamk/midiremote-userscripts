var page_common = require('./page_common.js')
var makeSubPageTransportAndContols = page_common.makeSubPageTransportAndContols
var bindInstrumentKnobsButtons = page_common.bindInstrumentKnobsButtons
var updateEffectsKnobsButtons = page_common.updateEffectsKnobsButtons
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
            knobs1: [4201, 4243, 4202, 4203, 4212, 4213],
            buttons: [4215, 4210, 4208, 4214],
            ignore: ['InVu', 'OutVu', 'Live'],
            smapping: false
        }
    },
    'Standard Compressor': function () {
        return {
            knobs1: [4201, 4210, 4202, 4203, 4205],
            buttons: [4216, 4211, 4215],
            ignore: ['InVu', 'OutVu',  , 'Red', 'MakeupMode'],
            smapping: false
        }
    },
    'Tube Compressor': function () {
        return {
            knobs1: [4216, 4217, 4202, 4203, 4218, 4219],
            buttons: [4225, 4215],
            tbuttons: [],
            ignore: ['Input Vu', 'Output Vu'],
            smapping: false
        }
    },
    'VintageCompressor': function () {
        return {
            knobs1: [4216, 4217, 4202, 4203, 4250, 4210],
            buttons: [4219, 4218, 4215],
            ignore: ['Input Vu', 'Output Vu'],
            smapping: false
        }
    },
   'DeEsser': function () {
        return {
            knobs1: [4202, 4201, 4206, 4240, 4241],
            buttons: [4209, 4207, 4242, 4244],
            ignore: ['Input Vu', 'Output Vu'],
            smapping: false
        }
    },
    'EnvelopeShaper': function () {
        return {
            knobs1: [4210, 4212, 4211, 4213],
            buttons: [4218],
            ignore: ['OutVu'],
            smapping: false
        }
    },
    'Magneto II': function () {
        return {
            knobs1: [4201, 4209, 4205, 4210, 4202],
            buttons: [4208, 4212, 4211],
            ignore: ['InVu', 'OutVu'],
            smapping: false
        }
    },
    'Tape Saturation': function () {
        return {
            knobs1: [4201, 4204, 4205, 4202],
            buttons: [4208, 4203, 4206],
            ignore: ['OutVu'],
            smapping: false
        }
    },
    'Tube Saturation': function () {
        return {
            knobs1: [4201, 4203, 4204, 4202],
            buttons: [4206],
            ignore: ['OutVu'],
            smapping: false
        }
    },
    'Brickwall Limiter': function () {
        return {
            knobs1: [4201, 4203],
            buttons: [4215, 4211],
            ignore: ['Input Vu', 'Output Vu', ],
            smapping: false
        }
    },
    'Maximizer': function () {
        return {
            knobs1: [4211, 4214, 4212, 4218, 4203, 5241, 5242, 5243],
            buttons: [4215, 4216, 4213],
            ignore: ['Input Vu', 'Output Vu', 'RMS'],
            smapping: false
        }
    },
    'Standard Limiter': function () {
        return {
            knobs1: [4210, 4203, 4205],
            buttons: [4217, 4211],
            ignore: ['Input Vu', 'Output Vu'],
            smapping: false
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
        // mapping.buttons = []
        // mapping.tbuttons = []
        // mapping.knobs1 = []
        // mapping.knobs2 = []
        // mapping.faders1 = []
        // mapping.faders2 = []
        // mapping.ignore = []
        mapping.smapping = true
    }
    return mapping
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

    var gateButtons = [false, false, false, false, false, false, false, false,
                   false, false, false, false, false, false, false, false]
    var gateKnobs = [0, 0, 0, 0 , 0 ,0 ,0 , 0,
                 0, 0, 0, 0 , 0 ,0 ,0 , 0, 0]
    var gateFaders = [0, 0, 0, 0 , 0 ,0 ,0 , 0,
                 0, 0, 0, 0 , 0 ,0 ,0 , 0, 0]
    stripEffects.mGate.mOnChangePluginIdentity = function (activeDevice, activeMapping, name, vendor, version, formatVersion) {
        var mapping = getChannelStripPluginMappping(name)
        bindInstrumentKnobsButtons(page, gateSubPage, customVar, stripEffects.mGate, context, activeDevice, activeMapping, gateButtons, gateKnobs, gateFaders, mapping, true)
    }

    var compButtons = [false, false, false, false, false, false, false, false,
                   false, false, false, false, false, false, false, false]
    var compKnobs = [0, 0, 0, 0 , 0 ,0 ,0 , 0,
                 0, 0, 0, 0 , 0 ,0 ,0 , 0, 0]
    var compFaders = [0, 0, 0, 0 , 0 ,0 ,0 , 0,
                 0, 0, 0, 0 , 0 ,0 ,0 , 0, 0]
    stripEffects.mCompressor.mOnChangePluginIdentity = function (activeDevice, activeMapping, name, vendor, version, formatVersion) {
        var mapping = getChannelStripPluginMappping(name)
        bindInstrumentKnobsButtons(page, compressorSubPage, customVar, stripEffects.mCompressor, context, activeDevice, activeMapping, compButtons, compKnobs, compFaders, mapping, true)
    }

    var toolsButtons = [false, false, false, false, false, false, false, false,
                   false, false, false, false, false, false, false, false]
    var toolsKnobs = [0, 0, 0, 0 , 0 ,0 ,0 , 0,
                 0, 0, 0, 0 , 0 ,0 ,0 , 0, 0]
    var toolsFaders = [0, 0, 0, 0 , 0 ,0 ,0 , 0,
                 0, 0, 0, 0 , 0 ,0 ,0 , 0, 0]
    stripEffects.mTools.mOnChangePluginIdentity = function (activeDevice, activeMapping, name, vendor, version, formatVersion) {
        var mapping = getChannelStripPluginMappping(name)
        bindInstrumentKnobsButtons(page, toolsSubPage, customVar, stripEffects.mTools, context, activeDevice, activeMapping, toolsButtons, toolsKnobs, toolsFaders, mapping, true)
    }

    var saturatorButtons = [false, false, false, false, false, false, false, false,
                   false, false, false, false, false, false, false, false]
    var saturatorKnobs = [0, 0, 0, 0 , 0 ,0 ,0 , 0,
                 0, 0, 0, 0 , 0 ,0 ,0 , 0, 0]
    var saturatorFaders = [0, 0, 0, 0 , 0 ,0 ,0 , 0,
                 0, 0, 0, 0 , 0 ,0 ,0 , 0, 0]
    stripEffects.mSaturator.mOnChangePluginIdentity = function (activeDevice, activeMapping, name, vendor, version, formatVersion) {
        var mapping = getChannelStripPluginMappping(name)
        bindInstrumentKnobsButtons(page, saturatorSubPage, customVar, stripEffects.mSaturator, context, activeDevice, activeMapping, saturatorButtons, saturatorKnobs, saturatorFaders, mapping, true)
    }

    var limiterButtons = [false, false, false, false, false, false, false, false,
                   false, false, false, false, false, false, false, false]
    var limiterKnobs = [0, 0, 0, 0 , 0 ,0 ,0 , 0,
                 0, 0, 0, 0 , 0 ,0 ,0 , 0, 0]
    var limiterFaers = [0, 0, 0, 0 , 0 ,0 ,0 , 0,
                 0, 0, 0, 0 , 0 ,0 ,0 , 0, 0]
    stripEffects.mLimiter.mOnChangePluginIdentity = function (activeDevice, activeMapping, name, vendor, version, formatVersion) {
        var mapping = getChannelStripPluginMappping(name)
        bindInstrumentKnobsButtons(page, limiterSubPage, customVar, stripEffects.mLimiter, context, activeDevice, activeMapping, limiterButtons, limiterKnobs, limiterFaers, mapping, true)
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