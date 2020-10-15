const state = {
    userInfo: {}, // 用户信息
    token: '', // jwt返回的token，访问TOKEN，有效期一天
    refreshToken: '', // 刷新TOKEN，有效期10天
    shoppingReadyToPay: {
        addr_id: '', // 地址ID
        isBuyNow: '', // 0：false，1：true
        msg: '', // 卖家留言
        from: '', // 订单来源 PC端：“pc”，公众号：“weixin”，愉教愉乐：“yjyl”
        isDeposit: '', // 是否幸运值支付
        storeInfo: [], // 店铺商品信息
        isVip:''
    },
    userDeposit: 0,
    isVip:0,
    phoneNumber:''
}

export default state
