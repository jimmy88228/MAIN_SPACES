<template>
  <div class="question-title-list">
    <div class="question-item">
      <div class="question-item-t">问卷大纲</div>
      <div class="question-item-c">
        <vue-scroll>
          <draggable class="draggable-box flex1" v-model="ticketsInfo.question_data" v-bind="dragOptions" :group="{name:'tickets-name'}" @sort="dragEnd">
            <div class="choose-item flex" @click="positionTicket(index)" v-for="(item, index) in ticketsInfo.question_data" :key="index">{{index + 1}} <span class="bold">·</span> {{item.title || '--'}}</div>
          </draggable>
          <div class="empty-question" v-if="!ticketsInfo.question_data || !ticketsInfo.question_data.length">
            暂无题目
          </div>
        </vue-scroll>
      </div>
    </div>
  </div>
</template>

<script>
import draggable from "vuedraggable";
export default {
  components: { draggable },
  props: {
    operateData: {
      type: Object,
      default(){
        return {}
      }
    },
    ticketsInfo: {
      type: Object,
      default:()=>{
        return {}
      }
    }
  },
  data(){
    return {
      isRandom: false,
    }
  },
  computed:{
    dragOptions() {
      return {
        animation: 200,
        group: "description",
        disabled: false,
        ghostClass: "ghost",
        chosenClass: "chosen",
      };
    },
  },
  methods: {
    positionTicket(index){
      this.$emit("positionTicket", index)
    },
    dragEnd(detail = {}){
      let oldIndex = detail.oldIndex;
      let newIndex = detail.newIndex;
      let oldItem = this.ticketsInfo.question_data[oldIndex];
      let newItem = this.ticketsInfo.question_data[newIndex];
      let sort = oldItem.sort;
      oldItem.sort = newItem.sort;
      newItem.sort = sort;
      this.operateData.editIndex = -1;
    }
  },
  
}
</script>

<style lang="less" scoped>
.question-title-list{
  width:100%;
  height: 100%;
}
.question-item{
  width:100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  padding:0px 20px;
}
.question-item-t{
  font-size: 14px;
  font-family: PingFangSC-Semibold, PingFang SC;
  font-weight: 600;
  color: #333333;
  line-height: 20px;
  padding: 26px 0px 18px 10px;
}
.question-item-c{
  flex: 1;
  overflow: hidden;
}
.choose-item{
  position: relative;
  padding: 10px;
  color: #7F7F7F;
  cursor: move;
  line-height: 20px;
}
.choose-item:hover{
  background-color:#E6F3FA;
}
.empty-question{
  display: flex;
  width: 100%;
  height: 100px;
  align-items: center;
  justify-content: center;
  border: 1px dashed #ddd;
  border-radius: 5px;
  color:#ddd;
}
</style>