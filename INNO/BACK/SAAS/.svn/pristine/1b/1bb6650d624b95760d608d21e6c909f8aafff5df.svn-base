<template>
    <div class="panel-base-style">
        <EditItem name="宽度" description="单位（px），0为自动适应">
            <div slot="edit" class="view-edit-item-mt df">
                <InputNumber size="large" v-model="width" clearable/>
            </div>
        </EditItem>
        <EditItem name="高度" description="单位（px），0为自动适应">
            <div slot="edit" class="view-edit-item-mt df">
                <InputNumber size="large" v-model="height" clearable/>
            </div>
        </EditItem>
        <EditItem name="内边距" description="单位（px）" label="上右下左">
            <div slot="edit" class="view-edit-item-mt df">
                <InputNumber slot="edit" size="large" v-model="paddingT" clearable/>
                <InputNumber slot="edit" size="large" v-model="paddingR" clearable/>
                <InputNumber slot="edit" size="large" v-model="paddingB" clearable/>
                <InputNumber slot="edit" size="large" v-model="paddingL" clearable/>
            </div>
        </EditItem>
        <EditItem name="外边距" description="单位（px）" label="上右下左">
            <div slot="edit" class="view-edit-item-mt df">
                <InputNumber slot="edit" size="large" v-model="marginT" clearable/>
                <InputNumber slot="edit" size="large" v-model="marginR" clearable/>
                <InputNumber slot="edit" size="large" v-model="marginB" clearable/>
                <InputNumber slot="edit" size="large" v-model="marginL" clearable/>
            </div>
        </EditItem>
        <EditItem name="其他样式" description="遵循css规范">
            <Input slot="edit" size="large" type="textarea" :autosize="true" v-model="other" clearable/>
        </EditItem>
    </div>
</template>

<script>
import EditItem from "@/support/components/edit-item";
import PanelMixin from "./panel-mixin.js";
export default {
    name: "BaseStylePanel",
    mixins: [PanelMixin],
    components: { EditItem },
    computed: {
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
    .view-edit-item-mt {
        display: flex;
        flex-direction: row;
        > * {
            margin-left: 10px;
        }
        :first-child {
            margin-left: 0;
        }
    }
    .view-edit-item-mt.df {
        width: 100%;
        > * {
            width: 100%;
            flex: 1;
        }
    }
</style>
