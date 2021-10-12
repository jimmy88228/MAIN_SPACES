<template>
  <modalTemplate ref="modalTemplate" :loadParentData="onLoadData" :tableColumn="columns" :status="status" :modalWidth="900">
		<template slot="search">
			<Form ref="formSearch" :model="formSearch" :label-width="90" inline class="goods_search">
				<div class="flex">
					<FormItem label="活动状态" >
						<Select v-model="formSearch.status">
							<Option :value="-1">全部</Option>
							<Option :value="0">关闭</Option>
							<Option :value="1">开启</Option>
							<Option :value="2">过期</Option>
						</Select>
					</FormItem>
					<FormItem :label-width="0">
						<div class="flex f-just-between">
							<div class="flex">
								<Input class="goods-search_input" v-model="formSearch.searchq" placeholder="请输入关键字" clearable search enter-button
								 @on-search="searchPage" @on-clear="searchPage" @keydown.native.enter.prevent>
								<Select v-model="formSearch.searchq_type" slot="prepend" class="goods-search_select">
									<Option :value="1">活动名称</Option>
									<Option :value="2">商品货号</Option>
									<Option :value="3">活动ID</Option>
								</Select>
								</Input>
							</div>
							&nbsp;&nbsp;
							<div class="p-right-20">
								<Button type="primary" @click="importGoods"><Icon type="md-cloud-upload" />&nbsp;导入商品</Button>
							</div>
						</div>
					</FormItem>
				</div>
			</Form>
		</template>
	</modalTemplate>
</template>

<script>
import modalTemplate from '../../template/modal-template.vue';
import eventMiXin from '../../event-mixin.js';
import Mixin from './mixin';

export default{
		name: 'pinTuanSelect',
		props: {
		},
		mixins: [eventMiXin, Mixin],
		components: {
			modalTemplate
		},
		data(){
			return {
				formSearch: {
					searchq: '',
					status: -1,
					searchq_type: 1
				},
			}
		},
		computed: {
		},
		methods: {
			onLoadData(page, exteData){
				let formSearch = this.formSearch || {};
				return this.$ajax.post( this.$api.GroupActivityList, {
					...this.formSearch,
					...exteData
					}).then( (response) => {
							var res = response.data || {};
							if(res.code == 1){
								let data = res.data || {};
								let items = data.items || [];
								if(items instanceof Array){
									for(let i = 0; i < items.length; i++){
										items[i].img = items[i].active_image;
									}
								} else {
									let _items = [];
									for(let i in items){
										items[i].img = items[i].active_image;
										_items.push(items[i]);
									}
									items = _items
								}
								this.data = data;
								let result = {
									items: items,
									total: data.total
								}
								this.formSearch.import_type = 0;
								return Promise.resolve(result)
							} else {
								return Promise.reject();
							}
				}).catch(()=>{
					
				})
			},
			searchPage(){
				this.$refs["modalTemplate"].searchPage();
			},
			// 导入商品
			importGoods(){
				this.$UIModule({
					mode: "batch-import",
					props: {
						inputKey: "活动ID",
					},
					options: {
						
						canCreate: {
							upload: true,
							download: true,
							goodsInputImport: true
						},
						uploadUrl: this.$api.GroupActivityIdImport,
						downloadUrl: this.$api.GroupActivityIdTpl
					},
					success:(data)=>{
						let uploadInputTxt = data || "";
						this.formSearch.searchq_type = 3; //
						this.formSearch.searchq = uploadInputTxt;
						this.formSearch.import_type = 1;
						this.$refs["modalTemplate"].searchPage();
					}
				})
			},
		},
		mounted(){
		}
	}
</script>
