<style lang="less">
@import './styles/menu.less';
</style>

<template>
    <div :style="{background: bgColor}" class="ivu-shrinkable-menu">
        <slot name="top"></slot>
        <sidebar-menu
            v-show="!shrink"
            :menu-theme="theme"
            :menu-list="menuList"
            :open-names="openNames"
            @on-change="handleChange"
        ></sidebar-menu>

        <!--弹出式菜单 不显示了
        <sidebar-menu-shrink
            v-show="shrink"
            :menu-theme="theme"
            :menu-list="menuList"
            :icon-color="shrinkIconColor"
            @on-change="handleChange"
        ></sidebar-menu-shrink>
        -->
    </div>
</template>

<script>
// 侧栏菜单放大后，可折叠菜单
import sidebarMenu from './components/sidebarMenu.vue';
// 侧栏菜单缩小后，弹出的抽屉菜单
// import sidebarMenuShrink from './components/sidebarMenuShrink.vue';

import util from '@/libs/util';
export default {
  name: 'shrinkableMenu',
  components: {
    sidebarMenu
    // sidebarMenuShrink
  },
  props: {
    shrink: {
      type: Boolean,
      default: false
    },
    menuList: {
      type: [Array, Object],
      required: true
    },
    theme: {
      type: String,
      default: 'dark',
      validator (val) {
        return util.oneOf(val, ['dark', 'light']);
      }
    },
    beforePush: {
      type: Function
    },
    openNames: {
      type: Array
    }
  },
  computed: {
    bgColor () {
      // return this.theme === 'dark' ? '#495060' : '#fff';
      return this.theme == 'dark' ? '#1E2E3D' : '#fff';
    },
    shrinkIconColor () {
      // return this.theme === 'dark' ? '#fff' : '#495060';
      return this.theme === 'dark' ? '#fff' : '#1E2E3D';
    }
  },
  methods: {
    handleChange (name) {
      let willpush = true;
      if (this.beforePush !== undefined) {
        if (!this.beforePush(name)) {
          willpush = false;
        }
      }
      if (willpush) {
        this.$router.push({
          name: name
        });
      }
      this.$emit('on-change', name);
    }
  }
};
</script>
