<template>
  <div class="area-list-form">
    <Modal
      v-model="modalShow"
      :title="modalTitle"
      :loading="modalLoading"
      :mask-closable="allowClose"
      @on-ok="modalOk">
      <Form ref="formValidate" :model="formItem" :rules="ruleValidate" :label-width="100">
        <FormItem label="区域类型" prop="areaType">
          <RadioGroup v-model="formItem.areaType">
            <Radio label="1">自营</Radio>
            <Radio label="2">加盟</Radio>
            <Radio label="3">代理</Radio>
          </RadioGroup>
        </FormItem>
        <FormItem label="区域名称" prop="areaName">
          <Input v-model="formItem.areaName" placeholder="请输入名称" style="width:200px;"></Input>
        </FormItem>
        <FormItem label="区域代码" prop="areaCode">
          <Input v-model="formItem.areaCode" placeholder="请输入区域代码" style="width:200px;"></Input>
        </FormItem>
        <FormItem label="上级区域" class="spec-item">
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
            <p v-show="validTip" class="valid_tip">所选择的上级分类不能是当前分类或者当前分类的下级分类!</p>
        </FormItem>
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
        areaType: '1',
        areaName: '',
        areaCode: '',
        parent_id: 0
      },
      ruleValidate: {
        areaCode: [{ required: true, message: '区域代码不能为空', trigger: 'blur' }]
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
          this.$ajax.post((this.formItem.id === 0 ? this.$api.channelAdd : this.$api.channelEdit), {
            id: this.formItem.id,
            agent_name: this.formItem.areaName,
            agent_code: this.formItem.areaCode,
            agent_type: this.formItem.areaType,
            p_id: this.formItem.parent_id
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
      console.log(curData)
      this.modalShow = true;
      // 重置表单
      this.isSortValid = true;
      this.validTip = false;
      this.$refs.formValidate.resetFields();

      // 初始化表单数据
      this.formItem.id = typeof (curData.id) !== 'undefined' ? Number(curData.id) : 0;
      this.sortAllData = [...catListData];
      this.sortList = this.handleSortList(this.sortAllData);
      this.sortList.unshift(defaultItem);
      if (this.formItem.id === 0) {
        this.modalTitle = '新建区域';
        this.currentSort = [this.sortList[0].value];
      } else {
        this.modalTitle = '编辑区域';
        this.formItem.areaType = curData.agent_type;
        this.formItem.areaName = curData.agent_name;
        this.formItem.areaCode = curData.agent_code;
        this.formItem.parent_id = curData.p_id;

        if (curData.cascade) {
          this.$nextTick(() => {
            if (Object.values(curData.cascade).length) {
              this.currentSort = Object.values(curData.cascade).map(item => Number(item));
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
      // if (this.formItem.id > 0 && this.formItem.id == selectedData[selectedData.length - 1].value) {
      //   this.$Message.error('所选择的上级分类不能是当前分类!');
      //   this.isSortValid = false;
      //   this.validTip = true;
      //   return false;
      // }
      // if (this.formItem.id > 0 && this.formItem.id == selectedData[selectedData.length - 1].parent_id) {
      //   this.$Message.error('所选择的上级分类不能是当前分类的下级分类!');
      //   this.isSortValid = false;
      //   this.validTip = true;
      //   return false;
      // }
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
.area-list-form{
  .valid_tip{
		color: red;
  }
}
</style>
