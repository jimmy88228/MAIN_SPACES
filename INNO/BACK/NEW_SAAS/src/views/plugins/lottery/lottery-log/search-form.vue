<template>
  <div class="integral-goods-search">
    <Form ref="formSearch" :model="formSearch" inline :label-width="80">
      <FormItem :label-width="0">
        <Input
            class="search_input"
            v-model="formSearch.searchq"
            placeholder="请输入活动名称"
            clearable
            search
            enter-button
            @on-search="searchPage"
            @on-clear="searchPage"
            @keydown.native.enter.prevent/>
      </FormItem>
      <Row>
        <Col :span="12">
          <FormItem label="活动类型">
            <Select v-model="formSearch.status" class="basic_select">
              <Option value="0">全部</Option>
              <Option value="1">生效翻翻看</Option>
              <Option value="2">水果机</Option>
              <Option value="3">摇一摇</Option>
              <Option value="4">砸金蛋</Option>
              <Option value="5">大转盘</Option>
              <Option value="6">一点领券</Option>
            </Select>
          </FormItem>
        </Col>
        <Col :span="12">
          <FormItem label="中奖时间" class="date_wrapper">
            <date-select ref="dateSelect" @sT="handleStart" @eT="handleEnd"/>
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
        status: 0,
        start_time: '',
        end_time: ''
      }
    }
  },
  methods: {
    searchPage () {
      this.$emit('on-search', this.formSearch);
    },
    handleStart (date) {
      this.formSearch.start_time = date;
    },
    handleEnd (date) {
      this.formSearch.end_time = date;
    },
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
