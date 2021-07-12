<template>
	<Card class="reward-report">
		<Tabs :value="tabName" :animated="false" type="card" @on-click="onTabsClick">
      <TabPane name="area" label="区域汇总报表">
        <Area ref="area"/>
      </TabPane>
      <TabPane name="store" label="店铺汇总报表">
        <Store ref="store"/>
      </TabPane>
    </Tabs>
	</Card>
</template>

<script>
import TabsHelper from '@/libs/tabs-helper.js';
import Area from './area/index';
import Store from './store/index'

export default {
  mixins: [TabsHelper],
  components: {
    Area,
    Store
  },
  data () {
    return {
      tabName: 'area'
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
.reward-report{
  .ivu-table-cell-expand{
    display: none;
  }
  td.ivu-table-expanded-cell {
    padding: 0 0 10px 0;
  }
}
</style>
