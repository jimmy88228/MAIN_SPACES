<template>
  <div>
    <Modal
      class="brand-form"
      v-model="modalShow"
      :title="tpInfo.tpl_title"
      :mask-closable="maskClose"
      @on-ok="confirm">
        <div style="margin-bottom: 24px;">
          <label>微信模板</label>
          <i-switch size="large" v-model="is_open" true-value="1" false-value="0">
            <span slot="open">启用</span>
            <span slot="close">关闭</span>
          </i-switch>
        </div>
        <Card style="width:350px">
          <p slot="title">{{tpInfo.tpl_title}}</p>
          <p>8月8日</p>
					<p class="m-bottom-5" v-for='(item, index) in content_list' :key="index">{{item}}</p>
          <div class="details" style="height: 60px; line-height: 60px; text-align: center; border: 1px dashed red; border-radius: 5px;cursor: pointer;">
            点击查看详情
          </div>
        </Card>
    </Modal>
  </div>
</template>
<script>
import Dialog from '@/libs/dialog';

export default {
  mixins: [Dialog],
  data () {
    return {
			tpInfo: {},
			weixinBrandMsgTpl: {},
			is_open: '0',
			content_list: [],
			brand_tpl_id: 0,
    }
  },
  methods: {
    confirm () {
			if(this.is_open == this.weixinBrandMsgTpl.is_open) return;
			this.$ajax.post(this.$api.distributionTplSave,{
				id: this.brand_tpl_id,
				is_open: this.is_open
			}).then((response)=>{
				let res = response.data || {};
				if(res.code){
					this.$Message.success(res.message);
					this.$emit("save");
				} else {
					this.$Message.warning(res.Message);
				}
			})
    },
    // 打开模态框
    setData (data) {
			this.brand_tpl_id = data.id || 0;
			this.getInfo(data.id);
      return this;
    },
		getInfo(id){
			if(!id) return;
			this.$ajax.post(this.$api.distributionTplInfo,{
				id: id
			}).then((response)=>{
				let res = response.data || {};
				if(res.code){
					let data = res.data || {};
					this.tpInfo = data;
					this.weixinBrandMsgTpl = (data.get_weixin_brand_msg_tpl && data.get_weixin_brand_msg_tpl[0])|| {};
					this.is_open = JSON.parse(JSON.stringify(this.weixinBrandMsgTpl.is_open));
					this.content_list = data.content_demo_list || [];
				} else {
					this.$Message.warning(res.message);
				}
			}).finally(()=>{
				
			})
		}
  }
}
</script>

