<template>
    <hold-layout :isFull="true" class="resource-page-layout">
      <div class="resource-name-area">{{pageQuery.customer_name}}</div>
      <Tabs :value="currentTab" @on-click="changeTab">
        <TabPane label="预约咨询" name="subscribe">
          <subscribeConfig ref="subscribeConfigRef"></subscribeConfig>
        </TabPane>
        <TabPane label="测评活动" name="assess">
          <assessConfig ref="assessConfigRef"></assessConfig>
        </TabPane>
      </Tabs>
    </hold-layout>
</template>

<script>
import assessConfig from "./assess-config/index.vue";
import subscribeConfig from "./subscribe-config/index.vue";

export default {
  name: "resourceManageIndex",
  components: { assessConfig, subscribeConfig },
  data() {
    return {
      currentTab: 'subscribe',
    };
  },
  methods: {
    changeTab(name){
      if(this.currentTab != name) {
        this.currentTab = name;
      }
      let currentRef = this.$refs[name + 'ConfigRef'];
      if(currentRef){
        currentRef.init();
      }
      let pageQuery = this.pageQuery || {};
      if(pageQuery.currentTab != name){
        this.$router.push({ query: {
          ...pageQuery,
          currentTab: name
        }})
      }
      
    },
  },
  mounted() {
    let currentTab = this.pageQuery.currentTab || this.currentTab
    this.changeTab(currentTab);
  },
};
</script>

<style lang="less" scoped>
.resource-page-layout {
  .resource-name-area{
    padding: 0px 10px;
    margin-bottom: 10px;
  }
}
</style>
<style lang="less">
.resource-page-layout{
  .ivu-tabs{
    width:100%;
    flex: 1;
    height: 100%;
    // overflow: hidden;
    display: flex;
    flex-direction: column;
    position: relative;
    padding-top: 36px;
  }
  .ivu-tabs-bar{
    position: absolute;
    top:0px;
    left: 0px;
    width:100%;
  }
  .ivu-tabs-content{
    flex: 1;
    height: 100%;
  }
  .ivu-tabs-tabpane{
    width:100%;
    height:100%;
  }
}
</style>