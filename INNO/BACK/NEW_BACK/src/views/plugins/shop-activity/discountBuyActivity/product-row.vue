<style scoped>
    .expand-row{
        margin-bottom: 15px;
        .ivu-col{
            margin: auto 5px;
        }
        .goods_attr{
            overflow: hidden;
            text-overflow:ellipsis;
            white-space: nowrap;
        }
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
    <div >
        <Row class="expand-row" v-for="(r,index) in products" :name="index" :key="index" style="height:80px;line-height:40px;">
            <Col span="5">sku：{{r.product_sn}}</Col>
            <Col span="4" class="goods_attr">
                <Tooltip theme="light">
                    属性：{{r.color_name}}<span v-if="r.size_name"> , {{r.size_name}}</span>
                    <div slot="content">
                        {{r.color_name}}<span v-if="r.size_name"> ，{{r.size_name}}</span>
                    </div>
                </Tooltip>
            </Col>
            <Col span="2">已售：{{r.sale_number}}</Col>
            <Col span="7">实际库存：{{r.product_number}}
                <div>活动库存：<InputNumber :min="0" v-model="r._qty" :disabled="!isEdit || r.disabed_update_stock" :active-change="false" @on-change="abc"></InputNumber><span style="color:red;margin-left:10px">* &nbsp;如已开启独立活动取商品列表库存配置,则无需填写库存数量</span></div>
            </Col>
            <Col span="4">原价：<InputNumber :min="0" v-model="r._market_price" @on-change="abc" :active-change="false" :disabled="!isEdit"></InputNumber>
                <div>秒杀价：
                <InputNumber v-model="r._sale_price" :min="0" @on-change="abc" :active-change="false" :disabled="!isEdit"></InputNumber></div>
            </Col>
            <Col span="2">启用：
                <i-switch :disabled="!isEdit" v-model="r._enable" trueValue="1" falseValue="0" @on-change="abc">
                    <span slot="open">是</span>
                    <span slot="close">否</span>
                </i-switch>
                <div>售馨：
                <i-switch :disabled="!isEdit" v-model="r.isSellout" trueValue="1" falseValue="0">
                    <span slot="open">是</span>
                    <span slot="close">否</span>
                </i-switch>
                </div>
                <div v-if="0">排序：<InputNumber v-model="r._sort" :min="0" @on-change="abc" :disabled="!isEdit"></InputNumber></div>
            </Col>
            <Col span="1" v-if="0"><Button type="error" size="small" v-if="isEdit" @click.native="del(index)">删除</Button><span v-else>--</span></Col>
        </Row>

    </div>
</template>
<script>
    import util from '@/libs/util.js';
    export default {
        props: {
            products: '',
            isEdit:false,
        },
        data(){
            return {
                cdnHost:util.cdnHost,
            }
        },
        methods:{
            del(index){
                this.$delete(this.products,index);
                console.log(this.products);
                this.$emit("getProduct", this.products); 

            },
            abc(){
               // return this.products;
               this.$emit("getProduct", this.products); 
            }
            
        }
    };
</script>