<style lang="less">
.upload-wrapper{
    .upload-btn, .file-name{
        margin-top: 10px;
    }
    .download-wrapper{
        display: flex;
        align-items: center;
        justify-content: flex-start;
        margin-top: 10px;
        .ivu-btn-text:hover{
            border-color: transparent;
        }
        .ivu-btn-text:focus{
            box-shadow: none;
        }
    }
}
</style>
<template>
    <div>
        <Modal
            class="upload-wrapper"
            v-model="modalShow"
            :title="modalTitle"
            :footer-hide="true"
            :mask-closable="false">
            <slot name="title"></slot>
            <Upload
                v-if="canCreate.upload"
                type="drag"
                ref="upload"
                name="file"
                :data="upLoadPayLoad"
                :show-upload-list="false"
                :action="posterUploadUrl"
                :before-upload="posterBeforeUpload"
                :on-success="posterUploadSuccess">
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
        </Modal>
    </div>
</template>
<script>
import util from '@/libs/util.js';
import Cookies from 'js-cookie';
import Conf from '@/config/index';

export default {
  // 下载额外参数, 上传额外参数
  props: ['downloadPayLoad', 'upLoadPayLoad'],
  data () {
    return {
      modalTitle: '批量导入',
      modalShow: false,
      posterUploadUrl: '',
      file: null,
      uploadLoading: false,
      downloadLoading: false,
      canCreate: {},
      uploadUrl: '',
      downloadUrl: ''
    }
  },
  methods: {
    // 打开模态框
    openModal (canCreate, uploadUrl, downloadUrl) {
      this.uploadUrl = uploadUrl;
      this.posterUploadUrl = util.apiHost + this.uploadUrl + '?access-token=' + Cookies.get('accessToken');
      this.downloadUrl = downloadUrl;
      this.canCreate = canCreate;
      this.file = null;
      this.modalShow = true;
    },
    posterBeforeUpload (file) {
      this.file = file;
      return false;
    },
    posterUploadSuccess (res, file) {
      this.uploadLoading = false;
      if (res.code) {
        // 上传成功
	        	this.$Notice.success({
	                title: '上传成功',
	                desc: res.message
        });
        this.$emit('on-success', res.data);
        this.modalShow = false;
        	} else {
        		// 上传失败
	        	this.$Notice.warning({
	                title: '上传失败',
	                desc: res.message
	            });
        	}
    },
    upload () {
      this.uploadLoading = true;
      this.$refs.upload.post(this.file);
    },
    download () {
      this.downloadLoading = true;
      this.$ajax.post(this.downloadUrl, this.downloadPayLoad)
    		.then((response) => {
          const a = document.createElement('a'); // 创建a标签
          a.href = response.data;
          a.download = '批量导入模板'; // 下载的文件名
          a.id = 'downloadAction';
					a.setAttribute('target', '_blank');
          document.body.append(a);
          // 给创建的a标签绑定点击事件下载
          const downloadAction = document.getElementById('downloadAction');
          downloadAction.click();
          downloadAction.remove();

          this.downloadLoading = false;
        });
    }
  }
}
</script>
