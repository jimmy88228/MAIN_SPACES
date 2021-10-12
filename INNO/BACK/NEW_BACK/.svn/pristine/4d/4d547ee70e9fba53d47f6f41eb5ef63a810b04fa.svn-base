<template>
  <div>
    <Modal
      v-model="modalShow"
      :title="modalTitle"
      :loading="modalLoading"
      :mask-closable="allowClose"
      @on-ok="modalOk">
        <Form ref="formValidate" :model="formItem" :rules="ruleValidate" :label-width="120">
          <FormItem label="名称" prop="name">
            <Input v-model="formItem.name" placeholder="请输入名称" style="width:250px"></Input>
          </FormItem>
          <FormItem label="所属分类" prop="catName">
            <Input v-model="formItem.catName" style="width:250px" disabled></Input>
          </FormItem>
          <FormItem label="编码" prop="code">
            <Input v-model="formItem.code" placeholder="请输入编码" style="width:250px" :disabled="formItem.isDisableCode"></Input>

            <!-- <Poptip trigger="hover" placement="top-end">
              <Icon type="ios-help-circle-outline" size="25" style="margin-left:20px;"></Icon>
              <div slot="title">帮助提示</div>
              <div slot="content">
                规格码，是自定义的唯一的外部编码
              </div>
            </!-->
          </FormItem>
          <FormItem label="排序号">
            <edit-sort v-model="formItem.sortOrder" @checkVaild="handleSort"></edit-sort>
          </FormItem>
        </Form>
    </Modal>
  </div>
</template>

<script>
import EditSort from '@/views/my-components/edit-sort/edit-sort';
import util from '@/libs/util.js';

export default {
  name: 'specValueForm',
  components: {
    EditSort
  },
  data () {
    return {
    		// 表单内容
      formItem: {
        id: 0,
        sizecat_id: 0,
        catName: '',
        name: '',
        code: '',
        sortOrder: 0,
        isDisableCode: false
      },
      // 表单数据规则
      ruleValidate: {
        name: [{ required: true, message: '尺码名称不能为空', trigger: 'blur' }],
        code: [{ required: true, message: '编码不能为空', trigger: 'blur' }]
      },
      // 模态框
      modalShow: false,
      modalTitle: '',
      modalLoading: true,
      modalEditIndex: '',
      allowClose: false,
      sortVaild: false
    }
  },
  methods: {
    	// 打开模态框
    openModal (sizeCatId, id, data) {
      // 屏蔽 确定按钮
      this.modalShow = true;

      // 重置表单
      this.$refs.formValidate.resetFields();

      this.formItem.id = id;
      this.formItem.sizecat_id = sizeCatId;
      this.formItem.catName = data.sizeCatName;
      if (this.formItem.id == 0) {
        this.modalTitle = '添加尺码';
        this.formItem.isDisableCode = false;
      } else {
        this.modalTitle = '修改尺码';
        // 编辑时候的初始化数据
        this.formItem.name = data.size_name;
        this.formItem.code = data.size_code;
        this.formItem.sortOrder = Number(data.size_sort);
        this.formItem.isDisableCode = true;
      }
    },
    // 模态框确认事件
    modalOk () {
      this.$refs.formValidate.validate((valid) => {
        if (valid && this.sortVaild) {
          // ajax 保存数据
          util.ajax.post((this.formItem.id == 0 ? util.apiUrl.ShopGoodsSizeValueAdd : util.apiUrl.ShopGoodsSizeValueEdit), {
            size_name: this.formItem.name,
            size_sort: this.formItem.sortOrder,
            sizecat_id: this.formItem.sizecat_id,
            size_code: this.formItem.code,
            size_id: this.formItem.id
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
          this.$Message.error('必填项不能为空！');
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
