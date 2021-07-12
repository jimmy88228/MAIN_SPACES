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
          <FormItem label="小组名称" prop="groupName">
            <Input v-model="formItem.groupName" placeholder="请输入小组名称"></Input>
          </FormItem>
          <FormItem label="排序值">
						<edit-sort v-model="formItem.sort" @checkVaild="handleSort"></edit-sort>
					</FormItem>
      </Form>
    </Modal>
  </div>
</template>
<script>
import EditSort from '@/views/my-components/edit-sort/edit-sort';
import Dialog from '@/libs/dialog';

export default {
  mixins: [Dialog],
  components: {
    EditSort
  },
  data () {
    return {
      formItem: {
        groupName: '',
        sort: 0,
        groupId: 0
      },
      // 表单数据规则
      ruleValidate: {
        groupName: [{ required: true, message: '小组名称不能为空', trigger: 'blur' }]
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
        if (valid && this.sortVaild) {
          // ajax 保存数据，头像是通过字符串的形式上传的
          this.$ajax.post((this.formItem.groupId === 0 ? this.$api.shopSettingAddgroup : this.$api.shopSettingEdit), {
            id: this.formItem.groupId,
            group_name: this.formItem.groupName,
            sort: this.formItem.sort
	        })
		    		.then((response) => {
		    			var res = response.data;

		    			if (res.code) {
		    				// 保存成功
                this.$Message.success(res.message);
                this.modalShow = false;
                this.$emit('on-success')
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
      console.log(row)
      // 重置表单
      this.$refs.formValidate.resetFields();

      // 初始化表单数据
      this.formItem.groupId = typeof (row.id) !== 'undefined' ? Number(row.id) : 0;
      if (this.formItem.groupId === 0) {
        this.modalTitle = '添加分组';
      } else {
        this.modalTitle = '编辑分组';
        this.formItem.sort = row.sort;
        this.formItem.groupName = row.group_name;
      }
      return this;
    }
  }
}
</script>
