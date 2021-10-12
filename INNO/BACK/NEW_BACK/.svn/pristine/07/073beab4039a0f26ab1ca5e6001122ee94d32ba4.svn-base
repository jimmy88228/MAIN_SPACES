<template>
  <div class="brand-search">
    <Form ref="formSearch" :model="formSearch" inline>
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
            <Select v-model="formSearch.searchq_type" slot="prepend" class="brand-search_select">
              <Option value="type_code">优惠券编码</Option>
              <Option value="bonus_sn">优惠券序列号</Option>
              <Option value="card_num">会员卡号</Option>
              <Option value="mobile_phone">会员手机号</Option>
            </Select>
        </Input>
      </FormItem>
      <Select v-model="formSearch.time_type" class="basic_select">
        <Option value="send">发放时间</Option>
        <Option value="use">使用时间</Option>
      </Select>
      <FormItem label="时间" class="date_wrapper">
        <date-select ref="dateSelect" @sT="handleStart" @eT="handleEnd" extra/>
      </FormItem>
    </Form>
  </div>
</template>
<script>
import DateSelect from '@/views/my-components/date-select/index.vue';

export default {
  components: {
    DateSelect
  },
  data () {
    return {
      formSearch: {
        searchq: '',
        searchq_type: 'type_code',
        time_type: 'send',
        start_time: '',
        end_time: ''
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
    .edit-select{
      width: 300px;
    }
}
</style>
