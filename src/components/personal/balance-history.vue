<template>
	<div class="balance-history">
		<div class="container" style="height: 100%">
			<Scroll style="over-flow: hidden; height: 100%" :data="data" @scrollToEnd="loadMore" :listen-scroll="listenScroll"
				:probe-type="probeType" :pullup="pullup" @scroll="showBackButton" ref="dataList">
				<div>
					<ul class="wrap">
						<li class="item" v-for="item in data" @click="goToOrder(item)">
							<div class="base-info vux-1px-b">
								<div class="name">
									<span>{{item.date}}</span>
								</div>
								<div class="change">
									<span class="reduce" v-if="item.type == 0">-{{item.deposit}}点</span>
									<span class="reduce" style="color: #009944" v-else>+{{item.deposit}}点</span>
									<span class="total">剩余：{{item.lastdeposit}}点</span>
								</div>
							</div>
							<div class="order" v-if="item.type == 0">
								<span>订单号：{{item.orderno}}</span>
								<a class="ion-chevron-right"></a>
							</div>
							<div class="order" v-if="item.type == 1">
								<span>来自渝教退款</span>
							</div>
							<div class="order" v-if="item.type == 2">
								<span>来自渝教充值</span>
							</div>
						</li>
					</ul>
				</div>
			</Scroll>
		</div>
		<back-top v-show="showBackTop" @click.native="backToTop"></back-top>
	</div>
</template>

<script>
	import Scroll from "base/scroll"
	import BackTop from 'base/backTop'

	export default {
		components: {
			Scroll,
			BackTop
		},
		data() {
			return {
				data: [], // 接口数据
				currentPage: 1, // 当前页
				totalPage: '', // 总页数
				pullup: true, // 是否开启上拉加载
				showBackTop: false, // 是否展示返回顶部
			}
		},
		created() {
			this._getDepositDetail()
			this.listenScroll = true
			this.probeType = 3
		},
		methods: {
			_getDepositDetail: function () {
				const _this = this
				this.api.post('getDepositDetail', {
					currentPage: _this.currentPage
				}).then(res => {
					_this.totalPage = res.obj.totalPage
					_this.data.push(...res.obj.depositList)
				})
			},
			goToOrder: function (item) {
				if (item.type != 2) {
					this.$router.push({
						path: '/order-detail',
						query: {
							id: item.orderid
						}
					})
				}
			},
			loadMore: function () {
				if (this.currentPage < Number(this.totalPage)) {
					this.currentPage++
					this._getDepositDetail()
				}
			},
			showBackButton: function (pos) {
				pos.y > -2000 ? this.showBackTop = false : this.showBackTop = true
			},
			backToTop: function () {
				this.$refs.dataList.scroll.scrollTo(0, 0, 500)
			}
		}

	}
</script>

<style lang="less">
	.balance-history {
		position: fixed;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
		background-color: #f0f4f5;

		.wrap {
			display: block;
			list-style: none;
			padding: 0px .08rem 0;
			overflow: hidden;

			.item {
				display: block;
				padding: 10px;
				background-color: #fff;
				box-shadow: 0 .01rem .06rem rgba(32, 33, 36, 0.28);
				border-radius: .08rem;
				margin-bottom: .1rem;

				.base-info {
					display: flex;
					padding: .08rem;

					.name {
						flex: 1;
						font-size: .14rem;
						font-weight: 800;
					}

					.change {
						width: 1.5rem;
						text-align: right;

						span {
							display: block;
						}

						.reduce {
							font-size: .2rem;
							line-height: .22rem;
							color: #f0415f;
							font-weight: 800;
						}

						.total {
							font-size: .14rem;
							color: #999;
						}
					}
				}

				.order {
					font-size: .14rem;
					padding: .1rem .08rem 0;

					span {
						color: #999;
					}

					a {
						float: right;
						color: #bbb;
					}
				}

			}
		}
	}
</style>
