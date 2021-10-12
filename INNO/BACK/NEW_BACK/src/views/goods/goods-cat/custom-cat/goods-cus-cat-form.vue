<template>
  <div class="goods-cat-form">
    <Modal
      v-model="modalShow"
      :title="modalTitle"
      :loading="modalLoading"
      :mask-closable="allowClose"
      @on-ok="modalOk">
      <Form ref="formValidate" :model="formItem" :rules="ruleValidate" :label-width="100">
        <FormItem label="分类名" prop="vcatName">
          <Input v-model="formItem.vcatName" placeholder="请输入名称" style="width:200px;"></Input>
        </FormItem>
        <FormItem label="上级分类" class="spec-item">
          <Cascader
            class="basic_cascader"
            :data="sortList"
            v-model="currentSort"
            filterable
            change-on-select
            transfer
            :render-format="renderSort"
            ref="sortRef"
            :clearable="isClearable"
            @on-change="selectSort"></Cascader>
            <span v-show="validTip" class="valid_tip">所选择的上级分类不能是当前分类或者当前分类的下级分类!</span>
        </FormItem>
        <!-- <FormItem label="排序号">
          <edit-sort v-model="formItem.sortOrder" @checkVaild="handleSort"></edit-sort>
        </FormItem> -->
      </Form>
    </Modal>
  </div>
</template>
<script>
import EditSort from '@/views/my-components/edit-sort/edit-sort';

const defaultItem = {
  value: '0',
  label: '顶级分类',
  children: []
};

export default {
  components: {
    EditSort
  },
  data () {
    return {
      formItem: {
        id: 0,
        vcatName: '',
        parent_id: 0,
        sortOrder: 0,
        isShow: false,
        isRmd: false
      },
      // 表单数据规则
      ruleValidate: {
        vcatName: [{ required: true, message: '分类名不能为空', trigger: 'blur' }]
      },
      sortList: [],
      currentSort: [],
      isSortValid: true,
      validTip: false,
      isClearable: false,
      modalShow: false,
      modalLoading: true,
      allowClose: false,
      modalTitle: ''
    }
  },
  methods: {
    renderSort (labels) {
      return labels.slice(labels.length - 1).join('/');
    },
    modalOk () {
      this.$refs.formValidate.validate((valid) => {
        if (valid && this.isSortValid) {
          // ajax 保存数据，头像是通过字符串的形式上传的
          this.$ajax.post((this.formItem.id === 0 ? this.$api.goodsVcatAdd : this.$api.goodsVcatEdit), {
            vcat_id: this.formItem.id,
            vcat_name: this.formItem.vcatName,
            parent_id: this.formItem.parent_id,
            vcat_name_en: '',
            vcat_desc: '',
            sort_order: this.formItem.sortOrder,
            is_show: this.formItem.isShow,
            is_rmd: this.formItem.isRmd
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
    openModal (catListData, curData = {}) {
      this.modalShow = true;
      // 重置表单
      this.isSortValid = true;
      this.validTip = false;
      this.$refs.formValidate.resetFields();

      // 初始化表单数据
      this.formItem.sortOrder = 0;
      this.formItem.id = typeof (curData.id) !== 'undefined' ? Number(curData.id) : 0;
      this.sortAllData = [...catListData];
      this.sortList = this.handleSortList(this.sortAllData);
      this.sortList.unshift(defaultItem);
      if (this.formItem.id === 0) {
        this.modalTitle = '添加自定义分类';
        this.currentSort = [this.sortList[0].value];
      } else {
        // 编辑商品分类
        this.modalTitle = '编辑自定义分类';
        this.formItem.vcatName = curData.title;
        this.formItem.sortOrder = Number(curData.sort_order);
        this.formItem.isShow = !!Number(curData.is_show);
        this.formItem.isRmd = !!Number(curData.is_rmd);
        this.formItem.parent_id = curData.parent_id;

        if (curData.cascade) {
          this.$nextTick(() => {
            if (Object.values(curData.cascade).length) {
              this.currentSort = Object.values(curData.cascade);
            } else {
              // 顶级元素
              this.currentSort = [this.sortList[0].value];
            }
          });
        }
      }
    },
    handleSortList (context) {
      const format = context.map(item => {
        return {
          value: item.id,
          label: item.title,
          parent_id: item.parent_id,
          children: item.children.length ? this.handleSortList(item.children) : []
        }
      });
      return format;
    },
    selectSort (value, selectedData) {
      if (this.formItem.id > 0 && this.formItem.id == selectedData[selectedData.length - 1].value) {
        this.$Message.error('所选择的上级分类不能是当前分类!');
        this.isSortValid = false;
        this.validTip = true;
        return false;
      }
      if (this.formItem.id > 0 && this.formItem.id == selectedData[selectedData.length - 1].parent_id) {
        this.$Message.error('所选择的上级分类不能是当前分类的下级分类!');
        this.isSortValid = false;
        this.validTip = true;
        return false;
      }
      this.isSortValid = true;
      this.validTip = false;
      this.formItem.parent_id = selectedData[selectedData.length - 1].value;
    },
    // handleSort (bool) {
    //   this.sortVaild = bool;
    // }
  }
}
</script>

<style lang="less">
.goods-cat-form{
  .valid_tip{
		color: red;
  }
}
</style>
