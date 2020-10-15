<template>
  <div class="order">

    <!-- 菜单 -->
    <div class="order-menu vux-1px-b">

      <ul v-show="currentView == 1">
        <li v-for="(item,index) in ordersMenu" :key="index" :class="{menu_item_active: indexItem == index}"
          @click="showList(index)" class="menu-item">
          <span class="text">
            <span>{{item}}</span>
          </span>
        </li>
      </ul>


      <ul v-show="currentView == 2">
        <li v-for="(item,index) in integralOrdersMenu" :key="index" :class="{menu_item_active: indexItem == index}"
          @click="integralShowList(index)" class="menu-item">
          <span class="text">
            <span>{{item}}</span>
          </span>
        </li>
      </ul>
    </div>

    <!-- 订单列表 -->
    <Scroll style="over-flow: hidden; height: 100%" :data="orders" @scrollToEnd="goodsLoadMore"
      :listen-scroll="listenScroll" :probe-type="probeType" :pullup="pullup" @scroll="showBackButton" ref="dataList"
      v-show="currentView == 1">
      <div v-show="currentView == 1" class="order-list">
        <ul>
          <li v-for="(item,index) in orders" :key="index" class="list-detail">
            <div class="list-title vux-1px-b">
              <h1>创建时间：{{item.addTime}}</h1>
              <span v-if="item.ordeStatus=='10'" @click="cancelOrder(item)">取消订单</span>
              <span class="delet-icon" v-if="item.ordeStatus=='0'||item.ordeStatus=='-1'"
                @click="deletOrder(item)"></span>
            </div>
            <div class="list-item">
              <!-- 商品列表 -->
              <a @click="openDetail(item)">
                <div v-for="(goodList,k) in item.goodsCarList" :key="k" class="goods-list vux-1px-b">
                  <div class="goods-img">
                    <img width="60" height="60" v-lazy="goodList.url" alt="...">
                  </div>
                  <div class="content">
                    <span class="name">{{goodList.name}}</span>
                    <div class="goods-standard">
                      <div class="cc-left">
                        <span v-for="(citem,index2) in goodList.specMap" :key="index2">【{{citem.value}}】</span>
                        *{{goodList.num}}
                      </div>
                      <div class="cc-right">
                        <!-- 订单状态 -->
                        <div v-if="item.ordeStatus=='0'||item.ordeStatus=='-1'" class="order-state">交易关闭</div>
                        <div v-if="item.ordeStatus=='10'" class="order-state">待付款</div>
                        <div v-if="item.ordeStatus=='20'" class="order-state">
                          <template v-if="item.order_from == 'outline_scan'">
                            已付款
                          </template>
                          <template v-else>
                            待发货
                          </template>
                          </div>
                        <div v-if="item.ordeStatus=='30'" class="order-state">待收货</div>
                        <div v-if="item.showStatus=='3'" class="order-state">交易完成</div>
                        <div v-if="item.ordeStatus=='47'" class="order-state">退货完成</div>
                      </div>
                    </div>
                  </div>
                </div>
              </a>
              <div class="action-box" v-if="!(item.ordeStatus =='0'||item.ordeStatus =='-1')">
                <!-- 价格 -->
                <div class="total-price" v-if="item.ordeStatus=='10'">应付：¥{{Number(item.totalPrice).toFixed(2)}}</div>
                <div class="total-price" v-else>已付：¥{{Number(item.totalPrice).toFixed(2)}}</div>
                <!-- <div class="total-price" v-if="item.ordeStatus =='10'">待支付 <span class="color-price">¥{{Number(item.totalPrice-item.depositPrice).toFixed(2)}}</span> <a v-if="(item.totalPrice != '' || item.totalPrice != null) && userDeposit != -1">幸运值抵扣<span  class="color-price">¥{{Number(item.depositPrice).toFixed(2)}}</span></a></div> -->

                <!-- 操作 -->
                <div class="order-operation">
                  <!-- <router-link v-if="item.ordeStatus=='10'" :to="{path: 'pay-way', query: { id: item.id, orderNumber: item.orderId, pay:Number(item.totalPrice-item.depositPrice).toFixed(2)}}" class="pay-money border-1px">立即付款</router-link> -->
                  <a @click="handlePayMoney(item)" v-if="item.ordeStatus=='10'" class="pay-money border-1px">立即付款</a>
                  <a @click="goToLogistics(item)" v-if="item.ordeStatus == '30'" class="border-1px">查看物流</a>
                  <a v-if="item.ordeStatus == '30'" class="confirm-take border-1px" @click="affirm(item)">确认收货</a>
                  <router-link :to="{path: '/evaluate', query:{id: item.id}}"
                    v-if="item.ordeStatus == '40' || item.ordeStatus == '60'" class="border-1px">立即评价</router-link>
                </div>
              </div>
              <!-- <div class="qr-code" v-if="item.ordeStatus == '15'">
                    <img src="../../common/images/newIndex/code.png" alt="">
                    <div class="code-text" @click="goLineDown(item)">
                      <span>线下付款二维码</span>
                      <img src="../../common/images/newIndex/right.png" alt="">
                    </div>
                  </div> -->
            </div>
          </li>
        </ul>
      </div>

      <no-data v-show="showNoData" tip="该分类没有数据"></no-data>
    </Scroll>

    <Scroll style="over-flow: hidden; height: 100%" :data="integralOrders" @scrollToEnd="goodsLoadMore"
      :listen-scroll="listenScroll" :probe-type="probeType" :pullup="pullup" @scroll="showBackButton" ref="dataList"
      v-show="currentView == 2">
      <div v-show="currentView == 2" class="order-list">
        <li v-for="(item,index) in integralOrders" :key="index" class="list-detail">
          <div>
            <h1>创建时间：{{item.addTime}}</h1>
            <div class="list-item">
              <!-- 商品列表 -->
              <div>
                <!-- <router-link :to="{path: '/integral-order-detail', query: { id: item.id }}"> -->
                <div v-for="(goodList,index1) in item.goodsCarList" :key="index1" class="goods-list vux-1px-b">
                  <div class="goods-img">
                    <img width="57" height="57" v-lazy="goodList.url" alt="...">
                  </div>
                  <div class="content">
                    <span class="name">{{goodList.name}}</span>
                    <div class="goods-standard">
                      <div class="cc-right">
                        {{goodList.unitPrice}} x{{goodList.num}}
                      </div>
                    </div>
                  </div>
                </div>
                <!-- 订单状态 -->
                <div v-if="item.ordeStatus=='0'||item.ordeStatus=='-1'" class="order-state">交易关闭</div>
                <div v-if="item.ordeStatus=='10'" class="order-state">待付款</div>
                <div v-if="item.showStatus=='1'" class="order-state">待发货</div>
                <div v-if="item.ordeStatus=='30'" class="order-state">待收货</div>
                <div v-if="item.showStatus=='3'" class="order-state">交易完成</div>
                <!-- 价格 -->
                <div class="total-price">使用积分 <span class="color-price">{{item.totalPrice}}</span></div>
              </div>

              <!-- 操作 -->
              <div class="order-operation">
                <router-link v-if="item.ordeStatus=='10'"
                  :to="{path: 'pay-way', query: { id: item.id, orderNumber: item.orderId, pay:item.totalPrice }}"
                  class="border-1px">立即付款</router-link>
                <a @click="goToLogistics(item)" v-if="item.ordeStatus == '30'" class="border-1px">查看物流</a>
                <a v-if="item.ordeStatus == '30'" class="border-1px" @click="integralAffirm(item)">确认收货</a>
              </div>
            </div>
          </div>
        </li>

        <div v-show="noOrders">
          <span class="default-hint">没有订单</span>
        </div>
      </div>
    </Scroll>

    <!-- <back-top v-show="showBackTop"  @click.native="backToTop"></back-top> -->
    <router-view></router-view>
  </div>
</template>

<script>
  import Scroll from 'base/scroll'
  import BackTop from 'base/backTop'
  import NoData from 'base/noData'
  export default {
    components: {
      Scroll,
      BackTop,
      NoData,
    },
    data() {
      return {
        ordersMenu: ["全部", "待付款", "待发货", "待收货", "已完成"], //商品订单导航
        integralOrdersMenu: ["全部", "", "待发货", "待收货", "已完成"], //积分订单导航
        orders: [], //商品订单
        integralOrders: [], //积分订单
        index: "",
        indexItem: 0,
        currentView: 1,
        id: "",
        isInte: false,
        loadMoreCon: false,
        loadMoreIndex: 1,
        noOrders: false,
        userDeposit: "",
        pullup: true, // 是否开启上拉加载
        showBackTop: false, //是否显示返回顶部
        showNoData: false,
        loadingText: '',
        loadMore: true,
        cancelOrDel: '', //取消删除订单标识
      };
    },
    created() {
      this.listenScroll = true
      this.probeType = 3
      this.userDeposit = localStorage.getItem("userDeposit")

      // 商品订单
      var orderType = this.getQueryString("type")
      if (orderType == 5) {
        this.currentView = 2
      } else {
        this.indexItem = orderType || 0;
      }
      this.getAllOrderList(); //获取订单列表
      // 积分订单
      this.api.post('getIntegralOrderList', {
        currentPage: 1,
        pageSize: 16
      }).then(res => {
        if (res.code == '200') {
          this.loading = false;
          this.integralOrders = res.obj.orderList;
          if (
            res.obj.totalPage == 1 ||
            res.obj.totalPage == null ||
            res.obj.totalPage == ""
          ) {
            this.loadMoreCon = false;
          } else {
            this.loadMoreCon = true;
          }

          // 判断订单是否为空
          if (this.integralOrders == "" || this.integralOrders == null) {
            this.noOrders = true;
          } else {
            this.noOrders = false;
          }
        }
      })
    },
    methods: {
      getAllOrderList() {
        let data = {
          currentPage: 1,
          pageSize: 10,
          showStatus: this.indexItem - 1
        }
        this.$toast.loading({
          duration: 0,
          forbidClick: true,
          message: '加载中...'
        })
        this.api.post('getOrderList', data).then(res => {
          this.$toast.clear()
          if (res.code == '200') {
            if (!res.obj.orderList) {
              this.showNoData = true
            }
            this.orders = res.obj.orderList;

            // 判断订单是否为空
            if (this.orders == "" || this.orders == null) {
              this.noOrders = true;
            } else {
              this.noOrders = false;
            }

            if (
              res.obj.totalPage == 1 ||
              res.obj.totalPage == null ||
              res.obj.totalPage == ""
            ) {
              this.loadMoreCon = false;
            } else {
              this.loadMoreCon = true;
            }
          }
        })
      },
      showBackButton: function (pos) {
        pos.y > -2000 ? this.showBackTop = false : this.showBackTop = true
      },
      backToTop: function () {
        var scrolltop = document.documentElement.scrollTop || document.body.scrollTop;
        document.documentElement.scrollTop = document.body.scrollTop = 0;
        var timer = null;
        var isTop = true;
      },

      // 获取href数据
      getQueryStringVar: function (name) {
        var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
        var r = window.location.href
          .substring(
            window.location.href.indexOf("?"),
            window.location.href.length
          )
          .substr(1)
          .match(reg);
        if (r != null) return unescape(r[2]);
        return null;
      },
      //订单切换
      showList: function (index) {
        this.orders = []
        this.$toast.loading({
          duration: 0,
          forbidClick: true,
          message: '加载中...'
        })
        this.indexItem = index
        this.loadMoreIndex = 1
        this.showNoData = false
        index -= 1
        this.api.post('getOrderList', {
          currentPage: 1,
          pageSize: 10,
          showStatus: index
        }).then(res => {
          this.$toast.clear()
          this.orders = res.obj.orderList;
          if (!res.obj.orderList) {
            this.showNoData = true
          }

          if (
            res.obj.totalPage == 1 ||
            res.obj.totalPage == null ||
            res.obj.totalPage == ""
          ) {
            this.loadMoreCon = false;
          } else {
            this.loadMoreCon = true;
          }
          // 判断订单是否为空
          if (this.orders == "" || this.orders == null) {
            this.noOrders = true;
          } else {
            this.noOrders = false;
          }
        })
      },
      //积分订单切换
      integralShowList: function (index) {
        this.$toast.loading({
          duration: 0,
          forbidClick: true,
          message: '加载中...'
        })
        this.indexItem = index;
        index -= 1;
        this.loadMoreIndex = 1;
        this.api.post('getIntegralOrderList', {
          currentPage: 1,
          pageSize: 10,
          showStatus: index
        }).then(res => {
          this.$toast.clear()
          this.integralOrders = res.obj.orderList;
          if (
            res.obj.totalPage == 1 ||
            res.obj.totalPage == null ||
            res.obj.totalPage == ""
          ) {
            this.loadMoreCon = false;
          } else {
            this.loadMoreCon = true;
          }

          // 判断订单是否为空
          if (this.integralOrders == "" || this.integralOrders == null) {
            this.noOrders = true;
          } else {
            this.noOrders = false;
          }
        })
      },

      // 确认收货
      affirm: function (e) {
        this.id = e.id;
        this.isInte = false;
        this.$dialog.confirm({
          title: '提示',
          message: '是否确认收货？'
        }).then(() => {
          this.$toast.loading({
            duration: 0,
            forbidClick: true,
            message: '加载中'
          })
          this.api.post("confirmOrder", {id: this.id}).then(res => {
            this.$toast.clear()
            this.$dialog.alert({
              title: '提示',
              message: '确认收货成功'
            }).then(() => {
              location.reload()
            })
          })
        })
      },
      // 积分确认收货
      integralAffirm: function (e) {
        this.id = e.id;
        this.isInte = true;
        this.$dialog.confirm({
          title: '提示',
          message: '是否确认收货？'
        }).then(() => {
          this.$toast.loading({
            duration: 0,
            forbidClick: true,
            message: '加载中'
          })
          this.api.post('confirmIntergralOrder', {id: this.id}).then(() =>{
            this.$toast.clear()
            this.$dialog.alert({
              title: '提示',
              message: '确认收货成功'
            }).then(() =>{
              location.reload()
            })
          })
        })
      },
      // 加载更多
      goodsLoadMore: function () {

        if (!this.loadMoreCon) {
          return
        }
        if (this.loadMore == false) {
          return
        } else {
          this.loadMore = false
          this.loadingMore = true
          this.loadMoreIndex += 1;
          var _this = this;
          var showStatus = this.indexItem;
          showStatus -= 1;
          this.api.post('getOrderList', {
            currentPage: this.loadMoreIndex,
            pageSize: 10,
            showStatus: showStatus
          }).then(res => {
            if (res.obj.orderList.length < 10) {
              this.spinner = false
            }
            this.loadMore = true
            var arr = [];
            res.obj.orderList.forEach(list => {
              _this.orders.push(list);
            });
            if (this.loadMoreIndex < res.obj.totalPage) {
              this.loadMoreCon = true;
            } else {
              this.loadMoreCon = false;
            }
          })
        }
      },
      integralLoadMore: function () {
        this.loadMoreIndex += 1;
        var _this = this;
        var showStatus = this.indexItem;
        showStatus -= 1;
        this.api.post('getIntegralOrderList', {
          currentPage: this.loadMoreIndex,
          pageSize: 10,
          showStatus: showStatus
        }).then(res => {
          var arr = [];
          res.obj.orderList.forEach(item => {
            _this.integralOrders.push(item);
          });

          if (this.loadMoreIndex < res.obj.totalPage) {
            this.loadMoreCon = true;
          } else {
            this.loadMoreCon = false;
          }
        })
      },
      goToLogistics: function (item) {
        var _type = this.currentView;
        this.$router.push({
          path: "/logistics",
          query: {
            id: item.id,
            type: _type
          }
        });
      },
      openDetail: function (item) {
        this.$router.push({
          path: '/order-detail',
          query: {
            id: item.id
          }
        })
      },
      goLineDown(item) {
        this.$router.push({
          path: '/offline-pay',
          query: {
            id: item.id,
            price: item.totalPrice,
            orderTime: item.addTime,
          }
        })
      },
      //确认付款
      handlePayMoney(item) {
        this.api.post('getOrderDetail', {
          'id': item.id
        }).then(res => {
          let data = {
            id: item.id,
            orderNumber: item.orderId,
            orderPay: Number(item.totalPrice) - Number(res.obj.depositPrice),
            pay: Number(item.totalPrice),
            shipMoney: res.obj.shipPrice,
            luckyValue: res.obj.depositPrice,
            isShowInfo: false //是否显示拆单金额
          }
          this.$parent.handleShowPayBox(data);
        })
      },
      sureLoad(){
        location.reload()
      },
      //取消订单
      cancelOrder(item) {
        this.id = item.id;
        this.cancelOrDel = 'cancel';
        this.$dialog.confirm({
          title: '提示',
          message: '是否取消订单？'
        }).then(() => {
          this.api.post('cancelOrder',{id: this.id}).then(() => {
            this.$dialog.alert({
              title: '提示',
              message: '订单取消成功'
            }).then(() => {
              location.reload()
            })
          })
        })
      },
      deletOrder(item) {
        this.id = item.id;
        this.$dialog.confirm({
          title: '提示',
          message: '是否删除订单？'
        }).then(() => {
          this.api.post('deletOrder',{id: this.id}).then(() => {
            this.$dialog.alert({
              title: '提示',
              message: '订单删除成功'
            }).then(() => {
              location.reload()
            })
          })
        })
      },
      showShipment(item) {
        this.$parent.showShipment(item);
      }
    }
  };
</script>

<style lang="less" scoped>
  @import "~vux/src/styles/1px.less";
  @import "~vux/src/styles/center.less";

  .order {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: #EEEEEE;

    .header-v2-tap {
      height: 100%;

      .header-v2-ul {
        display: block;
        height: .3rem;
        margin: .05rem 0;
        background-color: #eee;
        border-radius: .08rem;

        .header-v2-li {
          display: block;
          width: 50%;
          float: left;
          font-size: .14rem;
          line-height: .3rem;
          color: rgba(0, 0, 0, .6)
        }

        .h_v2_active {
          color: #fff;
          border: none;
          background: linear-gradient(98deg, rgb(255, 39, 25), rgb(255, 97, 173));
          border-radius: .08rem;
        }
      }
    }

    //菜单
    .order-menu {
      overflow: hidden;
      position: fixed;
      top: 0px;
      left: 0;
      right: 0;
      background-color: #fff;
      z-index: 20;

      ul {
        li {
          font-size: .14rem;
          float: left;
          list-style: none;
          width: 20%;
          line-height: .4rem;
          text-align: center;
          color: #333;
          border-bottom: .04rem solid transparent;
        }

        .menu_item_active {
          color: #FF773A;
          border-bottom-color: #FF773A;
        }
      }
    }

    //订单列表
    .order-list {
      padding-top: .52rem;

      .list-detail {
        list-style: none;
        margin-bottom: .08rem;
        background-color: #fff;
        padding: 0 .16rem;

        .list-title {
          display: flex;
          justify-content: space-between;
          line-height: .4rem;
          align-items: center;

          h1 {
            font-size: .12rem;
            font-weight: 400;
          }

          span {
            font-size: .12rem;
            color: #999;
          }

          .delet-icon {
            display: inline-block;
            width: .16rem;
            height: .16rem;
            background: url('../../common/images/newIndex/delete.png') no-repeat;
            background-size: .16rem .16rem;
          }
        }

        .list-item {
          overflow: hidden;

          .goods-list {
            display: flex;
            padding: .08rem 0;

            .goods-img {
              flex: 0 0 .6rem;
              width: .6rem;
              margin-right: .1rem;
              overflow: hidden;
            }

            .content {
              flex: 1;

              .name {
                display: block;
                overflow: hidden;
                margin: .09rem 0 .11rem 0;
                height: .16rem;
                line-height: .16rem;
                font-size: .14rem;
                color: #333333;
              }

              .goods-standard {
                color: #999;
                font-size: .12rem;
                line-height: .18rem;
                display: flex;
                justify-content: space-between;

                .order-state {
                  // float: left;
                  white-space: nowrap;
                  font-size: .12rem;
                  color: #E20404;
                }
              }
            }
          }

          .action-box {
            display: flex;
            justify-content: space-between;
            align-items: center;

            .total-price {
              font-size: .12rem;
              line-height: .4rem;
              color: #333;
            }

            .order-operation {
              a {
                display: inline-block;
                width: .88rem;
                font-size: .12rem;
                color: #666666;
                text-align: center;
                line-height: .28rem;
                border-radius: .03rem;
                border: .01rem solid rgba(153, 153, 153, 1);
              }

              .pay-money {
                background-color: #FF4040;
                color: #fff;
                border-color: #FF4040;
              }

              .confirm-take {
                background-color: #fff;
                color: #FF773A;
                border-color: #FF773A;
              }
            }
          }

          .qr-code {
            height: .6rem;
            display: flex;
            justify-content: space-between;
            align-items: center;

            img {
              width: .45rem;
              height: .45rem;
            }

            .code-text {
              color: #999999;
              font-size: .12rem;

              img {
                width: .16rem;
                height: .16rem;
                vertical-align: middle;
                margin-left: .05rem;
              }
            }
          }
        }
      }
    }
  }
</style>
