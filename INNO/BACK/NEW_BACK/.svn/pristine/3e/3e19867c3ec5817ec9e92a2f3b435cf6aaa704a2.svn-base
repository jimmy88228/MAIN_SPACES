<template>
  <Card>
    <Tabs :value="tabsName" :animated="false" type="card" @on-click="onTabsClick">
      <TabPane name="color" :label="colorName">
        <ColorNorms ref="goodsColor" @get-color-name="getColorName"></ColorNorms>
      </TabPane>
      <TabPane name="size" :label="sizeName">
        <SizeNorms ref="goodsSize" @get-size-name="getSizeName"></SizeNorms>
      </TabPane>
    </Tabs>
    <Spin fix v-show="colorLoaded"></Spin>
    <Spin fix v-show="sizeLoaded"></Spin>
  </Card>
</template>
<script>
import ColorNorms from './color-norms/spec-list';
import SizeNorms from './size-norms/spec-list';

export default {
  components: {
    ColorNorms,
    SizeNorms
  },
  data () {
    return {
      tabsName: 'color',
      colorName: '',
      sizeName: '',
      colorLoaded: false,
      sizeLoaded: false
    }
  },
  methods: {
    onTabsClick (name) {
      this.tabsName = name;
      if (name == 'color') {
        this.$refs.goodsColor.init();
      } else if (name == 'size') {
        this.$refs.goodsSize.init();
      }
    },
    getColorName (name) {
      this.colorName = name;
      this.colorLoaded = false;
    },
    getSizeName (name) {
      this.sizeName = name;
      this.sizeLoaded = false;
    }
  },
  mounted () {
    this.colorLoaded = true;
    this.sizeLoaded = true;
  }
}
</script>
