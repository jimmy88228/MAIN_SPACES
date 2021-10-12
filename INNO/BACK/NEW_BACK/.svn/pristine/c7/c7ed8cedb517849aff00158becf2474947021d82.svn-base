<template>
  <div class="rich-text">
    <UEditor ref="ueditor" @on-content-change="onContentChange"></UEditor>
    <Spin size="large" fix v-if="spinShow"></Spin>
  </div>
</template>

<script>
import UEditor from '@/views/my-components/ueditor/ueditor.vue';

export default {
  name: 'RichText',
  props: {
	  // 这个参数最好不要用
	  richTextData:{
		  type:String,
		  default: '',
	  }
  },
  components:{
    UEditor
  },
  data () {
    return {
      // ueditor 配置
      ueditorConfig: {
        initialFrameWidth:680,
        initialFrameHeight: 480,
        autoFloatEnabled: false, // 取消工具条悬浮
        toolbars: [[
          'source', 'undo', 'redo', '|',
          'bold', 'italic', 'underline', 'fontborder', 'strikethrough', 'superscript', 'subscript', 'removeformat', 'formatmatch', 'autotypeset', 'blockquote', 'pasteplain',
          '|', 'forecolor', 'backcolor', 'insertorderedlist', 'insertunorderedlist', '|',
          'rowspacingtop', 'rowspacingbottom', 'lineheight', '|',
          'customstyle', 'paragraph', 'fontfamily', 'fontsize', '|',
          'directionalityltr', 'directionalityrtl', 'indent', '|', 'insertimage', '|',
          'justifyleft', 'justifycenter', 'justifyright', 'justifyjustify', '|',
          'link', 'unlink', 'anchor', '|',
          'horizontal', 'spechars'
        ]], // 工具条配置

        // 图片上传接口(必须初始会的)
        serverUrl: ''
      },
      spinShow: false
    }
  },
  watch: {

  },
  methods: {
    loadToolBar () {
      this.spinShow = true;
      return this.$ajax.post(this.$api.toolbar)
      .then(response => {
        const res = response.data;
        if (res.code) {
          this.ueditorConfig.toolbars = res.data.toolbars;
          // 初始化工具栏
          this.$refs.ueditor.init(this.ueditorConfig);
        }
        this.spinShow = false;
      });
    },
	initEditor( content ){
		setTimeout(()=>{
			var ue = this.$refs['ueditor'].getUE();
			ue.setContent( content );
		},1000);
	},
    onContentChange (content) {
      this.$emit('get-rich-text', content);
    }
  },
  mounted () {
    this.loadToolBar();
    this.$refs.ueditor.init(this.ueditorConfig);
  }
}
</script>

<style>

</style>
