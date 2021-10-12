<style scoped lang="less">
    .expand-row{
				input{
					width: 100px;
				}
    }
</style>
<template>
    <div style="margin-bottom:-16px;">
			<Form ref="formRowRef" :model="row" :rules="ruleGoodsValidate">
        <Row class="expand-row" v-for="(item, index) in row.sku" :key="index">
            <Col span="8" class="flex f-align-center">
                <span class="expand-key">SKU: &nbsp;</span>
                <span class="expand-value">{{ item.product_id }}</span>
            </Col>
            <Col span="8" class="">
								<FormItem :prop="`sku.${index}.market_price`" :rules="ruleGoodsValidate.market_price">
									<div class="flex f-align-center">
										<span class="expand-key">原价: &nbsp;</span>
										<span class="expand-value">
											<Input type="number" v-model="item.market_price" @on-blur="syncRow"/>
										</span>
									</div>
								</FormItem>
            </Col>
            <Col span="8" class="flex f-align-center">
								<FormItem :prop="`sku.${index}.price`" :rules="ruleGoodsValidate.price">
									<div class="flex f-align-center">
										<span class="expand-key">换购价: &nbsp;</span>
										<span class="expand-value">
											<Input type="number" v-model="item.price" @on-blur="syncRow"/>
										</span>
									</div>
								</FormItem>
            </Col>
					</Row>
				</Form>
    </div>
</template>
<script>
    export default {
        props: {
            row: Object
        },
				data(){
					return {
						ruleGoodsValidate: {
							market_price: [{ required: true, trigger: 'blur', type: 'number', validator: this.validateNumberInput }],
							price: [{ required: true, trigger: 'blur', type: 'number', validator: this.validateNumberInput }]
						}
					}
				},
				methods:{
					validateNumberInput(rule, value, callback){
						if (!Number(value)) {
									callback(new Error('输入数字'));
						} 	 if (!(value > 0)) {
									callback(new Error('输入大于0的数字'));
						} else {
									callback();
						}
					},
					checkInput(){
						return new Promise((rs, rj)=>{
							this.$refs["formRowRef"].validate((valid) => {
								console.log(valid);
								return rs(valid);
							})
						})
					},
					syncRow(){
						this.$emit("syncSkuRow", { _row: this.row})
					}
				}
    };
</script>