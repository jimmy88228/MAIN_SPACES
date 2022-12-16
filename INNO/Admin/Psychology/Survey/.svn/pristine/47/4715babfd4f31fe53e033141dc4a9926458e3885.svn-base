<style lang="less">
.upload-wrapper {
    .upload-btn,
    .file-name {
        margin-top: 10px;
    }

    .download-wrapper {
        display: flex;
        align-items: center;
        justify-content: flex-start;
        margin-top: 10px;

        .ivu-btn-text:hover {
            border-color: transparent;
        }

        .ivu-btn-text:focus {
            box-shadow: none;
        }
    }
    .ivu-divider {
        margin: 15px 0px;
    }
    .upload-input {
        .upload-input-btn {
            margin: 0 auto;
            margin-top: 10px;
        }
    }
}
</style>
<template>
    <div>
        <Modal class-name="upload-wrapper" v-model="modalShow" :title="modalTitle" :footer-hide="true" :mask-closable="false">
            <slot name="title"></slot>
            <Upload v-if="canCreate.upload" type="drag" ref="upload" name="file" :headers="headers" :data="upLoadPayLoad" :show-upload-list="false" :action="posterUploadUrl" :before-upload="posterBeforeUpload" :on-success="posterUploadSuccess" :on-error="posterUploadError"
            :format="format"
            :on-format-error="formatError"
            >
                <div style="padding: 20px 0">
                    <Icon type="ios-cloud-upload" size="52" style="color: #3399ff"></Icon>
                    <p>点击或拖拽文件上传</p>
                </div>
            </Upload>
            <p v-if="file" class="file-name">上传文件：{{file.name}}</p>
            <slot name="content"></slot>
            <div style="text-align: center;">
                <Button type="primary" v-if="file != null" class="upload-btn" :loading="uploadLoading" @click="upload">确定上传</Button>
            </div>
            <Divider />
            <div class="download-wrapper" v-if="canCreate.download">
                <span>如需模板，请下载~</span>
                <Button type="text" class="download-btn" :loading="downloadLoading" @click="download">
                    <a style="text-decoration:underline">下载模板</a>
                </Button>
            </div>
            <Divider />
            <div class="upload-input" v-if="canCreate.goodsInputImport">
                <p class="m-bottom-5">如需手动输入,请按照要求输入{{inputKey}}</p>
                <Input type="textarea" v-model="uploadInputTxt" class="upload-textarea" :placeholder="'输入'+ inputKey + ',多' + inputKey + '逗号隔开'" />
                <div class="text-c">
                    <Button class="upload-input-btn" type="primary" v-if="uploadInputTxt" @click="uploadInput">确定</Button>
                </div>
            </div>
        </Modal>
        <!--异步处理导入组件-->
        <mpNotice :ref="'notice' + item" v-for="item in jobIdCol" :key="item" @on-success="importSuccess"></mpNotice>
    </div>
</template>
<script>
import Conf from "@/config/index";
import Apis from "@/helper/manager/http-api";
import LM from "@/helper/manager/login-manager.js";
import mpNotice from "@/components/main-components/mq-notice/mq-notice";
export default {
    // 下载额外参数, 上传额外参数
    components: { mpNotice },
    props: {
        downloadPayLoad: {
            type: Object,
            default() {
                return {};
            },
        },
        upLoadPayLoad: {
            type: Object,
            default() {
                return {};
            },
        },
        inputKey: {
            type: String,
            default() {
                return "商品货号";
            },
        },
        format: {
            type: Array,
            default() {
                return ['xlsx'];
            },
        }
    },
    data() {
        return {
            modalTitle: "批量导入",
            modalShow: false,
            posterUploadUrl: "",
            file: null,
            uploadLoading: false,
            downloadLoading: false,
            canCreate: {},
            uploadUrl: "",
            downloadUrl: "",
            uploadInputTxt: "",
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
    },
    methods: {
        // 打开模态框
        showModal({ canCreate, uploadUrl, downloadUrl }) {
            this.uploadUrl = uploadUrl;
            this.posterUploadUrl = Conf.API_DOMIN + Apis[this.uploadUrl].u;
            this.downloadUrl = downloadUrl;
            this.canCreate = canCreate;
            this.file = null;
            this.modalShow = true;
            this.uploadInputTxt = null;
        },
        formatError(file, fileList){
            const formatStr = this.format.join("/");
            this.$Notice.warning({
                title: `${formatStr}格式错误`,
                desc: `文件 ${file.name} 格式不正确, 请选择 ${formatStr} 格式文件`,
            });
            setTimeout(()=>{
                this.uploadLoading = false;
            }, 500)
        },
        posterBeforeUpload(file) {
            this.file = file;
            return false;
        },
        posterUploadError(error, file, fileList){
            this.uploadLoading = false;
        },
        posterUploadSuccess(res, file) {
            this.uploadLoading = false;
            if (res.code) {
                // 上传成功
                // this.$Notice.success({
                //     title: "上传成功",
                //     desc: res.message,
                // });
                let data = res.data;
                this.jobIdCol.push(data);
                this.$nextTick(() => {
                    this.$refs[`notice${data}`][0].showNotice(data);
                });
                // this.$emit("success", data);
                this.modalShow = false;
            } else {
                // 上传失败
                this.$Notice.warning({
                    title: "上传失败",
                    desc: res.message,
                });
            }
        },
        upload() {
            this.uploadLoading = true;
            this.$refs.upload.post(this.file);
        },
        download() {
            if (!this.downloadUrl) return Promise.reject();
            this.downloadLoading = true;
            this.$MainApi[this.downloadUrl]({
                data: this.downloadPayLoad,
            })
                .then((res) => {
                    if (res.code) {
                        let data = res.data || {};
                        if(data.download){
                            window.open(data.download);
                        } else {
                            this.$Message.warning("无效模板下载");
                        }
                        
                    } else {
                        this.$Message.warning(res.message);
                    }
                })
                .finally(() => {
                    this.downloadLoading = false;
                });
        },
        uploadInput() {
            this.modalShow = false;
            this.$emit("success", this.uploadInputTxt);
        },
        importSuccess(){
            console.log("upload success")
            this.$emit("success");
        }
    },
};
</script>
