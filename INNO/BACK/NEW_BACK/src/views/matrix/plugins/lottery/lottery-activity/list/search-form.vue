<template>
  <div class="brand-search">
    <Form ref="formSearch" :model="formSearch" inline class="flex">
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
        </Input>
      </FormItem>
      <FormItem label="状态" :label-width="60">
        <Select v-model="formSearch.enabled">
          <Option :value="-1">全部</Option>
          <Option :value="0">关闭</Option>
          <Option :value="1">启用</Option>
          <Option :value="2">过期</Option>
        </Select>
      </FormItem>
			<FormItem label="模板类型" :label-width="80">
			  <Select v-model="formSearch.type" style="width:150px;">
			    <Option :value="0">全部</Option>
			    <Option :value="item.lottery_type_code" v-for="(item, index) in lotteryTypeList" :key="index">{{item.lottery_type_name}}</Option>
			  </Select>
			</FormItem>
    </Form>
  </div>
</template>
<script>
export default {
  data () {
    return {
      formSearch: {
        searchq: '',
        enabled: -1,
				type: 0
      },
			chooseType: 0,
			lotteryTypeList: []
    }
  },
  methods: {
    searchPage () {
      this.$emit('on-search', this.formSearch);
    },
		getLotteryType(){
			return this.$ajax.post(this.$api.MatrixLotteryType).then(response => {
				const res = response.data;
				if (res.code) {
					let data = res.data || [];
					this.lotteryTypeList = data;
				} else {
					this.$Message.error(res.message);
				}
			})
		}
  },
	mounted(){
		this.getLotteryType();
	}
}
</script>

<style lang="less">
.brand-search{
    .brand-search_input{
        width:220px;
    }
    .ivu-input-icon{
        right: 50px;
    }
}
</style>
