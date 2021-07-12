<template>
	<Card class="kan-order-list">
		<searchForm @on-search="searchPage" ref="search-form"></searchForm>

		<Tabs :value="tabName" :animated="false" type="card" @on-click="onTabsClick">
      <TabPane name="all" label="全部">
        <orderListTable ref="all"/>
      </TabPane>
      <TabPane name="unpay" label="未支付">
        <orderListTable ref="unpay"/>
      </TabPane>
      <TabPane name="finish" label="已完成">
        <orderListTable ref="finish"/>
      </TabPane>
      <TabPane name="cancel" label="已取消">
        <orderListTable ref="cancel"/>
      </TabPane>
    </Tabs>
	</Card>
</template>

<script>
import orderListTable from './seckill-list-table';
import searchForm from './search-form';
import TabsHelper from '@/libs/tabs-helper.js';

export default {
  mixins: [TabsHelper],
  components: {
    searchForm,
    orderListTable
  },
  data () {
    return {
      tabName: 'all'
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
.kan-order-list{
  .ivu-table-cell-expand{
    display: none;
  }
  td.ivu-table-expanded-cell {
    padding: 0 0 10px 0;
  }
}
</style>
