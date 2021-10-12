<template>
	<Card class="manager-report">
		<Tabs :value="tabName" :animated="false" type="card" @on-click="onTabsClick">
      <TabPane name="goods" label="热销商品">
        <Goods ref="goods"/>
      </TabPane>
      <TabPane name="activity" label="热门活动">

      </TabPane>
    </Tabs>
	</Card>
</template>

<script>
import TabsHelper from '@/libs/tabs-helper.js';
import Goods from './goods/index';

export default {
  props: ['id'],
  mixins: [TabsHelper],
  components: {
    Goods
  },
  data () {
    return {
      tabName: 'goods'
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
.manager-report{
  .ivu-table-cell-expand{
    display: none;
  }
  td.ivu-table-expanded-cell {
    padding: 0 0 10px 0;
  }
}
</style>
