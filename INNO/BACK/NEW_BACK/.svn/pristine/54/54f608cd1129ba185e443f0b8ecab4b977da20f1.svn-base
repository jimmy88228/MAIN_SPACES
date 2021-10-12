<template>
  <div class="notice-list-search">
    <Form ref="formSearch" :model="formSearch" inline>
			<div class="">
				<!-- <FormItem label="状态">
					<Input
							class="brand-search_input"
							v-model="formSearch.searchq"
							placeholder="请输入活动名称"
							clearable
							search
							enter-button
							@on-search="searchPage"
							@on-clear="searchPage"
							@keydown.native.enter.prevent="searchPage">
							<Select slot="prepend" style="width:100px;" v-model="formSearch.status">
								<Option v-for="(item, index) in statusList" :key="item.value" :value="item.value">{{item.label}}</Option>
							</Select>
					</Input>
				</FormItem> -->
				<FormItem>
					状态：
					<Select v-model="formSearch.status" style="width:120px;">
						<Option :value="-1">全部</Option>
						<Option :value="0">待执行</Option>
						<Option :value="1">马上执行</Option>
						<Option :value="2">执行中</Option>
						<Option :value="3">执行完成</Option>
						<Option :value="4">执行失败</Option>
					</Select>
				</FormItem>
				<FormItem>
					类型：
					<Select v-model="formSearch.tpl_type" style="width:120px;">
						<Option :value="-1">全部</Option>
						<Option v-for="(item, index) in noticeData.wx_tpl_type" :key="index" :value="index">{{item}}</Option>
					</Select>
				</FormItem>
				<FormItem>
					<Input class="basic_input" v-model="formSearch.searchq" placeholder="请输入活动名称" clearable search enter-button
					@on-search="searchPage" @on-clear="searchPage" @keydown.native.enter.prevent />
				</FormItem>
				
				<FormItem v-if="canCreate.add">
					<Button type="primary" @click="addDetail">
						<Icon type="md-add" />添加推送通知
					</Button>
				</FormItem>
			</div>
    </Form>
  </div>
</template>
<script>
export default {
	props:{
		canCreate: {
			type: Object,
			default: {}
		},
		noticeData: {
			type: Object,
			default: {}
		}
	},
  data () {
    return {
      formSearch: {
        searchq: '',
        status: '-1'
      },
			statusList: [
				{value: -1, label: "全部"},
				{value:	0, label: "待执行"},
				{value:	1, label: "马上执行"},
				{value:	2, label: "执行中"},
				{value:	3, label: "执行完成"},
				{value:	4, label: "执行失败"}
			]
    }
  },
  methods: {
    searchPage () {
      this.$emit('on-search', this.formSearch);
    },
	addDetail(){
		this.$router.push({
			name: "sub-notice-details"
		})
	}
  }
}
</script>

<style lang="less">
.notice-list-search{
    .form-flex{
			.ivu-form-item{
				display: flex;
			}
		}
}
</style>
