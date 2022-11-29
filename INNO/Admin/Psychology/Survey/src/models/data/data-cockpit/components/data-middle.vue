<template>
  <div class="campus-select-view">
      <div class="school-select-item campus-select-item w-nowrap " :class="{'curr-item': !searchForm.campus_id}" @click="changeCampus(0, 0)">{{_structureName}}</div>
      <div class="campus-select-item w-nowrap" :class="{'curr-item': searchForm.campus_id == item.campus_id}" v-for="(item, index) in campusData" :key="item.campus_id" @click="changeCampus(item.campus_id, index + 1)">{{item.campus_name}}</div>
      <div class="campus-select-line">
        <div class="campus-select-curr" :style="currStyle"></div>
      </div>
    </div>
</template>

<script>
export default {
  props: {
    campusData: {
      type: Array,
      default:()=>{
        return []
      }
    },
    searchForm: {
      type: Object,
      default:()=>{
        return {}
      }
    },
  },
  data(){
    return {
    }
  },
  computed:{
    currIndex(){
      let campusData = this.campusData || [];
      let currIndex = 0;
      for(let i = 0; i < campusData.length; i++){
        if(campusData[i].campus_id == this.searchForm.campus_id){
          currIndex = i + 1;
          break;
        }
      }
      return currIndex;
    },
    currStyle(){
      return "top:" + (this.currIndex * 80) + "px;"
    },
  },
  methods:{
    changeCampus(campus_id, index){
      this.searchForm.campus_id = campus_id;
      this.$emit("search")
    }
  }
}
</script>

<style lang="less" scoped>
.campus-select-view{
  position: absolute;
  top: 0px;
  left: 24px;
  color: #7C7A8F;
  width: 0px;
  .campus-select-item{
    line-height: 20px;
    padding-left: 20px;
    margin-top: 60px;
    cursor: pointer;
  }
  .curr-item{
    color: #F8892F;
  }
  .school-select-item{
    margin-top: 0px;
  }
  .campus-select-line{
    position: absolute;
    top:0px;
    left:0px;
    width: 1px;
    height: 100%;
    background-color:#7C7A8F;
    border-radius: 5px;
  }
  .campus-select-curr{
    width: 2px;
    height: 20px;
    border-radius: 30px;
    position: absolute;
    top:0px;
    left: 50%;
    transform: translateX(-50%);
    background-color:#fff;
    transition: top .35s;
  }
}
</style>