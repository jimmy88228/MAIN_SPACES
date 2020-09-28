<template>
    <div class="edit-panel" v-bar>
        <div class="edit-panel-box padding20">
            <template v-if="node">
                <h2 class="view-panel-title">{{typeName}}</h2>
                <Alert show-icon>面板尺寸以750px为基准</Alert>
                <EditItem name="组件名" label="必填">
                    <Input slot="edit" size="large" v-model="viewName" clearable />
                </EditItem>
                <BaseStylePanel :node="node"/>
                <ImgPanel v-if="type==viewType.Img" :node="node" />
                <GroupPanel v-if="type==viewType.Group" :node="node" />
                <GalleryPanel v-if="type==viewType.Gallery" :node="node" />
            </template>
        </div>

    </div>
</template>

<script>
import EditItem from "@/support/components/edit-item";
import BaseStylePanel from "./base-style-panel";
import ImgPanel from "./img-panel";
import GroupPanel from "./group-panel";
import GalleryPanel from "./gallery-panel";
import PanelMixin from "./panel-mixin.js";
import Vue from "vue";

export default {
    name: "EditPanel",
    mixins: [PanelMixin],
    components: { EditItem, ImgPanel, GroupPanel, GalleryPanel, BaseStylePanel },
    computed: {
        viewName: {
            get() {
                return this.nodeData.name || "";
            },
            set(val) {
                Vue.set(this.nodeData, "name", val || "");
            }
        },
        width: {
            get() {
                return this.style.width || 0;
            },
            set(val) {
                this.style = { width: val || 0 };
            }
        },
        height: {
            get() {
                return this.style.height || 0;
            },
            set(val) {
                this.style = { height: val || 0 };
            }
        },
        padding: {
            get() {
                return this.style.padding || [0, 0, 0, 0];
            },
            set(val) {
                let p = this.style.padding || [0, 0, 0, 0];
                for (let key in val) {
                    if (key === "t") {
                        p[0] = val["t"];
                    } else if (key === "r") {
                        p[1] = val["r"];
                    } else if (key === "b") {
                        p[2] = val["b"];
                    } else if (key === "l") {
                        p[3] = val["l"];
                    }
                }
                this.style = { padding: [...p] };
            }
        },
        paddingT: {
            get() {
                return this.padding[0] || 0;
            },
            set(val) {
                this.padding = { t: val || 0 };
            }
        },
        paddingR: {
            get() {
                return this.padding[1] || 0;
            },
            set(val) {
                this.padding = { r: val || 0 };
            }
        },
        paddingB: {
            get() {
                return this.padding[2] || 0;
            },
            set(val) {
                this.padding = { b: val || 0 };
            }
        },
        paddingL: {
            get() {
                return this.padding[3] || 0;
            },
            set(val) {
                this.padding = { l: val || 0 };
            }
        },
        margin: {
            get() {
                return this.style.margin || [0, 0, 0, 0];
            },
            set(val) {
                let m = this.style.margin || [0, 0, 0, 0];
                for (let key in val) {
                    if (key === "t") {
                        m[0] = val["t"];
                    } else if (key === "r") {
                        m[1] = val["r"];
                    } else if (key === "b") {
                        m[2] = val["b"];
                    } else if (key === "l") {
                        m[3] = val["l"];
                    }
                }
                this.style = { margin: [...m] };
            }
        },
        marginT: {
            get() {
                return this.margin[0] || 0;
            },
            set(val) {
                this.margin = { t: val || 0 };
            }
        },
        marginR: {
            get() {
                return this.margin[1] || 0;
            },
            set(val) {
                this.margin = { r: val || 0 };
            }
        },
        marginB: {
            get() {
                return this.margin[2] || 0;
            },
            set(val) {
                this.margin = { b: val || 0 };
            }
        },
        marginL: {
            get() {
                return this.margin[3] || 0;
            },
            set(val) {
                this.margin = { l: val || 0 };
            }
        },
        other: {
            get() {
                return this.style.other || "";
            },
            set(val) {
                this.style = { other: val };
            }
        }
    }
};
</script>

<style lang="less" scoped>
    .edit-panel {
        width: 500px;
        height: 100%;
    }

    .edit-panel-box {
        width: 100%;
        overflow-x: hidden;
        > * {
            width: 100%;
            margin-top: 10px;
        }
        :first-child {
            margin-top: 0;
        }
    }
</style>
