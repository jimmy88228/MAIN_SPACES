<template>
    <div :id="editorId"></div>
</template>
<script>
import tinymce from "tinymce/tinymce";

const INIT = 0;
const INPUT = 1;
const CHANGED = 2;

export default {
    name: "TinymceEditor",
    props: {
        id: {
            type: String
        },
        value: {
            type: String
        },
        setting: {
            type: Object
        }
    },
    data() {
        return {
            editorId: "",
            status: INIT,
            stayHtml: "<p></p>"
        };
    },
    watch: {
        value(newVal, oldVal) {
            this.setContent(newVal);
        }
    },
    mounted() {
        this.init();
    },
    beforeDestroy() {
        this.destroy();
    },
    methods: {
        init() {
            tinymce.baseURL = "./tinymce/";
            this.editorId ||
                (this.editorId = this.id || "Editer-" + new Date().getTime());
            this.$nextTick(() => {
                tinymce.init({
                    branding: false,
                    ...(this.setting || {}),
                    selector: `div#${this.editorId}`,
                    language: "zh_CN",
                    setup: editor => {
                        this.editor = editor;
                    },
                    init_instance_callback: editor => {
                        this.$emit("init");
                        editor.setContent(this.hold || "");
                        editor.on(
                            "input change undo redo execCommand KeyUp",
                            () => {
                                if (
                                    this.status === INPUT ||
                                    this.status === INIT
                                ) {
                                    return (this.status = CHANGED);
                                }
                                this.callChange(editor.getContent());
                            }
                        );
                        editor.on("NodeChange", () => {
                            this.callChange(editor.getContent());
                        });
                    },
                    images_dataimg_filter: (img) => {
                        img.style.width = "100%";
                        img.style.height = "auto";
                        return img;
                    },
                    paste_block_drop: true,
                    force_br_newlines : true,
                    force_p_newlines : true,
                    forced_root_block : '<p>',
                });
                //
                setTimeout(()=>{
                    //根据ID获取要操控元素
                    let deptObjs = document.getElementById(this.editorId +"_ifr").contentWindow.document.body;
                    //判断此元素是否存在
                    if(deptObjs != null){
                        //设置该元素的样式或其他属性
                        deptObjs.setAttribute('style',' padding-bottom: 30px !important;'); //!important用来提升指定样式条目的应用优先权
                    }
                },500)
            });
        },
        destroy() {
            if (this.editor) {
                this.editor.remove();
                this.editor = null;
            }
        },
        callChange(content) {
            content = content + this.stayHtml;
            if (content !== this.hold) {
                this.hold = content;
                this.$emit("input", this.hold || "");
            }
        },
        setContent(val) {
            this.hold = val;
            if (this.status === CHANGED) return (this.status = INPUT);
            if (this.editor && this.editor.initialized) {
                this.editor.setContent(this.hold || "");
            }
        },
        getContent() {
            return (this.editor && this.editor.getContent()) || "";
        },
        getBody() {
            let editBody = this.editor && this.editor.getBody();
            return (editBody && editBody.innerHTML) || "";
        }
    }
};
</script>
