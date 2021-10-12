<template>
  <div class="brand-search">
    <Form ref="formSearch" :model="formSearch" inline>
      <FormItem label="下单时间" class="date_wrapper" :label-width="80">
        <date-select ref="dateSelect" @sT="handleStart" @eT="handleEnd" extra/>
      </FormItem>
      <FormItem>
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
            <Select v-model="formSearch.type" slot="prepend" class="brand-search_select">
              <Option value="dstb_staff_name">分销员</Option>
              <Option value="dstb_staff_phone">手机号</Option>
            </Select>
        </Input>
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
        start_time: '',  //开始时间
        end_time: '',//结束时间
        searchq: '',  //搜索值
        type:'dstb_staff_name',
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
        }
      })
    },
    handleTag (data) {
      this.formSearch.storeData = data;
    },
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
    .edit-select{
      width: 300px;
    }
}
</style>
