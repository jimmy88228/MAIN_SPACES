<template>
	<div>
		<div class="flex f-align-center f-just-between m-bottom-15">
			<div>
				<Input
						class="search_input"
						v-model="formSearch.searchq"
						placeholder="请输入名称/编码"
						clearable
						search
						enter-button
						@on-search="searchPage"
						@on-clear="searchPage"
						@keydown.native.enter.prevent>
							<Select v-model="formSearch.searchqType" slot="prepend" style="width: 100px;">
								<Option value="goods_name" >商品名称</Option>
								<Option value="goods_sn" >商品货号</Option>
							</Select>
						</Input>
			</div>
			<div>
				<Button icon="md-refresh" @click="searchPage" shape="circle" title="刷新列表"></Button>
			</div>
			
		</div>
	</div>
</template>
<script>
	export default{
		props: {
			canCreate:{
				type: Object,
				default(){
					return {}
				}
			}
		},
		components:{
		},
		data(){
			return {
				formSearch:{
					searchq: "",
					searchqType: "goods_name"
				},
			}
		},
		methods:{
			searchPage(){
				this.$emit("search", this.formSearch)
			}
		}
	}
</script>