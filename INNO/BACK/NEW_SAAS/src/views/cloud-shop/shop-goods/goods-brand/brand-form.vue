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
          <FormItem label="品牌代码" prop="goods_brand_code">
            <Input v-model="formItem.goods_brand_code" placeholder="品牌的唯一标识码，数字和字符组成"></Input>
          </FormItem>
          <FormItem label="品牌名称" prop="goods_brand_name">
            <Input v-model="formItem.goods_brand_name" placeholder="请输入品牌名称"></Input>
          </FormItem>
          <FormItem label="品牌图片" prop="logo">
            <image-edit :img="formItem.logo" @selectImg="openImagesModal('logo', formItem.logo )" @delImg="handleDelImg">
              <p>建议尺寸：500x500像素，支持jpg、png两种格式，大小不超过500K。</p>
            </image-edit>
          </FormItem>
      </Form>
    </Modal>
  </div>
</template>
<script>
import Dialog from '@/libs/dialog';
import ImageEdit from '@/views/my-components/image-edit/image-edit';

export default {
  mixins: [Dialog],
  components: {
    ImageEdit
  },
  data () {
    return {
      formItem: {
        logo: '',
        goods_brand_code: '',
        goods_brand_name: '',
        goods_brand_id: 0
      },
      // 表单数据规则
      ruleValidate: {
        goods_brand_code: [
          { required: true, message: '品牌代码不能为空', trigger: 'blur' },
          { min: 4, max: 20, message: '品牌代码不能小于4个字符，最大20个字符！品牌名称', trigger: 'blur' }
        ],
        goods_brand_name: [{ required: true, message: '品牌名称不能为空', trigger: 'blur' }]
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
          this.$ajax.post((this.formItem.goods_brand_id === 0 ? this.$api.ShopGoodsBrandAdd : this.$api.ShopGoodsBrandEdit), {
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
        this.modalTitle = '添加商品品牌';
      } else {
        this.modalTitle = '编辑商品品牌';
        this.formItem.logo = row.goods_brand_image;
        this.formItem.goods_brand_code = row.goods_brand_code;
        this.formItem.goods_brand_name = row.goods_brand_name;
      }
      return this;
    },
    returnImageUrl (obj) {
      this.$set(this.formItem, obj.name, obj.val);
    },
    // 调起图片选择器
    openImagesModal (name, url) {
      let that = this;
      this.$selectMaterial({
        type: 'image',
        selectedData: url,
        getList (item) {
          that.formItem.logo = item.src;
        }
      });
    }
  }
}
</script>
