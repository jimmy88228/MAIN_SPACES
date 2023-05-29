import {merge} from "../../utils/object/index"
import {createOnShow, createOnHide, createOnLaunch} from "./default-dealer/index"
import {statics, methods} from "./default-options/index"
import LostApp from "./lost-app"
export const createMainApp = (appOptions = LostApp) => {
  return merge({
    ...methods,
    ...statics,
  }, {
    ...appOptions,
    onLaunch: createOnLaunch(appOptions),
    onShow: createOnShow(appOptions),
    onHide: createOnHide(appOptions),
  })
}