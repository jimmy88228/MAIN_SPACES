<template>
	<Input 
	v-if="type != 'number'"
	ref="myInput" 
	:value="inputValue" 
	:type='type' 
	:number='number'
	:placeholder='placeholder'
	:clearable='clearable'
	:disabled='disabled'
	:readonly='readonly'
	:maxlength='dfMaxlength'
	:show-word-limit='showWordLimit'
	:icon='icon'
	:size='size'
	:rows='rows'
	class="custom-input"
	:class="[customClass,showWordLimit?'showWordLimitClass':'',clearable?'clearableClass':'']" 
	:style="customStyle"
	:search="search"
	@on-change='inputChange'
	@on-focus='inputFocus'
	@on-click='inputClick'
	@on-blur='inputBlur'
	@on-search='inputSearch'
	@on-clear='inputClear'
	></Input>
	<InputNumber v-else
		:max="max"
		:min="min"
		:value="inputValue"
		:step="step"
		:size="size"
		:disabled="disabled"
		:placeholder="placeholder"
		:readonly="readonly"
		:editable="editable"
		:precision="precision"
		@on-change='inputChange'
		@on-focus='inputFocus'
		@on-blur='inputBlur'
	>
	</InputNumber> 
</template>
<script>
	const UnLimitType = /^(textarea)+$|^(url)+$/g;
	export default{
		name: 'customInput',
		model: {
			prop: 'value',
			event: 'on-change'
		},
		props: {
			type: {
				type: String,
				default: 'text'
			},
			value:{
				type: String | Number,
				default(){
					return ''
				}
			},
			placeholder: {
				type: String,
				default: ''
			},
			clearable: {
				type: Boolean,
				default: false
			},
			disabled: {
				type: Boolean,
				default: false
			},
			readonly: {
				type: Boolean,
				default: false
			},
			maxlength: {
				type: Number | String,
				default: ''
			},
			'showWordLimit': {
				type: Boolean,
				default: false
			},
			showWordLimit: {
				type: Boolean,
				default: false
			},
			icon: {
				type: String,
				default: ''
			},
			number: {
				type: Boolean,
				default: false
			},
			size:{
				type: String,
				default(){
					return 'default'
				}
			},
			min: {
				type: Number,
				default: -Infinity
			},
			max: {
				type: Number,
				default: Infinity
			},
			rows: {
				type: Number | String,
				default: 2
			},
			beforeChange: {
				type: Function
			},
			isInt: {
				type: Boolean,
				default: false
			},
			'customClass':{
				type: String,
				default(){
					return ''
				}
			},
			'customStyle':{
				type: String,
				default(){
					return ''
				}
			},
			'boxStyle':{
				type: String,
				default(){
					return ''
				}
			},
			'search': {
				type: Boolean,
				default: false
			},
            step:{
                type:Number,
                default:1,
            },
            editable:{
                type:Boolean,
                default:true,
            },
            precision:Number,
		},
		data(){
			return {
				inputValue: '',
			}
		},
		computed:{
			dfMaxlength(){
				if(this.type && !UnLimitType.test(this.type) && !this.maxlength){ //默认限制100长度
					return 100;
				} else {
					return this.maxlength || '';
				}
			}
		},
		methods:{
			
			inputChange(e){
				if(typeof(this.beforeChange) == 'function'){
					if(this.$util.isPromise(this.beforeChange)){
						this.beforeChange().then(()=>{
							this.changeCallback(e);
						}) .catch(()=>{
							this.holdCallback();
						})
					} else {
						if(this.beforeChange()){
							this.changeCallback(e);
						} else {
							this.holdCallback();
						}
					}
				} else {
					this.changeCallback(e);
				}
			},
			changeCallback(e){
				let data;
				if(this.type == 'number' || this.number){
					data = e
				}else{
					let target = e.target || {};
					data = target.value || '';
				}
				this.$nextTick(()=>{
					this.setOriginInput(data);
					this.inputValue = data;
					this.$emit('on-change', data);
				})
			},
			holdCallback(){
				this.$nextTick(()=>{
					let value = this.value || '';
					this.setOriginInput(value);
					this.inputValue = value;
					this.$emit('on-change', value);
				})
			},
			inputFocus(){
				this.$emit('on-focus');
			},
			inputClick(){
				this.$emit('on-click')
			},
			inputBlur(){
				this.$emit('on-blur')
			},
			inputSearch(data){
				this.$emit('on-search', data)
			},
			inputClear(){
				this.$emit('on-clear')
			},
			focus(){
				this.$refs['myInput'].focus();
			},
			setOriginInput(value){
				if(this.$refs['myInput'] && this.$refs['myInput'].$refs['input']){
					this.$refs['myInput'].$refs['input'].value = value;
					this.$refs['myInput'].$refs['input']._value = value;
					if(typeof value === 'number'){
						this.$refs['myInput'].$refs['input'].valueAsNumber = value;
					}
					this.$refs['myInput'].$data.currentValue = value;
				}
			}
		},
		mounted(){},
		watch:{
			value:{
				handler(nV) { 
					let value = (nV || nV == 0) ? nV : (this.type == 'number' ? 0:'');
					this.inputValue = value;
				},
				immediate: true
			}
		}
	}
</script>

<style lang="less">
.custom-input{
	&.showWordLimitClass{
		.ivu-input{
			padding-right: 46px;
			box-sizing: border-box;
		}
	}
	&.clearableClass{
		.ivu-input{
			padding-right: 25px;
			box-sizing: border-box;
		}
	}
}
</style>