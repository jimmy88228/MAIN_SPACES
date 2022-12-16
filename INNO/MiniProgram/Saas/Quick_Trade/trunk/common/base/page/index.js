import {merge} from "../../utils/object/index"
import {createOnLoad, createOnShow, createOnReady, createOnHide, createOnUnload} from "./default-dealer/index"
import {methods,statics, initialData} from "./default-options/index"
import LostPage from "./lost-page"

export const BP = (pageOptions = LostPage) => {
  return merge({
    ...methods,
    ...statics,
    data: initialData
  }, {
    ...pageOptions,
    onLoad: createOnLoad(pageOptions),
    onShow: createOnShow(pageOptions),
    onReady: createOnReady(pageOptions),
    onHide: createOnHide(pageOptions),
    onUnload: createOnUnload(pageOptions),
  })
}