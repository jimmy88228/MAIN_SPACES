<template>
  <div class="link_goods">
    <Form ref="formSearch" :model="formSearch" :label-width="120" inline>
      <FormItem label="所有分类" class="common_inline">
        <Cascader
          class="basic_cascader"
          :data="sortCatList"
          v-model="currentSort"
          placeholder="请选择所有分类"
          filterable
          change-on-select
          transfer
          ref="catRef"
          :clearable="isClear"
          :render-format="renderSort"
          @on-change="selectSortCat"></Cascader>
      </FormItem>
      <FormItem :label-width="0" class="common_inline">
        <Input
          class="goods-search_input"
          v-model="formSearch.search"
          placeholder="请输入关键字"
          clearable
          search
          enter-button
          @on-search="searchGoods"
          @on-clear="searchGoods"
          @keydown.native.enter.prevent="searchGoods">
          <Select v-model="formSearch.type" slot="prepend" class="goods-search_select">
            <Option :value="1">商品名字</Option>
            <Option :value="2">商品货号</Option>
          </Select>
        </Input>
      </FormItem>
    </Form>
    <RadioGroup v-model="mode" class="radio">
      <Radio label="single">
        <span>单向关联</span>
      </Radio>
      <Radio label="multi">
        <span>双向关联</span>
      </Radio>
    </RadioGroup>
    <div class="tranfer_wrapper">
      <Transfer
        :titles="titles"
        :list-style="transferStyle"
        :data="data"
        :target-keys="targetKeys"
        :render-format="render"
        @on-change="handleChange"></Transfer>
        <div v-show="pageTotal" class="list_page left">
          <Page
            :total="pageTotal"
            :page-size="pageSize"
            :current="currentPage"
            :page-size-opts="pageSizeOpts"
            @on-change="changePage"
            @on-page-size-change="handlePageSize"
            show-elevator
            show-total
            show-sizer></Page>
        </div>
    </div>
    <Spin size="large" fix v-if="spinShow"></Spin>
  </div>
</template>

<script>
import Conf from '@/config/index.js';

const defaultItem = {
  value: '0',
  label: '顶级分类',
  children: []
};

export default {
  name: 'LinkGoods',
  props: {
    goodsId: [Number, String],
    catList: {
      type: Array,
      default () {
        return [];
      }
    },
    linkGoods: {
      type: Array,
      default () {
        return [];
      }
    }
  },
  data () {
    return {
      data: [],
      targetKeys: [],
      formSearch: {
        isInit: 1,
        search: '',
        type: 1,
        cat_id: 0,
        vcat_id: 0,
        is_delete: 0, // 0：正常商品 1：回收站里面的商品
        is_on_sale: 0, // 0：全部 1：上架 2：下架
        sale_type: '0',
        sale_kind: 0,
        is_on_image: 0,
        platform_src: []
      },
      sortCatList: [],
      currentSort: [],
      mode: 'single',
      transferStyle: {
        width: '40%',
        height: '400px'
      },
      titles: ['可选商品', '跟该商品关联的商品'],
      temp: {},
      selectedData: [],
      pageTotal: 0,
      pageSize: Conf.PAGE_SIZE_DEF,
      currentPage: Conf.PAGE_START,
      pageSizeOpts: Conf.PAGE_SIZE_OPTS,
      spinShow: false,
      isClear: true
    }
  },
  methods: {
    renderSort (labels) {
      return labels.slice(labels.length - 1).join('/');
    },
    render (item) {
      let curr = this.data.find(dataItem => dataItem.key === item.key);
      const text = curr.mode === 'single' ? ' -- 单向关联' : ' -- 双向关联';
      const mergeStr = curr.direction === 'left' ? '' : text;
      return `${item.label}${mergeStr}`;
    },
    handleChange (targetKeys, direction, moveKeys) {
      this.data.forEach((item) => {
        targetKeys.forEach(target => {
          if (item.key === target && !this.temp[target]) {
            this.temp[target] = true;
            item['mode'] = this.mode;
            item['direction'] = direction;
          }
        });
        if (direction === 'left') {
          moveKeys.forEach(moveItem => {
            if (moveItem in this.temp) {
              delete this.temp[moveItem];
            }
            if (item.key === moveItem) {
              item['mode'] = this.mode;
              item['direction'] = direction;
            }
          });
        }
      });
      this.targetKeys = targetKeys;
    },
    selectSortCat (value, selectedData) {
      this.formSearch.cat_id = selectedData[selectedData.length - 1].value;
    },
    changePage (page) {
      this.currentPage = page;
      this.loadData();
    },
    handlePageSize (pageSize) {
      this.pageSize = pageSize;
      this.loadData();
    },
    searchGoods () {
      this.currentPage = 1;
      this.loadData();
    },
    loadData () {
      let selectedData = this.data.filter(item => item.direction === 'right');
      this.targetKeys = selectedData.map(item => {
        return item.key;
      });
      const params = Object.assign({}, this.formSearch, {
        page: this.currentPage,
        pageSize: this.pageSize,
        goods_id: this.goodsId
      })
      this.spinShow = true;
      this.$ajax.post(this.$api.ShopGoodsList, params)
      .then((response) => {
        var res = response.data;
        if (res.code) {
          this.pageTotal = res.data && res.data.total
          this.data = [];
          this.data = res.data.items.map(item => {
            return Object.assign({}, item, {
              key: item.goods_id,
              label: item.goods_name,
              mode: 'single',
              direction: 'left'
            });
          }).filter(item => {
            const result = selectedData.map(item => item.goods_id);
            return !result.includes(item.goods_id);
          });
          this.data.push(...selectedData);
        }
        this.spinShow = false;
      });
    }
  },
  watch: {
    catList (nV) {
      this.sortCatList = [...nV];
      this.sortCatList.unshift(defaultItem);
    },
    data: {
      handler (newVal) {
        const result = newVal.filter(item => item.direction === 'right').map(item => {
          return {
            link_goods_id: item.key,
            is_double: item.mode === 'single' ? "0" : "1"
          }
        });
        this.$emit('link-goods', result);
      },
      deep: true,
      immediate: true
    },
    linkGoods: {
      handler (newVal) {
        if (newVal.length === 0) return false;
        this.selectedData = newVal.map(item => {
          this.temp[item.link_goods_id] = true;
          return Object.assign({}, item, {
            key: item.link_goods_id,
            label: item.goods_name,
            mode: item.is_double === 1 ? 'multi' : 'single',
            direction: 'right'
          });
        });
        this.data.push(...this.selectedData);
        this.targetKeys = newVal.map(item => item.link_goods_id);
      },
      deep: true,
      immediate: true
    }
  }
}
</script>

<style lang="less">
.link_goods{
  .goods-search_input{
		width:320px;
		.goods-search_select{
			width: 100px;
		}
  }
  .ivu-input-icon-clear{
		right:50px;
	}
  .radio{
    margin-bottom: 10px;
    margin-left: 120px;
  }
  .ivu-form-item{
    margin-bottom: 10px;
  }
  .tranfer_wrapper{
    margin-left: 120px;
  }
}
</style>
