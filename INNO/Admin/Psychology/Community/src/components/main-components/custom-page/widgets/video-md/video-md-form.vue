<template>
    <div class="form-box article-md">
        <div class="form-title bold">视频模块组件</div>
        <mdForm type="video" :styleBox="styleBox" :dynamic_setting="dynamic_setting" :compInfo="compInfo" @styleSwitch="styleSwitch" @cardClick="cardClick" @addGroup="addGroup" @setDynamic="setDynamic"></mdForm>
    </div>
</template>

<script>
/**
 * 图片视频小工具
 */
import draggable from "vuedraggable";
import mdForm from "../../component/module/md-form.vue";

export default {
    name: "imageAdForm",
    components: {
        draggable,
        mdForm
    },
    props: {
        compInfo: {
            type: Object,
            default: ()=>{
                return {}
            },
        },
    },
    inheritAttrs: false,
    data() {
        return {
            dynamic_setting: {},
            module_data: {
                videosGroup: []
            },
            drag: false,
            styleBox:[
                {
                    type:"row",
                    row:1,
                    rowArr:new Array(1).fill({}),
                    desc:"一行一个",
                },
                {
                    type:"row",
                    row:2,
                    rowArr:new Array(2).fill({}),
                    desc:"一行二个",
                },
            ],
        };
    },
    computed: {
        dragOptions() {
            return {
                animation: 200,
                group: "description",
                disabled: false,
                ghostClass: "ghost",
            };
        },
    },
    methods: {
        // 初始化
        init() {
            this.dynamic_setting = this.compInfo.dynamic_setting;
            this.module_data = this.compInfo.module_data;
            console.log('初始化1 dynamic_setting + module_data',JSON.parse(JSON.stringify(this.compInfo)))
            if (!this.dynamic_setting.hasOwnProperty('type'))
                this.$set(this.dynamic_setting, "type", "row");
            if (!this.dynamic_setting.hasOwnProperty('row'))
                this.$set(this.dynamic_setting, "row", 1);
            if (!this.dynamic_setting.hasOwnProperty('showTitle'))
                this.$set(this.dynamic_setting, "showTitle", 1);
            if (!this.dynamic_setting.hasOwnProperty('showMsg'))
                this.$set(this.dynamic_setting, "showMsg", 1);
            if (!this.dynamic_setting.hasOwnProperty('currTab'))
                this.$set(this.dynamic_setting, "currTab", "tab0");
            if (!this.module_data.hasOwnProperty('videosGroup')) {
                this.$set(this.compInfo.module_data, "videosGroup", []);
            }
            console.log('初始化2 dynamic_setting + module_data',JSON.parse(JSON.stringify(this.compInfo)))
        },
        // 添加分组
        addGroup() {
            this.compInfo.module_data.videosGroup.push({
                name: "分组名",
                videos: [],
            });
        },
        // 移除分组
        removeGroup(index) {
            this.$Modal.confirm({
                title: "操作提示",
                content: "确定删除分组吗？",
                okText: "确定",
                cancelText: "取消",
                onOk: () => {
                    this.$delete(this.module_data.videosGroup, index);
                },
            });
        },
        // 指定视频图片列表的变动，回调
        onModsListChange(obj) {
            this.$set(this.module_data.videosGroup[obj.groupIndex], "videos", obj.data);
        },
        // card 点击事件
        cardClick(index) {
            this.dynamic_setting.currTab = "tab" + index;
        },
        styleSwitch(item){
            let type = item.type||"row";
            let row = item.row||1;
            this.$set(this.dynamic_setting, "row", row);
            this.$set(this.dynamic_setting, "type", type);
            console.log('styleSwitch',item,this.dynamic_setting)
        },
        setDynamic(key,value){
            console.log('on',key,value);
            this.dynamic_setting[key] = value;
        }
    },
    watch: {
        compInfo: {
            handler(nV) {
                this.init(nV);
            },
            deep: true,
            immediate: true,
        },
    },
    mounted() {
    },
};
</script>

<style lang="less" scoped>
.form-box {
    font-size: 13px;
    .mods-list-box {
        background-color: #efefef;
        padding: 8px 5px 5px 5px;
        border-radius: 5px;

        .ivu-form-item {
            margin-bottom: 5px;
        }
        .add-group-area {
            position: sticky;
            left: 0px;
            bottom: 0px;
            text-align: center;
            width: 100%;
            padding: 0px 10px;
            // background-color:#fff;
            .ivu-btn {
                box-shadow: 0 0 10px #999;
            }
        }
    }
    .group-item-list {
        // border-radius: 5px;
        // margin-bottom: 12px;
        position: relative;
        padding: 0px;
        // background: #fff;
        // font-size: 12px;
        .close {
            position: absolute;
            right: -10px;
            top: -10px;
            font-size: 10px;
            cursor: pointer;
            z-index: 1;
            display: none;
            color: red;
            font-size: 22px;
        }
        .handle_group {
            position: absolute;
            right: 25px;
            top: -10px;
            font-size: 10px;
            cursor: move;
            display: none;
            color: #2d8cf0;
            font-size: 22px;
        }
        &:hover {
            .close,
            .handle_group {
                display: block;
            }
        }
    }
    .ghost {
        opacity: 0.5;
    } 
    .form-title{
        background: #f8f8f8;
        padding: 10px 16px;
        border-radius: 4px;
        margin-bottom: 20px;
    }
    .content-box{
        background: rgba(239, 239, 239, 0.17);
        padding: 16px;
        border-radius: 4px;
        margin-bottom: 20px;
    }
    .content-title{
        margin-bottom: 10px;
        font-size: 13px;
    }
    .style-box{
        // padding-top: 10px;
    }
    .content{
        width: 30%;
        text-align: center;
    }
    .row-1{
        margin-right: 0;
    }
    .row-2{
        margin-right: 10px;
    }
    .row-3{
        margin-right: 5%;
        &:last-child{
            margin-right: 0;
        }
    }
    .style{
        min-height: 52px;
        padding:0 8px;
        border-radius: 4px;
        &.active{
            background: #EFFAFF;
            border: 1px solid #95DDFF;
        }
    }
    .row-item{
        width: 85%;
        margin-right: 2px;
        &:last-child{
            margin-right: 0;
        }
    }
    .main-item{
        width: 100%;
        background: #008ACB;
        opacity: 0.69;
        height: 14px;
         
    }
    .tips-item{
        width: 50%;
        margin-top: 2px;
        background: #008ACB;
        opacity: 0.26;
        height: 3px;
    }
    .type-list{
        .style{
            flex-direction: column;
        }
        .row-item{
            display: flex;
            align-items: center;
            margin-right: 0;
            margin-bottom: 3px;
            width: auto;
            &:last-child{
                margin-bottom: 0;
            }
        }
        .main-item{
            width: 10px;
            height: 9px;
            margin-right: 4px;
        }
        .tips-item{
            width: 10px;
            height: 3px;
            margin-bottom: 3px;
            margin-top: 0; 
            &:first-child{
                width: 19px;
            }
            &:last-child{
                margin-bottom: 0;
            }
        }
    }

}
</style>
