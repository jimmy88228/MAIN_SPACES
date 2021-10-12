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
		.ivu-divider{
			margin: 15px 0px;
		}
		.upload-input{
			.upload-input-btn{
				margin:0 auto;
				margin-top: 10px;
			}
		}
	}
</style>
<template>
	<div>
		<Modal class-name="upload-wrapper" v-model="modalShow" :title="modalTitle" :footer-hide="true"
			:mask-closable="false">
			<slot name="title"></slot>
			<Upload v-if="canCreate.upload" type="drag" ref="upload" name="file" :data="upLoadPayLoad"
				:show-upload-list="false" :action="posterUploadUrl" :before-upload="posterBeforeUpload"
				:on-success="posterUploadSuccess">
				<div style="padding: 20px 0">
					<Icon type="ios-cloud-upload" size="52" style="color: #3399ff"></Icon>
					<p>点击或拖拽文件上传</p>
				</div>
			</Upload>
			<p v-if="file" class="file-name">上传文件：{{file.name}}</p>
			<slot name="content"></slot>
			<div style="text-align: center;">
				<Button type="primary" v-if="file != null" class="upload-btn" :loading="uploadLoading"
					@click="upload">确定上传</Button>
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
				<Input type="textarea" v-model="uploadInputTxt" class="upload-textarea" :placeholder="'输入'+ inputKey + ',多' + inputKey + '逗号隔开'"/>
				<div class="text-c">
					<Button class="upload-input-btn" type="primary" v-if="uploadInputTxt" @click="uploadInput">确定</Button>
				</div>
			</div>
		</Modal>
	</div>
</template>
<script>
	import util from '@/libs/util.js';
	import Cookies from 'js-cookie';
	import Conf from '@/config/index';

	export default {
		// 下载额外参数, 上传额外参数
		props: {
			downloadPayLoad: {
				type: Object,
				default(){
					return {}
				}
			},
			upLoadPayLoad: {
				type: Object,
				default(){
					return {}
				}
			},
			inputKey: {
				type: String,
				default(){
					return "商品货号"
				}
			}
		},
		data() {
			return {
				modalTitle: '批量导入',
				modalShow: false,
				posterUploadUrl: '',
				file: null,
				uploadLoading: false,
				downloadLoading: false,
				canCreate: {},
				uploadUrl: '',
				downloadUrl: '',
				uploadInputTxt: ""
			}
		},
		methods: {
			// 打开模态框
			showModal({canCreate, uploadUrl, downloadUrl}) {
				this.uploadUrl = uploadUrl;
				this.posterUploadUrl = util.apiHost + this.uploadUrl + '?access-token=' + Cookies.get('accessToken');
				this.downloadUrl = downloadUrl;
				this.canCreate = canCreate;
				this.file = null;
				this.modalShow = true;
				this.uploadInputTxt = null;
			},
			posterBeforeUpload(file) {
				this.file = file;
				return false;
			},
			posterUploadSuccess(res, file) {
				this.uploadLoading = false;
				if (res.code) {
					// 上传成功
					this.$Notice.success({
						title: '上传成功',
						desc: res.message
					});
					this.$emit('success', res.data);
					this.modalShow = false;
				} else {
					// 上传失败
					this.$Notice.warning({
						title: '上传失败',
						desc: res.message
					});
				}
			},
			upload() {
				this.uploadLoading = true;
				this.$refs.upload.post(this.file);
			},
			download() {
				this.downloadLoading = true;
				this.$ajax.post(this.downloadUrl, this.downloadPayLoad)
					.then((response) => {
						console.log(response.data);
						if(response.data){
							window.open(response.data);
						}

					}).finally(()=>{
						this.downloadLoading = false;
					})
			},
			uploadInput(){
				this.modalShow = false;
				this.$emit("success", this.uploadInputTxt);
			}
		}
	}
</script>
