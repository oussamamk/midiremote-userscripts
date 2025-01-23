/**
 * 
 * @param {number} columnIndex 
 * @param {string} col_text 
 * @param {string} original_text 
 * @returns 
 */
function setTextOfColumn(columnIndex, col_text, original_text) {
    var col = columnIndex * 7
    var text = (col_text + '       ').slice(0, 7) // ensure to always clear a column

    //  original_text must be the full width of the display when setting a column
    // so pad with spaces if it isn't
    var new_text = original_text.slice(0, 56)
    var length = new_text.length
    while (length++ < 56)
        new_text = new_text.concat(" ")

    new_text = new_text.substring(0, col) + text + new_text.substring(col + 7, new_text.length)

    return new_text
}

/**
 * 
 * @param {string} textString 
 * @returns 
 */
function setTextOfLine(textString) {
    var blank = Array(56).join(" ")
    var text = (textString + blank).slice(0, 56)

    return text
}

/**
 * 
 * @param {string} value 
 * @param {number} length 
 * @returns 
 */
function makeLabel(value, length) {
    if (value.length <= length) {
        return value
    }

    // If to long shorten it by removing vowels and making it CamelCase to remove spaces
    var words = value.split(" ")
    var label = ""

    for (var i = 0, len = words.length; i < len; i++) {
        var currentStr = words[i]
        var tempStr = currentStr
        tempStr = tempStr.substr(0, 1).toUpperCase() + tempStr.substr(1).replace(/[aeou]/gi, '')
        label += tempStr
    }

    //first 3 + last 3
    return label.substr(0, 3) + label.substr(label.length - 3, 3)
}

/**
 * 
 * @param {string} value 
 * @param {number} length 
 * @returns 
 */
function makeLabel2(value, length) {
    if (value.length <= length) {
        return value
    }

    // If to long shorten it by removing vowels and making it CamelCase to remove spaces
    var words = value.split(" ")
    var label = ""

    for (var i = 0, len = words.length; i < len; i++) {
        var currentStr = words[i]
        var tempStr = currentStr
        tempStr = tempStr.substr(0, 1).toUpperCase() + tempStr.substr(1).replace(/[aeou]/gi, '')
        label += tempStr
    }

    return label.substr(0, 6)
}

module.exports = {
    makeLabel,
    setTextOfColumn,
    setTextOfLine,
    makeLabel2
}