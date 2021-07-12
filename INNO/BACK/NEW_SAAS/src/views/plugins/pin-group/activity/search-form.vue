<template>
  <div class="group-activity-search">
    <Form ref="formSearch" :model="formSearch" inline :label-width="70">
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
			<div class="flex">
				<FormItem label="活动时间" :label-width="70" class="date-form-item">
					<date-select ref="dateSelect" @sT="handleStart" @eT="handleEnd"/>
				</FormItem>
				<FormItem label="活动状态">
					<Select v-model="formSearch.status" class="basic_select">
						<Option :value="-1">全部</Option>
						<Option :value="0">关闭</Option>
						<Option :value="1">开启</Option>
						<Option :value="2">过期</Option>
					</Select>
				</FormItem>
			</div>
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
.group-activity-search{
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
