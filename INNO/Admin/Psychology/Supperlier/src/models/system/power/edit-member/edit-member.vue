<template>
  <custom-modal ref="modal" class="page-drawer-area" :footerHide="true" :width="530" :closable="true">
    <div class="class-edit-area">
      <div class="edit-title bold">{{title}}</div>
      <div class="edit-cont" v-bar>
        <div class="edit-cont-area">
          <Form :label-width="100" :model="adminInfo" ref="formDataRef" :rules="ruleValidate">
            <FormItem label="人员名称" prop="admin_name">
              <custom-input class="base-260-44" placeholder="请输入名称" v-model="adminInfo.admin_name" :maxlength="30" :show-word-limit="true"></custom-input>
            </FormItem>
            <FormItem label="手机号" prop="admin_phone">
              <custom-input class="base-260-44" placeholder="请输入手机号" v-model="adminInfo.admin_phone"></custom-input>
            </FormItem>
            <FormItem label="授权角色" prop="role_id">
              <data-select transfer class="base-260-44" v-model="adminInfo.role_id" type="role"></data-select>
            </FormItem>
          </Form>
          <div class="edit-foot flex-c-c">
            <Button type="primary" @click="checkUpdateInfo">保存</Button>
            <Button class="m-l-15" @click="dismiss">取消</Button>
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
    title: String,
  },
  data() {
    return {
      adminInfo: {
        admin_id: 0,
        role_id: 0,
        admin_name: "",
        admin_phone: "",
      },
      ruleValidate: {
        role_id: [
          {
            required: true,
            validator: this._checkThanInt,
            trigger: "blur",
            message: "请选择角色"
          },
        ],
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
    showModal({ adminInfo = {} }) {
      this.$refs["formDataRef"] && this.$refs["formDataRef"].resetFields();
      let get_admin_related_data = adminInfo.get_admin_related_data || {};
      let _adminInfo = {
        admin_id: adminInfo.id || 0,
        role_id: get_admin_related_data.role_id || 0,
        admin_name: adminInfo.user_name || "",
        admin_phone: adminInfo.mobile_phone || "",
      };
      this.adminInfo = _adminInfo;
      this.$refs.modal.show();
    },
    checkUpdateInfo() {
      this.$refs["formDataRef"].validate((valid) => {
        if (valid) {
          this.updateInfo();
        } else {
          this.$Message.warning("请完善信息");
        }
      });
    },
    updateInfo() {
      let adminInfo = this.adminInfo || {};
      let params = {
        role_id: adminInfo.role_id,
        admin_name: adminInfo.admin_name,
        admin_phone: adminInfo.admin_phone,
      };
      if (adminInfo.admin_id) {
        params.admin_id = adminInfo.admin_id;
      }
      let req = Number(adminInfo.admin_id) ? "adminSettingUpdate" : "adminSettingAdd";
      this.pageLoading = true;
      return this.$MainApi[req]({
        data: { ...params },
      })
        .then((res) => {
          if (res.code) {
            this.$Message.success(res.message || "操作成功");
            this.dismiss();
            this.$emit("confirm");
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
@import "@/assets/css/variables.less";
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