<template>
  <div>
    <Modal
      class="group-form"
      v-model="modalShow"
      :title="modalTitle"
      :loading="modalLoading"
      :mask-closable="false"
      @on-ok="confirm">
        <Form ref="formValidate" :model="formItem"  :rules="ruleValidate" :label-width="90">
          <FormItem label="类型名称" prop="catName">
            <Input v-model="formItem.catName" placeholder="请输入类型名称"></Input>
          </FormItem>
          <FormItem label="是否开启" prop="enabled">
            <i-switch v-model="formItem.enabled" size="large">
              <span slot="open">开启</span>
              <span slot="close">关闭</span>
            </i-switch>
          </FormItem>
          <FormItem label="类型说明" prop="attrGroup">
            <Input v-model="formItem.attrGroup" type="textarea"></Input>
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
        catName: '',
        attrGroup: '',
        enabled: false
      },
      // 表单数据规则
      ruleValidate: {
        catName: [{ required: true, message: '类型名称不能为空', trigger: 'blur' }]
      }
    }
  },
  methods: {
    confirm () {
      this.$refs.formValidate.validate((valid) => {
        if (valid) {
          // ajax 保存数据，头像是通过字符串的形式上传的
          this.$ajax.post((this.formItem.id === 0 ? this.$api.ShopGoodsAttrGroupAdd : this.$api.ShopGoodsAttrGroupEdit), {
            cat_id: this.formItem.id,
            attr_group: this.formItem.attrGroup,
            cat_name: this.formItem.catName,
            enabled: this.formItem.enabled
	        })
		    		.then((response) => {
		    			var res = response.data;
		    			if (res.code) {
		    				// 保存成功
                this.$Message.success(res.message);
                this.modalShow = false;
                // 把数据返回给父级
                this.$emit('on-success', {
                  type: this.formItem.id === 0 ? 'add' : 'edit',
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
          // 验证失败，不关闭模态框
          this.modalShow = true;
          this.modalLoading = false;

          setTimeout(() => {
              this.modalLoading = true;
          }, 50);
        }
      });
    },
    // 打开模态框
    openModal (row) {
      // 屏蔽 确定按钮
      this.modalShow = true;
      // 重置表单
      this.$refs.formValidate.resetFields();

    	// 初始化表单数据
      this.formItem.id = typeof (row.cat_id) !== 'undefined' ? Number(row.cat_id) : 0;
      if (this.formItem.id === 0) {
        this.modalTitle = '添加类型分组';
      } else {
        this.modalTitle = '编辑类型分组';
        this.formItem.catName = row.cat_name;
        this.formItem.attrGroup = row.attr_group;
        this.formItem.enabled = !!(Number(row.enabled));
      }
    }
  }
}
</script>
