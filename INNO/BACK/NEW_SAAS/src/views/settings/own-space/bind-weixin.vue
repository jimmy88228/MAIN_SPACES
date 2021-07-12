<style lang="less">
</style>

<template>
    <div>
    	<Modal v-model="showWeixinModal"
			footer-hide>
	        <p slot="header">管理员绑定微信</p>
	        
	        <div style="text-align:center;font-size:14px;padding-bottom: 20px;">
				<template v-if="bindSuccess == false">
					<img :src="wxQrcode" style="width:250px;"/>
					<br />
					<span>请用微信扫描上面的二维码绑定微信</span>
				</template>
				<template v-else>
					<Icon type="ios-checkmark-circle" size="60" color="#19be6b"></Icon>
					<div>绑定成功</div>
				</template>
	        </div>
	        <Spin size="large" fix v-if="wxspinShow"></Spin>
	    </Modal>
    </div>
</template>

<script>
import util from '@/libs/util.js';
export default {
    name: 'bindWeixin',
    components: {
 
    },
    data () {
    	return{
    		showWeixinModal:false, // 微信二维码模态框
            wxspinShow:false, 
            wxQrcode:'',
			
			timerObj: null,
			bindSuccess: false,
    	}
    },
	destroyed() {
		clearTimeout( this.timerObj );
	},
    methods: {
		// 提供給父組件使用
    	openModal(){
        	this.showWeixinModal = true;
        	this.wxspinShow = true;
        	// ajax 请求获取微信二维码
        	util.ajax.post(util.apiUrl.wxbind, {

        	})
    		.then((response) => {
    			var res = response.data;
    			
    			if( res.code ){
                    // 初始化表单数据
                    this.wxQrcode = res.data;
					
					// 触发反查
					this.wxbindCallback();
    			}
    			else{
    				this.$Notice.error({
	                    title: '操作失败',
	                    desc: res.message
	                });
    				this.showWeixinModal = false;
    			}
    			this.wxspinShow = false ;
			});
        },
        // 定時反查
		wxbindCallback(){
			clearTimeout( this.timerObj );
			this.timerObj = setTimeout(()=>{
				// ajax 反查是否綁定成功
				util.ajax.post( util.apiUrl.wxbindCb, {
				   
				})
				.then( (response) => {
					var res = response.data;
					
					if( res.code ){
				        if( res.data != '' && res.data != null ){
							this.$Message.success('绑定微信成功');
							this.bindSuccess = true;
							
							// 通知父组件
							this.$emit('on-success');
							
							// 清理掉timer
							clearTimeout( this.timerObj );
							
							// 关闭模态框
							setTimeout( ()=>{
								this.showWeixinModal = false ;
							}, 3000);
							
				        }
						else{
							// 继续递归
							this.wxbindCallback();
						}
					}
					else{
						this.$Message.error( res.message );
					}
				});
			}, 2500);
		}
    },
}
</script>
