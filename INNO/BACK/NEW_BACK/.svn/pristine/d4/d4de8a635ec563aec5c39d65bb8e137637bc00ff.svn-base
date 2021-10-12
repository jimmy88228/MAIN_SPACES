<style lang="less">
.reg-rslog{
	.log-box{
		max-height:360px;
		overflow: hidden auto;
		margin: auto 50px;

		.time{
	        font-size: 14px;
	        font-weight: bold;
	    }
	    .content{
	        padding-left: 5px;
	        padding-top:10px;

	        .txt{
	        	color:red;
	        }

	    }
	    .txt{
        	color:red;
        }
	}
}
</style>

<template>
	<div class="reg-rslog">
    	<div class="log-box">
	    	<Timeline>
		        <TimelineItem v-for="(item,index) in list" :name="index" :key="index" color="green">
		            <p class="time">{{item.created_at_format}} <span class="txt">{{item.status_format}}</span></p>
		            <div class="content">审核结果：<span class="txt" v-html="item.remark"></span></div>
		        </TimelineItem>

		        <TimelineItem color="green">
		        	<p class="time">{{beginTime}}</p>
		        	<div class="content">注册完成</div>
		        </TimelineItem>
	    	</Timeline>
    	</div>

	    <Divider />

	    <div class="btn-box">
	    	<Button type="primary" @click="goPreStep">返回上一步 修改资料</Button>
	    </div>
    </div>

</template>

<script>
export default {
  name: 'registerResultLog',
  components: {

  },
  data () {
    	return {
    		list: [],
    		beginTime: ''
    	}
  },
  methods: {
    	init () {

    	},
    	// 提供给父组件使用的方法
    	initSet (res) {
    		this.list = res.data.get_verify_log;
    		this.beginTime = res.data.created_at_format;
    	},
    	// 上一步
    	goPreStep () {
    		this.$emit('pre-step', {});
    	}
  },
  mounted () {
    this.init();
  }
};
</script>
