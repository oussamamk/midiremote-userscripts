var isShifted = false

/**
 * 
 * @param {MR_DeviceDriver} deviceDriver 
 * @param {MR_FactoryMappingPage} page 
 * @param {object} surfaceElements 
 * @returns 
 */
function makePageWithDefaults(deviceDriver, page, surfaceElements) {
  var transportSubPageArea = page.makeSubPageArea('Transport')
  var transportDefaultSubPage = transportSubPageArea.makeSubPage('default')
  var transportShiftedSubPage = transportSubPageArea.makeSubPage('shifted')

  page.makeActionBinding(surfaceElements.btnPageUp.mSurfaceValue, deviceDriver.mAction.mPrevPage)
  page.makeActionBinding(surfaceElements.btnPageDown.mSurfaceValue, deviceDriver.mAction.mNextPage)

  page.makeValueBinding(surfaceElements.btnForward.mSurfaceValue, page.mHostAccess.mTransport.mValue.mForward).setSubPage(transportDefaultSubPage)
  page.makeValueBinding(surfaceElements.btnRewind.mSurfaceValue, page.mHostAccess.mTransport.mValue.mRewind).setSubPage(transportDefaultSubPage)
  page.makeValueBinding(surfaceElements.btnStart.mSurfaceValue, page.mHostAccess.mTransport.mValue.mStart).setTypeToggle()
  page.makeValueBinding(surfaceElements.btnStop.mSurfaceValue, page.mHostAccess.mTransport.mValue.mStop).setTypeToggle()
  page.makeValueBinding(surfaceElements.btnRecord.mSurfaceValue, page.mHostAccess.mTransport.mValue.mRecord).setTypeToggle()
  page.makeValueBinding(surfaceElements.btnCycle.mSurfaceValue, page.mHostAccess.mTransport.mValue.mCycleActive).setTypeToggle()

  page.makeCommandBinding(surfaceElements.wheelLeftVariable, 'Transport', 'Nudge Cursor Left').setSubPage(transportDefaultSubPage)
  page.makeCommandBinding(surfaceElements.wheelRightVariable, 'Transport', 'Nudge Cursor Right').setSubPage(transportDefaultSubPage)

  page.makeCommandBinding(surfaceElements.btnForward.mSurfaceValue, 'Transport', 'Locate Next Event').setSubPage(transportShiftedSubPage)
  page.makeCommandBinding(surfaceElements.btnRewind.mSurfaceValue, 'Transport', 'Locate Previous Event').setSubPage(transportShiftedSubPage)
  page.makeCommandBinding(surfaceElements.wheelLeftVariable, 'Transport', 'Nudge -1 Frame').setSubPage(transportShiftedSubPage)
  page.makeCommandBinding(surfaceElements.wheelRightVariable, 'Transport', 'Nudge +1 Frame').setSubPage(transportShiftedSubPage)

  page.makeCommandBinding(surfaceElements.btnRight.mSurfaceValue, 'Transport', '').setSubPage(transportDefaultSubPage)
  page.makeCommandBinding(surfaceElements.btnLeft.mSurfaceValue, 'Transport', '').setSubPage(transportDefaultSubPage)
  page.makeActionBinding(surfaceElements.btnDown.mSurfaceValue, page.mHostAccess.mTrackSelection.mAction.mNextTrack).setSubPage(transportDefaultSubPage)
  page.makeActionBinding(surfaceElements.btnUp.mSurfaceValue, page.mHostAccess.mTrackSelection.mAction.mPrevTrack).setSubPage(transportDefaultSubPage)

  page.makeCommandBinding(surfaceElements.btnRight.mSurfaceValue, 'Zoom', 'Zoom In').setSubPage(transportShiftedSubPage)
  page.makeCommandBinding(surfaceElements.btnLeft.mSurfaceValue, 'Zoom', 'Zoom Out').setSubPage(transportShiftedSubPage)
  page.makeCommandBinding(surfaceElements.btnUp.mSurfaceValue, 'Zoom', 'Zoom In Vertically').setSubPage(transportShiftedSubPage)
  page.makeCommandBinding(surfaceElements.btnDown.mSurfaceValue, 'Zoom', 'Zoom Out Vertically').setSubPage(transportShiftedSubPage)

  page.makeValueBinding(surfaceElements.btnsRow0[0].devButton.mSurfaceValue, page.mHostAccess.mTrackSelection.mMixerChannel.mValue.mEditorOpen).setTypeToggle().setSubPage(transportDefaultSubPage)
  page.makeValueBinding(surfaceElements.btnsRow0[1].devButton.mSurfaceValue, page.mHostAccess.mTrackSelection.mMixerChannel.mValue.mInstrumentOpen).setTypeToggle().setSubPage(transportDefaultSubPage)
  page.makeCommandBinding(surfaceElements.btnsRow0[2].devButton.mSurfaceValue, 'Devices', 'Mixer').setSubPage(transportDefaultSubPage)
  page.makeValueBinding(surfaceElements.btnsRow0[3].devButton.mSurfaceValue, page.mHostAccess.mTransport.mValue.mMetronomeActive).setTypeToggle().setSubPage(transportDefaultSubPage)

  page.makeActionBinding(surfaceElements.defaultVariable, transportDefaultSubPage.mAction.mActivate)
  page.makeActionBinding(surfaceElements.shiftVariable, transportShiftedSubPage.mAction.mActivate)

  surfaceElements.btnShift.mSurfaceValue.mOnProcessValueChange = function (activeDevice, value) {
    if (value === 0) {
      isShifted = !isShifted
      if (isShifted) {
        surfaceElements.shiftVariable.setProcessValue(activeDevice, 1)
      } else {
        surfaceElements.defaultVariable.setProcessValue(activeDevice, 1)
      }
    }
  }
}

module.exports = {
  makePageWithDefaults
}