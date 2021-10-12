<template>
	<Card class="kan-order-list">
		<searchForm @on-search="searchPage" ref="search-form"></searchForm>

		<Tabs :value="tabName" :animated="false" type="card" @on-click="onTabsClick">
      <TabPane name="all" label="全部">
        <orderListTable ref="all"/>
      </TabPane>
      <TabPane name="kan-success" label="砍价成功">
        <orderListTable ref="kan-success"/>
      </TabPane>
      <TabPane name="kaning" label="砍价中">
        <orderListTable ref="kaning"/>
      </TabPane>
      <TabPane name="invalid" label="已失效">
        <orderListTable ref="invalid"/>
      </TabPane>
    </Tabs>
	</Card>
</template>

<script>
import orderListTable from './kan-list-table';
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
