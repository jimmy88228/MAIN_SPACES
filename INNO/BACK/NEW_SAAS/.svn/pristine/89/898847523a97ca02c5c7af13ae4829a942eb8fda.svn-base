<template>
    <div>
      <Modal
        class="supplier-form"
        v-model="modalShow"
        :title="modalTitle"
        :loading="modalLoading"
        :mask-closable="false"
        @on-ok="confirm">
          <Form ref="formValidate" :model="formItem"  :rules="ruleValidate" :label-width="120">
            <FormItem label="供应商代码" prop="suppliers_code">
              <Input v-model="formItem.suppliers_code" placeholder="供应商的唯一标识码，数字和字符组成"></Input>
            </FormItem>
            <FormItem label="供应商名称" prop="suppliers_name">
              <Input v-model="formItem.suppliers_name" placeholder="请输入供应商名称"></Input>
            </FormItem>
            <FormItem label="供应商LOGO" prop="logo">
            <image-edit :img="formItem.logo" @selectImg="openImagesModal('logo', formItem.logo )" @delImg="handleDelImg">
              <p>建议尺寸：300x300像素，支持jpg、png两种格式。</p>
            </image-edit>
            </FormItem>
            <FormItem label="是否开启" prop="is_enabled">
              <i-switch v-model="formItem.is_enabled" size="large">
                  <span slot="open">开启</span>
                  <span slot="close">关闭</span>
              </i-switch>
            </FormItem>
          </Form>
      </Modal>
    </div>
</template>
<script>
import ImageEdit from '@/views/my-components/image-edit/image-edit';

export default {
  components: {
    ImageEdit
  },
  data () {
    return {
      modalShow: false,
      modalTitle: '',
      modalLoading: true,
      formItem: {
        logo: '',
        suppliers_code: '',
        suppliers_name: '',
        id: 0,
        is_enabled: false
      },
      // 表单数据规则
      ruleValidate: {
        suppliers_code: [{ required: true, message: '供应商代码不能为空', trigger: 'blur' }],
        suppliers_name: [{ required: true, message: '供应商名称不能为空', trigger: 'blur' }]
      }
    }
  },
  methods: {
    handleDelImg () {
      this.formItem.logo = '';
    },
    confirm () {
      this.$refs.formValidate.validate((valid) => {
        if (valid) {
          // ajax 保存数据，头像是通过字符串的形式上传的
          this.$ajax.post((this.formItem.id === 0 ? this.$api.goodsSupplierAdd : this.$api.goodsSupplierEdit), {
            suppliers_name: this.formItem.suppliers_name,
            portrait_path: this.formItem.logo,
            suppliers_code: this.formItem.suppliers_code,
            is_enabled: this.formItem.is_enabled,
            id: this.formItem.id
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
          this.$Message.error('必填项不能为空！');
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
      this.formItem.id = typeof (row.id) !== 'undefined' ? Number(row.id) : 0;
      if (this.formItem.id === 0) {
        this.modalTitle = '添加供应商';
      } else {
        this.modalTitle = '编辑供应商';
        this.formItem.logo = row.portrait_path;
        this.formItem.suppliers_code = row.suppliers_code;
        this.formItem.suppliers_name = row.suppliers_name;
        this.formItem.is_enabled = !!(Number(row.is_enabled));
      }
    },
    // 调起图片选择器
    openImagesModal (name, url) {
      let that = this;
      this.$selectMaterial({
        type: 'image',
        selectedData: url,
        getList (item) {
          that.$set(that.formItem, name, item.src);
        }
      });
    }
  }
}
</script>
