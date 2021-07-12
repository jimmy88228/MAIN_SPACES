<template>
  <div class="goods-select">
    <list-component ref="listComponent" :status="currentStatus" :table-column="columns" :form-search="formSearch">
      <template v-slot:selected="{ selectedData, delItem }">
        <span class="item goods_item" v-for="item in selectedData" :key="item.id">
          <p class="title text-clamp3">{{item.name || item.act_name || "&nbsp;"}}</p>
          <Icon type="ios-close-circle-outline" class="close" title="删除" @click="delItem(item.id)"/>
        </span>
      </template>
      <template v-slot:search="{ searchPage, data }">
        <Form ref="formSearch" :model="formSearch" :label-width="90" inline class="goods_search">
          <FormItem :label-width="0">
            <Input
              class="goods-search_input"
              v-model="formSearch.searchq"
              placeholder="请输入红包名称"
              clearable
              search
              enter-button
              @on-search="searchPage(formSearch)"
              @on-clear="searchPage"
              @keydown.native.enter.prevent>
              <!-- <Select v-model="formSearch.type" slot="prepend" class="goods-search_select">
                <Option :value="1">商品名字</Option>
                <Option :value="2">商品货号</Option>
              </Select> -->
            </Input>
            <!-- <a @click="showExtra" class="search_btn">{{isShowExtra ? '普通搜索' : '高级搜索'}}</a> -->
          </FormItem>
        </Form>
      </template>
    </list-component>
  </div>
</template>

<script>
import ListComponent from '../template/template';
import Mixin from './mixin';
import EventMixin from '../event-mixin';

const defaultItem = {
  value: '0',
  label: '顶级分类',
  children: []
};
export default {
  name: 'GoodsSelect',
  mixins: [Mixin, EventMixin],
  components: {
    ListComponent
  },
  data () {
    return {
      formSearch: {
        isInit: 2,
        searchq: "",
        time: "",
        static_time: 0,
        enable: 1,
      },
      isShowExtra: false,
      sortCatList: [],
      currentSort: [],
      sortVcatList: [],
      currentVcatSort: [],
      isClear: false
    }
  },
  methods: {},
  mounted () {}
}
</script>

<style lang="less">
.template-modal{
  .goods_item{
    display: flex;
    align-items: center;
    flex-direction: column;
    .img_wrapper{
      width: 50px;
      height: 50px;
      border: 1px solid #efefef;
      overflow: hidden;
      margin-bottom: 4px;
      .img{
        width: 50px;
        object-fit: contain;
      }
    }
  }
  .goods_search{
    .ivu-form-item{
      margin-bottom: 8px;
    }
    .ivu-form-item-content{
      display: flex;
      align-items: center;
    }
    .search_btn{
      display: inline-block;
      margin-left: 10px;
    }
    .ivu-input-icon-clear{
			right:50px;
		}
		.goods-search_input{
			width:250px;
			.goods-search_select{
				width: 90px;
			}
		}
  }
}
</style>
