<style lang="less">
.get-point{
	.ivu-modal-body{
		padding: 0;
	}
	iframe{
		width: 100%;
		height:610px;
	}
}
</style>

<template>
	<div>
		<Modal
			class="get-point"
	        v-model="modalShow"
	        :styles="{top:'20px'}"
	        :title="modalTitle"
	        :loading="modalLoading"
	        :width="930"
	        @on-ok="modalOk">
			<iframe :src="iframeSrc" id="qq-map-get-point" frameborder="0"></iframe>
		</Modal>
	</div>
</template>

<script>
/**
 * QQ地图，拾取坐标组件
 */

export default {
  name: 'qqMapGetPoint',
  components: {
  },
  props: {
  },
  data () {
    	return {
    		// 模态框
    		modalShow: false,
    		modalTitle: '设置地址和坐标',
    		modalLoading: true,

    		iframeSrc: ''
    	}
  },
  methods: {
    	// 初始化
    	init () {
    	},
    	// 提供父组件调用
    	initSet (lon, lat, address) {
    		this.modalShow = true;
    		this.modalLoading = true;

    		this.iframeSrc = '/qqMapGetPoint.html?t=' + (new Date()).getTime();

    		window.setTimeout(() => {
    			document.getElementById('qq-map-get-point').contentWindow.setData({
    				lon: lon,
    				lat: lat,
    				address: address
    			});
    		}, 2000);
    	},
    	// 确定按钮
    	modalOk () {
    		this.modalLoading = true;

    		// 从 iframe 获取数据
    		var rs = document.getElementById('qq-map-get-point').contentWindow.getData();
    		if (rs === false) {
    			this.$Message.error('请点击获取地址坐标');

    			this.modalShow = true;
        this.modalLoading = false;

        setTimeout(() => {
          this.modalLoading = true;
        }, 50);
    		} else {
    			// 获取地址成功
    			this.$emit('on-success', rs);

    			this.modalLoading = false;
    			this.modalShow = false;
    		}
    	}
  },
  mounted () {
    	this.init();
  }
}
</script>
