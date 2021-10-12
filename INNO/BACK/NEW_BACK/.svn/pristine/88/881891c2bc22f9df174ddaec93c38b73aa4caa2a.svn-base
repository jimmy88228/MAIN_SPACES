<style lang="less">
</style>

<template>
	<div>

	</div>
</template>

<script>
/**
 * 登录过渡
 */
import Cookies from 'js-cookie';

export default {
  data () {
    	return {
    		code: ''
    	}
  },
  methods: {
    	init () {
    		// 获取传递过来code
    		this.code = this.$route.params.code;

    		// 记录code 到token
    		Cookies.set('accessToken', this.code);
    		this.$router.push('/home');
    	}
  },
  mounted () {
    this.init();
  }
};
</script>
