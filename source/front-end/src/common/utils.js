export function getTodayDate() {
    var fullDate = new Date()
    var yyyy = fullDate.getFullYear()
    var MM = (fullDate.getMonth() + 1) >= 10 ? (fullDate.getMonth() + 1) : ("0" + (fullDate.getMonth() + 1))
    var dd = fullDate.getDate() < 10 ? ("0" + fullDate.getDate()) : fullDate.getDate()
    var today = yyyy + "-" + MM + "-" + dd
    return today
}

export function getTodayStr() {
    var fullDate = new Date();
    var yyyy = fullDate.getFullYear();
    var MM = (fullDate.getMonth() + 1) >= 10 ? (fullDate.getMonth() + 1) : ("0" + (fullDate.getMonth() + 1));
    var dd = fullDate.getDate() < 10 ? ("0" + fullDate.getDate()) : fullDate.getDate();
    var today = String(yyyy) + String(MM) + String(dd);
    return today;
}

/**
 * 將整數的時間資料，取出時間部分，輸出"13:41:25"字串
 * @param {int} intTime 時間 ex: 20200603134125
 */
export function getTimeStr(intTime) {
    if (!intTime) return ''

    let str = String(intTime)
    return str.substr(8, 2) + ':' + str.substr(10, 2) + ':' + str.substr(12, 2)
}

/**
 * 十進制數據轉成BCD
 * @param {int} data  十進制數據
 * @returns {string}  BCD數據
 */
export function dec2bcd(data) {
    let y1 = data.toString(2)      // 轉換成二進制
    let y2 = y1.padStart(12, '0')

    let str1 = y2.slice(0, 4)
    let str2 = y2.slice(4, 8)
    let str3 = y2.slice(8)

    let arrS1 = str1.split('')
    let arrS2 = str2.split('')
    let arrS3 = str3.split('')

    let bcd1 = 8 * parseInt(arrS1[0]) + 4 * parseInt(arrS1[1]) + 2 * parseInt(arrS1[2]) + parseInt(arrS1[3])
    let bcd2 = 8 * parseInt(arrS2[0]) + 4 * parseInt(arrS2[1]) + 2 * parseInt(arrS2[2]) + parseInt(arrS2[3])
    let bcd3 = 8 * parseInt(arrS3[0]) + 4 * parseInt(arrS3[1]) + 2 * parseInt(arrS3[2]) + parseInt(arrS3[3])

    let BCD = ''
    if (bcd1) {
        BCD += bcd1
    }
    if (bcd2) {
        BCD += bcd2
    }
    if (bcd3) {
        BCD += bcd3
    }

    return BCD
}

export function isIpformatValid(ip) {
    var ipformat = /^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/;

    if (!ip.match(ipformat)) {
        return false;
    }

    return true;
}

export function isMacformatValid(mac) {
    var macformat = /[A-Fa-f0-9]{2}:[A-Fa-f0-9]{2}:[A-Fa-f0-9]{2}:[A-Fa-f0-9]{2}:[A-Fa-f0-9]{2}:[A-Fa-f0-9]{2}/;

    if (!mac.match(macformat)) {
        return false;
    }

    return true;
}

export function format(time, format) {
    var t = new Date(time);
    var tf = function (i) { return (i < 10 ? '0' : '') + i };
    return format.replace(/yyyy|MM|dd|HH|mm|ss/g, function (a) {
        switch (a) {
            case 'yyyy':
                return tf(t.getFullYear());
                break;
            case 'MM':
                return tf(t.getMonth() + 1);
                break;
            case 'mm':
                return tf(t.getMinutes());
                break;
            case 'dd':
                return tf(t.getDate());
                break;
            case 'HH':
                return tf(t.getHours());
                break;
            case 'ss':
                return tf(t.getSeconds());
                break;
        }
    })
}


export function adjustFontSize(res){
    let docEl = document.documentElement,
        clientWidth = window.innerWidth||document.documentElement.clientWidth||document.body.clientWidth;
    if (!clientWidth) return;
    let fontSize = 100 * (clientWidth / 1920);
    return res*fontSize;

}

export var factoryOptions = ["廠區一", "廠區二", "廠區三"];  
export var machineTypeOptions = ["公共用電節能", "空調節能"];  