<template>
  <Modal v-model="isShowModal" :title="title">
    <div>
      <Form ref="organizeInfoForm" :model="organizeInfo" :label-width="90" :rules="ruleValidate">
        <FormItem label="上级部门" prop="parentIds">
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
      if(organizeInfo.pid == 0){
        pName = this._supplier_name
      } else {
        pName = parent_info.structure_name || "";
      }
      return pName;
    }
  },
  data() {
    return {
      isShowModal: false,
      organizeInfo: {
        id: 0,
        pid: 0,
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
    };
  },
  methods: {
    showModal(organizeInfo = {}) {
      this.isShowModal = true;
      this.organizeInfo = {
        id: Number(organizeInfo.id) || 0,
        pid: Number(organizeInfo.pid) || 0,
        parentIds: organizeInfo.parentIds || [],
        structure_name: organizeInfo.structure_name || "",
      };
      this.parent_info = organizeInfo.parent_info;
      console.log("organizeInfo", this.organizeInfo)
      this.$refs["organizeCascader"] && this.$refs["organizeCascader"].getData();
    },
    changeOrganize(data) {
      this.organizeInfo.pid = Number(data.slice(-1)[0]);
    },
    confirmReq() {
      this.submitLoading = true;
      let organizeInfo = this.organizeInfo || {};
      let req = organizeInfo.id ? "structureUpdate" : "structureAdd";
      return this.$MainApi[req]({
        data: this.organizeInfo,
      }).then((res) => {
        if (res.code) {
          this.$Message.success(res.message || "操作成功");
        } else {
          this.$Message.warning(res.message || "操作成功");
        }
      }).finally(()=>{
        this.submitLoading = false
      })
    },
    confirm() {
      this.$refs["organizeInfoForm"].validate((valid) => {
        if (valid) {
          this.confirmReq().then(() => {
            this.isShowModal = false;
            this.$emit("success");
          });
        } else {
          this.$Message.warning("请完善信息")
        }
      });
    },
  },
};
</script>