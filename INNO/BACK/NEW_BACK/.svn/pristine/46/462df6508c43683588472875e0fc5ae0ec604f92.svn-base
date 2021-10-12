<template>
	<Card class="advert-list">
		<Tabs :value="tabName" :animated="false" type="card" @on-click="onTabsClick">
      <TabPane name="activity" label="活动推广">
        <Activity ref="activity"/>
      </TabPane>
      <TabPane name="assets" label="资产提醒">
        <Assets ref="assets"/>
      </TabPane>
    </Tabs>
	</Card>
</template>

<script>
import TabsHelper from '@/libs/tabs-helper';
import Activity from './activity/activity-list';
import Assets from './assets/assets-list';

export default {
  mixins: [TabsHelper],
  components: {
    Activity,
    Assets
  },
  data () {
    return {
      tabName: 'activity'
    }
  }
}
</script>

<style>

</style>
