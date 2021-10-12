<style lang="less">
</style>

<template>
	<div></div>
</template>

<script>
/**
 * 异步处理
 */
export default {
  name: 'mqNotice',
  components: {

  },
  data () {
    	return {
    		jobId: 0,
      percent: 0,

      // 停止ajax 加载刷新进度
      stopLoad: false,

      // 下载文件地址
        	downloadUrl: '',
        	downloadShow: 'none',

        	// 处理结果
        	resultMsg: '',
        	resultMsgShow: 'none',
        	resultMsgColor: 'auto',

        	// 检查job进度的时间
      second: 5000,
      type: 'download'
    	}
  },
  methods: {
    	// 初始化
    	init () {
    	},
    	showNotice (jobId, type = 'download') {
      // download 显示下载链接
      // none 隐藏链接
      this.jobId = jobId;
      this.percent = 0;
      this.downloadUrl = '';
      this.downloadShow = 'none';
      this.resultMsg = '';
        	this.resultMsgShow = 'none';
        	this.resultMsgColor = 'auto';
      this.stopLoad = false;
      this.type = type;
    		this.$Notice.info({
    			duration: 0,
    			title: '正在处理任务',
    			onClose: () => {
            // 关闭事件的处理
            if( this.percent < 100 ){

            }
            this.stopLoad = true;
            
            this.$Modal.info({
            	title: '操作提示',
            	content: '关闭后，可以在菜单 "设置 - 基本设置 - 任务日志" 找到这个任务'
            });
    			},
    			render: h => {
          return h('div', [
                    	// 进度条
                    	h('Progress', {
                    		props: {
                    			percent: this.percent
                    		}
                    	}),

                    	// 下载提示
                    	h('a', {
                    		style: {
                    			display: this.downloadShow,
                    			marginTop: '5px'
                    		},
                    		on: {
                click: () => {
                  window.open(this.downloadUrl);
                }
              }
                    	}, '下载'),

                    	// 消息提示
                    	h('strong', {
                    		style: {
                    			display: this.resultMsgShow,
                    			marginTop: '5px',
                    			color: this.resultMsgColor
                    		}
                    	}, this.resultMsg)
          ]);
        }
    		});
    		
			// 监听进度
    		this.checkProgress();
    	},
    	// 检查进度
    	checkProgress () {
    		// n 秒一次检查进度
    		window.setTimeout(() => {
    			if (this.percent < 100 && this.stopLoad == false) {
    				// ajax 请求获取初始化数据，然后动态更新下面数据源
		        	this.$ajax.post( this.$api.mqProgress, {
		        		job_id: this.jobId,
		        	})
		    		.then((response) => {
		    			this.tableLoading = false;
		    			var res = response.data;

		    			if (res.code) {
		    				this.percent = res.data.percent;

		    				if (this.percent >= 100) {
                  this.percent > 100 ? this.percent = 100 : '';
		    					if (res.data.isDownload) {
                    // 下载完毕
                    if (this.type == 'download') this.downloadShow = 'block';
                    this.downloadUrl = res.data.downloadUrl;
                    this.$emit('finish');
		    					} else {
		    						this.resultMsgShow = 'block';
		    						this.resultMsg = res.data.message;
		    						this.resultMsgColor = 'red';
		    					}
								
								// 通知父组件，处理完毕
								this.$emit('on-success');
		    				}

		    				// 递归处理
                this.checkProgress();
		    			} else {
		    				// 进度出错提示
		    				this.resultMsgShow = 'block';
		    				this.resultMsg = res.message;
		    				this.resultMsgColor = 'red';
		    			}
            });
    			}
    		}, this.second);
    	}
  },
  mounted () {
    	this.init();
  }
}
</script>
