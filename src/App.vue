<template>
	<div id="app" v-cloak>
		<!-- 需要被缓存的路由入口 -->
		<keep-alive>
			<router-view v-if="!$route.meta.notKeepAlive"></router-view>
		</keep-alive>

		<!-- 不需要被缓存的路由入口 -->
		<router-view v-if="$route.meta.notKeepAlive"></router-view>
		<tab-bar></tab-bar>

	</div>
</template>

<script>
	import TabBar from 'base/newTabBar';
	export default {
		components: {
			TabBar
		},
		created() {
			this.deployRem(document, window)
		},
		methods: {
			deployRem(doc, win) {
				let docEl = doc.documentElement,
					getRem = () => {
						let width = docEl.clientWidth
						let rem = width / 375 * 100
						docEl.style.fontSize = rem + 'px'
						let actualSize = parseFloat(win.getComputedStyle(docEl, ['font-size']))
						if (rem !== actualSize) {
							docEl.style.fontSize = rem / (actualSize / rem) + 'px'
						}
					}
				win.addEventListener('resize', getRem, false)
				doc.addEventListener('ready', getRem, false)
				if (!doc.addEventListener) {
					return
				} else {
					getRem()
				}
			}
		}
	}
</script>

<style lang="less">
	@import '~vux/src/styles/reset.less';
	@import '~vux/src/styles/1px.less';
	@import 'common/css/icon-ali.less';
	@import 'common/css/variable.less';
	@import 'common/css/yjyl-reset.less';

	@red: #f0415f;
	@mian: #b22a32;
	@linkBlue: #007aff;
	@line: #dedede;
	// @bg: #f0f4f5;
	@bg: #EEEEEE;

	// 字体
	@mainFont: #333;
	@sencondFont: #999;

	a {
		color: #000;
	}

	body {
		background-color: @bg;
		-webkit-overflow-scrolling: touch;
		overflow-scrolling: touch;
		line-height: 1;
	}

	body,
	html {
		font-size: 0.14rem;
		width: 100%;
		height: 100%
	}

	#app {
		width: 100%;
		height: 100%;
	}

	.slide-enter-active,
	.slide-leave-active {
		transition: all 0.3s
	}

	.slide-enter,
	.slide-leave-to {
		transform: translate3d(100%, 0, 0)
	}

	.default-hint {
		color: #999;
		display: block;
		text-align: center;
		padding-top: 0.15rem;
		font-size: 0.16rem;
	}

	//分销中心组件样式
	.distribution-center .vux-tab .vux-tab-ink-bar {
		background-color: #FF773A !important;
		
	}

	.van-switch--on {
		background-color: #04BE02 !important;
	}

	.van-cell__label {
		font-size: 0.14rem !important;
	}

</style>
