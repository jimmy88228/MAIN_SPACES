<template>
  <div class="content" ref="content" :style="contentStyle">
    <template v-if="data.length > 0">
      <expand-item v-for="item in data" :key="item._index" :data="item" :item-width="itemWidth" ref="item"></expand-item>
    </template>
    <template v-else>
      <div style="width:100%;text-align:center;padding-top:100px;">暂无数据</div>
    </template>
    
  </div>
</template>

<script>
import ExpandItem from './expand-item';
const CONTENT_HEIGHT = 400;
const COLUMNS = 5;
const MARGIN = 10;

export default {
  components: {
    ExpandItem
  },
  props: {
    data: {
			type: Array,
			default: function(){
				return [];
			}
		}
  },
  data () {
    return {
      loaded: false,
      itemWidth: 0
    }
  },
  computed: {
    contentStyle () {
      let data = this.data || [];
			if(data.length == 0) return {};
      let rows = Math.ceil(data.length / COLUMNS);
      let item = this.$refs.item && this.$refs.item[0];
      let itemHeight = item && item.$el.offsetHeight || 0;
      this.$nextTick(() => {
        let contentWidth = this.$refs.content && this.$refs.content.clientWidth || 0;
        let itemWidth = Math.floor((contentWidth - MARGIN * 4) / 5);
        this.itemWidth = itemWidth;
      });
      return {
        overflowY: this.loaded && rows * itemHeight > CONTENT_HEIGHT ? 'scroll' : 'hidden'
      }
    }
  },
  methods: {

  },
  watch: {
    data () {
      this.$nextTick(() => {
        this.loaded = true;
      });
    }
  }
}
</script>

<style lang="less" scoped>
.content{
  display: flex;
  align-items: flex-start;
  flex-wrap: wrap;
  height: 400px;
  overflow-x: hidden;
}
</style>
