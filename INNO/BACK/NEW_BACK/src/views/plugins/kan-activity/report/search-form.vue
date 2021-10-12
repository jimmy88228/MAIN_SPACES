<template>
  <div class="kan-activity-search">
    <Form ref="formSearch" :model="formSearch" inline :label-width="80">
      <Row>
        <Col :span="16">
          <FormItem label="活动时间" :label-width="78" class="date-form-item">
            <date-select ref="dateSelect" @sT="handleStart" @eT="handleEnd"/>
          </FormItem>
        </Col>
        <Col :span="8">
          <FormItem label="活动状态">
            <Select v-model="formSearch.status" class="basic_select">
              <Option :value="-1">全部</Option>
              <Option :value="0">进行中</Option>
              <Option :value="1">已完成</Option>
              <Option :value="2">已失效</Option>
              <Option :value="3">库存不足</Option>
              <Option :value="4">支付超时</Option>
            </Select>
          </FormItem>
        </Col>
      </Row>
      <Row>
        <Button type="primary" @click="searchPage">搜索</Button>
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
        status: -1,
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
.kan-activity-search{
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
