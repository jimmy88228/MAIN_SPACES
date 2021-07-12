<template>
	<Card class="reward-report">
		<Tabs :value="tabName" :animated="false" type="card" @on-click="onTabsClick">
      <TabPane name="all" label="提成汇总报表">
        <All ref="all" :onSetState="setState"/>
      </TabPane>
      <TabPane name="detail" label="提成明细报表">
        <Detail ref="detail" :info="info"/>
      </TabPane>
      <TabPane name="goodDetail" label="商品提成明细报表">
        <GoodDetail ref="goodDetail"/>
      </TabPane>
    </Tabs>
	</Card>
</template>

<script>
import TabsHelper from '@/libs/tabs-helper.js';
import All from './all/index';
import Detail from './detail/index';
import GoodDetail from './goodDetail/index';

export default {
  mixins: [TabsHelper],
  components: {
    All,
    Detail,
    GoodDetail
  },
  data () {
    return {
      tabName: 'all',
      info: {}
    }
  },
  methods: {
    searchPage(data) {
      this.$refs[this.tabName].searchPage(data);
    },
    setState(info) {
      this.tabName = 'detail';
      this.info = info;
    }
  },
  beforeRouteEnter(to, from, next) {
    next(vm => {
      vm.info = {
        searchq: vm.$route.query.searchq
      };
    })
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
