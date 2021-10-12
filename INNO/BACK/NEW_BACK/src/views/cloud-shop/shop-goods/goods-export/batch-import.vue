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
        <slot name="header"></slot>
        <Upload
            type="drag"
            ref="upload"
            name="file"
            :show-upload-list="false"
            :action="posterUploadUrl"
            :before-upload="posterBeforeUpload"
            :data="data"
            :on-success="posterUploadSuccess">
            <div style="padding: 20px 0">
                <Icon type="ios-cloud-upload" size="52" style="color: #3399ff"></Icon>
                <p>点击或拖拽文件上传</p>
            </div>
        </Upload>
        <p v-if="file" class="file-name">上传文件: {{file.name}}</p>
        <Button type="info" v-if="file != null" class="upload-btn" :loading="uploadLoading" @click="upload">确定上传</Button>
        <Divider />
        <div class="download-wrapper">
            <span>如需模板，请下载~</span>
            <Button type="text" class="download-btn" :loading="downloadLoading" @click="download">
				<span style="color:#2d8cf0">下载模板</span>
			</Button>
        </div>
        <slot name="footer"></slot>
    </div>
</template>
<script>
import util from '@/libs/util.js';
import Cookies from 'js-cookie';

export default {
  props: {
    data: {
      type: Object,
      default () {
        return {};
      }
    },
    canUpload: {
      type: Boolean,
      default: true
    }
  },
  data () {
    return {
      modalTitle: '批量导入',
      modalShow: false,
      posterUploadUrl: '',
      file: null,
      uploadLoading: false,
      downloadLoading: false,
      uploadUrl: '',
      downloadUrl: ''
    }
  },
  methods: {
    // 打开模态框
    openModal (uploadUrl, downloadUrl) {
      this.uploadUrl = uploadUrl;
      this.posterUploadUrl = util.apiHost + this.uploadUrl + '?access-token=' + Cookies.get('accessToken');
      this.downloadUrl = downloadUrl;
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
        this.$emit('on-success');
        this.modalShow = false;
      } else {
        this.$Notice.warning({
          title: '提示',
          desc: res.message,
          duration: 0
        });
      }
    },
    upload () {
      if (!this.canUpload) {
        this.$Notice.warning({
          title: '提示',
          desc: '请选择相应的参数',
          duration: 0
        });
        return false;
      }
      this.uploadLoading = true;
      this.$refs.upload.post(this.file);
    },
    download () {
      this.downloadLoading = true;
      this.$ajax.post(this.downloadUrl, this.data)
    		.then((response) => {
          const a = document.createElement('a'); // 创建a标签
          a.href = response.data;
          a.download = '批量导入模板'; // 下载的文件名
          a.id = 'downloadAction';
          a.target = '_blank';
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
