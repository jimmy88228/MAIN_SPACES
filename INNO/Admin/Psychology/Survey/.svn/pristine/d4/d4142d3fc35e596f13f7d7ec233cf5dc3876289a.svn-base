<template>
  <custom-modal ref="modal" class="hold-modal-zindex" :isSlotHeader="true" :closable="true" :isSlotFooter="true" :width="380">
    <div slot="header">{{title}}</div>
    <Form class="campus-modal-form" :model="formData" ref="formDataRef" :rules="ruleValidate">
      <div class="flex">
        <FormItem label="学段" prop="edu_type" class="m-r-10">
          <Select class="grade-select" clearable v-model="formData.edu_type" @on-change="changeEduType">
            <Option v-if="canType.indexOf(item.key) != -1" :value="item.key" v-for="(item, index) in campusTypeList" :key="item.key">{{item.name}}</Option>
          </Select>
        </FormItem>
        <FormItem label="年级" prop="grade" class="m-r-10">
          <Select class="grade-select" clearable v-model="formData.grade" >
            <Option :value="item.grade" v-for="(item, index) in gradeData" :key="item.grade">{{item.grade}}</Option>
          </Select>
        </FormItem>
        <FormItem label="学年" prop="school_year">
          <date-time class="grade-select" type="year" placeholder="筛选学年" v-model="formData.school_year" format="yyyy" ></date-time>
        </FormItem>
      </div>
      <div class="class-count">
        <FormItem label="班级设置" prop="count">
          <div class="flex-s-c">
            <custom-input style="width: 60px;" :max="99" class="m-r-10" v-model="formData.count" type="number"></custom-input>
            个班
          </div>
          <div class="desc-notice">班级数量为0时则不会生成</div>
        </FormItem>
      </div>
    </Form>
    <div slot="footer" class="text-c">
      <Button class="operate-btn" @click="dismiss">取消</Button>
      <Button class="operate-btn" type="primary" @click="confirm">添加</Button>
    </div>
  </custom-modal>
</template>

<script>
import campusConf from "../campus/campus.js";
import graderHelper from "./grade.js";
export default {
  props: {
    title: String,
    canType: {
      type: Array,
      default(){
        return []
      }
    },
    limitGrade: {
      type: Array,
      default(){
        return []
      }
    }
  },
  data(){
    return {
      formData: {
        edu_type: "",
        grade: "",
        sort: "",
        school_year: '',
        count: ''
      },
      ruleValidate: {
        edu_type: [
            {
                required: true,
                validator: this._checkString,
                trigger: "change",
                message: "请选择学段",
            },
        ],
        grade: [
            {
                required: true,
                validator: this._checkString,
                trigger: "change",
                message: "请选择年级",
            },
        ],
        school_year: [
            {
                required: true,
                validator: this._checkString,
                trigger: "change",
                message: "请选择学年",
            },
        ],
        count: [{
          required: true,
          validator: this.checkCount,
          trigger: "blur",
          message: "请填写数量",
        }]
      }
    }
  },
  computed: {
    campusTypeList(){
      return campusConf.campusTypeList
    },
    gradeList(){
      return graderHelper.gradeList
    },
    gradeData(){
      let edu_type = this.formData.edu_type;
      let gradeList = this.gradeList || [];
      let gradeData = [];
      for(let i in gradeList){
        if(edu_type){
          gradeData = gradeList[edu_type] || [];
          break;
        }
        gradeData = gradeData.concat(gradeList[i]);
      }
      return gradeData;
    }
  },
  methods: {
    showModal(){
      this.$refs["modal"] && this.$refs["modal"].show();
      this.$refs["formDataRef"] && this.$refs["formDataRef"].resetFields();
      this.formData.count = '';
      this.formData.sort = '';
      this.formData.school_year = '';
    },
    checkCount(rule, value, callback){
      const {
        field
      } = rule;
      if(parseInt(value) === 0 || parseInt(value)){
        callback();
      } else {
        callback(rule.message);
      }
    },
    dismiss(){
      this.$refs["modal"] && this.$refs["modal"].dismiss()
    },
    changeEduType(){
      this.formData.grade = "";
    },
    confirm(){
      this.$refs["formDataRef"].validate((valid) => {
          if (valid) {
            let grade = this.formData.grade;
            let school_year = this.formData.school_year;
            if(this.limitGrade.indexOf(grade + school_year) != -1){
              this.$Message.warning(`已存在${grade}${school_year}级，不可重复添加`);
              return;
            }
            this.dismiss();
            this.$emit("confirm", JSON.parse(JSON.stringify(this.formData)));
          } else {
              this.$Message.warning("请完善信息");
          }
      });
    },
  },
  mounted(){
  },
  watch: {
    'formData.grade': {
      handler(nV, oV){
        if(nV){
          let gradeData = this.gradeData || []
          for(let i = 0; i < gradeData.length; i++){
            if(nV == gradeData[i].grade){
              this.formData.sort = gradeData[i].sort
              break;
            }
          }
        } else {
          this.formData.sort = "";
        }
      },
      immediate: true
    }
  }
}
</script>

<style lang="less" scoped>
.class-count{
  /deep/.ivu-form-item-label{
    float: unset;
    display: inline-block;
  }
}
.grade-select{
  width: 95px;
  height: 32px;
}
</style>