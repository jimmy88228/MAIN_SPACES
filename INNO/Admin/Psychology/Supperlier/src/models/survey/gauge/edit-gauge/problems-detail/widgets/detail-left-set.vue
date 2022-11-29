<template>
  <div class="problems-left-set" v-bar>
    <div class="left-set-cont">
        <div class="set-item">
          <div class="gauge-name-tip">量表名称</div>
          <div class="item-title bold">{{gaugeInfo.model_name}}</div>
        </div>
        <div class="set-item m-b-10">
          <div class="item-title bold">分值统一设置</div>
          <Input class="grade-input m-b-10" :disabled="problemsInfo.status == 1" v-model="problemsInfo.point_setting"></Input>
          <Button type="primary" class="grade-btn m-b-10" v-if="problemsInfo.status != 1" @click="setAllValue">确认</Button>
          <p class="item-tip">按选项顺序统一设置分值</p>
          <p class="item-tip">不同选项请用；隔开</p>
        </div>
        <div class="set-item m-b-10">
          <div class="item-title bold">维度关联设置</div>
          <Button type="primary" @click="setBatchRelate" class="grade-btn m-b-10">批量关联题目</Button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    testInfo: {
      type: Object,
      default: ()=>{
        return {};
      }
    },
    problemsInfo: {
      type: Object,
      default: ()=>{
        return {};
      }
    },
    gaugeInfo: {
      type: Object,
      default: ()=>{
        return {};
      }
    }
  },
  data(){
    return {

    }
  },
  methods:{
    setAllValue(){
      let point_setting = this.problemsInfo.point_setting;
      point_setting = point_setting.replace(/；/g, ';');
      if(!point_setting){
        this.$Message.warning("分值统一设置不能为空");
        return;
      } else {
        let hasMinus = point_setting.match(/\-\d{1,}(|\;)/g) || [];
        if(hasMinus.length > 0){
          this.$Message.warning("分值统一设置包含负数，输入值必须大于等于0");
          return;
        }
      }
      this.$emit("setAllValue")
    },
    setBatchRelate(){
      this.$emit("setBatchRelate")
    }
  }
}
</script>

<style lang="less" scoped>
.problems-left-set{
  width: 211px;
  height:100%;
  background:#fff;
}
.left-set-cont{
  padding: 20px;
  font-family: PingFangSC-Regular, PingFang SC;
}
.gauge-name-tip{
  font-size: 12px;
  font-family: PingFangSC-Regular, PingFang SC;
  font-weight: 400;
  color: #7F7F7F;
  line-height: 17px;
  margin-bottom: 10px;
}
.gauge-name{
  font-size: 14px;
  font-family: PingFangSC-Regular, PingFang SC;
  color: #333333;
  line-height: 20px;
}
.set-item{
  margin-bottom: 45px;
}
.item-title{
  margin-bottom: 18px;
}
.item-tip{
  font-size: 12px;
  font-weight: 400;
  color: #B2B2B2;
  line-height: 17px;
}

</style>
<style lang="less">
.problems-left-set{
  .grade-input{
    width:100%;
    height:40px;
    .ivu-input{
      width:100%;
      height:100%;
    }
  }
  .grade-btn{
    width:100%;
    height:44px;
    background-color: #ECF8FE;
    color:#008ACB;
    border: 0 none;
  }
}

</style>