<template>
  <div class="ask-tickets-area">
    <div class="ask-tickets-tip flex-b-c">
      <div class="tip-txt">调查问券</div>
      <div>
        <Button>预览</Button>
        <Button @click="saveToDraft">保存至草稿箱</Button>
        <Button type="primary" @click="saveToPublish">发布</Button>
      </div>
    </div>
    <div class="tickets-main">
      <div class="main-left">
        <ticketsLeft :ticketsInfo="ticketsInfo"></ticketsLeft>
      </div>
      <div class="main-middle">
        <ticketsMiddle ref="ticketsMiddleRef" :ticketsInfo="ticketsInfo" @positionTicket="positionTicket"></ticketsMiddle>
      </div>
      <div class="main-right">
        <ticketsRight :ticketsInfo="ticketsInfo" @positionTicket="positionTicket"></ticketsRight>
      </div>
    </div>
  </div>
</template>

<script>
import ticketsLeft from "./components/tickets-left.vue";
import ticketsMiddle from "./components/tickets-middle.vue";
import ticketsRight from "./components/tickets-right.vue";
export default {
  components: {
    ticketsLeft,
    ticketsMiddle,
    ticketsRight
  },
  data(){
    return {
      ticketsInfo: {
        startType: "immediate",
        startTime: "",
        endType: "eternal",
        endTime: "",
        limitJoin: "once",
        recoverCount: 100,
        isRandom: false,
        title: "",
        sub_title: "希望您能抽出几分钟时间，将您的感受和建议",
        data: [
          // {
          //   isEdit: false,
          //   type: "radio",
          //   name: "问券名称名称名称23",
          //   isRandom: false,
          //   unRequired: true,
          //   options: [
          //     {
          //       name: "选项1",
          //       isExclusion: false,
          //     }
          //   ]
          // },
        ]
      }
    }
  },
  methods: {
    positionTicket(index){
      this.$refs["ticketsMiddleRef"] && this.$refs["ticketsMiddleRef"].moveToItem(index)
    },
    checkConfirm(){
      return this.$refs["ticketsMiddleRef"] && this.$refs["ticketsMiddleRef"].checkForm()
    },
    saveToDraft(){
      this.checkConfirm().then(()=>{
        console.log("保存草稿")
      })
    },
    saveToPublish(){
      this.checkConfirm().then(()=>{
        console.log("保存发布")
      })
    }
  }
}
</script>

<style lang="less" scoped>
.ask-tickets-area{
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}
.ask-tickets-tip{
  background: #FFFFFF;
  box-shadow: 0px 2px 4px 0px rgba(0,0,0,0.05);
  height: 74px;
  padding: 0px 10px 0px 28px;
  position: relative;
  flex-shrink: 0;
}
.tip-txt{
  font-size: 16px;
  font-family: PingFangSC-Semibold, PingFang SC;
  font-weight: 600;
  color: #333333;
  line-height: 22px;
}
.tickets-main{
  flex: 1;
  display: flex;
  flex-shrink: 0;
  overflow: hidden;
  background-color:#F9F9F9;
  .main-left{
    flex-shrink: 0;
    width: 274px;
    height: 100%;
    background-color:#fff;
  }
  .main-middle{
    flex: 1;
    min-width: 400px;
    max-width: 550px;
    width: 100%;
    height: 100%;
    margin: 0px 10px;
    background-color:#fff
  }
  .main-right{
    flex-shrink: 0;
    width: 217px;
    height: 100%;
    background-color:#fff
  }
}
</style>