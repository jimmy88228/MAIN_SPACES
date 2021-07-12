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
          <FormItem label="标签名称" prop="goods_brand_name">
            <Input v-model="formItem.goods_brand_name" placeholder="请输入标签名称"></Input>
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
        goods_brand_name: '',
        goods_brand_id: 0,
        sort: 0,
        is_enabled: '0'
      },
      // 表单数据规则
      ruleValidate: {
        goods_brand_name: [{ required: true, message: '标签名称不能为空', trigger: 'blur' }]
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
          this.$ajax.post((this.formItem.goods_brand_id === 0 ? this.$api.goodsBrandAdd : this.$api.goodsBrandEdit), {
            goods_brand_name: this.formItem.goods_brand_name,
            goods_brand_image: this.formItem.logo,
            goods_brand_code: this.formItem.goods_brand_code,
            goods_brand_id: this.formItem.goods_brand_id
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
      this.formItem.goods_brand_id = typeof (row.goods_brand_id) !== 'undefined' ? Number(row.goods_brand_id) : 0;
      if (this.formItem.goods_brand_id === 0) {
        this.modalTitle = '添加标签名称';
      } else {
        this.modalTitle = '编辑标签名称';
        this.formItem.logo = row.goods_brand_image;
        this.formItem.goods_brand_code = row.goods_brand_code;
        this.formItem.goods_brand_name = row.goods_brand_name;
      }
      return this;
    }
  }
}
</script>
