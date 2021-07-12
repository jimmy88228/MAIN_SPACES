<style lang="less">
@styleColor:#ED3B05;

.sec-kill-view{
	position: relative;
	overflow: hidden;
	
	.goods-item{
		padding-bottom:10px;
		background-color: #fff;
		border: 1px solid rgba(0,0,0,.03);
		position: relative;
		
		.tag{
			position: absolute;
			left:5px;
			top:5px;
			z-index: 2;
		}
		.img-box{
			background: center center no-repeat;
			background-size: 100% auto;
			width:100%;
			margin:0 auto;
		}
		.name{
			padding:5px 5px 2px 5px;
			margin-top:5px;
			font-size:13px;
		}
		.price{
			padding:2px 5px;
			font-size:13px;
			color:@styleColor;
			font-weight: bold;
		}
		.market-price{
			padding:1px 5px;
			font-size:13px;
			color: #ccc;
			text-decoration: line-through;
		}
		
		.list-name{
			padding:0 5px 0 0;
			font-size:14px;
		}
		.list-price{
			padding:2px 5px 2px 0;
			font-size:13px;
		}
		
		.btn{
			text-align: center;
			background-color:@styleColor;
			color:#fff;
			border-radius: 4px;
			padding:3px 2px;
			margin-right:3px;
			
			.tname{
				font-size:13px;
				
				&.single{
					padding:6px 0;
				}
			}
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
	
	.empty{
		text-align: center;
		padding:50px 20px;
		color:#515a6e;
	}
}
</style>

<template>
	<div class="sec-kill-view">
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
							<Tag :color="styleColor" class="tag">秒杀</Tag>
							<div class="img-box" :style="{
							'background-image' : 'url('+item.goods_thumb+')',
							height: ( 375/(info.layout == 'one' ? 1 : (info.layout == 'two' ? 2 : 3)) - info.gutter ) +'px'
						}"></div>
							<div v-if="info.content_switch.show_goods_name" class="name clamp">{{item.name}}</div>

							<Row type="flex">
								<Col style="flex:1 1 0%;">
									<template v-if="info.content_switch.show_price">
										<div class="price">￥{{item.sale_price}}</div>
										<div class="market-price">￥{{item.market_price}}</div>
									</template>
								</Col>
								<Col :style="{width: info.layout == 'one' ? '180px' : '90px'}">
									<div v-if="info.content_switch.show_button" class="btn" :style="{marginLeft: info.layout=='three' ? '8px' : '0'}">
										<div class="tname single">马上秒</div>
									</div>
									<Progress v-if="info.content_switch.show_time" :percent="70" status="wrong">
										<span>剩30%</span>
									</Progress>
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
							<Tag :color="styleColor" class="tag">秒杀</Tag>
							<div class="img-box" :style="{
							'background-image':'url('+item.goods_thumb+')',
							height: ( 375/(index%3 == 0 ? 1 : 2) - info.gutter ) +'px'
						}"></div>
							<div v-if="info.content_switch.show_goods_name" class="name clamp">{{item.name}}</div>

							<Row type="flex">
								<Col style="flex:1 1 0%;">
									<template v-if="info.content_switch.show_price">
										<div class="price">￥{{item.sale_price}}</div>
										<div class="market-price">￥{{item.market_price}}</div>
									</template>
								</Col>
								<Col :style="{width: index%3 == 0 ? '190px' : '110px'}">
									<div v-if="info.content_switch.show_button" class="btn">
										<div class="tname single">马上秒</div>
									</div>
									<Progress v-if="info.content_switch.show_time" :percent="70" status="wrong">
										<span>剩30%</span>
									</Progress>
								</Col>
							</Row>
						</div>

						</Col>
					</Row>
				</template>

				<!--列表形式的布局-->
				<template v-else-if="info.layout == 'list' ">
					<div v-for="(item,index) in demoList[gindex]" :key="index" class="goods-item" style="margin-bottom:3px;padding:5px;">
						<Tag :color="styleColor" class="tag">秒杀</Tag>
						<Row type="flex" :gutter="16">
							<Col style="width:120px">
							<div class="img-box" :style="{'background-image':'url('+item.goods_thumb+')',height:'120px'}"></div>
							</Col>
							<Col style="flex:1 1 0%;">
							<div v-if="info.content_switch.show_goods_name" class="list-name clamp2">{{item.name}}</div>
							<template v-if="info.content_switch.show_price">
								<div class="list-price" style="margin-top:15px;">
									<span>￥{{item.sale_price}}</span>
								</div>
								<div class="market-price">￥{{item.market_price}}</div>
							</template>
							<div style="float:right;">
								<div v-if="info.content_switch.show_button" class="btn" style="width:130px;">
									<div class="tname single">马上秒</div>
								</div>
								<Progress v-if="info.content_switch.show_time" :percent="70" status="wrong">
									<span>剩30%</span>
								</Progress>
							</div>
							</Col>
						</Row>
					</div>
				</template>
			</template>
		</div>

		<!--空白的情况-->
		<div v-else class="empty">
			<Icon type="ios-timer-outline" size="60" color="#2d8cf0"></Icon>
			<div>请点击编辑 秒杀活动</div>
		</div>
	</div>
</template>

<script>
	import activityHeaderView from './activity-header-view.vue';

	/**
	 * 砍价渲染组件
	 */
	export default {
		name: 'secKillView',
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
				
				styleColor:'#ED3B05',
				
				demoList: [],
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
							if (this.info.layout == 'one') {
								goodsList = [{
										name: '商品名称1',goods_thumb: img,
										sale_price: 8,market_price: 150,integral: 5
									},{
										name: '商品名称2',goods_thumb: img,
										sale_price: 9,market_price: 140,integral: 5
									},{
										name: '商品名称3',goods_thumb: img,
										sale_price: 7,market_price: 130,integral: 5
									},
								];
							} else {
								goodsList = [{
										name: '商品名称1',goods_thumb: img,
										sale_price: 5,market_price: 150,integral: 5
									},{
										name: '商品名称2',goods_thumb: img,
										sale_price: 6,market_price: 140,integral: 5
									},{
										name: '商品名称3',goods_thumb: img,
										sale_price: 7,market_price: 130,integral: 5
									},{
										name: '商品名称4',goods_thumb: img,
										sale_price: 9,market_price: 160,integral: 5
									},{
										name: '商品名称5',goods_thumb: img,
										sale_price: 8,market_price: 150,integral: 5
									},{
										name: '商品名称6',goods_thumb: img,
										sale_price: 7,market_price: 170,integral: 5
									},
								];
							}
							
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
						},'即将开始')
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
