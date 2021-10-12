<template>
  <Card class="setting">
    <div class="header flex f-just-between">
			<div class="page-divider">消息推送</div>
      <Button type="primary">重置消息模板</Button>
    </div>
    <p class="strong_tips tip">说明: 在不同的业务场景下，品牌可以通过功能向会员推送微信通知消息， 同时，品牌可以通过设置通知消息的关联跳转内容， 为会员提供更多的品牌资讯。实现更好的客户体验， 在使用该功能前需要进行微信第三方授权以及对相应的消息模板进行配置。</p>
    <Card style="width:300px;margin-bottom:10px;margin-right:10px;" v-for="(item, index) in tplist" :key="item.tpl_id">
        <p slot="title">{{item.tpl_title}}</p>
				<div class="flex f-just-between">
					<p>
						<span  style="color:#57d5f3;" v-show="item.get_weixin_brand_msg_tpl[0].is_open == 1">已启用</span>
						<span v-show="item.get_weixin_brand_msg_tpl[0].is_open == 0">未启用</span>
						<span v-show="item.get_weixin_brand_msg_tpl[0].weixin_tpl_id == ''">未设置模板</span>
					</p>
					<Button v-show="item.get_weixin_brand_msg_tpl[0].weixin_tpl_id != ''" type="primary" @click="openModal(item.get_weixin_brand_msg_tpl[0].brand_tpl_id)">设置</Button>
				</div>
    </Card>
    <BrandForm ref="brandForm" @save="loadData"></BrandForm>
  </Card>
</template>

<script>
import BrandForm from './setting-form';

export default {
  components: {
    BrandForm
  },
	data(){
		return {
			tplist: []
		}
	},
  methods: {
    openModal (brand_tpl_id) {
      this.$refs.brandForm.setData({ id: brand_tpl_id }).show();
    },
		loadData(){
			this.$store.commit('setLoading', true);
			this.$ajax.post(this.$api.CloudDistributionTplList).then((response)=>{
				let res = response.data || {};
				if(res.code){
					this.tplist = res.data || [];
				} else {
					this.$Message.warning(res.message);
				}
			}).finally(()=>{
				this.$store.commit('setLoading', false);
			})
		}
  },
	mounted(){
		this.loadData();
	}
}
</script>

<style lang="less" scoped>
.setting{
  .tip{
    margin: 24px 0;
  }
}
</style>
