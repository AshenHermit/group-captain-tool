export function addFixedChars(text, char, numberOfChars, before=true){
    var addNum = Math.max(0, numberOfChars-text.length)
    for (let i = 0; i < addNum; i++) {
        if(before) text = char + text
        else text += char
    }
    return text
}

export function getDayDifference(date1, date2){
    const diffTime = date1.getTime() - date2.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)); 
    return diffDays
}

export function getCurrentWeek(mCurrentDate) {
    var currentDate = new Date(mCurrentDate);
    var currentYear = currentDate.getFullYear();

    var startDate;
    const septemberMonth = 8
    if (currentDate.getMonth() >= septemberMonth) {
        startDate = new Date(currentYear, 8, 1);
    } else {
        startDate = new Date(currentYear, 1, 8);
    }

    var week = 1;
    var prevWeekday = startDate.getDay();

    while (getDayDifference(currentDate, startDate) != 0) {
        if (startDate.getDay() == 6 && startDate.getDay() != prevWeekday) {
            week += 1;
        }
        prevWeekday = startDate.getDay();
        startDate = new Date(startDate.getTime() + 24*60*60*1000);
    }

    return week;
}

export function copyToClipboard(text){
    const el = document.createElement('textarea');
    el.value = text;
    el.setAttribute('readonly', '');
    el.style.position = 'absolute';
    el.style.left = '-9999px';
    document.body.appendChild(el);
    el.select();
    document.execCommand('copy');
    document.body.removeChild(el);
}