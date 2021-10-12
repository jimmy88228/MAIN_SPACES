<template>
	<Card class="money-coupon-list">
		<Tabs :value="tabName" :animated="false" type="card" @on-click="onTabsClick">
      <TabPane name="money-coupon-list" label="现金券列表">
        <money-coupon-list ref="money-coupon-list"/>
      </TabPane>
      <TabPane name="recycle-bin" label="现金券回收站">
        <money-coupon-list ref="recycle-bin"/>
      </TabPane>
    </Tabs>
	</Card>
</template>

<script>
import TabsHelper from '@/libs/tabs-helper';
import MoneyCouponList from './money-coupon-list/money-coupon-list';

export default {
  mixins: [TabsHelper],
  data () {
    return {
      tabName: 'money-coupon-list'
    }
  },
  components: {
    MoneyCouponList
  }
}
</script>
