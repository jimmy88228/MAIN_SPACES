<template>
	<div class="sign-search">
		<Form ref="formSearch" :model="formSearch" inline>
			<FormItem label="导出报表" class="date_wrapper">
				<date-select ref="dateSelect" @sT="handleStart" @eT="handleEnd" start-placeholder="用户参与开始时间" end-placeholder="用户参与结束时间" />
			</FormItem>
			<FormItem>
				<Input class="brand-search_input" v-model="formSearch.searchq" placeholder="请输入活动名称" clearable search enter-button=""
				 @on-search="searchPage" @on-clear="searchPage" @keydown.native.enter.prevent="searchPage">
				</Input>
			</FormItem>
			<Button type="success" @click="explodeData">导出</Button>
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
					from_time: '',
					to_time: ''
				}
			}
		},
		methods: {
			handleStart(date) {
				this.formSearch.from_time = date;
			},
			handleEnd(date) {
				this.formSearch.to_time = date;
			},
			searchPage() {
				this.$emit('on-search', this.formSearch);
			},
			explodeData(){
				this.$emit('on-explode', this.formSearch);
			}
		}
	}
</script>

<style lang="less">
	.sign-search {
		.brand-search_input {
			width: 320px;
		}

		.date_wrapper {
			width: 500px;
		}

		.ivu-form-item {
			margin-bottom: 0;
		}
	}
</style>
