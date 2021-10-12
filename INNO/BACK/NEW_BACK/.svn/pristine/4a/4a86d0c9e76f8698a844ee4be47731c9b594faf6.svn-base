<template>
	<div class="user-search">
		<Form ref="formSearch" :model="formSearch" inline>
			<FormItem>
				赠送时间：
				<DatePicker v-model="formSearch.searchTime" type="datetimerange" placeholder="请输入赠送时间" style="width: 340px;" transfer></DatePicker>
			</FormItem>

			<FormItem :label-width="0" class="search_wrapper">
				<Input class="user-search_input" v-model="formSearch.search" placeholder="请输入关键字" clearable search enter-button
					   @on-search="searchPage" @on-clear="searchPage" @keydown.native.enter.prevent="searchPage">
				<Select v-model="formSearch.type" slot="prepend" class="user-search_select">
					<Option :value="1">赠送店员</Option>
					<Option :value="2">店员电话</Option>
					<Option :value="3">会员卡号</Option>
				</Select>
				</Input>
			</FormItem>
		</Form>
	</div>
</template>
<script>
	import StoreSelect from '@/views/my-components/list-component/index-edit';
	import DateSelect from '@/views/my-components/date-select/index.vue';

	export default {
		props: {
			// 所属店铺
			storeList: {
				type: Object,
				required: true
			},
			// 来源选择
			registerFrom: {
				type: Object,
				required: true
			},
			// 会员等级
			rankList: {
				type: Object,
				required: true
			}
		},
		components: {
			StoreSelect,
			DateSelect
		},
		data() {
			return {
				formSearch: {
					search: '',
                    type: 1,
                    searchTime: []
				},
				isShowExtra: false,
				storeData: []
			}
		},
		methods: {
			handleSelect() {
				this.$selectContent({
					mode: 'store',
					type: 'radio',
					data: this.storeData,
					getList: (data) => {
						this.storeData = data;
						this.formSearch.store_id = data[0].id;
					}
				})
			},
			handleTag(data) {
				this.storeData = data;
				this.formSearch.store_id = 0;
			},
			showExtra() {
				this.isShowExtra = !this.isShowExtra;
			},
			handleStart(date) {
				this.formSearch.startTime = date;
			},
			handleEnd(date) {
				this.formSearch.endTime = date;
			},
			clearCondition() {
				this.formSearch = {
					startTime: '',
					endTime: '',
					store_id: '0',
					staff_code: '',
					platform_src: [],
					user_rank: [],
					is_bind_mobile: 0,
					is_related_user: 0,
					is_profile_modify: 0,
					is_bind_staff: 0,
					is_wx_subscribe: 0,
					is_bind_applet: 0,
					search: '',
				};
			},
			searchPage() {
				this.$emit('on-search', this.formSearch);
			}
		}
	}
</script>
<style lang="less">
	.user-search {
		.user-search_input {
			.ivu-input-icon-clear {
				right: 50px;
			}
		}

		.search_wrapper {
			.ivu-form-item-content {
				display: flex;
				align-items: center;
			}

			.search_btn {
				display: inline-block;
				margin-left: 10px;
			}
		}

		.user-search_input {
			width: 278px;

			.user-search_select {
				width: 100px;
			}
		}

		.basic_select {
			.ivu-select-dropdown {
				max-height: 200px;
			}
		}

		.ivu-form-item {
			margin-bottom: 10px;
			margin-right: 10px;
		}

		.ivu-form-item-label {
			text-align: left;
		}

		// .store_select{
		//   .select{
		//     min-width: 200px;
		//   }
		//   .ivu-select{
		//     width: auto;
		//   }
		// }
	}
</style>
