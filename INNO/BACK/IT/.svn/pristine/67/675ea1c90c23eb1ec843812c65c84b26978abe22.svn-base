<template>
    <div id="tagbar">
        <div ref="scrollCon" id="tagbar-scroll-con" @DOMMouseScroll="handlescroll" @mousewheel="handlescroll">
            <div ref="scrollBody" id="tagbar-scroll-body" :style="{left: tagBodyLeft + 'px'}">
                <transition-group ref="tagbarAnim" name="tagbar-anim" tag="div">
                    <Tag
                        ref="tags"
                        class="tagbar-item"
                        type="dot"
                        v-for="item in openedPagesTags"
                        :key="item.name"
                        :name="item.name"
                        :closable="tagCount>1"
                        :color="item.name===currentTag?'primary':'default'"
                        @click.native="linkTo(item)"
                        @on-close="closeTag"
                    >{{item.title}}</Tag>
                </transition-group>
            </div>
        </div>
        <div id="tagbar-btn">
            <Dropdown @on-click="handleTagsOption">
                <Button size="small" type="primary">标签选项</Button>
                <DropdownMenu slot="list">
                    <DropdownItem name="clearAll">关闭所有</DropdownItem>
                    <DropdownItem name="clearOthers">关闭其他</DropdownItem>
                </DropdownMenu>
            </Dropdown>
        </div>
    </div>
</template>
<style lang="less" scoped>
    #tagbar {
        width: 100%;
        height: 40px;
        display: flex;
        flex-direction: row;
        align-items: center;
    }
    #tagbar-btn {
        display: flex;
        flex-direction: row;
        align-items: center;
        height: 100%;
        flex: none;
        padding: 0 10px;
        box-shadow: -3px 0 15px 3px rgba(0, 0, 0, 0.1);
        z-index: 10;
    }
    #tagbar-scroll-con {
        position: relative;
        overflow: hidden;
        width: 100%;
        height: 100%;
    }
    #tagbar-scroll-body {
        position: absolute;
        white-space: nowrap;
        transition: left 0.3s ease;
        padding-left: 5px;
    }
    .tagbar-item {
        transition: all 0.5s ease-in-out;
    }
    .tagbar-anim-enter,
    .tagbar-anim-leave-to {
        opacity: 0;
    }
    .tagbar-anim-leave-active {
        position: absolute;
    }
</style>

<script>
import Sortable from "sortablejs";
import PageHelper from "@/helper/page-helper";
export default {
    name: "OpenedPageTags",
    data() {
        return {
            tagBodyLeft: 0
        };
    },
    computed: {
        openedPagesTags: {
            get() {
                return PageHelper.openedPagesTags;
            },
            set(tags) {
                return PageHelper.updateOpenedPageTag(tags);
            }
        },
        tagCount() {
            return (
                (this.openedPagesTags &&
                    Object.keys(this.openedPagesTags).length) ||
                0
            );
        },
        currentTag() {
            return this.$route.name;
        }
    },
    mounted() {
        Sortable.create(this.$refs.tagbarAnim.$el, {
            onEnd: event => {
                PageHelper.moveOpenedPageTag(event);
            }
        });
        this.moveToTag(this.currentTag);
    },
    methods: {
        linkTo(item) {
            item.params.source = "tags";
            this.$router.push(item);
        },
        closeTag(event, name) {
            PageHelper.removeOpenedPageTag({
                route: this.$route,
                name: name,
                cb: item => {
                    this.linkTo(item);
                }
            });
        },
        handleTagsOption(type) {
            PageHelper.clearOpenedPageTag({
                route: type === "clearOthers" ? this.$route : null,
                cb: item => {
                    this.linkTo(item);
                }
            });
        },
        handlescroll(e) {
            let type = e.type;
            let delta = 0;
            if (type === "DOMMouseScroll" || type === "mousewheel") {
                delta = e.wheelDelta ? e.wheelDelta : -(e.detail || 0) * 40;
            }
            let left = 0;
            if (delta > 0) {
                left = Math.min(0, this.tagBodyLeft + delta);
            } else {
                if (
                    this.$refs.scrollCon.offsetWidth <
                    this.$refs.scrollBody.offsetWidth
                ) {
                    if (
                        this.tagBodyLeft <
                        -(
                            this.$refs.scrollBody.offsetWidth -
                            this.$refs.scrollCon.offsetWidth
                        )
                    ) {
                        left = this.tagBodyLeft;
                    } else {
                        left = Math.max(
                            this.tagBodyLeft + delta,
                            this.$refs.scrollCon.offsetWidth -
                                this.$refs.scrollBody.offsetWidth
                        );
                    }
                } else {
                    this.tagBodyLeft = 0;
                }
            }
            this.tagBodyLeft = left;
        },
        moveToTag(tagName) {
            this.$nextTick(() => {
                let tags = this.$refs.tags;
                for (let i = 0, n = tags.length; i < n; i++) {
                    let tag = tags[i];
                    if (tagName === tag.name) {
                        this.moveToView(tag.$el);
                        break;
                    }
                }
            });
        },
        moveToView(tag) {
            if (this.tagBodyLeft < -tag.offsetLeft + 5) {
                // 标签在可视区域左侧
                this.tagBodyLeft = -tag.offsetLeft + 5;
            } else if (
                this.tagBodyLeft >
                this.$refs.scrollCon.offsetWidth -
                    tag.offsetLeft -
                    tag.offsetWidth -
                    5
            ) {
                // 标签在可视区域右侧
                this.tagBodyLeft =
                    this.$refs.scrollCon.offsetWidth -
                    tag.offsetLeft -
                    tag.offsetWidth -
                    5;
            } else {
                // 标签在可视区域
                this.tagBodyLeft = Math.min(
                    0,
                    this.$refs.scrollCon.offsetWidth -
                        tag.offsetLeft -
                        tag.offsetWidth -
                        5
                );
            }
        }
    },
    watch: {
        currentTag(name) {
            this.moveToTag(name);
        }
    }
};
</script>
