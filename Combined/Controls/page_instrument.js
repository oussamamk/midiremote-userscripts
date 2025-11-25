var page_common = require('./page_common.js')
var makeSubPageTransportAndContols = page_common.makeSubPageTransportAndContols

var instrumentsMapping = {
    'Kontakt 8': function () {
        return {
            knobs: [],
            faders: [],
            buttons: [],
            tbuttons: [],
            ignore: ['#', 'CC', 'Omni', 'Poly', 'Bank ', 'Foot ', 'Data ', 'Portamento ', 'Channel Volume', 'Balance(', 'Pan(', 'All ', 'Pitchbend', 'Expression(', ' Pedal', 'Sostenuto',  'Legato ', 'Hold ', 'Aftertouch', 'Kontakt'],
            smapping: false
        }
    },
    'Analog Lab V': function () {
        return {
            knobs: [4203, 4205, 4207, 4209, 4303, 4364, 4425, 4434, 4201],
            faders: [4213, 4214, 4215, 4216, 4217, 4218, 4219, 4220, 4221],
            buttons: [4699, 4700],
            tbuttons: [4699, 4700],
            ignore: ['MIDI ', 'MPE_', 'VST_', 'Hardware', 'Channel', 'Analog ', 'Tape ', 'FXA ', 'FXB ', 'Delay ', 'Reverb ', ''],
            smapping: true
        }
    },
    'Augmented GRAND PIANO': function () {
        return {
            knobs: [4203, 4204, 4205, 4202, 4206, 4207, 4208, 4209],
            faders: [4210, 4227, 4244, 4283],
            buttons: [4995, 4996, 4211, 4228, 4245, 4284],
            tbuttons: [4995, 4996],
            ignore: ['MIDI ', 'MPE_', 'VST_', 'Hardware', 'Channel'],
            smapping: true
        }
    }


}

/**
 * @param {MR_FactoryMappingPage} page 
 * @param {MR_SubPage} subPage
 * @param {MR_ActiveDevice} activeDevice
 * @param {MR_ActiveMapping} activeMapping 
 * @param {MR_HostObjectDirectAccess} dam
 * @param {number} baseID 
 * @param {object} mapping
 * @param {object} context
 * @param {object} buttons
 * @param {object} knobs
 * @param {object} faders
 * @param {MR_HostValueUndefined} customVar
 */
function dynamicInstrumentKnobsButtons(page, subPage, activeDevice, activeMapping, dam, baseID, mapping, context, buttons, knobs, faders, customVar)
{
    var numParams = dam.getNumberOfParameters(activeMapping, baseID)
    var arr = ['baseID:', baseID, 'numParams:', numParams]
    console.log(arr.join(' '))
    var b = mapping.buttons.length
    var k = mapping.knobs.length
    var f = mapping.faders.length
    
    for (var i = 0; i < numParams; i++) {
        var pTag = dam.getParameterTagByIndex(activeMapping, baseID, i)
        var pName = dam.getParameterTitle(activeMapping, baseID, pTag, 20)
        var idx = mapping.buttons.indexOf(pTag)
        var idx2 = mapping.faders.indexOf(pTag)
        var idx3 = mapping.knobs.indexOf(pTag)
        var skip = false

        if (idx < 0 && idx2 < 0 && idx3 < 0) {
            for (var j = 0; j < mapping.ignore.length; j++) {
                if (pName.indexOf(mapping.ignore[j]) != -1) {
                    skip = true
                    break
                }
            }
        }

        if (skip) {
            continue
        }

        var pDisplayValue = dam.getParameterDisplayValue(activeMapping, baseID, pTag)
        var pValue = dam.getParameterProcessValue(activeMapping, baseID, pTag)
        arr = ['pTag:', pTag, 'pName:', pName, 'pDisplayValue:', pDisplayValue, 'pValue', pValue]
        console.log(arr.join(' '))
        var sPos = 0
        var isButton = true

        // some knobs we want to force to on/off ->button
        if (idx < 0) {
            isButton = false
        }


        if (pDisplayValue == 'On' || pDisplayValue == 'Off' || isButton) {
            if (idx >= 0) {
                buttons[idx] = pValue
                sPos = idx
            } else {
                buttons.push(pValue)
                sPos = b
                b++
            }

            if (sPos < context.numStrips1) {
                var bb = page.makeValueBinding(context.btnsRow1[sPos].d.mSurfaceValue, customVar)
                if (mapping.tbuttons.indexOf(pTag) < 0) {
                    bb.setTypeToggle()
                }
                bb.setSubPage(subPage)
                bb.mOnValueChange = function (activeDevice, activeMapping, value, arg3) {
                    dam.setParameterProcessValue(activeMapping, baseID, this.pTag, value)
                    buttons[this.sPos] = value
                }.bind({ pTag, sPos })
                context.btnsRow1[sPos].d.mSurfaceValue.setProcessValue(activeDevice, pValue)
                context.midiOutput1.sendMidi(activeDevice, [0x90, context.btnsRow1[sPos].note, pValue])
            } else if (sPos < (2 * context.numStrips1)) {
                var bb = page.makeValueBinding(context.btnsRow2[sPos - context.numStrips1].d.mSurfaceValue, customVar)
                if (mapping.tbuttons.indexOf(pTag) < 0) {
                    bb.setTypeToggle()
                }
                bb.setSubPage(subPage)
                bb.mOnValueChange = function (activeDevice, activeMapping, value, arg3) {
                    dam.setParameterProcessValue(activeMapping, baseID, this.pTag, value)
                    buttons[this.sPos] = value
                }.bind({ pTag, sPos })
                context.btnsRow2[sPos - context.numStrips1].d.mSurfaceValue.setProcessValue(activeDevice, pValue)
                context.midiOutput1.sendMidi(activeDevice, [0x90, context.btnsRow2[sPos- context.numStrips1].note, pValue])
            }
        } else if (idx2 > 0) {
            faders[idx2] = pValue
            sPos = idx2

            if (sPos < context.numStrips2) {
                page.makeValueBinding(context.faders2[sPos].d.mSurfaceValue, customVar).setValueTakeOverModePickup().setSubPage(subPage).mOnValueChange = function (activeDevice, activeMapping, value, arg3) {
                    dam.setParameterProcessValue(activeMapping, baseID, this.pTag, value)
                    knobs[this.sPos] = value
                }.bind({ pTag, sPos })
                context.faders2[sPos].d.mSurfaceValue.setProcessValue(activeDevice, pValue)
            } else if (sPos < (context.numStrips1 + context.numStrips2)) {
                page.makeValueBinding(context.faders1[sPos - context.numStrips2].d.mSurfaceValue, customVar).setValueTakeOverModePickup().setSubPage(subPage).mOnValueChange = function (activeDevice, activeMapping, value, arg3) {
                    dam.setParameterProcessValue(activeMapping, baseID, this.pTag, value)
                    knobs[this.sPos] = value
                }.bind({ pTag, sPos })
                context.faders1[sPos - context.numStrips1].d.mSurfaceValue.setProcessValue(activeDevice, pValue)
            }
        } else {
            if (idx3 >= 0) {
                knobs[idx3] = pValue
                sPos = idx3
            } else {
                knobs.push(pValue)
                sPos = k
                k++
            }

            if (sPos < context.numStrips2) {
                page.makeValueBinding(context.knobs2[sPos].d.mSurfaceValue, customVar).setValueTakeOverModePickup().setSubPage(subPage).mOnValueChange = function (activeDevice, activeMapping, value, arg3) {
                    dam.setParameterProcessValue(activeMapping, baseID, this.pTag, value)
                    knobs[this.sPos] = value
                }.bind({ pTag, sPos })
                context.knobs2[sPos].d.mSurfaceValue.setProcessValue(activeDevice, pValue)
            } else if (sPos < (context.numStrips1 + context.numStrips2)) {
                page.makeValueBinding(context.knobs1[sPos - context.numStrips2].d.mSurfaceValue, customVar).setValueTakeOverModePickup().setSubPage(subPage).mOnValueChange = function (activeDevice, activeMapping, value, arg3) {
                    dam.setParameterProcessValue(activeMapping, baseID, this.pTag, value)
                    knobs[this.sPos] = value
                }.bind({ pTag, sPos })
                context.knobs1[sPos - context.numStrips2].d.mSurfaceValue.setProcessValue(activeDevice, pValue)
            }
        }
    }
}

/**
 * @param {MR_FactoryMappingPage} page 
 * @param {MR_SubPage} subPage
 * @param {MR_ActiveDevice} activeDevice
 * @param {MR_ActiveMapping} activeMapping 
 * @param {MR_HostObjectDirectAccess} dam
 * @param {number} baseID 
 * @param {object} mapping
 * @param {object} context
 * @param {object} buttons
 * @param {object} knobs
 * @param {object} faders
 * @param {MR_HostValueUndefined} customVar
 */
function staticInstrumentKnobsButtons(page, subPage, activeDevice, activeMapping, dam, baseID, mapping, context, buttons, knobs, faders, customVar)
{
    var b = mapping.buttons.length
    var k = mapping.knobs.length
    var f = mapping.faders.length
   
    for (var sPos = 0; sPos < b; sPos++) {
        var pTag = mapping.buttons[sPos]
        var pName = dam.getParameterTitle(activeMapping, baseID, pTag, 20)

        var pDisplayValue = dam.getParameterDisplayValue(activeMapping, baseID, pTag)
        var pValue = dam.getParameterProcessValue(activeMapping, baseID, pTag)
        // var arr = ['pTag:', pTag, 'pName:', pName, 'pDisplayValue:', pDisplayValue, 'pValue', pValue]
        // console.log(arr.join(' '))

        buttons.push(pValue)
        if (sPos < context.numStrips1) {
            var bb = page.makeValueBinding(context.btnsRow1[sPos].d.mSurfaceValue, customVar)
            if (mapping.tbuttons.indexOf(pTag) < 0) {
                bb.setTypeToggle()
            }
            bb.setSubPage(subPage)
            bb.mOnValueChange = function (activeDevice, activeMapping, value, arg3) {
                dam.setParameterProcessValue(activeMapping, baseID, this.pTag, value)
                buttons[this.sPos] = value
            }.bind({ pTag, sPos })
            context.btnsRow1[sPos].d.mSurfaceValue.setProcessValue(activeDevice, pValue)
            context.midiOutput1.sendMidi(activeDevice, [0x90, context.btnsRow1[sPos].note, pValue])
        } else if (sPos < (2 * context.numStrips1)) {
            var bb = page.makeValueBinding(context.btnsRow2[sPos - context.numStrips1].d.mSurfaceValue, customVar)
            if (mapping.tbuttons.indexOf(pTag) < 0) {
                bb.setTypeToggle()
            }
            bb.setSubPage(subPage)
            bb.mOnValueChange = function (activeDevice, activeMapping, value, arg3) {
                dam.setParameterProcessValue(activeMapping, baseID, this.pTag, value)
                buttons[this.sPos] = value
            }.bind({ pTag, sPos })
            context.btnsRow2[sPos - context.numStrips1].d.mSurfaceValue.setProcessValue(activeDevice, pValue)
            context.midiOutput1.sendMidi(activeDevice, [0x90, context.btnsRow2[sPos - context.numStrips1].note, pValue])
        }
    }

    for (var sPos = 0; sPos < k; sPos++) {
        var pTag = mapping.knobs[sPos]
        var pName = dam.getParameterTitle(activeMapping, baseID, pTag, 20)

        var pDisplayValue = dam.getParameterDisplayValue(activeMapping, baseID, pTag)
        var pValue = dam.getParameterProcessValue(activeMapping, baseID, pTag)
        // var arr = ['pTag:', pTag, 'pName:', pName, 'pDisplayValue:', pDisplayValue, 'pValue', pValue]
        // console.log(arr.join(' '))

        knobs.push(pValue)

        if (sPos < context.numStrips2) {
            page.makeValueBinding(context.knobs2[sPos].d.mSurfaceValue, customVar).setValueTakeOverModePickup().setSubPage(subPage).mOnValueChange = function (activeDevice, activeMapping, value, arg3) {
                dam.setParameterProcessValue(activeMapping, baseID, this.pTag, value)
                knobs[this.sPos] = value
            }.bind({ pTag, sPos })
            context.knobs2[sPos].d.mSurfaceValue.setProcessValue(activeDevice, pValue)
        } else if (sPos < (context.numStrips1 + context.numStrips2)) {
            page.makeValueBinding(context.knobs1[sPos - context.numStrips2].d.mSurfaceValue, customVar).setValueTakeOverModePickup().setSubPage(subPage).mOnValueChange = function (activeDevice, activeMapping, value, arg3) {
                dam.setParameterProcessValue(activeMapping, baseID, this.pTag, value)
                knobs[this.sPos] = value
            }.bind({ pTag, sPos })
            context.knobs1[sPos - context.numStrips2].d.mSurfaceValue.setProcessValue(activeDevice, pValue)
        }
    }

    for (var sPos = 0; sPos < f; sPos++) {
        var pTag = mapping.faders[sPos]
        var pName = dam.getParameterTitle(activeMapping, baseID, pTag, 20)

        var pDisplayValue = dam.getParameterDisplayValue(activeMapping, baseID, pTag)
        var pValue = dam.getParameterProcessValue(activeMapping, baseID, pTag)
        // var arr = ['pTag:', pTag, 'pName:', pName, 'pDisplayValue:', pDisplayValue, 'pValue', pValue]
        // console.log(arr.join(' '))

        knobs.push(pValue)

        if (sPos < context.numStrips2) {
            page.makeValueBinding(context.faders2[sPos].d.mSurfaceValue, customVar).setValueTakeOverModePickup().setSubPage(subPage).mOnValueChange = function (activeDevice, activeMapping, value, arg3) {
                dam.setParameterProcessValue(activeMapping, baseID, this.pTag, value)
                faders[this.sPos] = value
            }.bind({ pTag, sPos })
            context.faders2[sPos].d.mSurfaceValue.setProcessValue(activeDevice, pValue)
        } else if (sPos < (context.numStrips1 + context.numStrips2)) {
            page.makeValueBinding(context.faders1[sPos - context.numStrips2].d.mSurfaceValue, customVar).setValueTakeOverModePickup().setSubPage(subPage).mOnValueChange = function (activeDevice, activeMapping, value, arg3) {
                dam.setParameterProcessValue(activeMapping, baseID, this.pTag, value)
                faders[this.sPos] = value
            }.bind({ pTag, sPos })
            context.faders1[sPos - context.numStrips2].d.mSurfaceValue.setProcessValue(activeDevice, pValue)
        }
    }

}


/**
 * @param {MR_FactoryMappingPage} page 
 * @param {MR_SubPage} subPage
 * @param {MR_HostValueUndefined} customVar
 * @param {*} stripEffectType
 * @param {object} context
 * @param {MR_ActiveDevice} activeDevice
 * @param {MR_ActiveMapping} activeMapping
 * @param {object} buttons
 * @param {object} knobs
 * @param {object} faders
 * @param {object} mapping
 */
function bindInstrumentKnobsButtons(page, subPage, customVar, stripEffectType, context, activeDevice, activeMapping, buttons, knobs, faders, mapping) {
    buttons.length = 0
    knobs.length = 0
    var pZone = stripEffectType.mParameterBankZone
    var dam = page.mHostAccess.makeDirectAccess(pZone)
    var baseID = dam.getBaseObjectID(activeMapping)
    var b = mapping.buttons.length
    var k = mapping.knobs.length
    var f = mapping.faders.length

    for (var i = 0; i < b; i++) {
        buttons.push(false);
    }

    for (var i = 0; i < k; i++) {
        knobs.push(0);
    }

        for (var i = 0; i < f; i++) {
        faders.push(0);
    }

    if (mapping.smapping) {
        staticInstrumentKnobsButtons(page, subPage, activeDevice, activeMapping, dam, baseID, mapping, context, buttons, knobs, faders, customVar)
    } else {
        dynamicInstrumentKnobsButtons(page, subPage, activeDevice, activeMapping, dam, baseID, mapping, context, buttons, knobs, faders, customVar)
    }

    // bind the unused to dummy
    for (i = b; i < (context.numStrips1 * 2); i++) {
        if (i < context.numStrips1) {
            page.makeCommandBinding(context.btnsRow1[i].d.mSurfaceValue, '', '').setSubPage(subPage)
        } else {
            page.makeCommandBinding(context.btnsRow2[i - context.numStrips1].d.mSurfaceValue, '', '').setSubPage(subPage)            
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
        mapping.knobs = []
        mapping.faders = []
        mapping.ignore = []
        mapping.smapping = false
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


    var buttons = []
    var knobs = []
    var faders = []
    instrument.mOnChangePluginIdentity = function (activeDevice, activeMapping, name, vendor, version, format) {
        var arr = ["name:", name, "vendor:", vendor, "version:", version, "format:", format]
        console.log(arr.join(' '))
        var mapping = getInstrumentMappping(name)
        bindInstrumentKnobsButtons(page, defaultSubPage, customVar, instrument, context, activeDevice, activeMapping, buttons, knobs, faders, mapping)
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