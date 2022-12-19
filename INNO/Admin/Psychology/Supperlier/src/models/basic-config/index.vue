<template>
    <hold-layout class="base-config-layout">
        <div class="box" v-bar>
            <div v-if="total == 0" class="global-empty default-text"></div>
            <Form v-else class="v-bar-box flex flex-col" ref="formId" :model="formData" :rules="ruleValidate">
                <FormItem class="list-item" :prop="item.config_key" v-for="(item,key) in list" :key="key">
                    <div class="flex-s-c">
                        <div class="name m-r-20">{{item.config_name || getKeyVal(item.config_key,'name') || ""}}</div>

                        <template v-if="item.type == 'switch'">
                            <i-switch v-model="item.show_config_value" true-value="1" false-value="0">
                                <span slot="open">是</span>
                                <span slot="close">否</span>
                            </i-switch>
                        </template>
                        <template v-else-if="item.type == 'upload'">
                            <img-view :img="item.config_value || ''" @selectImg="(img)=>selectActImg(img,item)" @delImg="(img)=>selectActImg('',item)"></img-view>
                        </template>
                    </div>
                    <div class="desc-notice" v-if="item.description">（{{item.description}}）</div>
                </FormItem> 
            </Form> 
        </div>
        <template v-slot:footer>
            <div class="btn-box flex-c-c">
                <Button class="btn-save" type="primary" @click="save" :loading="$store.state.app.pageLoading">保 存</Button>
            </div>
        </template>
    </hold-layout>
</template>

<script>
    export default {
        name:"baseConfig",
        data() {
            return {
                list: [],
                keyList:{ //定义key value
                    consultant_need_confirm:{
                        name:"是否需要后台确认预约咨询",
                        keyValue:{
                            '0':'0',
                            '1':'1',
                        },
                        type:"switch",
                        description: "是否需要后台确认预约咨询(1:是,0:否)"
                    },
                },
                total:-1,
                ruleValidate:{},
                formData:{}
            }
        },
        methods: {
            getKeyVal(key,val) { 
                return this.keyList[key] && this.keyList[key][val] || ""
            },
            loadData() {
                return this.$MainApi.supplierSettingList({
                    data:{}
                }).then(res=>{
                    if(res.code){
                        let data = res.data||[];
                        let arr = data;
                        arr = arr.map(item=>{
                            return {
                                ...item,
                                type:this.getKeyVal(item.config_key,'type'),
                                show_config_value:this.getKeyVal(item.config_key,'keyValue') && this.getKeyVal(item.config_key,'keyValue')[item.config_value] || item.default_value || ''
                            }
                        }) 
                        this.total = arr.length;
                        this.list = arr;
                    }
                    return res;
                })
            },
            save(){
                let data = this.list.map(item=>{
                    let k_item = this.keyList[item.config_key]||{};
                    if(k_item.type == 'switch'){
                        for(let key in k_item.keyValue){
                            if(k_item.keyValue[key] == item.show_config_value){
                                item.config_value = key;
                            }
                        }
                    }
                    return {
                        config_key:item.config_key,
                        config_name:item.config_name,
                        config_value:item.config_value,
                        default_value:item.default_value,
                        description:item.description,
                    }
                })
                console.log('supplierSettingSave',data)
                return this.$MainApi.supplierSettingSave({
                    data:{
                        data
                    },
                    other: {
                        isShowLoad: true,
                        hideLoadTime: 500,
                    }
                }).then(res=>{
                    if(res.code){
                        let data = res.data || {};
                        if(data.code){
                            this.$Message.success(data.message);
                        } else {
                            this.$Message.warning(data.message);
                        }
                    }
                })
            },
            selectActImg(img,item){
                item.config_value = img || '';
            },

        },
        mounted () {
            this.loadData();
        },
    }
</script>

<style lang="less" scoped>
.base-config-layout{
    .box{
        height: 100%;
        padding: 0 30px;
    }
    .v-bar-box{
        width: 100%;
        height: 100%;
    }
    .name{
        font-size: 15px;
        color:#333;
    }
    .btn-box{
        width: 100%;
        height: 70px;
    }
    .btn-save{
        width: 100px; 
        height: 40px;
        line-height: normal;
    }
    .list-item{
        padding-right: 45px;
        box-sizing: border-box;
    }
}
</style>