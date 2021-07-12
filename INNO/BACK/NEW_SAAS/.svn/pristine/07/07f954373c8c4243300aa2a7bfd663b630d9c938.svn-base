<template>
  <PageTopBase>
    <template v-slot:back>
      <Icon type="ios-arrow-dropleft" @click="goBack" style="cursor: pointer;" size="28"/>
    </template>
    <Tabs :value="tabName" :animated="false" type="card" @on-click="onTabsClick">
      <TabPane name="user-info" label="会员信息">
        <user-info ref="user-info" :id="id"></user-info>
      </TabPane>
      <TabPane name="detail-info" label="所有明细">
        <detail-info ref="detail-info" :id="id"></detail-info>
      </TabPane>
    </Tabs>
  </PageTopBase>
</template>

<script>
import PageTopBase from '@/views/my-components/page-top-base/index';
import TabsHelper from '@/libs/tabs-helper';
import UserInfo from './user-info/user-info';
import DetailInfo from './detail-info/detail-info';

export default {
  mixins: [TabsHelper],
  props: ['id'],
  components: {
    PageTopBase,
    UserInfo,
    DetailInfo
  },
  data () {
    return {
      tabName: 'user-info'
    }
  },
  methods: {
    goBack () {
      this.$router.push({
        name: 'coupons-bag-activity'
      });
    },
  }
}
</script>

<style>

</style>
