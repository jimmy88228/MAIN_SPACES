<template>
	<PageTopBase class="assembly-list">
    <template v-slot:back>
      <Icon type="ios-arrow-dropleft" @click="goBack" style="cursor: pointer;" size="28"/>
    </template>
    <Row>
      <Col :span="20">
        <SearchForm ref="search" class="search" @on-search="searchPage"></SearchForm>
      </Col>
      <Col :span="4">
        <div class="btn-group">
          <Button type="primary" class="export" @click="handleExport">导出</Button>
        </div>
      </Col>
    </Row>
		<Tabs :value="tabName" :animated="false" type="card" @on-click="onTabsClick">
      <TabPane name="send-list" label="已发放列表">
        <data-list ref="send-list" :id="id"/>
      </TabPane>
      <TabPane name="use-list" label="已使用列表">
        <data-list ref="use-list" :id="id"/>
      </TabPane>
      <TabPane name="del-list" label="已删除列表">
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
   created(){
      this.getParams()
   },
  methods: {
      getParams(){
          this.tabName=this.$route.params.act;
      },
    goBack () {
      this.$router.push({
        name: 'coupons-list'
      });
    },
    handleExport () {
      this.$refs[this.$route.query.act].handleExport();
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
