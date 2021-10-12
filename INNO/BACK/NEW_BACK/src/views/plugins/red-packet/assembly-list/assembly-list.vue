<template>
	<PageTopBase class="assembly-list">
    <template v-slot:back>
      <Icon type="ios-arrow-dropleft" @click="goBack" style="cursor: pointer;" size="28"/>
    </template>
    <SearchForm ref="search" class="search" @on-search="searchPage"></SearchForm>
		<Tabs :value="tabName" :animated="false" type="card" @on-click="onTabsClick">
      <TabPane name="send-list" label="已发放">
        <data-list ref="send-list" :id="id"/>
      </TabPane>
      <TabPane name="use-list" label="已使用">
        <data-list ref="use-list" :id="id"/>
      </TabPane>
      <TabPane name="del-list" label="已删除">
        <data-list ref="del-list" :id="id"/>
      </TabPane>
    </Tabs>
	</PageTopBase>
</template>

<script>
import PageTopBase from '@/views/my-components/page-top-base/index';
import TabsHelper from '@/libs/tabs-helper';
import SearchForm from './search-form';
import DataList from './data-list';

export default {
  props: ['id'],
  mixins: [TabsHelper],
  data () {
    return {
      tabName: 'send-list'
    }
  },
  components: {
    SearchForm,
    PageTopBase,
    DataList
  },
  methods: {
    goBack () {
      this.$router.push({
        name: 'red-packet-list'
      });
    }
  }
}
</script>

<style lang="less" scoped>
.assembly-list{
  .btn-group{
    text-align: right;
  }
}
</style>
