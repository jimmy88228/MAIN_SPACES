

<template>
	<div class="act-sale-view limit-time-sale-view">
		<!--统一活动头-->
		<activityHeaderView :currIndex="currIndex" :inTab="inTab"></activityHeaderView>
	
		<div v-if="typeof(info.activityGroup) != 'undefined' && info.activityGroup.length > 0">
			<Tabs v-if="info.activityGroup.length > 1" :value="info.currTab">
				<TabPane
				v-for="(group, gindex) in info.activityGroup" :key="gindex"
				:label="tabLabel(group)"
				:name="'tab'+gindex"></TabPane>
			</Tabs>
			
			<template
			v-for="(group, gindex) in info.activityGroup"
			v-if="info.activityGroup.length == 1 || info.currTab == 'tab'+gindex ">

				<!--常规布局-->
				<template v-if="info.layout == 'one' || info.layout == 'two' || info.layout == 'three' ">
					<Row type="flex" style="flex-wrap:wrap;" :gutter="info.gutter">
						<Col v-for="(item,index) in demoList[gindex]" :key="index" 
						v-if="info.open_slide == null || info.open_slide == false || ( info.open_slide == true && index +1 <= (info.layout == 'one' ? 1 : (info.layout == 'two' ? 2 : 3)) ) "
						 :span="info.layout == 'one' ? 24 : (info.layout == 'two' ? 12 : 8)">
		
						<div class="goods-item" :style="{'margin-bottom': info.gutter + 'px'}">
							<Tag :color="styleColor" class="tag">限时</Tag>
							<div class="img-box" :style="{
								'background-image' : 'url('+item.goods_thumb+')',
								height: ( 375/(info.layout == 'one' ? 1 : (info.layout == 'two' ? 2 : 3)) - info.gutter ) +'px'
							}"></div>
							<div v-if="info.content_switch.show_goods_name" class="name clamp">{{item.name}}</div>

							<Row type="flex">
								<Col style="flex:1 1 0%;">
									<template v-if="info.content_switch.show_price">
									<div class="price">￥{{item.min_price}} - {{item.max_price}}</div>
									</template>
								</Col>
								<Col :style="{width: info.layout == 'one' ? '190px' : '90px'}">
									<div v-if="info.content_switch.show_button" 
									class="btn" :style="{marginLeft: info.layout=='three' ? '8px' : '0'}">
										<div class="tname single">马上秒</div>
									</div>
								</Col>
							</Row>

						</div>

						</Col>
					</Row>
				</template>

				<!--一大两小布局-->
				<template v-else-if="info.layout == 'bigSmall'">
					<Row type="flex" style="flex-wrap:wrap;" :gutter="info.gutter">
						<Col v-for="(item,index) in demoList[gindex]" :key="index" :span="index%3 == 0 ? 24 : 12 ">

						<div class="goods-item" :style="{'margin-bottom': info.gutter + 'px'}">
							<Tag :color="styleColor" class="tag">限时</Tag>
							<div class="img-box" :style="{
								'background-image':'url('+item.goods_thumb+')',
								height: ( 375/(index%3 == 0 ? 1 : 2) - info.gutter ) +'px'
							}"></div>
							<div v-if="info.content_switch.show_goods_name" class="name clamp">{{item.name}}</div>

							<Row type="flex">
								<Col style="flex:1 1 0%;">
									<template v-if="info.content_switch.show_price">
									<div class="price">￥{{item.min_price}} - {{item.max_price}}</div>
									</template>
								</Col>
								<Col :style="{width: index%3 == 0 ? '190px' : '110px'}">
								<div v-if="info.content_switch.show_button" class="btn">
									<div class="tname single">马上秒</div>
								</div>
								</Col>
							</Row>
						</div>

						</Col>
					</Row>
				</template>

				<!--列表形式的布局-->
				<template v-else-if="info.layout == 'list' ">
					<div v-for="(item,index) in demoList[gindex]" :key="index" class="goods-item" style="margin-bottom:3px;padding:5px;">
						<Tag :color="styleColor" class="tag">限时</Tag>
						<Row type="flex" :gutter="16">
							<Col style="width:120px">
							<div class="img-box" :style="{'background-image':'url('+item.goods_thumb+')',height:'120px'}"></div>
							</Col>
							<Col style="flex:1 1 0%;">
							<div v-if="info.content_switch.show_goods_name" class="list-name clamp2">{{item.name}}</div>
							<template v-if="info.content_switch.show_price">
							<div class="list-price" style="margin-top:15px;">
								<span>￥{{item.min_price}} - {{item.max_price}}</span>
							</div>
							</template>
							<div style="float:right;">
								<div v-if="info.content_switch.show_button" class="btn" style="width:130px;">
									<div class="tname single">马上秒</div>
								</div>
							</div>
							</Col>
						</Row>
					</div>
				</template>
			</template>
		</div>
		<!--空白的情况-->
		<div v-else class="empty">
			<Icon type="ios-stopwatch-outline" size="60" color="#2d8cf0"></Icon>
			<div>请点击编辑 限时特惠活动</div>
		</div>
		
		<!--加载提示-->
		<Spin size="large" fix v-if="spinShow"></Spin>
		
	</div>
</template>

<script>
	import './style/comm.less';
	import activityHeaderView from './activity-header-view.vue';

	/**
	 * 限时特惠渲染组件
	 */
	export default {
		name: 'limitTimeSaleView',
		components: {
			activityHeaderView,
		},
		props: {
			currIndex: {
				type: [Number, String],
				default: 0,
			},
			// 是否使用用在 tab 导航页面内
			inTab: {
				type: Boolean,
				default: false,
			}
		},
		data() {
			return {
				info: {},
				dataList: [],
				
				styleColor:'#ff9900',

				demoList: [],
				spinShow: false,
			}
		},
		computed: {

		},
		methods: {
			init() {
				this.dataList = this.inTab ? this.$store.state.app.tabPageCompList : this.$store.state.app.pageCompList;
				this.info = this.dataList[this.currIndex].setting;

				this.initGoodsList();
			},
			initGoodsList() {
				
				let img = this.$util.apiHost + '/../image/show/assets-images-no_photo.jpg';
			
				if( typeof(this.info.activityGroup) != 'undefined' && this.info.activityGroup.length > 0 ){
					for(var i in this.info.activityGroup ){
						if( this.info.activityGroup[i].goodsListType =='auto' ){
							let goodsList = [];
							
							// ajax 请求获取初始化数据
							this.spinShow = true;
							this.$ajax.post((this.$route.fullPath.indexOf('cloud-shop') != -1 ? this.$api.ShopGoodsList : this.$api.goodsList), {
								isInit: 2,
								page: 1,
								pageSize: this.info.activityGroup[i].show_num,
								seckillActivityId: this.info.activityGroup[i].activity_id,
							})
							.then((response) => {
								this.tableLoading = false;
								var res = response.data;
						
								if (res.code) {
									// 初始化表数据
									if( res.data.items != null ){
										res.data.items.forEach( (item)=>{
											goodsList.push({
												name: item.name,
												goods_thumb: item.goods_thumb,
												max_price: item.max_price,
												min_price: item.min_price,
											});
										});
									}
									this.spinShow = false;
								}
							});
								
							this.$set(this.demoList, i , goodsList);
						}
						else{
							this.$set(this.demoList, i , this.info.activityGroup[i].goodsList );
						}
					}
				}
		
			},
			tabLabel(group){
				return (h) => {
					return h('div', {
						style:{}
					}, [
						h('div', group.name ),
						h('div', {
							style:{}
						}, group.endTime )
					])
				}
			}
		},
		watch:{
			'info':{
				handler( to, from ){
					this.initGoodsList();
				},
				deep: true,
			}
		},
		mounted() {
			this.init();
		},
	}
</script>
<style lang="less">
@styleColor:#ff9900;
.limit-time-sale-view{
	.goods-item{
		.price{
			color:@styleColor;
		}
		.btn{
			background-color: @styleColor;
		}
	}
	
	.ivu-tabs-bar{
		border-bottom: 0 none;
	}
	.ivu-tabs-nav {
		display: flex;
		width: 100%;
		background-color: rgba(0,0,0,.03);
	
		.ivu-tabs-tab{
			flex:1 1 0%;
			text-align: center;
			margin: 8px 0;
		}
		
		.ivu-tabs-tab-active{
			color:@styleColor;
			background: #fff;
			margin: 8px;
			border-radius: 5px;
		}
		.ivu-tabs-ink-bar{
			display: none;
		}
	}
}
</style>