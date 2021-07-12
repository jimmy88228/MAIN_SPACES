<template>
	<div class="user-search">
		<Form ref="formSearch" :model="formSearch" :label-width="90">
			<FormItem :label-width="0" class="search_wrapper">
				<Input class="user-search_input" v-model="formSearch.search" placeholder="请输入关键字" clearable search enter-button
				 @on-search="searchPage" @on-clear="searchPage" @keydown.native.enter.prevent="searchPage">
				<Select v-model="formSearch.type" slot="prepend" class="user-search_select">
					<!--<Option :value="1">用户名</Option>-->
					<Option :value="2">昵称</Option>
					<Option :value="3">手机号</Option>
					<Option :value="4">卡号</Option>
				</Select>
				</Input>
				<a @click="showExtra" class="search_btn">{{isShowExtra ? '普通搜索' : '高级搜索'}}</a>
			</FormItem>
			<transition name="fade">
				<div v-show="isShowExtra">
					<FormItem label="注册时间">
						<date-select @sT="handleStart" @eT="handleEnd" />
					</FormItem>
					<Row>
						<Col span="8">
						<FormItem label="绑定手机">
							<Select v-model="formSearch.is_bind_mobile" class="basic_select">
								<Option :value="0">全部</Option>
								<Option :value="1">是</Option>
								<Option :value="2">否</Option>
							</Select>
						</FormItem>
						<FormItem label="绑定店员">
							<Select v-model="formSearch.is_bind_staff" class="basic_select">
								<Option :value="0">全部</Option>
								<Option :value="1">是</Option>
								<Option :value="2">否</Option>
							</Select>
						</FormItem>
						</Col>
						<Col span="8">
						<FormItem label="已合并">
							<Select v-model="formSearch.is_related_user" class="basic_select">
								<Option :value="0">全部</Option>
								<Option :value="1">是</Option>
								<Option :value="2">否</Option>
							</Select>
						</FormItem>
						<FormItem label="关注公众号">
							<Select v-model="formSearch.is_wx_subscribe" class="basic_select">
								<Option :value="0">全部</Option>
								<Option :value="1">是</Option>
								<Option :value="2">否</Option>
							</Select>
						</FormItem>
						</Col>
						<Col span="8">
						<FormItem label="完善资料">
							<Select v-model="formSearch.is_profile_modify" class="basic_select">
								<Option :value="0">全部</Option>
								<Option :value="1">是</Option>
								<Option :value="2">否</Option>
							</Select>
						</FormItem>
						<FormItem label="绑定小程序">
							<Select v-model="formSearch.is_bind_applet" class="basic_select">
								<Option :value="0">全部</Option>
								<Option :value="1">是</Option>
								<Option :value="2">否</Option>
							</Select>
						</FormItem>
						</Col>
					</Row>
					<Row>
						<Col span="8">
						<FormItem label="所属店员">
							<Input v-model="formSearch.staff_code" clearable placeholder="请输入店员code" class="basic_input" />
						</FormItem>
						</Col>
						<Col span="8">
						<FormItem label="会员等级">
							<Select v-model="formSearch.user_rank" placeholder="请选择会员等级" class="basic_select" multiple>
								<Option :value="0">全部</Option>
								<Option v-for="(item, user_rank) in rankList" :value="user_rank" :key="user_rank">{{ item }}</Option>
							</Select>
						</FormItem>
						</Col>
						<Col span="8">
						<FormItem label="请选择来源">
							<Select v-model="formSearch.platform_src" placeholder="请选择来源" class="basic_select" multiple>
								<Option :value="0">全部</Option>
								<Option v-for="(item, platform_src) in registerFrom" :value="platform_src" :key="platform_src">{{ item }}</Option>
							</Select>
						</FormItem>
						</Col>
					</Row>

					<Row>
						<Col span="8">
						<FormItem label="是否分销员">
							<Select v-model="formSearch.bind_staffdstb" class="basic_select">
								<Option :value="0">全部</Option>
								<Option :value="1">是</Option>
								<Option :value="2">否</Option>
							</Select>
						</FormItem>
						</Col>
						<Col span="8">
						<FormItem label="是否绑定分销关系">
							<Select v-model="formSearch.bind_staffdstbrelation" class="basic_select">
								<Option :value="0">全部</Option>
								<Option :value="1">是</Option>
								<Option :value="2">否</Option>
							</Select>
						</FormItem>
						</Col>
					</Row>


					<FormItem label="所属店铺" class="store_select">
						<store-select :data="storeData" type="radio" @del-tag="handleTag">
							<Button type="dashed" @click="handleSelect" class="basic_select">选择所属店铺</Button>
						</store-select>
					</FormItem>
					<Row>
						<Col span="24">
							<div style="margin-bottom: 10px;text-align: center;">
								<Button @click="clearCondition">重置</Button>
								<Button type="primary" @click="searchPage">搜索</Button>
								<a @click="showExtra" class="search_btn" style="margin-left:10px">
									<Icon type="ios-arrow-up" /> 收起选项</a>
							</div>
						</Col>
					</Row>
				</div>
			</transition>
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
					startTime: '',
					endTime: '',
					store_id: 0,
					staff_code: '',
					platform_src: [],
					user_rank: [],
					is_bind_mobile: 0,
					is_related_user: 0,
					is_profile_modify: 0,
					is_bind_staff: 0,
					is_wx_subscribe: 0,
					is_bind_applet: 0,
                    bind_staffdstbrelation: 0,
                    bind_staffdstb: 0,
					search: '',
					type: 4
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
			width: 320px;

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
