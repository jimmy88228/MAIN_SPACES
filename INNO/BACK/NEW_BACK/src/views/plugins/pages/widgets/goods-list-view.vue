<style lang="less">
.editor-goods-list-view{
	position: relative;
	overflow: hidden;

	.goods-item{
		padding-bottom:10px;
		background-color: #fff;
		border: 1px solid rgba(0,0,0,.03);
		
		.img-box{
			background: center center no-repeat;
			background-size: 100% auto;
			width:100%;
			margin:0 auto;
		}
		.name{
			padding:5px 5px 2px 5px;
			font-size:13px;
		}
		.price{
			padding:2px 5px;
			font-size:13px;
		}

		.list-name{
			padding:0 5px 0 0;
			font-size:14px;
		}
		.list-price{
			padding:2px 5px 2px 0;
			font-size:13px;
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
	<div class="editor-goods-list-view">

		<template v-if="info.goodsGroup.length > 0">
			<Tabs v-if="info.goodsGroup.length > 1" :value="info.currTab">
				<TabPane
				v-for="(group, gindex) in info.goodsGroup" :key="gindex"
				:label="group.name"
				:name="'tab'+gindex"></TabPane>
			</Tabs>

			<template
			v-for="(group, gindex) in info.goodsGroup"
			v-if="info.goodsGroup.length == 1 || info.currTab == 'tab'+gindex ">

			<!--指定商品列表-->
			<template v-if="group.goodsListType == 'goods' ">
				<div v-if="group.goodsList.length == 0 " class="empty">
					<Icon type="ios-shirt-outline" size="60" color="#2d8cf0"></Icon>
					<div>请添加商品&nbsp;</div>
				</div>
				
				<!--常规布局-->
				<template v-if="info.layout == 'one' || info.layout == 'two' || info.layout == 'three' || info.layout == 'four' ">
					<Row type="flex" style="flex-wrap:wrap;" :gutter="info.gutter">
						<Col v-for="(item,index) in group.goodsList" :key="index"
						v-if="info.open_slide == null
						|| info.open_slide == false
						|| ( info.open_slide == true && index +1 <= (info.layout == 'one' ? 1 : (info.layout == 'two' ? 2 : (info.layout == 'three'?3:4) )) ) "
						:span="info.layout == 'one' ? 24 : (info.layout == 'two' ? 12 : (info.layout == 'three'?8:6) )">

							<div class="goods-item" :style="{'margin-bottom': info.gutter + 'px'}">
								<div class="img-box" :style="{
									'background-image' : 'url('+item.goods_thumb+')',
									height: ( 375/(info.layout == 'one' ? 1 : (info.layout == 'two' ? 2 : (info.layout == 'three'?3:4) )) - info.gutter ) +'px'
								}"></div>
								<div v-if="info.content_switch.show_goods_name" class="name clamp">{{item.name}} {{item.goods_sn != '' ? '( '+ item.goods_sn +' )' : '' }}</div>
								<div v-if="info.content_switch.show_price" class="price">￥{{item.view_price}}</div>
								<div v-if="info.content_switch.show_goods_brief" class="price">
									<span>{{item.goods_brief}}&nbsp;</span>
								</div>
							</div>

						</Col>
					</Row>
				</template>

				<!--一大两小布局-->
				<template v-else-if="info.layout == 'bigSmall'">
					<Row type="flex" style="flex-wrap:wrap;" :gutter="info.gutter">
						<Col v-for="(item,index) in group.goodsList" :key="index"
						:span="index%3 == 0 ? 24 : 12 ">

							<div class="goods-item" :style="{'margin-bottom': info.gutter + 'px'}">
								<div class="img-box" :style="{
									'background-image':'url('+item.goods_thumb+')',
									height: ( 375/(index%3 == 0 ? 1 : 2) - info.gutter ) +'px'
								}"></div>
								<div v-if="info.content_switch.show_goods_name" class="name clamp">{{item.name}} {{item.goods_sn != '' ? '( '+ item.goods_sn +' )' : '' }}</div>
								<div v-if="info.content_switch.show_price" class="price">￥{{item.view_price}}</div>
								<div v-if="info.content_switch.show_goods_brief" class="price">
									<span>{{item.goods_brief}}&nbsp;</span>
								</div>
							</div>

						</Col>
					</Row>
				</template>

				<!--列表形式的布局-->
				<template v-else-if="info.layout == 'list' ">
					<div v-for="(item,index) in group.goodsList" :key="index"
					class="goods-item" style="margin-bottom:3px;padding:5px;">
						<Row type="flex" :gutter="16">
							<Col style="width:120px">
								<div class="img-box" :style="{'background-image':'url('+item.goods_thumb+')',height:'100px'}"></div>
							</Col>
							<Col style="flex:1 1 0%;">
								<div v-if="info.content_switch.show_goods_name" class="list-name clamp2">{{item.name}}</div>
								<div v-if="info.content_switch.show_goods_name" class="list-name" style="font-size:12px;">{{item.goods_sn != '' ? '( '+ item.goods_sn +' )' : '' }}</div>
								<div v-if="info.content_switch.show_price" class="list-price" style="margin-top:15px;">
									<span style="text-decoration: line-through;">￥{{item.view_market_price}}</span>
									<span>￥{{item.view_price}}</span>
								</div>
								<div v-if="info.content_switch.show_goods_brief" class="price">
									<span>{{item.goods_brief}}&nbsp;</span>
								</div>
							</Col>
						</Row>
					</div>
				</template>

			</template>

			<!--商品分类列表，品牌列表 等-->
			<div v-else-if="demoList[gindex].length > 0">

				<!--常规布局-->
				<template v-if="info.layout == 'one' || info.layout == 'two' || info.layout == 'three' || info.layout == 'four' ">
					<Row type="flex" style="flex-wrap:wrap;" :gutter="info.gutter">
						<Col v-for="(item,index) in demoList[gindex]" :key="index"
						v-if="info.open_slide == null || info.open_slide == false
						|| ( info.open_slide == true && index +1 <= (info.layout == 'one' ? 1 : (info.layout == 'two' ? 2 : 3)) ) "
						:span="info.layout == 'one' ? 24 : (info.layout == 'two' ? 12 : ( info.layout == 'three' ? 8 : 6 ) )">

							<div class="goods-item" :style="{'margin-bottom': info.gutter + 'px'}">
								<div class="img-box" :style="{
									'background-image' : 'url('+item.goods_thumb+')',
									height: ( 375/(info.layout == 'one' ? 1 : (info.layout == 'two' ? 2 : 3)) - info.gutter ) +'px'
								}"></div>
								<div v-if="info.content_switch.show_goods_name" class="name clamp">
								{{item.name}} {{item.goods_sn != '' ? '( '+ item.goods_sn +' )' : '' }}
								</div>
								<div v-if="info.content_switch.show_price" class="price">￥{{item.view_price}}</div>
								<div v-if="info.content_switch.show_goods_brief" class="price">
									<span>{{item.goods_brief}}&nbsp;</span>
								</div>
							</div>

						</Col>
					</Row>
				</template>

				<!--一大两小布局-->
				<template v-else-if="info.layout == 'bigSmall'">
					<Row type="flex" style="flex-wrap:wrap;" :gutter="info.gutter">
						<Col v-for="(item,index) in demoList[gindex]" :key="index"
						:span="index%3 == 0 ? 24 : 12 ">

							<div class="goods-item" :style="{'margin-bottom': info.gutter + 'px'}">
								<div class="img-box" :style="{
									'background-image':'url('+item.goods_thumb+')',
									height: ( 375/(index%3 == 0 ? 1 : 2) - info.gutter ) +'px'
								}"></div>
								<div v-if="info.content_switch.show_goods_name" class="name clamp">{{item.name}} {{item.goods_sn != '' ? '( '+ item.goods_sn +' )' : '' }}</div>
								<div v-if="info.content_switch.show_price" class="price">￥{{item.view_price}}</div>
								<div v-if="info.content_switch.show_goods_brief" class="price">
									<span>{{item.goods_brief}}&nbsp;</span>
								</div>
							</div>

						</Col>
					</Row>
				</template>

				<!--列表形式的布局-->
				<template v-else-if="info.layout == 'list' ">
				<div v-for="(item,index) in demoList[gindex]" :key="index"
				class="goods-item" style="margin-bottom:3px;padding:5px;">
					<Row type="flex" :gutter="16">
						<Col style="width:120px">
							<div class="img-box" :style="{'background-image':'url('+item.goods_thumb+')',height:'100px'}"></div>
						</Col>
						<Col style="flex:1 1 0%;">
							<div v-if="info.content_switch.show_goods_name" class="list-name clamp2">{{item.name}}</div>
							<div v-if="info.content_switch.show_goods_name" class="list-name" style="font-size:12px;">
							{{item.goods_sn != '' ? '( '+ item.goods_sn +' )' : '' }}
							</div>
							<div v-if="info.content_switch.show_price" class="list-price" style="margin-top:15px;">
								<span style="text-decoration: line-through;">￥{{item.view_market_price}}</span>
								<span>￥{{item.view_price}}</span>
							</div>
							<div v-if="info.content_switch.show_goods_brief" class="price">
								<span>{{item.goods_brief}}&nbsp;</span>
							</div>
						</Col>
					</Row>
				</div>
			</template>
			</div>
			<div v-else-if="demoList[gindex].length == 0">
				<div style="text-align: center;line-height: 2;">暂无数据</div>
			</div>
		</template>
		</template>
		<!--空白的情况-->
		<div v-else class="empty">
			<Icon type="ios-shirt-outline" size="60" color="#2d8cf0"></Icon>
			<div>请点击编辑</div>
		</div>
		
		<!--加载提示-->
		<Spin size="large" fix v-if="spinShow"></Spin>
	</div>
</template>

<script>
/**
 * 商品渲染组件
 */
export default {
	name: 'goodsListView',
    components: {

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
			info:{
				goodsGroup:[],
			},
			dataList:[],

			demoList: [],
			
			spinShow: false,
		}
	},
	computed: {

	},
	methods: {
		init(){
			this.dataList = this.inTab ? this.$store.state.app.tabPageCompList : this.$store.state.app.pageCompList;
			this.info = this.dataList[ this.currIndex ].setting;

			if( typeof(this.info.goodsGroup) == 'undefined' ){
				this.$set(this.info, 'goodsGroup', []);
			}

			this.initData();
		},
		initData(){
			let img = this.$util.apiHost + '/../image/show/assets-images-no_photo.jpg';

			if( this.info.goodsGroup.length > 0 ){
				for(var i in this.info.goodsGroup ){
					if( this.info.goodsGroup[i].goodsListType !='goods' ){
						this.spinShow = true;
						// 动态获取
						this.$ajax.post( this.$api.goodsList , {
							isInit: 2,
							page: 1,
							pageSize: ( Number( this.info.goodsGroup[i].showNum ) == 0 ? 20 : this.info.goodsGroup[i].showNum ),
							cat_id: ( this.info.goodsGroup[i].goodsListType == 'goodsCat' ? this.info.goodsGroup[i].goodsList[0].id : null ),
							vcat_id: ( this.info.goodsGroup[i].goodsListType == 'vcat' ? this.info.goodsGroup[i].goodsList[0].id : null ),
							goods_brand_id: ( this.info.goodsGroup[i].goodsListType == 'goodsBrand' ? this.info.goodsGroup[i].goodsList[0].id : null )
						})
						.then((response) => {
							this.spinShow = false;
							var res = response.data;
							if (res.code) {
								// 初始化表数据
								if( res.data.items != null ){
									let arr = [];
									res.data.items.forEach( (item)=>{
										arr.push({
											name: item.name,
											goods_thumb: item.goods_thumb,
											min_price: item.min_price,
											max_price: item.max_price,
											view_price: this.$util.price(item.min_price,item.max_price),
											view_market_price: this.$util.marketPrice(item.min_market_price,item.max_market_price),
											sale_price: item.shop_price,
											min_market_price: item.min_market_price,
											max_market_price: item.max_market_price,
											market_price: item.market_price,
											goods_brief: item.goods_brief,
											goods_sn: item.goods_sn,
										});
									});
									
									this.$set( this.demoList, i, arr);
								}
							}
						});
													
						/*
						if( this.info.layout == 'one' ){
							this.$set(this.demoList, i , [
								{name:'商品名称1', goods_thumb:img, sale_price:120, market_price:150, goods_sn:'WX0012'},
								{name:'商品名称2', goods_thumb:img, sale_price:110, market_price:140, goods_sn:'WX0013'},
								{name:'商品名称3', goods_thumb:img, sale_price:100, market_price:130, goods_sn:'WX0014'},
							]);
						}
						else{
							this.$set(this.demoList, i , [
								{name:'商品名称1', goods_thumb:img, sale_price:120, market_price:150, goods_sn:'WX0012'},
								{name:'商品名称2', goods_thumb:img, sale_price:110, market_price:140, goods_sn:'WX0013'},
								{name:'商品名称3', goods_thumb:img, sale_price:100, market_price:130, goods_sn:'WX0014'},
								{name:'商品名称4', goods_thumb:img, sale_price:130, market_price:160, goods_sn:'WX0015'},
								{name:'商品名称5', goods_thumb:img, sale_price:140, market_price:150, goods_sn:'WX0016'},
								{name:'商品名称6', goods_thumb:img, sale_price:150, market_price:170, goods_sn:'WX0017'},
							]);
						}*/
					}
					else{
						this.$set(this.demoList, i , []);
					}
				}
			}
		}
	},
	watch:{
		'info':{
			handler( to, from ){
				this.initData();
			},
			deep: true,
		}
	},
	mounted () {
	    this.init();
	},
}
</script>
