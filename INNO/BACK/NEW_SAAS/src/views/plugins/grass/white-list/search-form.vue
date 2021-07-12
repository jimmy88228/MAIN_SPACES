<template>
  <div class="activity-search">
    <Form ref="formSearch" :model="formSearch" inline :label-width="100">
      <FormItem label="所属店铺">
        <store-select :data="storeData" type="radio" @del-tag="handleTag">
          <Button type="dashed" @click="handleSelect" class="basic_select">选择所属店铺</Button>
        </store-select>
      </FormItem>
      <FormItem label="加入白名单">
        <Select v-model="formSearch.is_enabled" class="basic_select">
          <Option value="-1">全部</Option>
          <Option value="1">是</Option>
          <Option value="0">否</Option>
        </Select>
      </FormItem>
      <FormItem :label-width="0">
        <Input
            class="brand-search_input"
            v-model="formSearch.searchq"
            placeholder="请输入关键字"
            clearable
            search
            enter-button
            @on-search="searchPage"
            @on-clear="searchPage"
            @keydown.native.enter.prevent="searchPage">
            <Select v-model="formSearch.searchq_type" slot="prepend" style="width:120px;">
              <Option value="real_name">昵称</Option>
              <Option value="card_num">会员卡号</Option>
              <Option value="mobile_phone">手机号</Option>
            </Select>
        </Input>
      </FormItem>
    </Form>
  </div>
</template>
<script>
import StoreSelect from '@/views/my-components/list-component/index-edit';

export default {
  components: {
    StoreSelect
  },
  data () {
    return {
      formSearch: {
        searchq_type: '',
        searchq: '',
        is_enabled: '-1',
        store_id: 0
      },
      storeData: []
    }
  },
  methods: {
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
    searchPage () {
      this.$emit('on-search', this.formSearch);
    }
  }
}
</script>

<style lang="less">
.activity-search{
    // .brand-search_input{
    //     width:220px;
    // }
    .ivu-input-icon{
        right: 50px;
    }
    .date_wrapper{
      width: 460px;
    }
    .select_fixed{
      width: 120px;
    }
}
</style>
