const tabBarList = [ // 这里调整了，记得在app.json里也调整一下，给超低版本微信兼容
  {
    "pagePath": "pages/tabs/index/index",
    "text": "首页",
    "iconPath": "/assets/images/tabBar/hot.png",
    "selectedIconPath": "/assets/images/tabBar/hot-active.png",
    "name": "index"
  },
  {
    "pagePath": "pages/tabs/user/user",
    "text": "个人中心",
    "iconPath": "/assets/images/tabBar/user.png",
    "selectedIconPath": "/assets/images/tabBar/user-active.png",
    "name": "userCenter"
  }
]

let tabKeys = {};
tabBarList.forEach(item => {tabKeys[item.pagePath] = item.name}); // {"pages/tabs/index/index": "userCenter"}

export {
  tabBarList,
  tabKeys
}