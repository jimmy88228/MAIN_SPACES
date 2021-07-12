<template>
	<Card class="goods-list">
		<Tabs name="commentList" :value="currTabs" :animated="false" type="card" @on-click="onTabsClick">
	        <TabPane name="wechat" label="微商城-商品评论" tab="commentList">
	        	<goodsComment ref="list-on-sale" type="wechat" :currTabs="currTabs"></goodsComment>
	        </TabPane>
	        <!-- <TabPane name="store" label="店铺-商品评论" tab="commentList">
	        	<goodsComment ref="list-not-sale"  type="store" :currTabs="currTabs"></goodsComment>
	        </TabPane> -->
	   </Tabs>
	</Card>
</template>

<script>
/**
 * 商品列表
 */
import GoodsComment from './goods-comment';

export default {
  components: {
    GoodsComment
  },
  data () {
    	return {
      currTabs: 'wechat'
    	}
   	},
		mounted(){
			this.onTabsClick("wechat");
		},
   	methods: {
    	onTabsClick (name) {
    		this.currTabs = name;
				if(name == "wechat"){
					this.$refs["list-on-sale"].loadData();
				} else if(name == "store") {
					this.$refs["list-not-sale"].loadData();
				}
    	}
  }
}
</script>

<style lang="less">
.goods-list{
	.ivu-tabs-tab{
		font-size:12px;
		line-height:23px;
	}
}
</style>
