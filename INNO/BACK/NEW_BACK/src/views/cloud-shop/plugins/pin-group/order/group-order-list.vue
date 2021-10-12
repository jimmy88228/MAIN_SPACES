<template>
	<Card class="group-order-list">
    <!-- <div class="action_btn">
      <Button type="primary" @click="handleExport">导出</Button>
    </div> -->
    <searchForm
      ref="search-form"
      @on-search="searchPage" @on-export="handleExport"></searchForm>
		<Tabs :value="tabName" :animated="false" type="card" @on-click="onTabsClick">
      <TabPane name="all" label="全部">
        <order-list-table ref="all"/>
      </TabPane>
      <TabPane name="grouping" label="拼团中">
        <order-list-table ref="grouping"/>
      </TabPane>
      <TabPane name="grouped" label="已成团">
        <order-list-table ref="grouped"/>
      </TabPane>
      <TabPane name="groupfail" label="拼团失败">
        <order-list-table ref="groupfail"/>
      </TabPane>
      <TabPane name="joinfail" label="参团失败">
        <order-list-table ref="joinfail"/>
      </TabPane>
	    </Tabs>
      <!--加载提示-->
			<Spin size="large" fix v-if="spinShow"></Spin>
	</Card>
</template>

<script>
import Untils from '@/libs/vue-utils.js';
import orderListTable from './order-list-table';
import searchForm from './search-form';
import TabsHelper from '@/libs/tabs-helper';

export default {
  props: ['userId'],
  mixins: [TabsHelper],
  components: {
    orderListTable,
    searchForm
  },
  data () {
    return {
      tabName: 'all',
      spinShow: false
    }
  },
  methods: {
    handleExport () {
      this.$refs[this.tabName].handleExport();
    }
  }
}
</script>

<style lang="less">
.group-order-list{
  .ivu-table-cell-expand{
    display: none;
  }
  .action_btn{
    text-align: right;
  }
}
</style>
