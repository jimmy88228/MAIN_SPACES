<template>
  <div class="brand-search">
    <Form ref="formSearch" :model="formSearch" inline>
      <FormItem label="所属店铺">
        <store-select :data="storeData" type="radio" @del-tag="handleTag">
          <Button type="dashed" @click="handleSelect" class="basic_select">选择所属店铺</Button>
        </store-select>
      </FormItem>
      <FormItem>
        <Input
            class="brand-search_input"
            v-model="formSearch.searchq"
            placeholder="请输入群名称"
            clearable
            search
            enter-button
            @on-search="searchPage"
            @on-clear="searchPage"
            @keydown.native.enter.prevent="searchPage">
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
        searchq: '',
        store_id: 0
      },
      storeData: []
    }
  },
  methods: {
    searchPage () {
      this.$emit('on-search', this.formSearch);
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
  }
}
</script>

<style lang="less">
.brand-search{
    .brand-search_input{
      width:220px;
    }
    .ivu-input-icon{
      right: 50px;
    }
    .ivu-form-item{
      display: inline-flex;
      .edit-select{
        width: 200px;
      }
    }
}
</style>
