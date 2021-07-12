<style lang="less">
.message-view{
	.content-box{
		.title{
			font-size:16px;
			font-weight: bold;
			text-align: center;
		}
		.time{
			text-align: center;
			font-size: 12px;
		}
		.content{
			margin:20px 10px;
			font-size: 14px;
		}
	}
}
</style>

<template>
	<Card v-show="showView" class="message-view">

		<div slot="title">
			<Tooltip content="返回">
				<Icon type="ios-arrow-dropleft" @click="goBack" style="cursor: pointer;" size="28"/>
			</Tooltip>
		</div>
		<div slot="extra">
			<Button v-if="formItem.is_read == 0" type="primary" size="small" @click="updateIsRead">设为已读</Button>
		</div>

	    <div class="content-box">
	    	<div class="title">{{formItem.subject}}</div>
	    	<div class="time">{{formItem.created_at_format}}</div>
	    	<div class="content" v-html="formItem.content"></div>
	    </div>

	</Card>
</template>

<script>
/**
 * 站内消息 - 查看
 */
import util from '@/libs/util.js';

export default {
  name: 'messageView',
  components: {

  },
  data () {
    	return {
      showView: false,
      msgType: '',
      updateRead: false,

      // 表单内容
        	formItem: {
        		id: 0,
        		subject: '',
        		is_read: 0,
        		created_at_format: '',
        		content: ''
        	}

    	}
   	},
   	computed: {

   	},
   	methods: {
    	// 初始化
    	init () {

    	},
    	// 加载数据
    openModal (row, type) {
      this.showView = true;
      this.msgType = type;
      this.updateRead = false;

      this.formItem.id = row.id;
      this.formItem.is_read = row.is_read;
      this.formItem.subject = row.subject;
      this.formItem.created_at_format = row.created_at_format;
      this.formItem.content = row.content;
      this.created_at_format = row.created_at_format;

      document.querySelector('.message-list .ivu-tabs-bar').style.display = 'none';
    },
    // 设为已读
    updateIsRead () {
      // ajax 请求获取初始化数据，
        	util.ajax.post(util.apiUrl.userMessageEdit, {
        		id: this.formItem.id,
        		type: this.msgType
        	})
    		.then((response) => {
    			var res = response.data;
    			if (res.code) {
    				this.$Message.success('设置成功！');
    				this.formItem.is_read = 1;
    				this.updateRead = true;
    			} else {
    				this.$Message.error('设置失败！');
    			}
    		});
    },
    // 返回
    goBack () {
        	this.showView = false;
        	this.$emit('on-close', this.formItem.is_read, this.updateRead);
    }
  },
  watch: {

  },
  mounted () {
    	this.init();
  }
}
</script>
