<template>
    <div>
        <Modal v-model="isShowApplet" class="hold-modal-zindex" @on-visible-change="onVisibleChange" :width="400" class-name="link-view-modal">
            <div slot="header" class="model-header">
                <Icon type="ios-help-circle" color="#2F8CEE" size="20" />&nbsp;{{modalTitle}}
            </div>
            <div v-show="appletList.length != 1">
                <Select v-model="appletInfo.id" @on-change="changeApplet" >
                    <Option v-for="(item, index) in appletList" :value="item.id" :key="item.id">{{item.app_name}}</Option>
                </Select>
            </div>
            <div class="link-list">
                <div class="link-list-tabs">
                    <div class="link-list-tab" @click="changeTab(index)" :class="{ 'is-selected':  index == currIndex}" v-for="(item, index) in linkData" :key="index">{{item.title}}</div>
                </div>
                <div class="link-list-views">
                    <div v-show="currIndex == index" v-for="(item, index) in linkData" :key="index">
                        <div class="p-b-15 p-t-15 w-break">{{appletInfo.id ? viewPath(item) : ''}}</div>
                        <div class="copy-btn" :class="{ 'ivalided-btn': !appletInfo.id}" @click="copyText(viewPath(item))">{{appletInfo.id ? '一键复制': '请选择平台'}}</div>
                    </div>
                </div>
            </div>
            <!-- <div slot="footer"> -->
                <!-- <Button @click="isShowApplet = false" type="primary"> 确定 </Button> -->
            <!-- </div> -->
            <!-- <div slot="footer" class="text-l" v-if="appletInfo.id">
                <div class="m-t-5">链接：</div>
                <div class="flex p-t-10 p-b-15">
                    <p class="w-break">{{viewPath}}</p>
                    <a class="f-shrink0 inline-b p-l-5" @click="copyText(viewPath)">复制</a>
                </div>
            </div> -->
        </Modal>
    </div>
</template>
<script>
export default {
    components: {  },
    props: {
        title: {
            type: String,
            default() {
                return "选择链接平台";
            },
        },
    },
    data() {
        return {
            isShowApplet: false,
            appletList: [],
            appletInfo: {
                id: 0,
            },
            currIndex: 0,
            linkData: []
        };
    },
    computed: {
        modalTitle(){
            if(this.appletList && this.appletList.length == 1){
                return "复制链接"
            } else {
                return this.title
            }
        }
    },
    methods: {
        viewPath(item) {
            let path = item.path || "";
            let params = item.params || {};
            let appletInfo = this.appletInfo || {};
            let pathParams = "";
            let appCodeStr = appletInfo.app_code ? 'appCode=' + appletInfo.app_code : '';
            for (let i in params) {
                pathParams = pathParams
                    ? pathParams + "&" + i + "=" + params[i]
                    : "?" + i + "=" + params[i];
            }
            path = path + pathParams;
            path += path.indexOf("?") != -1 ? '&' + appCodeStr : '?' + appCodeStr
            return path;
        },
        showModal({ linkData = [], listParams = {} } ) {
            this.linkData = linkData || [];
            this.listParams = listParams || {}
            this.getAppletData();
        },
        getAppletData(){
            return this.$MainApi
                .getAppletList({
                   data: this.listParams instanceof Object ? this.listParams : {}
                }).then((res)=>{
                    if(res.code){
                        let data = res.data || {};
                        let items = data.items || [];
                        this.appletList = items;
                        if(items.length > 0){
                            if(items.length == 1){
                                this.changeApplet(items[0].id);
                            }
                            this.goShowApplet();
                        } else {
                           this.$Message.warning("暂无可用小程序"); 
                        }
                    } else {
                        this.$Message.warning(res.message);
                    }
                })
        },
        changeApplet(value){
            if(!value){
                this.appletInfo = { id: 0 }
                return;
            }
            let appletList = this.appletList || [];
            for(let i = 0; i < appletList.length; i++){
                let item = appletList[i] || {};
                if(item.id == value){
                    this.$set(this, 'appletInfo', { ...this.appletInfo, ...item })
                    break;
                }
            }
        },
        changeTab(index){
            this.currIndex = index;
        },
        goShowApplet() {
            this.isShowCode = false;
            this.isShowApplet = true;
        },
        copyText(text) {
            if(!this.appletInfo.id) { return; }
            this.$utils.copyText(text);
        },
        onVisibleChange(bool){
            if(!bool && !this.isShowApplet){
                this.$emit('destroy');
            }
        },
    },
};
</script>
<style lang="less">
.link-view-modal {
    .model-header {
        font-size: 16px;
    }
    .ivu-modal-body {
        // padding-top: 0px;
        // padding-bottom: 0px;
    }
    .ivu-modal-footer{
        display: none;
    }
    .link-list{
        .link-list-tabs{
            font-size: 13px;
            font-family: PingFangSC-Semibold, PingFang SC;
            font-weight: 600;
            line-height: 18px;
            height: 64px;
            display: flex;
            align-items: center;
            margin-bottom: 15px;
            border-bottom: 1px solid #efefef;
        }
        .link-list-tab{
            flex: 1;
            padding: 5px;
            text-align: center;
            cursor: pointer;
        }
        .link-list-tab.is-selected{
            color: #0083CE;
        }
        .link-list-views{
            background-color:#F4F4F4;
            padding: 15px;
        }
        .copy-btn{
            height: 44px;
            background: #FFFFFF;
            border-radius: 4px;
            font-size: 14px;
            font-family: PingFangSC-Regular, PingFang SC;
            font-weight: 400;
            color: #0083CE;
            display: flex;
            align-items: center;
            justify-content: center;
            cursor: pointer;
        }
        .ivalided-btn{
            color:#7f7f7f;
        }
    }
}
.applet-code-modal {
    .ivu-modal-close {
        display: none;
    }
    .model-header {
        cursor: pointer;
        font-size: 16px;
    }
    
    // .code-view-cont {
    //     width: 100%;
    //     .ivu-tabs-nav {
    //         width: 100%;
    //         text-align: center;
    //         .ivu-tabs-tab {
    //             width: 50%;
    //             box-sizing: border-box;
    //             margin: 0px;
    //         }
    //     }
    //     .img-view {
    //         width: 288px;
    //         padding: 20px 10px;
    //         border-radius: 10px;
    //         overflow: hidden;
    //         background-color: #fff;
    //     }
    //     .code-view {
    //         text-align: center;
    //         width: 200px;
    //         min-height: 200px;
    //         margin: 25px auto;
    //     }
    //     .code-url-view {
    //         width: 100%;
    //         height: 100%;
    //         padding-bottom: 35px;
    //     }
    //     .copy-btn {
    //         position: absolute;
    //         left: 0px;
    //         bottom: 0px;
    //     }
    //     .code-tip {
    //         text-align: center;
    //         font-size: 21px;
    //         .big-tip {
    //             font-family: PingFangSC-Regular, PingFang SC;
    //             font-weight: 400;
    //             line-height: 30px;
    //             margin-bottom: 10px;
    //         }
    //         .tip {
    //             font-family: PingFangSC-Regular, PingFang SC;
    //             font-weight: 400;
    //             color: #222222;
    //             line-height: 16px;
    //             font-size: 12px !important;
    //         }
    //     }
    //     .code-appname-tip{
    //         font-size: 14px;
    //         color: #222222;
    //     }
    // }
}
</style>