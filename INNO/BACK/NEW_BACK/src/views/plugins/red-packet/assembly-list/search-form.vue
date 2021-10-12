<template>
  <div class="assembly-search">
    <Form ref="formSearch" :model="formSearch" inline :label-width="70">
      <FormItem :label-width="0">
        <Input
          v-model="formSearch.searchq"
          class="basic_input"
          placeholder="请输入手机,卡号"
          clearable
          search
          enter-button
          @on-search="searchPage"
          @on-clear="searchPage"
          @keydown.native.enter.prevent></Input>
      </FormItem>
      <Row>
        <FormItem class="date" label="发放时间">
          <date-select ref="dateSelect" @sT="handleStart" @eT="handleEnd"/>
        </FormItem>
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
