<template>
  <div class="question-edit">
    <Form :label-width="60" ref="formDataRef" :model="questionInfo" :rules="ruleValidate">
        <FormItem label="题目" prop="name">
          <custom-input size="large" placeholder="输入题目" v-model="questionInfo.name"></custom-input>
        </FormItem>
        <FormItem prop="type">
          <div class="flex-s-c">
            <Select class="m-r-10" size="large" placeholder="请选择题目类型" style="width: 120px;" v-model="questionInfo.type">
              <Option :value="item.type" v-for="(item, index) in questionType" :key="item.type">{{item.name}}</Option>
            </Select>
            <Checkbox class="m-r-10" v-model="questionInfo.isRandom" v-if="questionInfo.type != 'question'">选项随机展示</Checkbox>
            <Checkbox class="m-r-10" v-model="questionInfo.unRequired">本题可选答</Checkbox>
          </div>
        </FormItem>
        <template v-if="questionInfo.type != 'question'">
          <draggable class="draggable-box flex1" v-model="questionInfo.options" v-bind="dragOptions" :group="{name:'itemBox'}" >
          <FormItem 
          :prop="'options.' + oIndex + '.name'" 
          v-for="(oItem, oIndex) in questionInfo.options" 
          :key="oIndex"
          :rules="{required: true, validator: _checkString, message: '输入选项内容', trigger: 'blur'}"
          >
            <div class="option-item-cont flex-s-c" :class="{ 'exclusion_option':  oItem.isExclusion}">
              <Icon type="md-menu" class="move C_B2 f-shrink0" style="width: 50px;" :size="20"/>
              <custom-input size="large" v-model="oItem.name" placeholder="输入选项内容"></custom-input>
              <Icon type="md-close" class="pointer C_B2 f-shrink0 m-l-5" :size="20" @click="removeOption(oIndex)" v-if="questionInfo.options.length > 1"/>
            </div>
          </FormItem>
          </draggable>
          <div class="empty-options-area" v-if='!questionInfo.options || !questionInfo.options.length'>
            <div class="empty-options">暂无选项</div>
          </div>
        </template>
        <FormItem>
          <template v-if="questionInfo.type != 'question'">
          <Button icon="md-add" size="large" @click="addOption()">添加选项</Button>
          <Button icon="md-add" size="large" @click="addOption(true)">添加互斥选项</Button>
          </template>
          <template v-else>
            <div class="C_B2">文本描述限500字</div>
          </template>
        </FormItem>
        <FormItem>
          <Button size="large" style="width: 96px;" type="primary" @click="confirmEdit()">确认</Button>
          <Button size="large" style="width: 96px;" @click="cancelEdit()">取消</Button>
        </FormItem>
    </Form>
  </div>
</template>

<script>
import ticketsConf from "../../config/tickets.js"
import draggable from "vuedraggable";
export default {
  components: { draggable },
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
      questionInfo: {},
      defaultOption: {
        name: "",
        isExclusion: false,
      },
      ruleValidate: {
        name: [
            { required: true, validator: this._checkString, message: '请填写题目', trigger: 'blur' }
        ],
        type: [
            { required: true, validator: this._checkString, message: '请选择题目类型', trigger: 'blur' }
        ],
      }
    }
  },
  computed: {
    questionType(){
      return ticketsConf.questionType || [];
    },
    dragOptions() { 
      return {
        animation: 200,
        group: "description",
        handle: ".move",
        disabled: false,
        ghostClass: "ghost",
        chosenClass: "chosen",
      };
    },
  },
  methods:{
    addOption(isExclusion){
      let defaultOption = JSON.parse(JSON.stringify(this.defaultOption));
      defaultOption.isExclusion = !!isExclusion;
      this.questionInfo.options.push(defaultOption)
    },
    removeOption(index){
      this.questionInfo.options.splice(index, 1);
    },
    checkForm(detail = { isErrorMsg: true }){
      return new Promise((rs, rj)=>{
        this.$refs["formDataRef"] && this.$refs["formDataRef"].validate((valid) => {
          if(valid){
            return rs();
          } else {
            if(detail.isErrorMsg || !detail){
              this.$Message.warning("请完善信息");
            }
            return rj();
          }
        })
      })
    },
    confirmEdit(){
      this.checkForm().then(()=>{
        this.$emit("confirmEdit", {
          item: this.questionInfo
        })
        this.$nextTick(()=>{
          this.cancelEdit();
        })
      })
    },
    cancelEdit(){
      this.questionItem.isEdit = false;
    }
  },
  watch:{
    questionItem:{
      handler(nV, oV){
        this.questionInfo = JSON.parse(JSON.stringify(nV));
      },
      immediate: true,
      deep: true
    }
  }
}
</script>

<style lang="less" scoped>
.question-edit{
  border-radius: 10px;
  background: #F9F9F9;
  display: flex;
  transition: all .35s;
  padding: 15px 15px 0px 15px;
  box-shadow: 0px 0px 5px #dddddd;
  margin-bottom: 10px;
  /deep/.ivu-form-item-label{

  }
}
.question-edit:hover{
  border-color: #F1F1F1;
  .view-operate{
    opacity: 1;
  }
}
.option-item-cont{
  position:relative;
  .move{
    position:absolute;
    top: 50%;
    left: 0px;
    transform: translate(-100%, -50%);
  }
}
.exclusion_option{
  /deep/.ivu-input{
    padding-left: 45px;
  }
}
.exclusion_option::after{
  content: "斥";
  position: absolute;
  transform: translateY(-50%);
  top:50%;
  left: 10px;
  width: 27px;
  height: 24px;
  background: #FFF5E5;
  border-radius: 3px;
  font-size: 13px;
  font-family: PingFangSC-Regular, PingFang SC;
  font-weight: 400;
  color: #FF8900;
  display: flex;
  align-items: center;
  justify-content: center;
}
.empty-options-area{
  padding:  0px 0px 10px 50px;
}
.empty-options{
  width: 100%;
  height: 50px;
  display: flex;
  align-items: center;
  justify-content: center;
  color:#d1d1d1;
  border: 1px dashed #ddd;
  border-radius: 10px;
  background-color: #fff;
}
</style>