<template>
  <div class="user-ship">
    <Card>
      <Tabs :value="tabsName" :animated="false" type="card" @on-click="onTabsClick">
        <TabPane name="unbind" label="会员解绑">
          <unbind/>
        </TabPane>
        <TabPane name="shop-transfer" label="会员本店转移">
          <shop-transfer/>
        </TabPane>
        <TabPane name="cross-shop-transfer" label="会员跨店转移">
          <cross-shop-transfer/>
        </TabPane>
      </Tabs>
    </Card>
  </div>
</template>

<script>
import Unbind from './unbind/unbind';
import ShopTransfer from './shop-transfer/shop-transfer';
import CrossShopTransfer from './cross-shop-transfer/cross-shop-transfer';

export default {
  components: {
    Unbind,
    ShopTransfer,
    CrossShopTransfer
  },
  data () {
    return {
      tabsName: 'unbind'
    }
  },
  methods: {
    onTabsClick (name) {
      this.addAct(name);
    },
    addAct (name) {
      let tabName;
      if (name) {
        tabName = name;
      } else {
        tabName = this.$route.query.act ? this.$route.query.act : 'unbind';
      }
      this.$router.push({
        name: 'membership',
        query: {
          act: tabName
        }
      });
      this.tabsName = tabName;
    }
  },
  mounted () {
    this.addAct();
  }
}
</script>

<style>

</style>
