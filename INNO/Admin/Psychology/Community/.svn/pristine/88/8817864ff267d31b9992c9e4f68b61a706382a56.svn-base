<template>
    <div class="form-item-box">
        <draggable ghost-class="ghost" :list="curList" :group="{name:'imageList'}" handle=".handle_ad" v-bind="dragOptions" @start="dragStart" @end="dragEnd">
            <div v-for="(item,index) in curList" :name="index" :key="index" class="group-item">
                <Icon type="md-apps" class="handle_ad" title="拖拽排序" />
                <div class="title-box ">
                    <div class="flex-s-c m-b-10">
                        <Icon v-if="type!='broadcast'" type="md-copy" style="font-size:18px;"/>
                        <!-- <Icon type="md-copy" style="font-size:18px;" @click="copy(item.title)"/> -->
                        <div class="title">{{item.title}}{{type=='broadcast'? index+1 :''}}</div>
                        <a v-if="type == 'broadcast'" class="go-top f-shrink-0 pointer m-r-10" @click="goTop(index)">置顶</a>
                        <div class="delete f-shrink-0 pointer" @click="removeImg(index)">删除</div>
                    </div>
                    <template v-if="type == 'broadcast'">
                        <custom-input :rows="6" :maxlength="300" showWordLimit class="base-textarea" v-model="item.value" type="textarea" placeholder="输入标题"></custom-input>
                    </template>
                    <div class="m-t-10 link-box flex-b-c" >
                        <navLink boxStyle="width:100%;" size="default"  :itemInfo="item" :pageInfo="pageInfo"></navLink>
                    </div>
                </div>
                <template v-if="type != 'broadcast'">
                    <div class="item-box">
                        <div class="img-cover-box flex-c-c" :class="{'init':!!!item.cover,['init_'+type]:true}">
                            <img v-if="item.cover" class="img-cover" :src="item.cover" alt="">
                            <img v-else-if="keyInfo[type].img" class="img-type" :src="keyInfo[type].img">
                        </div>
                    </div>
                    <div class="set-cover">
                        <a @click="setCover(index)">设置封面</a>
                    </div>
                </template>
            </div>
        </draggable>

        <Button @click="selectContent" class="btn-box">
            <Icon type="md-add" size="18" class="m-r-5"></Icon>
            <span>添加{{curName}}</span>
        </Button>
    </div>
</template>

<script>
import draggable from "vuedraggable";
import navLink from "../nav-link/nav-link";
import confMixin from "./conf.js"
// import linkItem from "../../component/link-item/link-item";
// import linkTo from "@/views/my-components/link-to/link-to";
export default {
    name: "mdFormItem",
    mixins:[confMixin],
    components: {
        navLink,
        draggable,
        // linkTo,
        // imageHotmapForm,
        // videoPlayer,
        // imageEdit,
    },
    props: {
        type:{
          type:String,
          value:""
        },
        currIndex: {
            type: [Number, String],
            default: 0,
        },
        groupItem: {
            type: Object,
            default: {
                // audios: [],
            },
        },
        groupIndex: {
            type: [Number, String],
            default: 0,
        },
        
        pageInfo: {
            type: Object,
            default:() => {
                return {}
            }
        }
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
        curList() {
            let groupItem = this.groupItem || {};
            let curList = groupItem[this.curItemKey] || []; 
            return curList;
        },
        curName(){
          return this.keyInfo[this.type] && this.keyInfo[this.type].name || ""
        },
        curItemKey(){
            return this.keyInfo[this.type] && this.keyInfo[this.type].groupItemKey || ""
        },
        // curParamsType(){
        //     return this.keyInfo[this.type] && this.keyInfo[this.type].paramsType || 0
        // },
    },
    data() {
        return {
            panelVal: "1",
            drag: false,

            modalPlayShow: false,
            modalPlayLoading: false, 
        };
    }, 
    methods: {
        // 移除音频
        removeImg(index) {
            this.$Modal.confirm({
                title: "操作提示",
                content: `确定移除该${this.curName}吗？`,
                okText: "确定",
                cancelText: "取消",
                onOk: () => {
                    this.$delete(this.groupItem[this.curItemKey], index);
                },
            });
        }, 
        clearImg(index) {
            this.$set(this.groupItem[this.curItemKey][index], "cover", "");
        },
        // 选择音频
        selectContent() {
            if(this.type == 'broadcast'){
                let arr = [].concat(this.curList);
                arr.push({
                    title:`广播`,
                    value:""
                })
                console.log('broadcast',arr)
                this.$set(this.groupItem,this.curItemKey, arr);
            }else{
                let strucId = Number(this.pageQuery.strucId||0),
                    extraParams = { structure_id:strucId == 0 ? [0]:[0,strucId]},
                    selectedData = this._deepCopy(this.MATERIAL_TYPE_DATA);
                if(this.groupItem[this.curItemKey] && this.groupItem[this.curItemKey].length>0){
                    selectedData[this.type] = this.groupItem[this.curItemKey];
                }
                //   this.groupItem[this.curItemKey];
              this.$UIModule({
                mode: "material-modal",
                props: {
                    isMulti: true,
                    type:this.type,
                    width:1080,
                    // fromType:"customPages",
                    // fromType:"distribute",
                    // isShowClassify:true,
                    // isShowTabs:true,
                    // customBodyStyle:"height:560px;", 
                },
                options: {selectedData,extraParams}, //已选数据,接口传参
                success: (data,extra={}) => {
                    let type = extra.type||"";
                    let arr = [].concat(data[type] || []);
                    this.$set(this.groupItem,this.curItemKey, arr);
                    console.log("success", data , this.groupItem[this.curItemKey]); 
                },
              });
            }
        },
        //设置封面
        setCover(index){
            let cur_item = this.groupItem[this.curItemKey][index] || {};
            this.$UIModule({
                mode: "upload-view",
                props: {
                    extraParams: {
                        type: "custom_page"
                    }
                },
                options: {},
                selectedData: cur_item || "",
                success: (data) => {
                    let cover = data || "";
                    this.$set(this.groupItem[this.curItemKey][index], "cover", cover);
                    console.log("success", data , this.groupItem[this.curItemKey]); 
                },
            }); 
        },
        onPlayVideo(src) {
          this.modalPlayShow = true;
          this.modalPlayLoading = true;
          this.playerOptions.sources[0].src = src;
        },
        // 拖动开始
        dragStart(e) {
            this.drag = true;
        },
        // 拖动结束
        dragEnd(e) {
            this.drag = false;
        },
        goTop(index){
            let groupItem = this.groupItem || {};
            let curList = groupItem[this.curItemKey] || []; 
            let temp = JSON.parse(JSON.stringify(curList[index]));
            this.$delete(this.groupItem[this.curItemKey], index);
            this.groupItem[this.curItemKey].unshift(temp);
            console.log('temp',temp)
        }
    },
};
</script>
	
<style lang="less" scoped>
.form-item-box {
    .group-item {
        border-radius: 4px;
        margin-bottom: 12px;
        position: relative;
        background: rgba(239, 239, 239, 0.6);
        .handle_ad {
            position: absolute;
            right: -10px;
            top: -10px;
            font-size: 10px;
            cursor: move;
            display: none;
            color: #2d8cf0;
            font-size: 22px;
        }
        &:hover { 
            .handle_ad {
                display: block;
            }
        }
    }
    .ghost {
        opacity: 0.5;
    }
    .link-to .link-tags {
        max-width: 115px;
    }
    .ivu-radio-group-button.ivu-radio-group-small .ivu-radio-wrapper {
        font-size: 12px;
    }

    .title-box{
        padding: 10px 9px;
        border-radius: 4px;
        font-size: 12px;
        color: #7f7f7f;
    }
    .title{
        flex: 1;
        padding-left: 4px;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
    }
    .item-box{
        padding-left: 20px;
    }
    .set-cover{
        padding: 8px 0 13px 20px;
    }
    .img-cover-box{
        width: 88px;
        height: 88px;
        overflow: hidden; 
        border-radius: 6px;
        &.init{
            background: #171717;
        }
        &.init_audio{
            background: #E4E4E4;
        }
        &.init_video{
            width: 211px;
            height: 158px;
        }
    }
    .img-cover{
        width: 100%;
        height: 100%;
        display: block;
    }
    .btn-box{
        background: #FFFFFF;
        border-radius: 4px;
        border: 1px solid #ECECEC;
        width:100%;
        height: 40px;
    }
    .link-box{
        padding: 12px 12px 7px 12px;
        background: #fff;
        border-radius: 4px;
        cursor: pointer;
    }
    .arrow{
        width:6px;
        height:6px;
        border-left: 1px solid;
        border-bottom: 1px solid;
        transform: rotate(-45deg);
    }

    .cont-info {
        width: 100%;
        flex: 1;
        padding-left: 5px;
    }
}
</style>