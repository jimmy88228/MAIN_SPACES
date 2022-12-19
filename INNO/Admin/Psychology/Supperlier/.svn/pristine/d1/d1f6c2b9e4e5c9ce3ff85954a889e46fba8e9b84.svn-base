<template>
    <hold-layout :isFull="true" class="resource-page-layout">
      <Tabs :value="currentTab" @on-click="changeTab">
        <TabPane label="计分" name="scoring">
          <indexTable ref="scoringRef" type="scoring"></indexTable>
        </TabPane>
        <TabPane label="类型" name="dimension">
          <indexTable ref="dimensionRef" type="dimension"></indexTable>
        </TabPane>
      </Tabs>
      <importProblem ref="importProblemRef"></importProblem>
    </hold-layout>
</template>

<script>
import indexTable from "./index-table.vue";
import importProblem from "./components/import-problem/index.vue";
export default {
  name: "resourceManageIndex",
  components: { indexTable, importProblem },
  data() {
    return {
      currentTab: 'scoring',
    };
  },
  methods: {
    changeTab(name){
      if(this.currentTab != name) {
        this.currentTab = name;
      }
      let currentRef = this.$refs[name + 'Ref'];
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