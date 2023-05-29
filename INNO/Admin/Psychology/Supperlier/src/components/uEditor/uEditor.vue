<style lang="less">

</style>

<template>
	<div>
	    <script id="ueditor" type="text/plain"></script>
	</div>
</template>

<script>
import Conf from "@/config/index.js";
import '/public/ueditor/ueditor.config';
// import '/public/ueditor/ueditor.all.min.js';
import '/public/ueditor/ueditor.all.js';
import '/public/ueditor/lang/zh-cn/zh-cn.js';
// import '/public/ueditor/ueditor.parse.min.js';
// import '@/helper/extend/ueditor/rewrite-ueditor.js'
import httpApi from "@/helper/manager/http-api.js";

export default {
  name: 'UEditor',
  props: {

  },
  data () {
    return {
      	// ueditor 对象
      editor: null,
      config: {
        "initialFrameWidth": 415,
				"initialFrameHeight": 500,
				"autoFloatEnabled":true,
        "zIndex": 7,
        "enableAutoSave": true,
        "autoHeightEnabled": true,
        "toolbars":[['source', '|', 'undo', 'redo', '|',"bold","italic","underline","strikethrough","autotypeset","blockquote","|","forecolor","backcolor","insertorderedlist","insertunorderedlist","|","rowspacingtop","rowspacingbottom","lineheight","|","customstyle","paragraph","fontfamily","fontsize","|","justifyleft","justifycenter","justifyright","justifyjustify","|","customimage","|","inserttable","deletetable","insertparagraphbeforetable","insertrow","deleterow","insertcol","deletecol","mergecells","mergeright","mergedown","splittocells","splittorows","splittocols","charts"]],
        "serverUrl": Conf.API_DOMIN,
        "imageUrl": httpApi.ImageUplode.u,
        "serverparam": {
          a: "post"
        }
      }
    }
  },
  mounted () {
    this.initEvent();
  },
  destoryed () {
    this.editor.destory();
  },
  methods: {
    	// 初始化UE,在配置加载完毕才进行初始化
    	init (config) {
        // 防止第二次渲染不出编辑器，所以需要清理一次
		    UE.delEditor('ueditor');
        config = config ? { ...this.config, ...config } : this.config;
		    var ue = this.editor = UE.getEditor('ueditor', config);
        // // 当内容有变化，返回给父组件
        ue.addListener('contentChange', (type) => {
          this.$emit('on-content-change', this.getUEContent() );
        });
    	},
      initEvent(){
        // 监听ueditor 点击编辑发出的事件，
			  window.addEventListener('customimageEvent', this.imgHandler);
        window.addEventListener('insertvideoEvent', this.videoHandler);
      },
      imgHandler(evt){
        let ueditorObj = evt.detail.obj;
        this.$UIModule({
            mode: "upload-view",
            props: {
                isMulti: true,
            },
            options: {},
            success:(data)=>{
              if(data.length > 0){
                let content = ""
                data.map((item)=>{
                  let img = '<img src="' + item + '" class="default-image" style="width:100%" />'
                  content = content ? content + img : img;
                })
                ueditorObj.focus();
                ueditorObj.execCommand('inserthtml', content);
              }
            }
        });
      },
      videoHandler(evt){
        let ueditorObj = evt.detail.obj;
        this.$UIModule({
            mode: "upload-view",
            props: {
                isMulti: true,
            },
            options: {},
            success:(data)=>{
              if(data.length > 0){
                let content = ""
                data.map((item)=>{
                  let img = '<img src="' + item + '" class="default-image" style="width:100%" />'
                  content = content ? content + img : img;
                })
                ueditorObj.focus();
                ueditorObj.execCommand('inserthtml', content);
              }
            }
        });
      },
    	// 定义方法用于返回编辑器内容
    	getUEContent () {
        return this.editor.getContent();
    	},
    	getUE () {
        if(!this.editor){
          this.init();
        }
    		return this.editor;
    	},
  },
  destroyed(){
    window.removeEventListener('customimageEvent', this.imgHandler);
    window.removeEventListener('insertvideoEvent', this.videoHandler);
  }
};
</script>
