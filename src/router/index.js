import Vue from 'vue'
import Router from 'vue-router'
Vue.use(Router)


export default new Router({
  routes: [
    { //首页
      path: '/',
      name: 'home',
      component: (resolve) => require(['../page/home/index.vue'], resolve),
      meta:{
        title:'生活超市',
        notKeepAlive: false
      }
    }, { //我
      path: '/personal',
      component: resolve => require(['components/personal/newPersonal'], resolve),
      children: [{
          path: '/orders',
          component: resolve => require(['components/orders/newOrders'], resolve),
          children: [{
            path: '/order-detail',
            component: (resolve) => require(['components/orders/order-detail'], resolve),
            meta: {
              title:'订单详情',
              notKeepAlive: true
            }
            }],
          meta: {
              title: '我的订单',
              notKeepAlive: true
          }
      }, {
          path: '/balance-history',
          name: 'balanceHistory',
          component: resolve => require(['components/personal/balance-history'], resolve),
          meta: {
              title:'幸运值变动历史',
              notKeepAlive: true
          }
      }],
      meta: {
          title:'生活超市',
          notKeepAlive: true
      }
    }, {
      path: '/qrcode-success',
      name: 'qrcodeSuccess',
      component: resolve => require(['components/orders/qrcode-success'], resolve),
      meta: {
        title: '绑定成功',
        notKeepAlive: true
      }
    }, {
      path: '/address',
      name: 'address',
      component: resolve => require(['components/personal/address'], resolve),
      meta: {
          title:'收货地址',
          notKeepAlive: true
      }
    }, {
      path: 'add-address',
      name: 'amendAddress',
      component: resolve => require(['components/personal/add-address'], resolve),
      meta: {
          title:'添加/修改收货地址',
          notKeepAlive: true
      }
    }, {
      path: '/evaluate',
      component: resolve => require(['components/orders/evaluate'], resolve),
      meta:{
        title:'评价',
        notKeepAlive:true
      }
    }, {
      path: '/logistics',
      component: resolve => require(['components/orders/logistics'], resolve),
      meta: {
          title: '生活超市',
          notKeepAlive: true
      }
    },{
      path: '/shopping-cart',
      component: resolve => require(['components/shopping-cart/newShoppingCart'], resolve),
      meta: {
          title:'生活超市',
          notKeepAlive: true
      }
    }, {
      path: '/all-goods',
      name: 'allGoods',
      component: resolve => require(['components/all-goods/newAllgoods'], resolve),
      meta:{
        title: '生活超市',
        notKeepAlive: false
      }
    },{
      path: '/pay',
      name: 'pay',
      component: resolve => require(['components/pay/pay'], resolve),
      meta: {
          title: '结算',
          notKeepAlive: true
      }
    }, {
      path: '/shoppingcar-pay',
      name: 'shoppingCarPay',
      component: resolve => require(['components/pay/shoppingcar-pay.vue'], resolve),
      meta: {
          title:'结算',
          notKeepAlive: true
      }
    }, {
      path: '/pay-way',
      name: 'payment',
      component: (resolve) => require(['components/pay/pay-way'], resolve),
      meta: {
          title:'支付方式',
          notKeepAlive: true
      }
    }, {
      path: '/pay-success',
      component: (resolve) => require(['components/pay/pay-success'], resolve),
      meta: {
          title:'支付成功',
          notKeepAlive: true
      }
    },{
      path: '/offline-pay',
      component: (resolve) => require(['components/pay/offline-pay'], resolve),
      meta: {
        title: '线下支付',
        notKeepAlive: true
      }
    },{
      title:'生活超市',
      path: '/search',
      component: (resolve) => require(['components/search/newSearch'], resolve),
      meta:{
        notKeepAlive:true
      }
    }, {
      path: '/goods-detail',
      name: 'goodsdetail',
      component: (resolve) => require(['components/goods-detail/newGoodsDetail'], resolve),
      meta: {
        title:'生活超市',
        notKeepAlive: true
      }
    }, {
      path: '/comment-list',
      name: 'commentList',
      component: resolve => require(['components/goods-detail/comment-list'], resolve),
      meta: {
          title:'评论列表',
          notKeepAlive: true
      }
    },{
      path: '/goods-classify-list',
      name: 'goodsClassifyList',
      component: resolve => require(['components/all-goods/goods-classify-list'], resolve),
      meta: {
          title:'商品列表',
          notKeepAlive: true
      }
    },{
      path: '/detail-redirect',
      name: 'detailredirect',
      component: resolve => require(['components/redirect/detail-redirect'], resolve),
      meta: {
        notKeepAlive: true,
        index: 0,
      }
    }, {
      path: '/redirect',
      name: 'redirect',
      component: resolve => require(['components/redirect/redirect'], resolve),
      meta: {
          notKeepAlive: true,
          index: 0,
      }
    }, {
      path:'/preference',
      name:'preference',
      component: resolve => require(['components/all-goods/preference'], resolve),
      meta: {
        notKeepAlive:true,
        title: '生活超市'
      }
    },{
      path:'/bindingMobile',
      name:'bindingMobile',
      meta:{
        title:'绑定手机号',
        notKeepAlive:true
      },
      component:resolve => require(['components/bindingMobile/bindingMobile'],resolve)
    },{
      path: '/unBindingMobile',
      name: 'unBindingMobile',
      meta: {
        title: '解除绑定',
        notKeepAlive: true
      },
      component: resolve => require(['components/bindingMobile/unBindingMobile'], resolve)
    },{
      path:"/contactUs",
      name:"contactUs",
      meta:{
        title:"联系我们",
        notKeepAlive:true
      },
      component:resolve=>require(["components/contact-us/contact-us"],resolve)
    }, {
      path: "/goodsLinkShare",
      name: "goodsLinkShare",
      meta: {
        title: "商品详情",
        notKeepAlive: true
      },
      component: resolve => require(["../page/distribution/goodsLinkShare"], resolve)
    }, {
      path: "/viewsPic",
      name: "viewsPic",
      meta: {
        title: "图片详情",
        notKeepAlive: true
      },
      component: () => import('../page/distribution/viewsPic.vue')
    }, {
      path: "/distributionCenter",
      name: "distributionCenter",
      meta: {
        title: "分销中心",
        notKeepAlive: true
      },
      component: resolve => require(["../page/distribution/distributionCenter"], resolve)
    }, {
      path: "/takeMoneyDetail",
      name: "takeMoneyDetail",
      meta: {
        title: "提现详情",
        notKeepAlive: true
      },
      component: resolve => require(["../page/distribution/takeMoneyDetail"], resolve)
    }, {
      path: "/withdrawDeposit",
      name: "withdrawDeposit",
      meta: {
        title: "提现",
        notKeepAlive: true
      },
      component: resolve => require(["../page/distribution/withdrawDeposit"], resolve)
    }, {
      path: '/scan',
      name: 'scan',
      meta: {
        title: '结算',
        notKeepAlive: true
      },
      component: () => import('../page/home/Scan.vue')
    }, {
      path: '/outLineSuccess',
      name: 'outLineSuccess',
      meta: {
        title: '支付成功',
        notKeepAlive: true
      },
      component: () => import('../page/home/OutLineSuccess.vue')
    }, {
      path: '/coupon',
      name: 'coupon',
      meta: {
        title: '我的优惠券',
        notKeepAlive: true
      },
      component: () => import('../page/home/Coupon.vue')
    }, {
      path: '/couponPay',
      name: 'couponPay',
      meta: {
        title: '结算',
        notKeepAlive: true
      },
      component: () => import('../page/home/CouponPay.vue')
    },{
      path: '/test',
      name: 'test',
      meta: {
        title: '测试',
        notKeepAlive: true
      },
      component: () => import('../page/home/Test.vue')
    }
  ]
})



