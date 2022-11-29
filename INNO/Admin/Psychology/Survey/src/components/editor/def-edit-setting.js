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

function uploadImage(blobInfo) {
    let param = new FormData();
    let file = blobInfo.blob();
    param.append("file", file, file.name);
    return MainApi.uploadImage({
        params: {
            type: "ARTICLE"
        },
        data: param
    }).then(res => {
        if (res.code === "1") {
            let pa = res.data[0];
            if (pa.code === "1") {
                return Promise.resolve(pa.data);
            } else {
                return Promise.reject(pa.msg);
            }
        } else {
            return Promise.reject(res.msg);
        }
    });
}

const proxyGetUrl = MainApi.proxyGet.getUrl();

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
        "anchor link image media codesample lists table nonbreaking hr pagebreak charmap insertdatetime"
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
    images_upload_handler: (blobInfo, secc, fail) => {
        uploadImage
            .call(this, blobInfo)
            .then(url => {
                secc(url);
            })
            .catch(msg => {
                fail(msg || "上传失败");
            });
    },
    // powerpaste
    // powerpaste_word_import: "prompt",
    // powerpaste_html_import: "prompt",
    // powerpaste_allow_local_images: true,
    // imagetools
    imagetools_proxy: proxyGetUrl
};
