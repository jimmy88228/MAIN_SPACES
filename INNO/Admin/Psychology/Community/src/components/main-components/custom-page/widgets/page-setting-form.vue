<style lang="less">
.page-setting-form {
  padding: 0 15px 0 10px;
}
</style>

<template>
  <div class="page-setting-form">
    <Form ref="formValidate" :model="pageInfo" :rules="ruleValidate" label-position="top">
      <FormItem label="页面名称" prop="layout_name">
        <Input v-model="pageInfo.layout_name" placeholder="请输入属性名称"></Input>
      </FormItem>
      <FormItem label="顶部导航">
        <i-switch size="large" v-model="setting.isShowNav">
          <span slot="open">显示</span>
          <span slot="close">隐藏</span>
        </i-switch>
      </FormItem>
      <FormItem label="页面描述" prop="page_desc">
        <Input v-model="pageInfo.page_desc" placeholder="请输入属性名称" type="textarea" maxlength="120" show-word-limit :rows="3"></Input>
      </FormItem>
    </Form>
  </div>
</template>

<script>
export default {
  name: "pageSettingForm",
  props: {
    pageInfo: {
      type: Object,
      default: () => {
        return {};
      },
    },
    catList: {
      type: Array,
      default: () => [],
    },
  }, 
	computed:{ 
    setting(){
      return this.pageInfo && this.pageInfo.setting||{};
    },
	},
  data() {
    return {
      // 表单数据规则
      ruleValidate: {
        layout_name: [{ required: true, message: "名称不能为空", trigger: "blur" }],
      },
    };
  },
  methods: {
    checkValidate(){
      return new Promise((rs, rj)=>{
        if(this.$refs["formValidate"]){
          this.$refs["formValidate"].validate((valid)=>{
            if(valid){ return rs(); } else { return rj(); }
          })
        } else {
          return rs();
        }
      })
    }
  },
  watch: {},
  mounted() {},
};
</script>
