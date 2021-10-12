<template>
	<Card class="distributor-reports">

		<Tabs :value="tabName" :animated="false" type="card" @on-click="onTabsClick">
      <TabPane name="manager" label="分销员管理">
        <Manager ref="manager"></Manager>
      </TabPane>
      <TabPane name="details" label="分销关系明细">
        <Details ref="details"/>
      </TabPane>
      <TabPane name="trash" label="分销员回收站">
        <Trash ref="trash"/>
      </TabPane>
    </Tabs>
	</Card>
</template>

<script>
import TabsHelper from '@/libs/tabs-helper.js';
import Manager from './manager/manager-list';
import Details from './details/yu-er-list';
import Trash from './trash/manager-trash-list';

export default {
  mixins: [TabsHelper],
  components: {
    Manager,
    Details,
    Trash
  },
  data () {
    return {
      tabName: 'manager'
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
