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
            <Select v-model="formSearch.searchq_type" slot="prepend" class="brand-search_select" style="width:120px;">
              <Option value="dstb_staff_name">分销员名称</Option>
              <Option value="mobile_phone">手机号</Option>
              <Option value="card_num">会员卡号</Option>
            </Select>
        </Input>
      </FormItem>
      <FormItem label="粉丝身份" prop="staffType" :label-width="100">
        <Select v-model="formSearch.staffType" class="basic_select">
          <Option value="-1">全部</Option>
          <Option value="1">分销员</Option>
          <Option value="0">粉丝</Option>
        </Select>
      </FormItem>
      <FormItem label="最后点击时间" class="date_wrapper">
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
        staffType: '-1', //粉丝身份 -1全部 0 粉丝 1 分销员
        start_time: '',  //开始时间
        end_time: '',//结束时间
        searchq: '',  //搜索值
        searchq_type: 'mobile_phone',  //搜索类型
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
}
</style>
