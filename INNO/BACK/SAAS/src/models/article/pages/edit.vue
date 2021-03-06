<template>
    <div class="bg-page cev-root spin-box flex-column">
        <div class="cev-root flex-auto" v-bar>
            <div class="bg-shadow padding20">
                <div class="cev-max-width">
                    <div class="edit-body">
                        <EditItem name="标题" label="必填" description="最多50个字">
                            <Input size="large" class="inputable" slot="edit" v-model="title" clearable/>
                        </EditItem>
                        <EditItem name="索引名" label="非必填" description="最多20个字">
                            <Input size="large" class="inputable" slot="edit" v-model="name" clearable/>
                        </EditItem>
                        <EditItem name="编辑者" label="非必填" description="最多20个字">
                            <Input size="large" class="inputable" slot="edit" v-model="author" clearable/>
                        </EditItem>
                        <EditItem name="内容" full>
                            <Editor slot="edit" ref="editor" v-model="content"></Editor>
                        </EditItem>
                    </div>
                </div>
            </div>
        </div>
        <div class="bg-bottom-toolbar flex-fixed padding10">
            <div class="cev-toolbar end cev-max-width">
                <Button type="primary" size="large" @click="submit">保存</Button>
            </div>
        </div>
        <Spin v-if="loading" class="spin" size="large" fix></Spin>
    </div>
</template>
<script>
import StringHelper from "@/helper/utils/string-util";
import { MainApi } from "@/helper/manager/http-manager";
import Editor from "@/components/editor/index";
import EditItem from "@/support/components/edit-item";

export default {
    name: "ArticleAddOrEdit",
    components: { Editor, EditItem },
    data() {
        return {
            id: null,
            data: null,
            isAdd: false,
            loading: false
        };
    },
    computed: {
        mainData: {
            get() {
                return this.data || {};
            },
            set(val) {
                this.vueDataMerge(this.data || (this.data = {}), val);
            }
        },
        title: {
            get() {
                return this.mainData.title || "";
            },
            set(val) {
                this.mainData = { title: val || "" };
            }
        },
        name: {
            get() {
                return this.mainData.name || "";
            },
            set(val) {
                this.mainData = { name: val || "" };
            }
        },
        author: {
            get() {
                return this.mainData.author || "";
            },
            set(val) {
                this.mainData = { author: val || "" };
            }
        },
        content: {
            get() {
                return this.mainData.content || "";
            },
            set(val) {
                this.mainData = { content: val || "" };
            }
        }
    },
    mounted() {
        this.isAdd = !!this.$route.meta.isAdd;
        if (this.isAdd) {
            this.id = null;
            this.data = null;
        } else {
            this.id = this.$route.query.id;
            this.loadData();
        }
    },
    methods: {
        loadData() {
            this.loading = true;
            MainApi.getArticle({
                data: {
                    id: this.id
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
                    if (StringHelper.trim(msg)) {
                        this.$Message.error(msg || "数据加载失败");
                    }
                })
                .finally(() => {
                    this.loading = false;
                });
        },
        submit() {
            let isAdd = this.isAdd;
            let data = {};
            if (!isAdd) {
                data.id = this.id;
            }
            if (StringHelper.trim(this.title)) {
                data.title = this.title;
            }
            if (StringHelper.trim(this.name)) {
                data.name = this.name;
            }
            if (StringHelper.trim(this.author)) {
                data.author = this.author;
            }
            if (StringHelper.trim(this.content)) {
                data.content = this.content;
            }
            this.loading = true;
            (isAdd ? MainApi.postArticleAdd : MainApi.postArticleUpdate)({
                data: data
            })
                .then(res => {
                    if (res.code === "1") {
                        this.$Message.success("提交成功");
                        this.$router.back();
                    } else {
                        return Promise.reject(res.msg);
                    }
                })
                .catch(msg => {
                    if (StringHelper.trim(msg)) {
                        this.$Message.error(msg || "提交失败");
                    }
                })
                .finally(() => {
                    this.loading = false;
                });
        }
    }
};
</script>
