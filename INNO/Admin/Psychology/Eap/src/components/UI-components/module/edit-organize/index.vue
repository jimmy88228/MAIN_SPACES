<template>
  <Modal v-model="isShowModal" :title="title">
    <div>
      <Form ref="organizeInfoForm" :model="organizeInfo" :label-width="90" :rules="ruleValidate">
        <FormItem label="上级部门" :prop="isCheckParentIds ? 'parentIds' : ''">
          <data-cascader :placeholder="structurePlaceholder" :isAuto="false" ref="organizeCascader" :limitIds="organizeInfo.id ? [organizeInfo.id] : []" :reqData="organizeReqData" class="base-320" type="organize" v-model="organizeInfo.parentIds" valueKey="id" labelKey="structure_name" @change="changeOrganize"></data-cascader>
        </FormItem>
        <FormItem label="组织名称" prop="structure_name">
          <Input class="base-320" placeholder="填写组织名称" v-model="organizeInfo.structure_name" type="text" maxlength="10" :show-word-limit="true"></Input>
        </FormItem>
      </Form>
    </div>
    <div slot="footer" class="text-c">
      <Button @click="isShowModal = false">取消</Button>
      <Button @click="confirm" type="primary" :loading="submitLoading">确定</Button>
    </div>
  </Modal>
</template>

<script>
export default {
  name: "editOrganize",
  props: {
    title: {
      type: String,
      default: "组织",
    },
    organizeReqData: Object
  },
  computed: {
    structurePlaceholder(){
      let organizeInfo = this.organizeInfo || {};
      let parent_info = this.parent_info || {};
      let pName = "";
      if(organizeInfo.pid == 0 && organizeInfo.id && this._isSuperIds == 1){
        this.isCheckParentIds = false;
        pName = this._structureName
      } else {
        pName = parent_info.structure_name || "请选择上级部门";
        if(organizeInfo.pid || organizeInfo.parentIds.length > 0){
          this.isCheckParentIds = false;
        } else {
          this.isCheckParentIds = true;
        }
      }
      return pName;
    },
  },
  data() {
    return {
      isShowModal: false,
      organizeInfo: {
        id: 0,
        pid: 0, // 这里存的是原父id
        structure_name: "",
        parentIds: [],
      },
      parent_info: {},
      submitLoading: false,
      ruleValidate: {
        parentIds: [
          {
            required: true,
            validator: this._checkArray,
            message: "请选择上级部门",
            trigger: "blur",
          },
        ],
        structure_name: [
          {
            required: true,
            validator: this._checkString,
            message: "请填写组织名称",
            trigger: "blur",
          },
        ],
      },
      isCheckParentIds: true
    };
  },
  methods: {
    showModal(organizeInfo = {}) {
      console.log("传进来organizeInfo", organizeInfo)
      this.isShowModal = true;
      this.organizeInfo = {
        id: Number(organizeInfo.id) || 0,
        pid: Number(organizeInfo.pid) || 0, // 这里存的是原父id, 不允许修改
        parentIds: organizeInfo.parentIds || [],
        structure_name: organizeInfo.structure_name || "",
      };
      this.parent_info = organizeInfo.parent_info;
      this.$refs["organizeCascader"] && this.$refs["organizeCascader"].getData();
      this.$refs["organizeInfoForm"] && this.$refs["organizeInfoForm"].resetFields();
    },
    changeOrganize(data){
      console.log("data", data);
    },
    confirmReq() {
      this.submitLoading = true;
      let organizeInfo = this.organizeInfo || {};
      let req = organizeInfo.id ? "structureUpdate" : "structureAdd";
      return this.$MainApi[req]({
        data: {
          ...organizeInfo,
          pid: Number(organizeInfo.parentIds.slice(-1)[0]) || organizeInfo.pid || 0
        },
      }).then((res) => {
        if (res.code) {
          this.$Message.success(res.message || "操作成功");
        } else {
          this.$Message.warning(res.message || "操作失败");
        }
      }).finally(()=>{
        this.submitLoading = false
      })
    },
    confirmNameReq(){
      let organizeInfo = this.organizeInfo || {};
      if(!Number(organizeInfo.id)) return;
      this.submitLoading = true
      return this.$MainApi.structureUpdateName({
        data: {
          id: organizeInfo.id,
          structure_name: organizeInfo.structure_name
        },
      }).then((res) => {
        if (res.code) {
          this.$Message.success(res.message || "操作成功");
        } else {
          this.$Message.warning(res.message || "操作失败");
        }
      }).finally(()=>{
        this.submitLoading = false
      })
    },
    confirm() {
      this.$refs["organizeInfoForm"].validate((valid) => {
        let organizeInfo = this.organizeInfo || {};
        if (valid) {
          // 修改了父级
          let isChangeP = false;
          if(organizeInfo.parentIds.length > 0){
            if((Number(organizeInfo.parentIds.slice(-1)[0]) != organizeInfo.pid) || (Number(organizeInfo.parentIds.slice(-1)[0]) == 0 && organizeInfo.pid == 0) || (organizeInfo.pid && !organizeInfo.id)){
              isChangeP = true;
            }
          }
          if(isChangeP){
            this.confirmReq().then(() => {
              this.isShowModal = false;
              this.$emit("success");
            });
          } else { // 没有修改父级
            this.confirmNameReq().then(() => {
              this.isShowModal = false;
              this.$emit("success");
            });
          }
        } else {
          this.$Message.warning("请完善信息")
        }
      });
    },
  },
};
</script>