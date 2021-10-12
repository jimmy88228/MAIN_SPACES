<style lang="less">
@styleColor:#87d068;
	
.pre-sale-view{
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
					padding:9px 0;
				}
			}
			.time{
				font-size:12px;
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
	<div class="pre-sale-view">
		<!--统一活动头-->
		<activityHeaderView :currIndex="currIndex" :inTab="inTab"></activityHeaderView>

		<div v-if="typeof(goodsList) != 'undefined' && goodsList.length > 0">
			<!--常规布局-->
			<template v-if="info.layout == 'one' || info.layout == 'two' || info.layout == 'three' ">
				<Row type="flex" style="flex-wrap:wrap;" :gutter="info.gutter">
					<Col v-for="(item,index) in goodsList" :key="index"
					v-if="info.open_slide == null || info.open_slide == false || ( info.open_slide == true && index +1 <= (info.layout == 'one' ? 1 : (info.layout == 'two' ? 2 : 3)) ) "
					:span="info.layout == 'one' ? 24 : (info.layout == 'two' ? 12 : 8)">
						
						<div class="goods-item" :style="{'margin-bottom': info.gutter + 'px'}">
							<Tag :color="styleColor" class="tag">预售</Tag>
							<div class="img-box" :style="{
								'background-image' : 'url('+( item.img_url_thumb == '' ? default_img : item.img_url_thumb )+')',
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
								<Col :style="{width: info.layout == 'one' ? '190px' : ( info.layout == 'three' ? '120px' : '110px')}">
									<div v-if="info.content_switch.show_button" 
									class="btn" :style="{marginLeft: info.layout=='three' ? '8px' : '0'}">
										<div class="tname" :class="info.content_switch.show_time == false ? 'single' :'' ">预售</div>
										<div v-if="info.content_switch.show_time" class="time">距结束：12:20:10</div>
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
					<Col v-for="(item,index) in goodsList" :key="index"
					:span="index%3 == 0 ? 24 : 12 ">
						
						<div class="goods-item" :style="{'margin-bottom': info.gutter + 'px'}">
							<Tag :color="styleColor" class="tag">预售</Tag>
							<div class="img-box" :style="{
								'background-image':'url('+(item.img_url_thumb == '' ? default_img : item.img_url_thumb )+')',
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
										<div class="tname" :class="info.content_switch.show_time == false ? 'single' :'' ">预售</div>
										<div v-if="info.content_switch.show_time" class="time">距结束：12:20:10</div>
									</div>
								</Col>
							</Row>
						</div>
						
					</Col>
				</Row>
			</template>
			
			<!--列表形式的布局-->
			<template v-else-if="info.layout == 'list' ">
				<div v-for="(item,index) in goodsList" :key="index" 
				class="goods-item" style="margin-bottom:3px;padding:5px;">
					<Tag :color="styleColor" class="tag">预售</Tag>
					<Row type="flex" :gutter="16">
						<Col style="width:120px">
							<div class="img-box" :style="{'background-image':'url('+( item.img_url_thumb == '' ? default_img : item.img_url_thumb )+')',height:'120px'}"></div>
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
									<div class="tname" :class="info.content_switch.show_time == false ? 'single' :'' ">预售</div>
									<div v-if="info.content_switch.show_time" class="time">距结束：12:20:10</div>
								</div>
							</div>
						</Col>
					</Row>
				</div>
			</template>
		</div>
		
		<!--空白的情况-->
		<div v-else class="empty">
			<Icon type="ios-analytics-outline" size="60" color="#2d8cf0"></Icon>
			<div>请点击编辑 预售活动</div>
		</div>
	</div>
</template>

<script>
	import activityHeaderView from './activity-header-view.vue';

	/**
	 * 预售渲染组件
	 */
	export default {
		name: 'preSaleView',
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
				default_img: '',
				styleColor: '#87d068',
				goodsList: [],
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
			initGoodsList(){
				let img = this.default_img = this.$util.apiHost + '/../image/show/assets-images-no_photo.jpg';
				
				if( this.info.activity_model == 'auto' ){
					// if( this.info.layout == 'one' ){
					// 	this.goodsList = [
					// 		{name:'商品名称1',img_url_thumb: img,sale_price:8,market_price:150,},
					// 		{name:'商品名称2',img_url_thumb: img,sale_price:9,market_price:140,},
					// 		{name:'商品名称3',img_url_thumb: img,sale_price:7,market_price:130,},
					// 	];
					// }
					// else{
					// 	this.goodsList = [
					// 		{name:'商品名称1',img_url_thumb: img,sale_price:5,market_price:150,},
					// 		{name:'商品名称2',img_url_thumb: img,sale_price:6,market_price:140,},
					// 		{name:'商品名称3',img_url_thumb: img,sale_price:7,market_price:130,},
					// 		{name:'商品名称4',img_url_thumb: img,sale_price:9,market_price:160,},
					// 		{name:'商品名称5',img_url_thumb: img,sale_price:8,market_price:150,},
					// 		{name:'商品名称6',img_url_thumb: img,sale_price:7,market_price:170,},
					// 	];
					// }
					let show_num = this.info.show_num;
					return this.$ajax.post(this.$api.presaleActivityList,{
						status: -1,
						page: 1,
						pageSize: show_num
					}).then((response)=>{
						let res = response.data || {};
						if(res.code){
							let data = res.data || {};
							let items = data.items || [];
							let goodsList = []
							for(let i = 0; i < items.length; i++){
								goodsList.push({
									id: items[i].id,
									goods_id: items[i].goods_id,
									img_url_thumb: items[i].act_img,
									goods_name: items[i].goods_name,
									name: items[i].name,
									sale_price: items[i].max_presale_amount,
									market_price: items[i].max_market_price,
								})
							}
							this.goodsList = goodsList || [];
						}
					})
				}
				else{
					this.goodsList = this.info.goodsList;
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
