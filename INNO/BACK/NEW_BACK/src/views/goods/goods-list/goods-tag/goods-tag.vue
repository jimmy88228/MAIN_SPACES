<template>
  <div class="goods_tag">
    <Transfer
        :titles="titles"
        :list-style="transferStyle"
        :data="data"
        :target-keys="targetKeys"
        @on-change="handleChange"></Transfer>
  </div>
</template>

<script>
export default {
  props: {
    goodsId: [String, Number],
    tagGoods: Array
  },
  data () {
    return {
      titles: ['待选列表', '选定列表'],
      transferStyle: {
        width: '40%',
        height: '400px'
      },
      data: [],
      targetKeys: []
    }
  },
  methods: {
    handleChange (targetKeys) {
      this.targetKeys = targetKeys;
    },
    loadData () {
      return this.$ajax.post(this.$api.goodsTagManage, { goodsId: this.goodsId })
      .then(response => {
        const res = response.data;
        if (res.code) {
          this.data = res.data && res.data.items.map(item => {
            return {
              key: Number(item.tag_id),
              label: item.tag_name
            }
          });
          this.targetKeys = this.tagGoods.map(item => Number(item.tag_id));
        }
      });
    }
  },
	mounted(){
		this.loadData();
	},
  watch: {
    tagGoods: {
      handler(newVal) {
        if (newVal && newVal.length > 0) {
					this.targetKeys = newVal.map(item => Number(item.tag_id));
				}
      },
      immediate: true
    },
    targetKeys: {
      handler(newVal) {
        this.$emit('edit-tag', newVal);
      },
      immediate: true
    }
  }
}
</script>

<style lang="less" scoped>
.goods_tag{
  margin-left: 120px;
}
</style>
