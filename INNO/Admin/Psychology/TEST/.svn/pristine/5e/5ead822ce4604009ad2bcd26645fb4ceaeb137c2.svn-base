<template>
  <div>
    <drawerForm layout-content-custom-style="padding: 0px;" layout-custom-style="margin-bottom: 20px;" v-for="(cItem, cIndex) in classData" :key="cItem.campus_name" v-if="isShowItem(cIndex == setClassIndex)">
      <div slot="title" class="flex-b-c">
        <div>校区:{{cItem.campus_name}}</div>
        <a @click="addGrade(cIndex)">添加年级</a>
      </div>
      <div slot="content">
        <div class="flex edu-data" v-for="(eItem, eIndex) in cItem.edu_data" :key="eItem.type" v-if="isShowItem(eItem.isNew)">
          <div class="edu-type">
            <div class="edu-type-cont">{{campusJson[eItem.type]}}</div> 
          </div>
          <div class="class-list">
            <div class="class-item flex" v-for="(item, index) in eItem.type_data" :key="index">
              <div class="grade-name flex-c-c">{{item.grade}}({{item.school_year}})</div>
              <div class="flex-c-c class-cont">
                <template v-if="editType == 'grade'">
                  <div v-if="parseInt(item.count)">共{{item.count}}个班</div>
                  <div v-else>
                    <Poptip placement="bottom-end" v-model="item.visible" @on-popper-show="showPopper">
                      <p class="set-count-point"><span class="C_B2 m-r-5">未设班级</span><a >设置</a></p>
                      <div slot="content" class="add-count-area">
                        <div class="flex-s-c">
                          共<custom-input style="width: 60px;" class="m-r-10 m-l-10" v-model="inputCount" type="number" :max="99"></custom-input>
                          个班
                        </div>
                        <div class="desc-notice text-l p-t-5 p-b-5">班级数量为0时则不会生成</div>
                        <div class="p-10">
                          <Button class="m-r-10" @click="item.visible = false">取消</Button>
                          <Button type="primary" @click="confirmSetCount(cItem.campus_name, eItem.type, item)">添加</Button>
                        </div>
                      </div>
                    </Poptip>
                  </div>
                </template>
                <template v-else>
                  共
                  <custom-input :showWordLimit="false" class="m-l-10 m-r-10" style="width: 61px;" v-model="item.count" :max="99" type="number" :isInt="true"></custom-input>
                  个班
                </template>
              </div>
            </div>
          </div>
        </div>
      </div>
    </drawerForm>
    <gradeModal ref="gradeModalRef" title="添加年级" :canType="canType" :limitGrade="limitGrade" @confirm="addGradeCallback"></gradeModal>
  </div>
</template>

<script>
import drawerForm from "@/components/view-components/drawer-form/index.vue";
import gradeModal from "./grade/grade-modal.vue";
import campusConf from "./campus/campus.js";
export default {
  components: { drawerForm, gradeModal },
  props: {
    schoolId: Number,
    editType: String,
    classData: {
      type: Array,
      default:()=>{
        return []
      }
    },
    setClassIndex: {
      type: Number,
      default: -1
    }
  },
  data(){
    return {
      campusJson: campusConf.campusJson,
      canType: [],
      limitGrade: [],
      editClassItem: {},
      inputCount: '',
      visible: false
    }
  },
  methods: {
    isShowItem(state){
      let setClassIndex = this.setClassIndex;
      return (setClassIndex == -1) || (setClassIndex != -1 && state);
    },
    addGrade(index){
      this.getCanType(index);
      this.$refs["gradeModalRef"] && this.$refs["gradeModalRef"].showModal();
    },
    getCanType(index){
      let canType = [], limitGrade = [];
      let classItem = this.classData[index] || [];
      let edu_data = classItem.edu_data;
      edu_data.map((item)=>{
        canType.push(item.type)
        let type_data = item.type_data || [];
        type_data.map((tItem)=>{
          limitGrade.push(tItem.grade + tItem.school_year)
        })
      })
      this.canType = canType;
      this.limitGrade = limitGrade;
      this.editClassItem = classItem;
    },
    addGradeCallback(data){
      if(!this.editClassItem) return;
      if(this.editType == 'grade'){
        this.addSingleClassReq(this.editClassItem.campus_name, data.edu_type, data).then(()=>{
          this.syncAddGradeCallbackUI(data);
        })
      } else {
        this.syncAddGradeCallbackUI(data);
      }
    },
    syncAddGradeCallbackUI(data){
      if(this.editClassItem){
        let edu_data = this.editClassItem.edu_data || [];
        for(let i = 0; i < edu_data.length; i++){
          if(edu_data[i].type == data.edu_type){
            edu_data[i].type_data.push(data)
            break;
          }
        }
        this.$set(this.editClassItem, 'edu_data', edu_data)
      }
    },
    showPopper(){
      this.inputCount = '';
    },
    confirmSetCount(campusName, eduType, item){
      if(!parseInt(this.inputCount)){
        this.$Message.warning("请输入班级数量");
        return;
      }
      this.addSingleClassReq(campusName, eduType, { ...item, count:this.inputCount }).then(()=>{
        this.$set(item, "count", this.inputCount);
        this.$set(item, "visible", false);
        this.$Message.success("编辑成功");
      })
    },
    addSingleClassReq(campusName, eduType, item){
      if(!this.schoolId){
        this.$Message.warning("无效学校ID");
        return Promise.reject();
      }
      let reqClassData = [{
        campus_name: campusName,
        edu_data: [{
          type: eduType,
          type_data: [{
            grade: item.grade,
            sort: item.sort || '',
            school_year: item.school_year,
            count: item.count
          }]
        }]
      }]
      return this.$MainApi.schoolMaintGradeAdd({
            data: {
                id: this.schoolId,
                class_data: reqClassData
            },
            other: {
              isErrorMsg: true
            }
        }).then((res)=>{
          if(!res.code){
            return Promise.reject();
          }
        })
    },
    checkForm(){
      return new Promise((rs, rj)=>{
        let classData = this.classData || [];
        for(let i = 0; i < classData.length; i++){
          let edu_data = classData[i].edu_data || [];
          for(let j = 0; j < edu_data.length; j++){
            let type_data = edu_data[j].type_data || [];
            for(let k = 0; k < type_data.length; k++){
              if(!(type_data[k].count || type_data[k].count == 0)){
                this.$Message.warning("班级个数不能为空");
                return rj({
                  warn_class: i,
                  warn_edu: j,
                  warn_type: k
                });
              }
            }
          }
        }
        return rs();
      })
    }
  },
  mounted(){
  }
}
</script>

<style lang="less" scoped>
.edu-data{
  width: 100%;
  text-align: center;
  border-bottom: 1px solid #F2F2F2;
  margin-top: -1px;
}
.edu-type{
  width: 88px;
  display: flex;
  align-items: center;
  border-right: 1px solid #F2F2F2;
  flex-shrink: 0;
}
.edu-type-cont{
  width: 100%;
  padding: 10px 20px;
}
.class-list{
  flex: 1;
}
.grade-name{
  width: 160px;
  flex-shrink: 0;
  border-right: 1px solid #F2F2F2;
  padding: 10px 20px;
}
.class-cont{
  flex: 1;
  padding: 15px 20px;
}
.add-count-area{
  padding: 10px 0px 5px 0px;
}
.set-count-point{
  a{
    text-decoration: underline;
  }
}
</style>