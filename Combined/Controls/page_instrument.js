var helper = require("./helper.js")
var sendLableApp1 = helper.sendLableApp1
var sendLableApp2 = helper.sendLableApp2


var page_common = require('./page_common.js')
var makeSubPageTransportAndContols = page_common.makeSubPageTransportAndContols
var bindInstrumentKnobsButtons = page_common.bindInstrumentKnobsButtons
var resetLabels1 = page_common.resetLabels1
var resetLabels2 = page_common.resetLabels2
var updateEffectsKnobsButtons = page_common.updateEffectsKnobsButtons

var instrumentsMapping = {
    // 'Kontakt 8': function () {
    //     return {
    //         knobs1: [],
    //         knobs2: [],
    //         faders1: [],
    //         faders2: [],
    //         buttons: [],
    //         tbuttons: [],
    //         ignore: ['#', 'CC', 'Omni', 'Poly', 'Bank ', 'Foot ', 'Data ', 'Portamento ', 'Channel Volume', 'Balance(', 'Pan(', 'All ', 'Pitchbend', 'Expression(', ' Pedal', 'Sostenuto', 'Legato ', 'Hold ', 'Aftertouch', 'Kontakt'],
    //         smapping: false
    //     }
    // },
    'Analog Lab V': function () {
        return {
            knobs2: [4203, 4205, 4207, 4209, 4303, 4364, 4425, 4434, 4201],
            faders2: [4213, 4214, 4215, 4216, 4217, 4218, 4219, 4220, 4221],
            buttons: [4699, 4700],
            tbuttons: [4699, 4700],
            ignore: ['MIDI ', 'MPE_', 'VST_', 'Hardware', 'Channel', 'Analog ', 'Tape ', 'FXA ', 'FXB ', 'Delay ', 'Reverb ', ''],
            smapping: true
        }
    },
    'Augmented GRAND PIANO': function () {
        return {
            knobs1: [4203, 4204, 4205, 4202, 4206, 4207, 4208, 4209],
            faders1: [4210, 4227, 4244, 4283],
            buttons: [4995, 4996, 4211, 4228, 4245, 4284],
            tbuttons: [4995, 4996],
            ignore: ['MIDI ', 'MPE_', 'VST_', 'Hardware', 'Channel'],
            smapping: true
        }
    },
    'Kontakt - Perfect Sounds': function () {
        return {
            knobs1: [4222, 4223, 4224, ],
            faders1: [4220],
            faders2: [4211, 4212, 4213, 4214, 4215, 4216, 4217, 4218, 4219],
            buttons: [4226, 4227 ],
            ignore: ['#', 'CC', 'Omni', 'Poly', 'Bank ', 'Foot ', 'Data ', 'Portamento ', 'Channel Volume', 'Balance(', 'Pan(', 'All ', 'Pitchbend', 'Expression(', ' Pedal', 'Sostenuto', 'Legato ', 'Hold ', 'Aftertouch', 'Kontakt'],
            smapping: true
        }
    }
}

/**
 * @param {string} name
 */
function getInstrumentMappping(name) {
    var mapping = {}
    if (instrumentsMapping[name]) {
        mapping = instrumentsMapping[name]()
    }
    else {
        mapping.ignore = ['#', 'CC', 'Omni', 'Poly', 'Bank ', 'Foot ', 'Data ', 'Portamento ', 'Channel Volume', 'Balance(', 'Pan(', 'All ', 'Pitchbend', 'Expression(', ' Pedal', 'Sostenuto', 'Legato ', 'Hold ', 'Aftertouch', 'Kontakt']
        mapping.smapping = true
    }
    return mapping
}

/**
 * @param {MR_DeviceDriver} deviceDriver 
 * @param {object} context
 */
function makePageInstrument(deviceDriver, context) {
    var page = deviceDriver.mMapping.makePage('Instrument')
    var subPageArea = page.makeSubPageArea('InserEffects')
    var defaultSubPage = subPageArea.makeSubPage('default')

    makeSubPageTransportAndContols(page, subPageArea, context)
    var customVar = page.mCustom.makeHostValueVariable('customVar');
    var instrument = page.mHostAccess.mTrackSelection.mMixerChannel.mInstrumentPluginSlot

    for (var i = 0; i < context.numStrips1; i++) {
        page.makeCommandBinding(context.knobs1[i].d.mSurfaceValue, '', '')
        page.makeCommandBinding(context.btnsRow1[i].d.mSurfaceValue, '', '')
        page.makeCommandBinding(context.btnsRow2[i].d.mSurfaceValue, '', '')
    }

    for (var i = 0; i < context.numStrips2; i++) {
        page.makeCommandBinding(context.knobs2[i].d.mSurfaceValue, '', '')
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
    instrument.mOnChangePluginIdentity = function (activeDevice, activeMapping, name, vendor, version, format) {
        var arr = ["name:", name, "vendor:", vendor, "version:", version, "format:", format]
        console.log(arr.join(' '))
        resetLabels1(context)
        resetLabels2(context)
        if (instrumentsMapping[name]) {
            var mapping = getInstrumentMappping(name)
            bindInstrumentKnobsButtons(page, defaultSubPage, customVar, instrument, context, activeDevice, activeMapping, effectContext, mapping, false)
        }
        updateEffectsKnobsButtons(context, activeDevice, effectContext)
        sendLableApp1(activeDevice, context)
        sendLableApp2(activeDevice, context)
    }

    page.mHostAccess.mTrackSelection.mMixerChannel.mOnTitleChange = function(activeDevice, activeMapping, title) {
        console.log("title: " + title)
        resetLabels1(context)
        resetLabels2(context)   
        if (instrumentsMapping[title]) {
            var mapping = getInstrumentMappping(title)
            bindInstrumentKnobsButtons(page, defaultSubPage, customVar, instrument, context, activeDevice, activeMapping, effectContext, mapping, false)
        }
        updateEffectsKnobsButtons(context, activeDevice, effectContext)
        sendLableApp1(activeDevice, context)
        sendLableApp2(activeDevice, context)
    }

    defaultSubPage.mOnActivate = function (activeDevice, activeMapping) {
        for (var i = 0; i < context.numStrips1; i++) {
            context.midiOutput1.sendMidi(activeDevice, [0x90, context.btnsRow1[i].note, 0])
            context.midiOutput1.sendMidi(activeDevice, [0x90, context.btnsRow2[i].note, 0])
        }
    }

    return page
}

module.exports = {
    makePageInstrument
}