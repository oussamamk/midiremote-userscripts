/**
 * @param {MR_FactoryMappingPage} page 
 * @param {MR_SubPageArea} subPageArea
 * @param {object} context 
 * @return {MR_SubPage}
 */
function makeSubPageTransportAndContols(page, subPageArea, context) {
    var subPage = subPageArea.makeSubPage('transport')
    page.makeValueBinding(context.btnForward.d.mSurfaceValue, page.mHostAccess.mTransport.mValue.mForward).setSubPage(subPage)
    page.makeValueBinding(context.btnRewind.d.mSurfaceValue, page.mHostAccess.mTransport.mValue.mRewind).setSubPage(subPage)
    page.makeValueBinding(context.btnStart.d.mSurfaceValue, page.mHostAccess.mTransport.mValue.mStart).setTypeToggle().setSubPage(subPage)
    page.makeValueBinding(context.btnStop.d.mSurfaceValue, page.mHostAccess.mTransport.mValue.mStop).setTypeToggle().setSubPage(subPage)
    page.makeValueBinding(context.btnRecord.d.mSurfaceValue, page.mHostAccess.mTransport.mValue.mRecord).setTypeToggle().setSubPage(subPage)
    page.makeCommandBinding(context.btnRight.d.mSurfaceValue, 'Transport', '').setSubPage(subPage)
    page.makeCommandBinding(context.btnLeft.d.mSurfaceValue, 'Transport', '').setSubPage(subPage)
    page.makeActionBinding(context.btnDown.d.mSurfaceValue, page.mHostAccess.mTrackSelection.mAction.mNextTrack).setSubPage(subPage)
    page.makeActionBinding(context.btnUp.d.mSurfaceValue, page.mHostAccess.mTrackSelection.mAction.mPrevTrack).setSubPage(subPage)
    page.makeValueBinding(context.btnControls[3].d.mSurfaceValue, page.mHostAccess.mTransport.mValue.mRewind).setSubPage(subPage)
    page.makeValueBinding(context.btnControls[5].d.mSurfaceValue, page.mHostAccess.mTransport.mValue.mForward).setSubPage(subPage)
    page.makeActionBinding(context.btnControls[4].d.mSurfaceValue, page.mHostAccess.mTrackSelection.mAction.mNextTrack).setSubPage(subPage)
    page.makeActionBinding(context.btnControls[1].d.mSurfaceValue, page.mHostAccess.mTrackSelection.mAction.mPrevTrack).setSubPage(subPage)
    page.makeCommandBinding(context.btnControls[2].d.mSurfaceValue, 'Devices', 'Mixer').setSubPage(subPage)
    page.makeValueBinding(context.btnsL1U[0].d.mSurfaceValue, page.mHostAccess.mTransport.mValue.mMetronomeActive).setTypeToggle().setSubPage(subPage)
    page.makeValueBinding(context.btnsL1U[1].d.mSurfaceValue, page.mHostAccess.mTransport.mValue.mCycleActive).setTypeToggle().setSubPage(subPage)
    page.makeValueBinding(context.btnsL1U[2].d.mSurfaceValue, page.mHostAccess.mTrackSelection.mMixerChannel.mValue.mAutomationRead).setTypeToggle().setSubPage(subPage)
    page.makeValueBinding(context.btnsL1U[3].d.mSurfaceValue, page.mHostAccess.mTrackSelection.mMixerChannel.mValue.mAutomationWrite).setTypeToggle().setSubPage(subPage)
    page.makeValueBinding(context.btnsL1U[4].d.mSurfaceValue, page.mHostAccess.mTrackSelection.mMixerChannel.mValue.mMonitorEnable).setTypeToggle().setSubPage(subPage)
    page.makeValueBinding(context.btnsL1U[5].d.mSurfaceValue, page.mHostAccess.mTrackSelection.mMixerChannel.mValue.mEditorOpen).setTypeToggle().setSubPage(subPage)
    page.makeCommandBinding(context.btnsL1L[0].d.mSurfaceValue, 'Edit', 'Undo').setSubPage(subPage)
    page.makeCommandBinding(context.btnsL1L[1].d.mSurfaceValue, 'Edit', 'Redo').setSubPage(subPage)
    page.makeCommandBinding(context.btnsL1L[2].d.mSurfaceValue, 'Edit', 'Unmute All').setSubPage(subPage)
    page.makeCommandBinding(context.btnsL1L[3].d.mSurfaceValue, 'Edit', 'Deactivate All Solo').setSubPage(subPage)
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
 * @param {object} buttons
 * @param {MR_HostValueUndefined} customVar
 * @param {*} pValue
 * @param {number} sPos
 * @param {number} offset
 */
function assignButtons(page, subPage, activeDevice, dam, context, sObjects, baseID, pTag, mapping, buttons, customVar, pValue, sPos, offset) {
    var bb = page.makeValueBinding(sObjects[sPos - offset].d.mSurfaceValue, customVar)
    if (mapping.tbuttons == null || mapping.tbuttons.indexOf(pTag) < 0) {
        bb.setTypeToggle()
    }
    bb.setSubPage(subPage)
    bb.mOnValueChange = function (activeDevice, activeMapping, value, arg3) {
        dam.setParameterProcessValue(activeMapping, baseID, this.pTag, value)
        buttons[this.sPos - this.offset] = value > 0 ? true : false
    }.bind({ pTag, sPos, offset})
    sObjects[sPos - offset].d.mSurfaceValue.setProcessValue(activeDevice, pValue > 0 ? 1 : 0)
    context.midiOutput1.sendMidi(activeDevice, [0x90, sObjects[sPos - offset].note, pValue > 0 ? 127 : 0])
}

/**
 * @param {MR_FactoryMappingPage} page 
 * @param {MR_SubPage} subPage
 * @param {MR_ActiveDevice} activeDevice
 * @param {MR_HostObjectDirectAccess} dam
 * @param {object} sObjects
 * @param {number} baseID 
 * @param {number} pTag 
 * @param {object} faders
 * @param {MR_HostValueUndefined} customVar
 * @param {*} pValue
 * @param {number} sPos
 * @param {number} offset
 */
function assignFaders(page, subPage, activeDevice, dam, sObjects, baseID, pTag, faders, customVar, pValue, sPos, offset)  {
    page.makeValueBinding(sObjects[sPos - offset].d.mSurfaceValue, customVar).setValueTakeOverModePickup().setSubPage(subPage).mOnValueChange = function (activeDevice, activeMapping, value, arg3) {
        dam.setParameterProcessValue(activeMapping, baseID, this.pTag, value)
        faders[this.sPos - this.offset] = value
    }.bind({ pTag, sPos, offset })
    sObjects[sPos - offset].d.mSurfaceValue.setProcessValue(activeDevice, pValue)
}

/**
 * @param {MR_FactoryMappingPage} page 
 * @param {MR_SubPage} subPage
 * @param {MR_ActiveDevice} activeDevice
 * @param {MR_HostObjectDirectAccess} dam
 * @param {object} sObjects
 * @param {number} baseID 
 * @param {number} pTag 
 * @param {object} knobs
 * @param {MR_HostValueUndefined} customVar
 * @param {*} pValue
 * @param {number} sPos
 * @param {number} offset
 */
function assignKnobs(page, subPage, activeDevice, dam, sObjects, baseID, pTag, knobs, customVar, pValue, sPos, offset) {
    page.makeValueBinding(sObjects[sPos - offset].d.mSurfaceValue, customVar).setValueTakeOverModePickup().setSubPage(subPage).mOnValueChange = function (activeDevice, activeMapping, value, arg3) {
        dam.setParameterProcessValue(activeMapping, baseID, this.pTag, value)
        knobs[this.sPos - this.offset] = value
    }.bind({ pTag, sPos, offset})
    sObjects[sPos - offset].d.mSurfaceValue.setProcessValue(activeDevice, pValue)
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
 * @param {boolean} autoButton
 */
function dynamicInstrumentKnobsButtons(page, subPage, activeDevice, activeMapping, dam, baseID, mapping, context, buttons, knobs, faders, customVar, autoButton) {
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
            buttons[bidx] = pValue > 0 ? true  : false
            sPos = bidx

            if (sPos < context.numStrips1) {
                assignButtons(page, subPage, activeDevice, dam, context, context.btnsRow1, baseID, pTag, mapping, buttons, customVar, pValue, sPos, 0)
            } else if (sPos < (2 * context.numStrips1)) {
                assignButtons(page, subPage, activeDevice, dam, context, context.btnsRow2, baseID, pTag, mapping, buttons, customVar, pValue, sPos - context.numStrips1, context.numStrips1)
            }
        } else if (f1idx >= 0) {
            faders[f1idx] = pValue
            sPos = f1idx
            assignFaders(page, subPage, activeDevice, dam, context.faders1, baseID, pTag, faders, customVar, pValue, sPos, 0)
        } else if (f2idx >= 0) {
            faders[f2idx + context.numStrips1] = pValue
            sPos = f2idx + context.numStrips1
            assignFaders(page, subPage, activeDevice, dam, context.faders2, baseID, pTag, faders, customVar, pValue, sPos, context.numStrips1)
        } else if (k1idx >= 0) {
            knobs[k1idx] = pValue
            sPos = k1idx
            assignKnobs(page, subPage, activeDevice, dam, context.knobs1, baseID, pTag, knobs, customVar, pValue, sPos, 0)
        } else if (k2idx >= 0) {
            knobs[k2idx + context.numStrips1] = pValue
            sPos = k2idx + context.numStrips1
            assignKnobs(page, subPage, activeDevice, dam, context.knobs2, baseID, pTag, knobs, customVar, pValue, sPos, context.numStrips1)
        } else if (isButton && b < context.numStrips1) {
            buttons[b] = pValue > 0 ? true  : false
            sPos = b
            assignButtons(page, subPage, activeDevice, dam, context, context.btnsRow1, baseID, pTag, mapping, buttons, customVar, pValue, sPos, 0)
            b++
        } else if (isButton && b < (2 * context.numStrips1)) {
            buttons[b] = pValue > 0 ? true  : false
            sPos = b
            assignButtons(page, subPage, activeDevice, dam, context, context.btnsRow2, baseID, pTag, mapping, buttons, customVar, pValue, sPos, context.numStrips1)
            b++
        } else if (k1 < context.numStrips1) {
            sPos = k1
            assignKnobs(page, subPage, activeDevice, dam, context.knobs1, baseID, pTag, knobs, customVar, pValue, sPos, 0)
            k1++
        } else if (k2 < context.numStrips2) {
            sPos = k2 + context.numStrips1
            assignKnobs(page, subPage, activeDevice, dam, context.knobs2, baseID, pTag, knobs, customVar, pValue, sPos, context.numStrips1)
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
 * @param {object} buttons
 * @param {object} knobs
 * @param {object} faders
 * @param {MR_HostValueUndefined} customVar
 */
function staticInstrumentKnobsButtons(page, subPage, activeDevice, activeMapping, dam, baseID, mapping, context, buttons, knobs, faders, customVar) {
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
        buttons[sPos] = pValue
        if (sPos < context.numStrips1) {
            assignButtons(page, subPage, activeDevice, dam, context, context.btnsRow1, baseID, pTag, mapping, buttons, customVar, pValue, sPos, 0)
        } else if (sPos < (2 * context.numStrips1)) {
            assignButtons(page, subPage, activeDevice, dam, context, context.btnsRow2, baseID, pTag, mapping, buttons, customVar, pValue, sPos + context.numStrips1, context.numStrips1)
        }
    }

    for (var sPos = 0; sPos < k1; sPos++) {
        var pTag = mapping.knobs1[sPos]
        var pName = dam.getParameterTitle(activeMapping, baseID, pTag, 20)
        var pDisplayValue = dam.getParameterDisplayValue(activeMapping, baseID, pTag)
        var pValue = dam.getParameterProcessValue(activeMapping, baseID, pTag)
        // var arr = ['pTag:', pTag, 'pName:', pName, 'pDisplayValue:', pDisplayValue, 'pValue', pValue]
        // console.log(arr.join(' '))
        knobs[sPos] = pValue
        assignKnobs(page, subPage, activeDevice, dam, context.knobs1, baseID, pTag, knobs, customVar, pValue, sPos, 0)
    }

    for (var sPos = 0; sPos < k2; sPos++) {
        var pTag = mapping.knobs2[sPos]
        var pName = dam.getParameterTitle(activeMapping, baseID, pTag, 20)
        var pDisplayValue = dam.getParameterDisplayValue(activeMapping, baseID, pTag)
        var pValue = dam.getParameterProcessValue(activeMapping, baseID, pTag)
        // var arr = ['pTag:', pTag, 'pName:', pName, 'pDisplayValue:', pDisplayValue, 'pValue', pValue]
        // console.log(arr.join(' '))
        knobs[sPos + context.numStrips1] = pValue
        assignKnobs(page, subPage, activeDevice, dam, context.knobs2, baseID, pTag, knobs, customVar, pValue, sPos + context.numStrips1, context.numStrips1)
    }

    for (var sPos = 0; sPos < f1; sPos++) {
        var pTag = mapping.faders1[sPos]
        var pName = dam.getParameterTitle(activeMapping, baseID, pTag, 20)
        var pDisplayValue = dam.getParameterDisplayValue(activeMapping, baseID, pTag)
        var pValue = dam.getParameterProcessValue(activeMapping, baseID, pTag)
        // var arr = ['pTag:', pTag, 'pName:', pName, 'pDisplayValue:', pDisplayValue, 'pValue', pValue]
        // console.log(arr.join(' '))
        faders[sPos] = pValue
        assignFaders(page, subPage, activeDevice, dam, context.faders1, baseID, pTag, faders, customVar, pValue, sPos, 0)
    }

    for (var sPos = 0; sPos < f2; sPos++) {
        var pTag = mapping.faders2[sPos]
        var pName = dam.getParameterTitle(activeMapping, baseID, pTag, 20)
        var pDisplayValue = dam.getParameterDisplayValue(activeMapping, baseID, pTag)
        var pValue = dam.getParameterProcessValue(activeMapping, baseID, pTag)
        // var arr = ['pTag:', pTag, 'pName:', pName, 'pDisplayValue:', pDisplayValue, 'pValue', pValue]
        // console.log(arr.join(' '))
        faders[sPos + context.numStrips1] = pValue
        assignFaders(page, subPage, activeDevice, dam, context.faders2, baseID, pTag, faders, customVar, pValue, sPos + context.numStrips1, context.numStrips1)
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
 * @param {boolean} autoButton
 */
function bindInstrumentKnobsButtons(page, subPage, customVar, stripEffectType, context, activeDevice, activeMapping, buttons, knobs, faders, mapping, autoButton) {
    buttons.length = 0
    knobs.length = 0
    var pZone = stripEffectType.mParameterBankZone
    var dam = page.mHostAccess.makeDirectAccess(pZone)
    var baseID = dam.getBaseObjectID(activeMapping)
    var b = mapping.buttons != null ? mapping.buttons.length : 0

    for (var i = 0; i < (2 * context.numStrips1); i++) {
        buttons[i] = false
    }

    for (var i = 0; i < (context.numStrips1 + context.numStrips2); i++) {
        knobs[i] = 0
    }

    for (var i = 0; i < (context.numStrips1 + context.numStrips2); i++) {
        faders[i] = 0
    }

    if (mapping.smapping) {
        staticInstrumentKnobsButtons(page, subPage, activeDevice, activeMapping, dam, baseID, mapping, context, buttons, knobs, faders, customVar)
    } else {
        b = dynamicInstrumentKnobsButtons(page, subPage, activeDevice, activeMapping, dam, baseID, mapping, context, buttons, knobs, faders, customVar, autoButton)
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
 * @param {object} buttons
 * @param {object} knobs
 */
function updateEffectsKnobsButtons(context, activeDevice, buttons, knobs) {
    for (var i = 0; i < buttons.length; i++) {
        if (i < context.numStrips1) {
            context.btnsRow1[i].d.mSurfaceValue.setProcessValue(activeDevice, buttons[i] == true ? 1 : 0)
            context.midiOutput1.sendMidi(activeDevice, [0x90, context.btnsRow1[i].note, (buttons[i] == true ? 127 :  0)])
        } else if (i < 2 * context.numStrips1) {
            context.btnsRow2[i - context.numStrips1].d.mSurfaceValue.setProcessValue(activeDevice, buttons[i] == true ? 1 : 0)
            context.midiOutput1.sendMidi(activeDevice, [0x90, context.btnsRow2[i - context.numStrips1].note, (buttons[i] == true ? 127 : 0)])
        }
    }

    for (var i = 0; i < knobs.length; i++) {
        if (i < context.numStrips1) {
            context.knobs1[i].d.mSurfaceValue.setProcessValue(activeDevice, knobs[i])
        } else if (i < context.numStrips1 + context.numStrips2) {
            context.knobs2[i - context.numStrips1].d.mSurfaceValue.setProcessValue(activeDevice, knobs[i])
        }
    }
}

module.exports = {
    makeSubPageTransportAndContols,
    bindInstrumentKnobsButtons,
    updateEffectsKnobsButtons
}
