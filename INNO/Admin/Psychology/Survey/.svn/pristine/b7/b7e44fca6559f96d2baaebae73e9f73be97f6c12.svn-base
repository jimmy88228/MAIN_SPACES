<template>
  <!-- <div class="rewrite-table" ref="rewriteTable"> -->
    <!-- <vue-scroll> -->
      <Table v-bind="$attrs" v-on="$listeners" ref="myTable" class="full-table showBorder">
        <template #[slotName]="slotProps" v-for="(slot, slotName) in $scopedSlots">
            <slot :name="slotName" v-bind="slotProps"/>
        </template>
      </Table>
    <!-- </vue-scroll> -->
  <!-- </div> -->
</template>

<script>
// rewrite-table，只用于整屏table的重写，由于会获取右边可视区域的宽度，（弹框，页面不占100%的table不适用）
export default {
  name: "rewrite-table",
  data(){
    return {
      timer: null,
      width: 0
    }
  },
  computed:{
    // minWidth(){
    //   let minWidth = 0;
    //   this.$attrs.columns.map((item)=>{
    //     minWidth += parseFloat(item.minWidth || item.width || 0)
    //   })
    //   return minWidth;
    // }
  },
  methods: {
    // resize(data){
    //   if(this.timer){
    //     clearTimeout(this.timer);
    //     this.timer = null;
    //   }
    //   this.timer = setTimeout(()=>{
    //     let cpCavBoxView = document.getElementById("cp-cav-box");
    //     let cpCavBoxViewW = cpCavBoxView.offsetWidth;
    //     let cpCavBoxVieL = cpCavBoxView.getBoundingClientRect().left;
    //     // console.log("cpCavBoxVieL", cpCavBoxVieL)
    //     let rewriteTableElem = this.$refs["rewriteTable"];
    //     if(rewriteTableElem){
    //       let myTableElem = this.$refs["myTable"].$el;
    //       let rewriteTableL = rewriteTableElem.getBoundingClientRect().left;
    //       let skewL = rewriteTableL - cpCavBoxVieL;
    //       skewL = skewL < 0 ? 0 : skewL;
    //       cpCavBoxViewW = cpCavBoxViewW - skewL
    //       // console.log("rewriteTableL", rewriteTableL)
    //       // console.log("skewL", skewL)
    //       let width = cpCavBoxViewW > this.minWidth ? cpCavBoxViewW : this.minWidth;
    //       myTableElem.style.width = (width - 30) + "px";
    //     }
    //   }, 200)
    // }
  },
  mounted(){
    // window.onresize = (data)=>{
    //   this.$nextTick(()=>{
    //     this.resize(data);
    //   })
      
    // }
    // this.$nextTick(()=>{
    //   this.resize();
    // })
  }
}
</script>

<style scoped lang="less">
.rewrite-table{
  width:100%;
  // /deep/.ivu-table{
  //   width:100%;
  // }
  // /deep/.ivu-table-header{
  //   width:100%;
  // }
  // /deep/.ivu-table-body{
  //   width:100%;
  // }
}

</style>