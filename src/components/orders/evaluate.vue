<template>
	<div class="evaluate">
		<!-- <x-header class="vux-1px-b">评价</x-header> -->

		<group v-for="(item,index) in data.goodsCarDetailList" :key="index">
			<div class="goods-list">
				<div class="goods-img">
					<img width="57" height="57" v-lazy="item.url" alt="...">
				</div>
				<div class="content">
					<span class="name">{{item.name}}</span>
					<!-- <div class="goods-standard">
						<div class="cc-right">
							¥{{item.unitPrice}} x{{item.num}}
						</div>
					</div> -->
					<div v-for="(items,index) of item.specMap" style="font-size:14px;line-height:14px;" :key="index">
						<div>
							<span>{{items.key}}</span>:<span>{{items.value}}</span>
						</div>
					</div>
				</div>
			</div>

			<div class="checker">
				<checker v-model="item.evaluate_val" default-item-class="demo1-item" selected-item-class="demo1-item-selected">
					<checker-item :value="1">{{ ('好评') }}</checker-item>
					<checker-item :value="0">{{ ('中评') }}</checker-item>
					<checker-item :value="-1">{{ ('差评') }}</checker-item>
				</checker>
			</div>


			<cell title="商品与描述相符">
				<div slot="value">
					<!-- <span class="rater-icon ion-android-star" :class="{'rater_icon_activity': index < starColorCon1}" v-for="(item,index) in 5" @click="clickStar(1,index,item)"></span> -->
					<span class="rater-icon ion-android-star" :class="{'rater_icon_activity': 0 < item.value_des}"
						@click="clickStar(1,1,item)"></span>
					<span class="rater-icon ion-android-star" :class="{'rater_icon_activity': 1 < item.value_des}"
						@click="clickStar(1,2,item)"></span>
					<span class="rater-icon ion-android-star" :class="{'rater_icon_activity': 2 < item.value_des}"
						@click="clickStar(1,3,item)"></span>
					<span class="rater-icon ion-android-star" :class="{'rater_icon_activity': 3 < item.value_des}"
						@click="clickStar(1,4,item)"></span>
					<span class="rater-icon ion-android-star" :class="{'rater_icon_activity': 4 < item.value_des}"
						@click="clickStar(1,5,item)"></span>
				</div>
			</cell>
			<cell title="卖家的服务态度">
				<!-- <span class="rater-icon ion-android-star" :class="{'rater_icon_activity': index < starColorCon2}" v-for="(item,index) in 5" @click="clickStar(2,index,item)"></span> -->
				<span class="rater-icon ion-android-star" :class="{'rater_icon_activity': 0 < item.value_ser}"
					@click="clickStar(2,1,item)"></span>
				<span class="rater-icon ion-android-star" :class="{'rater_icon_activity': 1 < item.value_ser}"
					@click="clickStar(2,2,item)"></span>
				<span class="rater-icon ion-android-star" :class="{'rater_icon_activity': 2 < item.value_ser}"
					@click="clickStar(2,3,item)"></span>
				<span class="rater-icon ion-android-star" :class="{'rater_icon_activity': 3 < item.value_ser}"
					@click="clickStar(2,4,item)"></span>
				<span class="rater-icon ion-android-star" :class="{'rater_icon_activity': 4 < item.value_ser}"
					@click="clickStar(2,5,item)"></span>
			</cell>
			<cell title="物流服务的质量">
				<!-- <span class="rater-icon ion-android-star" :class="{'rater_icon_activity': index < starColorCon3}" v-for="(item,index) in 5" @click="clickStar(3,index,item)"></span> -->
				<span class="rater-icon ion-android-star" :class="{'rater_icon_activity': 0 < item.value_sh}"
					@click="clickStar(3,1,item)"></span>
				<span class="rater-icon ion-android-star" :class="{'rater_icon_activity': 1 < item.value_sh}"
					@click="clickStar(3,2,item)"></span>
				<span class="rater-icon ion-android-star" :class="{'rater_icon_activity': 2 < item.value_sh}"
					@click="clickStar(3,3,item)"></span>
				<span class="rater-icon ion-android-star" :class="{'rater_icon_activity': 3 < item.value_sh}"
					@click="clickStar(3,4,item)"></span>
				<span class="rater-icon ion-android-star" :class="{'rater_icon_activity': 4 < item.value_sh}"
					@click="clickStar(3,5,item)"></span>
			</cell>
			<x-textarea placeholder="请输入具体评价内容" v-model="item.textarea" :show-counter="true" :max='150' :rows="5">
			</x-textarea>
		</group>

		<div class="submit">
			<x-button type="primary" @click.native="changeSubmit">提交</x-button>
		</div>
	</div>
</template>

<script>
	import {
		Cell,
		Group,
		XTextarea,
		Rater,
		XButton,
		Checker,
		CheckerItem,
	} from 'vux'

	export default {
		components: {
			Cell,
			Group,
			XTextarea,
			Rater,
			XButton,
			Checker,
			CheckerItem,
		},
		data() {
			return {
				alert: false, //提示开关
				alertMessage: '', //结果提示
				listHeight: [],
				scrollY: 0,
				selectedOrder: {},
				urlID: '',
				data: '',
				address: '',
				star1: '',
				star2: '',
				star3: '',
				text: '',
				data: '',
				checker: 1,
				textarea: '',
				ready: true,
				starColorCon1: 0, //颜色控制
				starColorCon2: 0,
				starColorCon3: 0,
				value_des: '', //描述相符
				value_ser: '', //服务态度
				value_sh: '', //服务质量
			}
		},
		mounted: function () {
			this.$nextTick(function () {
				var urlID = this.getQueryString("id") //获取id
				this.urlID = urlID
				this.api.post('getOrderEvaluate', {
					'id': this.urlID
				}).then(res => {
					for (var i = res.obj.goodsCarDetailList.length - 1; i >= 0; i--) {
						res.obj.goodsCarDetailList[i].value_des = 0
						res.obj.goodsCarDetailList[i].value_ser = 0
						res.obj.goodsCarDetailList[i].value_sh = 0
						res.obj.goodsCarDetailList[i].textarea = null
						res.obj.goodsCarDetailList[i].evaluate_val = 1
					};

					this.data = res.obj;
				})
			})
		},

		methods: {
			// 获取href数据
			getQueryStringVar: function (name) {
				var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
				var r = window.location.href.substring(window.location.href.indexOf('?'), window.location.href.length).substr(
					1).match(reg);
				if (r != null) return unescape(r[2]);
				return null;
			},
			onConfirm: function () {},
			clickStar: function (e, index, item) {
				if (e == 1) {
					item.value_des = index
				} else if (e == 2) {
					item.value_ser = index
				} else {
					item.value_sh = index
				}
			},
			changeSubmit: function () {
				var infos = []
				this.data.goodsCarDetailList.forEach((item, index) => {
					infos[index] = {
						'goodsId': item.goodsId,
						'evaluate_val': item.evaluate_val,
						'des_evaluate': item.value_des,
						'ser_evaluate': item.value_ser,
						'sh_evaluate': item.value_sh,
						'evaluate_info': item.textarea,
						'gcId': item.gcId
					}
				})
				for (let i = 0; i < infos.length; i++) {
					if (infos[i].des_evaluate == '' || infos[i].des_evaluate == null || infos[i].ser_evaluate == '' || infos[i]
						.ser_evaluate == null || infos[i].sh_evaluate == '' || infos[i].sh_evaluate == null || infos[i]
						.evaluate_info == '' || infos[i].evaluate_info == null) {
						this.$dialog.alert({
							title: '提示',
							message: '信息填写不完整'
						}).then(() => {
							return
						})
					}
				}
				this.$toast.loading({
					duration: 0,
					forbidClick: true,
					message: '上传评论中'
				})
				this.api.post('submitOrderEvaluate', {
					'id': this.urlID,
					'infos': JSON.stringify(infos)
				}).then(res => {
					this.$toast.clear()
					this.$router.go(-1)
				})
			}
		}

	}
</script>

<style lang="less">
	@red: #f0415f;

	.evaluate {
		// padding-top: 50px
	}

	.submit {
		margin: .1rem;

		.weui-btn_primary {
			background-color: #1fbba6;
		}
	}

	.rater-icon {
		font-size: .3rem;
		padding-left: .04rem;
		color: #ccc;
	}

	.rater_icon_activity {
		color: #1fbba6;
	}

	.goods-list {
		display: flex;
		padding: .06rem .15rem;
		margin-top: .02rem;

		// background-color: #f0f4f5;
		.goods-img {
			flex: 0 0 .57rem;
			width: .57rem;
			margin-right: .1rem;
			overflow: hidden;
		}

		.content {
			flex: 1;

			.name {
				display: block;
				overflow: hidden;
				height: .16rem;
				line-height: .16rem;
				font-size: .14rem;
				color: rgb(7, 17, 27);
			}

			.goods-standard {
				margin-top: .04rem;
				color: #999;
				font-size: .12rem;
				line-height: .18rem;
				display: inline-block;

				.cc-left {
					float: left;
				}
			}
		}
	}

	.checker {
		margin: .1rem;
	}

	.demo1-item {
		border: .01rem solid #ececec;
		padding: .05rem .15rem;
		width: 20%;
	}

	.demo1-item-selected {
		border: .01rem solid green;
	}
</style>
