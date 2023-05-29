import SIH from "../system-info-helper/index";
export const pageColor = {
  "main-color": "#F5475F",
  "second-color": "#FFF6ED",
  "default-color": "#d8d8d8",
  "deep-text-color": "#333333",
  "normal-text-color": "#777777",
  "cancel-text-color": "#b2b2b2",
  "tint-text-color": "#7f7f7f",
  "normal-border-color": "#efefef",

}

export const pageSize = {
  "status-bar-height": (SIH.systemInfo.statusBarHeight || 20) + "px",
  "nav-bar-height": SIH.navBarHeight + "px",
}

export default {
  ...pageColor,
  ...pageSize
}