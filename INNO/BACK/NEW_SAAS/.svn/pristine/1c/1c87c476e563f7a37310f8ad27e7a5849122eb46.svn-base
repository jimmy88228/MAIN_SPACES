<template>
	<div class="presale-search">
		<Form ref="formSearch" :model="formSearch" inline>
			<FormItem>
				<Input class="search_input" v-model="formSearch.searchq" placeholder="请输入活动名称" clearable search enter-button
				 @on-search="searchPage" @on-clear="searchPage" @keydown.native.enter.prevent />
			</FormItem>
			<FormItem>
				<a @click="showExtra" class="search_btn">{{isShowExtra ? '普通搜索' : '高级搜索'}}</a> 
			</FormItem>	
			<transition name="fade">
				<div v-show="isShowExtra">
					<div>
						<FormItem label="活动时间">
							<date-select ref="dateSelect" @sT="handleStart" @eT="handleEnd"/>
						</FormItem>
					</div>
					<div>
						<FormItem>
							活动状态
							<Select v-model="formSearch.is_enabled" style="width:150px">
								<Option :value="-1">全部</Option>
								<Option :value="0">关闭</Option>
								<Option :value="1">开启</Option>
								<Option :value="2">过期</Option>
							</Select>
						</FormItem>
				
						<FormItem>
							类型
							<Select v-model="formSearch.presale_type" style="width:150px">
								<Option :value="0">全部</Option>
								<Option :value="1">全款付</Option>
								<Option :value="2">定金</Option>
								<Option :value="3">定金+(固定)膨胀金</Option>
								<Option :value="4">定金+(动态)膨胀金</Option>
							</Select>
						</FormItem>
				
					</div>
					<div style="margin-bottom: 10px;text-align: center;">
						<Button type="primary" @click="searchPage">搜索</Button>
						<a @click="showExtra" class="search_btn" style="margin-left:10px">
							<Icon type="ios-arrow-up" /> 收起选项</a>
					</div>
				
				</div>
			</transition>
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
					is_enabled: -1,
					presale_type: 0,
					start_time: '',
					end_time: ''
				},
				isShowExtra: false,
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
			},
			showExtra() {
				this.isShowExtra = !this.isShowExtra;
			},
		}
	}
</script>

<style lang="less">
	.presale-search {
		.search_input {
			width: 260px;
		}
	}
</style>
