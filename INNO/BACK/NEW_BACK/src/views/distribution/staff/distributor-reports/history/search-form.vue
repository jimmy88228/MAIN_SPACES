<template>
  <div class="brand-search">
    <Form ref="formSearch" :model="formSearch" inline>
      <label>时间</label>
      <date-select ref="dateSelect" @sT="handleStart" @eT="handleEnd" style="margin-bottom: 24px;"/>
      <label>等级</label>
      <Select v-model="formSearch.staff_level" class="basic_select">
        <Option value="0">全部</Option>
        <Option value="1">等级一</Option>
        <Option value="2">等级二</Option>
      </Select>
      <label>活动店铺</label>
      <store-select :data="formSearch.storeInfo" type="radio" style="display: inline;" @del-tag="handleStoreClose">
        <Button type="dashed" @click="handleSelected" class="basic_select">选择活动店铺</Button>
      </store-select>
      <FormItem>
        <Input
            class="brand-search_input"
            v-model="formSearch.searchq"
            placeholder="请输入手机号, 分销员代码"
            clearable
            search
            enter-button
            @on-search="searchPage"
            @on-clear="searchPage"
            @keydown.native.enter.prevent="searchPage">
        </Input>
      </FormItem>
      <p class="strong_tips">注：数据按天结存，统计到前一天</p>
    </Form>
  </div>
</template>
<script>
import DateSelect from '@/views/my-components/date-select/index.vue';
import StoreSelect from '@/views/my-components/list-component/index-edit';

export default {
  components: {
    DateSelect,
    StoreSelect
  },
  data () {
    return {
      formSearch: {
        storeInfo: [],
        start_time: '',  //开始时间   
        end_time: '',  //结束时间
        searchq: '',   //搜索值
        store_id: 0,	//店铺id
        staff_level: '0'   //等级 0 全部 1 等级1 2 等级二
      }
    }
  },
  methods: {
    handleSelected (selected) {
      this.$selectContent({
        mode: 'store',
        type: 'radio',
        data: this.formSearch.storeInfo,
        getList: (data) => {
          this.formSearch.storeInfo = data;
          this.formSearch.store_id = data[0].id;
        }
      });
    },
    handleStoreClose (data) {
      this.formSearch.storeInfo = data;
      this.formSearch.store_id = 0;
    },
    handleStart (date) {
      this.formSearch.start_time = date;
    },
    handleEnd (date) {
      this.formSearch.end_time = date;
    },
    searchPage () {
      this.$emit('on-search', this.formSearch);
    }
  }
}
</script>

<style lang="less">
.brand-search{
    .brand-search_input{
        width:320px;
        .brand-search_select{
            width: 100px;
        }
    }
    .ivu-input-icon{
        right: 50px;
    }
}
</style>
