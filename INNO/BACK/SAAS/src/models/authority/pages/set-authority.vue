<template>
    <page-top isSave @save="submitAuthEvent" :topTitle="'编辑角色:' + roleName">
        <div class="authority-page" >
            <div>
                <Menu mode="horizontal" class="authority-menu" @on-select="selectMenus" :active-name="activeName">
                    <div class="menu-items" v-for="(mItem, mIndex) in menus" :key="mIndex">
                        <MenuItem :name="mItem.hashKey">{{ mItem.title }}</MenuItem>
                    </div>
                </Menu>
                <div class="select-view" v-if="activeName && roleAuthJson[activeName]">
                    <div class="flex ">
                        <div class="view-items items-title f-shrink0">
                            <div class="items-name flex f-just-between">
                                <Checkbox 
                                v-model="roleAuthJson[activeName].enable" 
                                :true-value="1" 
                                :false-value="0" 
                                :label="roleAuthJson[activeName].authCode"
                                @on-change="changeAuth(roleAuthJson[activeName], oldRoleAuthJson[activeName])"
                                >
                                    <span>{{roleAuthJson[activeName].authName}}</span>
                                </Checkbox>
                                <Icon type="ios-arrow-up" />
                            </div>
                        </div>
                        <div class="view-items">
                            <div v-for="(mItem, mIndex) in roleAuthJson[activeName].list" :key="mIndex">
                                <template v-if="mItem.list && mItem.list.length > 0">
                                    <div class="func-title" v-if="mItem.authType != 'BUTTON'">
                                        <Checkbox 
                                        v-model="mItem.enable" 
                                        :true-value="1" 
                                        :false-value="0" 
                                        :label="mItem.authCode" 
                                        @on-change="changeAuth(mItem, oldRoleAuthJson[activeName].list[mIndex])"
                                        >{{ mItem.authName }}</Checkbox>
                                    </div>
                                    <div class="func-points">
                                        <Col class="func-point" span="6" v-for="(bItem, bIndex) in mItem.list" :key="bIndex">
                                            <Checkbox 
                                            v-model="bItem.enable" 
                                            :true-value="1" 
                                            :false-value="0" 
                                            :label="bItem.authCode" 
                                            @on-change="changeAuth(bItem, oldRoleAuthJson[activeName].list[mIndex].list[bIndex])"
                                            >{{ bItem.authName }}</Checkbox>
                                        </Col>
                                    </div>
                                </template>
                                <template v-else>
                                    <Col class="func-point" span="6">
                                        <Checkbox 
                                        v-model="mItem.enable" 
                                        :true-value="1" 
                                        :false-value="0" 
                                        :label="mItem.authCode"
                                        @on-change="changeAuth(mItem, oldRoleAuthJson[activeName].list[mIndex])"
                                        >{{ mItem.authName }}</Checkbox>
                                    </Col>
                                </template>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </page-top>
</template>
<script>
    import Modules from "@/models/model-config";
    import StringHelper from "@/helper/utils/string-util";
    import { MainApi } from "@/helper/manager/http-manager";
    import pageTop from "@/components/page-top-base/index";
    import { menuKeyAuth } from "@/config/menu-auth-key.js"; 
    export default{
        name: "setAuthority",
        components:{ pageTop },
        data(){
            return {
               menus: [],
               funcPoints: {},
               roleAuth: [],
               roleAuthJson:{},
               oldRoleAuthJson: {},
               submitAuth:[],
               activeName: "menu_user"
            }
        },
        mounted(){
            this.initMenus();
            this.initParams();
            this.getAuthority();
        },
        methods:{
            initParams(){
                let query = this.$route.query || {};
                this.roleId = query.roleId || 0;
                this.roleName = query.roleName || "";
            },
            initMenus(){
                let menus = Modules.menus || [];
                let currentKey = "";
                for(let i = 0; i < menus.length; i++){
                    let item = menus[i];
                    item.hashKey = menuKeyAuth[item.name] || item.name
                }
                this.menus = menus;
                console.log("Modules",Modules);
            },
            getAuthority(){
                this.loading = true;
                return MainApi.getAdminRoleAuthList({
                    params:{
                        roleId: this.roleId
                    }
                })
                .then(res => {
                    if (res.code === "1") {
                        console.log("权限",res);
                        this.initAuthority((res.data && res.data.list) || {});
                    } else {
                        return Promise.reject(res.msg);
                    }
                })
                .catch(msg => {
                    if (StringHelper.trim(msg)) {
                        this.$Message.error(msg || "数据加载失败");
                    }
                })
                .finally(() => {
                    this.loading = false;
                });
            },
            initAuthority(authList = []){
                this.roleAuth = authList;
                let roleAuthJson = {};
                for(let i = 0; i < authList.length; i++){
                    let authCode = authList[i].authCode;
                    roleAuthJson[authCode] = authList[i];
                }
                this.roleAuthJson = roleAuthJson || {};
                //保存旧的值,做对比
                this.oldRoleAuthJson = JSON.parse(JSON.stringify(roleAuthJson)) || {}
                console.log('roleAuthJson',this.roleAuthJson)
                console.log('oldRoleAuthJson',this.oldRoleAuthJson)
            },
            selectMenus(data){
                console.log("selectMenu", data)
                if(data){
                    this.activeName = data || "";
                }
            },
            //保存用户操作
            changeAuth(item, oItem){
                console.log("item", item);
                console.log("oItem", oItem);
                //一致不保存
                if(!item || !item.authId || !oItem.authId) return;
                let hasKey = -1;
                for(let i = 0; i < this.submitAuth.length; i++){
                    if(this.submitAuth[i].authId == item.authId){
                        hasKey = i;
                        break;
                    }
                }
                if(hasKey != -1){
                   if(item.enable == oItem.enable){
                       this.submitAuth.splice(hasKey, 1);
                   } else {
                       this.submitAuth[hasKey].enable = item.enable;
                   }
                } else {
                    if(item.enable != oItem.enable){
                       this.submitAuth.push({
                            authId: item.authId,
                            authCode: item.authCode,
                            enable: item.enable
                        })
                    }
                }
            },
            submitAuthEvent(){
                if(this.submitAuth.length == 0) return;
                this.loading = true;
                return MainApi.updateAdminRoleAuth({
                    data:{
                        roleId: this.roleId,
                        authList: this.submitAuth
                    }
                })
                .then(res => {
                    if (res.code) {
                        this.$Message.info("编辑成功");
                        this.$router.go(-1);
                    } else {
                        return Promise.reject(res.msg);
                    }
                })
                .catch(msg => {
                    if (StringHelper.trim(msg)) {
                        this.$Message.error(msg || "数据加载失败");
                    }
                })
                .finally(() => {
                    this.loading = false;
                });
            }
        }

    }
</script>
<style lang="less">
    .authority-page{
       .authority-menu{
           padding-left:20px;
           .ivu-menu{
           }
       }
       .ivu-menu-horizontal{
           line-height:40px;
           .menu-items{
               .ivu-menu-item-active{
                    color: #2d8cf0;
                    border-bottom: 2px solid #2d8cf0 !important;
                }
                .ivu-menu-item{
                    font-size:16px;
                }
           }
            
        }
        .select-view{
            // margin:20px;
            // margin-top:30px;
            // min-height:300px;
            // padding:20px;
            // padding-top:30px;
            background-color:#efefef;
            .view-items{
                width:100%;
                min-height:300px;
                // padding-left:10px;
                .func-title{
                    padding:15px;
                    padding-left:20px;
                    background-color:#f9f9f9;
                }
                .func-points{
                    padding-left:20px;
                    overflow:hidden;
                }
                .func-point{
                    padding:15px;
                    padding-right:0px;
                    .ivu-checkbox-border{
                        // background-color:#fff;
                    }
                }
                
            }
            .items-title{
                width:auto;
                background-color:#353D4E;
                padding-left:0px;
                .items-name{
                    width: 200px;
                    padding:15px;
                    padding-left:20px;
                    color:#fff;
                    position:relative;
                    background-color:#50596D;
                }
            }
        }
    }
</style>