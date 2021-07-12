<template>
    <div>
        <Modal
          class="service-form"
	        v-model="modalShow"
	        :title="modalTitle"
	        :loading="modalLoading"
          :mask-closable="false"
	        @on-ok="confirm">
            <Form ref="formValidate" :model="formItem"  :rules="ruleValidate" :label-width="80">
              <FormItem label="服务名称" prop="name">
                <Input v-model="formItem.name" placeholder="请输入服务名称"></Input>
              </FormItem>
              <FormItem label="服务描述" prop="service_desc">
                <Input v-model="formItem.service_desc" type="textarea" placeholder="请输入服务描述"></Input>
              </FormItem>
              <FormItem label="是否显示" prop="enable">
                <i-switch v-model="formItem.enable" size="large">
                    <span slot="open">显示</span>
                    <span slot="close">隐藏</span>
                </i-switch>
              </FormItem>
              <FormItem label="服务图标" prop="logo">
                <image-edit :img="formItem.logo" @selectImg="openImagesModal('logo', formItem.logo )" @delImg="handleDelImg">
                  <p>建议尺寸：200x200像素，支持jpg、png两种格式，大小不超过500K。</p>
                </image-edit>
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
        name: '',
        service_desc: '',
        enable: true,
        id: 0
      },
      // 表单数据规则
      ruleValidate: {
        name: [{ required: true, message: '服务名称不能为空', trigger: 'blur' }]
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
          this.$ajax.post((this.formItem.id === 0 ? this.$api.ShopGoodsServiceAdd : this.$api.ShopGoodsServiceEdit), {
            name: this.formItem.name,
            service_desc: this.formItem.service_desc,
            enable: this.formItem.enable,
            icon: this.formItem.logo,
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
        this.modalTitle = '添加商品服务';
      } else {
        this.modalTitle = '编辑商品服务';
        this.formItem.logo = row.icon;
        this.formItem.name = row.name;
        this.formItem.service_desc = row.service_desc;
        this.formItem.enable = !!(Number(row.enable));
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

<style lang="less" scoped>
.service-form{

}
</style>
