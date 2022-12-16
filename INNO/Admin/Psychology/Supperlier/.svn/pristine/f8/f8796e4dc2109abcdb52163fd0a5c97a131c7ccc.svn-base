<template>
  <div class="funny-test problems-right-set">
    <vue-scroll  ref="problemsRightSetScroll" >
    <div class="right-set-cont">
      <div class="set-main">
        <div class="" v-if="operateInfo.currIndex > -1">
          <Form :model="itemInfo" ref="formDataRef" :rules="ruleValidate">
            <FormItem class="main-item main-info" prop="question" :rules="!itemInfo.question && !itemInfo.picture ? ruleValidate.question : [{ required: false }]" >
                <div class="item-l">
                  <custom-input type="textarea"  v-model="itemInfo.question" placeholder="题目标题" :maxlength="titleLimitNum" :showWordLimit="true"></custom-input>
                </div>
                <div class="item-r">
                  <Button class="item-btn m-b-10"  @click="changeImg(itemInfo.picture, null, 'question')"><Icon :size="25" type="ios-image-outline" /></Button>
                  <Poptip
                      confirm
                      placement="left"
                      title="确定删除该道题目吗?"
                      @on-ok="removeModule()">
                      <Button class="item-btn" :disabled="problemsInfo.status == 1">删除</Button>
                  </Poptip>
                </div>
              </FormItem>


            <div class="empty-area text-c" style="width:100%;" v-if="!itemInfo.option_data || itemInfo.option_data.length == 0">请添加选项</div>
            <div 
            class="main-item options-list" 
            :id="'problemsOptions' + index"
            v-for="(item, index) in itemInfo.option_data" :key="index"
            >
              <div class="item-l">
                <FormItem 
                  class="options-form-item"
                  :prop="'option_data.' + index + '.option_content'"
                  :rules="(!item.option_content && !item.option_picture) ? {required: true, message: '选项名称不能为空', trigger: 'blur'} : {required: false}">
                    <custom-input v-model="item.option_content" placeholder="选项名称" :maxlength="optionLimitNum" :showWordLimit="true"></custom-input>
                </FormItem>
                <template v-if="pageQuery.type == 'dimension'">
                  <FormItem 
                  class="options-form-item"
                  :prop="'option_data.' + index + '.value'"
                  :rules="{required: true, validator: _checkThanInt,  message: '选项类型不能为空', trigger: 'blur'}"
                  >
                    <dimensionSelect @change="change" :disabled="problemsInfo.status == 1" :warnShow="(operateInfo.warnIndex == operateInfo.currIndex) && (operateInfo.warnOptionIndex == index)" type="funnyTest" :multiple="false" v-model="item.value" style="width: 100%;" placeholder="请选择类型" :id="pageQuery.testId" size="large" ></dimensionSelect>
                  </FormItem>
                </template>
                <template v-else >
                  <FormItem 
                  class="options-form-item"
                  :prop="'option_data.' + index + '.value'"
                  :rules="{required: true, validator: _checkNumber,  message: '选项分值不能为空', trigger: 'blur'}"
                  >
                  <custom-input type="number" :toFixed="1" :disabled="problemsInfo.status == 1" v-model="item.value" placeholder="分值"></custom-input>
                  </FormItem>
                </template>
              </div>
              <div class="item-r">
                <Button class="item-btn m-b-10" @click="changeImg(item.option_picture, index, 'option_data.' + index + '.value')"><Icon :size="25" type="ios-image-outline" /></Button>
                <Button class="item-btn" :disabled="problemsInfo.status == 1" @click="removeItem(index)">删除</Button>
              </div>
            </div>
          </Form>
        </div>
        <div v-else class="empty-area">请选择题目</div>
      </div>
      <div class="option-operate" v-if="problemsInfo.status != 1">
        <Button class="o-operate-btn" @click="addOption">+添加选项</Button>
      </div>
    </div>
    </vue-scroll>
  </div>

</template>

<script>
import dimensionSelect from "@/components/view-components/editable-select/index.vue";
export default {
  props: {
    operateInfo: {
      type: Object,
      default: ()=>{ return {}; }
    },
    problemsInfo: {
      type: Object,
      default:()=>{
        return {}
      }
    },
    itemInfo: {
      type: Object,
      default: ()=>{ 
        return {}
      }
    },
    titleLimitNum: Number,
    optionLimitNum: Number
  },
  components: {
    dimensionSelect,
  },
  data(){
    return {
      defaultOption: {
        id: 0,
        option_content: "",
        option_picture: "",
        value: '',
        sort: 0,
        next_question_sort: 0
      },
      ruleValidate:{
        question: [
          {
            required: true,
            validator: this._checkString,
            trigger: "blur",
            message: "请输入题目标题",
          },
        ],
        option_content: [
          {
            required: true,
            validator: this._checkString,
            trigger: "blur",
            message: "请输入选项名称",
          },
        ],
        option_data:[
          {
            required: true,
            validator: this._checkArray,
            trigger: "blur",
            message: "选项不能为空",
          },
        ],
      },
      typeList: []
    }
  },
  methods:{
    changeInput(e){
      console.log("e", e)
    },
    addOption(){
      if(!(this.operateInfo.currIndex > -1)){
        this.$Message.warning("请选择题目");
        return;
      }
      let itemInfo = this.itemInfo || {};
      let defaultOption = JSON.parse(JSON.stringify(this.defaultOption)) || {};
      if(!(itemInfo.option_data && itemInfo.option_data instanceof Array)){
        this.$set(this.itemInfo, "option_data", []);
      }
      this.itemInfo.option_data.push(defaultOption)
      this.scrollIntoView();
    },
    changeImg(img, index, relateKey){ // relateKey 关联key
      this.$UIModule({
          mode: "upload-view",
          props: {
              extraParams: {
                  type: "tasteTest"
              }
          },
          options: {
              chooseIds: [img],
          },
          success:(data)=>{
              if(index || index == 0){
                this.$set(this.itemInfo.option_data[index], "option_picture", data);
              } else {
                this.$set(this.itemInfo, "picture", data);
              }
              this._resetField("formDataRef", [relateKey], this.itemInfo)
          }
      });
    },
    removeModule(){
      this.$emit("removeModule", this.operateInfo);
    },
    removeItem(index){
      if(index || index == 0){
        this.itemInfo.option_data.splice(index, 1);
      }
    },
    checkForm(){
      return new Promise((rs, rj)=>{
        this.$refs["formDataRef"] && this.$refs["formDataRef"].validate((valid) => {
          if (valid) {
            rs();
          } else {
            rj();
          }
        })
      })
    },
    loadDimension(){
      this.pageLoading = true;
      let pageQuery = this.pageQuery;
      if(!pageQuery.testId || pageQuery.type != 'dimension') return Promise.reject();
      return this.$MainApi
        .tasteTestTypeList({
          data: {
            testId: pageQuery.testId,
            type: pageQuery.type,
            page: 1,
            pageSize: 1,
            isAll: 1
          },
          other: {
            isErrorMsg: true
          }
        })
        .then((res) => {
          if (res.code) {
            let data = res.data || {};
            this.typeList = data.items || {};
          }
        }).finally(()=>{
          this.pageLoading = false
        })
    },
    scrollIntoView(index){
      this.$nextTick(()=>{
        if(this.$refs["problemsRightSetScroll"]){
          let problemsRightSetScroll = this.$refs["problemsRightSetScroll"];
          if(index || index == 0){
            let offsetTop = (problemsRightSetScroll.$el && problemsRightSetScroll.$el.offsetTop) || 0;
            let currItem = document.getElementById('problemsOptions' + index);
            if(!currItem) return;
            let scroll = currItem.offsetTop - offsetTop;
            problemsRightSetScroll.scrollTo({y: scroll}, 300)
          } else {
            problemsRightSetScroll.scrollTo({y: '100%'}, 300)
          }
        }
      })
    },
    change(e){
      e>0 && (this.operateInfo.warnOptionIndex = -1);
    },
  },
  mounted(){
    // this.loadDimension();
  }
}
</script>

<style lang="less" scoped>
.problems-right-set{
  width: 357px;
  height: 100%;
  background:#fff;
}
.right-set-cont{
  width: 100%;
  min-height:100%;
  position:relative;
  display: flex;
  flex-direction: column;
}
.option-operate{
  position:sticky;
  left: 0px;
  bottom: 0px;
  width:100%;
  padding: 10px 15px;
  background: #FFFFFF;
  z-index: 5;
}
.o-operate-btn{
  width:100%;
  height: 40px;
  background: #FFFFFF;
  border-radius: 4px;
  border: 1px solid #ECECEC;
}
.set-main{
  flex: 1;
  padding: 15px;
  padding-right: 20px;
  // margin-bottom: 30px;
  .main-item{
    display: flex;
    background-color:#F8F8FA;
    margin-bottom: 10px;
    padding: 10px;
    width:100%;
  }
  .item-l{
    flex: 8;
    margin-right: 10px;
    flex-shrink: 0;
    width:226px;
  }
  .item-r{
    flex: 1;
  }
  .item-btn{
    width: 100%;
    height: 40px;
  }
  .main-info{

  }
}
</style>
<style lang="less">
.funny-test {
  &.problems-right-set{
    .ivu-form-item-content{
      display: flex;
    }
    .options-form-item{
      margin-bottom: 10px;
      .ivu-form-item-error-tip{
        display: none;
      }
    }
    .item-l{
      .custom-input-box{
        width:100%;
        height:100%;
      }
      .ivu-input-wrapper{
        width:100%;
        height:100%;
      }
      .ivu-input{
        width:100%;
        height:100%;
      }
    }
    .options-list{
      .custom-input-box{
        height: 40px;
      }
    }
  }
}
</style>