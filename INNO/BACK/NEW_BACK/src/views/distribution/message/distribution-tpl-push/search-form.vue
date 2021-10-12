<template>
  <div class="brand-search">
    <Form ref="formSearch" :model="formSearch" inline>
      <FormItem label="创建时间" class="date_wrapper" :label-width="70">
        <date-select ref="dateSelect" @sT="handleStart" @eT="handleEnd" extra/>
      </FormItem>
      <FormItem>
        <Input
            class="brand-search_input"
            v-model="formSearch.searchq"
            placeholder="请输入通知名称"
            clearable
            search
            enter-button
            @on-search="searchPage"
            @on-clear="searchPage"
            @keydown.native.enter.prevent="searchPage">
        </Input>
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
        status: '',
        startTime: '',
        endTime: '',
        agentCol: [],
        searchq: '',
        type: 1
      }
    }
  },
  methods: {
    handleStart (date) {
      this.formSearch.startTime = date;
    },
    handleEnd (date) {
      this.formSearch.endTime = date;
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
        width:200px;
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
