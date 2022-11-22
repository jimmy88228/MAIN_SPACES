<template>
  <custom-modal ref="modal" class="page-drawer-area" :footerHide="true" :width="530">
    <div class="class-edit-area">
      <div class="edit-title bold">{{title}}</div>
      <div class="edit-cont">
        <div class="edit-cont-area">
          <Form :label-width="100" :model="superviseInfo" ref="formDataRef" :rules="ruleValidate">
            <FormItem  label="预约日期" prop="admin_name">
              <date-time type="datetime" class="base-320" placeholder="请选择日期"></date-time>
            </FormItem>
            <FormItem  label="咨询方式" prop="admin_phone">
              <data-select class="base-320" placeholder="请选择咨询方式"></data-select>
            </FormItem>
            <FormItem label="分配督导师" prop="admin_phone">
              <custom-input class="base-320" type="textarea" placeholder="请填写备注" v-model="superviseInfo.admin_phone"></custom-input>
            </FormItem>
          </Form>
          <div class="edit-foot flex-c-c">
            <Button type="primary" @click="checkSupervise">确&nbsp;&nbsp;认</Button>
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
      default: "分配督导"
    },
  },
  data() {
    return {
      superviseInfo: {
        admin_id: 0,
        admin_name: "",
        admin_phone: "",
      },
      ruleValidate: {
        admin_name: [
          {
            required: true,
            validator: this._checkString,
            trigger: "blur",
            message: "请填写人员名称",
          },
        ],
        admin_phone: [
          {
            required: true,
            validator: this._checkPhone,
            trigger: "blur",
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
    showModal({ superviseInfo = {} }) {
      let _superviseInfo = {
        admin_id: superviseInfo.id || 0,
        admin_name: superviseInfo.user_name || "",
        admin_phone: superviseInfo.mobile_phone || "",
      };
      this.superviseInfo = _superviseInfo;
      this.$refs.modal.show();
    },
    checkSupervise() {
      this.$refs["formDataRef"].validate((valid) => {
        if (valid) {
          this.handleSupervise();
        } else {
          this.$Message.warning("请完善信息");
        }
      });
    },
    handleSupervise() {
      let superviseInfo = this.superviseInfo || {};
      let params = {
        admin_name: superviseInfo.admin_name,
        admin_phone: superviseInfo.admin_phone,
      };
      if (superviseInfo.admin_id) {
        params.admin_id = superviseInfo.admin_id;
      }
      let req = Number(superviseInfo.admin_id) ? "adminSettingUpdate" : "adminSettingAdd";
      this.pageLoading = true;
      return this.$MainApi[req]({
        data: { ...params },
      })
        .then((res) => {
          if (res.code) {
            this.$Message.success(res.message || "操作成功");
            this.dismiss();
            this.$emit("success");
          } else {
            this.$Message.warning(res.message || "操作失败");
          }
          return res;
        })
        .finally(() => {
          this.pageLoading = false;
        });
    },
    search() {},
  },
  mounted() {},
};
</script>

<style lang="less" scoped>
.page-drawer-area {
  .edit-cont-area {
    border: 0 none !important;
  }
  .edit-title {
    padding-left: 22px;
    font-size: 18px;
    margin-bottom: 20px;
    font-weight: bold;
  }
}
</style>