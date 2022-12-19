import {publicInitialData, publicData} from "../../public/index"
import SH from "../../../helper/style-helper/index";

const initialData = { // 初始化data
  ...publicInitialData,
  pageStyle: SH.pageStyle
}

const data = { // 全局onLoad时setData
  ...publicData
}

export {
  initialData,
  data
}