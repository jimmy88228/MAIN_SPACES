<template>
	<Card class="reward-report">
		<Tabs :value="tabName" :animated="false" type="card" @on-click="onTabsClick">
      <TabPane name="grow" label="分销发展奖励">
        <Grow ref="grow"/>
      </TabPane>
      <TabPane name="standard" label="分销达标奖励">
        <Standard ref="standard"/>
      </TabPane>
    </Tabs>
	</Card>
</template>

<script>
import TabsHelper from '@/libs/tabs-helper.js';
import Grow from './grow/grow-list';
import Standard from './standard/standard-list';

export default {
  mixins: [TabsHelper],
  components: {
    Grow,
    Standard
  },
  data () {
    return {
      tabName: 'grow'
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
