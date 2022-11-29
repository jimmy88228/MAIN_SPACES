<template>
	<div>
		<Cascader 
		:value="selectValue" 
		@on-change="selectChange" 
		:data="dataList" 
		filterable 
		:size="size" 
		:change-on-select="changeOnSelect"
		:transfer="transfer"
		:clearable="clearable"
		:placeholder="placeholder"
		ref="myCascader"
		></Cascader>
	</div>
</template>
<script>
	export default{
		name: 'dataCascader',
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
			labelKey: {
				type: String,
				default(){
					return 'name'
				}
			},
			value:{
				type: Array,
				default(){
					return []
				}
			},
			transfer: {
				type: Boolean,
				default(){
					return false
				}
			},
			size:{
				type: String,
				default(){
					return 'default'
				}
			},
			changeOnSelect: {
				type: Boolean,
				default: true
			},
			clearable: {
				type: Boolean,
				default: true
			},
			placeholder: {
				type: String,
				default: ''
			},
			// 省市区选项可选择到的范围
			selectRange: {
				type: String,
				default: "" //选择范围到 prov表示直到省， city表示能选到市，默认情况下选到区
			},
		},
		data(){
			return {
				dataList: [],
				dataReq: {},
				selectValue: [],
				_valueKey: 'id',
				_labelKey: 'name'
			}
		},
		methods:{
			getData(){
				if(this.type){
					this._valueKey = this.valueKey;
					this._labelKey = this.labelKey;
					switch(this.type){
						case "address":
							this.reqHandle("getAddressList")
							break;
					}
				}
			},
			reqHandle(reqUrl, params = {}){
				this.$MainApi[reqUrl]({
						data: params,
						other: {
								isShowLoad: true,
						},
				})
				.then((res) => {
						if (res.code) {
							let data = res.data || {};
							let items = data.items || [];
							if(this.type == "address"){
								items = (items[0] && items[0].children) || [];
							}
							this.dataList = this.dataHandle(items) || [];
						}
				});
			},
			dataHandle(data){
				if(data instanceof Array){
					let isNeedLoop = false;
					for(let i = 0; i < data.length; i++){
						if(!data[i].value){
							data[i].value = data[i][this._valueKey];
							isNeedLoop = true;
						}
						if(!data[i].label){
							data[i].label = data[i][this._labelKey];
							isNeedLoop = true;
						}
						if(isNeedLoop && data[i].children && data[i].children.length > 0){
							data[i].children = this.dataHandle(data[i].children);
						}
					}
					return data;
				}
			},
			selectChange(data, selectArr){
				if((typeof(data) == 'undefined' && this.selectValue) || ((data && data.length == 0) && (this.selectValue && this.selectValue.length > 0))){
					this.$refs.myCascader.query = '';
					data = [];
					this.$set(this, 'selectValue', data);
				} else {
					this.selectValue = data;
				}
				this.$emit('change', data);
				this.$emit('on-change', data, selectArr);
			}
		},
		mounted(){},
		watch:{
			type: {
				handler(nV){
					this.$nextTick(()=>{
						this.getData();
					})
				},
				immediate: true
			},
			value:{
				handler(nV) {
					try{
						if(nV instanceof Array && typeof(nV[0]) == 'string'){
							for(let i = 0; i < nV.length; i++){
								nV[i] = parseInt(nV[i]);
							}
						} else if(typeof(nV) == 'string'){
							nV = parseInt(nV) || 0;
						}
					}catch(e){}
					this.$nextTick(()=>{
						this.selectValue = nV;
					})
				},
				immediate: true
			},
		}
	}
</script>