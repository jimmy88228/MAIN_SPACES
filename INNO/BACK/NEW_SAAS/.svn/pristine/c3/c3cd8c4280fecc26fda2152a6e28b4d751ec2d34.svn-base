<template>
  <div>
    <Modal
      class="discount-form"
      v-model="modalShow"
      :title="modalTitle"
      :loading="modalLoading"
      :mask-closable="maskClose"
      @on-ok="confirm">
        <Form ref="formValidate" :model="formItem"  :rules="ruleValidate" :label-width="100">
          <FormItem label="折扣券类型" prop="discountName">
            <Input v-model="formItem.discountName" placeholder="请输入折扣券类型"></Input>
          </FormItem>
          <FormItem label="编码" prop="code">
            <Input v-model="formItem.code" placeholder="请输入编码"></Input>
          </FormItem>
          <FormItem label="启用" prop="isEnabled">
            <i-switch v-model="formItem.isEnabled" size="large" true-value="1" false-value="0">
              <span slot="open">开启</span>
              <span slot="close">关闭</span>
            </i-switch>
          </FormItem>
      </Form>
    </Modal>
  </div>
</template>
<script>
import Dialog from '@/libs/dialog';

export default {
  mixins: [Dialog],
  data () {
    return {
      formItem: {
        discountName: '',
        code: '',
        isEnabled: '0',
        id: 0
      },
      // 表单数据规则
      ruleValidate: {
        discountName: [{ required: true, message: '折扣券类型不能为空', trigger: 'blur' }],
        code: [{ required: true, message: '编码不能为空', trigger: 'blur' }]
      }
    }
  },
  methods: {
    confirm () {
      this.$refs.formValidate.validate((valid) => {
        if (valid) {
          this.$ajax.post((this.formItem.id === 0 ? this.$api.discountTypeAdd : this.$api.discountTypeEdit), {
            id: this.formItem.id,
            name: this.formItem.discountName,
            code: this.formItem.code,
            is_enabled: this.formItem.isEnabled
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
		    				this.showLoading();
		    			}
		    		});
        } else {
          // 验证失败，不关闭模态框
          this.showLoading();
        }
      });
    },
    // 打开模态框
    setData (row) {
      // 重置表单
      this.$refs.formValidate.resetFields();

      // 初始化表单数据
      this.formItem.id = typeof (row.id) !== 'undefined' ? Number(row.id) : 0;
      if (this.formItem.id === 0) {
        this.modalTitle = '添加折扣券类型';
      } else {
        this.modalTitle = '编辑折扣券类型';
        this.formItem.discountName = row.name;
        this.formItem.code = row.code;
        this.formItem.isEnabled = row.is_enabled;
      }
      return this;
    }
  }
}
</script>
