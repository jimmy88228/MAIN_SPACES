<template>
	<Card class="distributor-reports">
		<Tabs :value="tabName" :animated="false" type="card" @on-click="onTabsClick">
      <TabPane name="hotGoods" label="热销商品分类">
        <HotGoods ref="hotGoods"/>
      </TabPane>
      <TabPane name="hotActivity" label="热门活动分类">
        <HotActivity ref="hotActivity"/>
      </TabPane>
    </Tabs>
	</Card>
</template>

<script>
import TabsHelper from '@/libs/tabs-helper.js';
import HotGoods from './hot-goods/hot-goods-list';
import HotActivity from './hot-activity/hot-activity-list';

export default {
  mixins: [TabsHelper],
  components: {
    HotGoods,
    HotActivity
  },
  data () {
    return {
      tabName: 'hotGoods'
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
