var page_common = require('./page_common.js')
var makeSubPageTransportAndContols = page_common.makeSubPageTransportAndContols
var bindInstrumentKnobsButtons = page_common.bindInstrumentKnobsButtons
var updateEffectsKnobsButtons = page_common.updateEffectsKnobsButtons
var resetLabels1 = page_common.resetLabels1
var resetLabels2 = page_common.resetLabels2

var helper = require("./helper.js")
var sendLableApp1 = helper.sendLableApp1
var sendLableApp2 = helper.sendLableApp2

function setPageChannelStripLabels(context) {
    resetLabels1(context)
    resetLabels2(context)
    context.btnsRow1[0].t = 'Gate On/Off'
    context.btnsRow2[0].t = 'Gate Bypass'
    context.btnsRow3[0].t = 'Gate Load Preset'
    context.btnsRow4[0].t = 'Gate SubPage'
    context.btnsRow1[1].t = 'Comp On/Off'
    context.btnsRow2[1].t = 'Comp Bypass'
    context.btnsRow3[1].t = 'Comp Load Preset'
    context.btnsRow4[1].t = 'Comp SubPage'
    context.btnsRow1[2].t = 'Tools On/Off'
    context.btnsRow2[2].t = 'Tools Bypass'
    context.btnsRow3[2].t = 'Tools Load Preset'
    context.btnsRow4[2].t = 'Tools SubPage'
    context.btnsRow1[3].t = 'Saturator On/Off'
    context.btnsRow2[3].t = 'Saturator Bypass'
    context.btnsRow3[3].t = 'Saturator Load Preset'
    context.btnsRow4[3].t = 'Saturator SubPage'
    context.btnsRow1[4].t = 'Limiter On/Off'
    context.btnsRow2[4].t = 'Limiter Bypass'
    context.btnsRow3[4].t = 'Limiter Load Preset'
    context.btnsRow4[4].t = 'Limiter SubPage'
}

function setSubPageGateLabels(context) {
    resetLabels1(context)
    resetLabels2(context)
    context.btnsRow3[0].t = 'Gate Load Preset'
    context.btnsRow4[0].t = 'Back Page'
    context.btnsRow3[1].t = 'Comp Load Preset'
    context.btnsRow4[1].t = 'Comp SubPage'
    context.btnsRow3[2].t = 'Tools Load Preset'
    context.btnsRow4[2].t = 'Tools SubPage'
    context.btnsRow3[3].t = 'Saturator Load Preset'
    context.btnsRow4[3].t = 'Saturator SubPage'
    context.btnsRow3[4].t = 'Limiter Load Preset'
    context.btnsRow4[4].t = 'Limiter SubPage'
}

function setSubPageCompLabels(context) {
    resetLabels1(context)
    resetLabels2(context)
    context.btnsRow3[0].t = 'Gate Load Preset'
    context.btnsRow4[0].t = 'Gate SubPage'
    context.btnsRow3[1].t = 'Comp Load Preset'
    context.btnsRow4[1].t = 'Back Page'
    context.btnsRow3[2].t = 'Tools Load Preset'
    context.btnsRow4[2].t = 'Tools SubPage'
    context.btnsRow3[3].t = 'Saturator Load Preset'
    context.btnsRow4[3].t = 'Saturator SubPage'
    context.btnsRow3[4].t = 'Limiter Load Preset'
    context.btnsRow4[4].t = 'Limiter SubPage'
}

function setSubPageToolsLabels(context) {
    resetLabels1(context)
    resetLabels2(context)
    context.btnsRow3[0].t = 'Gate Load Preset'
    context.btnsRow4[0].t = 'Gate SubPage'
    context.btnsRow3[1].t = 'Comp Load Preset'
    context.btnsRow4[1].t = 'Comp SubPage'
    context.btnsRow3[2].t = 'Tools Load Preset'
    context.btnsRow4[2].t = 'Back Page'
    context.btnsRow3[3].t = 'Saturator Load Preset'
    context.btnsRow4[3].t = 'Saturator SubPage'
    context.btnsRow3[4].t = 'Limiter Load Preset'
    context.btnsRow4[4].t = 'Limiter SubPage'
}

function setSubPageSaturatorLabels(context) {
    resetLabels1(context)
    resetLabels2(context)
    context.btnsRow3[0].t = 'Gate Load Preset'
    context.btnsRow4[0].t = 'Gate SubPage'
    context.btnsRow3[1].t = 'Comp Load Preset'
    context.btnsRow4[1].t = 'Comp SubPage'
    context.btnsRow3[2].t = 'Tools Load Preset'
    context.btnsRow4[2].t = 'Tools SubPage'
    context.btnsRow3[3].t = 'Saturator Load Preset'
    context.btnsRow4[3].t = 'Back Page'
    context.btnsRow3[4].t = 'Limiter Load Preset'
    context.btnsRow4[4].t = 'Limiter SubPage'
}

function setSubPageLimiterLabels(context) {
    resetLabels1(context)
    resetLabels2(context)
    context.btnsRow3[0].t = 'Gate Load Preset'
    context.btnsRow4[0].t = 'Gate SubPage'
    context.btnsRow3[1].t = 'Comp Load Preset'
    context.btnsRow4[1].t = 'Comp SubPage'
    context.btnsRow3[2].t = 'Tools Load Preset'
    context.btnsRow4[2].t = 'Tools SubPage'
    context.btnsRow3[3].t = 'Saturator Load Preset'
    context.btnsRow4[3].t = 'Saturator SubPage'
    context.btnsRow3[4].t = 'Limiter Load Preset'
    context.btnsRow4[4].t = 'Back Page'
}

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
            ignore: ['InVu', 'OutVu', , 'Red', 'MakeupMode'],
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
            ignore: ['Input Vu', 'Output Vu',],
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
function getChannelStripPluginMapping(name) {
    var mapping = {}
    if (stripChannelEffectsMapping[name]) {
        mapping = stripChannelEffectsMapping[name]()
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
function makePageChannelStrip(deviceDriver, context) {
    var page = deviceDriver.mMapping.makePage('ChannelStrip')
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

    var gateContext = {}
    gateContext.values = {}
    gateContext.values.buttons = [false, false, false, false, false, false, false, false,
        false, false, false, false, false, false, false, false]
    gateContext.values.knobs = [0, 0, 0, 0, 0, 0, 0, 0,
        0, 0, 0, 0, 0, 0, 0, 0, 0]
    gateContext.values.faders = [0, 0, 0, 0, 0, 0, 0, 0,
        0, 0, 0, 0, 0, 0, 0, 0, 0]
    gateContext.names = {}
    gateContext.names.buttons = ['', '', '', '', '', '', '', '',
        '', '', '', '', '', '', '', '']
    gateContext.names.knobs = ['', '', '', '', '', '', '', '',
        '', '', '', '', '', '', '', '', '']
    gateContext.names.faders = ['', '', '', '', '', '', '', '',
        '', '', '', '', '', '', '', '', '']
    stripEffects.mGate.mOnChangePluginIdentity = function (activeDevice, activeMapping, name, vendor, version, formatVersion) {
        var mapping = getChannelStripPluginMapping(name)
        bindInstrumentKnobsButtons(page, gateSubPage, customVar, stripEffects.mGate, context, activeDevice, activeMapping, gateContext, mapping, true)
    }.bind({ context, gateContext })


    var compContext = {}
    compContext.values = {}
    compContext.values.buttons = [false, false, false, false, false, false, false, false,
        false, false, false, false, false, false, false, false]
    compContext.values.knobs = [0, 0, 0, 0, 0, 0, 0, 0,
        0, 0, 0, 0, 0, 0, 0, 0, 0]
    compContext.values.faders = [0, 0, 0, 0, 0, 0, 0, 0,
        0, 0, 0, 0, 0, 0, 0, 0, 0]
    compContext.names = {}
    compContext.names.buttons = ['', '', '', '', '', '', '', '',
        '', '', '', '', '', '', '', '']
    compContext.names.knobs = ['', '', '', '', '', '', '', '',
        '', '', '', '', '', '', '', '', '']
    compContext.names.faders = ['', '', '', '', '', '', '', '',
        '', '', '', '', '', '', '', '', '']
    stripEffects.mCompressor.mOnChangePluginIdentity = function (activeDevice, activeMapping, name, vendor, version, formatVersion) {
        var mapping = getChannelStripPluginMapping(name)
        bindInstrumentKnobsButtons(page, compressorSubPage, customVar, stripEffects.mCompressor, context, activeDevice, activeMapping, compContext, mapping, true)
    }

    var toolsContext = {}
    toolsContext.values = {}
    toolsContext.values.buttons = [false, false, false, false, false, false, false, false,
        false, false, false, false, false, false, false, false]
    toolsContext.values.knobs = [0, 0, 0, 0, 0, 0, 0, 0,
        0, 0, 0, 0, 0, 0, 0, 0, 0]
    toolsContext.values.faders = [0, 0, 0, 0, 0, 0, 0, 0,
        0, 0, 0, 0, 0, 0, 0, 0, 0]
    toolsContext.names = {}
    toolsContext.names.buttons = ['', '', '', '', '', '', '', '',
        '', '', '', '', '', '', '', '']
    toolsContext.names.knobs = ['', '', '', '', '', '', '', '',
        '', '', '', '', '', '', '', '', '']
    toolsContext.names.faders = ['', '', '', '', '', '', '', '',
        '', '', '', '', '', '', '', '', '']
    stripEffects.mTools.mOnChangePluginIdentity = function (activeDevice, activeMapping, name, vendor, version, formatVersion) {
        var mapping = getChannelStripPluginMapping(name)
        bindInstrumentKnobsButtons(page, toolsSubPage, customVar, stripEffects.mTools, context, activeDevice, activeMapping, toolsContext, mapping, true)
    }

    var saturatorContext = {}
    saturatorContext.values = {}
    saturatorContext.values.buttons = [false, false, false, false, false, false, false, false,
        false, false, false, false, false, false, false, false]
    saturatorContext.values.knobs = [0, 0, 0, 0, 0, 0, 0, 0,
        0, 0, 0, 0, 0, 0, 0, 0, 0]
    saturatorContext.values.faders = [0, 0, 0, 0, 0, 0, 0, 0,
        0, 0, 0, 0, 0, 0, 0, 0, 0]
    saturatorContext.names = {}
    saturatorContext.names.buttons = ['', '', '', '', '', '', '', '',
        '', '', '', '', '', '', '', '']
    saturatorContext.names.knobs = ['', '', '', '', '', '', '', '',
        '', '', '', '', '', '', '', '', '']
    saturatorContext.names.faders = ['', '', '', '', '', '', '', '',
        '', '', '', '', '', '', '', '', '']
    stripEffects.mSaturator.mOnChangePluginIdentity = function (activeDevice, activeMapping, name, vendor, version, formatVersion) {
        var mapping = getChannelStripPluginMapping(name)
        bindInstrumentKnobsButtons(page, saturatorSubPage, customVar, stripEffects.mSaturator, context, activeDevice, activeMapping, saturatorContext, mapping, true)
    }

    var limiterContext = {}
    limiterContext.values = {}
    limiterContext.values.buttons = [false, false, false, false, false, false, false, false,
        false, false, false, false, false, false, false, false]
    limiterContext.values.knobs = [0, 0, 0, 0, 0, 0, 0, 0,
        0, 0, 0, 0, 0, 0, 0, 0, 0]
    limiterContext.values.faders = [0, 0, 0, 0, 0, 0, 0, 0,
        0, 0, 0, 0, 0, 0, 0, 0, 0]
    limiterContext.names = {}
    limiterContext.names.buttons = ['', '', '', '', '', '', '', '',
        '', '', '', '', '', '', '', '']
    limiterContext.names.knobs = ['', '', '', '', '', '', '', '',
        '', '', '', '', '', '', '', '', '']
    limiterContext.names.faders = ['', '', '', '', '', '', '', '',
        '', '', '', '', '', '', '', '', '']
    stripEffects.mLimiter.mOnChangePluginIdentity = function (activeDevice, activeMapping, name, vendor, version, formatVersion) {
        var mapping = getChannelStripPluginMapping(name)
        bindInstrumentKnobsButtons(page, limiterSubPage, customVar, stripEffects.mLimiter, context, activeDevice, activeMapping, limiterContext, mapping, true)
    }

    defaultSubPage.mOnActivate = function (activeDevice) {
        for (var i = 0; i < context.numStrips1; i++) {
            context.midiOutput1.sendMidi(activeDevice, [0x90, context.btnsRow1[i].note, 0])
            context.midiOutput3.sendMidi(activeDevice, [0x90, context.btnsRow1[i].note, 0])
            context.midiOutput1.sendMidi(activeDevice, [0x90, context.btnsRow2[i].note, 0])
            context.midiOutput3.sendMidi(activeDevice, [0x90, context.btnsRow2[i].note, 0])
            context.midiOutput1.sendMidi(activeDevice, [0x90, context.btnsRow3[i].note, 0])
            context.midiOutput3.sendMidi(activeDevice, [0x90, context.btnsRow3[i].note, 0])
            context.midiOutput1.sendMidi(activeDevice, [0x90, context.btnsRow4[i].note, 0])
            context.midiOutput3.sendMidi(activeDevice, [0x90, context.btnsRow4[i].note, 0])
        }

        context.btnsL1U[7].t = ''
        context.btnsL1U[8].t = ''
        setPageChannelStripLabels(context)
        sendLableApp1(activeDevice, context)
        sendLableApp2(activeDevice, context)
        context.midiOutput2.sendMidi(activeDevice, [0x90, context.btnsL1L[5].note, 127])
        context.midiOutput4.sendMidi(activeDevice, [0x90, context.btnsL1L[5].note, 127])
    }

    defaultSubPage.mOnDeactivate = function (activeDevice) {
        context.midiOutput2.sendMidi(activeDevice, [0x90, context.btnsL1L[5].note, 0])
        context.midiOutput4.sendMidi(activeDevice, [0x90, context.btnsL1L[5].note, 0])
    }

    gateSubPage.mOnActivate = function (activeDevice) {
        context.midiOutput1.sendMidi(activeDevice, [0x90, context.btnsRow4[0].note, 127])
        context.midiOutput1.sendMidi(activeDevice, [0x90, context.btnsRow4[1].note, 0])
        context.midiOutput1.sendMidi(activeDevice, [0x90, context.btnsRow4[2].note, 0])
        context.midiOutput1.sendMidi(activeDevice, [0x90, context.btnsRow4[3].note, 0])
        context.midiOutput1.sendMidi(activeDevice, [0x90, context.btnsRow4[4].note, 0])
        context.midiOutput3.sendMidi(activeDevice, [0x90, context.btnsRow4[0].note, 127])
        context.midiOutput3.sendMidi(activeDevice, [0x90, context.btnsRow4[1].note, 0])
        context.midiOutput3.sendMidi(activeDevice, [0x90, context.btnsRow4[2].note, 0])
        context.midiOutput3.sendMidi(activeDevice, [0x90, context.btnsRow4[3].note, 0])
        context.midiOutput3.sendMidi(activeDevice, [0x90, context.btnsRow4[4].note, 0])
        setSubPageGateLabels(context)
        updateEffectsKnobsButtons(context, activeDevice, gateContext)
        sendLableApp1(activeDevice, context)
        sendLableApp2(activeDevice, context)
    }

    gateSubPage.mOnDeactivate = function (activeDevice) {
        context.midiOutput1.sendMidi(activeDevice, [0x90, context.btnsRow4[0].note, 0])
    }

    compressorSubPage.mOnActivate = function (activeDevice) {
        context.midiOutput1.sendMidi(activeDevice, [0x90, context.btnsRow4[0].note, 0])
        context.midiOutput1.sendMidi(activeDevice, [0x90, context.btnsRow4[1].note, 127])
        context.midiOutput1.sendMidi(activeDevice, [0x90, context.btnsRow4[2].note, 0])
        context.midiOutput1.sendMidi(activeDevice, [0x90, context.btnsRow4[3].note, 0])
        context.midiOutput1.sendMidi(activeDevice, [0x90, context.btnsRow4[4].note, 0])
        context.midiOutput3.sendMidi(activeDevice, [0x90, context.btnsRow4[0].note, 0])
        context.midiOutput3.sendMidi(activeDevice, [0x90, context.btnsRow4[1].note, 127])
        context.midiOutput3.sendMidi(activeDevice, [0x90, context.btnsRow4[2].note, 0])
        context.midiOutput3.sendMidi(activeDevice, [0x90, context.btnsRow4[3].note, 0])
        context.midiOutput3.sendMidi(activeDevice, [0x90, context.btnsRow4[4].note, 0])
        setSubPageCompLabels(context)
        updateEffectsKnobsButtons(context, activeDevice, compContext)
        sendLableApp1(activeDevice, context)
        sendLableApp2(activeDevice, context)
    }

    compressorSubPage.mOnDeactivate = function (activeDevice) {
        context.midiOutput1.sendMidi(activeDevice, [0x90, context.btnsRow4[1].note, 0])
    }
    toolsSubPage.mOnActivate = function (activeDevice) {
        context.midiOutput1.sendMidi(activeDevice, [0x90, context.btnsRow4[0].note, 0])
        context.midiOutput1.sendMidi(activeDevice, [0x90, context.btnsRow4[1].note, 0])
        context.midiOutput1.sendMidi(activeDevice, [0x90, context.btnsRow4[2].note, 127])
        context.midiOutput1.sendMidi(activeDevice, [0x90, context.btnsRow4[3].note, 0])
        context.midiOutput1.sendMidi(activeDevice, [0x90, context.btnsRow4[4].note, 0])
        context.midiOutput3.sendMidi(activeDevice, [0x90, context.btnsRow4[0].note, 0])
        context.midiOutput3.sendMidi(activeDevice, [0x90, context.btnsRow4[1].note, 0])
        context.midiOutput3.sendMidi(activeDevice, [0x90, context.btnsRow4[2].note, 127])
        context.midiOutput3.sendMidi(activeDevice, [0x90, context.btnsRow4[3].note, 0])
        context.midiOutput3.sendMidi(activeDevice, [0x90, context.btnsRow4[4].note, 0])
        setSubPageToolsLabels(context)
        updateEffectsKnobsButtons(context, activeDevice, toolsContext)
        sendLableApp1(activeDevice, context)
        sendLableApp2(activeDevice, context)
    }

    toolsSubPage.mOnDeactivate = function (activeDevice) {
        context.midiOutput1.sendMidi(activeDevice, [0x90, context.btnsRow4[2].note, 0])
    }

    saturatorSubPage.mOnActivate = function (activeDevice) {
        context.midiOutput1.sendMidi(activeDevice, [0x90, context.btnsRow4[0].note, 0])
        context.midiOutput1.sendMidi(activeDevice, [0x90, context.btnsRow4[1].note, 0])
        context.midiOutput1.sendMidi(activeDevice, [0x90, context.btnsRow4[2].note, 0])
        context.midiOutput1.sendMidi(activeDevice, [0x90, context.btnsRow4[3].note, 127])
        context.midiOutput1.sendMidi(activeDevice, [0x90, context.btnsRow4[4].note, 0])
        context.midiOutput3.sendMidi(activeDevice, [0x90, context.btnsRow4[0].note, 0])
        context.midiOutput3.sendMidi(activeDevice, [0x90, context.btnsRow4[1].note, 0])
        context.midiOutput3.sendMidi(activeDevice, [0x90, context.btnsRow4[2].note, 0])
        context.midiOutput3.sendMidi(activeDevice, [0x90, context.btnsRow4[3].note, 127])
        context.midiOutput3.sendMidi(activeDevice, [0x90, context.btnsRow4[4].note, 0])
        setSubPageSaturatorLabels(context)
        updateEffectsKnobsButtons(context, activeDevice, saturatorContext)
        sendLableApp1(activeDevice, context)
        sendLableApp2(activeDevice, context)
    }

    saturatorSubPage.mOnDeactivate = function (activeDevice) {
        context.midiOutput1.sendMidi(activeDevice, [0x90, context.btnsRow4[3].note, 0])
    }

    limiterSubPage.mOnActivate = function (activeDevice) {
        context.midiOutput1.sendMidi(activeDevice, [0x90, context.btnsRow4[0].note, 0])
        context.midiOutput1.sendMidi(activeDevice, [0x90, context.btnsRow4[1].note, 0])
        context.midiOutput1.sendMidi(activeDevice, [0x90, context.btnsRow4[2].note, 0])
        context.midiOutput1.sendMidi(activeDevice, [0x90, context.btnsRow4[3].note, 0])
        context.midiOutput1.sendMidi(activeDevice, [0x90, context.btnsRow4[4].note, 127])
        context.midiOutput3.sendMidi(activeDevice, [0x90, context.btnsRow4[0].note, 0])
        context.midiOutput3.sendMidi(activeDevice, [0x90, context.btnsRow4[1].note, 0])
        context.midiOutput3.sendMidi(activeDevice, [0x90, context.btnsRow4[2].note, 0])
        context.midiOutput3.sendMidi(activeDevice, [0x90, context.btnsRow4[3].note, 0])
        context.midiOutput3.sendMidi(activeDevice, [0x90, context.btnsRow4[4].note, 127])
        setSubPageLimiterLabels(context)
        updateEffectsKnobsButtons(context, activeDevice, limiterContext)
        sendLableApp1(activeDevice, context)
        sendLableApp2(activeDevice, context)
    }

    limiterSubPage.mOnDeactivate = function (activeDevice) {
        context.midiOutput1.sendMidi(activeDevice, [0x90, context.btnsRow4[4].note, 0])
    }

    return page
}

module.exports = {
    makePageChannelStrip
}