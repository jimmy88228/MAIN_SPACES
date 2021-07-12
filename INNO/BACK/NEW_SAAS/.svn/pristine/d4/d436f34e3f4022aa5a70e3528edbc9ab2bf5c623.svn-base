<template>
	<Card class="register-activity">
		<Tabs :value="tabName" :animated="false" type="card" @on-click="onTabsClick">
      <TabPane name="benefits" label="新会员注册赠送">
        <user-benefits ref="benefits"></user-benefits>
      </TabPane>
      <TabPane name="register" label="注册返利">
        <register-list ref="register"></register-list>
      </TabPane>
      <TabPane name="invite" label="邀请返利">
        <invite-list ref="invite"></invite-list>
      </TabPane>
    </Tabs>
	</Card>
</template>

<script>
import TabsHelper from '@/libs/tabs-helper';
import UserBenefits from './user-benefits';
import RegisterList from './register/register-list';
import InviteList from './invite/invite-list';

export default {
  mixins: [TabsHelper],
  components: {
    UserBenefits,
    RegisterList,
    InviteList
  },
  data () {
    return {
      tabName: 'benefits'
    }
  }
}
</script>
