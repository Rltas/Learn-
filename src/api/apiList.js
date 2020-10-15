import { baseUrl, yjBaseUrl } from './config'

const apiList = {
    getLoginState: `/app/user_info.htm`, // 获取登录信息

    login: `/app/login_mobile.htm`, // 获取登录信息

    getIndexInfo: `/app/Index.htm`, // 获取首页信息

    getStoreGoodsList: `/app/store_goods_list.htm`, // 获取分类商品列表

    // resetPwdByToken: `${yjBaseUrl}/resetPwdByToken.htm`, // 渝教重设密码

    getNormalSearchDatas: `/app/search.htm`, // 商品搜索

    getShoppingCartData: `/app/goods_cart1.htm`, // 获取购物车商品

    getGoodsDetail: `/app/goods.htm`, //普通商品详情

    getGoodsEvaluation: `/app/goods_evaluation.htm`, //商品评论

    getIntegralGoodsDetail: `/app/integral_view.htm`, //积分商品详情

    addShoppingCart: `/app/add_goods_cart.htm`, //加入购物车

    getAddressList: `/app/buyer/address.htm`, //获取收货地址列表

    removeGoodsInCart: `/app/remove_goods_cart.htm`, //从购物车删除商品

    getTransportMoney: `/app/goods_transport_money.htm`, //获取运费

    getDepositDetail: `/app/buyer/get_deposit_detail.htm`, //获取幸运值流水

    deleteAddress: `/app/buyer/address_del.htm`, //删除收货地址

    confirmOrder: `/app/buyer/order_cofirm_save.htm`, //确认收货

    cancelOrder: `/app/buyer/order_cancel_save.htm`, //取消订单

    deletOrder: `/app/buyer/order_delete.htm`, //删除订单

    getOrderDetail: `/app/buyer/order_view.htm`, //获取订单详情

    getOrderList: `/app/buyer/order.htm`, //获取订单列表

    getIntegralOrderList: `/app/buyer/integral_order_list.htm`, //获取积分订单列表

    confirmIntergralOrder: "/app/buyer/integral_order_cofirm_save.htm", //积分订单确认收货

    getLogisticsInfo: "/app/buyer/queryShip.htm", //获取物流信息

    cancelInteralOrderDetail: "/app/buyer/integral_order_cancel.htm", //关闭积分订单

    getOrderEvaluate: "/app/buyer/order_evaluate.htm", //获取订单评价

    submitOrderEvaluate: "/app/buyer/order_evaluate_save.htm", //提交订单评价

    getShareParmars:"/share/getParam.htm", //微信分享

    getExpertList:"/yuangaofen/getExpertList.htm", //获取专家列表

    getExpertById:"/yuangaofen/getExpertById.htm", //获取专家信息

    getMyConsultReply:"/yuangaofen/getMyConsultReply.htm", //获取我的答疑

    getAllConsultReply:"/yuangaofen/getAllConsultReply.htm", //获取所有答疑

    submitSignUp:"/yuangaofen/submitSignUp.htm",  //提交报名列表

    getVipGoods:"/yuangaofen/getVipGoods.htm",
    down:'/wxseller/down.htm',//下线
    upload:"/yuangaofen/upload.htm",  //上传文件

    submitConsultOrder:"/yuangaofen/submitConsultOrder.htm",

    getParam:"/yuangaofen/getParam.htm", //获取相册参数

    submitVipOrder: "/yuangaofen/submitVipOrder.htm",

    submitQuery:"/yuangaofen/submitConsultOrder.htm",

    getRoleByMobile:"/shop/getRoleByMobile.htm", //获取角色

    getVerifyCode: "/shop/getVerifyCode.htm", //获取验证码

    weChatBindFinish:"/shop/weChatBindFinish.htm", //绑定手机


    unBindingMobile:"/shop/releaseBinding.htm",

    getToken:"/shop/getCasToken.htm",  //绑定手机获取token

    downPay:"/app/outline/pay.htm", //线下支付

    outLineAdress: '/app/outline/getOutLineAddress.htm', //线下收款地址列表

    getOrderState:'/app/outline/orderRefresh.htm', //线下获取订单状态

    getExpressCompany: '/wxseller/ExpressCompany.htm', //快递公司列表

    shipMents: '/wxseller/shipping.htm', //卖家发货

    /*==========================分销==============================*/
    goodsShare: '/app/profit/goodsShare.htm', //根据商品信息及用户ID生成提成金额（分享页面）
    earningsList: '/app/profit/index.htm',//收益列表
    recordList: '/app/profit/recordList.htm',//提现记录
    recordDetail: '/app/profit/recordDetail.htm', //提现记录详情
    uploadPic: '/app/profit/uploadPic.htm', //上传二维码
    applyProfit: '/app/profit/applyProfit.htm', //申请提现

    serviceAgreement:'/app/buyer/getServiceDocument.htm', //服务协议

    //========================================
    getSeqOrgid:'/app/getSeqAndOrgIdRelation.htm',//获取orgid

    /**
     * 新模块接口
     */
    getAdvertBygcid: '/app/getAdvertBygcid.htm',//根据分类id获取广告
    getChildrenBygcid: '/app/getChildrenBygcid.htm',//根据分类ID获取下级分类gcid

    /**
     * 线下扫码
     */
    getOutlinescan: '/outlinescan/getGoodsDetail.htm',//线下扫码商品详情
    submitOrderOutline: '/outlinescan/submitOrder.htm',//线下扫码提交订单
    getOutLineGoodList: '/outlinescan/getGoodsList.htm', //线下扫码商品列表
    getSupplierDetail: '/outlinescan/getSupplierDetail.htm', //供货商详情
    outLineConfirm: '/outlinescan/confirm.htm ', //线下商品核销

    /**
     * 优惠券
     */
    getMyCoupon: '/app/coupon/getMyCoupon.htm', //我的优惠券
    myAvailableCouponCount: '/app/coupon/myAvailableCouponCount.htm', //获取未使用
    submitOrderCoupon: '/app/coupon/submitOrder.htm', //兑换优惠券
}

export { apiList }
