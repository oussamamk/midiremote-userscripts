var deviceSurface = require('./surface_elements.js')
var clearAllLeds = deviceSurface.clearAllLeds

var master_controls = require('./master_controls.js')
var makePageWithDefaults = master_controls.makePageWithDefaults

/**
 * 
 * @param {MR_ActiveDevice} activeDevice 
 */
function clearChannelState(activeDevice) {
  var activePage = activeDevice.getState('activePage')

  activeDevice.setState(activePage + ' - Fader - Titles', '')
  activeDevice.setState(activePage + ' - Fader - ValueTitles', '')
  activeDevice.setState(activePage + ' - Fader - Values', '')
  activeDevice.setState(activePage + ' - Knob - Titles', '')
  activeDevice.setState(activePage + ' - Knob - ValueTitles', '')
  activeDevice.setState(activePage + ' - Knob - Values', '')

  activeDevice.setState('displayType', 'Knob')
}

/**
 * 
 * @param {MR_DeviceDriver} deviceDriver 
 * @param {MR_FactoryMappingPage} page 
 * @param {MR_DeviceMidiOutput} midiOutput
 * @param {object} surfaceElements 
 * @returns
 */
function makePageRoomControl(deviceDriver, page, midiOutput, surfaceElements) {
  makePageWithDefaults(deviceDriver, page, surfaceElements)

  var controlRoom = page.mHostAccess.mControlRoom

  page.makeValueBinding(surfaceElements.faders[0].mSurfaceValue, controlRoom.mMainChannel.mLevelValue).setValueTakeOverModeJump()
  page.makeValueBinding(surfaceElements.btnsRow2[0].devButton.mSurfaceValue, controlRoom.mMainChannel.mMuteValue).setTypeToggle()
  page.makeValueBinding(surfaceElements.btnsRow1[0].devButton.mSurfaceValue, controlRoom.mMainChannel.mMetronomeClickActiveValue).setTypeToggle()

  page.makeValueBinding(surfaceElements.faders[1].mSurfaceValue, controlRoom.getPhonesChannelByIndex(0).mLevelValue).setValueTakeOverModeJump()
  page.makeValueBinding(surfaceElements.btnsRow2[1].devButton.mSurfaceValue, controlRoom.getPhonesChannelByIndex(0).mMuteValue).setTypeToggle()
  page.makeValueBinding(surfaceElements.btnsRow1[1].devButton.mSurfaceValue, controlRoom.getPhonesChannelByIndex(0).mMetronomeClickActiveValue).setTypeToggle()

  var maxCueSends = controlRoom.getMaxCueChannels() < 8 ? controlRoom.getMaxCueChannels() : 8

  for (var i = 0; i < maxCueSends; i++) {
    var cueSend = controlRoom.getCueChannelByIndex(i)
    var knobSurfaceValue = surfaceElements.knobs[i].mSurfaceValue
    page.makeValueBinding(knobSurfaceValue, cueSend.mLevelValue)
  }

  page.mOnActivate = function (/** @type {MR_ActiveDevice} */activeDevice) {
    activeDevice.setState('activePage', 'ControlRoom')
    clearAllLeds(activeDevice, this.midiOutput, this.surfaceElements)
    clearChannelState(activeDevice)
  }.bind({ midiOutput, surfaceElements })

  return page
}

module.exports = {
  makePageRoomControl
}