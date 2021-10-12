<style lang="less">
.cs-goods-box{
	margin-top: 10px;

	.goods-box{

		.goods-image-box{
			background: center center no-repeat #fff;
			background-size: 100% auto;
			width: 100%;
			height:250px;
			border: 1px solid #ddd;
		}
		.text{
			margin-top:5px;
		}
	}
	.ivu-form-item{
		margin-bottom: 0;
	}
}
</style>

<template>
	<div>
		<Modal v-model="showGoods" title="商品详情" class="cs-goods-box" footer-hide style="border-top:5px solid #eee;">

			<div class="goods-box">
				<div class="goods-image-box" :style="{'background-image':'url('+info.img_url_format+')'}"></div>
				<div class="text">
					<div class="clamp2">{{info.name}}</div>
					<div>{{info.spu}}</div>
					<div>￥{{Number(info.min_price) > 0 ? info.min_price +'~'+ info.max_price : info.sale_price}}</div>
					<div><del>￥{{Number(info.min_market_price) > 0 ? info.min_market_price +'~'+ info.max_market_price : info.market_price}}</del></div>
				</div>
			</div>

      <div style="text-align: right;">
        <a href="#" slot="extra" @click.prevent="viewGoods">
          详情
        </a>
      </div>

			<!--加载提示-->
			<Spin size="large" fix v-if="spinShow"></Spin>
		</Modal>
	</div>
</template>

<script>
/**
 * 用户详情框组件 组件
 */
export default {
	name:"csGoodsBox",
    components: {
	},
	props:{

	},
	data () {
	    return {
			showGoods: false,
			spinShow: false,
			goodsId: '',

			info:{},
		}
	},
	methods: {
		openModal( card ){
			this.showGoods = true;

			var pathObj = this.getQueryObject( card.PagePath );
			this.goodsId = pathObj.goods_id;

			this.spinShow = true;
			// ajax 请求获取数据
			this.$ajax.post( this.$api.goodsInfo, {
				goods_id: this.goodsId,
			})
			.then( (response) => {
				this.spinShow = false;
				var res = response.data;
				if( res.code ){
					this.info = res.data;
				}
				else{
					this.$Modal.error({
			            title: res.message ,
			            content: '',
			        });
				}
			});
		},
		// 解析url
		getQueryObject( url ) {
			var search = url.substring( url.lastIndexOf("?") + 1);
			var obj = {};
			var reg = /([^?&=]+)=([^?&=]*)/g;
			search.replace(reg, function (rs, $1, $2) {
				var name = decodeURIComponent($1);
				var val = decodeURIComponent($2);
				obj[name] = String(val);

			});
			return obj;
		},
		closeModal(){
			this.showGoods = false;
		},
		viewGoods(){

			// h5 预览页面
			window.open('/goods/goods-edit/'+this.goodsId );
		}
	},
	watch:{

	}
}
</script>
