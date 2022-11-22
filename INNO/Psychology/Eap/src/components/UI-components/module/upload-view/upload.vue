<template>
    <div class="material-upload">
        <Upload ref="uploadRef" :multiple="isMulti" :name="uploadName" :data="uploadExtraParams" :headers="headers" :action="uploadAction" :show-upload-list="false" :max-size="uploadMaxSize" :format="uploadFormat" 
        :accept="accept"
        :disabled="uploading || customUploading"
        :on-format-error="handleFormatError" :on-exceeded-size="handleMaxSize" :before-upload="beforeUpload" :on-progress="handleProgress" :on-error="handleUploadError" :on-success="handleUploadSuccess">
            <slot>
                <Button type="primary" :loading="uploading" icon="md-cloud-upload">上传文件</Button>
            </slot>
        </Upload>
    </div>
</template>

<script>
import Conf from "@/config/index";
import Apis from "@/helper/manager/http-api";
import LM from "@/helper/manager/login-manager.js";
export default {
    name: "MaterialUpload",
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
                return {
                    // type: "" // activity custom_page video audio article consultant
                }
            }
        },
        customUploading: Boolean
    },
    data() {
        return {
            uploading: false,
            accept: "",
            formatStr: "",
            beforeList: []
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
            console.log("extraParams", extraParams)
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
                    format = ['mp4'];
                    formatStr = "视频";
                    accept = "video/mp4";
                    break;
                case "AUDIO":
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
            let maxSize = [];
            switch(type){
                case "IMAGE":
                    maxSize = 2048;
                    break;
                case "VIDEO":
                    maxSize = 1024*500;
                    break;
                case "AUDIO":
                    maxSize = 1024*500;
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
            this.$emit('uploadProgress', JSON.parse(JSON.stringify(fileList)));
        },
        beforeUpload(fileList) {
            this.setLoading(true);
            this.$emit('beforeUpload', fileList);
        },
        handleUploadError(error, file, fileList) {
            console.log("handleUploadError", fileList);
            this.setLoading(false);
            this.$emit('handleUploadError');
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
            this.setLoading(false);
            this.$emit("uploadSuccess", result);
        },
        setLoading(state){
            if(this.isMulti) return;
            if(state){
                if(!this.uploading){
                    this.uploading = state
                }
            } else {
                if(this.uploading){
                    this.uploading = state
                }
            }
            this.$refs["uploadRef"].clearFiles();
        }
    },
};
</script>
