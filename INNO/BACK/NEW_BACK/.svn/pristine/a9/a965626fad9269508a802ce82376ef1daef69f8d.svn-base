<template>
	<div>
		<Select v-model="selectValue" filterable @on-change="selectChange" class="basic_select">
			<Option v-for="(item, index) in dataList" :key="item[valueKey]" :value="item[valueKey]">{{item.name}}</Option>
		</Select>
	</div>
</template>
<script>
	export default{
		name: 'dataSelect',
		model: {
			prop: 'value',
			event: 'change'
		},
		props: {
			type: {
				type: String,
				default(){
					return ''
				}
			},
			valueKey:{
				type: String,
				 default(){
					 return 'id'
				 }
			},
			value:{
				type: String | Number,
				default(){
					return 0
				}
			}
		},
		data(){
			return {
				dataList: [],
				selectValue: this.value
			}
		},
		methods:{
			getData(){
				if(this.type){
					let req = "", params = {} 
					switch(this.type){
						case "store":
							req = "componentStoreList",
							params = {}
							break;
					}
					this.getDataReq(req, params);
				}
			},
			getDataReq(req, params){
				return this.$ajax.post(this.$api[req], params).then((response)=>{
					let res = response.data || {};
					if(res.code){
						let data = res.data || {};
						let items = data.items || [];
						this.dataList = items;
					}
				})
			},
			selectChange(data){
				this.$emit('change', data)
			}
		},
		mounted(){
			this.$nextTick(()=>{
				this.getData();
			})
		},
		watch:{
			value(nV){
				this.selectValue = nV;
			}
		}
	}
</script>