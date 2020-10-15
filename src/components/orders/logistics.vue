<template>
	<div class="logistics">
		<x-header class="vux-1px-b">物流信息</x-header>

		<div class="order-id vux-1px-b" v-show="ready">
			物流运单号:<span style="color: #f0415f; padding-left: 10px;">{{mailno}}</span>
		</div>

		<!-- 没有物流信息 -->
		<div class="order-id vux-1px-b" v-show="noSteps">
			物流运单号:<span style="color: #f0415f; padding-left: 10px;">{{mailno}}</span><br>
			<span style="font-size: 15px; color: #999;">{{data.remark}}</span>
		</div>

		<timeline class="main" v-show="ready">
			<timeline-item>
				<h4 class="recent">{{firstData.remark}}</h4>
				<p class="recent">{{firstData.time}}</p>
			</timeline-item>

			<timeline-item v-for = "(item,index) in dataList">
				<h4>{{item.remark}}</h4>
				<p style="color:#999">{{item.time}}</p>
			</timeline-item>
		</timeline>

		<Loading v-show="loading"></Loading>

		<div v-show="noReady">
			<span class="default-hint">暂无物流信息</span>
		</div>
	</div>
</template>

<script>

	import { XHeader, Timeline, TimelineItem} from 'vux'
	import Loading from '../../components/loading/loading.vue'
	export default {
		components: {
			XHeader,Timeline,TimelineItem,Loading
		},
		data() {
			return {
				data: '',
				dataList: '',
				firstData: '',
				loading: true,
				ready: false,
				mailno: '',
				noReady: false,
				noSteps: false
			}
		},
		mounted: function (){
			this.$nextTick(function(){
				var urlID=this.getQueryString("id") //获取id
				this.urlID = urlID
				var type=this.getQueryString("type")
				this.api.post('getLogisticsInfo', {
					'orderId': this.urlID,
					'type': type
				}).then(res => {
          this.loading = false;
          if(res.code==200){
            this.data = res.obj;
            if(this.data.steps.length > 0){
              this.ready = true;
              this.dataList = res.obj.steps.slice(1,20);
              this.firstData = res.obj.steps[0];
              this.mailno = this.data.mailno;
            }else if(this.data.steps.length == 0){
              this.noSteps = true;
						this.mailno = this.data.mailno;
            }
          }else{
            this.noReady = true;
          }
				})
			})
		},

		methods: {
			// 获取href数据
			getQueryStringVar: function(name) {
				var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
				var r = window.location.href.substring(window.location.href.indexOf('?'),window.location.href.length).substr(1).match(reg);
				if (r != null) return unescape(r[2]); return null;
			},
		}

	}

</script>

<style lang="less">
	.recent {
		color: #04be02;
	}
	.logistics{
		padding-top: .46rem;
		.order-id{
			padding: 0 .15rem;
			background-color: #fff;
			line-height: .44rem;
		}
		.main{
			background-color: #fff;
		}
	}
	.vux-timeline {
		padding: 0.15rem !important;
	}
	.vux-timeline-item-content {
		padding: 0 0 0.16rem 0.16rem !important;
	}
</style>
