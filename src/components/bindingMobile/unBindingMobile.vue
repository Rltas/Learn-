<template>
  <div class="wrapper">
    <div class="main">
      <p class="title">将给您{{phoneNumber.substring(0,3)}}****{{phoneNumber.substring(7)}}的手机号发送验证码</p>
      <div class="main-bottom">
        <span class="bottom-word">验证码</span>
        <input placeholder="请输入验证码" class="bottom-input" v-model="identifyingCode" maxlength="6" />
        <span class="btn" @click="getVerifyCode" v-if="getCode">获取验证码</span>
        <span class="btn disabledBtn" v-else>{{count}}s后重试</span>
      </div>
    </div>
    <p class="remind">
      <span v-show="show">*请输入正确的验证码</span>
    </p>
    <button @click="logout" v-if="codeNumShow">提交</button>
    <button v-else class="disBtn">提交</button>

  </div>
</template>
<script>
  import {
    Toast
  } from 'vux'
  import {
    mapState
  } from 'vuex'
  import {
    baseUrl
  } from 'api/config'
  export default {
    data() {
      return {
        phoneNum: '',
        codeNum: '',
        identifyingCode: '',
        role: 0,
        show: false,
        phoneNumber: "",
        codeNumShow: false, //验证码是否输入正确
        count: 60, //验证码时间
        getCode: true //获取验证码
      }
    },
    watch: {
      identifyingCode: {
        handler(val) {
          if (val.length == 6) {
            if (val == this.codeNum) {
              this.codeNumShow = true
              this.show = false
            } else {
              this.codeNumShow = false
              this.show = true
            }
          } else {
            this.codeNumShow = false
            this.show = true
          }
        }
      },
      show: {
        handler(val) {
          if (val) {
            this.misErrMsg()
          }
        },
        immediate: true,
        deep: true
      }
    },
    mounted() {
      this.getLoginState()
    },
    methods: {
      getLoginState() {
        this.api.post('getLoginState').then((res) => {
          this.phoneNumber = res.obj.user.mobile
        })
      },
      getVerifyCode() {
        let self = this;
        //给验证码获取按钮设置延迟时间为60s
        self.getCode = false;
        let timer = setInterval(() => {
          self.count--;
          if (self.count <= 0) {
            clearInterval(timer);
            timer = null;
            self.count = 60;
            self.getCode = true;
          }
        }, 1000);
        self.api.post('getVerifyCode', {
          mobile: self.phoneNumber
        }).then((res) => {
          let _this = self;
          _this.codeNum = res.obj;
          // _this.identifyingCode = self.codeNum  //上正式注释这里
        })
      },
      logout() {
        let _this = this;
        if (_this.codeNumShow) {
          _this.api.post('unBindingMobile', {
            mobile: _this.phoneNumber,
            verifyCode: _this.identifyingCode
          }).then((res) => {
            // alert(res.code)
            window.location.href = `${baseUrl}/shopping_logout.htm?type=2`
          })
        } else {
          this.$toast('验证码输入有误')
        }
      },
      misErrMsg() {
        setTimeout(() => {
          this.show = false;
        }, 2186);
      }
    }
  }
</script>
<style lang="less" scoped>
  .wrapper {
    height: 100%;
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: #EEE;

    button {
      -webkit-appearance: none;
      display: block;
      width: 3rem;
      margin: 0 auto;
      margin-top: 1.18rem;
      height: .43rem;
      background: #FF773A;
      color: #fff;
      font-size: .16rem;
      border-radius: .05rem;
    }

    .disBtn {
      background: #aaa;
    }

    .title {
      color: #8E8E8E;
      font-size: .15rem;
      margin: .23rem 0 .2rem .23rem;
    }

    .main-bottom {
      position: relative;
      display: flex;
      height: .54rem;
      background-color: #fff;
      font-size: .16rem;

      .bottom-word {
        width: 1.18rem;
        line-height: .54rem;
        text-align: center;
      }

      input::-webkit-input-placeholder {
        color: #C8C8C8;
      }

      .bottom-input {
        flex: 1;
        border: none;
        font-size: .16rem;
        outline: none;
      }

      .btn {
        position: absolute;
        right: .1rem;
        top: .09rem;
        height: .36rem;
        line-height: .36rem;
        width: .9rem;
        font-size: .14rem;
        background-color: #fff;
        color: #FF773A;
        text-align: center;
        border-radius: .05rem;
        border: .01rem solid #FF773A;
      }

      .disabledBtn {
        background-color: #fff;
        color: #666666;
        border-color: #999999;
      }
    }

    .remind {
      font-size: .14rem;
      color: #FF773A;
      margin: .18rem 0 0 .32rem;
      font-family: MicrosoftYaHei;
      height: .2rem;
      width: 100%;
    }

    .bottom {
      margin: 1.18rem .16rem 0 .16rem;
      height: .43rem;
      line-height: .43rem;
      text-align: center;
      background: #FF773A;
      font-size: .18rem;
      color: #fff;
      border-radius: .03rem;
    }
  }
</style>
