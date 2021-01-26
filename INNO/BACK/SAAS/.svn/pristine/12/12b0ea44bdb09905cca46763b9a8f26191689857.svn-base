<template>
    <page-top isSave @save="saveLabelEvent" :isHead="false">
        <div class="authority-page" >
            <div>
                <Menu mode="horizontal" class="authority-menu" @on-select="selectMenus" active-name="User">
                    <div class="menu-items" v-for="(mItem, mIndex) in menus" :key="mIndex">
                        <MenuItem :name="mItem.name">{{ mItem.title }}</MenuItem>
                    </div>
                </Menu>
                <div class="select-view" v-if="menusSubView.name">
                    <!-- <Divider orientation="left">权限视图</Divider> -->
                    <div class="view-items items-title flex">
                        <div  class="items-name flex f-just-between f-shrink0">
                            <span>{{menusSubView.title}}</span>
                            <Icon type="ios-arrow-up" />
                        </div>
                        <div v-if="!menusSubView.childs" class="func-points">
                            <Col class="func-point" span="6" v-for="(fItem, fIndex) in funcPoints[menusSubView.name]" :key="fIndex">
                                <Checkbox v-model="fItem.value" :label="fItem.key">{{ fItem.name }}</Checkbox>
                            </Col>
                        </div>
                    </div>
                    <div>
                        <div class="view-items flex" v-for="(mItem, mIndex) in menusSubView.childs" :key="mIndex">
                            <div class="items-name flex f-shrink0">{{mItem.title}}</div>
                            <div class="func-points">
                                <Col class="func-point" span="8" v-for="(fItem, fIndex) in funcPoints[mItem.name]" :key="fIndex">
                                    <Checkbox v-model="fItem.value" :label="fItem.key">{{ fItem.name }}</Checkbox>
                                </Col>
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
    import pageTop from "@/components/page-top-base/index";
    export default{
        name: "setAuthority",
        components:{ pageTop },
        data(){
            return {
               menus: [],
               menusMap: {},
               menusSubView: {},
               funcPoints: {},
            }
        },
        mounted(){
            console.log("Modules",Modules);
            this.initMenus();
            this.initParams();
        },
        methods:{
            initParams(){
                let query = this.$route.query || {};
                this.editId = query.id || 0;
            },
            initMenus(){
                let menus = Modules.menus || [];
                this.menus = menus;
                this.menusMap = Modules.menusMap || {}
                this.menusSubView = this.menusMap["User"];
                this.initAuthority(this.menusMap);
            },
            initAuthority(menusMap){
                let funcPoints = this.funcPoints || {}; 
                for(let i in menusMap){
                    switch(i+""){
                        case"User":
                            funcPoints[i] = [
                                {key: "check-user", value: true, name: "查看用户权限"}
                            ]
                            break;
                        case"CustomLayout":
                            funcPoints[i] = [
                                {key: "add-layout", value: true, name: "添加布局"},
                                {key: "edit-layout", value: true, name: "编辑布局"},
                                {key: "remove-layout", value: true, name: "删除布局"},
                                {key: "add-module", value: true, name: "添加模块"},
                                {key: "edit-module", value: true, name: "编辑模块"},
                                {key: "remove-module", value: true, name: "删除模块"},
                            ]
                            break;
                        case"Article":
                            funcPoints[i] = [
                                {key: "add-article", value: true, name: "新增文章"},
                                {key: "edit-article", value: true, name: "编辑文章"},
                                {key: "remove-article", value: true, name: "删除文章"},
                                {key: "copy-article-url", value: true, name: "复制文章地址"},
                            ]
                            break;
                        case"ActivityLottery":
                            funcPoints[i] = [
                                {key: "add-activity-lottery", value: true, name: "创建活动"},
                                {key: "edit-activity-lottery", value: true, name: "编辑活动"},
                                {key: "remove-activity-lottery", value: true, name: "删除活动"},
                                {key: "active-prize-push", value: true, name: "推送结果"},
                                {key: "set-activty-prize", value: true, name: "设置活动开奖"},
                                {key: "check-activity-rule", value: true, name: "查看开奖设置"},
                                {key: "add-activity-rule", value: true, name: "新增开奖设置"},
                                {key: "edit-activity-rule", value: true, name: "编辑开奖设置"},
                                {key: "check-random-list", value: true, name: "查看随机生成名单"},
                                {key: "set-random-prize", value: true, name: "设置随机中奖名单"},
                                {key: "import-random-list", value: true, name: "导入随机中奖名单"},
                                {key: "clear-random-prize", value: true, name: "清除随机中奖名单"},
                                {key: "check-screen-list", value: true, name: "查看筛选用户"},
                                {key: "export-screen-list", value: true, name: "导出筛选用户"},
                                {key: "set-screen-prize", value: true, name: "设置筛选中奖用户"},
                                {key: "check-prize-list", value: true, name: "查看开奖名单"},
                                {key: "export-prize-list", value: true, name: "导出开奖名单"},
                                {key: "check-enroll-list", value: true, name: "查看报名列表"},
                                {key: "export-enroll-list", value: true, name: "导出报名列表"}
                            ]
                            break;
                        case"ChosenOne":
                            funcPoints[i] = [
                                {key: "add-chosen-on", value: true, name: "创建天选之子活动"},
                                {key: "edit-chosen-one", value: true, name: "编辑天选之子活动"},
                                {key: "remove-chosen-one", value: true, name: "删除天选之子活动"},
                                {key: "check-chosen-one-user", value: true, name: "查看天选之子名单"},
                                {key: "remove-chosen-one-user", value: true, name: "移除天选之子名单"},
                                {key: "import-chosen-one-user", value: true, name: "导入天选之子名单"}
                            ]
                            break;
                        case"Admins":
                            funcPoints[i] = [
                                {key: "check-admins-list", value: true, name: "查看账号管理"},
                                {key: "add-admins-user", value: true, name: "新建管理账号"},
                                {key: "edit-admins-user", value: true, name: "编辑管理账号"},
                                {key: "remove-admins-user", value: true, name: "删除管理账号"},
                                {key: "on-off-admins-user", value: true, name: "关闭开启账号"},
                            ]
                            break;
                        case"Authority":
                            break;

                    }
                }
                this.funcPoints = funcPoints;
            },
            selectMenus(data){
                if(data){
                    this.menusSubView = this.menusMap[data];
                }
                
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
            min-height:300px;
            // padding:20px;
            // padding-top:30px;
            background-color:#efefef;
            .view-items{
                .items-name{
                    width: 200px;
                    padding:15px;
                    padding-left:20px;
                    background-color:#353D4E;
                    color:#fff;
                    position:relative;
                }
                // .items-name:after{
                //     content:"";
                //     position:absolute;
                //     left:50%;
                //     bottom:-1px;
                //     transform:translate(-50%, 0px) scale(0.5);
                //     width:80%;
                //     height:1px;
                //     background-color:#fff;
                //     z-index: 2;
                // }
                .func-points{
                    width: 100%;
                    .func-point{
                        padding:15px;
                        padding-right:0px;
                    }
                }
                
            }
            .items-title{
                .items-name{
                    background-color:#50596D;
                }
            }
        }
    }
</style>