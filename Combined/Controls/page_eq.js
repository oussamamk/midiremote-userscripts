var page_common = require('./page_common.js')
var makeSubPageTransportAndContols = page_common.makeSubPageTransportAndContols

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
    page.makeValueBinding(context.knobs2[4].d.mSurfaceValue, preFilter.mGain).setSubPage(defaultSubPage)
    page.makeValueBinding(context.btnsRow4[0].d.mSurfaceValue, preFilter.mPhaseSwitch).setTypeToggle().setSubPage(defaultSubPage)
}

/**
 * @param {MR_DeviceDriver} deviceDriver 
 * @param {MR_FactoryMappingPage} page 
 * @param {object} context 
 */
function makePageEQ(deviceDriver, page, context) {
    var subPageArea = page.makeSubPageArea('EQ')
    var defaultSubPage = subPageArea.makeSubPage('default')

    makeSubPageTransportAndContols(page, subPageArea, context)
    var selectedTrackChannel = page.mHostAccess.mTrackSelection.mMixerChannel
    makeSubPageEQBand(deviceDriver, page, defaultSubPage, selectedTrackChannel.mChannelEQ.mBand1, 1, context)
    makeSubPageEQBand(deviceDriver, page, defaultSubPage, selectedTrackChannel.mChannelEQ.mBand2, 2, context)
    makeSubPageEQBand(deviceDriver, page, defaultSubPage, selectedTrackChannel.mChannelEQ.mBand3, 3, context)
    makeSubPageEQBand(deviceDriver, page, defaultSubPage, selectedTrackChannel.mChannelEQ.mBand4, 4, context)
    makeSubPagePrefilter(page, defaultSubPage, selectedTrackChannel.mPreFilter, context)
    page.makeCommandBinding(context.btnsRow1[7].d.mSurfaceValue, 'Process Project Logical Editor', 'Toggle EQ Bypass of Selected Tracks').setSubPage(defaultSubPage)
}

module.exports = {
    makePageEQ
}