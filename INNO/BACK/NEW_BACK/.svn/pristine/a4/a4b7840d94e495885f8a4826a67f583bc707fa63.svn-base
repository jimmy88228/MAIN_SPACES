<style lang="less" scoped>

</style>
<template>
    <Card>
        <Tabs :value="tabsName" :animated="false" type="card" @on-click="onTabsClick">
            <TabPane name="standard" label="标准分类">
	        	<GoodsCat ref="goodsCat" v-if="showCat"></GoodsCat>
	        </TabPane>
            <TabPane name="custom" label="自定义分类">
	        	<GoodsCustomCat ref="goodsCustomCat" v-if="showCustomCat"></GoodsCustomCat>
	        </TabPane>
        </Tabs>
    </Card>
</template>
<script>
import GoodsCat from './cat/goods-cat';
import GoodsCustomCat from './custom-cat/goods-custom-cat';

export default {
  components: {
    GoodsCat,
    GoodsCustomCat
  },
  data () {
    return {
      tabsName: 'standard',
      showCat: true,
      showCustomCat: false
    }
  },
  methods: {
    onTabsClick (name) {
      this.tabsName = name;
      if (name == 'standard') {
        this.showCat = true;
        this.showCustomCat = false;
        this.$nextTick(() => {
          this.$refs.goodsCat.loadData();
        });
      } else if (name == 'custom') {
        this.showCat = false;
        this.showCustomCat = true;
        this.$nextTick(() => {
          this.$refs.goodsCustomCat.loadData();
        });
      }
    }
  },
  mounted () {
    this.$refs.goodsCat.loadData();
  }
}
</script>
