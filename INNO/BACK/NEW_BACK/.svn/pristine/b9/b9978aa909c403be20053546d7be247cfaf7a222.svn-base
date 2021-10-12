<template>
	<Card class="coupon-list">
		<Tabs :value="tabName" :animated="false" type="card" @on-click="onTabsClick">
      <TabPane name="coupon-list" label="优惠券列表">
        <coupon-list ref="coupon-list"/>
      </TabPane>
      <TabPane name="recycle-bin" label="回收站">
        <coupon-list ref="recycle-bin"/>
      </TabPane>
    </Tabs>
	</Card>
</template>

<script>
import CouponList from './coupon-list/coupon-list';
import TabsHelper from '@/libs/tabs-helper';

export default {
  mixins: [TabsHelper],
  components: {
    CouponList
  },
  data () {
    return {
      tabName: 'coupon-list'
    }
  }
}
</script>

<style>

</style>
