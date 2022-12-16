<template>
  <custom-modal ref="modal" class="page-drawer-area" :footerHide="true" :width="530" :closable="true">
    <div class="class-edit-area">
      <div class="edit-title bold">{{title}}</div>
      <div class="edit-cont">
        <div class="edit-cont-area">
          <Form :label-width="100" :model="subscribeInfo" ref="formDataRef" :rules="ruleValidate">
            <template>
              <FormItem  label="预约日期" v-if="viewData.getSchedule && viewData.getSchedule.scheduleTime">
                {{viewData.getSchedule.scheduleTime}}
              </FormItem>
              <FormItem  label="预约日期" prop="consult_date" v-else>
                <date-time :afterNow="true" type="datetime" v-model="subscribeInfo.consult_date" class="base-320" placeholder="请选择日期"></date-time>
              </FormItem>
            </template>
            <template>
              <FormItem  label="咨询方式" prop="service_id" v-if="(viewData.getSchedule && viewData.getSchedule.scheduleTime) && viewData.get_consultant_service.service_name">
                {{(viewData.get_consultant_service && viewData.get_consultant_service.service_name) || '--'}}
              </FormItem>
              <FormItem  label="咨询方式" prop="service_id" v-else>
                <data-select type="consult" class="base-320" v-model="subscribeInfo.service_id" placeholder="请选择咨询方式"></data-select>
              </FormItem>
            </template>
            <FormItem  label="咨询师" prop="consultant_id">
              <template v-if="subscribeType == 'commissioner'">
                <data-select type="psychiatrist" class="base-320" v-model="subscribeInfo.consultant_id" placeholder="请选择咨询师"></data-select>
              </template>
              <template v-else>
                {{get_consultant.consultant_id && get_consultant.name}}
              </template>
            </FormItem>
            <FormItem label="备注" prop="remark">
              <custom-input class="base-320" type="textarea" placeholder="请填写备注" v-model="subscribeInfo.remark" :show-word-limit="true" :maxlength="200"></custom-input>
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
      default: "填写处理详情"
    },
  },
  data() {
    return {
      subscribeInfo: {
        appointment_id: 0,
        consultant_id: 0,
        consult_date: "",
        service_id: 0,
        remark: ""
      },
      viewData: {},
      subscribeType: "",
      get_consultant: {},
      ruleValidate: {
        consult_date: [
          {
            required: true,
            validator: this._checkAfterTime,
            trigger: "change",
          },
        ],
        consultant_id: [
          {
            required: true,
            validator: this._checkThanInt,
            trigger: "blur",
            message: "请选择咨询师"
          },
        ],
        service_id: [
          {
            required: true,
            validator: this._checkThanInt,
            trigger: "blur",
            message: "请选择咨询方式"
          },
        ],
      },
    };
  },
  computed: {},
  methods: {
    dismiss() {
      this.$refs.modal.dismiss();
    },
    showModal({ subscribeInfo = {} }) {
      this.$refs["formDataRef"] && this.$refs["formDataRef"].resetFields();
      let _subscribeInfo = JSON.parse(JSON.stringify(subscribeInfo));
      this.get_consultant = _subscribeInfo.get_consultant;
      this.viewData = _subscribeInfo;
      this.subscribeInfo = {
        appointment_id: _subscribeInfo.appointment_id,
        consult_date: (_subscribeInfo.getSchedule && _subscribeInfo.getSchedule.scheduleTime) || "",
        service_id: (_subscribeInfo.get_consultant_service && _subscribeInfo.get_consultant_service.service_id) || 0,
        remark: "",
        consultant_id: _subscribeInfo.consultant_id
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
      this.$refs["handleSubscribeRef"] && this.$refs["handleSubscribeRef"].showModal({})
      let subscribeInfo = this.subscribeInfo || {};
      this.pageLoading = true;
      return this.$MainApi
        .reservationDispose({
          data: subscribeInfo,
        })
        .then((res) => {
          if (res.code) {
            this.$Message.success(res.message || "操作成功");
            this.$emit("success", subscribeInfo);
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