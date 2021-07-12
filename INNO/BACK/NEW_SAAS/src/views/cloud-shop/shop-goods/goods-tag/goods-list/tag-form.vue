<template>
  <div>
    <Modal
      class="group-form"
      v-model="modalShow"
      :title="modalTitle"
      :loading="modalLoading"
      :mask-closable="false"
      @on-ok="confirm">
      <Form ref="formValidate" :model="formItem" :rules="ruleValidate" :label-width="120">
        <FormItem label="标签名称" prop="tagName">
          <Input v-model="formItem.tagName" placeholder="请输入标签名称" disabled></Input>
        </FormItem>
        <FormItem label="获取商品" prop="goods_id">
          <Input v-model="formItem.goods_id" type="textarea" v-if="formItem.goods_id" class="manager-form_sn"/>
          <Button type="dashed" @click="handleSelect" class="basic_select">选择商品</Button>
        </FormItem>
      </Form>
    </Modal>
  </div>
</template>

<script>
export default {
  data () {
    return {
      modalShow: false,
      modalTitle: '',
      modalLoading: true,
      formItem: {
        id: 0,
        tagName: '',
        goods_id: ''
      },
      ruleValidate: {
        goods_id: {required: true, message: '商品必须选择', trigger: 'change'}
      },
      goodsData: []
    }
  },
  methods: {
    confirm () {
      this.$refs.formValidate.validate((valid) => {
        if (valid) {
          this.$ajax.post(this.$api.ShopGoodsAddTagGoods, {
            tag_id: this.formItem.id,
            goods_ids: this.formItem.goods_id.split(',')
	        })
		    		.then((response) => {
              var res = response.data;
		    			if (res.code) {
		    				// 保存成功
                this.$Message.success(res.message);
                this.modalShow = false;
                // 把数据返回给父级
                this.$emit('on-success', {
                  type: 'add',
                  data: res.data
                });
              } else {
		    				this.modalShow = true;
                this.modalLoading = false;

                setTimeout(() => {
                  this.modalLoading = true;
                }, 50);
		    			}
		    		});
        } else {
          this.modalShow = true;
          this.modalLoading = false;

          setTimeout(() => {
            this.modalLoading = true;
          }, 50);
        }
      });
    },
    // 打开模态框
    openModal (row, id, tagName) {
      // 屏蔽 确定按钮
      this.modalShow = true;
      // 重置表单
      this.$refs.formValidate.resetFields();

      // 初始化表单数据
      this.modalTitle = '添加商品';
      this.formItem.id = id;
      this.formItem.tagName = tagName;
    },
    handleSelect () {
      this.$selectContent({
        mode: 'cloud-goods',
        type: 'checkbox',
        data: this.goodsData,
        getList: (data) => {
          this.goodsData = data;
          this.formItem.goods_id = data.map(item => item.id).join(',');
        }
      })
    }
  }
}
</script>

<style lang="less" scoped>
.group-form{

}
</style>
