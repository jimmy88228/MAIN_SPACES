<template>
  <div class="brand-search">
    <Form ref="formSearch" :model="formSearch" inline>
      <label>下单时间</label>
      <date-select ref="dateSelect" @sT="handleStart" @eT="handleEnd" style="display: inline-flex;"/>
      <FormItem>
        <Input
            class="brand-search_input"
            v-model="formSearch.searchq"
            placeholder="请输入卡号,手机号"
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
  props: ['condition'],
  components: {
    DateSelect
  },
  data () {
    return {
      formSearch: this.condition
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
  },
  watch: {
    condition(nV) {
      this.formSearch = nV;
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
