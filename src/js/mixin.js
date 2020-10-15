// 判断浏览器是否为微信，如果是微信返回true，不是微信返回false
var isWeixin = () => {
    var ua = window.navigator.userAgent.toLowerCase();
    if (ua.match(/MicroMessenger/i) == "micromessenger") {
        return true
    }
    return false
}

// 获取浏览器url参数
var getQueryString = name => {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
    var r = window.location.hash.substring(window.location.hash.indexOf('?'), window.location.hash.length).substr(1).match(reg);
    if (r != null) return unescape(r[2]);
    return null;
}

// 判断浏览器
var os = () => {
    var ua = navigator.userAgent,
        isWindowsPhone = /(?:Windows Phone)/.test(ua),
        isSymbian = /(?:SymbianOS)/.test(ua) || isWindowsPhone,
        isAndroid = /(?:Android)/.test(ua),
        isFireFox = /(?:Firefox)/.test(ua),
        isChrome = /(?:Chrome|CriOS)/.test(ua),
        isTablet = /(?:iPad|PlayBook)/.test(ua) || (isAndroid && !/(?:Mobile)/.test(ua)) || (isFireFox && /(?:Tablet)/.test(ua)),
        isPhone = /(?:iPhone)/.test(ua) && !isTablet,
        isPc = !isPhone && !isAndroid && !isSymbian;
    return Promise.resolve(res => {
        isTablet,
        isPhone,
        isAndroid,
        isPc
    })
}


export {
    isWeixin,
    getQueryString,
    os
}
