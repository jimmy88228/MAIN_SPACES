import {
  Image,
  Rect
} from "../../../../../common/support/wx-canvas-2d/index";
import appletCode from "../../../../../common/helper/applet-code-helper/index";
import Conf from "../../../../../config/index";
const fetchPosterData = data => {
  let fetchQrCodeP = appletCode(data);
  let promiseArray = [fetchQrCodeP];
  return Promise.all(promiseArray)
}

export default (data = {}) => {
  console.log("data", data)
  let {info, scene} = data;
  return fetchPosterData({
    info: {
      path: Conf.navConfig.INDEX_PATH,
      is_White_Bg: 1,
      ...info
    },
    scene,
  })
    .then(res => {
      let qrCode = res[0] || "";
      return [
        {
          type: Image,
          url: "/assets/images/common/xianshiqiang.png",
          x: (600 - 238) / 2,
          y: (600 - 54) / 2 ,
          width: (238),
          height: (54) 
        },
        {
          type: Rect,
          x: (438),
          y: (459),
          width: (132 + 4),
          height: (132 + 4),
          bgColor: "#ffffff",
          lineStyle: {
            color: '#ffffff',
            width: 1
          },
          radius: (132 + 4) / 2,
          zIndex: 7
        },
        {
          type: Image,
          url: qrCode,
          x: (438 + 4/2),
          y: (459 + 4/2),
          mode: "aspectFit",
          width: (132),
          height: (132),
          radius: (132 + 4) / 2,
          zIndex: 8
        }
      ]
    })
}