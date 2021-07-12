<template>
    <div>
        <template v-for="(item, index) in menuList">
            <div style="text-align: center;" :key="index">
                <Dropdown transfer placement="right-start" :key="index" @on-click="changeMenu">
                    <Button style="width: 70px;margin-left: -5px;padding:10px 0;" type="text">
                        <Icon :size="20" :color="iconColor" :type="item.icon"></Icon>
                    </Button>
                    <DropdownMenu style="width: 200px;" slot="list" v-for="group in item.children" :key="group.name" :name="group.name">
                    	<DropdownItem disabled>{{group.title}}</DropdownItem>
                        <template v-for="(child, i) in group.children">
                            <DropdownItem :name="child.name" :key="i">
                            	<Icon :type="child.icon"></Icon>
                            	<span style="padding-left:10px;">{{ itemTitle(child) }}</span>
                            </DropdownItem>
                        </template>
                    </DropdownMenu>
                </Dropdown>

            </div>
        </template>
    </div>
</template>

<script>
/**
 * 侧栏收起时候的弹出式菜单
 * （目前看情况调用）
 */
export default {
  name: 'sidebarMenuShrink',
  props: {
    menuList: {
      type: Array
    },
    iconColor: {
      type: String,
      default: 'white'
    },
    menuTheme: {
      type: String,
      default: 'darck'
    }
  },
  methods: {
    changeMenu (active) {
      this.$emit('on-change', active);
    },
    itemTitle (item) {
      if (typeof item.title === 'object') {
        return this.$t(item.title.i18n);
      } else {
        return item.title;
      }
    }
  }
};
</script>
