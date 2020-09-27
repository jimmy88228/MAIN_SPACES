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
            status: INIT
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
                    }
                });
            });
        },
        destroy() {
            if (this.editor) {
                this.editor.remove();
                this.editor = null;
            }
        },
        callChange(content) {
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
