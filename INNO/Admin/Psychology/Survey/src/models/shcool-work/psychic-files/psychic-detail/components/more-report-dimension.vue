<template>
  <custom-modal ref="modal" :isSlotHeader="true" :closable="true" :isSlotFooter="true" :width="600">
    <div slot="header">测评维度得分</div>
    <div class="dimension-list">
      <div class="dimension-item" v-for="(item, index) in ruleList" :key="index">
        <div class="item-value w-nowrap">{{item.coefficient_points}}</div>
        <div class="item-txt w-nowrap">维度得分：{{item.rule_name}}</div>
      </div>
    </div>
    <div slot="footer" class="text-r">
      <Button type="primary" @click="dismiss">确定</Button>
    </div>
  </custom-modal>
</template>

<script>
export default {
  props: {
    
  },
  data(){
    return {
      ruleList: []
    }
  },
  methods: {
    showModal(detail){
      this.ruleList = detail.ruleList || [];
      this.$refs["modal"].show();
    },
    dismiss(){
      this.$refs["modal"].dismiss();
    }
  }
}
</script>

<style lang="less" scoped>
.dimension-list{
  display: flex;
  flex-wrap: wrap;
  .dimension-item{
    min-width: 25%;
    padding: 20px;
    margin-bottom: 10px;
    text-align: center;
  }
  .item-value{
    font-size: 36px;
    font-family: PingFangSC-Medium, PingFang SC;
    font-weight: 500;
    color: #13B1A6;
    line-height: 50px;
  }
  .item-txt{
    font-size: 14px;
    font-family: PingFangSC-Regular, PingFang SC;
    font-weight: 400;
    color: #B2B2B2;
    line-height: 20px;
  }
}
</style>