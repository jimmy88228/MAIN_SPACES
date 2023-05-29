<template>
  <div class="tickets-result-area">
    <div class="">
      <p class="tickets-name w-break">{{resultInfo.title}}</p>
      <span class="desc-notice C_B2">共{{resultInfo.user_total}}人参与，累计回收问券{{resultInfo.total}}份</span>
    </div>
    <div>
      <div class="question-info-tip">题目概况</div>
      <searchForm :searchForm="searchForm" @search="getData()"></searchForm>
    </div>
    <div class="question-list">
      <div class="question-item" v-for="(rItem, index) in resultList" :key="rItem.id">
        <div class="flex item-header">
          <span class="question-number m-r-10">{{rItem.sort}}</span>
          <div>
            <div class="question-name  w-break">{{rItem.title}}</div>
            <p class="notcie C_B2">【{{getQuestion(rItem.type).name}}】</p>
          </div>
        </div>
        <div class="question-content">
          <template v-if="rItem.type == 'q_a'">
            <div class="flex-b-c cont-item q-a-item">
              <div class="cont-l">
                <span class="C_B2 m-r-10">提交份数</span>
                <span class="bold">{{rItem.total}}</span>
              </div>
              <div class="p-r-10"><Button class="detail-btn" @click="getDetail(rItem.id)">详细作答情况</Button></div>
            </div>
          </template>
          <template v-else>
            <div class="flex cont-item" v-for="(item, index) in rItem.option_data" :key="item.id">
              <span class="cont-l w-break" :class="{ C_B2: !item.id}">{{item.option_content}}</span>
              <span class="cont-m">{{searchForm.total_type == 1 ? item.user_total + '人选择': item.total + '份'}}</span>
              <p class="cont-r">
                <Progress :percent="searchForm.total_type == 1 ? item.userTotalPercent : item.totalPercent" >
                  <span>{{searchForm.total_type == 1 ? item.userTotalPercent : item.totalPercent}}%</span>
                </Progress>
              </p>
            </div>
          </template>
        </div>
      </div>
      <div class="empty-area" v-if="!resultList || resultList.length == 0">暂无数据</div>
    </div>
    <QAModal ref="QAModalRef" ></QAModal>
  </div>
</template>

<script>
import searchForm from "./search-form";
import QAModal from "./components/q-a-modal/q-a-modal.vue";
import ticketsConf from "../edit-ask-tickets/config/tickets.js";
export default {
  components: { searchForm, QAModal },
  data(){
    return {
      searchForm: {
        type: 0, // 1单选，2多选，问答
        total_type: 1, // 1用户去重 2总回收份数
      },
      resultList: [],
      resultInfo: {}
    }
  },
  methods: {
    getQuestion(type){
      return ticketsConf.getQuestion(type)
    },
    getData(){
      let id = this.pageQuery.id || 0;
      let searchForm = this.searchForm || {};
      if(!parseInt(id)){ return; }
      this.$MainApi.questionnaireResultList({
        data: {
          id: id,
          ...searchForm
        },
        other: {
          isShowLoad: true
        }
      }).then((res)=>{
        if(res.code){
          let data = res.data || {};
          let items = data.items || [];
          let userTotal = data.user_total;
          let total = data.total
          items.map((rItem)=>{
            let get_details_count = rItem.get_details_count || 0;
            let option_data = rItem.option_data || [];
            // let chooseUserTotal = 0, chooseTotal = 0, userTotalPercet = 0, totalPercent = 0;
            option_data.map((item)=>{
              // chooseUserTotal += item.user_total;
              // chooseTotal += item.total;
              item.userTotalPercent = item.user_total ? parseFloat(((item.user_total / userTotal) * 100).toFixed(0)) : 0;
              item.totalPercent = item.total ? parseFloat(((item.total / total) * 100).toFixed(0)) : 0;
              // userTotalPercet += item.userTotalPercent;
              // totalPercent += item.totalPercent;
            })
            let unChooseUserTotal = userTotal - get_details_count;
            let unChooseTotal = total - get_details_count;
            if(rItem.type != 'q_a' && ((unChooseUserTotal > 0 && searchForm.total_type == 1) || (unChooseTotal > 0 && searchForm.total_type != 1))){
              option_data.push({
                id: 0,
                option_content: "未选任何选项",
                total: unChooseTotal,
                user_total: unChooseUserTotal,
                userTotalPercent: unChooseUserTotal ? parseFloat(((unChooseUserTotal / userTotal) * 100).toFixed(0)) : 0,
                totalPercent: unChooseTotal ? parseFloat(((unChooseTotal / total) * 100).toFixed(0)) : 0
              })
            }
          })
          delete data.items;
          this.resultInfo = data;
          this.resultList = items;
          console.log("item", JSON.parse(JSON.stringify(items)));
        }
      })
    },
    getDetail(id){
      this.$refs["QAModalRef"] && this.$refs["QAModalRef"].showModal({
        resultInfo: this.resultInfo,
        searchForm: this.searchForm,
        topicId: id
      })
    }
  },
  mounted(){
    this.getData();
  }
}
</script>

<style lang="less" scoped>
.tickets-result-area{
  padding: 26px;
  .tickets-name{
    font-size: 20px;
    font-family: PingFangSC-Semibold, PingFang SC;
    font-weight: 600;
    color: #333333;
    line-height: 28px;
    margin-bottom: 10px;
  }
  .question-info-tip{
    font-size: 18px;
    font-family: PingFangSC-Semibold, PingFang SC;
    font-weight: 600;
    color: #333333;
    line-height: 40px;
    margin-top: 15px;
    margin-bottom: 8px;
  }
  .question-item{
    margin: 26px 0px;
    padding: 17px;
    background: #FCFCFC;
    box-shadow: 0px 2px 15px 0px rgba(0,0,0,0.15);
    border: 1px solid #F8F8F8;
  }
  .question-number,.question-name{
    font-size: 16px;
    font-family: PingFangSC-Semibold, PingFang SC;
    font-weight: 600;
    color: #333333;
    line-height: 40px;
  }
  .item-header{
    margin-bottom: 14px;
  }
  .cont-item{
    min-height: 60px;
    border: 1px solid #F1F1F1;
    margin-top: -1px;
    border-left: 6px solid #B58BF0;
    background-color: #fff;
    /deep/.ivu-progress-bg{
      background-color:#B58BF0;
    }
    /deep/.ivu-progress-text{
      color: #B58BF0;
    }
  }
  .cont-l{
    display: flex;
    align-items: center;
    flex: 2;
    padding-left: 22px;
    padding: 0px 10px 0px 22px;
    flex-shrink: 0;
    border-right: 1px solid #F1F1F1;
  }
  .cont-m{
    display: flex;
    align-items: center;
    justify-content: center;
    flex: 1;
    flex-shrink: 0;
    border-right: 1px solid #F1F1F1;
  }
  .cont-r{
    display: flex;
    align-items: center;
    flex: 2;
    padding: 0px 15px;
    flex-shrink: 0;
  }
  .cont-item:nth-of-type(odd){
    border-left-color: #2D8CF0;
    /deep/.ivu-progress-bg{
      background-color:#2D8CF0;
    }
    /deep/.ivu-progress-text{
      color: #2D8CF0;
    }
  }
  .q-a-item.cont-item{
    border-left: 1px solid #F1F1F1;
  }
  .detail-btn{
    background: #F1F8FF;
    border: 1px solid #E8E8E8;
    font-size: 14px;
    font-family: PingFangSC-Regular, PingFang SC;
    font-weight: 400;
    color: #2D8CF0;
    line-height: 20px;
  }
}
</style>