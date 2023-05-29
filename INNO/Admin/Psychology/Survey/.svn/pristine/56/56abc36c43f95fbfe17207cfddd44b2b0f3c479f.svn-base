<template>
  <custom-modal ref="modal" :isSlotHeader="true" :closable="true" :isSlotFooter="true" :width="400">
    <div slot="header">{{title}}</div>
    <Form class="campus-modal-form" :model="formData" ref="formDataRef" :rules="ruleValidate">
      <FormItem label="校区名称" prop="campus_name">
        <custom-input placeholder="输入名称"  v-model="formData.campus_name"></custom-input>
      </FormItem>
      <FormItem label="校区类型" prop="edu_type">
        <CheckboxGroup v-model="formData.edu_type">
          <Checkbox :label="item.key" v-for="(item, index) in campusTypeList" :key="item.key">
              <span>{{item.name}}</span>
          </Checkbox>
        </CheckboxGroup>
      </FormItem>
    </Form>
    <div slot="footer" class="text-c">
      <Button class="operate-btn" type="primary" @click="confirm">添加</Button>
    </div>
  </custom-modal>
</template>

<script>
import campusConf from "./campus.js";
export default {
  props: {
    title: {
      type: String,
      default: "标题"
    },
  },
  data(){
    return {
      formData: {
        campus_name: "",
        edu_type: []
      },
      ruleValidate: {
        campus_name: [{
            required: true,
            validator: this._checkString,
            trigger: "blur",
            message: "请填写校区名称",
        }],
        edu_type: [{
            required: true,
            validator: this._checkArray,
            trigger: "blur",
            message: "请选择校区类型",
        }]
      }
    }
  },
  computed: {
    campusTypeList(){
      return campusConf.campusTypeList
    }
  },
  methods: {
    showModal(){
      this.$refs["modal"] && this.$refs["modal"].show();
    },
    dismiss(){
      this.$refs["modal"] && this.$refs["modal"].dismiss()
    },
    confirm(){
      this.$refs["formDataRef"].validate((valid) => {
          if (valid) {
              this.dismiss();
              this.$emit("confirm", this.formData);
          } else {
              this.$Message.warning("请完善信息");
          }
      });
    }
  }
}
</script>

<style lang="less" scoped>
/deep/.campus-modal-form{
  padding: 10px;
  margin-bottom: -20px;
  .ivu-form-item-label{
    float: unset;
    display: inline-block;
  }
}
.operate-btn{
  width: 88px;
  height: 32px;
}
</style>