<!-- lifecycle ： beforeCreate,created,beforeMount,mounted,activated,deactivated,beforeDestroy,destroyed,errorCaptured -->
<template>
  <div>
    <div>生命周期log {{jimmyData.a}}</div>
    <div v-if="bool">123</div>
  </div>
</template>

<script>
import Vue from "vue";
export default {
  beforeCreate() {
    console.log("beforeCreate");
  },
  created() {
    console.log("created");
  },
  beforeMount() {
    console.log("beforeMount");
  },
  mounted() {
    console.log("mounted");
     let num = 1;
    this.setId = setInterval(() => {
      Vue.set(this.jimmyData,'a',num);
      this.bool = this.jimmyData.a % 2 == 0;
      num+=1;
      if(num>=3){
        this.cln_intvl();
        return
      }
    }, 1000);
  },
  activated() {
    console.log("activated");
  },
  deactivated() {
    console.log("deactivated");
  },
  beforeDestroy() {
    console.log("beforeDestroy");
    this.cln_intvl();
  },
  destroyed() {
    console.log("destroyed");
  },
  errorCaptured() {
    console.log("errorCaptured");
  },
  data() {
    return {
      jimmyData: {a:0},
      bool:true
    }
  }, 
  methods: {
    cln_intvl(){
      clearInterval(this.setId); 
    }
  },
};
</script>

<style lang="less" scoped>
</style>