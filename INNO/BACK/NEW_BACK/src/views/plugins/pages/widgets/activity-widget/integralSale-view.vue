

<template>
	<div class="act-sale-view integral-sale-view">
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
							<Tag :color="styleColor" class="tag">积分</Tag>
							<div class="img-box" :style="{
								'background-image' : 'url('+item.img_url_thumb+')',
								height: ( 375/(info.layout == 'one' ? 1 : (info.layout == 'two' ? 2 : 3)) - info.gutter ) +'px'
							}"></div>
							<div v-if="info.content_switch.show_goods_name" class="name clamp">{{item.name}}</div>
							
							<Row type="flex">
								<Col style="flex:1 1 0%;">
									<template  v-if="info.content_switch.show_price">
									<div class="price">￥{{item.sale_price}}+{{item.integral}}积分</div>
									<div class="market-price">￥{{item.market_price}}</div>
									</template>
								</Col>
								<Col :style="{width: info.layout == 'one' ? '190px' : ( info.layout == 'three' ? '120px' : '110px') }">
									<div v-if="info.content_switch.show_button" 
									class="btn" :style="{marginLeft: info.layout=='three' ? '8px' : '0'}">
										<div class="tname" :class="info.content_switch.show_time == false ? 'single' :'' ">积分兑换</div>
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
							<Tag :color="styleColor" class="tag">积分</Tag>
							<div class="img-box" :style="{
								'background-image':'url('+item.img_url_thumb+')',
								height: ( 375/(index%3 == 0 ? 1 : 2) - info.gutter ) +'px'
							}"></div>
							<div v-if="info.content_switch.show_goods_name" class="name clamp">{{item.name}}</div>
							
							<Row type="flex">
								<Col style="flex:1 1 0%;">
									<template v-if="info.content_switch.show_price">
									<div class="price">￥{{item.sale_price}}+{{item.integral}}积分</div>
									<div class="market-price">￥{{item.market_price}}</div>
									</template>
								</Col>
								<Col :style="{width: index%3 == 0 ? '190px' : '110px'}">
									<div v-if="info.content_switch.show_button" class="btn">
										<div class="tname" :class="info.content_switch.show_time == false ? 'single' :'' ">积分兑换</div>
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
					<Tag :color="styleColor" class="tag">积分</Tag>
					<Row type="flex" :gutter="16">
						<Col style="width:120px">
							<div class="img-box" :style="{'background-image':'url('+item.img_url_thumb+')',height:'120px'}"></div>
						</Col>
						<Col style="flex:1 1 0%;">
							<div v-if="info.content_switch.show_goods_name" class="list-name clamp2">{{item.name}}</div>
							<template v-if="info.content_switch.show_price">
							<div class="list-price" style="margin-top:15px;">
								<span>￥{{item.sale_price}} + {{item.integral}}积分</span>
							</div>
							<div class="market-price">￥{{item.market_price}}</div>
							</template>
							<div style="float:right;">
								<div v-if="info.content_switch.show_button" class="btn" style="width:130px;">
									<div class="tname" :class="info.content_switch.show_time == false ? 'single' :'' ">积分兑换</div>
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
			<Icon type="ios-basket-outline" size="60" color="#2d8cf0"></Icon>
			<div>请点击编辑 选择积分兑换商品</div>
		</div>
	</div>
</template>

<script>
import './style/comm.less'; 
import activityHeaderView from './activity-header-view.vue';
	
/**
 * 积分兑换渲染组件
 */
export default {
	name: 'integralSaleView',
	components: {
		activityHeaderView,
	},
	props:{
		currIndex:{
			type: [Number,String],
			default: 0,
		},
		// 是否使用用在 tab 导航页面内
		inTab:{
			type: Boolean,
			default: false,
		}
	},
	data () {
	    return {
			info:{},
			dataList:[],
			
			styleColor: '#D87194',
			goodsList: [],
		}
	},
	computed: {

	},
	methods: {
		init(){
			this.dataList = this.inTab ? this.$store.state.app.tabPageCompList : this.$store.state.app.pageCompList;
			this.info = this.dataList[ this.currIndex ].setting;
			
			this.initGoodsList();
		},
		initGoodsList(){
			if( this.info.activity_model == 'auto' ){
				let show_num = this.info.show_num;
				return this.$ajax.post(this.$api.integralGoodsList,{
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
								img_url_thumb: items[i].picture,
								name: items[i].name,
								goods_name: items[i].goods_name,
								sale_price: items[i].get_mk_product[0].sale_price,
								market_price: items[i].get_mk_product[0].market_price,
								integral: items[i].get_mk_product[0].integral,
								start_time: items[i].start_time,
								end_time: items[i].end_time,
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
	mounted () {
	    this.init();
	},
}
</script>
<style lang="less">
@styleColor: #D87194;	

.integral-sale-view{
	.goods-item{
		.price{
			color: @styleColor;
		}
		.btn{
			background-color: @styleColor;
		}
	}
}
</style>