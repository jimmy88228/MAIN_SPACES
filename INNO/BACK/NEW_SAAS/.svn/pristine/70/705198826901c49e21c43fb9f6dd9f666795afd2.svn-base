<template>
	<div class="store-search">
		<Form ref="formSearch" :model="formSearch" :label-width="70">
			<FormItem :label-width="0">
				<Input class="store-search_input" v-model="formSearch.search" placeholder="如多店铺（英文逗号隔开）" clearable search
				 enter-button @on-search="searchPage" @on-clear="searchPage" @keydown.native.enter.prevent="searchPage">
				<Select v-model="formSearch.search_type" slot="prepend" class="store-search_select">
					<Option :value="1">店铺名称</Option>
					<Option :value="2">代码</Option>
				</Select>
				</Input>
				<a @click="showExtra" class="search_btn">{{isShowExtra ? '普通搜索' : '高级搜索'}}</a>
			</FormItem>
			<div v-show="isShowExtra">
				<Row>
					<Col span="6">
					<FormItem label="所属地区">
						<Cascader class="basic_cascader" v-model="areaCol" :data="areaList" ref="areaRef" filterable change-on-select
						 transfer :clearable="isClear" :render-format="renderSort" @on-change="selectArea"></Cascader>
					</FormItem>
					</Col>
					<Col span="6">
					<FormItem label="渠道类型" class="form_padding">
						<Cascader class="basic_cascader" v-model="agentCol" :data="agentList" ref="agentRef" filterable change-on-select
						 transfer :clearable="isClear" :render-format="renderSort" @on-change="selectAgent"></Cascader>
					</FormItem>
					</Col>
					<Col span="6" v-show="type != 1">
					<FormItem label="绑定店铺" class="form_padding">
						<Select v-model="formSearch.is_default" class="basic_select">
							<Option :value="0">全部</Option>
							<Option :value="1">是</Option>
							<Option :value="2">否</Option>
						</Select>
					</FormItem>
					</Col>
					<Col span="6">
					<FormItem label="店铺自提" class="form_padding">
						<Select v-model="formSearch.self_get" class="basic_select">
							<Option :value="0">全部</Option>
							<Option :value="1">开启</Option>
							<Option :value="2">不开启</Option>
						</Select>
					</FormItem>
					</Col>
				</Row>
				<Row>
					<div style="margin-bottom: 10px;">
						<Button type="primary" @click="searchPage">搜索</Button>
						<Button type="primary" @click="clearCondition">重置</Button>
					</div>
				</Row>
			</div>
		</Form>
	</div>
</template>
<script>
	export default {
		props: {
			type: {
				type: [String, Number],
				required: true
			},
			areaList: {
				type: Array,
				required: true
			},
			agentList: {
				type: Array,
				required: true
			}
		},
		data() {
			return {
				areaCol: [],
				agentCol: [],
				formSearch: {
					area: 0,
					agent_id: 0,
					is_default: 0,
					self_get: 0,
					search: '',
					search_type: 1
				},
				isShowExtra: false,
				isClear: false
			}
		},
		methods: {
			renderSort(labels) {
				return labels.slice(labels.length - 1).join('/');
			},
			searchPage() {
				this.$emit('on-search', this.formSearch);
			},
			clearCondition() {
				this.formSearch = {
					area: 0,
					agent_id: 0,
					is_default: 0,
					self_get: 0,
					search: '',
					search_type: 1
				}
				this.areaCol = [];
				this.agentCol = [];
			},
			selectArea(value, selectedData) {
				this.formSearch.area = selectedData[selectedData.length - 1].value;
			},
			selectAgent(value, selectedData) {
				this.formSearch.agent_id = Number(selectedData[selectedData.length - 1].value);
			},
			showExtra() {
				this.isShowExtra = !this.isShowExtra;
			}
		}
	}
</script>

<style lang="less">
	.store-search {
		.ivu-form-item-content {
			display: flex;
			align-items: center;
		}

		.form_padding {
			padding-left: 10px;
		}

		.search_btn {
			display: inline-block;
			margin-left: 10px;
		}

		.store-search_input {
			width: 340px;

			.store-search_select {
				width: 100px;
			}
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
