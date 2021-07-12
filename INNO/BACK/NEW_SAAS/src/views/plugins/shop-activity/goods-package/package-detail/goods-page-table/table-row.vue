<style scoped>
    .expand-row{
        margin-bottom: 15px;
        border-bottom: 1px #e5e5e5 solid;
    }
    .expand-col{
        padding-left:8px;
    }
    .text-middle{
        line-height: 75px;
        margin-bottom:10px;
    }
    .consignee-row{
        padding-top:15px;
    }
    .goodsInfo{
        height:80px;
        line-height:80px;
    }
    .goodsInfo-title{
        height:40px;
        line-height:40px;
        background-color:#e3ecf3;
        padding-left:5px;
    }
    .ivu-card-body{
        line-height:25px;
    }
    .text-red{
        color:red;
    }
    .text-green{
        color:green;
    }
    .text-blue{
        color:#2db7f5;
    }
    .text-blue0{
        color:#2d8cf0;
    }
</style>
<template>
    <div>
        <Row v-for="(r,index) in products" :name="index" :key="index" style="height:40px;line-height:40px;">
            <Col span="4">sku：{{r.product_sn}}</Col>
            <Col span="4">商品属性：{{r.color_name}}<span v-if="r.size_name"> , {{r.size_name}}</span></Col>
            <Col span="3">原价：{{r.market_price}}</Col>
            <Col span="4">售卖价：{{r.sale_price}}</Col>
            <Col span="2">库存：{{r.product_number}}</Col>
            <Col span="3">排序：{{r.sort}}</Col>
            <Col span="3">启用：
            <i-switch :disabled="true" v-model="r.is_enabled" trueValue="1" falseValue="0">
                <span slot="open">是</span>
                <span slot="close">否</span>
            </i-switch>
            </Col>
        </Row>
    </div>
</template>
<script>
	export default {
		props: {
			products: ''
		}
	};
</script>