<template>
    <div class="editor-main">
        <div class="main-content" :class="[fullType]">
            <div class="content-left">
                <div class="content-view">
                    <editor-left-menu :pageType="pageType"></editor-left-menu>
                </div>
            </div>
            <div class="content-middle">
                <div class="content-view" style="padding-right:30px;">
                    <editor-body @bodyTouch="bodyTouchHandle" :commonInfo="commonInfo" :compList="compList" :pageInfo="pageInfo" :pageType="pageType"></editor-body>
                </div>
                <Spin fix v-if="editorBodySpin"></Spin>
            </div>
            <div class="content-right">
                <div class="content-view">
                    <editor-right-side ref="editorRightSideRef" :commonInfo="commonInfo" :compList="compList" :pageInfo="pageInfo" :canWeixin="canWeixin" :catList="catList" :pageType="pageType"></editor-right-side>
                </div>
            </div>
        </div>
        <div class="main-footer" v-if="isShowSave">
            <Button @click="back" v-if="!hideBack">取消</Button>&nbsp;&nbsp;
            <Button type="primary" @click="save" v-hasAction="'personal_center_save'">保存</Button>
        </div>
    </div>
</template>

<script>
/**
 * 站点页面编辑器，主框架
 */
import editorLeftMenu from "./editor-left-menu";
import editorRightSide from "./editor-right-side";
import editorBody from "./editor-body";

export default {
    name: "editorMain",
    components: {
        // editorHeader,
        editorLeftMenu,
        editorRightSide,
        editorBody,
    },
    props: {
        showHeader: {
            type: Boolean,
            default: true,
        },
        // 自定义页面的类型
        pageType: {
            type: String,
            default: "NONE",
        },
        hideBack:{
            type: Boolean,
            default: false
        },
        isShowSave:{
            type: Boolean,
            default: true
        },
        fullType:{
            type: String,
            default: "",
        },
    },
    data() {
        return {
            pageId: 0,
            editorBodySpin: true,
            compList: [],
            pageInfo: {},
            catList: [],
            canWeixin: false,
            commonInfo:{
                curIndex:-1
            }
        };
    },
    computed: {},
    methods: {
        initData(data) {
            /**
             * pageInfo : setting(页面配置)  layout_type(MINE 个人中心， NONE 普通自定义页面)
             *  get_module: setting(模块静态配置)， dynamic_setting(模块动态配置)， module_data(模块数据)
             */
            this.editorBodySpin = false;
            let pageInfo = JSON.parse(JSON.stringify(data || {}));
            pageInfo.setting || (pageInfo.setting = {});
            this.settingInit(pageInfo);  
            pageInfo.get_module = pageInfo.get_module || [];
            let get_module = pageInfo.get_module;
            delete pageInfo.get_module;
            this.canWeixin = data.canWeixin || true;
            this.pageInfo = pageInfo;
            get_module.map((item) => {
                item.setting = initJson(item.setting);
                item.dynamic_setting = initJson(item.dynamic_setting);
                item.module_data = initJson(item.module_data);
            });
            if (!this.pageInfo.layout_type) {
                this.pageInfo.pageType = this.pageType;
                this.pageInfo.layout_type = this.pageType;
            }
            this.compList = get_module;
        },
        settingInit(pageInfo={}){
            try {
                pageInfo.setting =
                    typeof pageInfo.setting == "string"
                        ? JSON.parse(pageInfo.setting)
                        : pageInfo.setting || {};
            } catch (error) {
                pageInfo.setting = {};
            }
            pageInfo.setting.backgroundColor = pageInfo.setting.backgroundColor || "";
            pageInfo.setting.backgroundImage = pageInfo.setting.backgroundImage || "";
            pageInfo.setting.backgroundPosition = pageInfo.setting.backgroundPosition || "";
            !pageInfo.setting.hasOwnProperty('isShowNav') && (pageInfo.setting.isShowNav = true);
        },
        save() {
            return new Promise((rs,rj)=>{
                let compPageInfo = JSON.parse(JSON.stringify(this.pageInfo))
                let pageCompList = JSON.parse(JSON.stringify(this.compList))
                compPageInfo.setting = JSON.stringify(compPageInfo.setting);
                pageCompList.map((item, index) => {
                    item.sort = index + 1;
                    item.setting = JSON.stringify(item.setting) || "{}";
                    item.dynamic_setting =
                        JSON.stringify(item.dynamic_setting) || "{}";
                    item.module_data = JSON.stringify(item.module_data) || "{}";
                });
                if(this.pageType != 'REPORT' && !compPageInfo.layout_name){
                    this.$refs["editorRightSideRef"] && this.$refs["editorRightSideRef"].currentTab("PAGE", { isCheck: true });
                    this.$Message.warning("请填写页面名称")
                    return rj();
                }
                this.$emit("on-save", { compPageInfo, pageCompList });
                console.log('pageInfo', JSON.parse(JSON.stringify(compPageInfo)))
                console.log('compList', JSON.parse(JSON.stringify(pageCompList)))
                return rs({ compPageInfo, pageCompList });
            })
        },
        bodyTouchHandle(){
            this.$refs["editorRightSideRef"] && this.$refs["editorRightSideRef"].currentTab("CURR_COMPONENT")
        },
        back(){
            this.$router.go(-1);
        }
    },
    watch: {},
    mounted() {},
    beforeDestroy() {},
};
function initJson(data) {
    if (typeof data == "string" && data) {
        try {
            data = JSON.parse(data) || {};
        } catch (error) {
            data = {};
        }
    } else {
        data = data || {};
    }
    return data;
}
</script>

<style lang="less" scoped>
.editor-main {
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    .main-header {
        width: 100%;
    }
    .main-content {
        flex: 1;
        height: 100%;
        display: flex;
        justify-content: flex-start;
        align-items: stretch; 
        box-sizing: border-box;
    }
    .content-left {
        // width: 180px;
        width: 250px;
        flex-shrink: 0;
    }
    .content-middle { 
        width:562px;
        flex-shrink: 0;
    }
    .content-right {
        width: 360px;
        flex-shrink: 0; 
        box-shadow: 0 0 10px 1px rgba(0,0,0,0.06);
    }
    .left .content-left,.middle .content-middle,.right .content-right{
        flex:0.8;
    }
    .right .content-right{
        flex:unset;
        width: 430px;
    } 
    .content-left,
    .content-middle,
    .content-right {
        display: block;
        position: relative;
    }
    .content-view {
        position: absolute;
        top: 0px;
        left: 0px;
        width: 100%;
        height: 100%;
    }
    .main-footer {
        width:695px;
        text-align:center;
        padding-left: 280px;
        padding-top:10px;
    }
}
</style>
