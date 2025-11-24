/**
 * @param {MR_ActiveDevice} activeDevice
 * @param {object} context 
 */
function sendLableApp(activeDevice, context) {
    var data = [0xf0, 0x00, 0x00]
    for (var i = 0; i < context.numStrips1; i++) {
        data.push(context.knobs1[i].idx, context.knobs1[i].t.length)
        for (var j = 0; j < context.knobs1[i].t.length; j++) {
            data.push(context.knobs1[i].t.charCodeAt(j))
        }
        data.push(0)
        data.push(context.faders1[i].idx, context.faders1[i].t.length)
        for (var j = 0; j < context.faders1[i].t.length; j++) {
            data.push(context.faders1[i].t.charCodeAt(j))
        }
        data.push(0)
        data.push(context.btnsRow1[i].idx, context.btnsRow1[i].t.length)
        for (var j = 0; j < context.btnsRow1[i].t.length; j++) {
            data.push(context.btnsRow1[i].t.charCodeAt(j))
        }
        data.push(0)
        data.push(context.btnsRow2[i].idx, context.btnsRow2[i].t.length)
        for (var j = 0; j < context.btnsRow2[i].t.length; j++) {
            data.push(context.btnsRow2[i].t.charCodeAt(j))
        }
        data.push(0)
        data.push(context.btnsRow3[i].idx, context.btnsRow3[i].t.length)
        for (var j = 0; j < context.btnsRow3[i].t.length; j++) {
            data.push(context.btnsRow3[i].t.charCodeAt(j))
        }
        data.push(0)
        data.push(context.btnsRow4[i].idx, context.btnsRow4[i].t.length)
        for (var j = 0; j < context.btnsRow4[i].t.length; j++) {
            data.push(context.btnsRow4[i].t.charCodeAt(j))
        }
        data.push(0)
    }
    data.push(0xf7)
    context.midiOutput3.sendMidi(activeDevice, data)
}

function resetLabels(context) {
    for (var i = 0; i < context.numStrips1; i++) {
        context.knobs1[i].t = ''
        context.faders1[i].t = ''
        context.btnsRow1[i].t = ''
        context.btnsRow2[i].t = ''
        context.btnsRow3[i].t = ''
        context.btnsRow4[i].t = ''
    }
}

function setMixerDefaultLabels(context) {
    for (var i = 0; i < context.numStrips1; i++) {
        context.knobs1[i].t = 'Pan'
        context.faders1[i].t = 'Volume'
        context.btnsRow1[i].t = 'Mute'
        context.btnsRow2[i].t = 'Solo'
        context.btnsRow3[i].t = 'Rec'
        context.btnsRow4[i].t = 'Select'
    }
}

module.exports = {
    sendLableApp
}