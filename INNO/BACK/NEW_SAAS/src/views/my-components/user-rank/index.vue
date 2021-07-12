<template>
  <Select v-model="rankData" :multiple="isMulti" class="basic_select" @on-change="val => $emit('update:value', val)">
    <Option v-for="item in levelList" :value="item.id" :key="item.id">{{ item.name }}</Option>
  </Select>
</template>

<script>
export default {
  props: {
    value: [Array, String, Number],
    isMulti: {
      type: Boolean,
      default: true
    }
  },
  data () {
    return {
      levelList: [],
      rankData: this.value
    }
  },
  methods: {
    loadData () {
      return this.$ajax.post(this.$api.userRankElementData)
      .then(response => {
        const res = response.data;
        if (res.code) {
          this.levelList = res.data;
        }
      });
    },
  },
  mounted () {
    this.loadData();
  },
  watch: {
    value(nV) {
      this.rankData = nV;
    }
  }
}
</script>

<style>

</style>
