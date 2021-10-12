<template>
  <div>
    <titleBar>顶部广告</titleBar>
    <div class="top">
      <label>是否启用</label>
      <i-switch v-model="enableTop" true-value="1" false-value="0">
        <span slot="open">是</span>
        <span slot="close">否</span>
      </i-switch>
      <UniversalTemplate ref="editTopTemplate" :selected="selectedTopData"></UniversalTemplate>
    </div>
    <titleBar>中部广告</titleBar>
    <div class="middle">
      <label>是否启用</label>
      <i-switch v-model="enableMiddle" true-value="1" false-value="0">
        <span slot="open">是</span>
        <span slot="close">否</span>
      </i-switch>
      <UniversalTemplate ref="editMiddleTemplate" :selected="selectedMiddleData"></UniversalTemplate>
    </div>
    <titleBar>底部广告</titleBar>
    <div class="bottom">
      <label>是否启用</label>
      <i-switch v-model="enableBottom" true-value="1" false-value="0">
        <span slot="open">是</span>
        <span slot="close">否</span>
      </i-switch>
      <UniversalTemplate ref="editBottomTemplate" :selected="selectedBottomData"></UniversalTemplate>
    </div>
  </div>
</template>

<script>
import titleBar from '@/views/my-components/title-bar/title-bar';
import UniversalTemplate from '@/views/my-components/custom-module/universal/index';

export default {
  props: ['data'],
  components: {
    titleBar,
    UniversalTemplate
  },
  data () {
    return {
      enableTop: '0',
      enableMiddle: '0',
      enableBottom: '0',
      allData: [],
      selectedTopData: [],
      selectedMiddleData: [],
      selectedBottomData: []
    }
  },
  methods: {
    transformData (data) {
      return data.map(item => {
        return {
          type: +item.bind_type,
          lineType: item.items_list.length,
          adList: item.items_list.map(c => {
            return {
              pic: c.img_path,
              name: c.tag,
              linkType: c.func_type,
              linkUrl: c.link_url,
              related_id: c.related_id,
              related_data: c.related_data
            }
          })
        }
      });
    },
    getData (fn) {
      let topResult = this.$refs.editTopTemplate.$children[0].data;
      let middleResult = this.$refs.editMiddleTemplate.$children[0].data;
      let bottomResult = this.$refs.editBottomTemplate.$children[0].data;
      let selectedTopData = topResult,
          selectedMiddleData = middleResult,
          selectedBottomData = bottomResult;
      this.allData = [
        {
          enable: this.enableTop,
          type: 'TOP',
          ids_list: selectedTopData
        },
        {
          enable: this.enableMiddle,
          type: 'MIDDLE',
          ids_list: selectedMiddleData
        },
        {
          enable: this.enableBottom,
          type: 'BOTTOM',
          ids_list: selectedBottomData
        }
      ]
      fn(this.allData);
    }
  },
  watch: {
    data(nV) {
      let {
        TOP: top,
        MIDDLE: middle,
        BOTTOM: bottom
      } = nV;
      this.enableTop = top.enable;
      this.enableMiddle = middle.enable;
      this.enableBottom = bottom.enable;
      this.selectedTopData = this.transformData(top.ids_list);
      this.selectedMiddleData = this.transformData(middle.ids_list);
      this.selectedBottomData = this.transformData(bottom.ids_list);
    }
  }
}
</script>

<style>

</style>
