import axios from './axios'
import { baseUrl, yjBaseUrl, csUrl, casUrl } from './config'

const _this = this

// 获取用户登录信息
var getLoginState = () => {
    let url = baseUrl + '/app/user_info.htm'
    return axios.post(url).then((res) => {
        return Promise.resolve(res.data)
    })
}

// 获取首页信息
var getIndexInfo = (orgid) => {
    let url = baseUrl + '/app/Index.htm'
    return axios.post(url,{
        orgid
    }).then((res) => {
        return Promise.resolve(res.data)
    })
}

// 普通商品搜索
// currentPage: 分页的当前页
// pageSize: 一页展示的商品数量
// keyword: 关键词
var getNormalSearchDatas = (currentPage,pageSize,keyword,seq) => {
    let url = baseUrl + '/app/search.htm'
    return axios.post(url, {
        currentPage, pageSize, keyword,seq
    }).then((res) => {
        return Promise.resolve(res.data)
    })
}

// 获取商品详情
// id: 商品id
var getNormalGoodsDetail = id => {
    let url = baseUrl + '/app/goods.htm'
    return axios.post(url, {
        id
    }).then((res) => {
        return Promise.resolve(res.data)
    })
}

// 获取进销存商品列表
// currentPage: 分页的当前页
// pageSize: 一页展示的商品数量
// typecode: 分类code值
var getJxcDataList = (currentPage,pageSize,typecode) => {
    let url = baseUrl + '/app/jxc_goods_list.htm'
    return axios.post(url, {
        currentPage, pageSize, typecode
    }).then(res => {
        return Promise.resolve(res.data)
    })
}

// 获取进销存商品搜索结果
// keyword: 搜索关键词
var getJxcSearchList = (currentPage,pageSize,keyword) => {
    let url = baseUrl + '/app/jxc_goods_list.htm'
    return axios.post(url, {
        currentPage: currentPage,
        pageSize: pageSize,
        goods_name: keyword
    }).then(res => {
        return Promise.resolve(res.data)
    })
}

// 获取进销存商品详情
// id: 进销存商品ID
var getJxcDataDetail = id => {
    let url = baseUrl + '/app/jxc_goods.htm'
    return axios.post(url, {
        id
    }).then(res => {
        return Promise.resolve(res.data)
    })
}

// 推出登录
var logout = () => {
    let url = baseUrl + '/wap_logout.htm'
    return axios.post(url).then(res => {
        return Promise.resolve(res.data)
    })
}


// 修改密码
var resetPwd = (oldPwd,newPwd) => {
    let url = baseUrl + '/app/updatePwd.htm'
    return axios.post(url, {
        oldPwd,newPwd
    }).then(res => {
        return Promise.resolve(res.data)
    })
}


// 用户找回密码获取验证码
var sendPhoneCodeForgetPwd = (ps, utype, vcode) => {
    let url = yjBaseUrl + '/sendPhoneCodeForgetPassword.htm'
    return axios.post(url, {
        ps,
        utype,
        vcode
    }).then((res) => {
        return Promise.resolve(res.data)
    })
}

// 找回密码验证数据
// 返回token 以重设密码
var checkForResetPwd = (phones, utype, phcode) => {
        let url = yjBaseUrl + '/checkForResetPwd.htm'
        return axios.post(url, {
            phones,
            utype,
            phcode
        }).then((res) => {
            return Promise.resolve(res.data)
        })
    }
// 重置密码
// By token
var resetPwdByToken = (token, pwd) => {
    let url = `${yjBaseUrl}/resetPwdByToken.htm`
    return axios.post(url, {
        token,
        pwd
    }).then((res) => {
        return Promise.resolve(res.data)
    })
}

// 获取商品列表
var getStoreGoodsList = (data) => {
    let url = `${baseUrl}/app/store_goods_list.htm`
    console.log('--------------------');
    console.log(url);

    return axios.post(url, data).then((res) => {
        return Promise.resolve(res.data)
    })
}

var getShareParmars = (data) => {
  let url = `${csUrl}/share/getParam.htm`
  return axios.post(url, data).then((res) => {
    return Promise.resolve(res.data)
  })
}

//获取微信绑定的token
var getWxToken = ()=>{
  let url = `${baseUrl}/shop/getCasToken.htm`;
  return axios.post(url).then(res=>{
    if (res.data.code == 200) {
      $.ajax({
        url: `${casUrl}/shopVerify`,
        type: "GET",
        data: { token: res.data.obj },
        dataType: "jsonp", //指定服务器返回的数据类型
        jsonpCallback: "verify",  //必须该名称
        success: (data) => { },
        error: (res) => { }
      });
    }
  })
}

export {
    getNormalGoodsDetail,
    getLoginState,
    getIndexInfo,
    getNormalSearchDatas,
    getJxcDataList,
    getJxcDataDetail,
    getJxcSearchList,
    logout,
    resetPwd,
    sendPhoneCodeForgetPwd,
    checkForResetPwd,
    resetPwdByToken,
    getShareParmars,
    getWxToken
}
