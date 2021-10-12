<template>
	<div class="order-search-form">
		<Form ref="formSearch" :model="formSearch" inline :label-width="90">
      <FormItem :label-width="0" class="search_wrapper">
        <Input
          v-model="formSearch.searchq"
          style="width:400px;"
          placeholder="关键词搜索"
          clearable
          search
          enter-button
          @on-search="searchPage"
          @on-clear="searchPage"
          @keydown.native.enter.prevent="searchPage">
          <Select v-model="formSearch.searchq_type" slot="prepend" style="width:120px;">
            <Option value="real_name">商品</Option>
            <Option value="card_num">会员</Option>
            <Option value="pub_title">主题</Option>
          </Select>
        </Input>
        <a @click="showExtra" class="search_btn">{{isShowExtra ? '普通搜索' : '高级搜索'}}</a>
      </FormItem>
      <transition name="fade">
        <div v-show="isShowExtra">
          <FormItem label="发布时间" class="date_wrapper">
            <date-select ref="dateSelect" @sT="handleStart" @eT="handleEnd" extra/>
          </FormItem>
          <FormItem label="审核时间" class="date_wrapper">
            <date-select ref="dateSelect2" @sT="handleStart2" @eT="handleEnd2" extra/>
          </FormItem>
          <Row>
            <Col span="8">
              <FormItem label="状态" prop="status">
                <Select v-model="formSearch.status" class="basic_select">
                  <Option value="-1">全部</Option>
                  <Option value="0">待审核</Option>
                  <Option value="1">审核通过</Option>
                  <Option value="2">审核不通过</Option>
                </Select>
              </FormItem>
            </Col>
            <Col span="8">
              <FormItem label="图片/视频" prop="type">
                <Select v-model="formSearch.type" class="basic_select">
                  <Option value="-1">全部</Option>
                  <Option value="0">图片</Option>
                  <Option value="1">视频</Option>
                </Select>
              </FormItem>
            </Col>
            <Col span="8">
              <FormItem label="是否显示" prop="is_show">
                <Select v-model="formSearch.is_show" class="basic_select">
                  <Option value="-1">全部</Option>
                  <Option value="1">显示</Option>
                  <Option value="0">隐藏</Option>
                </Select>
              </FormItem>
            </Col>
          </Row>
          <Row>
            <Col span="8">
              <FormItem label="所属分类" prop="cat_id">
                <Select v-model="formSearch.cat_id" class="basic_select">
                  <Option v-for="(item) in catList" :value="item.id" :key="item.id">{{ item.category_name }}</Option>
                </Select>
              </FormItem>
            </Col>
            <Col span="8">
              <FormItem label="所属标签" prop="label_id">
                <Select v-model="formSearch.label_id" class="basic_select">
                  <Option v-for="(item) in labelList" :value="item.id" :key="item.id">{{ item.label_name }}</Option>
                </Select>
              </FormItem>
            </Col>
          </Row>
          <Row>
            <div style="margin-bottom: 10px;">
              <Button type="primary" @click="searchPage">搜索</Button>
              <Button type="primary" @click="clearCondition">重置</Button>
            </div>
          </Row>
        </div>
      </transition>
    </Form>
	</div>
</template>

<script>
import StoreSelect from '@/views/my-components/list-component/index-edit';
import DateSelect from '@/views/my-components/date-select/index.vue';

export default {
  name: 'searchForm',
  props: ['orderStatusList', 'storeList', 'orderFrom', 'orderTypeList', 'saleKind', 'payMethod', 'shippingWays', 'checkOrder', 'searchTypeList', 'orderStatusSelect'],
  components: {
    StoreSelect,
    DateSelect
  },
  data () {
    return {
      // 搜索表单
      formSearch: {
        public_start_time: '',
        public_end_time: '',
        status: '-1',
        modify_start_time: '',
        modify_end_time: '',
        orderStatus: '-1',
        store_id: '0',
        type: '-1',
        is_show: '-1',
        cat_id: 0,
        label_id: 0,
        searchq: '',
        searchq_type: ''
      },
      isShowExtra: false,
      storeData: [],
      catList: [],
      labelList: []
    }
  },
  methods: {
    showExtra () {
      this.isShowExtra = !this.isShowExtra;
    },
    // 搜索按钮触发
    searchPage () {
    	this.$emit('on-search', this.formSearch);
    },
    clearCondition () {
      this.formSearch = {
        public_start_time: '',
        public_end_time: '',
        status: '-1',
        modify_start_time: '',
        modify_end_time: '',
        orderStatus: '-1',
        store_id: '0',
        type: '-1',
        is_show: '-1',
        cat_id: 0,
        label_id: 0,
        searchq: '',
        searchq_type: ''
      };
      this.$refs.dateSelect.reset();
      this.$refs.dateSelect2.reset();
      this.storeData = [];
      this.formSearch.store_id = 0;
    },
    handleStart (date) {
      this.formSearch.public_start_time = date;
    },
    handleEnd (date) {
      this.formSearch.public_end_time = date;
    },
    handleStart2 (date) {
      this.formSearch.modify_start_time = date;
    },
    handleEnd2 (date) {
      this.formSearch.modify_end_time = date;
    },
    handleSelect () {
      this.$selectContent({
        mode: 'store',
        type: 'radio',
        data: this.storeData,
        getList: (data) => {
          this.storeData = data;
          this.formSearch.store_id = data[0].id;
        }
      })
    },
    handleTag (data) {
      this.storeData = data;
      this.formSearch.store_id = 0;
    },
    getCatList () {
      return this.$ajax.post(this.$api.communityGetCatList)
    },
    lableList () {
      return this.$ajax.post(this.$api.communityGetLableList)
    },
    loadExtra () {
      return this.$ajax.all([this.getCatList(), this.lableList()])
      .then(this.$ajax.spread((catresponse, labelresponse) => {
        const catres = catresponse.data;
        const labelres = labelresponse.data;
        this.catList = catres.data.items;
        this.labelList = labelres.data.items;
        console.log(this.catList, this.labelList)
      }));
    },
  },
  created () {
    this.loadExtra();
  },
  watch: {
    orderStatusSelect(nV) {
      this.formSearch.orderStatus = nV;
    }
  }
}
</script>

<style lang="less" scoped>
.order-search-form{
	.ivu-input-icon-clear{
		right:50px;
	}
  .date_wrapper{
    width: 100%;
  }
}
</style>

<style lang="less">
.order-search-form{
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
  .ivu-input-icon{
    right: 50px;
  }
  .ivu-form-item{
    width: 100%;
    margin-bottom: 10px;
    padding-right: 10px;
  }
  .ivu-form-item-label{
    text-align: left;
  }
}
</style>
