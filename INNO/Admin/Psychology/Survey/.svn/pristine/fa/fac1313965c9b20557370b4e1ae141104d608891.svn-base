<template>
  <div class="question-view">
    <div class="view-cont">
      <div class="cont-title">{{index + 1}} <span class="type-tip"> [{{questionType(questionItem.type).name}}] </span><span class="warn-notice" v-if="!questionItem.unRequired">* </span> {{questionItem.name}}</div>
      <div>
        <template v-if="questionItem.type == 'checkbox'">
          <CheckboxGroup>
            <div class="p-t-5 p-b-5" v-for="(oItem, oIndex) in questionItem.options" :key="oIndex">
              <Checkbox :label="oIndex"><span style="color:#333333;">{{oItem.name}}</span></Checkbox>
            </div>
          </CheckboxGroup>
        </template >
        <template v-else-if="questionItem.type == 'radio'">
          <RadioGroup>
            <div class="p-t-5 p-b-5" v-for="(oItem, oIndex) in questionItem.options" :key="oIndex">
              <Radio :label="oIndex"><span style="color:#333333;">{{oItem.name}}</span></Radio>
            </div>
          </RadioGroup>
        </template>
        <template v-else-if="questionItem.type == 'question'">
          <custom-input class="question-textarea" type="textarea"></custom-input>
        </template>
      </div>
    </div>
    <div class="view-operate">
      <Button class="operate-btn m-b-5" @click="editQuestion">编辑</Button>
      <Button class="operate-btn" @click="removeQuestion">删除</Button>
    </div>
  </div>
</template>

<script>
import ticketsConf from "../../config/tickets.js"
export default {
  props: {
    index: Number,
    questionItem: {
      type: Object,
      default(){
        return {}
      }
    }
  },
  data(){
    return {

    }
  },
  methods:{
    questionType(key){
      return  ticketsConf.getQuestion(key)
    },
    editQuestion(){
      this.questionItem.isEdit = true;
    },
    removeQuestion(){
      this.$emit("removeQuestion")
    }
  }
}
</script>

<style lang="less" scoped>
.question-view{
  border: 1px solid #fff;
  border-radius: 10px;
  background: #FFFFFF;
  display: flex;
  transition: all .35s;
  margin-bottom: 10px;
  .view-cont{
    padding: 5px 15px 15px 15px;
    flex: 1;
    width: 100%;
  }
  .view-operate{
    display: flex;
    flex-direction: column;
    flex-shrink: 0;
    transition: all .35s;
    opacity: 0;
    border-left: 1px solid #F1F1F1;
    padding: 5px;
  }
  .cont-title{
    font-size: 13px;
    font-family: PingFangSC-Semibold, PingFang SC;
    font-weight: 600;
    color: #333333;
    line-height: 18px;
    margin: 15px 0px;
  }
  .type-tip{
    color: #30B6D4;
  }
  .warn-notice{
    vertical-align: middle;
    display: inline-block;
    padding-top: 3px;
  }
}
.question-textarea{
  width: 331px;
  height: 101px;
  /deep/.ivu-input{
    width:100%;
    height: 100%;
    background: #FFFFFF;
    border-radius: 10px;
    border: 1px solid #F1F1F1;
    resize: unset;
  }
}
.question-view:hover{
  border-color: #F1F1F1;
  .view-operate{
    opacity: 1;
  }
}
.operate-btn{
  flex: 1;
  display: block;
  width: 76px;
  // height:90px;
  background-color:#FBFBFB;
  border: none;
}
</style>