<template>
	<div class="red-packet-search">
		<Form ref="formSearch" :model="formSearch" inline>
			<FormItem>
				到期时间：
				<DatePicker type="datetime" placeholder="请选择过期时间" v-model="formSearch.time" @on-change="handleDate"></DatePicker>
			</FormItem>
			<FormItem>
				是否过期：
				<Select v-model="formSearch.static_time" style="width:110px;">
					<Option :value="0">全部</Option>
					<Option :value="2">已过期</Option>
					<Option :value="1">未过期</Option>
				</Select>
			</FormItem>
			<FormItem>
				<Input class="basic_input" v-model="formSearch.searchq" placeholder="请输入名称" clearable search enter-button
				 @on-search="searchPage" @on-clear="searchPage" @keydown.native.enter.prevent />
			</FormItem>
		</Form>
	</div>
</template>

<script>
	export default {
		data() {
			return {
				formSearch: {
					searchq: '',
					time: '',
					static_time: 0
				}
			}
		},
		methods: {
			handleDate(val) {
				this.formSearch.time = val;
			},
			searchPage() {
				this.$emit('on-search', this.formSearch);
			}
		}
	}
</script>

<style lang="less">

</style>
