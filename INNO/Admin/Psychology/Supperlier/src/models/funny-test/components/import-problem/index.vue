<template>
  <custom-modal class="hold-modal-zindex import-problem-modal" ref="modal" :width="952" :footerHide="true" :closable="true">
    <div class="import-problem-cont">
      <div class="import-title">
        <p>1、题目与题目之间需空一行，题目可以不加题号，题干中间不得换行</p>
        <p>2、题干与选项，及各选项之间需回车换行，选项不得以数字开头（会被识别为题干）</p>
        <p>3、题目无选项直接空一行，会默认识别为文本型题目 </p>
      </div>
      <div class="import-operate">
        <div class="operate-item" v-bar>
          <Input class="operate-input" :autosize="true" v-model="inputData" type="textarea" placeholder="请输入文本型题目" @on-change="changeData"></Input>
        </div>
        <div class="operate-item" v-bar>
          <div class="problems-view">
            <div class="problems-item" v-for="(pItem, pIndex) in problemsData" :key="pIndex">
              <div class="w-break">{{pItem._question}}</div>
              <template v-if="pItem.option_data.length">
                <RadioGroup>
                  <div v-for="(item, index) in pItem.option_data" :key="index" v-if="item.option_content">
                    <Radio :disabled="true"><span class="w-break">{{item._option_content}}</span></Radio>
                  </div>
                </RadioGroup>
              </template>
              <!-- <template v-else>
                <Input v-if="pItem.question" class="base-320"></Input>
              </template> -->
              
            </div>
          </div>
        </div>
      </div>
      <div class="flex-c-c footer-btns">
        <Button size="large" type="primary" :loading="btnLoading" @click="confirm">确认导入</Button>
      </div>
    </div>
  </custom-modal>
</template>

<script>
import strUtil from "@/helper/utils/string-util.js";
export default {
  props: {
    isLimit: Boolean,
    importData: {
      type: Array,
      default:()=>{
        return []
      }
    },
    titleLimitNum: Number,
    optionLimitNum: Number
  },
  data(){
    return {
      btnLoading: false,
      inputData: "",
      problemsData: [],
      // 
      limitTitleTip: '',
      limitOptionTip: '',
      toFixedTip: ''
    }
  },
  methods: {
    dismiss() {
      this.$refs.modal.dismiss();
    },
    showModal(){
      this.$refs.modal.show();
      this.inputData = "";
      this.problemsData = [];
    },
    changeData(detail){
      let value = detail.target.value || "";
      this.problemsData = this.renderHandler(value);
    },
    renderHandler(value){
      if(value){
        let limitTitleTip = '', limitOptionTip = '';
        let problemsKey = '[-problems-]', optionKey = '[-option-]';
        let content = value.replace(/\n{2,}/g, problemsKey);
        content = content.replace(/\n/g, optionKey);
        let problems = content.split(problemsKey);
        let problemsData = [];
        for(let i = 0; i < problems.length; i++){
          let problemStr = problems[i] || "";
          let optionsList = problemStr.split(optionKey);
          let options = optionsList.splice(1, optionsList.length-1) || [];
          let option_data = []
          for(let j = 0; j < options.length; j++){
            let option_content = options[j] || "";
            option_content = strUtil.trim(option_content);
            if(option_content){
              option_data.push({
                id: 0,
                option_content: option_content.substring(0, this.optionLimitNum),
                _option_content: option_content,
                option_picture: "",
                value: '',
                sort: 0,
                next_question_sort: 0
              })
            }
            if(!limitOptionTip && this.optionLimitNum && option_content.length > this.optionLimitNum){
              limitOptionTip = '选项名称超出最大长度';
            }
          }
          if(optionsList[0]){
            let problem = {
              id: 0,
              question: optionsList[0].substring(0,this.titleLimitNum) || "",
              _question: optionsList[0] || "",
              picture: "",
              sort: 0,
              rest_questions: 0,
              option_data: option_data
            }
            if(!limitTitleTip && this.titleLimitNum && problem._question.length > this.titleLimitNum){
              limitTitleTip = '题目标题超出最大长度';
            }
            problemsData.push(problem)
          }
        }
        this.limitTitleTip = limitTitleTip;
        this.limitOptionTip = limitOptionTip;
        return problemsData;
      }
      return [];
      
    },
    confirm(){
      console.log("problemsData", this.problemsData);
      if(this.limitTitleTip || this.limitOptionTip){
        this.$Modal.confirm({
          title: "检测到存在",
          render:(h)=>{
            let tips = [];
            if(this.limitTitleTip){
              tips.push(
                h('p',{
                  style: {
                    padding: '0px 10px 0px 10px',
                    color: '#DD5246',
                    'text-align': 'center'
                  }
                }, '"' + this.limitTitleTip + '(' + this.titleLimitNum + ')"')
              )
            }
            if(this.limitOptionTip){
              tips.push(
                h('p', {
                  style: {
                    padding: '0px 10px 0px 10px',
                    color: '#DD5246',
                    'text-align': 'center'
                  }
                },'"' + this.limitOptionTip + '(' + this.optionLimitNum + ')"')
              )
            }
            return h('div', {
              style: {
                'padding-top': '10px'
              }
            },[
              ...tips,
              h('p', {
                style: {
                    'text-align': 'center',
                    'margin-top': '10px',
                    'font-weight': 'bold'
                  }
              }, '超出内容会被截掉，是否继续？')
            ])
          },
          okText: "继续",
          onOk:()=>{
            this.$emit("confirm", this.problemsData);
            this.dismiss();
          }
        })
      } else {
        this.$emit("confirm", this.problemsData);
        this.dismiss();
      }
      
    }
  }
}
</script>

<style scoped lang="less">
.import-problem-cont{
}
.import-title{
  font-size: 13px;
  font-family: PingFangSC-Regular, PingFang SC;
  font-weight: 400;
  color: #333333;
  line-height: 30px;
  margin-bottom: 20px;
}
.footer-btns{
  padding-top: 30px;
  padding-bottom: 10px;
}
.import-operate{
  display: flex;
}
.operate-item{
  width:50%;
  flex-shrink: 0;
  height: 400px;
  background: #FFFFFF;
  border: 1px solid #E4E4E4;
}
.problems-view{
  padding: 20px;
  font-size: 13px;
  font-family: PingFangSC-Regular, PingFang SC;
  font-weight: 400;
  color: #333333;
  line-height: 30px;
}
.problems-item{
  margin-bottom: 20px;
  font-size: 14px;
}
</style>
<style lang="less">
.import-problem-modal{
  .ivu-modal-body{
    padding: 30px;
    background-color:#F8F8F8;
  }
  .operate-input{
    width:100%;
    .ivu-input{
      width:100%;
      min-height: 400px;
      padding: 20px;
      resize: none;
      border: 0 none;
    }
  }
  .ivu-radio-wrapper{
    font-size: 14px;
  }
}
</style>