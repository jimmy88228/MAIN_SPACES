<template>
  <div class="form-search-area">
    <Form ref="formSearch" :model="formSearch" inline>
			<div class="flex f-just-between form-flex">
				<FormItem>
					<Button type="primary" @click="addDetail">
						<Icon type="md-add" />新增我的分组
					</Button>
				</FormItem>
				<FormItem>
					<Input
							class="brand-search_input"
							v-model="formSearch.key"
							placeholder="请输入分组名称"
							clearable
							search
							enter-button
							@on-search="searchPage"
							@on-clear="searchPage"
							@keydown.native.enter.prevent="searchPage">
					</Input>
				</FormItem>
				
			</div>
    </Form>
  </div>
</template>
<script>
export default {
	props:{
		type: {
			type: String,
			default: ""
		}
	},
  data () {
    return {
      formSearch: {
        key: '',
      },
			statusList: [
				{value: -1, label: "全部"},
				{value:	0, label: "待执行"},
				{value:	1, label: "马上执行"},
				{value:	2, label: "执行中"},
				{value:	3, label: "执行完成"},
				{value:	4, label: "执行失"}
			]
    }
  },
  methods: {
    searchPage () {
      this.$emit('on-search', this.formSearch);
    },
		addDetail(){
			this.$router.push({
				name: "group-message-edit",
				type: this.type
			})
		}
  }
}
</script>

<style lang="less">
.form-search-area{
    .form-flex{
			.ivu-form-item{
				display: flex;
			}
		}
}
</style>
