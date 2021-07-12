<style lang="less">
.password-strong{
	.ivu-form-item{
		margin-bottom:0;
	}
}
</style>

<template>
	<div class="password-strong">
		<FormItem>
		<Progress v-if="showProgress" :percent="progressPercent" :stroke-width="5" status="active">
			<span :style="'color:'+progressColor">{{progressTxt}}</span>
		</Progress>
		</FormItem>
	</div>
</template>

<script>
/**
 * 密码强度提示组件
 */
export default {
  name: 'passwordString',
  components: {

  },
  data () {
    	return {
    		showProgress: false,
    		progressColor: '',
    		progressTxt: '',
    		progressPercent: 0
    	}
  },
  methods: {
    	init () {
    	},
    	// 提供给父级调用
    	initSet (sValue) {
    		this.showProgress = true;

    		var modes = 0;
      // 正则表达式验证符合要求的
      if (sValue.length < 1) modes = 0;
      if (/\d/.test(sValue)) modes++; // 数字
      if (/[a-z]/.test(sValue)) modes++; // 小写
      if (/[A-Z]/.test(sValue)) modes++; // 大写
      if (/\W/.test(sValue)) modes++; // 特殊字符

      // 逻辑处理
      switch (modes) {
        case 0:
          this.progressTxt = '空';
          this.progressColor = 'red';
          this.progressPercent = 0;
          break;

			    case 1:
			    	this.progressTxt = '很弱';
			    	this.progressColor = 'orangred';
			    	this.progressPercent = 25;
			    	break;

			    case 2:
			    	this.progressTxt = '中等';
			    	this.progressColor = 'orange';
			    	this.progressPercent = 50;
			    	break;

			    case 3:
			    	this.progressTxt = '强';
			    	this.progressColor = 'green';
			    	this.progressPercent = 75;
			    	break;

			    case 4:
			    	this.progressTxt = '很强';
			    	this.progressColor = 'green';
			    	this.progressPercent = 100;
			    	break;
      }
      return modes;
    	}
  },
  mounted () {
    this.init();
  }
}
</script>
