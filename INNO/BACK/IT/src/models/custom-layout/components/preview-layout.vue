<template>
    <div class="preview-layout" v-bar>
        <div ref="scrollCev" class="preview-layout-cev">
            <template v-for="(item,index) in moduleList">
                <div class="module-box" :key="index" v-if="item.enable!=0">
                    <Module :module-node="item.moduleNode" @click.native="selectedModule(index,false)" :root-width="450"/>
                    <Border v-if="index===selectedIndex" :text="item.name" :selected="true"/>
                </div>
            </template>
        </div>
    </div>
</template>

<script>
import Module from "./module";
import Border from "./base/border";
import $ from "jquery";

export default {
    name: "LayoutPreview",
    components: { Module, Border },
    props: ["moduleList", "rootWidth"],
    data() {
        return {
            rootNodes: {},
            selectedIndex: -1
        };
    },
    methods: {
        selectedModule(index, scrollTo = true) {
            if (index < 0) {
                this.selectedIndex = -1;
                return;
            }
            let childs = this.$refs.scrollCev.childNodes;
            if (index > childs.length - 1) {
                this.selectedIndex = -1;
                return;
            }
            this.selectedIndex = index;
            if (scrollTo) {
                let parent = this.$refs.scrollCev.parentNode;
                $(parent)
                    .stop()
                    .animate(
                        { scrollTop: childs[this.selectedIndex].offsetTop },
                        300
                    );
            }
        }
    }
};
</script>
<style lang="less">
    .preview-layout.eb {
        > .eb-bar-h,
        > .eb-bar-v {
            z-index: 4;
        }
    }
</style>
<style lang="less" scoped>
    .preview-layout {
        width: 450px;
        height: 100%;
        background-color: #efefef;
    }
    .preview-layout-cev {
        width: 100%;
        overflow: hidden;
    }
    .module-box {
        position: relative;
        width: 100%;
        height: auto;
    }
</style>
