var helper = require("./helper.js")
var sendLableApp2 = helper.sendLableApp2

/**
 * @param {MR_FactoryMappingPage} page 
 * @param {MR_SubPageArea} subPageArea
 * @param {object} context 
 * @return {MR_SubPage}
 */
function makeSubPageTransportAndContols(page, subPageArea, context) {
    var defaultSubPage = subPageArea.makeSubPage('transport')
    page.makeValueBinding(context.btnForward.d.mSurfaceValue, page.mHostAccess.mTransport.mValue.mForward).setSubPage(defaultSubPage)
    page.makeValueBinding(context.btnRewind.d.mSurfaceValue, page.mHostAccess.mTransport.mValue.mRewind).setSubPage(defaultSubPage)
    page.makeValueBinding(context.btnStart.d.mSurfaceValue, page.mHostAccess.mTransport.mValue.mStart).setTypeToggle().setSubPage(defaultSubPage)
    page.makeValueBinding(context.btnStop.d.mSurfaceValue, page.mHostAccess.mTransport.mValue.mStop).setTypeToggle().setSubPage(defaultSubPage)
    page.makeValueBinding(context.btnRecord.d.mSurfaceValue, page.mHostAccess.mTransport.mValue.mRecord).setTypeToggle().setSubPage(defaultSubPage)
    page.makeCommandBinding(context.btnRight.d.mSurfaceValue, 'Transport', '').setSubPage(defaultSubPage)
    page.makeCommandBinding(context.btnLeft.d.mSurfaceValue, 'Transport', '').setSubPage(defaultSubPage)
    page.makeActionBinding(context.btnDown.d.mSurfaceValue, page.mHostAccess.mTrackSelection.mAction.mNextTrack).setSubPage(defaultSubPage)
    page.makeActionBinding(context.btnUp.d.mSurfaceValue, page.mHostAccess.mTrackSelection.mAction.mPrevTrack).setSubPage(defaultSubPage)
    page.makeValueBinding(context.btnControls[3].d.mSurfaceValue, page.mHostAccess.mTransport.mValue.mRewind).setSubPage(defaultSubPage)
    page.makeValueBinding(context.btnControls[5].d.mSurfaceValue, page.mHostAccess.mTransport.mValue.mForward).setSubPage(defaultSubPage)
    page.makeActionBinding(context.btnControls[4].d.mSurfaceValue, page.mHostAccess.mTrackSelection.mAction.mNextTrack).setSubPage(defaultSubPage)
    page.makeActionBinding(context.btnControls[1].d.mSurfaceValue, page.mHostAccess.mTrackSelection.mAction.mPrevTrack).setSubPage(defaultSubPage)
    page.makeCommandBinding(context.btnControls[2].d.mSurfaceValue, 'Devices', 'Mixer').setSubPage(defaultSubPage)
    page.makeValueBinding(context.btnsL1U[0].d.mSurfaceValue, page.mHostAccess.mTransport.mValue.mMetronomeActive).setTypeToggle().setSubPage(defaultSubPage)
    page.makeValueBinding(context.btnsL1U[1].d.mSurfaceValue, page.mHostAccess.mTransport.mValue.mCycleActive).setTypeToggle().setSubPage(defaultSubPage)
    page.makeValueBinding(context.btnsL1U[2].d.mSurfaceValue, page.mHostAccess.mTrackSelection.mMixerChannel.mValue.mAutomationRead).setTypeToggle().setSubPage(defaultSubPage)
    page.makeValueBinding(context.btnsL1U[3].d.mSurfaceValue, page.mHostAccess.mTrackSelection.mMixerChannel.mValue.mAutomationWrite).setTypeToggle().setSubPage(defaultSubPage)
    page.makeValueBinding(context.btnsL1U[4].d.mSurfaceValue, page.mHostAccess.mTrackSelection.mMixerChannel.mValue.mMonitorEnable).setTypeToggle().setSubPage(defaultSubPage)
    page.makeValueBinding(context.btnsL1U[5].d.mSurfaceValue, page.mHostAccess.mTrackSelection.mMixerChannel.mValue.mEditorOpen).setTypeToggle().setSubPage(defaultSubPage)
    page.makeCommandBinding(context.btnsL1L[0].d.mSurfaceValue, 'Edit', 'Undo').setSubPage(defaultSubPage)
    page.makeCommandBinding(context.btnsL1L[1].d.mSurfaceValue, 'Edit', 'Redo').setSubPage(defaultSubPage)
    page.makeCommandBinding(context.btnsL1L[2].d.mSurfaceValue, 'Edit', 'Unmute All').setSubPage(defaultSubPage)
    page.makeCommandBinding(context.btnsL1L[3].d.mSurfaceValue, 'Edit', 'Deactivate All Solo').setSubPage(defaultSubPage)

    var zoomSubPage = makeZoomSubPage(page, subPageArea, context)
    var markerSubPage = makeMarkerSubPage(page, subPageArea, context)

    page.makeCommandBinding(context.btnsL1U[7].d.mSurfaceValue, 'Tool', 'Zoom Tool').setSubPage(defaultSubPage).mOnValueChange = function (activeDevice, activeMapping, arg2, arg3) {
        if (arg2 === 1) {
            zoomSubPage.mAction.mActivate.trigger(activeMapping)
        }
    }

    page.makeCommandBinding(context.btnsL1U[8].d.mSurfaceValue, 'Tool', 'Draw Tool').setSubPage(defaultSubPage).mOnValueChange = function (activeDevice, activeMapping, arg2, arg3) {
        if (arg2 === 1) {
            markerSubPage.mAction.mActivate.trigger(activeMapping)
        }
    }
    page.makeCommandBinding(context.btnsL1U[7].d.mSurfaceValue, 'Tool', 'Zoom Tool').setSubPage(zoomSubPage).mOnValueChange = function (activeDevice, activeMapping, arg2, arg3) {
        if (arg2 === 1) {
            defaultSubPage.mAction.mActivate.trigger(activeMapping)
        }
    }

    page.makeCommandBinding(context.btnsL1U[8].d.mSurfaceValue, 'Tool', 'Draw Tool').setSubPage(zoomSubPage).mOnValueChange = function (activeDevice, activeMapping, arg2, arg3) {
        if (arg2 === 1) {
            markerSubPage.mAction.mActivate.trigger(activeMapping)
        }
    }

    page.makeCommandBinding(context.btnsL1U[7].d.mSurfaceValue, 'Tool', 'Zoom Tool').setSubPage(markerSubPage).mOnValueChange = function (activeDevice, activeMapping, arg2, arg3) {
        if (arg2 === 1) {
            zoomSubPage.mAction.mActivate.trigger(activeMapping)
        }
    }

    page.makeCommandBinding(context.btnsL1U[8].d.mSurfaceValue, 'Tool', 'Draw Tool').setSubPage(markerSubPage).mOnValueChange = function (activeDevice, activeMapping, arg2, arg3) {
        if (arg2 === 1) {
            defaultSubPage.mAction.mActivate.trigger(activeMapping)
        }
    }

    return defaultSubPage
}

function setLabelsTransportAndControls(context) {
    context.btnsL1U[0].t = 'Metronome'
    context.btnsL1U[1].t = 'Cycle'
    context.btnsL1U[2].t = 'Auto-Read'
    context.btnsL1U[3].t = 'Auto-Write'
    context.btnsL1U[4].t = 'Monitor'
    context.btnsL1U[5].t = 'Channel Settings'
    context.btnsL1U[6].t = 'Instrument'
    context.btnsL1U[7].t = 'Zoom'
    context.btnsL1U[8].t = 'Marker'

    context.btnsL1L[0].t = 'Undo'
    context.btnsL1L[1].t = 'Redo'
    context.btnsL1L[2].t = 'UnMute All'
    context.btnsL1L[3].t = 'UnSolo All'
    context.btnsL1L[4].t = 'EQ'
    context.btnsL1L[5].t = 'Channel Strip'
    context.btnsL1L[6].t = 'Cue'
    context.btnsL1L[7].t = 'Sends'
    context.btnsL1L[8].t = 'Insert Effects'

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

    subPage.mOnActivate = function (activeDevice) {
        context.btnControls[5].t = 'Next Marker'
        context.btnControls[3].t = 'Prev Marker'
        context.btnControls[4].t = ''
        context.btnControls[1].t = 'Add Marker'
        sendLableApp2(activeDevice, context)
        context.midiOutput2.sendMidi(activeDevice, [0x90, context.btnsL1U[8].note, 127])
        context.midiOutput4.sendMidi(activeDevice, [0x90, context.btnsL1U[8].note, 127])
    }

    subPage.mOnDeactivate = function (activeDevice) {
        context.midiOutput2.sendMidi(activeDevice, [0x90, context.btnsL1U[8].note, 0])
        context.midiOutput4.sendMidi(activeDevice, [0x90, context.btnsL1U[8].note, 0])
        context.btnControls[5].t = 'Up'
        context.btnControls[3].t = 'Down'
        context.btnControls[4].t = 'Right'
        context.btnControls[1].t = 'Left'
        sendLableApp2(activeDevice, context)
    }

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

    subPage.mOnActivate = function (activeDevice) {
        context.btnControls[5].t = 'Zoom++'
        context.btnControls[3].t = 'Zoom--'
        context.btnControls[4].t = 'V-Zoom++'
        context.btnControls[1].t = 'V-Zoom--'
        sendLableApp2(activeDevice, context)
        context.midiOutput2.sendMidi(activeDevice, [0x90, context.btnsL1U[7].note, 127])
        context.midiOutput4.sendMidi(activeDevice, [0x90, context.btnsL1U[7].note, 127])
    }

    subPage.mOnDeactivate = function (activeDevice) {
        context.midiOutput2.sendMidi(activeDevice, [0x90, context.btnsL1U[7].note, 0])
        context.midiOutput4.sendMidi(activeDevice, [0x90, context.btnsL1U[7].note, 0])
        context.btnControls[5].t = 'Up'
        context.btnControls[3].t = 'Down'
        context.btnControls[4].t = 'Right'
        context.btnControls[1].t = 'Left'
        sendLableApp2(activeDevice, context)
    }

    return subPage
}

/**
 * @param {MR_FactoryMappingPage} page 
 * @param {MR_SubPage} subPage
 * @param {MR_ActiveDevice} activeDevice
 * @param {MR_HostObjectDirectAccess} dam
 * @param {object} context
 * @param {object} sObjects
 * @param {number} baseID 
 * @param {number} pTag 
 * @param {object} mapping
 * @param {object} effectContext
 * @param {MR_HostValueUndefined} customVar
 * @param {*} pValue
 * @param {number} sPos
 * @param {number} offset
 * @param {string} pName
 */
function assignButtons(page, subPage, activeDevice, dam, context, sObjects, baseID, pTag, mapping, effectContext, customVar, pValue, sPos, offset, pName) {
    var bb = page.makeValueBinding(sObjects[sPos - offset].d.mSurfaceValue, customVar)
    if (mapping.tbuttons == null || mapping.tbuttons.indexOf(pTag) < 0) {
        bb.setTypeToggle()
    }
    bb.setSubPage(subPage)
    bb.mOnValueChange = function (activeDevice, activeMapping, value, arg3) {
        if (offset == 0) {
            context.midiOutput1.sendMidi(activeDevice, [0x90, context.btnsRow1[this.sPos].note, value > 0 ? 127 : 0])
            context.midiOutput3.sendMidi(activeDevice, [0x90, context.btnsRow1[this.sPos].note, value > 0 ? 127 : 0])
        } else {
            context.midiOutput2.sendMidi(activeDevice, [0x90, context.btnsRow2[this.sPos - this.offset].note, value > 0 ? 127 : 0])
            context.midiOutput4.sendMidi(activeDevice, [0x90, context.btnsRow2[this.sPos - this.offset].note, value > 0 ? 127 : 0])
        }
        dam.setParameterProcessValue(activeMapping, baseID, this.pTag, value)
        effectContext.values.buttons[sPos] = value > 0 ? true : false
    }.bind({ pTag, sPos, offset })
    sObjects[sPos - offset].d.mSurfaceValue.setProcessValue(activeDevice, pValue > 0 ? 1 : 0)
    context.midiOutput1.sendMidi(activeDevice, [0x90, sObjects[sPos - offset].note, pValue > 0 ? 127 : 0])
    effectContext.names.buttons[sPos] = pName
    effectContext.values.buttons[sPos] = pValue > 0 ? true : false
}

/**
 * @param {MR_FactoryMappingPage} page 
 * @param {MR_SubPage} subPage
 * @param {MR_ActiveDevice} activeDevice
 * @param {MR_HostObjectDirectAccess} dam
 * @param {object} context
 * @param {object} sObjects
 * @param {number} baseID 
 * @param {number} pTag 
 * @param {object} effectContext
 * @param {MR_HostValueUndefined} customVar
 * @param {*} pValue
 * @param {number} sPos
 * @param {number} offset
 * @param {string} pName
 */
function assignFaders(page, subPage, activeDevice, dam, context, sObjects, baseID, pTag, effectContext, customVar, pValue, sPos, offset, pName) {
    page.makeValueBinding(sObjects[sPos - offset].d.mSurfaceValue, customVar).setSubPage(subPage).mOnValueChange = function (activeDevice, activeMapping, value, arg3) {
        var result = Math.round(value * 127)
        if (offset == 0) {
            context.midiOutput1.sendMidi(activeDevice, [0xE0 + sPos, 0, result])
            context.midiOutput3.sendMidi(activeDevice, [0xE0 + sPos, 0, result])
        } else {
            context.midiOutput2.sendMidi(activeDevice, [0xB0, context.faders2[this.sPos - this.offset].cc, result])
            context.midiOutput4.sendMidi(activeDevice, [0xB0, context.faders2[this.sPos - this.offset].cc, result])
        }
        dam.setParameterProcessValue(activeMapping, baseID, this.pTag, value)
        effectContext.values.faders[sPos] = value
    }.bind({ pTag, sPos, offset })
    sObjects[sPos - offset].d.mSurfaceValue.setProcessValue(activeDevice, pValue)
    effectContext.names.faders[sPos] = pName
    effectContext.values.faders[sPos] = pValue
}

/**
 * @param {MR_FactoryMappingPage} page 
 * @param {MR_SubPage} subPage
 * @param {MR_ActiveDevice} activeDevice
 * @param {MR_HostObjectDirectAccess} dam
 * @param {object} context
 * @param {object} sObjects
 * @param {number} baseID 
 * @param {number} pTag 
 * @param {object} effectContext
 * @param {MR_HostValueUndefined} customVar
 * @param {*} pValue
 * @param {number} sPos
 * @param {number} offset
 * @param {string} pName
 */
function assignKnobs(page, subPage, activeDevice, dam, context, sObjects, baseID, pTag, effectContext, customVar, pValue, sPos, offset, pName) {
    page.makeValueBinding(sObjects[sPos - offset].d.mSurfaceValue, customVar).setSubPage(subPage).mOnValueChange = function (activeDevice, activeMapping, value, arg3) {
        var result = Math.round(value * 127)
        if (offset == 0) {
            context.midiOutput1.sendMidi(activeDevice, [0xB0, context.knobs1[this.sPos].cc, result])
            context.midiOutput3.sendMidi(activeDevice, [0xB0, context.knobs1[this.sPos].cc, result])
        } else {
            context.midiOutput2.sendMidi(activeDevice, [0xB0, context.knobs2[this.sPos - this.offset].cc, result])
            context.midiOutput4.sendMidi(activeDevice, [0xB0, context.knobs2[this.sPos - this.offset].cc, result])
        }
        dam.setParameterProcessValue(activeMapping, baseID, this.pTag, value)
        effectContext.values.knobs[sPos] = value
    }.bind({ pTag, sPos, offset })
    sObjects[sPos - offset].d.mSurfaceValue.setProcessValue(activeDevice, pValue)
    effectContext.names.knobs[sPos] = pName
    effectContext.values.knobs[sPos] = pValue
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
 * @param {object} effectContext
 * @param {MR_HostValueUndefined} customVar
 * @param {boolean} autoButton
 */
function dynamicInstrumentKnobsButtons(page, subPage, activeDevice, activeMapping, dam, baseID, mapping, context, effectContext, customVar, autoButton) {
    var numParams = dam.getNumberOfParameters(activeMapping, baseID)
    var arr = ['baseID:', baseID, 'numParams:', numParams]
    console.log(arr.join(' '))
    var k1 = mapping.knobs1 != null ? mapping.knobs1.length : 0
    var k2 = mapping.knobs2 != null ? mapping.knobs2.length : 0
    var b = mapping.buttons != null ? mapping.buttons.length : 0

    for (var i = 0; i < numParams; i++) {
        var pTag = dam.getParameterTagByIndex(activeMapping, baseID, i)
        var pName = dam.getParameterTitle(activeMapping, baseID, pTag, 20)
        var bidx = mapping.buttons != null ? mapping.buttons.indexOf(pTag) : -1
        var f1idx = mapping.faders1 != null ? mapping.faders1.indexOf(pTag) : -1
        var f2idx = mapping.faders2 != null ? mapping.faders2.indexOf(pTag) : -1
        var k1idx = mapping.knobs1 != null ? mapping.knobs1.indexOf(pTag) : -1
        var k2idx = mapping.knobs2 != null ? mapping.knobs2.indexOf(pTag) : -1

        var total = bidx + f1idx + f2idx + k1idx + k2idx
        var skip = false

        if (total == -5) {
            var ignoreLen = mapping.ignore != null ? mapping.ignore.length : 0
            for (var j = 0; j < ignoreLen; j++) {
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
        var isButton = false

        if (autoButton) {
            if (bidx < 0 && pDisplayValue == 'On' || pDisplayValue == 'Off') {
                isButton = true
            }
        }

        if (bidx >= 0) {
            sPos = bidx

            if (sPos < context.numStrips1) {
                assignButtons(page, subPage, activeDevice, dam, context, context.btnsRow1, baseID, pTag, mapping, effectContext, customVar, pValue, sPos, 0, pName)
            } else if (sPos < (2 * context.numStrips1)) {
                assignButtons(page, subPage, activeDevice, dam, context, context.btnsRow2, baseID, pTag, mapping, effectContext, customVar, pValue, sPos, context.numStrips1, pName)
            }
        } else if (f1idx >= 0) {
            sPos = f1idx
            assignFaders(page, subPage, activeDevice, dam, context, context.faders1, baseID, pTag, faders, effectContext, customVar, pValue, sPos, 0, pName)
        } else if (f2idx >= 0) {
            sPos = f2idx + context.numStrips1
            assignFaders(page, subPage, activeDevice, dam, context, context.faders2, baseID, pTag, faders, effectContext, customVar, pValue, sPos, context.numStrips1, pName)
        } else if (k1idx >= 0) {
            sPos = k1idx
            assignKnobs(page, subPage, activeDevice, dam, context, context.knobs1, baseID, pTag, effectContext, customVar, pValue, sPos, 0, pName)
        } else if (k2idx >= 0) {
            sPos = k2idx + context.numStrips1
            assignKnobs(page, subPage, activeDevice, dam, context, context.knobs2, baseID, pTag, effectContext, customVar, pValue, sPos, context.numStrips1, pName)
        } else if (isButton && b < context.numStrips1) {
            sPos = b
            assignButtons(page, subPage, activeDevice, dam, context, context.btnsRow1, baseID, pTag, mapping, effectContext, customVar, pValue, sPos, 0, pName)
            b++
        } else if (isButton && b < (2 * context.numStrips1)) {
            sPos = b
            assignButtons(page, subPage, activeDevice, dam, context, context.btnsRow2, baseID, pTag, mapping, effectContext, customVar, pValue, sPos, context.numStrips1, pName)
            b++
        } else if (k1 < context.numStrips1) {
            sPos = k1
            assignKnobs(page, subPage, activeDevice, dam, context, context.knobs1, baseID, pTag, effectContext, customVar, pValue, sPos, 0, pName)
            k1++
        } else if (k2 < context.numStrips2) {
            sPos = k2 + context.numStrips1
            assignKnobs(page, subPage, activeDevice, dam, context, context.knobs2, baseID, pTag, effectContext, customVar, pValue, sPos, context.numStrips1, pName)
            k2++
        }
    }

    return b
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
 * @param {object} effectContext
 * @param {MR_HostValueUndefined} customVar
 */
function staticInstrumentKnobsButtons(page, subPage, activeDevice, activeMapping, dam, baseID, mapping, context, effectContext, customVar) {
    var b = mapping.buttons != null ? mapping.buttons.length : 0
    var k1 = mapping.knobs1 != null ? mapping.knobs1.length : 0
    var k2 = mapping.knobs2 != null ? mapping.knobs2.length : 0
    var f1 = mapping.faders1 != null ? mapping.faders1.length : 0
    var f2 = mapping.faders2 != null ? mapping.faders2.length : 0

    for (var sPos = 0; sPos < b; sPos++) {
        var pTag = mapping.buttons[sPos]
        var pName = dam.getParameterTitle(activeMapping, baseID, pTag, 20)
        var pDisplayValue = dam.getParameterDisplayValue(activeMapping, baseID, pTag)
        var pValue = dam.getParameterProcessValue(activeMapping, baseID, pTag)
        // var arr = ['pTag:', pTag, 'pName:', pName, 'pDisplayValue:', pDisplayValue, 'pValue', pValue]
        // console.log(arr.join(' '))
        effectContext.values.buttons[sPos] = pValue
        if (sPos < context.numStrips1) {
            assignButtons(page, subPage, activeDevice, dam, context, context.btnsRow1, baseID, pTag, mapping, effectContext, customVar, pValue, sPos, 0, pName)
        } else if (sPos < (2 * context.numStrips1)) {
            assignButtons(page, subPage, activeDevice, dam, context, context.btnsRow2, baseID, pTag, mapping, effectContext, customVar, pValue, sPos + context.numStrips1, context.numStrips1, pName)
        }
    }

    for (var sPos = 0; sPos < k1; sPos++) {
        var pTag = mapping.knobs1[sPos]
        var pName = dam.getParameterTitle(activeMapping, baseID, pTag, 20)
        var pDisplayValue = dam.getParameterDisplayValue(activeMapping, baseID, pTag)
        var pValue = dam.getParameterProcessValue(activeMapping, baseID, pTag)
        // var arr = ['pTag:', pTag, 'pName:', pName, 'pDisplayValue:', pDisplayValue, 'pValue', pValue]
        // console.log(arr.join(' '))
        assignKnobs(page, subPage, activeDevice, dam, context, context.knobs1, baseID, pTag, effectContext, customVar, pValue, sPos, 0, pName)
    }

    for (var sPos = 0; sPos < k2; sPos++) {
        var pTag = mapping.knobs2[sPos]
        var pName = dam.getParameterTitle(activeMapping, baseID, pTag, 20)
        var pDisplayValue = dam.getParameterDisplayValue(activeMapping, baseID, pTag)
        var pValue = dam.getParameterProcessValue(activeMapping, baseID, pTag)
        // var arr = ['pTag:', pTag, 'pName:', pName, 'pDisplayValue:', pDisplayValue, 'pValue', pValue]
        // console.log(arr.join(' '))
        assignKnobs(page, subPage, activeDevice, dam, context, context.knobs2, baseID, pTag, effectContext, customVar, pValue, sPos + context.numStrips1, context.numStrips1, pName)
    }

    for (var sPos = 0; sPos < f1; sPos++) {
        var pTag = mapping.faders1[sPos]
        var pName = dam.getParameterTitle(activeMapping, baseID, pTag, 20)
        var pDisplayValue = dam.getParameterDisplayValue(activeMapping, baseID, pTag)
        var pValue = dam.getParameterProcessValue(activeMapping, baseID, pTag)
        // var arr = ['pTag:', pTag, 'pName:', pName, 'pDisplayValue:', pDisplayValue, 'pValue', pValue]
        // console.log(arr.join(' '))
        assignFaders(page, subPage, activeDevice, dam, context, context.faders1, baseID, pTag, effectContext, customVar, pValue, sPos, 0, pName)
    }

    for (var sPos = 0; sPos < f2; sPos++) {
        var pTag = mapping.faders2[sPos]
        var pName = dam.getParameterTitle(activeMapping, baseID, pTag, 20)
        var pDisplayValue = dam.getParameterDisplayValue(activeMapping, baseID, pTag)
        var pValue = dam.getParameterProcessValue(activeMapping, baseID, pTag)
        // var arr = ['pTag:', pTag, 'pName:', pName, 'pDisplayValue:', pDisplayValue, 'pValue', pValue]
        // console.log(arr.join(' '))
        assignFaders(page, subPage, activeDevice, dam, context, context.faders2, baseID, pTag, effectContext, customVar, pValue, sPos + context.numStrips1, context.numStrips1, pName)
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
 * @param {object} effectContext
 * @param {object} mapping
 * @param {boolean} autoButton
 */
function bindInstrumentKnobsButtons(page, subPage, customVar, stripEffectType, context, activeDevice, activeMapping, effectContext, mapping, autoButton) {
    var pZone = stripEffectType.mParameterBankZone
    var dam = page.mHostAccess.makeDirectAccess(pZone)
    var baseID = dam.getBaseObjectID(activeMapping)
    var b = mapping.buttons != null ? mapping.buttons.length : 0

    for (var i = 0; i < effectContext.values.buttons.length; i++) {
        effectContext.values.buttons[i] = false
        effectContext.names.buttons[i] = ''
    }

    for (var i = 0; i < (context.numStrips1 + context.numStrips2); i++) {
        effectContext.values.knobs[i] = 0
        effectContext.names.knobs[i] = ''
    }

    for (var i = 0; i < (context.numStrips1 + context.numStrips2); i++) {
        effectContext.values.faders[i] = 0
        effectContext.names.faders[i] = ''
    }

    if (mapping.smapping) {
        staticInstrumentKnobsButtons(page, subPage, activeDevice, activeMapping, dam, baseID, mapping, context, effectContext, customVar)
    } else {
        b = dynamicInstrumentKnobsButtons(page, subPage, activeDevice, activeMapping, dam, baseID, mapping, context, effectContext, customVar, autoButton)
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
 * @param {object} context
 * @param {MR_ActiveDevice} activeDevice
 * @param {object} effectContext
 */
function updateEffectsKnobsButtons(context, activeDevice, effectContext) {
    for (var i = 0; i < effectContext.values.buttons.length; i++) {
        if (i < context.numStrips1) {
            context.btnsRow1[i].d.mSurfaceValue.setProcessValue(activeDevice, effectContext.values.buttons[i] == true ? 1 : 0)
            context.midiOutput1.sendMidi(activeDevice, [0x90, context.btnsRow1[i].note, (effectContext.values.buttons[i] == true ? 127 : 0)])
            context.midiOutput3.sendMidi(activeDevice, [0x90, context.btnsRow1[i].note, (effectContext.values.buttons[i] == true ? 127 : 0)])
        } else if (i < 2 * context.numStrips1) {
            context.btnsRow2[i - context.numStrips1].d.mSurfaceValue.setProcessValue(activeDevice, effectContext.values.buttons[i] == true ? 1 : 0)
            context.midiOutput1.sendMidi(activeDevice, [0x90, context.btnsRow2[i - context.numStrips1].note, (effectContext.values.buttons[i] == true ? 127 : 0)])
            context.midiOutput3.sendMidi(activeDevice, [0x90, context.btnsRow2[i - context.numStrips1].note, (effectContext.values.buttons[i] == true ? 127 : 0)])
        }
    }

    for (var i = 0; i < effectContext.values.knobs.length; i++) {
        var result = Math.round(effectContext.values.knobs[i] * 127)
        if (i < context.numStrips1) {
            context.knobs1[i].d.mSurfaceValue.setProcessValue(activeDevice, effectContext.values.knobs[i])
            context.midiOutput1.sendMidi(activeDevice, [0xB0, context.knobs1[i].cc, result])
            context.midiOutput3.sendMidi(activeDevice, [0xB0, context.knobs1[i].cc, result])
        } else if (i < context.numStrips1 + context.numStrips2) {
            context.knobs2[i - context.numStrips1].d.mSurfaceValue.setProcessValue(activeDevice, effectContext.values.knobs[i])
            context.midiOutput2.sendMidi(activeDevice, [0xB0, context.knobs2[i - context.numStrips1].cc, result])
            context.midiOutput4.sendMidi(activeDevice, [0xB0, context.knobs2[i - context.numStrips1].cc, result])
        }
    }

    for (var i = 0; i < effectContext.values.faders.length; i++) {
        var result = Math.round(effectContext.values.faders[i] * 127)
        if (i < context.numStrips1) {
            context.faders1[i].d.mSurfaceValue.setProcessValue(activeDevice, effectContext.values.faders[i])
        } else if (i < context.numStrips1 + context.numStrips2) {
            var result = Math.round(effectContext.values.faders[i] * 127)
            context.faders2[i - context.numStrips1].d.mSurfaceValue.setProcessValue(activeDevice, effectContext.values.faders[i])
            context.midiOutput2.sendMidi(activeDevice, [0xB0, context.faders2[i - context.numStrips1].cc, result])
            context.midiOutput4.sendMidi(activeDevice, [0xB0, context.faders2[i - context.numStrips1].cc, result])
        }
    }

    for (var i = 0; i < effectContext.names.buttons.length; i++) {
        if (i < context.numStrips1) {
            context.btnsRow1[i].t = effectContext.names.buttons[i]
        } else if (i < 2 * context.numStrips1) {
            context.btnsRow2[i - context.numStrips1].t = effectContext.names.buttons[i]
        }
    }
    for (var i = 0; i < effectContext.names.knobs.length; i++) {
        if (i < context.numStrips1) {
            context.knobs1[i].t = effectContext.names.knobs[i]
        } else if (i < context.numStrips1 + context.numStrips2) {
            context.knobs2[i - context.numStrips1].t = effectContext.names.knobs[i]
        }
    }

    for (var i = 0; i < effectContext.names.faders.length; i++) {
        if (i < context.numStrips1) {
            context.faders1[i].t = effectContext.names.faders[i]
        } else if (i < context.numStrips1 + context.numStrips2) {
            context.faders2[i - context.numStrips1].t = effectContext.names.faders[i]
        }
    }
}

function resetLabels1(context) {
    for (var i = 0; i < context.numStrips1; i++) {
        context.knobs1[i].t = ''
        context.faders1[i].t = ''
        context.btnsRow1[i].t = ''
        context.btnsRow2[i].t = ''
        context.btnsRow3[i].t = ''
        context.btnsRow4[i].t = ''
    }
}

function resetLabels2(context) {
    for (var i = 0; i < context.numStrips2; i++) {
        context.knobs2[i].t = ''
        context.faders2[i].t = ''
    }
}

module.exports = {
    makeSubPageTransportAndContols,
    bindInstrumentKnobsButtons,
    updateEffectsKnobsButtons,
    resetLabels1,
    resetLabels2,
    setLabelsTransportAndControls
}
