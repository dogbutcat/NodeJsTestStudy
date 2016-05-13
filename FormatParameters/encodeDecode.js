/**
 * Created by oliver on 5/5/16.
 */
//native 转换 utf8
function Native2UTF8(a) {

    // var n_s=$("#n_source").val();
    if ('' == a) {
        alert('请输入Native字符串');
        return;
    }
    return a.replace(/[^\u0000-\u00FF]/g, function ($0) {
        return escape($0).replace(/(%u)(\w{4})/gi, "&#x$2;")
    });
}

//UTF-8 转换 Native
function UTF82Native(a) {
    // var code = $("#u_source").val();
    return unescape(a.replace(/&#x/g, '%u').replace(/;/g, ''));
}


//Native 转换 Unicode
function Native2Unicode(a) {

    // var a_s=$("#a_source").val();
    if ('' == a) {
        alert('请输入Native字符串');
        return;
    }
    var sumResult = '';
    for (var i = 0; i < a.length; i++)
        sumResult += '&#' + a.charCodeAt(i) + ';';
}

/**
 * Convert to Native
 * @param a input code
 * @constructor
 */
function Unicode2Native(a) {
    var code = a.match(/&#(\d+);/g);
    if (code == null) {
        console.log('请输入正确的Unicode代码！');
        return;
    }
    var retString = '';
    for (var i = 0; i < code.length; i++)
        retString += String.fromCharCode(code[i].replace(/[&#;]/g, ''));
}

/**
 * Convert to ASCII
 * @param a input string
 * @param b isContain Alphbet
 * @returns {string}
 */
function native2ascii(a, b) {
    var ascii = "";
    for (var i = 0; i < a.length; i++) {
        var code = Number(a[i].charCodeAt(0));
        if (!b || code > 127) {
            var charAscii = code.toString(16);
            charAscii = new String("0000").substring(charAscii.length, 4) + charAscii;
            ascii += "\\u" + charAscii;
        }
        else {
            ascii += a[i];
        }
    }
    return ascii;
}
function ascii2native(a) {
    var character = a.split("\\u");
    var native1 = character[0];
    for (var i = 1; i < character.length; i++) {
        var code = character[i];
        native1 += String.fromCharCode(parseInt("0x" + code.substring(0, 4)));
        if (code.length > 4) {
            native1 += code.substring(4, code.length);
        }
    }
    return native1;
}

function encode_uri(a,b) {
    if(b)
        return (encodeURIComponent(a));
    else
        return (encodeURI(a));
}

function decode_uri(a,b) {
    if(b)
        return(decodeURIComponent(a));
    else
        return(decodeURI(a));
}


module.exports.UTF82Native = UTF82Native;
module.exports.Unicode2Native = Unicode2Native;
module.exports.ascii2native = ascii2native;
