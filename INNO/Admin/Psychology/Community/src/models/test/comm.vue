<template>
    <div class="test-main">
        <Button @click="addModule">添加</Button>
        <div class="test-left" v-bar>
            <left></left>
        </div>
        <div class="test-right" v-bar>
            <right></right>
        </div>
        <!-- <editorRightSide></editorRightSide> -->
    </div>
</template>
<script>
import left from "./left.vue";
import right from "./right.vue";
// import editorRightSide from "@/components/main-components/custom-page/editor-right-side.vue";
export default{
    components: {
        left,
        right,
        // editorRightSide
    },
    data(){
        return {
            compInfo: {}
        }
    },
    provide(){
      console.log("provide",this.compInfo)
        return {
            compInfo: this.compInfo
        }
    },
    methods:{
        addModule(){
            this.$set(this.compInfo, "name", Math.round(Math.random()*10));
        }
    },
    mounted(){
        setTimeout(() => {
          // console.log("setTimeout compInfo", this.compInfo);
          // this.compInfo.name = "32323"
          this.$set(this, "compInfo", {});
          this.$set(this, "compInfo", {name: 23232}); 
          // this.$set(this.compInfo, "name", "3434")
          // console.log("setTimeout compInfo2", this.compInfo);
        }, 500);
    }
    
}
</script>
<style lang="less" scoped>
.test-main{
    width:100%;
    height:100%;
    display: flex;
    .test-left{
        width: 300px;
        height:100%;
        margin-right:30px;
        border:1px solid #efefef;
    }
    .test-right{
        width: 300px;
        height:100%;
        border:1px solid #efefef;
    }
    
}
</style>