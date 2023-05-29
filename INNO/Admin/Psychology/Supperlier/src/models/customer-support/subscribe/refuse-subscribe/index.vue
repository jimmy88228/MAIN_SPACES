<template>
  <custom-modal ref="modal" class="page-drawer-area" :footerHide="true" :width="530" :closable="true">
    <div class="class-edit-area">
      <div class="edit-title bold">{{title}}</div>
      <div class="edit-cont">
        <div class="edit-cont-area">
          <Form :label-width="100" :model="formData" ref="formDataRef" :rules="ruleValidate">
            <FormItem label="拒绝原因" prop="remark">
              <custom-input class="base-320" type="textarea" :placeholder="remarkDefault" v-model="formData.remark" :show-word-limit="true" :maxlength="200"></custom-input>
            </FormItem>
          </Form>
          <div class="edit-foot flex-c-c">
            <Button type="primary" @click="checkSubscribe">确&nbsp;&nbsp;认</Button>
          </div>
          <Spin fix v-if="pageLoading"></Spin>
        </div>
      </div>
    </div>
  </custom-modal>
</template>

<script>
export default {
  components: {},
  props: {
    title: {
      type: String,
      default: "拒绝原因"
    },
  },
  data() {
    return {
      remarkDefault:"可预约次数已达上限",
      formData:{
        remark:""
      },
      subscribeInfo: {
        appointment_id: 0,
      },
      subscribeType: "",
      get_consultant: {},
      ruleValidate: {
         
      },
    };
  },
  computed: {},
  methods: {
    dismiss() {
      this.$refs.modal.dismiss();
    },
    showModal({ subscribeInfo = {} }) {
      this.formData.remark = "";
      let _subscribeInfo = JSON.parse(JSON.stringify(subscribeInfo));
      this.subscribeInfo = {
        appointment_id: _subscribeInfo.appointment_id,
      }
      this.subscribeType = _subscribeInfo.type;
      this.$refs.modal.show();
      this.pageLoading = false;
    },
    checkSubscribe() {
      this.$refs["formDataRef"].validate((valid) => {
        if (valid) {
          this.handleSubscribe();
        } else {
          this.$Message.warning("请完善信息");
        }
      });
    },
    handleSubscribe() {
      this.pageLoading = true;
      return this.$MainApi
        .reservationRefuse({
          data: {
            appointment_id:this.subscribeInfo.appointment_id||0,
            remark:this.formData.remark||this.remarkDefault
          },
        })
        .then((res) => {
          if (res.code) {
            this.$Message.success(res.message || "操作成功");
            this.$emit("success", this.subscribeInfo);
            this.dismiss();
          } else {
            this.$Message.warning(res.message || "操作失败");
          }
        })
        .finally(()=>{
          this.pageLoading = false;
        })
    },
  },
  mounted() {},
};
</script>

<style lang="less" scoped>
.page-drawer-area {
  .edit-cont-area {
    border: 0 none !important;
    position: relative;
  }
  .edit-title {
    padding-left: 22px;
    font-size: 18px;
    margin-bottom: 20px;
    font-weight: bold;
  }
}
</style>