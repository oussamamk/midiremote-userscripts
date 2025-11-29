var page_common = require('./page_common.js')
var makeSubPageTransportAndContols = page_common.makeSubPageTransportAndContols
var bindInstrumentKnobsButtons = page_common.bindInstrumentKnobsButtons

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
            knobs1: [],
            knobs2: [4203, 4205, 4207, 4209, 4303, 4364, 4425, 4434, 4201],
            faders1: [],
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
            knobs2: [],
            faders1: [4210, 4227, 4244, 4283],
            faders2: [],
            buttons: [4995, 4996, 4211, 4228, 4245, 4284],
            tbuttons: [4995, 4996],
            ignore: ['MIDI ', 'MPE_', 'VST_', 'Hardware', 'Channel'],
            smapping: true
        }
    },
    'Kontakt8 - Perfect Sounds': function () {
        return {
            knobs1: [4222, 4223, 4224, ],
            knobs2: [],
            faders1: [4220],
            faders2: [4211, 4212, 4213, 4214, 4215, 4216, 4217, 4218, 4219],
            buttons: [4226, 4227 ],
            tbuttons: [],
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
        mapping.buttons = []
        mapping.tbuttons = []
        mapping.knobs1 = []
        mapping.knobs2 = []
        mapping.faders1 = []
        mapping.faders2 = []
        mapping.ignore = []
        mapping.smapping = true
    }
    return mapping
}


/**
 * @param {MR_DeviceDriver} deviceDriver 
 * @param {MR_FactoryMappingPage} page 
 * @param {object} context
 */
function makePageInstrument(deviceDriver, page, context) {
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


    var buttons = [false, false, false, false, false, false, false, false,
                   false, false, false, false, false, false, false, false]
    var knobs = [0, 0, 0, 0 , 0 ,0 ,0 , 0,
                 0, 0, 0, 0 , 0 ,0 ,0 , 0, 0]
    var faders = [0, 0, 0, 0 , 0 ,0 ,0 , 0,
                 0, 0, 0, 0 , 0 ,0 ,0 , 0, 0]
    instrument.mOnChangePluginIdentity = function (activeDevice, activeMapping, name, vendor, version, format) {
        var arr = ["name:", name, "vendor:", vendor, "version:", version, "format:", format]
        console.log(arr.join(' '))
        if (instrumentsMapping[name]) {
            var mapping = getInstrumentMappping(name)
            bindInstrumentKnobsButtons(page, defaultSubPage, customVar, instrument, context, activeDevice, activeMapping, buttons, knobs, faders, mapping)
        }
    }


    page.mHostAccess.mTrackSelection.mMixerChannel.mOnTitleChange = function(activeDevice, activeMapping, title) {
        console.log("title: " + title)
        if (instrumentsMapping[title]) {
            var mapping = getInstrumentMappping(title)
            bindInstrumentKnobsButtons(page, defaultSubPage, customVar, instrument, context, activeDevice, activeMapping, buttons, knobs, faders, mapping)
        }
    }

    defaultSubPage.mOnActivate = function (activeDevice, activeMapping) {
        for (var i = 0; i < context.numStrips1; i++) {
            context.midiOutput1.sendMidi(activeDevice, [0x90, context.btnsRow1[i].note, 0])
            context.midiOutput1.sendMidi(activeDevice, [0x90, context.btnsRow2[i].note, 0])
        }

    }
}

module.exports = {
    makePageInstrument
}