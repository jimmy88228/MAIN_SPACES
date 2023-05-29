<template>
  <div class="campus-view">
    <div class=" m-b-5 campus-item" :class="{'is-warn': isWarn == cIndex}" v-for="(cItem, cIndex) in campusData" :key="cIndex">
      <div class="campus-text m-r-5 flex-b-c" size="large">
        <template v-if="!cItem.isEdit">
          <span :class="{'C_B2': !cItem.new_campus_name}" class="text-flow">{{cItem.new_campus_name || '请填写校区名称'}}</span>
          <Icon type="md-create" :size="16" class="edit-icon" @click="setEdit(cIndex, true)"/>
        </template>
        <template v-else>
          <custom-input :ref="'campusInputRef' + cIndex" class="campus-text-input" @on-blur="setEdit(cIndex)" v-model="cItem.new_campus_name" :showWordLimit="false" placeholder="输入校区名称"></custom-input>
        </template>
      </div>
      <div>
        <campusTypeView :eduType="cItem.edu_type" :newEduType="cItem.new_edu_type" @confirm="(data)=>confirmCampusType(cIndex, data)"></campusTypeView>
      </div>
      <div class="text-r">
        <a class="set-new-edu-type" v-if="isShowAddNew(cItem)" @click="setClass(cIndex)">给新增学段 设置班级</a>
      </div>
      <span class="campus-remove" :size="20" type="ios-close-circle" v-if="!cItem.campus_id && cIndex != 0" @click="removeCampus(cIndex)"></span>
    </div>
    <Button class="add-campus" @click="addCampus" v-if="campusData.length < 10">
      <a ><Icon type="md-add" />添加校区</a>
    </Button>
  </div>
</template>

<script>
import campusTypeView from "./campus-type-view.vue";
export default {
  components: { campusTypeView },
  props: {
    schoolId: Number,
    defaultCampus: {
      type: Object,
      default:()=>{
        return {}
      }
    },
    campusData: {
      type: Array,
      default:()=>{
        return []
      }
    }
  },
  data(){
    return {
      isWarn: -1
    }
  },
  methods: {
    isShowAddNew(item){
      if(item.new_edu_type && item.new_edu_type.length && this.schoolId){
        if(item.new_edu_type.length > item.edu_type.length){
          return true
        }
      }
      return false;
    },
    setClass(cIndex, isSync){
      this.$emit("setClass", {
        index: cIndex,
        isSync: isSync
      });
    },
    setEdit(index, state){
      this.$set(this.campusData[index], "isEdit", !!state)
      if(state){
        this.$nextTick(()=>{
          let thisCampusInputRef = this.$refs["campusInputRef" + index] && this.$refs["campusInputRef" + index][0];
          thisCampusInputRef.focus();
        })
      }
      this.isWarn = -1;
    },
    addCampus(){
      this.campusData.push(JSON.parse(JSON.stringify(this.defaultCampus)));
    },
    removeCampus(index){
      let campusItem = this.campusData[index] || {};
      if(!campusItem.campus_id){
        this.campusData.splice(index, 1);
      }
    },
    confirmCampusType(index, data){
      let campusItem = this.campusData[index];
      this.$set(this.campusData[index], "new_edu_type", data);
      this.isWarn = -1;
      if(campusItem.new_edu_type.length > campusItem.edu_type.length){ // 同步
        this.setClass(index, true)
      }
    },
    setCampusWarn(index){
      this.isWarn = index;
    },
    checkForm(){
      return new Promise((rs, rj)=>{
        let campusData = this.campusData || [];
        let warn = "";
        for(let i = 0; i < campusData.length; i++){
          let campus = campusData[i] || {}
          if(!campus.new_campus_name){
            warn = "请填写校区名称";
          } else if(!campus.new_edu_type || !campus.new_edu_type.length){
            warn = "请选择办学类型";
          }
          if(warn){
            this.isWarn = i;
            break;
          }
        }
        if(warn){
          this.$Message.warning(warn);
          return rj();
        } else {
          this.isWarn = -1;
          return rs();
        }
      })
    }
  }
}
</script>

<style lang="less" scoped>
@import "~@/assets/css/variables-iview.less";
.campus-view{
  .add-campus{
    width: 100%;
    height: 40px;
  }
  .campus-text{
    width: 100%;
    height: 44px;
    background-color:#E0F4FF;
    border: 1px solid #E3E3E3;
    color: #42A3DB;
    min-width: 110px;
    padding: 0px 10px;
    border-radius: 2px 2px 0px 0px;
    text-align: center;
    margin-bottom: -1px;
    transition: all .35s;
    /deep/.ivu-input{
      border: none !important;
      box-shadow: unset !important;
      background: none;
    }
  }
  .edit-icon{
    cursor: pointer;
    position:relative;
    border-radius: 100%;
    background-color: #fff;
    color:#04B2CF;
    padding: 4px;
  }
  .edit-icon::after{
    content: "";
    width: 36%;
    height: 2.5px;
    background-color: #04B2CF;
    position: absolute;
    bottom: 6px;
    right: 20%;
    display: block;
  }
  .edit-icon:hover{
    box-shadow: 0px 0px 5px #bbb;
  }
  .campus-text-input{
    /deep/.ivu-input{
      border: none !important;
      box-shadow: unset !important;
      background: none;
    }
  }
  .campus-type-select{
    height: 40px;
  }
  .campus-type-select{
    /deep/.ivu-select-selection{
      height: 40px;
    }
  }
  .is-warn{
    .campus-text{
      border-top-color: @error-color;
      border-left-color: @error-color;
      border-right-color: @error-color;
    }
    .campus-type-view{
      border-bottom-color: @error-color;
      border-left-color: @error-color;
      border-right-color: @error-color;
    }
  }
  .set-new-edu-type{
    text-decoration: underline;
    font-size: 12px;
  }
  .campus-item{
    position: relative;
  }
  .campus-remove{
    width: 18px;
    height: 18px;
    border-radius: 100%;
    background-color:#EE7672;
    position: absolute;
    top: 22px;
    left: -10px;
    transform: translate(-100%, -50%);
    // opacity: 0;
    cursor: pointer;
    transition: opacity .35s;
  }
  .campus-remove::after{
    content: "";
    display: block;
    width: 50%;
    height: 3px;
    position:absolute;
    top:50%;
    left:50%;
    transform: translate(-50%,-50%);
    background-color:#fff;
  }
  // .campus-item:hover{
  //   .campus-remove{
  //     opacity: 1;
  //   }
  // }
}
</style>