<template>
	<div class='goods-select'>
		<modalTemplate ref="modalTemplate" :loadParentData="onLoadData" :tableColumn="columns" :propData="$props" :modalWidth="1000">
			<template slot="search">
				<rewrite-area>
					<Form ref="searchForm" :model="searchForm" :label-width="90" inline class="no-tip flex-b-c">
						<div>
							<FormItem :label-width="0">
								<Input v-model="searchForm.searchq" placeholder="请输入关键字" clearable search enter-button
										@on-search="searchPage()" @on-clear="searchPage" @keydown.native.enter.prevent>
								</Input>
							</FormItem>
							<FormItem label="用户状态">
								<Select v-model="searchForm.state" class="base-select">
									<Option :value="-1">全部</Option>
									<Option :value="0">关闭</Option>
									<Option :value="1">正常</Option>
								</Select>
							</FormItem>
						</div>
						<Button @click="addAdmin">添加人员</Button>
					</Form>
				</rewrite-area>
			</template>
		</modalTemplate>

	</div>
</template>
<script>
	import modalTemplate from '../../template/modal-template.vue';
	import eventMiXin from '../../event-mixin.js';
	import Mixin from './mixin';
	export default{
		mixins: [eventMiXin, Mixin],
		components: {
			modalTemplate,
		},
		data(){
			return {
				searchForm: {
					searchq: "",
					admin_state: -1
				},
				isClear: true,
			}
		},
		computed: {
		},
		methods: {
			beforeShowModal(props){
				return new Promise((rs, rj)=>{
					rs();
				})
			},
			onLoadData(page, extraData){
				let searchForm = this.searchForm || {};
				return this.$MainApi.bindAdmin({
					data: {
						...searchForm,
						...extraData
					},
					other: {
						isErrorMsg: true
					}
				}).then((res)=>{
					if(res.code){
						let data = res.data || {};
						let items = data.items || [];
						let result = {
							list: items,
							total: data.total
						}
						return Promise.resolve(result)
					} else {
						return Promise.reject();
					}
				})
			},
			searchPage(){
				this.$refs["modalTemplate"].searchPage();
			},
			addAdmin(){
				
			}
		},
		mounted(){}
	}
</script>
<style lang="less"></style>