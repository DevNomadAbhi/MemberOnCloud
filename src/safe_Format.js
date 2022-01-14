export const months_th = ["มกราคม", "กุมภาพันธ์", "มีนาคม", "เมษายน", "พฤษภาคม", "มิถุนายน", "กรกฎาคม", "สิงหาคม", "กันยายน", "ตุลาคม", "พฤศจิกายน", "ธันวาคม",];
export const months_th_mini = ["ม.ค.", "ก.พ.", "มี.ค.", "เม.ย.", "พ.ค.", "มิ.ย.", "ก.ค.", "ส.ค.", "ก.ย.", "ต.ค.", "พ.ย.", "ธ.ค.",];
export const regisMacAdd = async (urlser, serviceID, machineNum, userNameED, passwordED) => {
    console.log('REGIS MAC ADDRESS');
    await fetch(urlser + '/DevUsers', {
        method: 'POST',
        body: JSON.stringify({
            'BPAPUS-BPAPSV': serviceID,
            'BPAPUS-LOGIN-GUID': '',
            'BPAPUS-FUNCTION': 'Register',
            'BPAPUS-PARAM':
                '{"BPAPUS-MACHINE":"' +
                machineNum +
                '","BPAPUS-CNTRY-CODE": "66","BPAPUS-MOBILE": "0828845662"}',
        }),
    })
        .then((response) => response.json())
        .then(async (json) => {
            if (json.ResponseCode == 200 && json.ReasonString == 'Completed') {
                return await _fetchGuidLog(urlser, serviceID, machineNum, userNameED, passwordED);
            } else {
                console.log('REGISTER MAC FAILED');
            }
        })
        .catch((error) => {
            console.log('ERROR at regisMacAdd ' + error);
        });
}
export const _fetchGuidLog = async (urlser, serviceID, machineNum, userNameED, passwordED) => {
    console.log('FETCH GUID LOGIN');
    var new_GUID = '';
    await fetch(urlser + '/DevUsers', {
        method: 'POST',
        body: JSON.stringify({
            'BPAPUS-BPAPSV': serviceID,
            'BPAPUS-LOGIN-GUID': '',
            'BPAPUS-FUNCTION': 'Login',
            'BPAPUS-PARAM':
                '{"BPAPUS-MACHINE": "' +
                machineNum +
                '","BPAPUS-USERID": "' +
                userNameED +
                '","BPAPUS-PASSWORD": "' +
                passwordED +
                '"}',
        }),
    })
        .then((response) => response.json())
        .then((json) => {
            if (json && json.ResponseCode == '200') {
                let responseData = JSON.parse(json.ResponseData);
                console.log(">> GUID :: ", responseData.BPAPUS_GUID)
                new_GUID = responseData.BPAPUS_GUID;

            } else {
                console.log(">> ", json.ResponseCode)
            }
        })
        .catch((error) => {

            console.error('ERROR at _fetchGuidLogin' + error);
        });

    console.log(">> new_GUID :: ", new_GUID)
    return new_GUID;

}
export const monthFormat = (month) => {
    return months_th[Number(month) - 1];
}
export const currencyFormat = (num) => {
    if (num == 0) return '-'
    else return Number(num).toFixed(2).replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,')
}
export const sumTabledata = (item) => {
    var sumItem = 0;
    for (var i in item) {
        sumItem += Number(item[i])
    }
    return sumItem;
}
export const dateFormat = (date) => {
    var x = new Date()
    var year = x.getFullYear()
    var inputyear = Number(date.substring(0, 4))
    if (inputyear <= Number(x.getFullYear())) inputyear += 543
    return date.substring(6, 8) + '/' + months_th_mini[Number(date.substring(4, 6)) - 1] + '/' + inputyear
}
export const checkDate = (temp_date) => {
    if (temp_date.toString().search(':') == -1) {
        var tempdate = temp_date.split('-')
        temp_date = new Date(tempdate[2] + '-' + tempdate[1] + '-' + tempdate[0])
    }
    return temp_date
}
export const setnewdateF = (date) => {
    var x = new Date(date);

    var day = x.getDate()
    if (day < 10)
        day = '0' + day.toString()

    var month = x.getMonth() + 1
    if (month < 10)
        month = '0' + month.toString()

    var year = x.getFullYear()
    return year + '' + month + '' + day
}
export const Radio_menu = (index, val) => {

    var x = new Date();
    var day = x.getDate();
    var month = x.getMonth() + 1
    var year = x.getFullYear()
    var sdate = ''
    var edate = ''

    if (val == 'lastyear') {
        year = year - 1
        sdate = new Date(year, 0, 1)
        edate = new Date(year, 12, 0)
    } else if (val == 'nowyear') {
        year = year
        sdate = new Date(year, 0, 1)
        edate = new Date(year, 12, 0)
    }
    else if (val == 'nowmonth') {
        month = month - 1
        sdate = new Date(year, month, 1)
        edate = new Date(year, month + 1, 0)
    } else if (val == 'lastmonth') {
        month = month - 2
        sdate = new Date(year, month, 1)
        edate = new Date(year, month + 1, 0)
    }
    else if (val == 'lastday') {
        sdate = new Date().setDate(x.getDate() - 1)
        edate = new Date().setDate(x.getDate() - 1)
    } else {
        sdate = new Date()
        edate = new Date()
    }
    return { index: index, sdate: new Date(sdate), edate: new Date(edate) }
}
export const Base64 = {
    // private property
    _keyStr: "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=",

    // public method for encoding
    encode: function (input) {
        var output = "";
        var chr1, chr2, chr3, enc1, enc2, enc3, enc4;
        var i = 0;

        input = Base64._utf8_encode(input);

        while (i < input.length) {

            chr1 = input.charCodeAt(i++);
            chr2 = input.charCodeAt(i++);
            chr3 = input.charCodeAt(i++);

            enc1 = chr1 >> 2;
            enc2 = ((chr1 & 3) << 4) | (chr2 >> 4);
            enc3 = ((chr2 & 15) << 2) | (chr3 >> 6);
            enc4 = chr3 & 63;

            if (isNaN(chr2)) {
                enc3 = enc4 = 64;
            } else if (isNaN(chr3)) {
                enc4 = 64;
            }

            output = output +
                Base64._keyStr.charAt(enc1) + Base64._keyStr.charAt(enc2) +
                Base64._keyStr.charAt(enc3) + Base64._keyStr.charAt(enc4);
        }

        return output;
    },

    // public method for decoding
    decode: function (input) {
        var output = "";
        var chr1, chr2, chr3;
        var enc1, enc2, enc3, enc4;
        var i = 0;

        input = input.replace(/[^A-Za-z0-9\+\/\=]/g, "");

        while (i < input.length) {

            enc1 = Base64._keyStr.indexOf(input.charAt(i++));
            enc2 = Base64._keyStr.indexOf(input.charAt(i++));
            enc3 = Base64._keyStr.indexOf(input.charAt(i++));
            enc4 = Base64._keyStr.indexOf(input.charAt(i++));

            chr1 = (enc1 << 2) | (enc2 >> 4);
            chr2 = ((enc2 & 15) << 4) | (enc3 >> 2);
            chr3 = ((enc3 & 3) << 6) | enc4;

            output = output + String.fromCharCode(chr1);

            if (enc3 != 64) {
                output = output + String.fromCharCode(chr2);
            }
            if (enc4 != 64) {
                output = output + String.fromCharCode(chr3);
            }
        }

        output = Base64._utf8_decode(output);

        return output;
    },

    // private method for UTF-8 encoding
    _utf8_encode: function (string) {
        string = string.replace(/\r\n/g, "\n");
        var utftext = "";

        for (var n = 0; n < string.length; n++) {

            var c = string.charCodeAt(n);

            if (c < 128) {
                utftext += String.fromCharCode(c);
            }
            else if ((c > 127) && (c < 2048)) {
                utftext += String.fromCharCode((c >> 6) | 192);
                utftext += String.fromCharCode((c & 63) | 128);
            }
            else {
                utftext += String.fromCharCode((c >> 12) | 224);
                utftext += String.fromCharCode(((c >> 6) & 63) | 128);
                utftext += String.fromCharCode((c & 63) | 128);
            }
        }
        return utftext;
    },

    // private method for UTF-8 decoding
    _utf8_decode: function (utftext) {
        var string = "";
        var i = 0;
        var c = c1 = c2 = 0;

        while (i < utftext.length) {

            c = utftext.charCodeAt(i);

            if (c < 128) {
                string += String.fromCharCode(c);
                i++;
            }
            else if ((c > 191) && (c < 224)) {
                c2 = utftext.charCodeAt(i + 1);
                string += String.fromCharCode(((c & 31) << 6) | (c2 & 63));
                i += 2;
            }
            else {
                c2 = utftext.charCodeAt(i + 1);
                c3 = utftext.charCodeAt(i + 2);
                string += String.fromCharCode(((c & 15) << 12) | ((c2 & 63) << 6) | (c3 & 63));
                i += 3;
            }
        }
        return string;
    }
}