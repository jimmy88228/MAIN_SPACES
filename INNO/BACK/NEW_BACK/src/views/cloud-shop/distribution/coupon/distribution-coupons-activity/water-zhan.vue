<template>
	<Card class="reward-report">
    <div slot="title" class="back">
      <div class="back_title">
        <Tooltip content="返回" class="back">
          <slot name="back"><Icon type="ios-arrow-dropleft" @click="goBack" style="cursor: pointer;" size="28"/></slot>
        </Tooltip>
        <span>列表</span>
      </div>
      <slot name="action"></slot>
    </div>
		<Tabs :value="tabName" :animated="false" type="card" @on-click="onTabsClick">
      <TabPane name="sended" label="已派发列表">
        <Sended ref="sended" :id="id"/>
      </TabPane>
      <TabPane name="geted" label="已领取列表">
        <Geted ref="geted" :id="id"/>
      </TabPane>
      <TabPane name="used" label="已使用列表">
        <Used ref="used" :id="id"/>
      </TabPane>
      <TabPane name="deled" label="已删除列表">
        <Deled ref="deled" :id="id"/>
      </TabPane>
    </Tabs>
	</Card>
</template>

<script>
import TabsHelper from '@/libs/tabs-helper.js';
import Sended from './sended/send-list';
import Geted from './geted/geted-list';
import Used from './used/used-list';
import Deled from './deled/deled-list';
import PageTopBase from '@/views/my-components/page-top-base/index';

export default {
  props: ['id'],
  mixins: [TabsHelper],
  components: {
    Sended,
    Geted,
    Used,
    Deled,
    PageTopBase
  },
  data () {
    return {
      tabName: 'sended'
    }
  },
  methods: {
    searchPage(data) {
      this.$refs[this.tabName].searchPage(data);
    },
    goBack () {
      this.$router.push({
        name: 'distribution-coupons-activity'
      });
    }
  }
}
</script>

<style lang="less">
.reward-report{
  .back{
    position: relative;
    display: flex;
    align-items: center;
    justify-content: space-between;
    .back_title {
      display: flex;
      align-items: center;
      .back {
        margin-right: 20px;
      }
    }
  }
  .ivu-table-cell-expand{
    display: none;
  }
  td.ivu-table-expanded-cell {
    padding: 0 0 10px 0;
  }
}
</style>
