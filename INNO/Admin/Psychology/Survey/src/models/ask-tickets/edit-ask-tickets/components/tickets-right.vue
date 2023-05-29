<template>
  <div>
    <div class="question-item">
      <div class="question-item-t">问卷大纲</div>
      <div class="question-item-c">
        <draggable class="draggable-box flex1" v-model="ticketsInfo.data" v-bind="dragOptions" :group="{name:'tickets-name'}">
          <div class="choose-item flex-b-c" @click="positionTicket(index)" v-for="(item, index) in ticketsInfo.data" :key="index">{{item.name || '--'}}</div>
        </draggable>
        <div class="empty-question" v-if="!ticketsInfo.data || !ticketsInfo.data.length">
          暂无题目
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import draggable from "vuedraggable";
export default {
  components: { draggable },
  props: {
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
  },
  
}
</script>

<style lang="less" scoped>
.question-item{
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
.choose-item{
  position: relative;
  // cursor: pointer;
  padding: 10px;
  color: #7F7F7F;
  cursor: move;
}
.choose-l{
  font-size: 13px;
  font-family: PingFangSC-Regular, PingFang SC;
  font-weight: 400;
  color: #B2B2B2;
  line-height: 18px;
}
.choose-arrow{
  position: absolute;
  top: 50%;
  right: 10px;
  transform: translateY(-50%);
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