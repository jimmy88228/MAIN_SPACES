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
				:before-upload="beforeUpload"
        :on-progress="handleProgress"
				:on-error="handleUploadError"
        :on-success="handleUploadSuccess">
        <Button type="primary" icon="md-cloud-upload">{{isImageType ? '上传该分类图片' : '上传该分类视频'}}</Button>
      </Upload>
  </div>
</template>

<script>
import util from '@/libs/util.js';
import Cookies from 'js-cookie';

export default {
  name: 'MaterialUpload',
  inject: ['multi', 'selectedData'], // , 'maxSize', 'format'
  props: {
    selectedCatId: {
      required: true
    },
    tabType: {
      // 图片还是视频类型
      required: true
    },
		maxSize: {
			type: Number
		},
		format:{
			type: Array
		}
  },
  data () {
    return {
      posterUploadUrl: util.apiHost + util.apiUrl.uploadImages + '?access-token=' + Cookies.get('accessToken'),
      uploadList: [],
      prevFileList: [], //存储上一次的文件列表
      // fileList: [], //存储最近一次上传的文件列表
      isMulti: true, //Number(this.multi) ? true : false， 上传的数据不受多选控制,默认可上传多张
			uploadOrder: [],
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
    },
		uploadSort(){
			let uploadOrder = this.uploadOrder || [];
			let array = [];
			for(let i = 0; i < uploadOrder.length; i++){
				array.push(uploadOrder[i].name);
			}
			return array;
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
		beforeUpload(fileList){
			let img = window.URL.createObjectURL(fileList);
			this.uploadOrder.push({
				name: fileList.name,
				type: fileList.type,
				file: fileList,
				img: img
			});
			// console.log("fileList", fileList);
			if(this.timer){
				clearTimeout(this.timer);
				this.timer = null;
			}
			this.timer = setTimeout(()=>{
				this.$UIModule({
					mode: 'drag-view',
					options: {
						dragData: this.uploadOrder,
						imgKey: 'img',
						txtKey: 'name'
					},
					success:(data)=>{
						console.log("uploadOrder", this.uploadOrder);
						this.manualUploadAll();
					},
					fail:()=>{
						this.uploadOrder = [];
					}
				})
			}, 300);
			return false;
		},
		manualUpload(file){
			this.$refs['upload'].post(file);
		},
		manualUploadAll(){
			let uploadOrder = this.uploadOrder || [];
			if(uploadOrder.length == 0) return;
			for(let i = 0; i < uploadOrder.length; i++){
				this.manualUpload(uploadOrder[i].file)
			}
		},
		handleUploadError(error, file, fileList){
			console.log("error", error)
			console.log("file", file)
			console.log("fileList", fileList)
			let uploadOrder = this.uploadOrder || [];
			let errorIndex = null;
			for(let i = 0; i < uploadOrder.length; i++){
					if(uploadOrder[i].name == fileList.name){
						errorIndex = i;
						break;
					}
			}
			if(errorIndex || errorIndex == 0){
				this.uploadOrder.splice(errorIndex, 1)
			}
		},
    handleUploadSuccess (response, file, fileList) {
			let result = [];
			for(let i = 0; i < fileList.length; i++){
				let status = fileList[i].status;
				if(status == 'finished'){
					let response = fileList[i].response || {};
					let src = response.data || '';
					result.push({
						name: fileList[i].name,
						src: src
					})
				}
			}
      this.$emit('uploadSuccess', result);
    }
  }
}
</script>
