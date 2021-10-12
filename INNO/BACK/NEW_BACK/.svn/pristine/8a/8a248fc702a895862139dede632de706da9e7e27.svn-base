<template>
	<Card class="offline-coupon-list">
		<Tabs :value="tabName" :animated="false" type="card" @on-click="onTabsClick">
      <TabPane name="payment" label="满减券付款方式">
        <payment-list ref="payment"/>
      </TabPane>
      <TabPane name="discount-type" label="折扣券类型">
        <discount-list ref="discount-type"/>
      </TabPane>
      <TabPane name="platform-type" label="优惠券平台类型">
        <platform-list ref="platform-type"/>
      </TabPane>
    </Tabs>
	</Card>
</template>

<script>
import PaymentList from './payment/payment-list';
import DiscountList from './discount-type/discount-type-list';
import PlatformList from './platform-type/platform-type-list';//platform-type
import TabsHelper from '@/libs/tabs-helper';

export default {
  mixins: [TabsHelper],
  components: {
    PaymentList,
    DiscountList,
    PlatformList
  },
  data () {
    return {
      tabName: 'payment'
    }
  }
}
</script>
