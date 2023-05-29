import {tabBarList} from "./tabBar";
const App = getApp();
Component(App.BC({
  data: {
    tabBarList: JSON.parse(JSON.stringify(tabBarList)),
    tabBarStyle: App.SH.tabBarStyle,
    selected: "", // 当前选择的页面name
    hideTabBar: true, // 是否隐藏tabBar
  },
  methods: {
    selectTabBarByName(name = "") {
      this.setData({hideTabBar: !name, selected: name})
    },
    tabBarToggle(show) {
      let hideTabBar = this.data.hideTabBar;
      let _show = hideTabBar;
      if (typeof show !== "undefined") _show = show;
      if (!!hideTabBar != !_show) this.setData({hideTabBar: !_show});
    },
    handleTabTap(e) {
      let url = e.currentTarget.dataset.url || "";
      url.indexOf('/') !== 0 && (url = '/' + url);
      url = url.replace(".html", "");
      wx.switchTab({url});
    }
  }
}))