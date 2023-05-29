import {merge} from "../../utils/object/index"
import {createAttached, createDetached, createCreated, createReady, createPageShow, createPageHide} from "./default-dealer/index"
import {methods,statics, initialData} from "./default-options/index"
import LostComponent from "./lost-component"

export const BC = (componentOptions = LostComponent) => {
  let pageLifetimes = {
    show: createPageShow(componentOptions),
    hide: createPageHide(componentOptions),
  };
  let lifetimes = {
    attached: createAttached(componentOptions),
    detached: createDetached(componentOptions),
    created: createCreated(componentOptions),
  }
  return merge({
    ...statics,
    data: initialData,
    methods,
  }, {
    ...componentOptions,
    ready: createReady(componentOptions),
    lifetimes,
    pageLifetimes,
  })
}