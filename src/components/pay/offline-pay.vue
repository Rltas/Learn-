<template>
  <div class="offline-pay-box">
    <div class="offline-pay">
      <h2 style="text-align:center;margin-bottom:.15rem;white-space:nowrap;">请付款给收银员，并出示二维码</h2>
      <div class="pay-detail">
        <div class="content">
          <div class="pay-info">
            <p>商品总价：<span>￥{{(Number(price) - Number(shipMoney)).toFixed(2)}}</span></p>
            <p>运费：<span>￥{{Number(shipMoney).toFixed(2)}}</span></p>
            <p>幸运值抵扣：<span>￥-{{Number(luckyValue).toFixed(2)}}</span></p>
            <p>应付：<span>￥{{Number(payMoney).toFixed(2)}}</span></p>
            <p>下单时间：{{time}}</p>
          </div>
          <div class="qr-code">
            <qrcode class="code-img" :size='117' :value="codeUrl" type="img"></qrcode>
            <p class="text">订单识别码</p>
          </div>
        </div>
        <div class="btn">
          <button @click="handleOrderList">查看订单</button>
          <button @click="handleBackHome">返回首页</button>
        </div>
      </div>
      <div class="pay-explain">
        <h2>线下付款使用说明</h2>
        <div class="step1">
          <div class="explain1">
            <p>1、找到最近的渝教科贸授权的线下收款点</p>
            <p class="link"><a @click.stop="handleShowAll">全部收款点>></a></p>
          </div>
          <div class="pic1">
            <img src="../../common/images/newIndex/code1.png" alt="">
          </div>
        </div>
        <div class="step2">
          <div class="pic2">
            <img src="../../common/images/newIndex/code2.png" alt="">
          </div>
          <div class="explain2">
            <p>2、向收银员出示订单识别二维码，并线下付款给收银员，收银员扫描订单识别码确认已收款，查看订单状态变为已付款</p>
          </div>
        </div>
      </div>
    </div>
    <van-popup v-model="isShow" position="bottom"   :style="{ height: '30%',background: '#fff' }">
      <group>
        <cell v-for="(item,index) in outLineAdressList" :key="index" :title="item.orgName+' , '+item.addressDesc"></cell>
      </group>
    </van-popup>
  </div>
</template>
<script>
import { Qrcode, Group, Cell, XButton,  } from 'vux';
export default {
  components:{
    Qrcode,
    Group,
    Cell,
    XButton
  },
  data(){
    return{
      id:'',
      shipMoney:0,//运费
      luckyValue:0,//幸运值抵扣
      price: 0, //订单金额（商品总价）
      payMoney:0,//应付价格
      time:'', //下单时间
      codeUrl:'', //二维码地址
      timer:null,
      isShow:false, //全部收款点
      outLineAdressList:[] //线下收款地址
    }
  },
  created(){
    this.id = this.$route.query.id;
    this.shipMoney = this.$route.query.shipMoney;
    this.luckyValue = this.$route.query.luckyValue;
    this.payMoney = this.$route.query.payMoney;
    this.price = this.$route.query.price;
    this.time = this.$route.query.orderTime;
    this.codeUrl = global.COURSES + '/wap/outline_index.htm#/confirmreceipt?id=' + this.id;
    this.timer = setInterval(this.getOrderDetail,5000);
  },
  beforeRouteLeave(to,from,next){
    clearInterval(this.timer);
    this.timer = null;
    next();
  },
  methods:{
    handleOrderList(){
      this.$router.push({
        path:'/orders',
        query:{
          type:0
        }
      })
    },
    handleBackHome(){
      this.$router.push({
        path:'/'
      })
    },
    getOrderDetail(){
      this.api.post('getOrderState',{ 'id':this.id }).then(res=>{
        if(res.obj != 10){
          clearInterval(this.timer);
          this.timer = null;
          this.$router.push({
            path:'/orders',
            query:{
              type:0
            }
          })
        }
      })
    },
    handleShowAll(){
      this.api.post('outLineAdress').then(res=>{
        if(res.code == 200){
          this.outLineAdressList = res.obj;
          this.isShow = true;
        }
      })
    }
  }
}
</script>
<style lang="less" scoped>
  .offline-pay{
    position: fixed;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    z-index: 100;
    padding: .14rem .15rem;
    background: #fff;
    box-sizing: border-box;
    font-size: .14rem;
    color: #333;
    overflow-y:auto;
    .pay-detail{
      border-top:.01rem dashed #F5667B;
      border-bottom:.01rem dashed #F5667B;
      padding: .15rem 0;
      .content{
        display: flex;
        justify-content: space-between;
        .pay-info{
          p{
            margin-bottom: .1rem;
          }
          p:nth-child(4){
            span{
              color:#F5667B;
              font-size: .2rem;
              vertical-align: middle;
            }
          }
          p:last-child{
            margin-bottom: 0px;
          }
        }
        .qr-code{
          min-width: 1.17rem;
          text-align: center;
          .code-img{
            width: 1.17rem;
            height: 1.17rem;
          }
          .text{
            font-size: .1rem;
            color:#666;
          }
        }
      }
      .btn{
        margin-top: .29rem;
        text-align: center;
        button{
          width: .8rem;
          height: .26rem;
          border: none;
          outline: none;
          background: #F5667B;
          color: #fff;
          text-align: center;
          line-height: .26rem;
        }
        button:first-child{
          margin-right: .55rem;
        }
      }
    }
    .pay-explain{
      padding-top: .18rem;
      h2{
        color: #F5667B;
        font-weight: bold;
        margin-bottom: .15rem;
      }
      .step1,.step2{
        display: flex;
        justify-content: space-between;
        font-size: .13rem;
        img{
          width: 100%;
          height: 100%;
        }
      }
      .step1{
        .explain1{
          width: 1.4rem;
          .link{
            margin-top: .15rem;
            a{
              color: #6593E4;
              font-size: .12rem;
            }
          }
        }
        .pic1{
          width: 1.23rem;
          height: 1.54rem;
          vertical-align: top;
        }
      }
      .step2{
        margin-top: .15rem;
        .explain2{
          width: 1.71rem;
        }
        .pic2{
          width:1.36rem;
          height: 1.06rem;
        }
      }
    }
  }
</style>


