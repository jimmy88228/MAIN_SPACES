<template>
  <div class="model-answer-area">
    <div class="model-name" v-if="isShowTitle">{{modelName}}</div>
    <div class="row-area">
      <div class="row-item" v-for="(rItem, rIndex) in answerData" :key="rIndex">
        <div class="row-name">{{rItem.question_name}}</div>
        <div class="row-answer">
          <div class="answer-list" v-for="(item, index) in rItem.option_arr_data" :key="index">
            <Tooltip :content="item" placement="top">
                <span class="answer-item is-answer" v-if="rItem.option_content == item"></span>
                <span class="answer-item" v-else ></span>
            </Tooltip>
          </div>
        </div>
      </div>
    </div>
    <div v-if="inited && (!answerData || answerData.length == 0)" class="empty-area">
      暂无数据
    </div>
  </div>
</template>

<script>
export default {
    props: {
        isShowTitle: {
            type: Boolean,
            default: false
        },
    },
  data(){
    return {
      recordId: 0,
      modelId: 0,
      modalShow: false,
      answerData: [],
      type: "",
      schoolId: 0,
      loading: false,
      modelName: '',
      curTab:"",
      listTabs:[],
      inited:false
    }
  },
  methods:{
    init(){
      let pageQuery = this.pageQuery || {};
      this.modelName = pageQuery.modelName;
      this.recordId = pageQuery.recordId || '';
      this.modelId = pageQuery.modelId || 0;
      this.type = pageQuery.type || 'default';
    //   this.onLoadData(this.recordId, this.modelId);
    },
    loadData({recordId, modelId}) {
      if(!Number(recordId) || this.inited) return;
      this.init();
      this.loading = true;
      return this.$MainApi.appraisalTabControl({
          data: {
              record_id: recordId + "",
              model_id: modelId || 0
          },
          other: {
            isShowLoad: true,
            isErrorMsg: true
          }
      })
      .then((res) => {
          if (res.code) {
              let data = res.data || [];
              this.answerData = data;
              this.inited = true;
          }
      }).finally(()=>{
        this.loading = false;
      })
    },
  }, 
}
</script>

<style lang="less" scoped>
.model-answer-area{
  .model-name{
    margin-bottom: 60px;
    padding-left: 10px;
    font-size: 18px;
    font-family: PingFangSC-Regular, PingFang SC;
    font-weight: 400;
    color: #171717;
    line-height: 25px;
  }
  .row-area{
    display: inline-block;
  }
  .row-item{
    padding: 10px 20px;
    display: flex;
    line-height: 30px;
    border-radius: 5px;
  }
  .row-item:hover{
    background-color:#F2F9FC;
  }
  .row-name{
    width: 360px;
    flex-shrink: 0;
  }
  .row-answer{
    display: flex;
    flex-wrap: wrap;
  }
  .answer-list{
    margin: 4px 22px;
    display: flex;
    cursor: pointer;
  }
  .answer-item{
    border-radius: 100%;
    display: inline-block;
    width: 22px;
    height:22px;
    background: #FFFFFF;
    border: 1px solid #DDDDDD;
  }
  .is-answer{
    border: 6px solid #008ACB;
  }
}
</style>