<template>
  <modalTemplate ref="modalTemplate" :loadParentData="onLoadData" :tableColumn="columns" :status="status" :modalWidth="900">
		<template slot="search">
			<Form ref="formSearch" :model="formSearch" :label-width="0" inline class="goods_search">
				<div class="flex">
					<FormItem >
						<Input
						  class="goods-search_input"
						  v-model="formSearch.searchq"
						  placeholder="请输入红包名称"
						  clearable
						  search
						  enter-button
						  @on-search="searchPage(formSearch)"
						  @on-clear="searchPage"
						  @keydown.native.enter.prevent />
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
					searchq: ''
				},
			}
		},
		computed: {
		},
		methods: {
			onLoadData(page, exteData){
				let formSearch = this.formSearch || {};
				return this.$ajax.post( this.$api.redPacketList, {
					...this.formSearch,
					...exteData
					}).then( (response) => {
							var res = response.data || {};
							if(res.code == 1){
								let data = res.data || {};
								let items = data.items || [];
								for(let i = 0; i < items.length; i++){
									items[i].name = items[i].act_name;
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
			// // 导入商品
			// importGoods(){
			// 	this.$UIModule({
			// 		mode: "batch-import",
			// 		props: {
			// 			inputKey: "活动ID",
			// 		},
			// 		options: {
						
			// 			canCreate: {
			// 				upload: true,
			// 				download: true,
			// 				goodsInputImport: true
			// 			},
			// 			uploadUrl: this.$api.GroupActivityIdImport,
			// 			downloadUrl: this.$api.GroupActivityIdTpl
			// 		},
			// 		success:(data)=>{
			// 			let uploadInputTxt = data || "";
			// 			this.formSearch.searchq_type = 3; //
			// 			this.formSearch.searchq = uploadInputTxt;
			// 			this.formSearch.import_type = 1;
			// 			this.$refs["modalTemplate"].searchPage();
			// 		}
			// 	})
			// },
		},
		mounted(){
		}
	}
</script>
