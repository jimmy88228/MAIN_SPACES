<template>
    <div class="panel-jump" v-if="node">
        <EditItem name="跳转方式">
            <RadioGroup slot="edit" v-model="skipType">
                <!-- <Radio label="None">无</Radio> -->
                <Radio label="Web">小程序内嵌页</Radio>
                <Radio label="Page">当前小程序页</Radio>
                <Radio label="Outer">外部小程序</Radio>
            </RadioGroup>
        </EditItem>
        <EditItem v-if="skipType!=='None'" name="跳转路径">
            <Input slot="edit" size="large" v-model="path" clearable/>
        </EditItem>
        <EditItem v-if="skipType==='Outer'" name="小程序appid">
            <Input slot="edit" size="large" v-model="appId" clearable/>
        </EditItem>
        <EditItem name="点击统计标识" v-if="false">
            <Input slot="edit" size="large" v-model="statName" clearable/>
        </EditItem>
    </div>
</template>
<script>
import EditItem from "@/support/components/edit-item";
import PanelMixin from "./panel-mixin.js";
export default {
    name: "GalleryItemPanel",
    mixins: [PanelMixin],
    components: { EditItem },
    computed: {
        skipType: {
            get() {
                return this.params.type || "";
            },
            set(val) {
                this.params = { type: val || "" };
            }
        },
        path: {
            get() {
                return this.params.path || "";
            },
            set(val) {
                this.params = { path: val || "" };
            }
        },
        appId: {
            get() {
                return this.params.appId || "";
            },
            set(val) {
                this.params = { appId: val || "" };
            }
        },
        cateId: {
            get() {
                return this.params.cateId || "";
            },
            set(val) {
                this.params = { cateId: val || "" };
            }
        },
        statName: {
            get() {
                return this.params.statName || "";
            },
            set(val) {
                this.params = { statName: val || "" };
            }
        }
    },
    methods: {
        del() {
            this.node.removeFromParent();
        }
    }
};
</script>
<style lang="less" scoped>
    .panel-jump {
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
