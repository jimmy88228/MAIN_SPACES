<template>
	<div class="coupon-search">
		<Form ref="formSearch" :model="formSearch" inline>
			<FormItem>
				到期时间：
				<DatePicker type="datetime" placeholder="请选择过期时间" v-model="formSearch.date" @on-change="handleDate" style="width:160px;"></DatePicker>
			</FormItem>
			<FormItem>
				是否可赠送：
				<Select v-model="formSearch.give_type" style="width:100px;">
					<Option value="all">全部</Option>
					<Option :value="1">可赠送</Option>
					<Option :value="0">不可赠送</Option>
				</Select>
			</FormItem>
			<FormItem>
				是否过期：
				<Select v-model="formSearch.lost" style="width:90px;">
					<Option :value="0">全部</Option>
					<Option :value="1">已过期</Option>
					<Option :value="2">未过期</Option>
				</Select>
			</FormItem>
			<FormItem>
				发放类型：
				<Select v-model="formSearch.send_type" style="width:120px;">
					<Option value="all">全部</Option>
					<Option :value="0">微商城优惠券</Option>
					<Option :value="3">扫码支付优惠券</Option>
					<Option :value="4">ERP券</Option>
					<Option :value="5">通用券</Option>
				</Select>
			</FormItem>
			<FormItem>
				<Input class="basic_input" v-model="formSearch.searchq" placeholder="请输入名称/编码" clearable search enter-button
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
					date: '',
					give_type: 'all',
					lost: 2,
					send_type: 'all',
					searchq: ''
				}
			}
		},
		methods: {
			searchPage() {
				this.$emit('on-search', this.formSearch);
			},
			handleDate(val) {
				this.formSearch.date = val;
			}
		}
	}
</script>
<style lang="less">
	.coupon-search {
		.search_btn {
			display: inline-block;
			margin-left: 10px;
		}

		.ivu-form-item-content {
			display: flex;
			align-items: center;
		}

		.ivu-input-icon {
			right: 50px;
		}

		.basic_select {
			.ivu-select-dropdown {
				max-height: 200px;
			}
		}
	}
</style>
