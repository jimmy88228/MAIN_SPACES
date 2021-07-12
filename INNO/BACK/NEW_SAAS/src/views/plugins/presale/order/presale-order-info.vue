<template>
	<Card class="presale-order-info">
    <Row>
      <Col span="12">
        <SearchForm ref="search" @on-search="searchPage"></SearchForm>
      </Col>
      <Col span="12" class="btn-group">
        <Button type="primary" @click="handleExport">导出</Button>
      </Col>
    </Row>
		<Tabs :value="tabName" :animated="false" type="card" @on-click="onTabsClick">
      <TabPane name="all" label="全部">
        <PresaleOrderList ref="all"/>
      </TabPane>
      <TabPane name="finished" label="已完成">
        <PresaleOrderList ref="finished"/>
      </TabPane>
      <TabPane name="pay-money" label="已付定金">
        <PresaleOrderList ref="pay-money"/>
      </TabPane>
      <TabPane name="cancel" label="已取消">
        <PresaleOrderList ref="cancel"/>
      </TabPane>
    </Tabs>
	</Card>
</template>

<script>
import TabsHelper from '@/libs/tabs-helper';
import PresaleOrderList from './presale-order-list';
import SearchForm from './search-form';

export default {
  mixins: [TabsHelper],
  data () {
    return {
      tabName: 'all'
    }
  },
  components: {
    PresaleOrderList,
    SearchForm
  },
  methods: {
    searchPage (searchData) {
      this.$refs[this.tabName].searchPage(searchData);
    },
    handleExport () {
      this.$refs[this.tabName].handleExport();
    }
  }
}
</script>
<style lang="less">
.presale-order-info{
  .btn-group{
    text-align: right;
  }
}
</style>
