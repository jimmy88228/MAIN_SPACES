<template>
  <div>
    <Modal
      class="brand-form"
      v-model="modalShow"
      :title="modalTitle"
      :loading="modalLoading"
      :mask-closable="maskClose"
      @on-ok="confirm">
        <Form ref="formValidate" :model="formItem"  :rules="ruleValidate" :label-width="80">
          <FormItem label="分类名称" prop="group_name">
            <Input v-model="formItem.group_name" placeholder="请输入分类名称"></Input>
          </FormItem>
          <FormItem label="活动状态" prop="enable">
            <i-switch size="large" v-model="formItem.enable" true-value="1" false-value="0">
              <span slot="open">开启</span>
              <span slot="close">关闭</span>
            </i-switch>
          </FormItem>
          <FormItem label="排序号">
            <edit-sort v-model="formItem.sort" @checkVaild="handleSort"></edit-sort>
          </FormItem>
      </Form>
    </Modal>
  </div>
</template>
<script>
import Dialog from '@/libs/dialog';
import EditSort from '@/views/my-components/edit-sort/edit-sort';

export default {
  mixins: [Dialog],
  components: {
    EditSort
  },
  data () {
    return {
      formItem: {
        id: 0,
        group_name: '',
        sort: 0,
        enable: '0'
      },
      // 表单数据规则
      ruleValidate: {
        group_name: [{ required: true, message: '分类名称不能为空', trigger: 'blur' }]
      },
      sortVaild: false
    }
  },
  methods: {
    handleSort (bool) {
      this.sortVaild = bool;
    },
    confirm () {
      this.$refs.formValidate.validate((valid) => {
        if (valid) {
          // ajax 保存数据，头像是通过字符串的形式上传的
          this.$ajax.post((this.formItem.id === 0 ? this.$api.CloudDistributionAdd : this.$api.CloudDistributionEdit), {
            ...this.formItem,
            show_type: '0'
          })
		    		.then((response) => {
		    			var res = response.data;

		    			if (res.code) {
		    				// 保存成功
                this.$Message.success(res.message);
                this.modalShow = false;

                // 把数据返回给父级
                this.$emit('on-success');
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
        this.modalTitle = '添加分类';
      } else {
        this.modalTitle = '编辑分类';
        this.formItem.group_name = row.group_name;
        this.formItem.sort = +row.sort;
        this.formItem.enable = row.enable;
      }
      return this;
    }
  }
}
</script>
