<template>
    <hold-layout class="base-config-layout">
        <div class="box" v-bar>
            <Form class="v-bar-box flex flex-col" ref="formId" :model="formData" :rules="ruleValidate">
                <FormItem class="list-item" :prop="item.config_key" v-for="(item,key) in list" :key="key">
                    <div class="flex-s-c">
                        <div class="name m-r-20">{{item.config_name || getKeyVal(item.config_key,'name')||""}}</div>
                        <i-switch v-model="item.show_config_value" true-value="1" false-value="0">
                            <span slot="open"></span>
                            <span slot="close"></span>
                        </i-switch>
                    </div>
                </FormItem> 
            </Form> 
            <!-- <div class="global-empty default-text"></div> -->
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
                keyList:{
                    show_supplier_homepage:{
                        name:"是否显示本渠道主页",
                        tip:"(1:是,0:否)",
                        default_value:'0',
                        keyValue:{
                            '0':'0',
                            '1':'1',
                        },
                        isShow:true
                    },
                    applet_login_type:{
                        name:"是否使用账号密码登录",
                        tip:"(password:账号密码,student:学生登录)",
                        default_value:'student',
                        keyValue:{
                            'student':'0',
                            'password':'1',
                        },
                        isShow:true
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
                return this.$MainApi.basicSettinglist({
                    data:{
                        customer_id:this.pageQuery.customer_id||0
                    },
                    other: {
                        isErrorMsg: true
                    }
                }).then(res=>{
                    if(res.code){
                        let data = res.data||{};
                        let items = data.items||{},arr=[];
                        if(data.total == 0){
                            for(let key in this.keyList){
                                let item = this.keyList[key];
                                arr.push({
                                    config_key:key,
                                    config_name:item.name,
                                    config_value:item.default_value,
                                    show_config_value:item.keyValue[item.default_value]||"0",
                                    default_value:item.default_value,
                                    description:(item.name) + (item.tip)
                                })
                            }
                        }else{
                            for(let key in items){
                                let keyItem = this.keyList[key]||{};
                                arr.push({
                                    config_key:key,
                                    config_name:keyItem.name,
                                    config_value:items[key],
                                    show_config_value:keyItem.keyValue && keyItem.keyValue[items[key]] || (keyItem && keyItem.default_value||'0'),
                                    default_value:keyItem.default_value||'0',
                                    description:(keyItem.name) + (keyItem.tip)
                                })
                            }
                        }
                        this.total = data.total||0;
                        console.log('arr',arr)
                        this.list = arr;
                    }
                    return res;
                })
            },
            save(){
                let data = this.list.map(item=>{
                    let keyValue = this.getKeyVal(item.config_key,'keyValue')
                    for(let key in keyValue){
                        if(keyValue[key] == item.show_config_value){
                            item.config_value = key;
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
                console.log('save',data)
                return this.$MainApi.basicSettingSave({
                    data:{
                        customer_id:this.pageQuery.customer_id||0,
                        data
                    }
                }).then(res=>{
                    this._reqMessage(res);
                    if(res.code){
                        this.$router.go(-1);
                    }
                    return res;
                })
            }

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
        font-size: 14px;
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