function getColor(sHex, R, G, B, A) {
  sHex = sHex.trim();
  // 十六进制颜色值的正则表达式
  let reg = /^#([0-9a-fA-f]{3}|[0-9a-fA-f]{6})$/
  /* 16进制颜色转为RGB格式 */
  if (!sHex) return;
  let sColor = sHex.toLowerCase();
  if (sColor && reg.test(sColor)) {
    if (sColor.length === 4) {
      let sColorNew = '#'
      for (let i = 1; i < 4; i += 1) {
        sColorNew += sColor.slice(i, i + 1).concat(sColor.slice(i, i + 1))
      }
      sColor = sColorNew
    }
    //  处理六位的颜色值
    let sColorChange = []
    for (let i = 1; i < 7; i += 2) {
      sColorChange.push(parseInt('0x' + sColor.slice(i, i + 2)))
    }
    sColorChange[0] = sColorChange[0] + parseFloat(R || 0);
    sColorChange[1] = sColorChange[1] + parseFloat(G || 0);
    sColorChange[2] = sColorChange[2] + parseFloat(B || 0);
    // 或
    return 'rgba(' + sColorChange.join(',') + ',' + A + ')'
  } else {
    let sColorArr = sColor.split(",");
    let reg = /[^0-9]/ig;
    sColorArr[0] = parseFloat(sColorArr[0].replace(reg, ""))  + parseFloat(R || 0);
    sColorArr[1] = parseFloat(sColorArr[1].replace(reg, "")) + parseFloat(G || 0);
    sColorArr[2] = parseFloat(sColorArr[2].replace(reg, "")) + parseFloat(B || 0);
    sColorArr[3] = A;
    return 'rgba(' + sColorArr.join(',') + ')'
  }

}
export default getColor;