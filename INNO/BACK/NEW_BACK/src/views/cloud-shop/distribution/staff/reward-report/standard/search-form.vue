<template>
  <div class="standard-list-search">
    <Form ref="formSearch" :model="formSearch" inline>
      <FormItem>
        <Input
            class="brand-search_input"
            v-model="formSearch.searchq"
            placeholder="请输入手机号, 会员卡号"
            clearable
            search
            enter-button
            @on-search="searchPage"
            @on-clear="searchPage"
            @keydown.native.enter.prevent="searchPage">
        </Input>
      </FormItem>
      <FormItem label="所属店铺">
        <store-select :data="formSearch.storeData" type="radio" @del-tag="handleTag">
          <Button type="dashed" @click="handleSelect" class="basic_select">选择所属店铺</Button>
        </store-select>
      </FormItem>
      <FormItem label="时间" class="date_wrapper">
        <date-select ref="dateSelect" @sT="handleStart" @eT="handleEnd" extra/>
      </FormItem>
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
        searchq: '',
        start_time: '',
        end_time: '',
        storeData: [],
        store_id: 0
      }
    }
  },
  methods: {
    handleStart (date) {
      this.formSearch.start_time = date;
    },
    handleEnd (date) {
      this.formSearch.end_time = date;
    },
    searchPage () {
      this.$emit('on-search', this.formSearch);
    },
    handleSelect () {
      this.$selectContent({
        mode: 'store',
        type: 'radio',
        data: this.formSearch.storeData,
        getList: (data) => {
          this.formSearch.storeData = data;
          this.formSearch.store_id = data.map(item => item.id)[0];
        }
      })
    },
    handleTag (data) {
      this.formSearch.storeData = data;
      this.formSearch.store_id = 0;
    }
  }
}
</script>

<style lang="less">
.standard-list-search{
    .brand-search_input{
        width:240px;
        .brand-search_select{
            width: 100px;
        }
    }
    .ivu-input-icon{
        right: 50px;
    }
    .edit-select{
      width: 300px;
    }
}
</style>
