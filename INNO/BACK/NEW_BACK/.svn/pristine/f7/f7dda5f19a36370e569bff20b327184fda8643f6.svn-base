<style lang="less">
  .comment-search-form{
		.ivu-form-item-label{
			padding-left: 10px;
		}
		.ivu-form-item{
			display: flex;
		}
	}
</style> 

<template>
	<Form class="comment-search-form">
		<div class="flex f-just-between">
			<div class="flex">
				<FormItem label="日期">
					<dateSelect ref="dateSelect" defaultTime="week" @sT="handleStart" @eT="handleEnd"></dateSelect>
				</FormItem>
				<template v-if="currTabKey == 2">
					<FormItem label="搜索类型" inline>
						<Select v-model="formData.searchq_type" class="basic_select">
							<Option :value="item.value"  :key="item.value" v-for="(item) in searchqTypes">
								{{item.label}}
							</Option>
						</Select>
					</FormItem>
				</template>
				&nbsp;<Button type="primary" @click="handleExport"><Icon type="md-cloud-download" />&nbsp;导出</Button>
			</div>
			<div>
				<Input
					class=""
					style="width:230px"
					v-model="formData.searchq"
					placeholder="店铺名称 模糊查询"
					clearable
					search
					enter-button
					@on-search="searchData()"
					@on-clear="searchData()"
					@keydown.native.enter.prevent="searchData()"></Input>
			</div>
		</div>
		<div class="flex" v-if="currTabKey == 4">
			<FormItem label="评论类型">
				<Select v-model="formData.level_kind" class="basic_select">
					<Option :value="item.value"  :key="item.value" v-for="(item) in commentTypes">
						{{item.label}}
					</Option>
				</Select>
			</FormItem>
			<FormItem label="最小星级">
				<Select v-model="formData.from_level" class="basic_select">
					<Option :value="item.value"  :key="item.value" v-for="(item) in minStars">
						{{item.label}}
					</Option>
				</Select>
			</FormItem>
			<FormItem label="最大星级">
				<Select v-model="formData.to_level" class="basic_select">
					<Option :value="item.value"  :key="item.value" v-for="(item) in maxStars">
						{{item.label}}
					</Option>
				</Select>
			</FormItem>
			<FormItem label="搜索类型">
				<Select v-model="formData.searchq_type" class="basic_select">
					<Option :value="item.value"  :key="item.value" v-for="(item) in serverSearchqTypes">
						{{item.label}}
					</Option>
				</Select>
			</FormItem>
		</div>
	</Form>
</template>

<script>
import dateSelect from '@/views/my-components/date-select/index.vue';
export default {
	name: 'commentSearchForm',
	props: {
		formData: {
			type: Object,
			default(){
				return {}
			}
		},
		currTabKey: {
			type: Number,
			default(){
				return 1
			}
		}
	},
	components: {
		dateSelect
	},
	data () {
		return {
			searchqTypes: [
				{
					value: '1',
					label: '商品款号'
				},
				{
					value: '2',
					label: '颜色名称'
				},
				{
					value: '3',
					label: '会员卡号'
				},
				{
					value: '4',
					label: '店铺code'
				}
			],
			serverSearchqTypes: [
				{
					value: '1',
					label: '订单编号'
				},
				{
					value: '2',
					label: '会员卡号'
				},
				{
					value: '3',
					label: '店铺code'
				},
			],
			commentTypes: [
				{
					value: '0',
					label: '全部类型'
				},
				{
					value: '1',
					label: '包裹'
				},
				{
					value: '2',
					label: '快递速度'
				},
				{
					value: '3',
					label: '快递员态度'
				}
			],
			minStars: [
				{
					value: '1',
					label: '1'
				},
				{
					value: '2',
					label: '2'
				},
				{
					value: '3',
					label: '3'
				},
				{
					value: '4',
					label: '4'
				},
				{
					value: '5',
					label: '5'
				}
			],
			maxStars: [
				{
					value: '5',
					label: '5'
				},
				{
					value: '4',
					label: '4'
				},
				{
					value: '3',
					label: '3'
				},
				{
					value: '2',
					label: '2'
				},
				{
					value: '1',
					label: '1'
				}
			],
		}
	},
	methods: {
		handleStart(date){
			this.formData.start_time = date;
		},
		handleEnd(date){
			this.formData.end_time = date;
		},
		searchData(){
			this.$emit('searchData', this.formData);
		},
		handleExport(){
			this.$emit("handleExport");
		}
	},
}
</script>