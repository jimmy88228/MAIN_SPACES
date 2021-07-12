<style lang="less">
.cs-mini-card-box{
	.txt{
		cursor: pointer;
		font-size: 13px;
	}
	.content-box{
		width:380px;
	}
}	
</style>

<template>
	<div class="cs-mini-card-box">
		<Poptip v-model="showPoptip" placement="top-end">
			<span class="txt">小程序卡片</span>
			
			<div slot="content">
				<Button type="success" @click="onSelectGoods">发送商品卡片</Button>
				<Button type="info" @click="onSelectPage">发送活动页卡片</Button>
			</div>	
		</Poptip>
		
		<!--绑定微商品的选择器-->
		<goodsSelect ref="goods-select" @on-ok="onGoodsSelectOk"></goodsSelect>
		
		<!--活动页面选择器-->
		<goodsPageSelect ref="goods-page-select" @on-ok="onPageSelectOk"></goodsPageSelect>
	</div>
</template>

<script>
import goodsSelect from '@/views/my-components/goods-select/goods-select';
import goodsPageSelect from '@/views/my-components/goods-page-select/goods-page-select';

/**
 * 小程序卡片选择 组件
 */
export default {
	name:"csMiniCard",
    components: {
		goodsSelect,
		goodsPageSelect,
	},
	props:{

	},
	data () {
	    return {
			showPoptip:false,
		}
	},
	methods: {
		// 选择商品
		onSelectGoods(){
			this.$refs['goods-select'].openModal( [] , 'radio' );

			this.showPoptip = false;
		},
		// 商品选择的，回调
		onGoodsSelectOk( res ){
			this.$emit('on-send', {
				Title: res[0].goods_name,
				PagePath: 'pages/micro_mall/goods/goods_info?goods_id='+res[0].goods_id, // 这个是小程序的路由地址
				LocalUrl: res[0].goods_thumb,
			});
		},
		// 选择页面
		onSelectPage(){
			this.$refs['goods-page-select'].openModal( [] , 'radio' );

			this.showPoptip = false;
		},
		// 活动页选择的，回调
		onPageSelectOk( res ){
      if( res[0].cover_image_format == '' || res[0].cover_image_format == null ){
        this.$Modal.error({
          title: '错误提示',
          content: '页面的封面图片为空，不能发送！',
        });
      }
      else{
        this.$emit('on-send', {
          Title: res[0].name,
          PagePath: 'pages/micro_mall/custom_page/custom_page?page_id='+res[0].page_id, // 这个是小程序的路由地址
          LocalUrl: res[0].cover_image_format,
        });
      }
		}
	},
}
</script>
