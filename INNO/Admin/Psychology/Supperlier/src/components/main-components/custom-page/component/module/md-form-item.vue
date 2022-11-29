<template>
    <div class="form-item-box">
        <draggable ghost-class="ghost" v-if="type != 'rich-text'" :list="curList" :group="{name:'imageList'}" handle=".handle_ad" v-bind="dragOptions" @start="dragStart" @end="dragEnd">
            <div v-for="(item,index) in curList" :name="index" :key="index" class="group-item">
                <Icon type="md-apps" class="handle_ad" title="拖拽排序" />
                <div class="title-box flex-s-c">
                    <Icon type="md-copy" style="font-size:18px;" @click="copy(item.title)"/>
                    <div class="title">{{item.title}}</div>
                    <div class="delete f-shrink-0 pointer" @click="removeImg(index)">删除</div>
                </div>
                <div class="item-box">
                    <div class="img-cover-box flex-c-c" :class="{'init':!!!item.cover,['init_'+type]:true}">
                        <img v-if="item.cover" class="img-cover" :src="item.cover" alt="">
                        <img v-else-if="keyInfo[type].img" class="img-type" :src="keyInfo[type].img">
                    </div>
                </div>
                <div class="set-cover">
                    <a @click="setCover(index)">设置封面</a>
                </div>
            </div>
        </draggable> 
        <uploadBtn 
          v-if="pageInfo.pageType == 'REPORT' && type != 'rich-text'"
          :type="type" 
          :isMulti="false" 
          name="file" 
          :isShowProgress="true"
          :btnTxt="'上传' + curName"
          :extraParams="{file_type:type}"
          :customUploading="uploadIng"
          @beforeUpload="uploadIng = true;"
          @uploadSuccess="uploadSuccess"
          @handleUploadError="uploadIng = false"
          @handleFormatError="uploadIng = false"
          @handleMaxSize="uploadIng = false"
          ></uploadBtn> 
        <uEditor 
            v-else-if="type == 'rich-text'" 
            ref="uEditorRef" 
            @on-content-change="onContentChange"></uEditor>
        <Button @click="selectContent" class="btn-box" v-else>
            <Icon type="md-add" size="18" class="m-r-5"></Icon>
            <span>添加{{curName}}</span>
        </Button>
    </div>
</template>

<script>
import draggable from "vuedraggable";
import audioImg from "@/assets/images/custom/audio.png";
import videoImg from "@/assets/images/custom/video.png";
import uploadBtn from "@/components/UI-components/module/upload-view/upload.vue";
import uEditor from "@/components/uEditor/uEditor.vue";
// import linkItem from "../../component/link-item/link-item";
// import linkTo from "@/views/my-components/link-to/link-to";
// import imageHotmapForm from "./image-hotmap-form";
// import imageEdit from "@/views/my-components/image-edit/image-edit";
// 载入videojs 组件
// import "video.js/dist/video-js.css";
// import { videoPlayer } from "vue-video-player";

export default {
    name: "mdFormItem",
    components: {
        draggable,
        uploadBtn,
        uEditor
        // linkItem,
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
        pageInfo:{
            type:Object,
            default:()=>({})
        },
        commonInfo:{
            type:Object,
            default:()=>({})
        },
    },
    computed: {
        typeImg(){
            switch (this.type) {
                case value:
                    
                    break;
            
                default:
                    break;
            }
        },
        dragOptions() {
            return {
                animation: 200,
                group: "description",
                disabled: false,
                ghostClass: "ghost",
            };
        },
        curList() {
            console.log('curList 进来')
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
            audioImg,
            videoImg,
            panelVal: "1",
            drag: false,

            modalPlayShow: false,
            modalPlayLoading: false,

            // 播放器配置
            // playerOptions: {
            //   autoplay: true,
            //   sources: [
            //     {
            //       type: "video/mp4",
            //       src: "",
            //     },
            //   ],
            //   notSupportedMessage: "此音频暂无法播放，请稍后再试",
            // },

            keyInfo: {
              'video':{
                paramsType:1,
                name:"视频",
                groupItemKey:"videos",
                img:videoImg,
              },
              'audio':{
                paramsType:2,
                name:"音频",
                groupItemKey:"audios",
                img:audioImg,
              },
              'article':{
                paramsType:3,
                name:"文章",
                groupItemKey:"articles",
                img:"",
              },
              'rich-text':{
                paramsType:3,
                name:"文章",
                groupItemKey:"richText",
                img:"",
              },
            },
            article_content:"",
            uploadIng:false
        };
    }, 
    methods: {
        // 移除音频
        removeImg(index) {
            this.$Modal.confirm({
                title: "操作提示",
                content: `确定移除${this.curName}吗？`,
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
            let strucId = Number(this.pageQuery.strucId||0),
                reqParams = { structure_id:strucId == 0 ? [0]:[0,strucId]},
                selectData = this._deepCopy(this.MATERIAL_TYPE_DATA);
            if(this.groupItem[this.curItemKey] && this.groupItem[this.curItemKey].length>0){
                selectData[this.type] = this.groupItem[this.curItemKey];
            }
          this.$UIModule({
            mode: "material-modal",
            props: {
                isMulti: true,
                type:this.type,
                width:1080,
                guideIndex: 1,
                isShowTabs: false,
                isShowClassify: true,
            },
            options: {selectData,reqParams}, //已选数据,接口传参
            success: (data,extra={}) => {
                let type = this.type || "";
                let arr = [].concat(data[type] || []);
                console.log('data[type]',this.pageInfo,type,data[type],data);
                this.$set(this.groupItem,this.curItemKey, arr);
            },
          });
        },
        uploadSuccess(data){
            console.log("uploadSuccess", data);
            this.uploadIng = false;
            let detail = data[0] && data[0].src || {};
            let info = {
                id: 0, 
                path: detail.filePath||"",
                cover_pic: detail.coverImage||"",  
                cover: detail.coverImage||"",  
                time_length: detail.duration||0,
                title: detail.fileName||"",
                // group_id: 0,
                // supplier_id: 3,
            }
            let arr = this.groupItem[this.curItemKey].concat([{...info}]);
            // console.log('arr',arr);
            this.$set(this.groupItem,this.curItemKey, arr);
        },
        //设置封面
        setCover(index){
            let cur_item = this.groupItem[this.curItemKey][index] || {};
            this.$UIModule({
                mode: "upload-view",
                extraParams: {
                    type: "custom_page"
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
        onContentChange( content ){
            this.article_content = content;
            let info = {
                id: 0, 
                content:this.article_content
            }
            let arr = [{...info}];
            console.log('article_content',this.article_content,arr);
            this.$set(this.groupItem,this.curItemKey, arr);
        },
    },
    mounted () {
        console.log('进来 item mounted');
        if(this.type == 'rich-text'){
            this.$refs['uEditorRef'] && this.$refs['uEditorRef'].init();
            setTimeout(() => {
                this.ue || (this.ue = this.$refs['uEditorRef'] && this.$refs['uEditorRef'].getUE());
                if(this.ue){
                    let richText = this.groupItem && this.groupItem.richText||[];
                    let content = richText[0] && richText[0].content||"";
                    content && this.ue.setContent(content);
                }
            }, 300);
        }
    },
    watch:{
        // curList: {
        //     handler(nV) {
        //         if(this.type == 'rich-text'){
        //             let content = nV && nV[0] && nV[0].content||"";
        //             if(content && this.ue){
        //                 content && this.ue.setContent(content);
        //             }
        //         }
        //     },
        //     deep: true,
        //     immediate: true,
        // }, 
        'commonInfo.curIndex': {
            handler(nV){
                if(this.type == 'rich-text'){
                    let content = this.curList && this.curList[0] && this.curList[0].content||"";
                    if(content && this.ue){
                        content && this.ue.setContent(content);
                    }
                }
            },
            immediante: true,
            deep: true
        }
    }
};
</script>

<style lang="less">
.form-item-box{
    .edui-default {
        .edui-editor{
            width: 100% !important;
        }
    }
}
</style>
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

}
</style>