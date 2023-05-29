<template>
  <div class="tickets-result-area">
    <div class="">
      <p class="tickets-name">问卷名称问卷名称问卷名称问卷名称</p>
      <span class="desc-notice C_B2">共36人参与，累计回收问卷48份</span>
    </div>
    <div>
      <div class="question-info-tip">题目概况</div>
      <searchForm></searchForm>
    </div>
    <div class="question-list">
      <div class="question-item">
        <div class="flex item-header">
          <span class="question-number m-r-10">1</span>
          <div>
            <div class="question-name">简答题题目简答题题目</div>
            <p class="notcie C_B2">【单选题】</p>
          </div>
        </div>
        <div class="question-content">
          <div class="flex cont-item">
            <span class="cont-l">A 内容内容内容内容</span>
            <span class="cont-m">12人选择</span>
            <p class="cont-r">
              <Progress :percent="25" />
            </p>
          </div>
          <div class="flex cont-item">
            <span class="cont-l">A 内容内容内容内容</span>
            <span class="cont-m">12人选择</span>
            <p class="cont-r">
              <Progress :percent="25" />
            </p>
          </div>
          <div class="flex cont-item">
            <span class="cont-l">A 内容内容内容内容</span>
            <span class="cont-m">12人选择</span>
            <p class="cont-r">
              <Progress :percent="25" />
            </p>
          </div>
          <div class="flex cont-item">
            <span class="cont-l C_B2">未选择任何选项</span>
            <span class="cont-m">12人选择</span>
            <p class="cont-r">
              <Progress :percent="25" />
            </p>
          </div>
        </div>
      </div>
      <div class="question-item">
        <div class="flex item-header">
          <span class="question-number m-r-10">1</span>
          <div>
            <div class="question-name">简答题题目简答题题目</div>
            <p class="notcie C_B2">【多选题】</p>
          </div>
        </div>
        <div class="question-content">
          <div class="flex cont-item">
            <span class="cont-l">A 内容内容内容内容</span>
            <span class="cont-m">12人选择</span>
            <p class="cont-r">
              <Progress :percent="25" />
            </p>
          </div>
          <div class="flex cont-item">
            <span class="cont-l">A 内容内容内容内容</span>
            <span class="cont-m">12人选择</span>
            <p class="cont-r">
              <Progress :percent="25" />
            </p>
          </div>
          <div class="flex cont-item">
            <span class="cont-l C_B2">未选择任何选项</span>
            <span class="cont-m">12人选择</span>
            <p class="cont-r">
              <Progress :percent="25" />
            </p>
          </div>
        </div>
      </div>
      <div class="question-item">
        <div class="flex item-header">
          <span class="question-number m-r-10">1</span>
          <div>
            <div class="question-name">简答题题目简答题题目</div>
            <p class="notcie C_B2">【简答题】</p>
          </div>
        </div>
        <div class="question-content">
          <div class="flex-b-c cont-item q-a-item">
            <div class="cont-l">
              <span class="C_B2 m-r-10">提交份数</span>
              <span class="bold">10</span>
            </div>
            <div class="p-r-10"><Button class="detail-btn" @click="getDetail">详细作答情况</Button></div>
          </div>
        </div>
      </div>
    </div>
    <QAModal ref="QAModalRef"></QAModal>
  </div>
</template>

<script>
import searchForm from "./search-form";
import QAModal from "./components/q-a-modal/q-a-modal.vue";
export default {
  components: { searchForm, QAModal },
  data(){
    return {

    }
  },
  methods: {
    getDetail(){
      this.$refs["QAModalRef"] && this.$refs["QAModalRef"].showModal()
    }
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
    border-right: 1px solid #F1F1F1;
  }
  .cont-m{
    display: flex;
    align-items: center;
    justify-content: center;
    flex: 1;
    border-right: 1px solid #F1F1F1;
  }
  .cont-r{
    display: flex;
    align-items: center;
    flex: 2;
    padding: 0px 15px;
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