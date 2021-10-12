<template>
  <div class="item" :style="itemStyle">
    <p class="limit">名称: {{data.goods_name}}</p>
    <p class="limit">货号: {{data.goods_sn}}</p>
    <p>
			<span v-if="data.is_on_sale_type || data.is_on_sale_type == 0">状态: {{data.is_on_sale_type}}</span> 
			<span v-if="data.goods_number || data.goods_number == 0">库存: {{data.goods_number}}</span>
		</p>
    <img :src="data.goods_thumb2" v-if="data.goods_thumb2" class="img"/>
    <img src="@rs/images/default-img.jpg" v-else class="img"/>
    <Checkbox v-model="data._checked" @on-change="status => toggleSelect(status, data._index, data)" v-show="data._visible">参加满减活动</Checkbox>
  </div>
</template>

<script>
export default {
  props: {
    data: Object,
    itemWidth: Number
  },
  inject: ['root'],
  computed: {
    itemStyle () {
      return {
        flexBasis: this.itemWidth + 'px'
      }
    }
  },
  methods: {
    toggleSelect (status, key, data) {
      this.root.handleCheck(status, key, data);
    }
  }
}
</script>

<style lang="less" scoped>
.item{
  font-size: 13px;
  padding: 5px;
  border: 1px solid #efefef;
  margin-right: 10px;
  margin-bottom: 10px;
  .img{
    display: block;
    width: 80px;
    height: 80px;
    object-fit: contain;
    margin: 10px 0;
  }
  .limit{
    width: 150px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
  &:nth-child(5n) {
    margin-right: 0;
  }
}
</style>
