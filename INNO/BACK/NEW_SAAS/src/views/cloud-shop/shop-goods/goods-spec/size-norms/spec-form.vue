<template>
  <div class="spec_form">
    <Modal
      v-model="modalShow"
      :title="modalTitle"
      :loading="modalLoading"
      :footer-hide="modalFooterHide"
      :mask-closable="allowClose"
      @on-ok="modalOk">
        <Form ref="formValidate" :model="formItem" :rules="ruleValidate" :label-width="80">
          <FormItem label="分类名称" prop="name">
            <Input v-model="formItem.name" placeholder="请输入分类名称"></Input>
          </FormItem>
          <FormItem label="排序号">
            <edit-sort v-model="formItem.sortOrder" @checkVaild="handleSort"></edit-sort>
          </FormItem>
        </Form>
    </Modal>
  </div>
</template>

<script>
import util from '@/libs/util.js';
import EditSort from '@/views/my-components/edit-sort/edit-sort';

export default {
  name: 'specForm',
  components: {
    EditSort
  },
  data () {
    return {
      // 表单内容
      formItem: {
        id: 0,
        name: '',
        sortOrder: 0
      },
        // 表单数据规则
      ruleValidate: {
        name: [{ required: true, message: '分类名称不能为空', trigger: 'blur' }]
      },
      // 模态框
      modalShow: false,
      modalTitle: '',
      modalLoading: true,
      modalEditIndex: '',
      modalFooterHide: false,
      allowClose: false,
      sortVaild: false
    }
  },
  methods: {
    	// 打开模态框
    openModal (row, showFooter) {
      // 屏蔽 确定按钮
      this.modalFooterHide = !showFooter;
      this.modalShow = true;

      // 重置表单
      this.$refs.formValidate.resetFields();

    	// 初始化表单数据
      // 如果是新增 roleId = 0;否则就是大于0
      this.formItem.id = typeof (row.sizecat_id) !== 'undefined' ? Number(row.sizecat_id) : 0;
      if (this.formItem.id == 0) {
        this.modalTitle = '添加规格分类';
      } else {
        this.modalTitle = '修改规格分类';
        // 编辑时候的初始化数据
        this.formItem.name = row.sizecat_name;
        this.formItem.sortOrder = Number(row.sizecat_sort);
      }
    },
    // 模态框确认事件
    modalOk () {
      this.$refs.formValidate.validate((valid) => {
        if (valid && this.sortVaild) {
          // ajax 保存数据
          util.ajax.post((this.formItem.id == 0 ? util.apiUrl.ShopGoodsSizeAdd : util.apiUrl.ShopGoodsSizeEdit), {
            sizecat_id: this.formItem.id,
            sizecat_name: this.formItem.name,
            sizecat_sort: this.formItem.sortOrder
          })
          .then((response) => {
            var res = response.data;

            if (res.code) {
              // 保存成功
              this.$Message.success(res.message);
              this.modalShow = false;

              // 把数据返回给父级
              this.$emit('on-success', {
                data: res.data,
                type: (this.formItem.id == 0 ? 'add' : 'edit')
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
          this.modalLoading = false;

          setTimeout(() => {
              this.modalLoading = true;
          }, 50);
        }
      })
    },
    handleSort (bool) {
      this.sortVaild = bool;
    }
  }
}
</script>

<style lang="less" scoped>
.spec_form{

}
</style>
