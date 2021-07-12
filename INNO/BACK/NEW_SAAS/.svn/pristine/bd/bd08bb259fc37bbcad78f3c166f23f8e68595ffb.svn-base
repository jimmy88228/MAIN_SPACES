<template>
  <div class="integral-goods-search">
    <Form ref="formSearch" :model="formSearch" inline :label-width="80">
      <FormItem :label-width="0">
        <Input
            class="search_input"
            v-model="formSearch.searchq"
            placeholder="请输入会员名，卡号"
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
          <FormItem label="所属活动">
            <Select class="basic_select" clearable @on-clear="searchPage" @on-change="searchPage" v-model="formSearch.activity_id">
              <Option v-for="item in activityData" :key="item.id" :value="item.id">
                {{item.name}}
              </Option>
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
        activity_id: 0
      },
      activityData: []
    }
  },
  methods: {
    loadData () {
      return this.$ajax.post(this.$api.MatrixLotteryOrderData)
      .then(response => {
        const res = response.data;
        if (res.code) {
          this.activityData = res.data && res.data.items || [];
        }
      });
    },
    handleStart (date) {
      this.formSearch.start_time = date;
    },
    handleEnd (date) {
      this.formSearch.end_time = date;
    },
    searchPage () {
      this.$emit('on-search', this.formSearch);
    }
  },
  mounted () {
    this.loadData();
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
