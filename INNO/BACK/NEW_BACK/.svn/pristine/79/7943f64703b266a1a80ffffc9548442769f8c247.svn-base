<template>
  <div class="supplier-search">
    <Form ref="formSearch" :model="formSearch" inline :label-width="70">
      <FormItem :label-width="0">
        <Input
          class="supplier-search_input"
          v-model="formSearch.search"
          placeholder="请输入关键字"
          clearable
          search
          enter-button
          @on-search="searchPage"
          @on-clear="searchPage"
          @keydown.native.enter.prevent="searchPage">
          <Select v-model="formSearch.search_type" slot="prepend" class="supplier-search_select">
            <Option :value="1">店员名称</Option>
            <Option :value="2">代码</Option>
            <Option :value="3">手机号</Option>
          </Select>
        </Input>
        <a @click="showExtra" class="search_btn">{{isShowExtra ? '普通搜索' : '高级搜索'}}</a>
      </FormItem>
      <transition name="fade">
        <div v-show="isShowExtra">
          <Row>
            <Col span="8">
              <FormItem label="所属店铺">
                <store-select :data="storeData" type="radio" @del-tag="handleClose" style="width: 100%;">
                  <Button type="dashed" @click="handleSelected" class="basic_select">选择所属店铺</Button>
                </store-select>
              </FormItem>
              </Col>
              <Col span="8">
                <FormItem label="所属地区">
                  <Cascader
                    class="basic_cascader"
                    v-model="areaCol"
                    :data="areaList"
                    ref="areaRef"
                    filterable
                    change-on-select
                    transfer
                    :clearable="isClear"
                    :render-format="renderSort"
                    @on-change="selectArea"></Cascader>
                </FormItem>
              </Col>
              <Col span="8">
                <FormItem label="绑定店员">
                  <Select v-model="formSearch.related_user" class="basic_select">
                    <Option :value="0">全部</Option>
                    <Option :value="2">是</Option>
                    <Option :value="1">否</Option>
                  </Select>
                </FormItem>
              </Col>
          </Row>
          <Row>
            <Col span="8">
              <FormItem label="员工状态">
                <Select v-model="formSearch.status" class="basic_select">
                  <Option :value="0">全部</Option>
                  <Option :value="1">在职</Option>
                  <Option :value="2">离职</Option>
                </Select>
              </FormItem>
            </Col>
            <Col span="8">
              <FormItem label="分销员">
                <Select v-model="formSearch.dstb_staff" class="basic_select">
                  <Option :value="0">全部</Option>
                  <Option :value="1">是</Option>
                  <Option :value="2">否</Option>
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

export default {
  props: {
    areaList: {
      type: Array,
      required: true
    },
    storeId: {
      type:[String,Number],
      default: 0
    }
  },
  data () {
    return {
      areaCol: [],
      formSearch: {
        area: 0,
        store_id: 0,
        related_user: 0,
        status: 0,
        dstb_staff: 0,
        search: '',
        search_type: 3
      },
      isShowExtra: false,
      isClear: false,
      storeData: []
    }
  },
  components: {
    StoreSelect
  },
  methods: {
    clearCondition () {
      this.formSearch = {
        area: 0,
        store_id: 0,
        related_user: 0,
        status: 0,
        dstb_staff: 0,
        search: '',
        search_type: 1
      };
      this.areaCol = [];
      this.storeData = [];
      this.formSearch.store_id = 0;
    },
    renderSort (labels) {
      return labels.slice(labels.length - 1).join('/');
    },
    selectArea (value, selectedData) {
      this.formSearch.area = selectedData[selectedData.length - 1].value;
    },
    showExtra () {
      this.isShowExtra = !this.isShowExtra;
    },
    searchPage () {
      this.$emit('on-search', this.formSearch);
    },
    handleSelected (selected) {
      this.$selectContent({
        mode: 'store',
        type: 'radio',
        data: this.storeData,
        getList: (data) => {
          this.storeData = data;
          this.formSearch.store_id = data[0].id;
        }
      });
    },
    handleClose (data) {
      this.storeData = data;
      this.formSearch.store_id = 0;
    }
  },
  watch:{
      storeId:{
        handler(nv){
          if(Number(nv)>0){
            this.formSearch.store_id = nv; 
            this.searchPage();
          }
        },
      deep:true,
      immediate: true
    }
  }
}
</script>
<style lang="less">
.supplier-search{
  .search_btn{
    display: inline-block;
    margin-left: 10px;
  }
  .ivu-form-item-content{
    display: flex;
    align-items: center;
  }
  .ivu-form-item{
    width: 100%;
    margin-bottom: 10px;
    padding-right: 10px;
  }
  .supplier-search_input{
    width:340px;
    .supplier-search_select{
      width: 120px;
    }
  }
  .ivu-input-icon{
    right: 50px;
  }
  .basic_select{
    .ivu-select-dropdown{
      max-height: 200px;
    }
  }
}
</style>
