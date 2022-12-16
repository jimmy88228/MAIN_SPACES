<template>
    <div class="material-upload">
        <CustomUpload ref="uploadRef" :timeout="timeout" :multiple="isMulti" :name="uploadName" :data="uploadExtraParams" :headers="headers" :action="uploadAction" :show-upload-list="false" :max-size="uploadMaxSize" :format="uploadFormat" 
        :accept="accept"
        :disabled="uploading || customUploading"
        :on-format-error="handleFormatError" :on-exceeded-size="handleMaxSize" :before-upload="beforeUpload" :on-progress="handleProgress" :on-error="handleUploadError" :on-success="handleUploadSuccess">
            <slot>
                <div class="upload-operate">
                    <div class="upload-operate-cont" :class="{ 'uploading-animate': uploading && isShowProgress }">
                        <div class="">
                            <Button type="primary" class="upload-btn" :loading="uploading" icon="md-cloud-upload">{{btnTxt}}</Button>
                        </div>
                        <div class="upload-progess-area">
                            <Button type="primary" class="uploading-btn" :loading="uploading">
                                {{isWarn ? '上传失败' : singleProgress >= 100 ? '上传成功' : '上传中'}}
                            </Button>
                            <Progress v-if="!isMulti && isShowProgress && showProgress" class="upload-progress" :percent="singleProgress" :status="isWarn ? 'wrong' : 'active'" />
                        </div>
                    </div>
                </div>
            </slot>
        </CustomUpload>
    </div>
</template>

<script>
import Conf from "@/config/index";
import Apis from "@/helper/manager/http-api";
import LM from "@/helper/manager/login-manager.js";
import CustomUpload from "./custom/upload";
export default {
    name: "MaterialUpload",
    components: { CustomUpload },
    props: {
        type: {
            type: String,
            default: "IMAGE",
        },
        maxSize: {
            type: Number,
        },
        format: {
            type: Array,
        },
        isMulti: {
            type: Boolean,
            default: true
        },
        action: {
            type: String,
            default: ""
        },
        name: {
            type: String,
            default: "image"
        },
        extraParams: {
            type: Object,
            default: ()=>{
                return {}
            }
        },
        customUploading: Boolean,
        timeout: {
            type: Number,
            default: 10 * 60 * 1000
        },
        isShowProgress: {
            type: Boolean,
            default: false
        },
        btnTxt: {
            type: String,
            default: "上传文件"
        },
    },
    data() {
        return {
            // posterUploadUrl: Conf.API_DOMIN + Apis["ImageUplode"].u,
            // uploadList: [],
            // prevFileList: [], //存储上一次的文件列表数据不受多选控制,默认可上传多张
            // uploadOrder: [],
            uploading: false,
            accept: "",
            formatStr: "",
            beforeList: [],
            // 针对单个选择
            showProgress: true,
            singleProgress: 0,
            isWarn: false
        };
    },
    computed: {
        headers() {
            let headers = {};
            if (LM.isLogin && LM.loginToken) {
                headers.Authorization = LM.loginToken;
            }
            return headers;
        },
        uploadExtraParams(){
            let extraParams = this.extraParams || {};
            return extraParams;
        },
        uploadName() {
            return this.name;
        },
        uploadFormat(){
            if(this.format) return this.format;
            let type = this.type || "";
            let format = [], accept = "", formatStr="";
            switch(type){
                case "IMAGE":
                    format = ['jpg','jpeg','png'];
                    formatStr = "图片"
                    accept = "image/jpg, image/jpeg, image/png";
                    break;
                case "VIDEO":
                case "video":
                    format = ['mp4'];
                    formatStr = "视频";
                    accept = "video/mp4";
                    break;
                case "AUDIO":
                case "audio":
                    format = ['mp3'];
                    formatStr = "音频";
                    accept = "audio/mp3";
                    break;
            }
            this.accept = accept;
            this.formatStr = formatStr;
            return format;
        },
        uploadMaxSize(){
            if(this.maxSize) return this.maxSize;
            let type = this.type || "";
            let maxSize = 0;
            switch(type){
                case "IMAGE":
                case "image":
                    maxSize = 2048;
                    break;
                case "VIDEO":
                case "video":
                    maxSize = 1024*500;
                    break;
                case "AUDIO":
                case "audio":
                    maxSize = 1024*500;
                    break;
                default:
                    break;
            }
            return maxSize;
        },
        uploadAction(){
            if(this.action) return this.action;
            let type = this.type || "";
            let action = "";
            switch(type){
                case "IMAGE":
                    action = Conf.API_DOMIN + Apis["ImageUplode"].u
                    break;
                default:
                    action = Conf.API_DOMIN + Apis["multimediaUplode"].u
                    break;
            }
            return action;
        }
    },
    methods: {
        handleFormatError(file) {
            const formatStr = this.uploadFormat.join("/");
            this.$Notice.warning({
                title: `${this.formatStr}格式错误`,
                desc: `文件 ${file.name} 格式不正确, 请选择 ${formatStr} 格式文件`,
            });
            setTimeout(()=>{
                this.setLoading(false);
                this.$emit('handleFormatError');
            }, 500)
            // 
        },
        handleMaxSize(file) {
            this.$Notice.warning({
                title: "超过了最大文件限制",
                desc: `文件  ${file.name} 超过了 ${this.uploadMaxSize}Kb，请控制在${this.uploadMaxSize}Kb以内.`,
            });
            setTimeout(()=>{
                this.setLoading(false);
                this.$emit('handleMaxSize');
            },500)
        },
        handleProgress(event, file, fileList) {;
            if(!this.isMulti){
                this.singleProgress = file.percentage
            }
            this.$emit('uploadProgress', JSON.parse(JSON.stringify(fileList)));
        },
        beforeUpload(fileList) {
            this.setLoading(true);
            this.$emit('beforeUpload', fileList);
        },
        handleUploadError(error, file, fileList) {
            this.setLoading(false, { isError: true }).then(()=>{
                this.$emit('handleUploadError');
            })
        },
        handleUploadSuccess(response, file, fileList) {
            let result = [];
            for (let i = 0; i < fileList.length; i++) {
                let status = fileList[i].status;
                let response = fileList[i].response || {};
                let src = response.data || "";
                result.push({
                    showProgress: false,
                    name: fileList[i].name,
                    status: response.code ? status : 'error',
                    src: src,
                    percentage: fileList[i].percentage
                });
            }
            this.beforeList = [];
            this.setLoading(false, { isSuccess: true }).then(()=>{
                this.$emit("uploadSuccess", result);
            });
        },
        setLoading(state, detail = {}){
            return new Promise((rs, rj)=>{
                if(this.isMulti) return rs();
                this.$refs["uploadRef"] && this.$refs["uploadRef"].clearFiles();
                this.isWarn = false;
                if(state){
                    if(!this.showProgress && this.isShowProgress){
                        this.showProgress = true
                    }
                    if(!this.uploading){
                        this.uploading = state
                    }
                    return rs();
                } else {
                    if(detail.isSuccess){
                        this.singleProgress = 100
                    }
                    if(detail.isError){
                        this.isWarn = true;
                        this.$Message.warning("上传失败");
                    }
                    setTimeout(()=>{
                        if(this.uploading){
                            this.uploading = state
                        }
                        if(this.isShowProgress){
                            this.showProgress = false;
                            this.singleProgress = 0;
                        }
                        return rs();
                    }, 1000)
                }
            })
        }
    },
};
</script>
<style lang="less">
.material-upload{
    .upload-operate{
        position:relative;
        display: flex;
        overflow: hidden;
    }
    .upload-operate-cont{
        position: relative;
        transition: transform .35s;
    }
    .uploading-animate{
        transform: translateY(-100%);
    }
    .upload-progess-area{
        display: block;
        position: absolute;
        bottom: 0px;
        left: 0px;
        width:100%;
        transform: translateY(100%);
        font-size: 0;
        overflow: hidden;
        border-radius: 4px;
    }
    .uploading-btn{
        position: relative;
        z-index: 2;
        width:100%;
        background: none;
        border: 0 none;
    }
    .uploading-btn:before{
        opacity: 0;
    }
    .upload-progress{
        cursor: pointer;
        position:absolute;
        top:0px;
        left:0px;
        width:100%;
        height:100%;
        border-radius: 4px;
        overflow: hidden;
        .ivu-progress-outer{
            padding: 0px;
            display: flex;
            width:100%;
            height:100%;
        }
        .ivu-progress-inner{
            width:100%;
            height: 100%;
            border-radius: 0;
            background: #e6e6e6;
            // opacity: 0.9;
        }
        .ivu-progress-bg{
            height: 100% !important;
            border-radius: 0;
        }
        .ivu-progress-text{
            display: none;
        }
        .ivu-progress-bg:before{
            border-radius: 0;
        }
    }
    .upload-btn{
        cursor:pointer;
    }
}
    
</style>
