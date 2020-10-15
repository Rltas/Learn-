<template>
  <div class="wrapper">
    <div class="main">
      <div class="main-top">
        <span class="top-word">手机号</span>
        <input placeholder="请输入您的手机号" class="top-input" v-model="phoneNum" maxlength="11" />
      </div>
      <div class="main-bottom">
        <span class="bottom-word">验证码</span>
        <input placeholder="请输入验证码" class="bottom-input" v-model="identifyingCode" maxlength="6" />
        <span class="btn" @click="getVerifyCode" v-if="getCode">获取验证码</span>
        <span class="btn disabledBtn" v-else>{{count}}s后重试</span>
      </div>
    </div>

    <div class="radio-wrapper" v-show="pickShow">
      <input type="radio" id="one" value="0" v-model="picked" />
      <label for="one" class="marginR">家长登录</label>
      <input type="radio" id="two" value="1" v-model="picked" />
      <label for="two" class="marginR">教师登录</label>
    </div>

    <p class="remind">
      <span v-show="show">*请输入正确的验证码</span>
    </p>
    <button @click="bindingMobile" v-if="submitState">提交</button>
    <button v-else class="disBtn">提交</button>
    <div class="footer-fixed">
      <input type="checkbox" v-model="checkedService" style="margin-right:.05rem;">
      <p>
        <label>已阅读并同意渝教商城</label>
        <span @click="serviceAgreement" class="link-text">服务协议</span>
      </p>
    </div>

    <!--服务协议-->
    <ServiceAgreement :isShowService="isShowService" @closePopup="closePopup" :content="content">
    </ServiceAgreement>
  </div>
</template>
<script>
  import {
    getQueryString
  } from 'js/mixin.js'
  import {
    baseUrl,
    wxUrl
  } from 'api/config.js'
  import {
    getWxToken
  } from "../../api/getData.js"
  import ServiceAgreement from '../../base/serviceAgreement.vue';
  export default {
    components: {
      ServiceAgreement
    },
    data() {
      return {
        phoneNum: '',
        codeNum: '',
        identifyingCode: '',
        role: "0",
        show: false,
        url: '',
        picked: '',
        pickShow: false,
        phoneNumShow: false, //正确输入手机号
        codeNumShow: false, //正确输入验证码
        doubleRole: false, //是否双重角色
        count: 60, //验证码时间
        getCode: true, //获取验证码
        isShowService: false,
        checkedService: true,
        content: ''
      }
    },
    computed: {
      submitState() {
        let reg = /^1[3456789]\d{9}$/
        if(reg.test(this.phoneNum) && this.identifyingCode && this.checkedService) {
          return true
        } else {
          return false
        }
      }
    },
    mounted() {
      this.url = this.getQueryString('url')
      if(this.getQueryString('supplierid')) {
        localStorage.setItem('outLineId', this.getQueryString('supplierid'))
      }
    },
    watch: {
      identifyingCode: {
        handler(val) {
          if (val.length == 6) {
            if (this.codeNum !== val) {
              this.show = true
              this.pickShow = false
              this.codeNumShow = false
              return
            } else {
              this.show = false
              this.api.post('getRoleByMobile', {
                mobile: this.phoneNum
              }).then((res) => {
                let arr = [...new Set(res.obj)].sort()
                if (arr.length > 1) {
                  this.pickShow = true
                  this.doubleRole = true
                } else {
                  this.pickShow = false
                  this.doubleRole = false
                  this.role = res.obj[0]
                }
                this.codeNumShow = true
              })
            }
          } else {
            this.codeNumShow = false
          }
        },
        immediate: true,
        deep: true
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
    methods: {
      getVerifyCode() { //获取验证码
        let reg = /^1[3456789]\d{9}$/
        if (this.phoneNum == "" || !reg.test(this.phoneNum)) {
          this.$toast('请输入正确的手机号码!')
          this.phoneNumShow = false
          return
        } else {
          this.phoneNumShow = true
        }
        let self = this;
        //给验证码获取按钮设置延迟时间为60s
        if (self.phoneNumShow) {
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
            mobile: self.phoneNum
          }).then((res) => {
            self.codeNum = res.obj;
            // self.identifyingCode = self.codeNum //上正式注释这里
          })
        }
      },
      bindingMobile() {
        let _this = this;
        if (_this.codeNumShow && _this.phoneNumShow) {
          if (_this.picked === '' && _this.doubleRole == true) {
            this.$toast('请选择登录身份!')
            return
          }
          let data = {
            mobile: _this.phoneNum,
            verifyCode: _this.identifyingCode,
            role: _this.picked == '' ? _this.role : _this.picked,
            type: 2 //生活超市
          }
          _this.api.post('weChatBindFinish', data).then((res) => {
            // getWxToken();
             if (res.toString().indexOf("DOCTYPE") != -1) {
              this.$router.push(`/${this.url ? this.url : ""}`);
            } else {
              this.$toast(res.message)
            }

            // _this.api.post("getToken").then(res=>{
            //   if(res.code == 200){
            //     $.ajax({
            //       url: `${wxUrl}/shopVerify`,
            //       type: "GET",
            //       data:{token:res.obj},
            //       dataType: "jsonp", //指定服务器返回的数据类型
            //         jsonpCallback: "verify",  //必须该名称
            //       success: (data)=> {
            //         console.log(data)
            //       },
            //       error: (res)=> {
            //         console.log(res)
            //       }
            //     });
            //   }
            // })
          })
        } else {
          this.$toast('请输入正确信息！')
        }
      },
      //服务协议
      serviceAgreement() {
        this.isShowService = true;
        if (!this.content) {
          this.getServiceAgreement();
        }
      },
      getServiceAgreement() {
        this.api.post('serviceAgreement').then(res => {
          this.content = res.obj;
        })
      },
      closePopup() {
        this.isShowService = false;
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

    .main-top {
      display: flex;
      height: .64rem;
      background-color: #fff;
      font-size: .16rem;
      margin-top: .08rem;
      margin-bottom: .01rem;

      .top-word {
        width: 1.18rem;
        line-height: .64rem;
        text-align: center;
      }

      input::-webkit-input-placeholder {
        color: #C8C8C8;
      }

      .top-input {
        flex: 1;
        border: none;
        font-size: .16rem;
        outline: none;
      }
    }

    .main-bottom {
      position: relative;
      display: flex;
      height: .64rem;
      background-color: #fff;
      font-size: .16rem;

      .bottom-word {
        width: 1.18rem;
        line-height: .64rem;
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
        top: .14rem;
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
      margin: .25rem 0 0 .32rem;
      font-family: MicrosoftYaHei;
      height: .2rem;
      width: 100%;
    }

    .radio-wrapper {
      margin: .23rem 0 0 .27rem;
      font-size: .16rem;
      height: .3rem;

      .marginR {
        margin-right: .45rem;
        vertical-align: middle;
      }

      #one,
      #two {
        width: .2rem;
        height: .2rem;
        vertical-align: middle
      }
    }

    .bottom {
      margin: 1.18rem .16rem 0 .16rem;
      height: .43rem;
      line-height: .43rem;
      text-align: center;
      font-size: .18rem;

      .weui-btn_default {
        background: #FF773A;
        color: #fff;
      }

      .weui-btn_disabled.weui-btn_default {
        opacity: 0.3;
      }
    }

    .footer-fixed {
      position: absolute;
      bottom: .1rem;
      left: 0;
      width: 100%;
      display: flex;
      justify-content: center;
      align-items: center;
      font-size: .13rem;

      .link-text {
        color: #02B6EF;
      }
    }
  }
</style>
