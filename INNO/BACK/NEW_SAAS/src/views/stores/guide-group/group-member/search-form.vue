<template>
  <div class="group-member-search">
    <Form ref="formSearch" :model="formSearch" inline :label-width="70">
      <FormItem label="所属店铺">
        <store-select :data="storeData" type="radio" @del-tag="handleClose">
          <Button type="dashed" @click="handleSelect" class="basic_select">选择所属店铺</Button>
        </store-select>
      </FormItem>
      <FormItem :label-width="0">
        <Input
          class="group-member-search_input"
          v-model="formSearch.searchq"
          placeholder="请输入关键字"
          clearable
          search
          enter-button
          @on-search="searchPage"
          @on-clear="searchPage"
          @keydown.native.enter.prevent="searchPage">
          <Select v-model="formSearch.type" slot="prepend" class="group-member-search_select">
            <Option :value="1">店员代码</Option>
            <Option :value="2">店员名称</Option>
          </Select>
        </Input>
      </FormItem>
    </Form>
  </div>
</template>
<script>
import StoreSelect from '@/views/my-components/list-component/index-edit';

export default {
  data () {
    return {
      formSearch: {
        searchq: '',
        type: 1,
        store_id: 0,
        current_group: 0
      },
      storeData: []
    }
  },
  components: {
    StoreSelect
  },
  methods: {
    searchPage () {
      this.$emit('on-search', this.formSearch);
    },
    handleSelect (selected) {
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
  }
}
</script>

<style lang="less">
.group-member-search{
  .group-member-search_input{
    width:320px;
    .group-member-search_select{
        width: 100px;
    }
  }
  .ivu-input-icon{
    right: 50px;
  }
}
</style>
