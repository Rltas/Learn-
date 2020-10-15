import {
    apiList
} from 'api/apiList'
import axios from 'api/axios'
import {
    baseUrl,
    yjBaseUrl
} from 'api/config'
import * as generalTool from '../js/general'
import * as storage from '../js/storage'
export default {
    install(Vue, options) {
        Vue.prototype.api = { // 封装api请求
                post: function (apiName, data) {
                    return axios.post(baseUrl + apiList[apiName], data || {})
                        .then(res => {
                            return Promise.resolve(res.data)
                        })
                        .catch(error => console.log(error.response))
                },
                get: function (apiName, data) {
                    return axios.get(baseUrl + apiList[apiName], {
                            params: data || {}
                        })
                        .then(res => Promise.resolve(res.data))
                        .catch(error => console.log(error.response))
                }
            },
            Vue.prototype.getQueryString = (name) => { // 获取url参数
                var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
                var r = window.location.hash
                    .substring(
                        window.location.hash.indexOf("?"),
                        window.location.hash.length
                    )
                    .substr(1)
                    .match(reg);
                if (r != null) return unescape(r[2]);
                return null;
            },
            Vue.prototype.isWeiXin = () => { // 判断是否为微信浏览器
                var ua = window.navigator.userAgent.toLowerCase();
                if (ua.match(/MicroMessenger/i) == "micromessenger") {
                    return true
                }
                return false
            }
        Vue.prototype.$numShow = (num) => { //保留两位小数
            try {
                num = Number(num);
                let num_tem = num.toFixed(2);
                let num_tem2 = Math.floor(num);
                if (num_tem > num_tem2) {
                    return num_tem;
                } else {
                    return num_tem2;
                }
            } catch (error) {
                return num
            }
        }
     Vue.prototype.$generalTool = generalTool,
     Vue.prototype.$storage = storage
    }
}