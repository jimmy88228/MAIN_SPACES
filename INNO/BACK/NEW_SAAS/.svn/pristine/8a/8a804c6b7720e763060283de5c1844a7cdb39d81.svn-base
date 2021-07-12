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
        <FormItem label="标签名称" prop="tagName">
          <Input v-model="formItem.tagName" placeholder="请输入标签名称"></Input>
        </FormItem>
        <FormItem label="是否显示" prop="isShow">
          <i-switch v-model="formItem.isShow" size="large" :true-value="1" :false-value="0">
            <span slot="open">开启</span>
            <span slot="close">关闭</span>
          </i-switch>
        </FormItem>
        <FormItem label="排序">
          <edit-sort v-model="formItem.tagOrder" @checkVaild="handleSort"></edit-sort>
        </FormItem>
        <FormItem label="图片" prop="pic_path">
          <image-edit :img="formItem.pic_path" @selectImg="openImagesModal('pic_path', formItem.pic_path )" @delImg="handleDelImg">
            <p>建议尺寸：500x500像素，支持jpg、png两种格式，大小不超过500K。</p>
          </image-edit>
        </FormItem>
      </Form>
    </Modal>
  </div>
</template>

<script>
import EditSort from '@/views/my-components/edit-sort/edit-sort';
import ImageEdit from '@/views/my-components/image-edit/image-edit';

export default {
  components: {
    EditSort,
    ImageEdit
  },
  data () {
    return {
      modalShow: false,
      modalTitle: '',
      modalLoading: true,
      formItem: {
        id: 0,
        tagName: '',
        isShow: 0,
        tagOrder: 0,
        pic_path: ''
      },
      // 表单数据规则
      ruleValidate: {
        tagName: [{ required: true, message: '标签名称不能为空', trigger: 'blur'}]
      },
      sortVaild: false
    }
  },
  methods: {
    handleDelImg () {
      this.formItem.pic_path = '';
    },
    confirm () {
      this.$refs.formValidate.validate((valid) => {
        if (valid && this.sortVaild) {
          // ajax 保存数据，头像是通过字符串的形式上传的
          this.$ajax.post((this.formItem.id === 0 ? this.$api.ShopGoodsAddTag : this.$api.ShopGoodsEditTag), {
            tag_id: this.formItem.id,
            tag_name: this.formItem.tagName,
            is_show: this.formItem.isShow,
            tag_order: this.formItem.tagOrder,
            pic_path: this.formItem.pic_path
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
      this.formItem.id = typeof (row.tag_id) !== 'undefined' ? Number(row.tag_id) : 0;
      if (this.formItem.id === 0) {
        this.modalTitle = '添加标签';
      } else {
        this.modalTitle = '编辑标签';
        this.formItem.tagName = row.tag_name;
        this.formItem.isShow = Number(row.is_show);
        this.formItem.tagOrder = Number(row.tag_order);
        this.formItem.pic_path = row.pic_path;
      }
    },
    openImagesModal (name, url) {
      let that = this;
      this.$selectMaterial({
        type: 'image',
        selectedData: url,
        getList (item) {
          that.formItem.pic_path = item.src;
        }
      });
    },
    handleSort (bool) {
      this.sortVaild = bool;
    }
  }
}
</script>
