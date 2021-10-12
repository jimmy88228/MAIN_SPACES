<template>
  <div>
    <Modal
      class="brand-form"
      v-model="modalShow"
      title="转账"
      :loading="modalLoading"
      :mask-closable="maskClose"
      @on-ok="confirm">
        <Form ref="formValidate" :model="formItem" :rules="ruleValidate" :label-width="80">
          <FormItem label="备注" prop="remark">
            <Input v-model="formItem.remark" placeholder="请输入备注"></Input>
          </FormItem>
          <FormItem label="转账类型" prop="payType">
            <Select v-model="formItem.payType">
              <Option :value="1">微信转账</Option>
              <Option :value="2">线下转账</Option>
            </Select>
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
        id: 0,
        remark: '',
        payType: -1
      },
      ruleValidate: {
        remark: [{ required: true, message: '备注不能为空', trigger: 'blur' }]
      }
    }
  },
  methods: {
    confirm () {
      this.$refs.formValidate.validate((valid) => {
        if (valid) {
          // ajax 保存数据，头像是通过字符串的形式上传的
          this.$ajax.post(this.$api.CloudStaffCashoutTransfer, this.formItem)
		    		.then((response) => {
		    			var res = response.data;

		    			if (res.code) {
		    				// 保存成功
                this.$Message.success(res.message);
                this.modalShow = false;

                // 把数据返回给父级
                this.$emit('on-success', {
                  type: this.formItem.goods_brand_id === 0 ? 'add' : 'edit',
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
      this.formItem.id = row.id;
      return this;
    }
  }
}
</script>
