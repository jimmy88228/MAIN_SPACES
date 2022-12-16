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
                                <span slot="open"></span>
                                <span slot="close"></span>
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
    import LM from "@/helper/manager/login-manager";
    export default {
        name:"baseConfig",
        data() {
            return {
                list: [],
                keyList:{ //定义key value
                    applet_login_type:{
                        name:"是否使用账号密码登录",
                        keyValue:{
                            'student':'0',
                            'password':'1',
                        },
                        type:"switch",
                        description: "小程序登录方式，password：账号密码；student：学生资料"
                    },
                    confirm_bind_student:{
                        name:"学生登录是否需要管理员验证",
                        keyValue:{
                            '0':'0',
                            '1':'1',
                        },
                        type:"switch",
                        description: "绑定【我是学生】是否需要家长确认"
                    },
                    school_logo:{
                        name:"学校LOGO",
                        keyValue:{},
                        type:"upload",
                        description: "尺寸建议600*600"
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
                return this.$MainApi.basicSettingList({
                    data:{}
                }).then(res=>{
                    if(res.code){
                        let data = res.data||[];
                        let arr = data;
                        arr = arr.map(item=>{ //学校版只做读取,为空的时候不主动初始化数据
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
                let school_logo = "";
                let data = this.list.map(item=>{
                    let k_item = this.keyList[item.config_key]||{};
                    if(k_item.type == 'switch'){
                        for(let key in k_item.keyValue){
                            if(k_item.keyValue[key] == item.show_config_value){
                                item.config_value = key;
                            }
                        }
                    }
                    if(item.config_key == 'school_logo'){
                        school_logo = item.config_value || "";
                    }
                    return {
                        config_key:item.config_key,
                        config_name:item.config_name,
                        config_value:item.config_value,
                        default_value:item.default_value,
                        // default_value:item.type == 'upload' ? '' : item.default_value,
                        description:item.description,
                    }
                })
                console.log('basicSettingSave',data)
                return this.$MainApi.basicSettingSave({
                    data:{
                        data
                    },
                    other: {
                        isShowLoad: true,
                        hideLoadTime: 500
                    }
                }).then(res=>{
                    
                    let userInfos = LM.userInfos || {};
                    userInfos.admin_data && school_logo && (userInfos.admin_data.logo = school_logo);
                    LM.setUserInfos(userInfos);
                    // school_logo && (LM.userInfos.admin_data.logo = school_logo);
                    this._reqMessage(res);
                    return res;
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