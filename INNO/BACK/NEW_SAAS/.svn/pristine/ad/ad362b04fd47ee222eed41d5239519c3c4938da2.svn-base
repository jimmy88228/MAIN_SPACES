<style lang="less">
	@import './avatar-editor.less';
</style>

<template>
	<div>
    	<div class="image-editor">
	    	<Row :gutter="10">
                <Col span="15" class="image-editor-con1">
                    <div class="cropper">
                        <img src="" alt="" id="cropimg1" />
                    </div>
                </Col>
                <Col span="9" class="image-editor-con1">
                    <Row type="flex" justify="center" align="middle" class="image-editor-con1-preview-con">
                        <div id="preview1">
                        	<img :src="avatarUrl" v-show="avatarShow" id="previewImg" style="width:100%"/>
                        </div>
                    </Row>
                    <div class="image-editor-con1-btn-con margin-top-10">
                        <input type="file" accept="image/png, image/jpeg, image/gif, image/jpg" @change="handleChange1" id="fileinput1" class="fileinput" />
                        <label class="filelabel" for="fileinput1"><Icon type="image"></Icon>&nbsp;选择图片</label>
                        <span><Button @click="handlecrop1" type="success" icon="md-crop">裁剪</Button></span>
                    </div>

                </Col>
            </Row>
        </div>

        <div slot="footer"></div>

    </div>
</template>

<script>
import Cropper from 'cropperjs';
import './cropper.min.css';

export default {
    	name: 'avatarEditor',
    	data () {
	        return {
	            cropper1: {},
	            option1: {
	                cropedImg: ''
	            }

	        };
	    },
	    props: {
	    	avatarUrl: {
	    		type: String,
	    		default: ''
	    	},
	    	avatarShow: {
	    		type: Boolean,
	    		default: false
	    	}
	    },
	    methods: {
	    	init () {
	    		// 图片编辑器
      const img1 = document.getElementById('cropimg1');
		        this.cropper1 = new Cropper(img1, {
		        	aspectRatio: 1 / 1, // 裁剪比率
		            dragMode: 'move',
		            preview: '#preview1',
		            restore: false,
		            center: false,
		            highlight: false,
		            cropBoxMovable: false,
		            toggleDragModeOnDblclick: false
		        });
	    	},
    handleChange1 (e) {
	            const file = e.target.files[0];
	            const reader = new window.FileReader();
	            reader.onload = () => {
	                this.cropper1.replace(reader.result);
	                reader.onload = null;
	            };
	            reader.readAsDataURL(file);
	        },
	        // 裁剪按钮
	        handlecrop1 () {
	            const file = this.cropper1.getCroppedCanvas().toDataURL();
	            this.option1.cropedImg = file;
	            // 把数据发送给父级
	            this.$emit('cropeImage', file);
	        }
	    },
	    // 侦听数据的变化
	    watch: {
	    	avatarUrl: function (newAvatarUrl) {
      if (typeof (this.cropper1) === 'object') {
        this.cropper1.destroy();
      }

	    		// 如果数据发生变化，重新初始化
	    		this.init();

	    		// 预览图片
	    		document.getElementById('previewImg').src = newAvatarUrl;
	    		document.getElementById('previewImg').style.display = '';
	    	}
	    },
	    mounted () {
    this.init();
  }
};
</script>
