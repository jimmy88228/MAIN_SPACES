import Config from '../../../../../conf.js';
import Promise from "../../../../../libs/promise/promise";
import WxApi from "../../../../../helper/wx-api-helper.js"

//-------说明-------//
//1.allData里面的draw:{drawDiy:true},若为true所有文字、图片的坐标大小都自己定好，若没有这个字段，通过draw:{template:"xxx"}--决定调用模板goods还是custom。
//2.调用模板与灵活画海报第一步都是创建一个drawArr数组-- draw:{drawArr}。在shareImg.js里面drawArr的数组会遍历画在canvas上。
//3.drawArr数组储存的图片是未下载的，通过shareImg.js里的allAdaptiveSet实现按顺序进行下载并储存在drawArr的downMsg里面，因为图片画在canvas上的部分数据是取downMsg里的，因此需要呈现的图片必须要在allAdaptiveSet调用之前push进drawArr。
//4.drawArr数组的每条数据结构要按照initData里面的结构，后续有需要添加的可以往里面加。

class template {
  static getInstance() {
    if (!template.instance) {
      template.instance = new template();
    }
    return template.instance;
  }

  constructor() {
    this.canvasConf={
      width: 600,
      height: 900,
    }
    this.newCanvasConf={
      width: 600,
      height: 1016,
    }
  }  

  //海报数据初始化 (调一次就返回drawArr数组的一项)
  initData(type = '', x = 0,y = 0,width = 0, height = 0){
    //x、y、w、h是带进来的海报数据传参，其他都是调完initData后另外设置的，不设置就都取默认值
    if(type=='image'){
      return {
        x: x || 0,
        y: y || 0,
        w: width || 0,
        h: height || 0,
        url:'',   //图片路径
        type: '',  //图片模板code、userHead、brand_logo （对应shareImg里面的templateInfo获取对应的图片路径）
        category:'image',   //标识
        mode: 'normal',  // （图片mode）
        adaptive: 'middle', // top (决定图片居中裁剪或撑满)
        position: 'absolute', //relative、fixed (absolute是默认的x,y定位方式，relative的y坐标是由上一个元素的高度决定，此时向上间距由extraH决定。fixed是扩展的定位方式，具体定位方法由extra实现)
        extraH: 0,    //relative时对应的padding-top
        downMsg:{},   //图片下载后的信息(canvas画布drawImage需要的信息是下载后的信息)
        extra: {},    //fixed对应的扩展定位方法（定义一些复杂的定位规则） 
      }
    }
    else if(type == 'text'){
      return {
        x: x || 0,
        y: y || 0,
        w: width || 0,
        h: height || 0,
        text: '',   //文字内容
        type: '',   //文字模板realName、miniProm、QR（对应shareImg里面的templateInfo获取对应的文字内容）
        category: 'text', //标识
        size: 26,   //文字大小 (font-size)
        extraH: 0,  //relative对应的padding-top
        ellipsis:0, //文字换行的行数
        position: 'absolute', //absolute、relative、fixed (absolute是默认的x,y定位方式，relative的y坐标是由上一个元素的高度决定，此时向上间距由extraH决定。fixed是扩展的定位方式，具体定位方法由extra实现)
        align:'left',   //文字对齐方式left、right (text-align)
        bold:false,     //文字加粗
        decoration: '', //文字样式line-through (text-decoration)
        extra:{},       //fixed对应的扩展定位方法（定义一些复杂的定位规则）  
      }
    }else{
      return {}
    }
  }
  //商品海报 （通过上面的initData组合数据）
  initNewGoodsTemplate(allData={}){
    let draw = allData.draw || {};
    let info = allData.info || {};
    let baseInfo = draw.baseInfo = draw.baseInfo || {};
    let arr = draw.drawArr = draw.drawArr || [];
    this.ShareConf = info.ShareConf || {};
    let P_Conf = this.ShareConf.poster && this.ShareConf.poster.data || {};
    let QR_Conf = this.ShareConf.qrcode && this.ShareConf.qrcode.data || {};
    let P_Conf_Bool = P_Conf.cfg_pic && P_Conf.cfg_pic.style == "1" || false;
    let goodsInfo = info.goodsInfo || {};
    let canvasW = baseInfo.canvasW = P_Conf_Bool ? this.newCanvasConf.width : this.canvasConf.width;
    let canvasH = baseInfo.canvasH = P_Conf_Bool ? this.newCanvasConf.height : this.canvasConf.height;
    let padding = 30;
    let baseTopLine = 0;
    let nextBaseBottom = canvasH;
    let baseStrW = 340;
    let line = 0;
    let baseInfoH = 208;

    if (P_Conf_Bool){
      // logo
      let url = P_Conf.imgDomain + P_Conf.cfg_pic.top_img || '';
      let bg = this.initData('image', 0, baseTopLine, canvasW, baseInfoH);
      bg.url = url || '';
      bg.mode = 'aspectFill';
      arr.push(bg);
      baseTopLine += baseInfoH;
    }

    //图 背景    
    if (info.imgUrl) {
      let bg = this.initData('image', 0, baseTopLine, canvasW, canvasW);
      bg.url = info.imgUrl || '';
      bg.mode = 'fitORfill';//fitORfill -> 当高>宽==正常的等高等比例模式(aspectFit)，当宽<高==等宽裁剪模式(aspectFill)
      arr.push(bg);
    }
    baseTopLine += (canvasW + padding);
    // 文字 商品名称
    if (goodsInfo.goods_name) {
      this.checkName = goodsInfo.goods_name;
      line += 1;
      let g_name = this.initData('text', padding, baseTopLine, baseStrW);
      g_name.ellipsis = P_Conf_Bool?2:3;
      g_name.text = goodsInfo.goods_name;
      g_name.size = 22;
      g_name.checkLine = P_Conf_Bool ? true : false;
      arr.push(g_name);
      baseTopLine += g_name.size;
    }
    // 文字 款号
    if (goodsInfo.goods_sn) {
      line += 1;
      let goods_sn = this.initData('text', padding, 0);
      goods_sn.position = 'relative';
      goods_sn.extraH = getExtraH.call(this, line, 15, { type:'sn'});
      goods_sn.color = '#B2B2B2';
      goods_sn.size = 18;
      goods_sn.text = goodsInfo.goods_sn;
      arr.push(goods_sn);
      baseTopLine += goods_sn.size;
    }
    // 文字 价格
    if (goodsInfo.price) {
      if (!!!goodsInfo.min_price) {
        goodsInfo.min_price = goodsInfo.price;
      }
      if (!!!goodsInfo.max_price) {
        goodsInfo.max_price = goodsInfo.price;
      } 

      //价格后面补充文案
      let extra = "";
      if(P_Conf_Bool && goodsInfo.min_integral > 0){
        extra = " + 积分" + goodsInfo.min_integral;
      }else if(goodsInfo.min_tail_price > 0){
        extra = " + " + goodsInfo.min_tail_price;
      }

      line += 1;
      let price = this.initData('text', padding, 0);
      price.position = 'relative';
      price.extraH = getExtraH.call(this, line,40,{type:'price'});
      price.color = goodsInfo.acColor || Config.style.font_color;
      price.size = 26;
      price.bold = true; 

      // 文字  价格范围 加粗
      if (goodsInfo.min_price != goodsInfo.max_price && goodsInfo.max_price > "0") {
        price.text = "¥" + goodsInfo.min_price + "-" + goodsInfo.max_price + extra;
      } else {
        // 文字  单价格 加粗
        if (!!!goodsInfo.min_price) {
          price.text = "¥" + goodsInfo.price + extra;
        } else {
          price.text = "¥" + goodsInfo.min_price + extra;
        }
      }
      arr.push(price);
      baseTopLine += price.size;
    }

    // 文字  积分 加粗
    if (!P_Conf_Bool && goodsInfo.integral && goodsInfo.integral != 0) {
      line += 1;
      let integral = this.initData('text', padding, 0);
      integral.position = 'relative';
      integral.size = 24;
      integral.extraH = getExtraH.call(this, line , 12, { type:'integral'});
      integral.color = goodsInfo.acColor || Config.style.font_color;
      integral.bold = true;
      // 文字  积分范围 加粗
      if (goodsInfo.min_integral != goodsInfo.max_integral && goodsInfo.max_integral != "0") {
        integral.text = "加积分" + goodsInfo.min_integral + "-" + goodsInfo.max_integral;
      } else {
        // 文字  单积分 加粗
        integral.text = "加积分" + goodsInfo.integral;
      }
      arr.push(integral);
      baseTopLine += integral.size;
    }
    // 文字 划线价 加粗
    if (goodsInfo.market_price != 0 && goodsInfo.min_price != goodsInfo.market_price) {
      line += 1;
      let market_price = this.initData('text', padding, 0);
      market_price.position = 'relative';
      market_price.decoration = 'line-through';
      market_price.size = 18;
      market_price.extraH = getExtraH.call(this, line, 12, { type:'market'});
      market_price.color = "#B2B2B2";
      // 划线价范围
      if (goodsInfo.min_market_price != goodsInfo.max_market_price && goodsInfo.max_market_price != "0") {
        market_price.text = "¥" + goodsInfo.min_market_price + "-" + goodsInfo.max_market_price;
      } else {
        // 单划线价
        market_price.text = '¥' + goodsInfo.market_price;
      }
      arr.push(market_price);
    } else if (P_Conf_Bool){
      info.difference = info.difference || 0;
      info.difference += (18+12)/2;
    }
    return Promise.resolve(arr || [])
  }

  //自定义海报（通过上面的initData组合数据）
  initCustomTemplate(allData = {}) {
    let draw = allData.draw || {};
    // let baseInfo = draw.baseInfo || {};
    let arr = draw.drawArr = draw.drawArr || [];
    let info = allData.info || {};
    let canvasW = this.canvasConf.width;
    let canvasH = this.canvasConf.height;
    let baseTopLine = 0; 
    //图 背景    
    if (info.imgUrl) {
      let bg = this.initData('image', 0, baseTopLine, canvasW, canvasH);
      bg.url = info.imgUrl || '';
      bg.mode = 'widthFix';
      arr.push(bg);
      console.log('海报看看',bg)
    }
    return Promise.resolve(arr || []);
  }

  //文字换行
  wrapMsg(ctx, baseW = 1, y = 0, item = {},allData={}) {
    let name = item.text || '';
    let wrapTimes = item.ellipsis || 4;
    let baseStrW = item.w * baseW;
    let x = item.x || 0;
    let size = item.size || 26;
    let base = size+6;
    if (name) {
      let info = allData.info || {};
      info.difference = info.difference || 0;  //海报底部有多少difference填充, 首行标题就往上移多少
      if (item.checkLine){
        let row = parseInt(ctx.measureText(name).width / (item.w * baseW)) + 1;
        row = row > wrapTimes ? wrapTimes:row;
        this.row = row;
        info.difference = info.difference - ((row - 1) * (base+8) / 2);
      }
      y += info.difference;
      console.log('进来',info.difference,y,this.row)
      info.difference = 0;
      let NameLFloat = name.length || 0;
      let limitN = 0;
      let times = 0;
      for (let i = 0; i < NameLFloat + 1; i++) {
        let limitStr = name.slice(limitN, i);
        let metrics = ctx.measureText(limitStr);
        if (metrics.width > baseStrW) {
          times += 1;
          if (times >= wrapTimes) {
            limitStr = limitStr.slice(0, limitStr.length - 1) + '...';
            ctx.fillText(limitStr, x * baseW, (y + size) * baseW);
            y = y + base;
            break
          } else {
            if (i >= (NameLFloat)){
              ctx.fillText(name.slice(limitN, i - 1), x * baseW, (y + size) * baseW);
              y = y + base;
              ctx.fillText(name.slice(i-1, i), x * baseW, (y + size) * baseW);
              y = y + size;
            }else{
              ctx.fillText(limitStr, x * baseW, (y + size) * baseW);
              y = y + base;
            }
          }
          limitN = i;
        } else {
          limitStr = name.slice(limitN, NameLFloat);
          metrics = ctx.measureText(limitStr);
          if (metrics.width <= baseStrW || (i >= (NameLFloat))) {
            ctx.fillText(limitStr, x * baseW, (y + size) * baseW);
            y = y + size;
            break;
          }
        }
      }
    }
    return y
  }

  //画圆或者码里面的圆头像和品牌logo的方法
  drawCircle(type = '', ctx, data = {}) {
    if (!ctx || !type) return
    let downMsg = data.downMsg || {};
    let circle_x = get_circle.call(this, data.x * data.baseW, data.y * data.baseW, data.w * data.baseW, data.h * data.baseW).result_x;
    let circle_y = get_circle.call(this, data.x * data.baseW, data.y * data.baseW, data.w * data.baseW, data.h * data.baseW).result_y;
    if (type == 'circle') { //画普通圆
      ctx.save();
      ctx.beginPath();
      ctx.arc(circle_x, circle_y, (data.w / 2) * data.baseW, 0, 2 * Math.PI);
      ctx.clip();
      downMsg.path && ctx.drawImage(downMsg.path, data.x * data.baseW, data.y * data.baseW, data.w * data.baseW, data.h * data.baseW);
      ctx.stroke();
      ctx.restore();
    } else if (type == 'userHead') {//画头像（需要嵌在data提供的圆里面，头像是根据data自适应,所以只需提供外框(code)属性和头像图片地址就可以了）
      let user_cir_r = parseFloat((data.w / 4.4).toFixed(3));
      let head_x = get_vertex.call(this, circle_x, circle_y, user_cir_r * 2 * data.baseW, user_cir_r * 2 * data.baseW).result_x;
      let head_y = get_vertex.call(this, circle_x, circle_y, user_cir_r * 2 * data.baseW, user_cir_r * 2 * data.baseW).result_y;
      ctx.save()
      ctx.beginPath()
      ctx.arc(circle_x, circle_y, user_cir_r * data.baseW, 0, 2 * Math.PI, false)
      ctx.clip();
      downMsg.path && ctx.drawImage(downMsg.path, head_x, head_y, user_cir_r * 2 * data.baseW, user_cir_r * 2 * data.baseW)
      ctx.stroke();
      ctx.restore();
    } else if (type == 'brand_logo') {
      let logo_w = (data.w * 0.28);
      let head_x = get_vertex.call(this, circle_x, circle_y, logo_w * data.baseW, logo_w * data.baseW).result_x;
      let head_y = get_vertex.call(this, circle_x, circle_y, logo_w * data.baseW, logo_w * data.baseW).result_y;
      downMsg.path && ctx.drawImage(downMsg.path, head_x, head_y, logo_w * data.baseW, logo_w * data.baseW)
    }
  } 

  equation(type = '', params = {}) { //自己自定义的公式模板（自己模拟数据算出公式）
    let result;
    switch (type) {
      case 'v_m': { //图左字右的 vertical:middle (需要传参文字大小、图片y坐标、图片的高度来算文字的居中效果公式)
        let img_y = params.img_y || 0;  //图片y坐标
        let img_h = params.img_h || 0;  //图片高度
        let font_size = params.font_size || 26; //文字大小
        result = img_y + (img_h - font_size) / 2;
        break
      }
      default:
        break
    }
    return result
  }
}

function get_circle(x = 0, y = 0, w = 0, h = 0) { //已知左上端点、宽高, 求中心
  let _middle_x = parseFloat((w * 0.5));
  let _middle_y = parseFloat((h * 0.5));
  let _x = (x + _middle_x);
  let _y = (y + _middle_y);
  return {
    result_x: _x,
    result_y: _y
  }
}

function get_vertex(x = 0, y = 0, w = 0, h = 0) { //已知中心、宽高, 求左上端点
  let _middle_x = parseFloat(w * 0.5);
  let _middle_y = parseFloat(h * 0.5);
  let _x = (x - _middle_x);
  let _y = (y - _middle_y);
  return {
    result_x: _x,
    result_y: _y
  }
}

function getExtraH(line=0,lineH=0,obj={}){
  let temp = line == 2 ? 36 : lineH;
  if (obj.type){
    return lineH;
  }else if (line == 2 && this.checkName){
    let len = this.checkName.length || 0;
    let cur = (parseInt(this.checkName.length / 12) + 1) <= 3 ? 1 : 3;
    temp = 36 / cur;
    this.checkName = "";
  }
  return temp
}

 
function changeHttp(link) {
  if (!link || typeof link == 'object') return 'https://';
  if (link.indexOf("http://") == "-1" && link.indexOf("https://") == "-1") {
    link = "https://" + link;
  } else if (link.indexOf("https://") == "-1") {
    link = link.replace('http://', 'https://');
  }
  return link;
}

export default template.getInstance();