<style lang="less">
.service-content{
	max-height: 500px;
	overflow: scroll;
	overflow-x:hidden;
}
.service-footer{
	margin-top:20px;
	text-align: center;
}
</style>

<template>
	<div>
		<Modal
	        v-model="modalShow"
	        :title="modalTitle"
	        :loading="modalLoading"
	        :footer-hide="true"
	        :width="450">

	        <div class="service-content" v-html="registerLicense"></div>

	        <div class="service-footer">
	        	<Button @click="goHideModel" type="success" style="width:90px;">确定</Button>
	        </div>

	    </Modal>
	</div>
</template>

<script>
import util from '@/libs/util.js';

/**
 * 用户注册服务条款
 */
export default {
  name: 'registerService',
  components: {

  },
  data () {
    return {
        	modalShow: false,
        	modalTitle: '服务条款',
        	modalLoading: true,

        	registerLicense: ''
    }
  },
  methods: {
    	init () {

    	},
    // 提供给父级调用
    	openService () {
    		this.modalShow = true;
    		this.modalLoading = true;

    		var data = util.cache.get('registerLicense');
    		if (data != null) {
    			this.registerLicense = data;
    		} else {
	    		// ajax 获取服务协议
	        	util.ajax.post(util.apiUrl.registerInit, {

        })
	    		.then((response) => {
	    			var res = response.data;
	    			if (res.code) {
	    				this.modalLoading = false;
	    				this.registerLicense = res.data.register_license;

	    				// 缓存起来
	    				util.cache.set('registerLicense', this.registerLicense);
	    			}
	    		});
    		}
    	},
    	goHideModel () {
    		this.modalShow = false;
    	}
  },
  mounted () {
    this.init();
  }
};
</script>
