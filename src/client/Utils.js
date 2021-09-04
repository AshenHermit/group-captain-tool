export function addFixedChars(text, char, numberOfChars, before=true){
    var addNum = Math.max(0, numberOfChars-text.length)
    for (let i = 0; i < addNum; i++) {
        if(before) text = char + text
        else text += char
    }
    return text
}