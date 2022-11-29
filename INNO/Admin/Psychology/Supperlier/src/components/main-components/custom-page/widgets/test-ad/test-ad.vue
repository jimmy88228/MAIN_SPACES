<template>
  <div>
    <div style="padding:50px 0px;text-align:center;" v-for="(item, index) in listData" :key="index">{{index}}</div>
    <!-- <p>{{setting.name}}</p> -->
  </div>
</template>

<script>
export default {
  props: {
    thisIndex: Number,
    // compInfo: {
    //   type: Object,
    //   default() {
    //     return {};
    //   },
    // },
  },
  data(){
    return {
      listData: []
    }
  },
  computed:{
    newCompInfo(){ // 转换一层，避免watch浅拷贝
      let pageCompList = this.$store.state.pages.pageCompList || [];
      if(Number(this.thisIndex) >= 0){
        return JSON.stringify(pageCompList[this.thisIndex]);
      }
      return {}
    }
  },
  methods:{
    getData(){
      setTimeout(()=>{
        this.listData = [
          {
            name: "1"
          },
          {
            name: "1"
          },
          {
            name: "1"
          }
        ]
        console.log("getData", this.listData)
      }, 3000)
    }
  },
  // beforeDestroy(){
  //   console.log("test-ad销毁");
  // },
  watch:{
    newCompInfo: {
      handler(nV, oV){
        console.log("新值", nV, "旧值", oV);
        // console.log("compInfo",nV)
        // console.log("listData", JSON.parse(JSON.stringify(this.listData)));
        // this.getData();
      },
      immediate: true,
      deep: true
    },
    // '$store.state.pages.selectCompIndex':{
    //   handler(nV){
    //     if(Number(nV) >= 0){
    //       let pageCompList = this.$store.state.pages.pageCompList || [];
    //       this.compInfo = pageCompList[nV] || {};
    //     }
    //   },
    //   immediante: true
    // },
  }
}
</script>

<style lang="less">
</style>