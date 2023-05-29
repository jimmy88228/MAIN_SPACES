import { pageColor } from "../../../../../common/helper/style-helper/page";
import {
  Text,
  Image,
  Rect,
  Line
} from "../../../../../common/support/wx-canvas-2d/index";
import dateUtils from "../../../../../common/utils/date/index";
import appletCode from "../../../../../common/helper/applet-code-helper/index";

const fetchPosterData = data => {
  let fetchQrCodeP = appletCode(data);
  let promiseArray = [fetchQrCodeP];
  return Promise.all(promiseArray)
}

export default (data = {}) => {
  console.log("data", data)
  let {info, scene} = data;
  let {goods_name, goods_img, market_price, sale_price, start_time, end_time} = info.goodsInfo;
  let start_time_str = dateUtils.format(dateUtils.parse(start_time), "yyyy/MM/dd"),
  end_time_str = dateUtils.format(dateUtils.parse(end_time), "yyyy/MM/dd"),
  activity_time_str = (start_time_str === end_time_str ? start_time_str : `${start_time_str}至${end_time_str}`);
  return fetchPosterData({
    info: {
      path: "pages/main/goods/index",
      ...info
    },
    scene,
  })
    .then(res => {
      let qrCode = res[0] || "";
      return [
        {
          x: (24),
          y: (24),
          lineHeight: (22),
          type: Text,
          text: `活动时间：${activity_time_str}`,
          fontSize: (16),
          color: "#FFADB9",
          align: "left",
        },
        {
          type: Image,
          url: goods_img,
          x: (11),
          y: (78),
          width: (348),
          height: (348),
          radius: (20), 
        },
        {
          type: Rect,
          x: 0,
          y: 450,
          width: 600,
          height: 150,
          bgColor: "#D7354C",
          lineStyle: {
            color: '#D7354C',
            width: 1,
          },
          zIndex: 2
        },
        {
            x: (34),
            y: 473,
            lineHeight: (28),
            type: Text,
            text: goods_name,
            color: "#65000E",
            fontSize: (20),
            width: (320),
            ellipsis: 2,
            align: "left",
            zIndex: 5
        },
        {
          x: (34),
          y: 549,
          lineHeight: (28),
          type: Text,
          text: "长按识别二维码 ————>",
          color: "#FFC9D0",
          fontSize: (18),
          width: (280),
          align: "left",
          zIndex: 5
        },
        {
          type: Image,
          url: "/assets/images/common/xianshiqiang.png",
          x: (378),
          y: (111),
          width: (205),
          height: (46),
        },
        {
          type: Image,
          url: "/assets/images/common/poster.png",
          x: (342),
          y: (184),
          width: (258),
          height: (148 + 33),
          zIndex: 4,
          mode: "scaleToFill"
        },
        {
          x: (378),
          y: (206),
          lineHeight: (28),
          type: Text,
          text: `限时抢购价`,
          height: 28,
          fontWeight: 600,
          fontSize: (20),
          color: pageColor["main-color"],
          align: "left",
          zIndex: 6
        },
        {
          x: (371),
          y: (229 + 40),
          lineHeight: (30),
          type: Text,
          text: `${sale_price}`,
          fontSize: (82),
          color: pageColor["main-color"],
          fontWeight: 600,
          align: "left",
          zIndex: 6
        },
        {
          x: (545),
          y: (229 + 48),
          lineHeight: (33),
          type: Text,
          text: `元`,
          fontSize: (24),
          color: pageColor["main-color"],
          align: "left",
          zIndex: 6
        },
        {
          x: (378),
          y: (348),
          lineHeight: (28),
          type: Text,
          text: `原价${market_price}元`,
          fontSize: (20),
          color: "#740716",
          align: "left",
        },
        { // line-through
          type: Line,
          lineStyle: {
            width: 1,
            // color: "#B2B2B2",
            color: "#740716",
          },
          line: [
            { point: [378, 348 + 14] },
            { point: [378 + 82, 348 + 14] }
          ],
          zIndex: 6
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