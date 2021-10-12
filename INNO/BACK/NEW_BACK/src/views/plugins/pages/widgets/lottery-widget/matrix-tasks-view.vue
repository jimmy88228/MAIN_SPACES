<style lang="less">
	.matrix-tasks-view{
		.task-item{
			padding: 10px;
			border-radius: 10px;
			background-color:#fff;
			margin-bottom: 10px;
			.task-icon{
				width: 30px;
				height: 30px;
				background-color:#efefef;
				border-radius: 100%;
				overflow: hidden;
				flex-shrink: 0;
				img{
					width:100%;
				}
			}
			.task-title{
				padding-left: 10px;
				.t-t-tit{
					font-weight:bold;
				}
				.t-t-tip{
					font-size: 12px;
				}
			}
			.task-btn{
				width: 80px;
				img{
					width:100%;
					display:block;
				}
			}
			
		}
	.empty{
		text-align: center;
		padding:50px 20px;
		color:#515a6e;
	}
}
</style>

<template>
	<div class="matrix-tasks-view">

		<!-- 静态图片 -->
		<template v-if="info.tasks.length > 0">
			<div v-for="(item,index) in info.tasks" :key="index" class="task-item flex f-align-center f-just-between">
				<div class="flex f-align-center">
					<div class="task-icon">
						<img :src="item.icon" />
					</div>
					<div class="task-title">
						<div class="t-t-tit space-nowrap">{{ index == 0 ? '邀请好友助力（0/8）' : '任务标题' + (index + 1) }}</div>
						<div class="t-t-tip space-nowrap">{{ index == 0 ? '邀请好友助力成功获得1次抽奖资格' : '任务副标题' + (index + 1) }}</div>
					</div>
				</div>
				<div>
					<div class="task-btn">
						<img :src="item.btn" />
					</div>
				</div>
			</div>
		</template>

		<!--空白的情况-->
		<div v-else class="empty">
			<Icon type="ios-images" size="60" color="#2d8cf0"></Icon>
			<div>请点击编辑任务配置</div>
		</div>
	</div>
</template>

<script>
	/**
	 * 图片广告渲染组件
	 */
	export default {
		name: 'imageAdView',
		components: {

		},
		props: {
			currIndex: {
				type: [Number, String],
				default: 0
			},
			// 是否使用用在 tab 导航页面内
			inTab: {
				type: Boolean,
				default: false,
			}
		},
		data() {
			return {
				info: {
					tasks: []
				},
				dataList: [],
			}
		},
		computed: {

		},
		methods: {
			init() {
				this.dataList = this.inTab ? this.$store.state.app.tabPageCompList : this.$store.state.app.pageCompList;
				this.info = this.dataList[this.currIndex].setting;
			},
		},
		watch: {

		},
		mounted() {
			this.init();
		}
	}
</script>
