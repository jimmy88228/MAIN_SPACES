<style lang="less">

</style>

<template>
	<div>
	    <script id="ueditor" type="text/plain"></script>
	</div>
</template>

<script>
import '../../../../static/ueditor/ueditor.config';
import '../../../../static/ueditor/ueditor.all.min.js';
import '../../../../static/ueditor/lang/zh-cn/zh-cn.js';

export default {
  name: 'UEditor',
  props: {

  },
  data () {
    return {
      	// ueditor 对象
      editor: null
    }
  },
  mounted () {

  },
  destoryed () {
    this.editor.destory();
  },
  methods: {
    	// 初始化UE,在配置加载完毕才进行初始化
    	init (config) {
        // 防止第二次渲染不出编辑器，所以需要清理一次

		    UE.delEditor('ueditor');
		    var ue = this.editor = UE.getEditor('ueditor',config);

        // 当内容有变化，返回给父组件
        ue.addListener('contentChange', (type) => {
          this.$emit('on-content-change', this.getUEContent() );
        });

    	},
    	// 定义方法用于返回编辑器内容
    	getUEContent () {
        return this.editor.getContent();
    	},
    	getUE () {
    		return this.editor;
    	}
  }
};
</script>
