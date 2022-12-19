// import "tinymce/themes/silver/theme";
import "tinymce/themes/silver";
import "tinymce/icons/default/icons"
import "tinymce/plugins/advlist";
import "tinymce/plugins/autolink";
import "tinymce/plugins/lists";
import "tinymce/plugins/link";
import "tinymce/plugins/image";
import "tinymce/plugins/charmap";
import "tinymce/plugins/print";
import "tinymce/plugins/preview";
import "tinymce/plugins/hr";
import "tinymce/plugins/pagebreak";
import "tinymce/plugins/searchreplace";
import "tinymce/plugins/visualblocks";
import "tinymce/plugins/visualchars";
import "tinymce/plugins/code";
import "tinymce/plugins/insertdatetime";
import "tinymce/plugins/media";
import "tinymce/plugins/nonbreaking";
import "tinymce/plugins/table";
import "tinymce/plugins/contextmenu";
import "tinymce/plugins/directionality";
// import "tinymce/plugins/paste";
import "tinymce/plugins/textcolor";
import "tinymce/plugins/colorpicker";
import "tinymce/plugins/textpattern";
import "tinymce/plugins/codesample";
import "tinymce/plugins/imagetools";
import "tinymce/plugins/wordcount";
import "tinymce/plugins/anchor";

import { MainApi } from "@/helper/manager/http-manager";

// const proxyGetUrl = MainApi.proxyGet.getUrl();

export default {
    height: 600,
    convert_urls: false,
    content_css: "/tinymce/skins/content/default/content.css",
    language_url: "/tinymce/langs/zh_CN.js",
    language: "zh_CN",
    skin_url: "/tinymce/skins/ui/oxide", //编辑器需要一个skin才能正常工作，所以要设置一个skin_url指向之前复制出来的skin文件
    plugins: [ // powerpaste,  // colorpicker contextmenu imagetools textcolor (these will be removed in TinyMCE 6.0)
        "advlist autolink  textpattern  wordcount",
        "searchreplace print preview visualblocks visualchars code directionality",
        "anchor link image media codesample lists table nonbreaking hr pagebreak charmap insertdatetime",
        "code paste"
    ],
    menubar: "file edit insert view format table tools",
    toolbar1:
        "undo redo | cut copy paste pastetext | fontselect fontsizeselect styleselect formatselect | searchreplace print preview | bold italic underline strikethrough | forecolor backcolor | alignleft aligncenter alignright alignjustify | outdent indent blockquote | ltr rtl | anchor link unlink image media codesample | bullist numlist table | subscript superscript | nonbreaking hr pagebreak charmap insertdatetime | openlink removeformat code",
    contextmenu: "cut copy paste | selectall | visualchars visualblocks",
    // image
    image_advtab: true,
    browser_spellcheck: true, // 拼写检查
    branding: false, // 去水印
    elementpath: false, //禁用编辑器底部的状态栏
    statusbar: false, // 隐藏编辑器底部的状态栏
    paste_data_images: true, // 允许粘贴图像
    paste_preprocess: function(plugin, args){
        console.log("plugin", plugin)
        console.log("plugin args", args)
        // let content = args.content;
    },
    images_upload_handler: (blobInfo, secc, fail) => {
        console.log("blobInfo", blobInfo)
        let file = blobInfo.blob();
        uploadImage
            .call(this, file)
            .then(url => {
                secc(url);
            })
            .catch(msg => {
                fail(msg || "上传失败");
            });
    },
    file_picker_callback:function(callback, value, meta){
        console.log("meta", meta);
        if(meta.filetype === "media"){
            let input = document.createElement("input");
            input.setAttribute("type", "file");
            input.setAttribute("accept", "video/mp4");
            input.onchange = function(){
                let file = this.files[0];
                uploadMeta(file).then((url)=>{
                    callback(url);
                })
            }
            input.click();
        } else if(meta.filetype === 'image'){
            let input = document.createElement("input");
            input.setAttribute("type", "file");
            input.setAttribute("accept", "image/jpg, image/jpeg, image/png");
            input.onchange = function(){
                let file = this.files[0];
                uploadImage(file).then((url)=>{
                    callback(url);
                })
            }
            input.click();
        }

    }
    // powerpaste
    // powerpaste_word_import: "prompt",
    // powerpaste_html_import: "prompt",
    // powerpaste_allow_local_images: true,
    // imagetools
    // imagetools_proxy: proxyGetUrl
};


// 图片
function uploadImage(file) {
    let formData = new FormData();
    formData.append("image", file, file.name);
    return MainApi.ImageUplode({
        data: formData,
    }).then(res => {
        if (res.code) {
            let src = res.data || "";
            return Promise.resolve(src);
        } else {
            return Promise.reject(res.message);
        }
    });
}

// 多媒体

function uploadMeta(file) {
    let formData = new FormData();
    formData.append("file_type", "video");
    formData.append("file", file, file.name);
    return MainApi.multimediaUplode({
        data: formData
    }).then(res => {
        if (res.code) {
            let data = res.data || {};
            return Promise.resolve(data.filePath);
        } else {
            return Promise.reject(res.msg);
        }
    });
  }