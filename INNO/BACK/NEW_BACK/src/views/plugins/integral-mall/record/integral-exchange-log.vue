<template>
	<Card class="integral-exchange-log">
		<Tabs :value="tabName" :animated="false" type="card" @on-click="onTabsClick">
      <TabPane name="coupon" label="优惠券兑换">
        <coupon-list ref="coupon"/>
      </TabPane>
      <TabPane name="gift" label="礼品兑换">
        <gift-list ref="gift"/>
      </TabPane>
    </Tabs>
	</Card>
</template>

<script>
import CouponList from './coupon/coupon-list';
import GiftList from './gift/gift-list';
import TabsHelper from '@/libs/tabs-helper';

export default {
  mixins: [TabsHelper],
  components: {
    CouponList,
    GiftList
  },
  data () {
    return {
      tabName: 'coupon'
    }
  }
}
</script>
