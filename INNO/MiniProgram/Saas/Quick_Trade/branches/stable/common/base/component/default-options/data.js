import {publicInitialData, publicData} from "../../public/index"
const initialData = { // 初始化data
  ...publicInitialData,
}

const data = { // 全局ready时setData
  ...publicData,
}

export {
  initialData,
  data
}