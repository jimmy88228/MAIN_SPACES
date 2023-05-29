<template>
  <hold-layout :isFull="true">
    <Tabs class="layout-tabs" :class="{ 'hide-tab': data.length == 1 }" :value="thisCurrTab" @on-click="changeTabs">
        <TabPane :label="item.label" :name="item.name" v-for="(item, index) in data" :disabled="item.disabled" :key="item.name">
          <vue-scroll class="tabs-cont">
            <div class="tabs-cont-stay">
              <slot :name="item.name"></slot>
            </div>
          </vue-scroll>
        </TabPane>
    </Tabs>
  </hold-layout>
</template>

<script>
export default {
  name: "rewrite-tabs",
  props: {
    data: Array,
    currTab: String
  },
  data(){
    return {
      thisCurrTab: ""
    }
  },
  methods:{
    changeTabs(name){
      if(name && name != this.thisCurrTab){
        this.$nextTick(()=>{
          this.thisCurrTab = name;
          this.$router.replace({
            name: this.$route.name,
            query: {
                  ...this.pageQuery,
                  ...this.pageParams,
                  currTab: name,
              },
          })
          this.$emit("changeTab", name);
        })
      }
    }
  },
  mounted(){
    if(this.pageQuery.currTab){
      this.changeTabs(this.pageQuery.currTab);
    }
  },
  watch:{
    data: {
      handler:function(nV){
        if(nV instanceof Array){
          if(!this.pageQuery.currTab){
            this.changeTabs(nV[0].name)
          }
        }
      },
      deep: true,
      immediate: true
    },
    currTab: {
      handler:function(nV){
        if(nV){
          this.changeTabs(nV);
        }
        
      },
      deep: true,
      immediate: true
    }
  }
}
</script>

<style lang="less" scoped>
.layout-tabs{
  width:100%;
  height:100%;
  display: flex;
  flex-direction: column;
  padding-top: 36px;
  position: relative;
  /deep/.ivu-tabs-bar{
    position: absolute;
    top:0px;
    left:0px;
    width: 100%;
  }
  /deep/.ivu-tabs-content{
    flex: 1;
    height:100%;
    
  }
  /deep/.ivu-tabs-tabpane{
    height:100%;
  }
  /deep/.tabs-cont{
    width:100%;
    height:100%;
  }
  /deep/.tabs-cont-stay{
    padding: 20px 10px;
  }
}
.hide-tab{
  padding-top: 0px;
  /deep/.ivu-tabs-bar{
    display: none;
  }
}
</style>