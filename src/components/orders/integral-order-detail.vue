<template>
	<div class="integral-order-detail">
		<!-- <scroller lock-x height="-54"> -->
		<div class="maincon" style="padding-bottom:.64rem;">

			<!-- 订单状态 -->
			<div class="order-status">
				<div class="already-deliver">
					<p class="status-detail">
						订单状态：
						<i v-if="data.ordeStatus=='10'">等待买家付款</i>
						<i v-if="data.showStatus=='1'">等待卖家发货</i>
						<i v-if="data.ordeStatus=='30'">等待买家收货</i>
						<i v-if="data.showStatus=='3'">交易已完成</i>
						<i v-if="data.ordeStatus=='0'||data.ordeStatus=='-1'">交易已关闭</i>
					</p>
				</div>
			</div>

			<!-- 收货地址 -->
			<div class="addr-sheet section">
				<a class="addr-txt">
					<p class="person orient-h"></p>
					<span class="name cell">收货姓名：{{data.buyerName}}</span>
					<span class="phone cell">{{data.buyerPhone}}</span>
					<p>收货地址：{{data.buyerAddress}}</p>
				</a>
			</div>

			<!-- 物流信息 -->
			<div class="order-status" v-if="data.ordeStatus=='30' || data.showStatus=='3'">
				<div class="already-deliver">
					<p class="status-detail">
						<span>物流信息</span>
						<router-link :to="{path: '/logistics', query:{id: data.id,type: 2}}"
							style="float:right; padding-right: 15px; color: #007aff">立即查看</router-link>
					</p>
				</div>
			</div>

			<!-- 商品明细 -->
			<div class="order-info">
				<div class="section">
					<div class="ord-list">
						<!-- 商品1 -->
						<div class="item" v-for="item in data.goodsCarDetailList">
							<img v-lazy="item.url" alt="" class="prod-img">
							<div class="intro">
								<h3>{{item.name}}</h3>
								<!-- <p class="attrs"><span v-for="spec in item.specMap">【{{spec.value}}】</span></p> -->
								<div class="howmuch">
									<span class="sale-price">
										<small>单件所需积分：</small>
										{{item.unitPrice}}
									</span>
								</div>
								<div class="num">
									x{{item.num}}
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>


			<!-- 价格 -->
			<div style="margin: .16rem 0">
				<van-cell title="运费" :value="data.shipPrice"></van-cell>
				<van-cell title="总积分">
					<template #default>
						<span style="color: #f0415f">{{data.totalPrice}}</span>
					</template>
				</van-cell>
			</div>

			<!-- 订单 -->
			<div style="margin:.16rem 0">
				<van-cell title="订单号" :value="data.orderId"></van-cell>
				<van-cell title="下单时间" :value="data.addTime"></van-cell>
				<van-cell title="付款时间" :value="data.payTime=='' || data.payTime==null ? '--' : data.payTime"></van-cell>
				<van-cell title="发货时间" :value="data.shipTime=='' || data.payTime==null ? '--' : data.shipTime"></van-cell>
			</div>
		</div>
		<!-- </scroller> -->


		<!-- 底部 -->
		<div class="card-bottom vux-1px-t">

			<!-- 待付款 -->
			<div class="bot-body" v-if="data.ordeStatus=='10'">
				<div class="bot-btn">
					<router-link :to="{path: 'pay-way', query: { id: data.id, orderNumber: data.orderId, pay:data.totalPrice }}"
						class="important">立即付款</router-link>
				</div>
				<!-- <div class="bot-btn">
					<a @click="haveQuestion">订单遇到问题</a>
				</div> -->
				<!-- <div class="bot-btn">
					<a @click="cancelOrder">取消订单</a>
				</div> -->
			</div>
			<!-- 已关闭 -->
			<div class="bot-body" v-if="data.ordeStatus=='0'||data.ordeStatus=='-1'">
				<div class="bot-btn">
					<a @click="haveQuestion">订单遇到问题</a>
				</div>
			</div>

			<!-- 待发货 -->
			<div class="bot-body" v-if="data.showStatus=='1'">
				<div class="bot-btn">
					<a @click="haveQuestion">订单遇到问题</a>
				</div>
				<div class="bot-btn">
					<a @click="cancelOrder">取消订单</a>
				</div>
			</div>

			<!-- 待收货 -->
			<div class="bot-body" v-if="data.ordeStatus=='30'">

				<div class="bot-btn">
					<a @click="affirm" class="important">确认收货</a>
				</div>
				<div class="bot-btn">
					<a @click="haveQuestion">订单遇到问题</a>
				</div>
			</div>

			<!-- 交易已完成 -->
			<div class="bot-body" v-if="data.showStatus=='3'">
				<div class="bot-btn">
					<a @click="haveQuestion">订单遇到问题</a>
				</div>
			</div>
		</div>

	</div>
</template>

<script>
	export default {
		data() {
			return {
				listHeight: [],
				scrollY: 0,
				selectedOrder: {},
				urlID: '',
				data: '',
				address: ''
			}
		},
		mounted: function () {
			this.$nextTick(function () {
				var urlID = this.getQueryString("id") //获取id
				this.urlID = urlID
				this.api.post('getIntegralOrderDetail', {
					'id': this.urlID
				}).then(res => {
					this.data = res.obj
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
			haveQuestion: function () {
				this.$dialog.alert({
					title: '提示',
					message: "如果你对购买的商品存在问题请联系渝教商城客服：" + global.PHONE
				})
			},
			// 确认收货
			affirm: function () {
				this.$dialog.confirm({
					title: '提示',
					message: '是否确认收货？'
				}).then(() => {
					this.api.post('confirmIntegralOrder', {
						id: this.urlID
					}).then((res) => {
						location.reload()
					})
				})
			},
			cancelOrder: function () {
				this.$dialog.confirm({
					title: '提示',
					message: '是否取消订单？'
				}).then(() => {
					this.api.post('cancelInteralOrderDetail', {
						id: this.urlID
					}).then(res => {
						location.reload()
					})
				})
			}
		}

	}
</script>

<style lang="less">
	.integral-order-detail {
		display: flex;
		flex-direction: column;

		.van-cell {
			font-size: 0.16rem;
			justify-content: space-between;

			.van-cell__title {
				flex: .5;
			}
		}
	}
</style>
