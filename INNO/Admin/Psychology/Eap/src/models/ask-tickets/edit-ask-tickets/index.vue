<template>
  <div class="ask-tickets-area">
    <div class="ask-tickets-tip flex-b-c">
      <div class="tip-txt">调查问券</div>
      <div>
        <Button :disabled="!parseInt(ticketsInfo.id)" @click="preViewTicket">预览</Button>
        <Button :disabled="!!ticketsInfo.state" @click="saveToDraft">保存至草稿箱</Button>
        <Button :disabled="!!ticketsInfo.state" type="primary" @click="saveToPublish">发布</Button>
      </div>
    </div>
    <div class="tickets-main">
      <div class="main-left">
        <ticketsLeft :ticketsInfo="ticketsInfo"></ticketsLeft>
      </div>
      <div class="main-middle">
        <ticketsMiddle ref="ticketsMiddleRef" :operateData="operateData" :ticketsInfo="ticketsInfo"></ticketsMiddle>
      </div>
      <div class="main-right">
        <ticketsRight :ticketsInfo="ticketsInfo" :operateData="operateData" @positionTicket="positionTicket"></ticketsRight>
      </div>
      <Spin fix v-if="saving"></Spin>
    </div>
  </div>
</template>

<script>
import ticketsLeft from "./components/tickets-left.vue";
import ticketsMiddle from "./components/tickets-middle.vue";
import ticketsRight from "./components/tickets-right.vue";
import dateUtil from "@/helper/utils/date-util.js";
export default {
  components: {
    ticketsLeft,
    ticketsMiddle,
    ticketsRight
  },
  data(){
    return {
      saving: false,
      ticketsInfo: {
        state: false,
        begin_time: "",
        start_type: "immediate",
        end_time: "",
        end_type: "eternal",
        join_limit: 0, // 0为不限制
        aim_count: 0, // 目标人数
        is_random: 0,
        title: "",
        sub_title: "希望您能抽出几分钟时间，将您的感受和建议告诉我们",
        question_data: [
          // {
          //   is_edit: false,
          //   id: 0,
          //   type: "single_choice", // single_choice,multi_choice,q_a
          //   title: "",
          //   random_option: false,
          //   is_must: false,
          //   option_data: [
          //     {
          //       id: 0,
          //       option_content: '',
          //       is_mutex: false
          //     }
          //   ]
          // }
        ]
      },
      operateData: {
        editIndex: -1
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
    getData(){
      let id = this.pageQuery.id || 0;
      let copyId = this.pageQuery.copyId || 0;
      if(!parseInt(id) && !parseInt(copyId)){
        return;
      }
      this.$MainApi.questionnaireInfo({
        data: {
          id: id || copyId
        }
      }).then((res)=>{
        if(res.code){
          let data = res.data || {};
          let items = data.items || {};
          if(items.begin_time){
            items.begin_time = dateUtil.format(new Date(items.begin_time), "yyyy-MM-dd HH:mm")
          }
          if(items.end_time){
            items.end_time = dateUtil.format(new Date(items.end_time), "yyyy-MM-dd HH:mm")
          }
          if(copyId){
            items.id = 0;
            items.state = 0;
            items.begin_time = "";
            items.end_time = "";
            items.join_limit = 0;
            items.aim_count = 0;
            items.is_random = 0;
          }
          items.start_type = items.begin_time ? "custom" : "immediate";
          items.end_type = items.end_time ? "custom" : "eternal";
          this.ticketsInfo = data.items || {};
        }
      })
    },
    preViewTicket(){
      this.checkConfirm().then(()=>{
        this.saveData(0, { isPreView: true }).then(()=>{
          let ticketsInfo = this.ticketsInfo || {};
          if(!parseInt(ticketsInfo.id)){
            return;
          }
          this.$UIModule({
              mode: "code-view",
              props: {
                  codeTip: `<p class="big-tip">${ticketsInfo.title||""}</p>`,
                  hideTab: true
              },
              options: {
                  path: "pages/questionnaire/answer/answer",
                  params: {
                      id: ticketsInfo.id,
                  },
                  codeId: `questionnaire:${ticketsInfo.id}`
              }
          });
        })
      })
    },
    saveToDraft(){
      this.checkConfirm().then(()=>{
        this.saveData(0);
      })
    },
    saveToPublish(){
      this.checkConfirm().then(()=>{
        this.saveData(1);
      })
    },
    saveData(isPublish, extra = {}){
      // isPublish -1 预览， 0 草稿， 1发布
      if(this.saving){ return; }
      this.saving = true;
      let ticketsInfo = this.ticketsInfo || {};
      let req = parseInt(ticketsInfo.id) ? 'questionnaireUpdate' : 'questionnaireAdd'
      return this.$MainApi[req]({
        data: {
          ...ticketsInfo,
          state: isPublish
        },
        other: {
          isMsg: !extra.isPreView,
          isErrorMsg: extra.isPreView
        }
      }).then((res)=>{
        if(res.code){
          if(!extra.isPreView){
            this.$router.go(-1);
          }
          return Promise.resolve();
        }
        return Promise.reject(); 
      }).finally(()=>{
        this.saving = false;
      })
    }
  },
  mounted(){
    this.getData();
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
  z-index: 2;
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
  position: relative;
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