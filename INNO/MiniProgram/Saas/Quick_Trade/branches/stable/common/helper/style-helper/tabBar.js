export const tabBarSize = {
  // "tab-bar-padding-top": "32rpx", 
  // "tab-bar-bottom": "calc(32rpx + env(safe-area-inset-bottom))",
  // "tab-bar-height": "10vh",
  // "tab-bar-width": "92.4vw",
  "tab-bar-padding-top": "0rpx",
  "tab-bar-bottom": "calc(28rpx + env(safe-area-inset-bottom))",
  "tab-bar-height": "120rpx",
  "tab-bar-width": "700rpx",
  "tab-bar-horizental-margin": "calc((100vw - var(--tab-bar-width)) / 2)",
  "tab-bar-page-bottom": "calc(var(--tab-bar-bottom) + var(--tab-bar-height) + var(--tab-bar-padding-top))",
}

export const tabBarColor = {
  "tab-bar-font-color": "#333333",
  "tab-bar-selected-color": "#F5475F",
  "tab-bar-background": "#FFFFFF",
  "tab-bar-shadow": "0rpx 4rpx 28rpx 0rpx #FDD8D5",
  "tab-bar-middle-line-bg": "#CCCCCC",
}

export default {
  ...tabBarSize,
  ...tabBarColor,
}