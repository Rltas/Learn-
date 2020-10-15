<template>
	<div class="address">
		<div class="maincon" style="padding-bottom:54px; height: 100%">

      <Scroll
				style="over-flow: hidden; height: 100%"
				:data="data"
			>
        <div>
          <!-- 添加收货地址 -->
            <van-cell title="新增收货地址" @click="addAddress" is-link style="font-size:0.16rem"></van-cell>

          <!-- 收货地址 -->
          <div class="addr-sheet section" v-for="(item,index) in data">
            <a class="addr-txt">
              <div class="left vux-1px-b" @click="chooseAddress(item,index)">

                <span class="name cell">
                  <i class="ion-person icon"></i>
                  {{item.trueName}}
                </span>

                <span class="phone cell">
                  <i class="ion-iphone icon"></i>
                  {{item.mobile}}
                </span>

                <p>
                  <i class="ion-location icon"></i>
                  <span v-if="item.show == 0" style="color: red">[不可用] </span>{{item.area + item.area_info}}
                </p>

              </div>

              <div class="bottom">
                <span @click="amendAddress(index)"><i class="ion-compose icon"></i>修改</span>
                <span @click="deleteAddress(item.id)"><i class="ion-trash-a icon"></i>删除</span>
              </div>
            </a>
          </div>
        </div>

      </Scroll>
		</div>


    <!-- 提示 -->
	</div>
</template>

<script>
import Scroll from "base/scroll"
export default {
  components: {
    Scroll
  },
  data() {
    return {
      data: [],
      fromPay: false, // 是否从支付过来
      deleteId: '', //要删除的地址id
    };
  },
  created() {
    this.fromPay = this.getQueryString("fromPay")
    this._getAddressList()
    this.listenScroll = true
		this.probeType = 3
  },
  methods: {
    _getAddressList: function() {
		const _this = this
		this.$toast.loading({
      duration: 0,
      forbidClick: true,
      message: '加载中'
    })
		this.api.post("getAddressList").then(res => {
			_this.data = res.obj.addressList
			this.$toast.clear()
		})
    },
	deleteAddress: function(id) {
    this.deleteId = id
    this.$dialog.confirm({
      title: '提示',
      message: '确定要删除此收货地址吗？'
    }).then(() => {
      this.$toast.loading({
        duration: 0,
        forbidClick: true,
        message: '正在删除'
      })
      this.api.post("deleteAddress", { 'mulitId': this.deleteId }).then(res => {
        this._getAddressList()
        this.$toast.clear()
      })
    }).catch((value) => {
      
    })
	},
    amendAddress: function(index) {
		var data = this.data[index]
		// localStorage.setItem("addressData", JSON.stringify(data))
		localStorage.setItem("name", data.trueName) //存储姓名
		localStorage.setItem("phone", data.mobile) //电话
		localStorage.setItem("bigAddress", data.area) //大地址名称
		localStorage.setItem("bigAddressId", data.area_id) //大地址id
		localStorage.setItem("smallAddress", data.area_info) //小地址
    localStorage.setItem("addressId", data.id) //地址id
    localStorage.setItem("area_id", data.area_id) //地址id

		this.$router.push({ name: "amendAddress", query: { id: data.id } })
    },
    addAddress: function() {
      localStorage.removeItem("name")
      localStorage.removeItem("addressData")
      localStorage.removeItem("phone")
      localStorage.removeItem("bigAddress")
      localStorage.removeItem("bigAddressId")
      localStorage.removeItem("smallAddress")
      localStorage.removeItem("area")
      localStorage.removeItem("area_id")
      this.$router.push({ name: "amendAddress", query: { add: true } })
    },
    chooseAddress: function(e, index) {
      if(e.show == 0) {
        this.$dialog.alert({
          title: '提示',
          message: e.msg
        })
        return
      }
      else if (this.fromPay == "true") {
        localStorage.setItem("addressId", e.id); //地址id
        localStorage.setItem("addressIndex", index); //地址索引
        this.$router.go(-1);
      }
    }
  }
};
</script>

<style lang="less">
@import "../../common/css/variable.less";
.address {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: .5rem ;
  .addr-sheet {
    display: block;
    line-height: 1.4;
    font-size: .14rem;
    background-color: #fff;
    margin: .1rem 0;
    .icon {
      font-size: .16rem;
    }
    .addr-txt {
      position: flex;
      display: block;
      padding: .1rem .15rem 0;
      color: #333;
      overflow: hidden;
      .left {
        width: 100%;
        padding-bottom: .1rem;
        overflow: hidden;
        .person {
          padding-top: .04rem 0 .1rem;
        }
        .cell {
          display: inline-block;
          padding-bottom: .08rem;
          width: 40%;
          font-size: .16rem;
        }
        .phone {
          float: right;
          padding-right: .1rem;
          text-align: right;
        }
        .default {
          background-color: @main;
          font-size: .12rem;
          padding: .02rem .04rem;
          margin-right: .04rem;
          border-radius: .02rem;
          color: #fff;
        }
        .icon {
          color: @supportIconColor;
        }
      }
      .bottom {
        span {
          float: right;
          padding: .1rem .2rem;
          display: inline-block;
          text-align: center;
          i {
            color: @supportIconColor;
            padding: 0 .04rem;
          }
        }
      }
    }
  }
}
</style>
