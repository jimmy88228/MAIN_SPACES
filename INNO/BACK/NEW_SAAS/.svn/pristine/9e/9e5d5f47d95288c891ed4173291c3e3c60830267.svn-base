<template>
  <div class="goods-allocation">
    <div class="header">
      <Cascader class="basic_cascader" :data="sortVcatList" v-model="currentVcat" :render-format="renderSort" @on-change="selectSortVcat" filterable change-on-select transfer :clearable="false"></Cascader>
    </div>
  </div>
</template>

<script>

const defaultItem = {
  value: 0,
  label: '请选择',
  children: []
};

export default {
  props: {
    vcatIdList: {
      type: Array
    },
    isAutoLoad: {
      type: Boolean,
      default: true
    },
    data: {
      type: Array,
      default () {
        return [];
      }
    }
  },
  data () {
    return {
      sortCatList: [],
      currentSort: [],
      currentVcat: this.vcatIdList,
      cat_id: 0,
      vcat_id: 0,
      sortVcatList: [],
      currentVcatSort: [],
    }
  },
  methods: {
    renderSort (labels) {
      return labels.slice(labels.length - 1).join('/');
    },
    loadExtraData () {
      this.$ajax.post(this.$api.vcatTree)
      .then(response => {
        const res = response.data;
        if (res.code) {
          const origin = res.data;
          this.sortVcatList = this.handleSortList(origin);
          this.sortVcatList.unshift(defaultItem);
        }
      });
    },
    handleSortList (context) {
      const format = context.map(item => {
        return {
          value: item.cat_id || item.vcat_id,
          label: item.cat_name || item.vcat_name,
          parent_id: item.parent_id,
          children: item.children.length ? this.handleSortList(item.children) : []
        }
      });
      return format;
    },
    selectSortVcat (value, selectedData) {
      this.vcat_id = selectedData[selectedData.length - 1].value;
      this.$emit('get-vcat-id', this.vcat_id);
    },
  },
  watch: {
    data: {
      handler(nV) {
        if (!nV.length) return;
        this.sortVcatList = this.handleSortList(nV);
        this.sortVcatList.unshift(defaultItem);
      },
      immediate: true
    }
  },
  mounted () {
    if (this.isAutoLoad) this.loadExtraData();
  }
}
</script>

<style lang="less">
.goods-allocation{
  .content{
    .header{
      display: flex;
      align-items: center;
      margin-bottom: 20px;
      .title{
        margin-right: 10px;
      }
      .cascader{
        width: 320px;
      }
      .btn{
        margin-left: 10px;
      }
    }
    .checkbox{
      margin-bottom: 10px;
    }
    .card{
      overflow-x: hidden;
      overflow-y: scroll;
      .calc_good{
        display: flex;
        align-items: center;
        justify-content: space-between;
      }
      .select_item{
        margin-bottom: 4px;
      }
    }
  }
}
</style>
