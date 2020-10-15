<template>
	<div class="add-address">
		<!-- <x-header class="vux-1px-b">添加/修改收货地址<a v-show="isAdd == false || isAdd == null  || isAdd == ''" slot="right" style="color:#f0415f" @click="delAddress">删除</a></x-header> -->
		<group label-width="4em" label-margin-right="2em" label-align="right">
			<x-input title="姓名" placeholder="请输入姓名" v-model="name" is-type="china-name" ref="name" required></x-input>
			<x-input title="手机号" placeholder="请输入手机号" v-model="phone" is-type="china-mobile" ref="phone" required></x-input>
			<cell title="收货地址" is-link label-width="4em" label-margin-right="2em" label-align="right" :value="chooseAddress"
				@click.native="addressCs"></cell>
			<x-textarea title="详细地址" placeholder="请填写详细信息" v-model="smallAddress" :show-counter="true" :max="150" :rows="5">
			</x-textarea>
			<x-input title="邮编" placeholder="请输入邮编" v-model="code"></x-input>
		</group>

		<div class="submit">
			<x-button type="primary" @click.native="changeSubmit">提交</x-button>
		</div>

		<!-- 选择收货地址 -->
		<van-popup v-model="showPopup" :close-on-click-overlay="false" class="checker-popup" position="bottom">
			<div style="padding:.1rem; background-color:#fff;">
				<p
					style="padding: .05rem .05rem .05rem .02rem; margin-bottom:.1rem; color:#f0415f; text-align: center; background-color:#f3f3f3;">
					{{chooseAddress}}</p>

				<div class="address-wrap">
					<div class="selcet">
						<p :class="{'disable': item.show == 0}" v-for="(item,index) in addressList1" @click="areaList1(item)">
							<span>{{item.areaName}}</span></p>
					</div>
					<div class="selcet" v-show="sel2">
						<p v-for="(item,index) in addressList2" :value="item.id" @click="areaList2(item)">{{item.areaName}}</p>
					</div>
					<div class="selcet" v-show="sel3">
						<p v-for="(item,index) in addressList3" :value="item.id" @click="areaList3(item)">{{item.areaName}}</p>
					</div>
				</div>

			</div>
		</van-popup>
	</div>
</template>

<script>
	import {
		Group,
		Cell,
		XInput,
		ChinaAddressData,
		XTextarea,
		XButton,
		XSwitch,
	} from 'vux'
	export default {
		props: {
			seller: {
				type: Object
			}
		},
		components: {
			Group,
			Cell,
			XInput,
			XTextarea,
			XButton,
			XSwitch,
		},
		data() {
			return {
				addressData: ChinaAddressData,
				name: '',
				phone: '',
				smallAddress: '',
				bigAddress: '',
				telephone: '',
				code: '',
				addressList1: '',
				addressList2: '',
				addressList3: '',
				disabled: true,
				selectVal: '',
				addressId: '',
				chooseAddress: '111',
				showPopup: false, //控制收货地址
				sel1: false,
				sel2: false,
				sel3: false,
				area_id: '',
				isAdd: false,
				province: ''
			}
		},
		created() {
			this.addressId = localStorage.getItem("addressId")
			this.area_id = localStorage.getItem("area_id")
			this.name = localStorage.getItem("name")
			this.phone = localStorage.getItem("phone")
			this.chooseAddress = localStorage.getItem("bigAddress")
			this.bigAddress = localStorage.getItem("bigAddress")
			this.smallAddress = localStorage.getItem("smallAddress")
			var isAdd = this.getQueryString("add")
			this.isAdd = isAdd
		},
		methods: {
			getQueryStringVar: function (name) {
				var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
				var r = window.location.href.substring(window.location.href.indexOf('?'), window.location.href.length).substr(
					1).match(reg);
				if (r != null) return unescape(r[2]);
				return null;
			},
			addressCs: function () {
				this.showPopup = true
				this.addressList1 = ''
				this.addressList2 = ''
				this.addressList3 = ''
				this.chooseAddress = '请选择收货地址'
				this.$http.post(global.COURSES + "/app/address_area.htm").then(function (res) {
					res = res.body
					this.addressList1 = res.obj
					this.sel3 = false
				}, function () {
					console.log(SEVER)
				});
			},
			areaList1: function (e) {
				const _this = this;
				this.sel2 = false;
				this.sel3 = false;
				if (e.show != 0) {
					var selectId = e.id
					this.province = e.areaName
					this.chooseAddress = e.areaName
					this.$http.post(global.COURSES + "/app/address_area.htm", {
						'id': selectId
					}).then(function (res) {
						res = res.body
						this.addressList2 = res.obj
						this.sel1 = true;
						this.sel2 = true;
						this.sel3 = false;
					}, function () {
						console.log(SEVER)
					});
				}
			},
			areaList2: function (e) {
				this.sel3 = false;
				var selectId = e.id
				let city = e.areaName
				this.chooseAddress = `${this.province},${city}`;
				this.$http.post(global.COURSES + "/app/address_area.htm", {
					'id': selectId
				}).then(function (res) {
					res = res.body
					this.addressList3 = res.obj
					this.sel2 = true
					this.sel3 = true;
				}, function () {
					console.log(SEVER)
				});
			},
			areaList3: function (e) {
				this.area_id = e.id
				this.chooseAddress = this.chooseAddress + '，' + e.areaName
				this.showPopup = false
			},
			changeSubmit: function () {
				if (!this.$refs.name.currentValue || this.$refs.name.currentValue.length < 2 || this.$refs.name.currentValue
					.length > 6) {
					this.$dialog.alert({
						title: '提示',
						message: '请输入正确的姓名'
					}).then(() => {
						return
					})
					return
				}

				if (!this.$refs.phone.currentValue || !this.$refs.phone.valid) {
					this.$dialog.alert({
						title: '提示',
						message: '请输入正确的手机号码'
					}).then(() => {
						return
					})
					return
				}

				if (!this.chooseAddress) {
					this.$dialog.alert({
						title: '提示',
						message: '请选择收货地址'
					}).then(() => {
						return
					})
					return
				}

				if (!this.smallAddress) {
					this.$dialog.alert({
						title: '提示',
						message: '请填写详细的收货地址'
					}).then(() => {
						return
					})
					return
				}

				if (this.isAdd == 'true') {
					// 创建收货地址
					this.$http.post(global.COURSES + "/app/buyer/address_add_update.htm", {
						'area_id': this.area_id,
						'trueName': this.name,
						'area_info': this.smallAddress,
						'mobile': this.phone,
						'telephone': this.telephone,
						'zip': this.code
					}).then(function (res) {
						this.$router.go(-1)
					}, function () {
						console.log('error')
					});
				} else {
					// 修改收货地址
					this.$http.post(global.COURSES + "/app/buyer/address_add_update.htm", {
						'id': this.addressId,
						'area_id': this.area_id,
						'trueName': this.name,
						'area_info': this.smallAddress,
						'mobile': this.phone,
						'telephone': this.telephone,
						'zip': this.code
					}).then(function (res) {
						this.$dialog.alert({
							title: '提示',
							message: '地址修改成功'
						}).then(() => {
							this.$router.go(-1)
						})
					}, function () {
						console.log('error')
					});
				}


			},
			delAddress: function () {
				this.$http.post(global.COURSES + "/app/buyer/address_del.htm", {
					'mulitId': this.addressId
				}).then(function (res) {
					this.$router.go(-1)
				}, function () {
					console.log('error')
				});
			}
		}

	}
</script>

<style lang="less">
	@red: #f0415f;
	@main: #1fbba6;

	.add-address {
		background-color: #f0f4f5;

		// padding-top: 46px;
		.submit {
			margin: .1rem;

			.weui-btn_primary {
				background-color: #FF773A;
			}
		}

	}

	.address-wrap {
		overflow: hidden;

		.disable {
			color: #999;
		}
	}

	.weui-cell__ft {
		color: #000;
	}

	.selcet {
		height: 2rem;
		width: 30%;
		overflow: scroll;
		font-size: .14rem;
		line-height: .4rem;
		text-align: center;
		float: left;
	}

	.selcet_active {
		color: #1fbba6;
	}
</style>
