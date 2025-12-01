/**
 * @param {MR_ActiveDevice} activeDevice
 * @param {object} context 
 */
function sendLableApp1(activeDevice, context) {
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

/**
 * @param {MR_ActiveDevice} activeDevice
 * @param {object} context 
 */
function sendLableApp2(activeDevice, context) {
    var data = [0xf0, 0x00, 0x00]
    for (var i = 0; i < context.numStrips2; i++) {
        data.push(context.knobs2[i].idx, context.knobs2[i].t.length)
        for (var j = 0; j < context.knobs2[i].t.length; j++) {
            data.push(context.knobs2[i].t.charCodeAt(j))
        }
        data.push(0)

        data.push(context.faders2[i].idx, context.faders2[i].t.length)
        for (var j = 0; j < context.faders2[i].t.length; j++) {
            data.push(context.faders2[i].t.charCodeAt(j))
        }
        data.push(0)

        data.push(context.btnsL1U[i].idx, context.btnsL1U[i].t.length)
        for (var j = 0; j < context.btnsL1U[i].t.length; j++) {
            data.push(context.btnsL1U[i].t.charCodeAt(j))
        }
        data.push(0)

        data.push(context.btnsL1L[i].idx, context.btnsL1L[i].t.length)
        for (var j = 0; j < context.btnsL1L[i].t.length; j++) {
            data.push(context.btnsL1L[i].t.charCodeAt(j))
        }
        data.push(0)
    }
    data.push(0xf7)
    context.midiOutput4.sendMidi(activeDevice, data)
}


module.exports = {
    sendLableApp1,
    sendLableApp2
}