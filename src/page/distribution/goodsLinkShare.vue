<template>
  <div>
    <van-popup v-model="showShareCard" @close='onClose' max-height='75%' position="bottom">
      <div class="share-card-wraper" v-if="pushMoney!=0">
        <div class="share-title">
          <h2>分享后预计可得佣金<span>￥{{Number(pushMoney).toFixed(2)}}</span></h2>
          <i class="close" @click="onClose"></i>
        </div>
        <div>
          <div class="share-discribe">
            <p>朋友通过你分享的页面成功购买后，你可获得对应的佣金。</p>
            <p>佣金可到<span @click="handleToCenter"> &gt;我的-分销中心&lt; </span>查看 </p>
          </div>
          <div class="pic-code" ref="picCode">
            <div class="pic-box">
              <img :src="imgUrl" alt="">
              <span class="price-bage">￥{{Number(goodsPrice).toFixed(2)}}</span>
            </div>
            <p class="goods-name">{{goodsName}}</p>
            <div class="qrcode">
              <div class="text">
                <p>扫码下单</p>
                <p>长按识别二维码</p>
              </div>
              <qrcode class="img" :size="60" :value="qrCodeUrl" type="img"></qrcode>
            </div>
          </div>
          <div class="btn">
            <van-button type="primary" @click.native="savePhoto">生成海报</van-button>
          </div>
        </div>
      </div>
    </van-popup>
  </div>
</template>
<script>
  import {
    Qrcode
  } from 'vux';
  import {
    baseUrl
  } from "api/config";
  import html2canvas from 'html2canvas'
  export default {
    components: {
      Qrcode
    },
    props: {
      showShareCard: {
        type: Boolean,
        default: false
      },
      data: {
        type: Object,
        default: () => {
          return {}
        }
      }
    },
    data() {
      return {
        userId: '',
        goodsid: '',
        goodsName: '',
        goodsPrice: 0,
        specPropertyIds: '',
        imgUrl: '',
        qrCodeUrl: '', //二维码地址
        pushMoney: 0, //提成金额
        dataURL: '',
      }
    },
    watch: {
      data: {
        handler(val) {
          if (val) {
            this.goodsid = val.goodsid;
            this.goodsName = val.goodsName;
            this.specPropertyIds = val.specPropertyIds;
            this.goodsPrice = val.price;
            this.imgUrl = val.goodsImgArr[0].src_big;
            this.userId = JSON.parse(localStorage.userInfo).obj.user.id;
            this.qrCodeUrl = `${baseUrl}/wap/interIndex.htm#/redirect?goodsid=${this.goodsid}&userId=${this.userId}`;
            this.getGoodsShareDetail();
          }
        },
        deep: true
      }
    },
    methods: {
      onClose() {
        this.$parent.closeShareBox();
      },
      getGoodsShareDetail() {
        let p = {
          goodsid: this.goodsid,
          specPropertyIds: this.specPropertyIds
        }
        this.api.post('goodsShare', p).then(res => {
          if (res.code == 200) {
            this.pushMoney = res.obj;
          }
        })
      },
      handleToCenter() {
        this.$router.push('/distributionCenter');
      },
      savePhoto() {
        window.scrollTo(0, 0);
         html2canvas(this.$refs.picCode, {
          useCORS: true, //保证跨域图片显示
          backgroundColor: null,
        }).then(canvas => {
          this.dataURL = canvas.toDataURL("image/png");
          this.$toast.loading({
            message: '正在生成',
            duration: 0,
            forbidClick: true
          })
          setTimeout(() => {
            this.$toast.clear()
            localStorage.setItem('canvasImg', this.dataURL)
            this.$router.push({
              path: "/viewsPic"
            }) 
          }, 500)
        })
      }
    }
  }
</script>
<style lang="less" scoped>
  .share-card-wraper {
    min-height: 100%;
    padding: 2.5% 0 2.5%;
    background: #fff;
    text-align: center;
    box-sizing: border-box;

    .share-title {
      text-align: center;
      margin-bottom: 1.2%;
      position: relative;

      h2 {
        font-size: .16rem;

        span {
          color: #FF773A;
        }
      }

      .close {
        position: absolute;
        width: .16rem;
        height: .16rem;
        right: .15rem;
        top: 50%;
        transform: translate(0, -50%);
        background: url('../../common/images/newIndex/code_close.png') no-repeat;
        background-size: .16rem .16rem;
      }
    }

    .share-discribe {
      font-size: .12rem;

      p {
        >span {
          color: #009DFF;
        }
      }
    }

    .pic-code {
      margin: 2% auto;
      width: 62%;
      background: #F6F6F6;
      padding: 3.5% 4% 2.5%;
      box-sizing: border-box;

      .pic-box {
        width: 100%;
        height: 100%;
        padding: 0 4%;
        box-sizing: border-box;
        position: relative;

        >img {
          width: 100%;
          height: 100%;
        }

        .price-bage {
          position: absolute;
          right: 8%;
          bottom: .2rem;
          background: #FF773A;
          color: #fff;
          border-radius: .04rem;
          padding: .02rem .04rem;
        }
      }

      .goods-name {
        font-size: .13rem;
        color: #333;
        text-align: left;
      }

      .qrcode {
        margin-top: 2%;
        display: flex;
        align-items: flex-end;
        justify-content: space-between;

        .text {
          font-size: .13rem;
          color: #999999;
          text-align: left;
        }

        .img {
          width: .6rem;
          height: .6rem;
        }
      }
    }

    .btn {
      width: 62%;
      margin: 0 auto;
      cursor: pointer;
      .weui-btn_primary {
        background: #009DFF;
      }
    }
  }
</style>
