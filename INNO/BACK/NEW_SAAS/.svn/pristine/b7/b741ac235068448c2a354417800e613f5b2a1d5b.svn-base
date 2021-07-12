<template>
  <div class="assembly-search">
    <Form ref="formSearch" :model="formSearch" inline :label-width="70">
      <FormItem :label-width="0">
        <Input
          v-model="formSearch.searchq"
          style="width: 340px;"
          placeholder="请输入关键字"
          clearable
          search
          enter-button
          @on-search="searchPage"
          @on-clear="searchPage"
          @keydown.native.enter.prevent>
          <Select v-model="formSearch.searchq_type" slot="prepend" style="width:140px">
            <Option value="bonus_sn">优惠卷序列号</Option>
            <Option value="card_num">会员卡号</Option>
            <Option value="mobile_phone">会员手机号</Option>
          </Select>
        </Input>
      </FormItem>
      <Row>
        <Col :span="6">
          <FormItem label="时间类型" :label-width="80">
            <Select v-model="formSearch.time_type" class="basic_select">
              <Option value="1">发放时间</Option>
              <Option value="2">使用时间</Option>
            </Select>
          </FormItem>
        </Col>
        <Col :span="18">
          <FormItem :label-width="60" class="date">
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
  data () {
    return {
      formSearch: {
        searchq: '',
        searchq_type: 'bonus_sn',
        time_type: 1,
        start_time: '',
        end_time: ''
      }
    }
  },
  components: {
    DateSelect
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
    }
  }
}
</script>
<style lang="less">
.assembly-search{
  .search_btn{
    display: inline-block;
    margin-left: 10px;
  }
  .date{
    .ivu-form-item-content{
      width: 100%;
    }
  }
  .ivu-form-item{
    width: 100%;
    margin-bottom: 10px;
    padding-right: 10px;
  }
  .supplier-search_input{
    width:340px;
    .supplier-search_select{
      width: 120px;
    }
  }
  .ivu-input-icon{
    right: 50px;
  }
  .basic_select{
    .ivu-select-dropdown{
      max-height: 200px;
    }
  }
}
</style>
