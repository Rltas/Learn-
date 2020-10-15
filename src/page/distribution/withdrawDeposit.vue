<template>
  <div id="withdraw-deposit">
    <header>
      <div class="header-left">
        <img src="../../common/images/withdraw/circle.png" alt="">
        <span>提现金额</span>
      </div>
      <div class="header-right">
        ￥{{depositMoney}}
      </div>
    </header>
    <div class="obstruct">
      选择提现方式
    </div>
    <div id="handle">
      <div class="handle-info" v-for="(item,index) in handleList" :key="index" @click="choosePay(index)">
        <div class="handle-info-left">
          <img :src="item.img" alt="">
          <span>{{item.title}}</span>
        </div>
        <img src="../../common/images/withdraw/right.png" alt="" style="width:18px;height:18px">
      </div>
    </div>
    <van-Popup v-model="alipayShow" position="bottom">
      <div class="popup-title">
        <span>支付宝收款码</span>
        <img src="../../common/images/withdraw/delete.png" alt="" @click="closeAlipay(payWay)">
      </div>
      <div v-if="alipayImgShow">
        <div class="upload-contain">
          <div class="upload-flag" @click="uploadServer">
            <img src="../../common/images/withdraw/upload.png" alt="">
            <span>点击上传</span>
          </div>
        </div>
        <div class="handle-hint">
          如何获取支付宝收款码？
        </div>
        <div class="step-show">
          <div class="step-show-left">
            <div class="show-left-left">
              1、
            </div>
            <div class="show-left-right">
              <span>打开支付宝，点击收钱</span>
              <img src="../../common/images/withdraw/alipay-one.png" alt="">
            </div>
          </div>
          <div class="step-show-left">
            <div class="show-left-left">
              2、
            </div>
            <div class="show-left-right">
              <span>在收钱页面点击保存图片</span>
              <img src="../../common/images/withdraw/alipay-two.png" alt="">
            </div>
          </div>
        </div>
      </div>
      <div v-else>
        <img :src="alipayApplyImg" alt="" class="pay-img">
        <div class="upload-again" @click="uploadServer">重新上传收款码</div>
        <div class="apply-for" @click="applyDeposit">申请提现</div>
      </div>
    </van-Popup>
    <!-- 支付宝 -->
    <van-Popup v-model="wechatShow"  position="bottom">
      <div class="popup-title">
        <span>微信收款码</span>
        <img src="../../common/images/withdraw/delete.png" alt="" @click="closeAlipay(payWay)">
      </div>
      <div v-if="wechatImgShow">
        <div class="upload-contain">
          <div class="upload-flag" @click="uploadServer">
            <img src="../../common/images/withdraw/upload.png" alt="">
            <span>点击上传</span>
          </div>
        </div>
        <div class="handle-hint">
          如何获取微信收款码？
        </div>
        <div class="step-show">
          <div class="step-show-left">
            <div class="show-left-left">
              1、
            </div>
            <div class="show-left-right">
              <span>打开微信，点击收付款</span>
              <img src="../../common/images/withdraw/wechat-one.png" alt="">
            </div>
          </div>
          <div class="step-show-left">
            <div class="show-left-left">
              2、
            </div>
            <div class="show-left-right">
              <span>在收款页点击保存收款码</span>
              <img src="../../common/images/withdraw/wechat-two.png" alt="">
            </div>
          </div>
        </div>
      </div>
      <div v-else>
        <img :src="wecahtApplyImg" alt="" class="pay-img">
        <div class="upload-again" @click="uploadServer">重新上传收款码</div>
        <div class="apply-for" @click="applyDeposit">申请提现</div>
      </div>
    </van-Popup>
    <!-- 微信 -->
  </div>
</template>
<script>
  export default {
    data() {
      return {
        handleList: [{
          img: require('../../common/images/withdraw/alipay.png'),
          title: '支付宝'
        }, {
          img: require('../../common/images/withdraw/WeChat.png'),
          title: '微信'
        }],
        alipayShow: false,
        payWay: 0,
        wechatShow: false,
        alipayImgShow: true, //支付宝二维码显示
        wechatImgShow: true,
        wecahtApplyImg: '', //微信二维码图片
        alipayApplyImg: '', //支付宝二维码图片
        depositMoney: 0, //提现金额
      }
    },
    created() {
      if (localStorage.getItem('depositMoney')) {
        this.depositMoney = localStorage.getItem('depositMoney')
      }
      this.api.post('getLoginState').then(res => {
        let profitPay = res.obj.profitPay
        if (!profitPay) {
          this.alipayImgShow = true
          this.wechatImgShow = true
        } else {
          profitPay.map((item, index) => {
            if (item.payType == 1) {
              this.alipayImgShow = false
              this.alipayApplyImg = item.payNo
            }
            if (item.payType == 2) {
              this.wechatImgShow = false
              this.wecahtApplyImg = item.payNo
            }
          })
        }
      })
      var url = location.href.split('#')[0];
      this.api.post('getShareParmars', {
        url: url,
        id: ""
      }).then(res => {
        wx.config({
          debug: false, ////生产环境需要关闭debug模式
          appId: res.config_appid, //appId通过微信服务号后台查看
          timestamp: res.config_timestamp, //生成签名的时间戳
          nonceStr: res.config_nonceStr, //生成签名的随机字符串
          signature: res.config_sign, //签名
          jsApiList: [
            'chooseImage',
            'uploadImage'
          ] // 必填，需要使用的JS接口列表
        });
      })
    },
    methods: {
      choosePay(val) {
        this.payWay = val
        if (val == 0) {
          this.alipayShow = true
        } else {
          this.wechatShow = true
        }
      },
      closeAlipay(val) {
        if (val == 0) {
          this.alipayShow = false
        } else {
          this.wechatShow = false
        }
      },
      uploadServer() {
        const _this = this
        wx.chooseImage({
          count: 1, // 默认9，1-9张
          sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
          sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
          success: function (res) {
            var localIds = res.localIds;
            wx.uploadImage({
              localId: '' + localIds + '', // 需要上传的图片的本地ID，由chooseImage接口获得
              isShowProgressTips: 1, // 默认为1，显示进度提示
              success: function (res) {
                var serverId = res.serverId; // 返回图片的服务器端ID
                var params = {
                  payType: _this.payWay + 1,
                  mediaId: serverId
                }
                _this.api.post('uploadPic', params).then(res => {
                  if (_this.payWay == 1) {
                    _this.wecahtApplyImg = res.obj;
                    _this.wechatImgShow = false
                  } else {
                    _this.alipayImgShow = false
                    _this.alipayApplyImg = res.obj
                  }
                  this.$toast('上传文件成功')
                })
              },
              fail: function (res) {
                this.$toast('上传文件失败')
              }
            })
          },
          fail: function (res) {
            this.$toast('选取文件失败')
          }
        });
      },
      applyDeposit() {
        let data = {
          payType: this.payWay + 1,
          applyTotal: this.depositMoney
        }
        this.api.post('applyProfit', data).then(res => {
          if (res.code == 200) {
            this.$toast('申请成功')
            this.alipayShow = false
            this.wechatShow = false
            this.depositMoney = 0
            localStorage.removeItem('depositMoney')
          } else {
            this.$toast(res.message)
          }
        })
      }
    }
  }
</script>
<style lang="less" scoped>
  #withdraw-deposit {

    header {
      width: 100%;
      height: 1rem;
      background: #ffffff;
      padding: 0 .32rem 0 .16rem;
      box-sizing: border-box;
      display: flex;
      justify-content: space-between;
      align-items: center;

      .header-left {
        display: flex;
        align-items: center;

        img {
          width: .16rem;
          height: .16rem;
          margin-right: .08rem;
        }

        span {
          font-size: .14rem;
          color: #000;
          font-weight: 600
        }
      }

      .header-right {
        font-size: .24rem;
        color: #FF773A;
        font-weight: bold
      }
    }

    .obstruct {
      height: .65rem;
      padding-left: .24rem;
      box-sizing: border-box;
      font-size: .14rem;
      color: #333333;
      padding-top: .32rem;
    }

    #handle {
      height: 1rem;
      background: #fff;
      padding: 0 2%;

      .handle-info {
        width: 100%;
        height: .5rem;
        padding: 0 .16rem;
        box-sizing: border-box;
        display: flex;
        justify-content: space-between;
        align-items: center;

        &:first-child {
          border-bottom: .01rem solid #E5E5E5
        }

        .handle-info-left {
          display: flex;
          align-items: center;

          img {
            width: .24rem;
            height: .24rem;
          }

          span {
            color: #333;
            font-size: .14rem;
            margin-left: .08rem;
          }
        }
      }

    }

    .popup-title {
      width: 96%;
      height: .5rem;
      margin: 0 auto;
      border-bottom: .01rem solid #E5E5E5;
      box-sizing: border-box;
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 0 .08rem;
      font-size: .14rem;
      color: #000;
      font-weight: bold;

      img {
        width: .16rem;
        height: .16rem;
      }
    }

    .upload-contain {
      width: 96%;
      margin: .06rem 2% .16rem;
      height: .86rem;
      border: .01rem dashed #E5E5E5;
      box-sizing: border-box;
      border-radius: .08rem;
      display: flex;
      justify-content: center;
      align-items: center
    }

    .upload-flag {
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      color: #999999;
      font-size: .14rem;

      img {
        width: .34rem;
        height: .34rem;
      }
    }

    .handle-hint {
      color: #000;
      font-size: .14rem;
      text-indent: .16rem;
      margin-bottom: .06rem;
    }

    .step-show {
      width: 100%;
      padding: 0 .08rem .26rem;
      box-sizing: border-box;
      display: flex;
      font-size: .14rem;
      color: #000;
      justify-content: space-between;

      img {
        width: 1.3rem;
        height: 2.33rem;
      }
    }

    .step-show-left {
      display: flex
    }

    .show-left-right {
      display: flex;
      flex-direction: column
    }

    .pay-img {
      display: block;
      width: 2.1rem;
      height: 3.15rem;
      margin: .08rem auto
    }

    .upload-again {
      color: #009DFF;
      font-size: .14rem;
      font-weight: 400;
      text-align: center
    }

    .apply-for {
      width: 2.1rem;
      height: .36rem;
      background: #59D850;
      border-radius: .04rem;
      text-align: center;
      line-height: .36rem;
      color: #fff;
      margin: .16rem auto;
      font-size: .16rem;
    }
  }
</style>
