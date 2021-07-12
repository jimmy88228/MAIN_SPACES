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
          <FormItem label="分类名称" prop="label_name">
            <Input v-model="formItem.label_name" placeholder="请输入品牌名称"></Input>
          </FormItem>
          <FormItem label="活动排序">
            <edit-sort v-model="formItem.sort" @checkVaild="handleSort"></edit-sort>
          </FormItem>
          <FormItem label="是否启用" prop="is_enabled">
            <i-switch size="large" v-model="formItem.is_enabled" true-value="1" false-value="0">
              <span slot="open">启用</span>
              <span slot="close">关闭</span>
            </i-switch>
          </FormItem>
          <FormItem label="显示方法">
            <RadioGroup v-model="formItem.show_style" class="radio_group">
              <Radio label="0" class="radio_24">一行一个</Radio>
              <Radio label="1">一行两个</Radio>
            </RadioGroup>
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
        label_name: '',
        sort: 0,
        is_enabled: '0',
        show_style: '0'
      },
      // 表单数据规则
      ruleValidate: {
        label_name: [{ required: true, message: '分类名称不能为空', trigger: 'blur' }]
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
          this.$ajax.post((this.formItem.id === 0 ? this.$api.communitySettingCatAdd : this.$api.communitySettingCatEdit), {
            ...this.formItem,
            category_name: this.formItem.label_name
          })
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

    // 初始化表单数据
      this.formItem.id = typeof (row.id) !== 'undefined' ? Number(row.id) : 0;
      if (this.formItem.id === 0) {
        this.modalTitle = '添加分类名称';
      } else {
        this.modalTitle = '编辑分类名称';
        this.formItem.label_name = row.category_name;
        this.formItem.sort = row.sort;
        this.formItem.is_enabled = row.is_enabled;
        this.formItem.show_style = row.show_style;
      }
      return this;
    }
  }
}
</script>
