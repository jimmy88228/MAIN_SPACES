<template>
  <div class="remark-form-box">
    <Divider>组件备注名称</Divider>
    <Form ref="formValidate" :model="setting">
      <FormItem>
        <Input v-model="setting.widgetRemark" placeholder="请输入备注名称" size="small"></Input>
        <div class="tips">注意：备注名称只对后台操作人员有用，修改后在“组件管理”可以看到这个备注，方便对组件排序；输入的备注信息，不会对前端显示有任何影响。</div>
      </FormItem>
    </Form>
  </div>
</template>

<script>
export default {
  name: "commonRemarkForm",
  components: {},
  props: {
    compInfo: {
      type: Object,
      default: () => {},
    },
  },
  data() {
    return {
      formItem: {},
    };
  },
  computed: {
    setting() {
      let compInfo = this.compInfo || {};
      let setting = compInfo.setting || {};
      if (!setting.widgetRemark) {
        this.$set(setting, "widgetRemark", "");
      }
      return setting;
    },
  },
  methods: {},
  watch: {},
  mounted() {},
};
</script>

<style lang="less" scoped>
.remark-form-box {
  padding: 10px;
  .tips {
    margin-top: 5px;
    font-size: 12px;
    line-height: 1.5;
  }
  .ivu-form-item {
    margin-bottom: 0;
  }
}
</style>
