<template>
	<div class="integral-goods-search">
		<Form ref="formSearch" :model="formSearch" inline>
			<FormItem>
				<date-select ref="dateSelect" @sT="handleStart" @eT="handleEnd" />
			</FormItem>
			<FormItem>
				活动状态
				<Select v-model="formSearch.status" style="width:80px;">
					<Option :value="-1">全部</Option>
					<Option :value="0">关闭</Option>
					<Option :value="1">开启</Option>
					<Option :value="2">过期</Option>
				</Select>
			</FormItem>
			<FormItem>
				<Input class="search_input" 
				v-model="formSearch.searchq" 
				placeholder="请输入关键字" 
				clearable search enter-button
				 @on-search="searchPage" 
				 @on-clear="searchPage" 
				 @keydown.native.enter.prevent="searchPage">
				<Select v-model="formSearch.searchq_type" slot="prepend" style="width:100px;">
					<Option value="name">活动名称</Option>
					<Option value="goods_name">商品名称</Option>
					<Option value="goods_sn">货号</Option>
				</Select>
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
		data() {
			return {
				formSearch: {
					searchq: '',
					status: -1,
					start_time: '',
					end_time: '',
					searchq_type: 'name'
				}
			}
		},
		methods: {
			handleStart(date) {
				this.formSearch.start_time = date;
			},
			handleEnd(date) {
				this.formSearch.end_time = date;
			},
			searchPage() {
				this.$emit('on-search', this.formSearch);
			}
		}
	}
</script>

<style lang="less">
	.integral-goods-search {

	}
</style>
