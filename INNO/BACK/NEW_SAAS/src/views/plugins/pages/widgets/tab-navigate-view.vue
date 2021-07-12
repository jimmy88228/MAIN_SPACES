<style lang="less">
	.tab-nav-view{

	.ivu-cell{
		padding:8px 5px;
		background-color: #E3E5E8;
	}
	.ivu-cell-selected{
		background-color: transparent;
	}
	.empty{
		text-align: center;
		padding:50px 20px;
		color:#515a6e;
	}

	.ivu-cell-item{
		text-align: center;
	}
	
	/*顶部tab样式调整*/
	.ivu-tabs-bar{
		border-bottom: 0 none;
	}
	.ivu-tabs-nav {
		display: flex;
		width: 100%;
		background-color: rgba(0,0,0,.05);
		.ivu-tabs-tab{
			flex:1 1 0%;
			text-align: center;
		}
	}
	
	.left-tab-name{
		max-width:90px;
		font-size:13px;
		text-align: center;
	}
	.left-label-name{
		font-size:12px;
		color:#ccc;
		text-align: center;
	}
}
</style>

<template>
	<div class="tab-nav-view">
		<div v-if="typeof(info.pageList) != 'undefined' && info.pageList.length > 0">
			<!--顶部导航栏的页面-->
			<template v-if="info.type == 'top' ">
				<Tabs v-model="info.currTab" size="small" :animated="false">
					<TabPane 
					v-for="(item, index) in info.pageList" :key="index" 
					v-if="item.is_enable" 
					:label="( item.tab_name != '' ? item.tab_name : 'Tab-'+index )"
					 :name="'Tab'+index">
					</TabPane>
				</Tabs>
				<!--tab页面组件池-->
				<widgetPool ref="widget-pool"></widgetPool>
			</template>

			<!--左侧导航栏的页面-->
			<template v-else>
				<Row type="flex" align="top" :gutter="5">
					<Col :style="{width:'90px'}">
					<CellGroup>
						<Cell v-for="(item, index) in info.pageList" :key="index" v-if="item.is_enable" :selected=" info.currTab == 'Tab'+index ? true : false ">
							<div class="clamp left-tab-name">{{( item.tab_name != '' ? item.tab_name : 'Tab-'+index )}}</div>
							<div v-if="item.label_name != null && item.label_name != '' " slot="label" class="left-label-name">{{item.label_name}}</div>
						</Cell>
						<Cell :style="{height: navHeight+'px'}"></Cell>
					</CellGroup>
					</Col>
					<Col style="width:285px;">
						<!--tab页面组件池-->
						<widgetPool ref="widget-pool" :inLeft="true"></widgetPool>
					</Col>
				</Row>
			</template>
		</div>

		<!--空白的情况-->
		<div v-else class="empty">
			<Icon type="md-browsers" size="60" color="#2d8cf0"></Icon>
			<div>请添加导航Tab</div>
		</div>
	</div>
</template>

<script>
	import widgetPool from './widget-pool.vue';

	/**
	 * 顶部导航视图 组件
	 */
	export default {
		name: 'tabNavigateView',
		components: {
			widgetPool,
		},
		props: {
			currIndex: {
				type: [Number, String],
				default: 0,
			},
		},
		data() {
			return {
				info: {},
				dataList: [],
				navHeight: 600,
				inInit: 0,
				
				// 当前页面的组件列表
				currCompList: [],
			}
		},
		computed: {

		},
		methods: {
			init() {
				this.dataList = this.$store.state.app.pageCompList;
				this.info = this.dataList[ this.currIndex ].setting;

				this.navHeight = document.body.clientHeight - 150;
				
				this.inInit = 1;
				this.getCurrPage();
				setTimeout(()=>{
					// 这里只是起到防止重复请求的作用
					this.inInit = 0;
				},1000);
			},
			// 获取当前Tab 页面的内容
			getCurrPage() {
				var tabName = this.info.currTab;
				if (tabName != '' && tabName != null) {
					let currTabIndex = Number(tabName.replace('Tab', ''));
					const compPageInfo = this.info.pageList[ currTabIndex ];

					// 初始化页面预览组件
					this.$nextTick(() => {
						this.$refs['widget-pool'].initData(compPageInfo.page_id);
					});
				}
			},
		},
		watch: {
			'info.currTab'(to) {
				if( this.inInit == 0 ){
					this.getCurrPage();
				}
			},
			'info.type'(to) {
				if( this.inInit == 0 ){
					this.getCurrPage();
				}
			},
			'info.pageList'(to) {
				if( this.inInit == 0 ){
					this.getCurrPage();
				}
			}
		},
		mounted() {
			this.init();
		},
	}
</script>
