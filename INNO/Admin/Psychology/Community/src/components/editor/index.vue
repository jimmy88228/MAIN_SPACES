<template>
    <div class="editor-box spin-box">
        <Editor ref="editor" class="editor" :value="value" :setting="editSetting" @init="onInit" @input="onInput"></Editor>
        <Spin fix v-if="spinShow">
            <Icon type="load-c" size="18" class="demo-spin-icon-load"></Icon>
            <div>加载组件中...</div>
        </Spin>
    </div>
</template>
<script>
import Editor from "@/support/components/editor";
import DefEditSetting from "./def-edit-setting";

export default {
    name: "DefEditor",
    components: { Editor },
    props: {
        value: String,
        setting: {
            type: Object,
            default:()=>{ return {} }
        }
    },
    data() {
        return {
            editSetting: DefEditSetting,
            spinShow: true
        };
    },
    methods: {
        onInit() {
            this.spinShow = false;
        },
        onInput(html) {
            this.$emit("input", html);
        },
        resetContent(val) {
            this.$refs.editor.setContent(val);
        }
    }
};
</script>

<style lang="less" scoped>
    .editor-box {
        width: 100%;
        min-height: 300px;
    }
    .editor {
        width: 100%;
    }
</style>
