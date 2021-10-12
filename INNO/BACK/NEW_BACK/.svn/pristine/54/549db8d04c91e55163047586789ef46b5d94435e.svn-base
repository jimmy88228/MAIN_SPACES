<template>
  <div>
    <Modal
      class="work-form"
      v-model="modalShow"
      :title="modalTitle"
      :loading="modalLoading"
      :mask-closable="false"
      @on-ok="confirm">
        <Form ref="formValidate" :model="formItem" :rules="ruleValidate" :label-width="80">
          <FormItem label="岗位名称" prop="workType">
            <Input v-model="formItem.workType"></Input>
          </FormItem>
        </Form>
    </Modal>
  </div>
</template>
<script>
export default {
  data () {
    return {
      modalShow: false,
      modalTitle: '员工岗位',
      modalLoading: true,
      formItem: {
        id: 0,
        workType: ''
      },
      // 表单数据规则
      ruleValidate: {
        workType: [{ required: true, message: '岗位名称不能为空', trigger: 'blur' }]
      }
    }
  },
  methods: {
    confirm () {
      this.$refs.formValidate.validate((valid) => {
        if (valid) {
          return this.$ajax.post(this.formItem.id ? this.$api.staffStationEdit : this.$api.staffStationAdd, {
            id: this.formItem.id,
            station_name: this.formItem.workType
          })
          .then(response => {
            const res = response.data;
            if (res.code) {
              this.$Message.success(res.message);
              this.$emit('success');
            }
            this.modalShow = false;
            this.modalLoading = false;

            setTimeout(() => {
              this.modalLoading = true;
            }, 50);
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
      console.log(row)
      // 屏蔽 确定按钮
      this.modalShow = true;

      // 重置表单
      this.$refs.formValidate.resetFields();

      // 初始化表单数据
      this.formItem.id = typeof(row.id) != 'undefined' ? Number(row.id) : 0;

      if (this.formItem.id === 0) {
        this.modalTitle = '新增员工岗位';
      } else{
        this.modalTitle = '编辑员工岗位';
        this.formItem.workType = row.station_name;
      }
    }
  }
}
</script>
<style lang="less" scoped>
.work-form{
  .image-box{
    width: 80px;
    height:80px;
    line-height:80px;
    border: 1px solid #eee;
    border-radius: 5px;
    text-align: center;
    float:left;
    cursor: pointer;
    background: center center no-repeat;
    background-size: 100% auto;
  }
}
</style>
