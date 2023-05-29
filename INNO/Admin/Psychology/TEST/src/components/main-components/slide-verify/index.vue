<template>
    <Modal :title="title" v-model="verifyModalShow" :width="343"
        :footer-hide="footerHide" @on-cancel="onCancelVerify">
        <!--组件的参数说明，请看 https://gitee.com/monoplasty/vue-monoplasty-slide-verify -->
        <slide-verify :l="42" :r="10" :w="310" :h="155" slider-text="向右滑动" ref="slideblock" :imgs="verifyImages"
            @success="onVerifySuccess" @fail="onVerifyFail" @refresh="onVerifyRefresh" @again="onAgain" @fulfilled="onFulfilled">
        </slide-verify>
        <Spin fix v-if="verifyModalLoading" style="opacity: 0.5;"></Spin>
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
                verifyKey: ""
            }
        },
        created(){
            // 从100 张图片中，随机获取 10张图片
			// this.verifyImages = [];
			// for (var i = 0; i < 10; i++) {
			// 	var num = Math.random();
			// 	num = num * 100;
			// 	num = Math.floor(num) + 100;
            //     // 暂时写死图片路径
			// 	this.verifyImages.push('http://devadminwebapi.innourl.com/image/show/assets-images-slideVerifyImages-' + num + '.jpg');
			// }

        },
        methods:{
            getVerifyImg(params = {}){
                this.$MainApi.getVerify({
                    data: params
                }).then((res) => {
                    console.log("res",res);
                    if(res.code){
                        let data = res.data || {}
                        this.verifyKey = data.key;
                        this.verifyImages = data.url;
                        this.reset();
                    }
                })
            },
            showVerifyModal(config){
                if(!this.verifyModalShow){
                    this.verifyModalShow = true;
                }
                this.getVerifyImg({
                    login_name: (config.params && config.params.loginName) || ""
                });
            },
            // 滑动验证成功
			onVerifySuccess() {
				this.verifySuccess = true;
				this.verifyModalShow = false;
                this.$emit("onSuccess", {
                    verifyKey: this.verifyKey
                })
			},
			// 滑动验证失败
			onVerifyFail() {
				this.verifySuccess = false;
                this.$emit("onFail")
                setTimeout(()=>{
                    this.verifyModalLoading = true;
                }, 400)
			},
			// 滑动验证刷新
			onVerifyRefresh() {
				this.verifySuccess = false;
                this.verifyModalLoading = false;
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
            },
            onFulfilled(){
                this.verifyModalLoading = false;
            }
        }
    }
</script>