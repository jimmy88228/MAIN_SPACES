<template>
  <div class="v-bar-box" v-bar>
    <div class="material-list-box flex">
      <materialItem 
      :type="type" 
      :isSelect="ids.indexOf(item.id) != -1" 
      @changeItem="changeItem"
      v-for="(item, index) in list" 
      :key="item.id" 
      :index="index" 
      :target_id="target_id"
      :distribute="distribute"
      :disabled="setDisabled(item)"
      :item="item"></materialItem>
      <div class="empty-area" style="width:100%;" v-if="!list || list.length == 0">暂无数据</div>
    </div>
  </div>
</template>

<script>
import materialItem from "@/components/view-components/material-view/material-item.vue";
export default {
  components: {
    materialItem,
  },
  props: {
    type:{
      type:String,
      default:"",
    },
    isView: Boolean,
    list: {
      type: Array,
      default: function() {
        return []
      }
    },
    chooseData: {
      type: Array,
      default: function() {
        return []
      }
    },
    target_id: Number | String,
    distribute: Number | String
  },
  data() {
    return {
    }
  },
  computed: {
    ids(){
      let chooseData = this.chooseData || [];
      let ids = [];
      chooseData.map((item)=>{
        if(item.id){
          ids.push(item.id)
        }
      })
      return ids;
    }
  },
  methods: {
    setDisabled(item){
      let idIndex = this.ids.indexOf(item.id);
      let chooseData = this.chooseData || [];
      let idIndexItem = chooseData[idIndex] || {};
      if(((item.target_id == this.target_id || item.get_distribution_count) && this.target_id) || idIndexItem._disabled){
        return true;
      }
    },
    changeItem(index, item){
      if(this.isView) return;
      if(this.setDisabled(item)){
        this.$Message.warning("已分配，不可修改");
        return;
      }
      let idIndex = this.ids.indexOf(item.id);
      if(idIndex != -1){
        let delIndex = idIndex;
        this.$emit("cancelItem", { index, delIndex, item })
      } else {
        this.$emit("selectItem", { index, item })
      }
    },
  },
};
</script>

<style lang="less" scoped>
.v-bar-box{
  flex:1;
  width:100%;
  height: 100%;
  .material-list-box{
    width:100%;
    flex-wrap: wrap;
  }
}

// .v-bar-box{
//     height: 100%;
//   }
//   .material-list-item{
//     position: relative;
//     width: 182px;
//     margin-right: 12px;
//     &:nth-child(4n){
//       margin-right: 0;
//     }
//   }
//   .img-box{
//     position: relative;
//     width: 100%;
//     height: 136px;
//     border-radius: 2px;
//     overflow: hidden;
//     &.init{
//       background: #EFEFEF;
//     }
//   }
//   .img-cover{
//     width: 100%;
//     height: 100%;
//   }
//   .title{
//     margin-top: 12px;
//     width: 100%;
//     white-space: pre;
//     overflow: hidden;
//     text-overflow: ellipsis;
//     font-size: 14px;
//   }
//   .check-box{
//     position: absolute;
//     top:0;
//     left: 0;
//     right: 0;
//     bottom: 0;
//     background: rgba(213,241,255,0.5);
//     z-index: 1;
//   }
//   .check{
//     position: absolute;
//     left: 10px;
//     top: 10px;
//     width: 20px;
//     height: 20px;
//     border-right: 2px;
//     background: #008ACB;
//     display: flex;
//     justify-content: center;
//     align-items: center;
//     &::after{
//       content: "";
//       width: 70%;
//       height: 6px;
//       border-left: 2px solid #fff;
//       border-bottom: 2px solid #fff;
//       transform: rotate(-45deg);
//       z-index: 2;
//       margin-top: -2px;
//     }
//   }
//   .dist-label{
//     position: absolute;
//     right: 0;
//     top: 0;
//     background: rgba(23, 23, 23, 0.6);
//     color: #fff;
//     padding: 0 5px; 
//     font-size: 13px;
//   }
</style>