<template>
  <div id="tagbar" class="tags-con">
    <div
      ref="scrollCon"
      id="tagbar-scroll-con"
      @DOMMouseScroll="handlescroll"
      @mousewheel="handlescroll"
      class="tags-outer-scroll-con"
    >
      <div class="left-btn" @click="toScroll(240)">
        <Icon type="ios-arrow-back" size="18"></Icon>
      </div>
      <div class="right-btn" @click="toScroll(-240)">
        <Icon type="ios-arrow-forward" size="18"></Icon>
      </div>
      <div class="close-all-tag-con" id="tagbar-btn">
        <Dropdown transfer @on-click="handleTagsOption">
          <Icon type="ios-arrow-down" size="18"></Icon>
          <DropdownMenu slot="list">
            <DropdownItem name="clearAll">关闭所有</DropdownItem>
            <DropdownItem name="clearOthers">关闭其他</DropdownItem>
          </DropdownMenu>
        </Dropdown>
      </div>
      <div
        ref="scrollBody"
        id="tagbar-scroll-body"
        class="tags-inner-scroll-body"
        :style="{ left: tagBodyLeft + 'px' }"
      >
        <transition-group ref="tagbarAnim" name="tagbar-anim" tag="div">
          <Tag
            ref="tags"
            class="tagbar-item"
            type="dot"
            v-for="item in openedPagesTags"
            :key="item.name"
            :name="item.name"
            :closable="tagCount > 1"
            :color="item.name === currentTag ? 'primary' : 'default'"
            @click.native="linkTo(item)"
            @on-close="closeTag"
            >{{ item.title }}</Tag
          >
        </transition-group>
      </div>
    </div>
  </div>
</template>
<style lang="less" scoped>
.tags-con {
  height: 42px;
  overflow: hidden;
  background: #fff;
  border-left: 2px solid #f0f0f0;
  border-bottom: 1px solid #f0f0f0;
}
.tags-outer-scroll-con {
  position: relative;
  box-sizing: border-box;
  padding-right: 45px;
  padding-left: 20px;
  width: 100%;
  height: 100%;
  background-color: #fff;
}
.tags-outer-scroll-con .left-btn {
  position: absolute;
  left: 0;
  top: 0;
  box-sizing: border-box;
  padding-top: 10px;
  text-align: center;
  width: 20px;
  height: 100%;
  background-color: #fff;
  z-index: 10;
  cursor: pointer;
  box-shadow: -3px 0 15px 3px rgba(0, 0, 0, 0.1);
}
.tags-outer-scroll-con .right-btn {
  position: absolute;
  right: 35px;
  top: 0;
  box-sizing: border-box;
  padding-top: 10px;
  text-align: center;
  width: 25px;
  height: 100%;
  background-color: #fff;
  z-index: 10;
  cursor: pointer;
}
.tags-outer-scroll-con .close-all-tag-con {
  position: absolute;
  right: 0;
  top: 0;
  box-sizing: border-box;
  padding-top: 10px;
  text-align: center;
  width: 35px;
  height: 100%;
  background: white;
  box-shadow: -3px 0 15px 3px rgba(0, 0, 0, 0.1);
  z-index: 10;
  cursor: pointer;
}
.tags-inner-scroll-body {
  position: absolute;
  padding: 2px 60px 2px 30px;
  overflow: visible;
  white-space: nowrap;
  transition: left 0.3s ease;
}
</style>

<script>
import Sortable from "sortablejs";
import PageHelper from "@/helper/page-helper";
export default {
  name: "OpenedPageTags",
  data() {
    return {
      tagBodyLeft: 0,
    };
  },
  computed: {
    openedPagesTags: {
      get() {
        return PageHelper.openedPagesTags;
      },
      set(tags) {
        return PageHelper.updateOpenedPageTag(tags);
      },
    },
    tagCount() {
      return (
        (this.openedPagesTags && Object.keys(this.openedPagesTags).length) || 0
      );
    },
    currentTag() {
      return this.$route.name;
    },
  },
  mounted() {
    Sortable.create(this.$refs.tagbarAnim.$el, {
      onEnd: (event) => {
        PageHelper.moveOpenedPageTag(event);
      },
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
        cb: (item) => {
          this.linkTo(item);
        },
      });
    },
    handleTagsOption(type) {
      PageHelper.clearOpenedPageTag({
        route: type === "clearOthers" ? this.$route : null,
        cb: (item) => {
          this.linkTo(item);
        },
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
          this.$refs.scrollCon.offsetWidth < this.$refs.scrollBody.offsetWidth
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
        this.$refs.scrollCon.offsetWidth - tag.offsetLeft - tag.offsetWidth - 5
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
    },
    toScroll(offset) {
      const outerWidth = this.$refs.scrollCon.offsetWidth;
      const bodyWidth = this.$refs.scrollBody.offsetWidth;
      if (offset > 0) {
        this.tagBodyLeft = Math.min(0, this.tagBodyLeft + offset);
      } else {
        if (outerWidth < bodyWidth) {
          if (this.tagBodyLeft < -(bodyWidth - outerWidth)) {
            this.tagBodyLeft = this.tagBodyLeft;
          } else {
            this.tagBodyLeft = Math.max(
              this.tagBodyLeft + offset,
              outerWidth - bodyWidth
            );
          }
        } else {
          this.tagBodyLeft = 0;
        }
      }
    },
  },
  watch: {
    currentTag(name) {
      this.moveToTag(name);
    },
  },
};
</script>
