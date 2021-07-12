<template>
  <div class="goods-search-form">
		<Form ref="formSearch" :model="formSearch" :label-width="90" label-colon>
			<FormItem label="所有分类" class="cascader_wrapper">
        <Cascader 
          class="basic_cascader" 
          :data="sortCatList" 
          v-model="currentSort" 
          placeholder="请选择所有分类" 
          filterable 
          change-on-select 
          transfer
          :style="sortStyle" 
          ref="catRef"
          @on-change="selectSortCat"></Cascader>
      </FormItem>
			<FormItem label="自定义分类" class="cascader_wrapper">
				<Cascader 
          class="basic_cascader" 
          :data="sortVcatList" 
          v-model="currentVcatSort" 
          placeholder="请选择自定义分类" 
          filterable 
          change-on-select
          transfer
          :style="sortVcatStyle" 
          ref="vcatRef"
          @on-change="selectSortVcat"></Cascader>
      </FormItem>
      <FormItem label="商品类别" class="common_inline">
        <Select v-model="formSearch.sale_type" class="basic_select">
          <Option v-for="(value, name) in saleType" :value="name" :key="name">{{value}}</Option>
        </Select>
      </FormItem>
      <FormItem :label-width="0" class="common_inline">
        <Input
          class="goods-search_input"
          v-model="formSearch.search"
          placeholder="请输入关键字"
          clearable
          search
          enter-button
          @on-search="searchPage"
          @on-clear="searchPage"
          @keydown.native.enter.prevent="searchPage">
            <Select v-model="formSearch.type" slot="prepend" class="goods-search_select">
              <Option :value="1">商品名字</Option>
              <Option :value="2">商品货号</Option>
            </Select>
        </Input>
      </FormItem>
    </Form>
  </div>
</template>

<script>
const defaultItem = {
  value: '0',
  label: '顶级分类',
  children: []
};

export default {
  name: 'searchForm',
  props: {
    catList: {
      type: Array,
      default () {
        return [];
      }
    },
    vcatList: {
      type: Array,
      default () {
        return [];
      }
    },
    goodSaleType: {
      type: Object,
      default () {
        return {};
      }
    }
  },
  data () {
    return {
      // 搜索表单
      formSearch: {
        search: '',
        type: 1,
        cat_id: 0,
        vcat_id: 0,
        sale_type: '0'
      },
      sortCatList: [],
      sortVcatList: [],
      currentSort: [],
      currentVcatSort: [],
      saleType: {},

      calcWidth: 'auto',
      calcVcatWidth: 'auto'
    }
  },
  computed: {
    sortStyle () {
      return {
        width: this.calcWidth
      }
    },
    sortVcatStyle () {
      return {
        width: this.calcVcatWidth
      }
    }
  },
  methods: {
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
    // 搜索按钮触发
    searchPage () {
    	this.$emit('on-search', this.formSearch);
    },
    selectSortCat (value, selectedData) {
      this.formSearch.cat_id = selectedData[selectedData.length - 1].value;
      this.$nextTick(() => {
        // 获取到文字的宽度+关闭按钮的宽度
        this.calcWidth = this.$refs.catRef.$el.childNodes[0].childNodes[4].offsetWidth + 14 + 'px';
      });
    },
    selectSortVcat (value, selectedData) {
      this.formSearch.vcat_id = selectedData[selectedData.length - 1].value;
      this.$nextTick(() => {
        // 获取到文字的宽度+关闭按钮的宽度
        this.calcVcatWidth = this.$refs.vcatRef.$el.childNodes[0].childNodes[4].offsetWidth + 14 + 'px';
      });
    }
  },
  watch: {
    catList (nV) {
      this.sortCatList = this.handleSortList([...nV]);
      this.sortCatList.unshift(defaultItem);
    },
    vcatList (nV) {
      this.sortVcatList = this.handleSortList([...nV]);
      this.sortVcatList.unshift(defaultItem);
    },
    goodSaleType (nV) {
      this.saleType = { ...nV };
    }
  }
}
</script>

<style lang="less">
.goods-search-form{
  .ivu-cascader-label {
    width: auto;
    text-overflow: unset;
    overflow: visible;
  }
	.cascader_wrapper{
    display: inline-block;
  }
	.ivu-input-icon-clear{
		right:50px;
	}
	.basic_cascader, .basic_select{
		display: inline-block;
		width: 260px;
	}
	.goods-search_input{
		width:320px;
		.goods-search_select{
			width: 100px;
		}
	}
	.common_inline{
		display: inline-block;
	}
}
</style>
