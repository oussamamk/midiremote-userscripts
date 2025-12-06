var page_common = require('./page_common.js')
var makeSubPageTransportAndContols = page_common.makeSubPageTransportAndContols
var resetLabels1  = page_common.resetLabels1
var resetLabels2  = page_common.resetLabels2

var helper = require("./helper.js")
var sendLableApp1 = helper.sendLableApp1
var sendLableApp2 = helper.sendLableApp2

/**
 * @param {object} context 
 */
function setPageEQLabels(context) {
    resetLabels1(context)
    resetLabels2(context)

    context.knobs1[0].t = 'Band1 Freq'
    context.knobs1[1].t = 'Band1 Q'
    context.knobs1[2].t = 'Band2 Freq'
    context.knobs1[3].t = 'Band2 Q'
    context.knobs1[4].t = 'Band3 Freq'
    context.knobs1[5].t = 'Band3 Q'
    context.knobs1[6].t = 'Band4 Freq'
    context.knobs1[7].t = 'Band4 Q'
    context.faders1[0].t = 'Band1 Gain'
    context.faders1[1].t = 'Band2 Gain'
    context.faders1[2].t = 'Band3 Gain'
    context.faders1[3].t = 'Band4 Gain'
    context.btnsRow1[1].t = 'Band1 On/Off'
    context.btnsRow2[1].t = 'Band1 Type+'
    context.btnsRow3[1].t = 'Band1 Type-'
    context.btnsRow1[2].t = 'Band2 On/Off'
    context.btnsRow2[2].t = 'Band2 Type+'
    context.btnsRow3[2].t = 'Band2 Type-'
    context.btnsRow1[3].t = 'Band3 On/Off'
    context.btnsRow2[3].t = 'Band3 Type+'
    context.btnsRow3[3].t = 'Band3 Type-'
    context.btnsRow1[4].t = 'Band4 On/Off'
    context.btnsRow2[4].t = 'Band4 Type+'
    context.btnsRow3[4].t = 'Band4 Type-'
    
    context.faders1[0].t = 'PreFilter Gain'
    context.btnsRow1[0].t = 'PreFilter Bypass'
    context.btnsRow2[0].t = 'HighCut On/Off'
    context.btnsRow3[0].t = 'LowCut On/Off'
    context.btnsRow4[0].t = 'Phase 0/180'

    context.knobs2[0].t = 'HighCut Freq'
    context.knobs2[1].t = 'HighCut Slope'
    context.knobs2[2].t = 'LowCut Freq'
    context.knobs2[3].t = 'LowCut Slope'

    context.btnsRow1[7].t = 'Toggle Bypass EQ'
}

/**
 * @param {MR_DeviceDriver} deviceDriver 
 * @param {MR_FactoryMappingPage} page
 * @param {MR_SubPage} defaultSubPage
 * @param {MR_ChannelEQBand} band
 * @param {number} idx
 * @param {object} context  
 */
function makeSubPageEQBand(deviceDriver, page, defaultSubPage, band, idx, context) {
    page.makeValueBinding(context.btnsRow1[idx].d.mSurfaceValue, band.mOn).setTypeToggle().setSubPage(defaultSubPage)
    var auxVar = page.mCustom.makeHostValueVariable('auxVar');
    context.btnsRow2[idx].auxVar = page.mCustom.makeHostValueVariable('auxVar2' + idx);
    context.btnsRow3[idx].auxVar = page.mCustom.makeHostValueVariable('auxVar3' + idx);

    context.btnsRow4[idx].customVariable = deviceDriver.mSurface.makeCustomValueVariable('inc' + idx.toString())
    context.btnsRow4[idx].customValue = 0;
    context.btnsRow4[idx].customValueMax = 1;
    context.btnsRow4[idx].customMapping = page.makeValueBinding(context.btnsRow4[idx].customVariable, band.mFilterType).setSubPage(defaultSubPage)
    context.btnsRow4[idx].customMapping.setSubPage(defaultSubPage)
    band.mFilterType.mOnDisplayValueChange = function (activeDevice, activeMapping, arg2, arg4) {
        if (idx === 1) {
            context.btnsRow4[idx].customValueMax = 7;
            switch (arg2) {
                case 'Parametric I':
                    context.btnsRow4[idx].customValue = 0
                    break

                case 'Low Shelf I':
                    context.btnsRow4[idx].customValue = 1
                    break

                case 'High Pass I':
                    context.btnsRow4[idx].customValue = 2
                    break

                case 'High Pass II':
                    context.btnsRow4[idx].customValue = 3
                    break

                case 'Parametric II':
                    context.btnsRow4[idx].customValue = 4
                    break

                case 'Low Shelf II':
                    context.btnsRow4[idx].customValue = 5
                    break

                case 'Low Shelf III':
                    context.btnsRow4[idx].customValue = 6
                    break


                case 'Low Shelf IV':
                    context.btnsRow4[idx].customValue = 7
                    break
                default:
                    if (arg2 === null || arg2 === '') {
                        break
                    }

                    console.log('Unkown filter ' + idx + ' type: ' + arg2 + ' ,' + arg4);
                    console.assert()
                    context.btnsRow4[idx].customValue = 0
                    break
            }
        } else if (idx === 2) {
            switch (arg2) {
                case 'Parametric I':
                    context.btnsRow4[idx].customValue = 0
                    break

                case 'Parametric II':
                    context.btnsRow4[idx].customValue = 1
                    break

                default:
                    if (arg2 === null || arg2 === '') {
                        break
                    }

                    console.log('Unkown filter ' + idx + ' type: ' + arg2 + ' ,' + arg4);
                    console.assert()
                    context.btnsRow4[idx].customValue = 0
                    break
            }
        } else if (idx === 3) {
            switch (arg2) {
                case 'Parametric I':
                    context.btnsRow4[idx].customValue = 0
                    break

                case 'Parametric II':
                    context.btnsRow4[idx].customValue = 1
                    break

                default:
                    if (arg2 === null || arg2 === '') {
                        break
                    }

                    console.log('Unkown filter ' + idx + ' type: ' + arg2 + ' ,' + arg4);
                    console.assert()
                    context.btnsRow4[idx].customValue = 0
                    break
            }
        } else if (idx === 4) {
            context.btnsRow4[idx].customValueMax = 7;
            switch (arg2) {
                case 'Parametric I':
                    context.btnsRow4[idx].customValue = 0
                    break

                case 'High Shelf I':
                    context.btnsRow4[idx].customValue = 1
                    break

                case 'Low Pass I':
                    context.btnsRow4[idx].customValue = 2
                    break

                case 'Low Pass II':
                    context.btnsRow4[idx].customValue = 3
                    break

                case 'Parametric II':
                    context.btnsRow4[idx].customValue = 4
                    break

                case 'High Shelf II':
                    context.btnsRow4[idx].customValue = 5
                    break

                case 'High Shelf III':
                    context.btnsRow4[idx].customValue = 6
                    break

                case 'High Shelf IV':
                    context.btnsRow4[idx].customValue = 7
                    break

                default:
                    if (arg2 === null || arg2 === '') {
                        break
                    }

                    console.log('Unkown filter ' + idx + ' type: ' + arg2 + ' ,' + arg4);
                    console.assert()
                    context.btnsRow4[idx].customValue = 0
                    break
            }
        }
    }

    page.makeValueBinding(context.btnsRow2[idx].d.mSurfaceValue, auxVar).setSubPage(defaultSubPage).mOnValueChange = function (activeDevice, activeMapping, value, diff) {
        if (value === 0 && context.btnsRow4[idx].customValue < context.btnsRow4[idx].customValueMax) {
            context.btnsRow4[idx].customValue += 1
            context.btnsRow4[idx].customVariable.setProcessValue(activeDevice, context.btnsRow4[idx].customValue / context.btnsRow4[idx].customValueMax)
        }
    }

    page.makeValueBinding(context.btnsRow3[idx].d.mSurfaceValue, auxVar).setSubPage(defaultSubPage).mOnValueChange = function (activeDevice, activeMapping, value, diff) {
        if (value === 0 && context.btnsRow4[idx].customValue > 0) {
            context.btnsRow4[idx].customValue -= 1
            context.btnsRow4[idx].customVariable.setProcessValue(activeDevice, context.btnsRow4[idx].customValue / context.btnsRow4[idx].customValueMax)
        }
    }

    page.makeValueBinding(context.faders1[idx].d.mSurfaceValue, band.mGain).setSubPage(defaultSubPage)
    page.makeValueBinding(context.knobs1[(idx - 1) * 2].d.mSurfaceValue, band.mFreq).setSubPage(defaultSubPage)
    page.makeValueBinding(context.knobs1[(idx - 1) * 2 + 1].d.mSurfaceValue, band.mQ).setSubPage(defaultSubPage)
}

/**
 * @param {MR_FactoryMappingPage} page 
 * @param {MR_SubPage} defaultSubPage
 * @param {MR_PreFilter} preFilter 
 * @param {object} context 
 */
function makeSubPagePrefilter(page, defaultSubPage, preFilter, context) {
    page.makeValueBinding(context.btnsRow1[0].d.mSurfaceValue, preFilter.mBypass).setTypeToggle().setSubPage(defaultSubPage)
    page.makeValueBinding(context.btnsRow2[0].d.mSurfaceValue, preFilter.mHighCutOn).setTypeToggle().setSubPage(defaultSubPage)
    page.makeValueBinding(context.knobs2[0].d.mSurfaceValue, preFilter.mHighCutFreq).setSubPage(defaultSubPage)
    page.makeValueBinding(context.knobs2[1].d.mSurfaceValue, preFilter.mHighCutSlope).setSubPage(defaultSubPage)
    page.makeValueBinding(context.btnsRow3[0].d.mSurfaceValue, preFilter.mLowCutOn).setTypeToggle().setSubPage(defaultSubPage)
    page.makeValueBinding(context.knobs2[2].d.mSurfaceValue, preFilter.mLowCutFreq).setSubPage(defaultSubPage)
    page.makeValueBinding(context.knobs2[3].d.mSurfaceValue, preFilter.mLowCutSlope).setSubPage(defaultSubPage)
    page.makeValueBinding(context.faders1[0].d.mSurfaceValue, preFilter.mGain).setSubPage(defaultSubPage)
    page.makeValueBinding(context.btnsRow4[0].d.mSurfaceValue, preFilter.mPhaseSwitch).setTypeToggle().setSubPage(defaultSubPage)
}

/**
 * @param {MR_DeviceDriver} deviceDriver 
 * @param {object} context 
 */
function makePageEQ(deviceDriver, context) {
    var page = deviceDriver.mMapping.makePage('EQ')
    var subPageArea = page.makeSubPageArea('EQ')
    var defaultSubPage = makeSubPageTransportAndContols(page, subPageArea, context)
    
    var selectedTrackChannel = page.mHostAccess.mTrackSelection.mMixerChannel
    makeSubPageEQBand(deviceDriver, page, defaultSubPage, selectedTrackChannel.mChannelEQ.mBand1, 1, context)
    makeSubPageEQBand(deviceDriver, page, defaultSubPage, selectedTrackChannel.mChannelEQ.mBand2, 2, context)
    makeSubPageEQBand(deviceDriver, page, defaultSubPage, selectedTrackChannel.mChannelEQ.mBand3, 3, context)
    makeSubPageEQBand(deviceDriver, page, defaultSubPage, selectedTrackChannel.mChannelEQ.mBand4, 4, context)
    makeSubPagePrefilter(page, defaultSubPage, selectedTrackChannel.mPreFilter, context)
    page.makeCommandBinding(context.btnsRow1[7].d.mSurfaceValue, 'Process Project Logical Editor', 'Toggle EQ Bypass of Selected Tracks').setSubPage(defaultSubPage)

    defaultSubPage.mOnActivate = function (activeDevice) {
        setPageEQLabels(context)
        sendLableApp1(activeDevice, context)
        sendLableApp2(activeDevice, context)
        context.midiOutput2.sendMidi(activeDevice, [0x90, context.btnsL1L[4].note, 127])
        context.midiOutput4.sendMidi(activeDevice, [0x90, context.btnsL1L[4].note, 127])
    }


    defaultSubPage.mOnDeactivate = function (activeDevice) {
        context.midiOutput2.sendMidi(activeDevice, [0x90, context.btnsL1L[4].note, 0])
        context.midiOutput4.sendMidi(activeDevice, [0x90, context.btnsL1L[4].note, 0])
    }

    return page
}

module.exports = {
    makePageEQ
}