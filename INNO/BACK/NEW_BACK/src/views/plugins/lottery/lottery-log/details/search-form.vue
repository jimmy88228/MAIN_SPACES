<template>
  <div class="integral-goods-search">
    <Form ref="formSearch" :model="formSearch" inline :label-width="80">
      <FormItem :label-width="0">
        <Input
            class="search_input"
            v-model="formSearch.searchq"
            placeholder="请输入卡号,手机名称,奖项名称"
            clearable
            search
            enter-button
            @on-search="searchPage"
            @on-clear="searchPage"
            @keydown.native.enter.prevent/>
      </FormItem>
      <Row>
        <Col :span="16">
          <FormItem label="抽奖时间" :label-width="78" class="date-form-item">
            <date-select ref="dateSelect" @sT="handleStart" @eT="handleEnd"/>
          </FormItem>
        </Col>
        <Col :span="8">
          <FormItem label="活动状态">
            <Select v-model="formSearch.status" class="basic_select">
              <Option value="-1">全部</Option>
              <Option value="0">未领取</Option>
              <Option value="1">已领取</Option>
              <Option value="2">代发货</Option>
              <Option value="3">已发货</Option>
            </Select>
          </FormItem>
        </Col>
      </Row>
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
        start_time: '',
        end_time: '',
        status: ''
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
.integral-goods-search{
  .search_input{
    width:260px;
  }
  .ivu-input-icon{
    right: 50px;
  }
  .date-form-item{
    .ivu-form-item-content{
      width: 100%;
    }
  }
  .ivu-form-item{
    width: 100%;
  }
}
</style>
