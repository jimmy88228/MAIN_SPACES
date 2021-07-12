<template>
	<Card class="distributor-reports">

		<Tabs :value="tabName" :animated="false" type="card" @on-click="onTabsClick">
      <TabPane name="today" label="今日数据">
        <Today ref="today"/>
      </TabPane>
      <TabPane name="history" label="历史数据">
        <History ref="history"/>
      </TabPane>
    </Tabs>
	</Card>
</template>

<script>
import TabsHelper from '@/libs/tabs-helper.js';
import Today from './today/today-report';
import History from './history/history-report';

export default {
  mixins: [TabsHelper],
  components: {
    Today,
    History
  },
  data () {
    return {
      tabName: 'today'
    }
  },
  methods: {
    searchPage(data) {
      this.$refs[this.tabName].searchPage(data);
    }
  }
}
</script>

<style lang="less">
.distributor-reports{
  .ivu-table-cell-expand{
    display: none;
  }
  td.ivu-table-expanded-cell {
    padding: 0 0 10px 0;
  }
}
</style>
