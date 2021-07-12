<template>
	<Card class="lottery-activity">
		<Tabs :value="tabName" :animated="false" type="card" @on-click="onTabsClick">
      <TabPane name="fan" label="生肖翻翻看">
        <Fan ref="fan"></Fan>
      </TabPane>
      <TabPane name="fruit" label="水果机">
        <Fan ref="fruit"></Fan>
      </TabPane>
      <TabPane name="yao" label="摇一摇">
        <Fan ref="yao"></Fan>
      </TabPane>
      <TabPane name="egg" label="砸金蛋">
        <Fan ref="egg"></Fan>
      </TabPane>
      <TabPane name="pan" label="大转盘">
        <Fan ref="pan"></Fan>
      </TabPane>
      <TabPane name="coupon" label="一点领券">
        <Fan ref="coupon"></Fan>
      </TabPane>
    </Tabs>
	</Card>
</template>

<script>
import TabsHelper from '@/libs/tabs-helper';
import Fan from './fan/fan-list';
import Fruit from './fruit/fruit-list';
import Yao from './yao/yao-list';
import Egg from './egg/egg-list';
import Pan from './pan/pan-list';
import Coupon from './coupon/coupon-list';

export default {
  mixins: [TabsHelper],
  components: {
    Fan,
    Fruit,
    Yao,
    Egg,
    Pan,
    Coupon
  },
  data () {
    return {
      tabName: 'fan'
    }
  }
}
</script>
