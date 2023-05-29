<template>
    <rewrite-area>
      <div class="text-r"><Button class="import-tScore" :class="{'isDisabled': publishState}" @click="batchImport" icon="md-cloud-upload">导入T分数</Button></div>
    </rewrite-area>
</template>

<script>
export default {
    name: "tScoreSearchForm",
    components: {  },
    data() {
      return {}
    },
    props: {
      publishState: Boolean
    },
    methods: {
      batchImport() {
          if(this.publishState){
            this.$Message.warning("已发布状态不可编辑");
            return;
          }
          this.$emit("batchImport");
      }
    },
};
</script>

<style lang="less" scoped>
.import-tScore.isDisabled{
      background: #dfdfdf;
      color: #7f7f7f;
      opacity: 0.7;
    }
</style>