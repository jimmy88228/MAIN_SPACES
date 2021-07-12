<template>
  <div class="material-upload">
    <Upload
        ref="upload"
        :multiple="isMulti"
        :name="uploadParams"
        :data="uploadExtData"
        :action="posterUploadUrl"
        :show-upload-list="false"
        :max-size="maxSize"
        :format="format"
        :on-format-error="handleFormatError"
        :on-exceeded-size="handleMaxSize"
        :on-progress="handleProgress"
        :on-success="handleUploadSuccess">
        <Button type="primary" icon="md-add">{{isImageType ? '上传图片' : '上传视频'}}</Button>
      </Upload>
  </div>
</template>

<script>
import util from '@/libs/util.js';
import Cookies from 'js-cookie';

export default {
  name: 'MaterialUpload',
  inject: ['multi', 'selectedData', 'maxSize', 'format'],
  props: {
    selectedCatId: {
      required: true
    },
    tabType: {
      // 图片还是视频类型
      required: true
    }
  },
  data () {
    return {
      posterUploadUrl: util.apiHost + util.apiUrl.uploadImages + '?access-token=' + Cookies.get('accessToken'),
      uploadList: [],
      prevFileList: [], //存储上一次的文件列表
      fileList: [], //存储最近一次上传的文件列表
      isMulti: Number(this.multi) ? true : false
    }
  },
  computed: {
    isImageType () {
      return this.tabType === 'image';
    },
    // 用户素材分类（选中分类ID）
    uploadExtData () {
      return {
        cat_id: this.selectedCatId,
        type: this.tabType
      }
    },
    uploadParams () {
      return this.isImageType ? 'image_file' : 'video_file'
    }
  },
  methods: {
    handleFormatError (file) {
      const formatStr = this.format.join('/');
      this.$Notice.warning({
        title: this.isImageType ? '图片格式错误' : '视频格式错误',
        desc: `文件 ${file.name} 格式不正确, 请选择 ${formatStr} 格式文件`
      });
    },
    handleMaxSize (file) {
      this.$Notice.warning({
        title: '超过了最大文件限制',
        desc: `文件  ${file.name} 超过了 ${this.maxSize}Kb，请控制在${this.maxSize}Kb以内.`
      });
    },
    handleProgress (event, file, fileList) {
      this.uploadList = fileList;
      this.$emit('getUploadProgress', this.uploadList);
    },
    handleUploadSuccess (response, file, fileList) {
      this.fileList = [];
      let result = fileList.map(item => item.response.data);
      result.forEach(item => {
        if (!this.prevFileList.includes(item)) {
          this.fileList.push(item);
        }
      });
      this.prevFileList = result;
      this.$emit('uploadSuccess', this.fileList);
    }
  }
}
</script>
