// 测试环境host集合, 默认本地开发为测试环境
let testEvnHosts = [
    // 'localhost', // 如需本地调试正式环境, 注释这里
    'cs.yujiaojiaoyu.com'
]

// let baseUrl = 'https://shop.yujiaojiaoyu.com' //正式
// let baseUrl = 'http://192.168.0.186:8080' //钟翼
let baseUrl = "http://cs.yujiaojiaoyu.com"
//    let baseUrl = 'http://mall.966977.com.cn'
let casUrl = 'http://testauth.yujiaojiaoyu.com'  //获取微信绑定后的token

let yjBaseUrl = 'http://www.yujiaojiaoyu.com'

let csUrl = 'http://cs.yujiaojiaoyu.com'


testEvnHosts.forEach(item => {
    if (window.location.host.indexOf(item) > -1) {
        baseUrl = 'http://cs.yujiaojiaoyu.com'
            // baseUrl = 'http://192.168.0.152:8080/'
            // baseUrl = 'https://www.yujiaojiaoyu.com:8001'
        yjBaseUrl = 'http://www.yujiaojiaoyu.com:8093'
        csUrl = 'cs.yujiaojiaoyu.com'
    }
})

export { baseUrl, yjBaseUrl, csUrl, casUrl }
