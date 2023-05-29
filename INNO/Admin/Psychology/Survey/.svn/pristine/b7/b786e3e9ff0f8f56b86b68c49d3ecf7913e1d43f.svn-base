<template>
  <div class="tickets-m-area">
    <vue-scroll class="m-area-scroll" ref="ticketsViewRef">
      <div class="m-area-cont">
        <Form ref="formDataRef" :model="ticketsInfo" :rules="ruleValidate">
          <FormItem prop="title">
            <custom-input v-model="ticketsInfo.title" class="t-name-input" placeholder="问券标题"></custom-input>
          </FormItem>
          <FormItem prop="sub_title">
            <custom-input v-model="ticketsInfo.sub_title" class="t-tip-input" placeholder="希望您能抽出几分钟时间，将您的感受和建议"></custom-input>
          </FormItem>
        </Form>
        <div class="question-list">
          <questionItem 
          :ref="'questionItemRef' + index"
          :id="'ticketsItem' + index"
          v-for="(item, index) in ticketsInfo.data" 
          :key="index" 
          :index="index" 
          :questionItem="item"
          @confirmEdit="confirmEdit"
          @removeQuestion="removeQuestion"
          ></questionItem>
          <div class="empty-quesition-item" v-if="!ticketsInfo.data || ticketsInfo.data.length == 0">
            请点击下面按钮添加题目
          </div>
        </div>
      </div>
    </vue-scroll>
    <div class="flex-b-c m-area-operate">
      <div>
        <Button class="operate-btn" icon="md-add-circle" @click="addItem('radio')">单选题</Button>
        <Button class="operate-btn" icon="md-add-circle" @click="addItem('checkbox')">多选题</Button>
        <Button class="operate-btn" icon="md-add-circle" @click="addItem('question')">问答题</Button>
      </div>
      <div>
        <Button class="operate-btn" icon="md-add-circle" @click="importQuestion">批量创建</Button>
      </div>
    </div>
    <importQuestion ref="importQuestionRef"></importQuestion>
  </div>
</template>

<script>
import questionItem from "./question/question-item.vue";
import importQuestion from "@/models/ask-tickets/components/import-question";
export default {
  components: { questionItem, importQuestion },
  props: {
    ticketsInfo: {
      type: Object,
      default(){
        return {}
      }
    }
  },
  data(){
    return {
      defaultQuestion: {
        isEdit: false,
        type: "",
        name: "",
        isRandom: false,
        unRequired: false,
        options: [
          {
            name: "选项1",
            isExclusion: false,
          },
          {
            name: "选项2",
            isExclusion: false,
          }
        ]
      },
      ruleValidate: {
        title: [
            { required: true, validator: this._checkString, message: '请填写题目', trigger: 'blur' }
        ],
      },

    }
  },
  methods: {
    importQuestion(){
      this.$refs["importQuestionRef"] && this.$refs["importQuestionRef"].showModal()
    },
    confirmEdit(detail){
      this.$set(this.ticketsInfo.data, detail.index, detail.item);
    },
    removeQuestion(index){
      this.ticketsInfo.data.splice(index, 1)
    },
    addItem(type){
      let defaultQuestion = JSON.parse(JSON.stringify(this.defaultQuestion));
      defaultQuestion.type = type;
      defaultQuestion.isEdit = true;
      let length = this.ticketsInfo.data.length || -1; 
      this.ticketsInfo.data.push(defaultQuestion);
      this.$nextTick(()=>{
        this.$emit("positionTicket", length);
      })
      
    },
    moveToItem(index){
      if(Number(index) || Number(index) === 0){
        this.$nextTick(()=>{
          if(this.$refs["ticketsViewRef"]){
            let ticketsViewRef = this.$refs["ticketsViewRef"];
            let offsetTop = (ticketsViewRef.$el && ticketsViewRef.$el.offsetTop) || 0;
            let currItem = document.getElementById('ticketsItem' + index);
            if(currItem){
              let scroll = currItem.offsetTop - offsetTop;
              ticketsViewRef.scrollTo({y: scroll}, 300)
            }
          }
        })
      }
    },
    checkForm(){
      return new Promise((rs, rj)=>{
        this.$refs["formDataRef"] && this.$refs["formDataRef"].validate((valid) => {
          if(valid){
            let data = this.ticketsInfo.data || [];
            if(!data || !data.length){
              this.$Message.warning("请添加问卷题目！");
              return rj();
            } else {
              return this.checkItemForm(0, data.length).then(()=>{
                return rs();
              }).catch((index)=>{
                this.$set(this.ticketsInfo.data[index], 'isEdit', true);
                this.$Message.warning("请完善第" + (index + 1) + "道题信息")
                this.moveToItem(index)
              })
            }
          } else {
            this.$Message.warning("请完善问券信息");
            return rj();
          }
        })
      })
    },
    checkItemForm(i, max){
      let checkRef = this.$refs['questionItemRef' + i][0];
      if(checkRef){
        return checkRef.checkForm({ isErrorMsg: false }).then(()=>{
          return i + 1 < max ? this.checkItemForm(i + 1, max) : Promise.resolve();
        }).catch((result)=>{
          result = typeof(result) != 'undefined' ? result : i;
          return Promise.reject(result);
        })
      } else {
        return Promise.resolve();
      }
    }
  }
}
</script>

<style lang="less" scoped>
.tickets-m-area{
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
  .m-area-scroll{
    flex: 1;
    overflow: hidden;
  }
  .m-area-cont{
    padding: 20px;
    min-height: 100%;
    display: flex;
    flex-direction: column;
  }
  .question-list{
    padding: 10px 0px;
    flex: 1;
    display: flex;
    flex-direction: column;
  }
  .t-name-input{
    /deep/.ivu-input{
      font-size: 18px;
      font-family: PingFangSC-Regular, PingFang SC;
      font-weight: 400;
      line-height: 50px;
      height: 50px;
      border-left-color: transparent;
      border-top-color: transparent;
      border-right-color: transparent;
      box-shadow: unset;
    }
    /deep/input::-webkit-input-placeholder{ /*WebKit browsers*/
      color: #B2B2B2;
    }
  }
  .t-tip-input{
    /deep/.ivu-input{
      line-height: 44px;
      height: 44px;
      border-left-color: transparent;
      border-top-color: transparent;
      border-right-color: transparent;
      box-shadow: unset;
    }
  }
  .m-area-operate{
    flex-shrink: 0;
    margin: 0 auto;
    width: 100%;
    max-width: 800px;
    padding: 0px 22px;
    min-height: 74px;
    background: #FFFFFF;
    box-shadow: 0px -2px 22px 0px rgba(0,0,0,0.05);
  }
  .m-area-operate:hover{
    box-shadow: 0px -2px 22px 0px rgba(0,0,0,0.05);
  }
  .operate-btn{
    margin: 5px;
  }
}
.empty-quesition-item{
  flex: 1;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color:#f9f9f9;
  color:#ccc;
}
</style>