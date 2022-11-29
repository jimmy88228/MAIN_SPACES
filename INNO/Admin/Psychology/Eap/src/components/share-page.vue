<template>
    <Modal class-name="modal-share" title="分享设置" :value="isShow" @input="input" fullscreen footer-hide transfer>
        <div class="cev-root spin-box flex-column">
            <div class="edit-body-rect edit-body flex-auto">
                <EditItem name="分享图片">
                    <UploadImage slot="edit" :imgs.sync="data.sharePicture" type="SHARE" single></UploadImage>
                </EditItem>
                <EditItem name="分享标题">
                    <Input slot="edit" class="inputable" size="large" v-model="data.shareTitle" clearable/>
                </EditItem>
                <EditItem name="分享内容" v-if="mOptions.content">
                    <Input slot="edit" class="inputable" size="large" v-model="data.shareContent" clearable/>
                </EditItem>
                <EditItem name="分享路径" v-if="mOptions.path">
                    <Input slot="edit" class="inputable" size="large" v-model="data.sharePath" clearable/>
                </EditItem>
            </div>
            <div class="cev-toolbar end flex-fixed">
                <Button size="large" type="primary" @click="submit">确认</Button>
            </div>
        </div>
    </Modal>
</template>
<script>
import UploadImage from "@/components/upload-img-group";
import EditItem from "@/support/components/edit-item";
import { MainApi } from "@/helper/manager/http-manager";
import BaseDialog from "@/support/components/dialog/base-dialog";

export default {
    mixins: [BaseDialog],
    props: ["relatedId", "relatedType", "options"],
    data() {
        return {
            data: {}
        };
    },
    components: { UploadImage, EditItem },
    computed: {
        mOptions() {
            return this.options || {};
        }
    },
    methods: {
        loadData() {
            this.loading = true;
            MainApi.postShareConfig({
                data: {
                    relatedId: this.relatedId,
                    relatedType: this.relatedType
                }
            })
                .then(res => {
                    if (res.code === "1") {
                        this.data = { ...res.data };
                    } else {
                        return Promise.reject(res.msg);
                    }
                })
                .catch(msg => {
                    this.$Message.error(msg || "数据加载失败");
                })
                .finally(() => {
                    this.loading = false;
                });
        },
        submit() {
            this.$emit("share-all", this.data);
            MainApi.postAddShare({
                data: {
                    title: this.data.shareTitle,
                    content: this.data.shareContent,
                    picture: this.data.sharePicture,
                    path: this.data.sharePath,
                    relatedType: this.relatedType,
                    relatedId: Number(this.relatedId)
                }
            })
                .then(res => {
                    if (res.code === "1") {
                        this.$Message.success("提交成功");
                        this.dismiss();
                    } else {
                        return Promise.reject(res.msg);
                    }
                })
                .catch(msg => {
                    this.$Message.error(msg || "数据加载失败");
                })
                .finally(() => {
                    this.loading = false;
                });
        },
        showShare() {
            this.data = {};
            this.$nextTick(() => {
                this.loadData();
                this.show();
            });
        }
    }
};
</script>
<style lang="less">
    .modal-share {
        left: 50%;
        top: 50%;
        transform: translate(-50%, -50%);
        width: 700px;
        height: 550px;
    }
</style>
