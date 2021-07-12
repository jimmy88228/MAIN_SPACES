<template>
  <div class="appletcode-search">
    <Form ref="formSearch" :model="formSearch" :label-width="90" label-colon inline>
      <FormItem :label-width="0" class="search_wrapper">
        <Input
            class="search_input"
            v-model="formSearch.keywords"
            placeholder="请输入关键字"
            clearable
            search
            enter-button
            @on-search="searchPage"
            @on-clear="searchPage"
            @keydown.native.enter.prevent="searchPage">
            <Select v-model="formSearch.search_type" slot="prepend" class="search_select">
              <Option :value="1">商品名字</Option>
              <Option :value="2">商品货号</Option>
            </Select>
        </Input>
        <a @click="showExtra" class="search_btn">{{isShowExtra ? '普通搜索' : '高级搜索'}}</a>
      </FormItem>
      <transition name="fade">
        <div v-show="isShowExtra">
          <Row>
            <Col :xxl="5" :xl="6" :lg="8">
              <FormItem label="所有分类">
                <Cascader
                  class="basic_cascader"
                  :data="sortCatList"
                  v-model="currentSort"
                  placeholder="请选择所有分类"
                  filterable
                  change-on-select
                  transfer
                  :clearable="isClear"
                  ref="catRef"
                  :render-format="renderSort"
                  @on-change="selectSortCat"></Cascader>
              </FormItem>
            </Col>
            <Col span="4">
              <FormItem label="商品类别">
                <Select v-model="formSearch.sale_type" class="basic_select">
                  <Option v-for="(value, name) in goodSaleType" :value="name" :key="name">{{value}}</Option>
                </Select>
              </FormItem>
            </Col>
          </Row>
          <Row>
            <Col :xxl="5" :xl="6" :lg="8">
              <FormItem label="自定义分类">
                <Cascader
                  class="basic_cascader"
                  :data="sortVcatList"
                  v-model="currentVcatSort"
                  placeholder="请选择自定义分类"
                  filterable
                  change-on-select
                  transfer
                  :clearable="isClear"
                  ref="vcatRef"
                  :render-format="renderSort"
                  @on-change="selectSortVcat"></Cascader>
              </FormItem>
            </Col>
            <Col span="4">
              <FormItem label="是否上架">
                <Select v-model="formSearch.is_on_sale" class="basic_select">
                  <Option :value="0">全部</Option>
                  <Option :value="1">上架</Option>
                  <Option :value="2">下架</Option>
                </Select>
              </FormItem>
            </Col>
          </Row>
        </div>
      </transition>
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
  props: {
    goodSaleType: {
      type: Object,
      default () {
        return {};
      }
    },
  },
  data () {
    return {
      formSearch: {
        keywords: '',
        search_type: 1,
        sale_type: '0',
        is_on_sale: 0, // 0：全部 1：上架 2：下架
        cat_id: 0,
        vcat_id: 0
      },
      sortCatList: [],
      sortVcatList: [],
      currentSort: [],
      currentVcatSort: [],
      isClear: false,
      isShowExtra: false
    }
  },
  methods: {
    showExtra () {
      this.isShowExtra = !this.isShowExtra;
    },
    renderSort (labels) {
      return labels.slice(labels.length - 1).join('/');
    },
    searchPage () {
      this.$emit('on-search', this.formSearch);
    },
    loadExtraData () {
      this.$ajax.all(
        [
          this.$ajax.post(this.$api.catTree),
          this.$ajax.post(this.$api.vcatTree)
        ]
      ).then(
        this.$ajax.spread((catData, vcatData) => {
          let catRes = catData.data;
          if (catRes.code) {
            this.sortCatList = this.handleSortList([...catRes.data]);
            this.sortCatList.unshift(defaultItem);
          }
          let vcatRes = vcatData.data;
          if (vcatRes.code) {
            this.sortVcatList = this.handleSortList([...vcatRes.data]);
            this.sortVcatList.unshift(defaultItem);
          }
        })
      );
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
    selectSortCat (value, selectedData) {
      this.formSearch.cat_id = selectedData[selectedData.length - 1].value;
    },
    selectSortVcat (value, selectedData) {
      this.formSearch.vcat_id = selectedData[selectedData.length - 1].value;
    }
  },
  mounted () {
    this.loadExtraData();
  }
}
</script>

<style lang="less">
.appletcode-search{
  .search_wrapper{
    .ivu-form-item-content{
      display: flex;
      align-items: center;
    }
    .search_btn{
      display: inline-block;
      margin-left: 10px;
    }
  }
  .search_input{
    width:320px;
    .search_select{
      width: 90px;
    }
  }
  .ivu-form-item{
    margin-bottom: 10px;
    margin-right: 10px;
  }
  .ivu-input-icon-clear{
		right:50px;
  }
  .ivu-form-item-label{
    text-align: left;
  }
}
</style>
