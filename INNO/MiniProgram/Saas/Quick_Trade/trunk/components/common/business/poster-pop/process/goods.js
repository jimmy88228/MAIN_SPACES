import {
  Text,
  Image
} from "../../../../../common/support/wx-canvas-2d/index";
import dateUtils from "../../../../../common/utils/date/index";
export default goodsInfo => {
  console.log("goodsInfo", goodsInfo)
  let {goods_name, goods_img, market_price, sale_price, start_time, end_time} = goodsInfo;
  let start_time_str = dateUtils.format(dateUtils.parse(start_time), "yyyy/MM/dd"),
  end_time_str = dateUtils.format(dateUtils.parse(end_time), "yyyy/MM/dd"),
  activity_time_str = (start_time_str === end_time_str ? start_time_str : `${start_time_str}-${end_time_str}`); 
  return Promise.resolve([
    // {
    //   type: Image,
    //   url: "https://devimgtest.innourl.com/SAAS_IMAGE/images/INNO/index/gallery/20220815/20220815173859464_1140213.png",
    //   x: 0,
    //   y: 0,
    //   mode: "scaleToFill",
    //   width: (750),
    //   height: (750),
    //   zIndex: 0
    // },
    {
      type: Image,
      url: goods_img,
      x: (20),
      y: (78),
      mode: "aspectFit",
      width: (300),
      height: (300),
      radius: (5), 
    },
    {
        x: (20),
        y: (78 + 300 + 10),
        lineHeight: (30),
        type: Text,
        text: goods_name,
        fontSize: (21),
        width: (300),
        ellipsis: 2,
        align: "center",
    },
    {
      x: (20),
      y: (550),
      lineHeight: (30),
      type: Text,
      text: `活动时间：${activity_time_str}`,
      fontSize: (20),
      fontWeight: "bold",
      align: "left",
    },
    {
      x: (20 + 300 + 20),
      y: (78 + 125),
      lineHeight: (30),
      type: Text,
      text: `非促销价: ￥${market_price}/件`,
      fontSize: (21),
      color: "#666666",
      align: "left",
    },
    {
      x: (20 + 300 + 20),
      y: (78 + 125 + 30 + 20),
      lineHeight: (30),
      type: Text,
      text: "会员价：",
      fontSize: (28),
      color: "#F5475F",
      align: "left",
    },
    {
      x: (20 + 300 + 20),
      y: (78 + 125 + 30 + 20 + 30 + 20),
      // lineHeight: (60),
      type: Text,
      text: "￥",
      fontSize: (32),
      fontWeight: "bold",
      color: "#F5475F",
      width: (160),
      align: "left",
    },
    {
      x: (20 + 300 + 20 + 10),
      y: (78 + 125 + 30 + 20 + 30 + 20),
      // lineHeight: (60),
      type: Text,
      text: `${sale_price}`,
      fontSize: (60),
      fontWeight: "bold",
      color: "#F5475F",
      width: (180),
      align: "center",
    },
    {
      x: (20 + 300 + 20 + 10),
      y: (78 + 125 + 30 + 20 + 30 + 46),
      // lineHeight: (60),
      type: Text,
      text: "/件",
      fontSize: (24),
      fontWeight: "bold",
      color: "#F5475F",
      width: (210),
      align: "right",
    },
    {
      type: Image,
      url: "https://developtest.innourl.com//upload_files/174/CUSTOM_INDEX/ca63e699a8e706c3.png",
      x: (425),
      y: (450),
      mode: "aspectFit",
      width: (150),
      height: (150),
    }
  ])
}