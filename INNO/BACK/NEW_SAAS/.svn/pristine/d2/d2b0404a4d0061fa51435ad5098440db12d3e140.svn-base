<style lang="less">
body{
    font-family: '微软雅黑','宋体',Arial,sans-serif;
}
</style>

<template>
	<div>

		<!--忘记密码组件-->
	    <resetPwd ref="reset-pwd" @reset-success="resetSuccess"></resetPwd>

	</div>
</template>

<script>
import resetPwd from './reset-pwd';

/**
 * 独立的重设密码页面，
 * 提供给前端重设密码使用
 */
export default {
  components: {
 		resetPwd
  },
  data () {
    return {
    }
  },
  methods: {
    	init () {
    		// 打开忘记密码模态框
    		this.$refs['reset-pwd'].forgetPasswordModal('', true);
    	},
    	resetSuccess (obj) {
    		this.$Message.success('重设密码成功！请重新登录');
      this.$router.push('/logout');
    	}
  },
  mounted () {
    this.init();
  }
};
</script>
