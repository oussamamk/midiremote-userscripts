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
    page.makeValueBinding(context.btnContols[3].d.mSurfaceValue, page.mHostAccess.mTransport.mValue.mRewind).setSubPage(subPage)
    page.makeValueBinding(context.btnContols[5].d.mSurfaceValue, page.mHostAccess.mTransport.mValue.mForward).setSubPage(subPage)
    page.makeActionBinding(context.btnContols[4].d.mSurfaceValue, page.mHostAccess.mTrackSelection.mAction.mNextTrack).setSubPage(subPage)
    page.makeActionBinding(context.btnContols[1].d.mSurfaceValue, page.mHostAccess.mTrackSelection.mAction.mPrevTrack).setSubPage(subPage)
    page.makeCommandBinding(context.btnContols[2].d.mSurfaceValue, 'Devices', 'Mixer').setSubPage(subPage)
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
 * @param {MR_HostValueUndefined} customVar
 * @parm {MR_HostObject} stripEffect
 * @param {object} context
 * @param {MR_ActiveDevice} activeDevice
 * @param {MR_ActiveMapping} activeMapping
 * @param {object} buttons
 * @param {object} knobs
 * @param {object} mapping
 */
function bindEffectKnobsButtons(page, subPage, customVar, stripEffectType, context, activeDevice, activeMapping, buttons, knobs, mapping) {
    buttons.length = 0
    knobs.length = 0
    var pZone = stripEffectType.mParameterBankZone
    var dam = page.mHostAccess.makeDirectAccess(pZone)
    var baseID = dam.getBaseObjectID(activeMapping);
    var numParams = dam.getNumberOfParameters(activeMapping, baseID)
    var b = mapping.buttons.length
    var k = mapping.knobs.length

    for (var i = 0; i < b; i++) {
        buttons.push(false);
    }

    for (var i = 0; i < k; i++) {
        knobs.push(0);
    }

    var arr = ['baseID:', baseID, 'numParams:', numParams]
    console.log(arr.join(' '))
    for (var i = 0; i < numParams; i++) {
        var pTag = dam.getParameterTagByIndex(activeMapping, baseID, i)
        var pName = dam.getParameterTitle(activeMapping, baseID, pTag, 20)
        var skip = false
        for (var j = 0; j < mapping.ignore.length; j++) {
            if (pName.indexOf(mapping.ignore[j]) != -1) {
                skip = true
                break
            }
        }

        if (skip) {
            continue
        }

        var pDisplayValue = dam.getParameterDisplayValue(activeMapping, baseID, pTag)
        var pValue = dam.getParameterProcessValue(activeMapping, baseID, pTag)
        // arr = ['pTag:', pTag, 'pName:', pName, 'pDisplayValue:', pDisplayValue, 'pValue', pValue]
        // console.log(arr.join(' '))
        var sPos = 0
        var isButton = true

        // some knobs we want to force to on/off ->button
        var idx = mapping.buttons.indexOf(pName)
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
                page.makeValueBinding(context.btnsRow1[sPos].d.mSurfaceValue, customVar).setTypeToggle().setSubPage(subPage).mOnValueChange = function (activeDevice, activeMapping, value, arg3) {
                    dam.setParameterProcessValue(activeMapping, baseID, this.pTag, value)
                    buttons[this.sPos] = value
                }.bind({ pTag, sPos })
                context.btnsRow1[sPos].d.mSurfaceValue.setProcessValue(activeDevice, pValue)
                context.midiOutput1.sendMidi(activeDevice, [0x90, context.btnsRow1[sPos].note, pValue])
            } else if (sPos < (2 * context.numStrips1)) {
                page.makeValueBinding(context.btnsRow2[sPos - context.numStrips1].d.mSurfaceValue, customVar).setTypeToggle().setSubPage(subPage).mOnValueChange = function (activeDevice, activeMapping, value, arg3) {
                    dam.setParameterProcessValue(activeMapping, baseID, this.pTag, value)
                    buttons[this.sPos] = value
                }.bind({ pTag, sPos })
                context.btnsRow2[sPos - context.numStrips1].d.mSurfaceValue.setProcessValue(activeDevice, pValue)
                context.midiOutput1.sendMidi(activeDevice, [0x90, context.btnsRow2[sPos- context.numStrips1].note, pValue])
            }
        } else {
            idx = mapping.knobs.indexOf(pName)
            if (idx >= 0) {
                knobs[idx] = pValue
                sPos = idx
            } else {
                knobs.push(pValue)
                sPos = k
                k++
            }

            if (sPos < context.numStrips1) {
                page.makeValueBinding(context.knobs1[sPos].d.mSurfaceValue, customVar).setValueTakeOverModePickup().setSubPage(subPage).mOnValueChange = function (activeDevice, activeMapping, value, arg3) {
                    dam.setParameterProcessValue(activeMapping, baseID, this.pTag, value)
                    knobs[this.sPos] = value
                }.bind({ pTag, sPos })
                context.knobs1[sPos].d.mSurfaceValue.setProcessValue(activeDevice, pValue)
            } else if (sPos < (context.numStrips1 + context.numStrips2)) {
                page.makeValueBinding(context.knobs2[sPos - context.numStrips1].d.mSurfaceValue, customVar).setValueTakeOverModePickup().setSubPage(subPage).mOnValueChange = function (activeDevice, activeMapping, value, arg3) {
                    dam.setParameterProcessValue(activeMapping, baseID, this.pTag, value)
                    knobs[this.sPos] = value
                }.bind({ pTag, sPos })
                context.knobs2[sPos - context.numStrips1].d.mSurfaceValue.setProcessValue(activeDevice, pValue)
            }
        }
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

module.exports = {
    makeSubPageTransportAndContols,
    bindEffectKnobsButtons
}