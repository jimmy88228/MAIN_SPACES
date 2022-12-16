<template>
    <Modal :title="title" v-model="verifyModalShow" :loading="verifyModalLoading" :width="343"
        :footer-hide="footerHide" @on-cancel="onCancelVerify">
        <!--组件的参数说明，请看 https://gitee.com/monoplasty/vue-monoplasty-slide-verify -->
        <slide-verify :l="42" :r="10" :w="310" :h="155" slider-text="向右滑动" ref="slideblock" :imgs="verifyImages"
            @success="onVerifySuccess" @fail="onVerifyFail" @refresh="onVerifyRefresh" @again="onAgain">
        </slide-verify>
    </Modal>
</template>
<script>
    export default{
        props: {
            title: {
                type: String,
                default: '请完成完全验证'
            },
            sliderText: {
                type: String,
                default: '向右滑动'
            },
            width: {
                type: Number,
                default: 343
            },
            footerHide: {
                type: Boolean,
                default: true
            }
        },
        data(){
            return {
                verifyModalShow: false,
				verifyModalLoading: false,
				verifyImages: [],
				verifySuccess: false,
            }
        },
        created(){
            // 从100 张图片中，随机获取 10张图片
			this.verifyImages = [];
			for (var i = 0; i < 10; i++) {
				var num = Math.random();
				num = num * 100;
				num = Math.floor(num) + 100;
                // 暂时写死图片路径
				this.verifyImages.push('http://devadminwebapi.innourl.com/image/show/assets-images-slideVerifyImages-' + num + '.jpg');
			}
        },
        methods:{
            showVerifyModal(config){
                if(!this.verifyModalShow){
                    this.verifyModalShow = true;
                }
            },
            // 滑动验证成功
			onVerifySuccess() {
				this.verifySuccess = true;
				this.verifyModalShow = false;
                this.$emit("onSuccess")
			},
			// 滑动验证失败
			onVerifyFail() {
				this.verifySuccess = false;
                this.$emit("onFail")
			},
			// 滑动验证刷新
			onVerifyRefresh() {
				this.verifySuccess = false;
			},
			// 检查到非人为操作的回调
			onAgain() {
				this.$emit("onAgain")
			},
			// 关闭验证的框
			onCancelVerify() {
				this.$emit("onClose")
			},
            reset(){
                this.$refs["slideblock"].reset();
            }
        }
    }
</script>