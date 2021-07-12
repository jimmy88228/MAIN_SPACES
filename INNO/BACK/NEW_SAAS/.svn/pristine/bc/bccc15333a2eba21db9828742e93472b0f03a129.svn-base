<template>
	<Card class="staff-info">
		<Tabs :value="tabName" :animated="false" type="card" @on-click="onTabsClick">
      <TabPane name="staff-list" label="店员列表">
        <StaffList ref="staff-list"/>
      </TabPane>
      <TabPane name="staff-work" label="员工岗位">
        <StaffWork ref="staff-work"/>
      </TabPane>
      <TabPane name="staff-service" label="店员二维码扫码回复设置">
        <StaffService ref="staff-service"/>
      </TabPane>
      <TabPane name="staff-setting" label="店员拓展设置">
        <StaffSetting ref="staff-setting"/>
      </TabPane>
    </Tabs>
	</Card>
</template>

<script>
import StaffList from './staff-list/staff-list';
import StaffWork from './staff-work/staff-work';
import StaffService from './staff-service/staff-service';
import StaffSetting from './staff-setting/index';
import TabsHelper from '@/libs/tabs-helper';

export default {
  mixins: [TabsHelper],
  components: {
    StaffList,
    StaffWork,
    StaffService,
    StaffSetting
  },
  data () {
    return {
      tabName: 'staff-list'
    }
  }
}
</script>

<style>

</style>
