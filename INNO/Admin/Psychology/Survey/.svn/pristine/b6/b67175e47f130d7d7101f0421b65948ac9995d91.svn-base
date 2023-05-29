// 导出页面为PDF格式
import html2Canvas from 'html2canvas'
import JsPDF from 'jspdf'
let pdfElemtId = "";
const A4_WIDTH = 592.28
const A4_HEIGHT = 841.89
const faultNum = 30;
export function initPdf(options = {}){
  options = options || {};
  let id = options.id;
  let width = options.width;
  let parentId = options.parentId;
  let viewElem = document.querySelector(`#${id}`);
  let parentNode = parentId ? document.querySelector(`#${parentId}`) : viewElem.parentNode;
  width = Number(width) || Number(viewElem.offsetWidth);
  parentNode.style.position = "relative";
  /**
   * 分页
  */
  let cloneViewElem = viewElem.cloneNode(twrue);
  let downloadElem = parentNode.getElementsByClassName("download-PDF");
  if(downloadElem.length > 0){
    downloadElem[0].remove();
  }
  let div = document.createElement('div') || {};
  div.className = "download-PDF";
  div.style.width = width + "px";
  div.style.position = "absolute";
  div.style.top = "0px";
  div.style.left = "0px";
  div.style.transform = "translateX(-110%)";
  div.id = "download-PDF-" + id;
  div.appendChild(cloneViewElem);
  parentNode.appendChild(div);
  //
  pdfElemtId = div.id;
  //
  let flag = cloneViewElem.querySelectorAll(`.page-splite-flag`);
  let maxHeight = width / A4_WIDTH * A4_HEIGHT;
  console.log("flag", flag);
  let remainH = maxHeight;
  for(let i = 0; i < flag.length; i++){
    let table = flag[i].querySelector('.ivu-table-wrapper');
    // console.log("table", table)
    if(table){ // 存在table
      let tableH = table.offsetHeight;
      let tableW = table.offsetWidth;
      let top = table.offsetTop;
      let tableSplit = [];
      let col = table.querySelectorAll("col") || [];
      for(let c = 0; c < col.length; c++){
        col[c].setAttribute("width", ((Number(col[c].offsetWidth) / tableW) * 100))
      }
      if((top + tableH + faultNum) > remainH){ // 一屏放不下table
        let residueH = remainH - top;
        let tableHead = table.querySelector('.ivu-table-header');
        let tableHeadH = tableHead.offsetHeight;
        let tr = table.querySelectorAll(".ivu-table-row");
        let splitItem = [], addUpTrH = tableHeadH;
        console.log("循环前residueH", residueH);
        for(let t = 0; t < tr.length; t++){ // 根据table每个tr高度计算分页
          let trH = tr[t].offsetHeight;
          console.log("addUpTrH", addUpTrH)
          console.log("trH", trH)
          console.log("循环中residueH", residueH)
          if((addUpTrH + trH + faultNum) > residueH){
            tableSplit.push({
              residueH: residueH - addUpTrH,
              trs: splitItem
            });
            splitItem = [];
            addUpTrH = tableHeadH;
            residueH = maxHeight - (faultNum * 2); // 偏移值，由于table分页中的偏移值需要增加一倍faultNum
            remainH = remainH + maxHeight;
          } else {
            addUpTrH += trH;
          }
          splitItem.push(tr[t])
        }
        if(splitItem.length){
          tableSplit.push({
            residueH: residueH - addUpTrH,
            trs: splitItem
          });
        }
        if(tableSplit.length){ // 根据分页数据，生成table塞到页面
          let tableParent = table.parentNode;
          for(let p = 0; p < tableSplit.length; p++){
            let cloneTable = table.cloneNode(true);
            let clonetbody = cloneTable.querySelector(".ivu-table-tbody");
            clonetbody.innerHTML = "";
            let pItem = tableSplit[p].trs || [];
            for(let t = 0; t < pItem.length; t++){
              clonetbody.appendChild(pItem[t]);
            }
            tableParent.appendChild(cloneTable);
            if(p < tableSplit.length - 1){
              cloneTable.style.marginBottom = tableSplit[p].residueH + faultNum + "px";
            }
          }
        }
        table.remove(); // 删除原table
      }
    } else {
      let height = flag[i].offsetHeight;
      let top = flag[i].offsetTop;
      if((top + height + faultNum) > remainH){
        flag[i].style.marginTop = (remainH - top) + faultNum + "px";
        remainH = remainH + maxHeight;
      }
    }
  }
  //
  // new Print({
  //   moduleId: "#" + div.id, // 自定义页面id
  //   pageInfo: {
  //       defaultType: 'HEADER_FOOTER_TYPE',  // 页眉页脚类型：HEADER_TYPE  有头无尾；NORMAL_TYPE 无头无尾；FOOTER_TYPE  无头有尾；HEADER_FOOTER_TYPE  有头有尾
  //       needTpl: false,
  //       waterMark: false, // 是否需要水印, 默认为false
  //       // waterMarkConfig: {
  //       //     waterMarkContent: this.pra,
  //       //     waterMarkId: 'print-operate-report', //需要做水印的元素的id
  //       // },
  //       injectClass: {
  //           // cardTableTBHeaderWraper: 've-table-header',
  //           // cardElRowClass: 've-table-body-tr',
  //           // elTableBodyWraper: 've-table-body'
  //           cardTableTBHeaderWraper: 'ivu-table-header',
  //           cardElRowClass: 'ivu-table-row',
  //           elTableBodyWraper: 'ivu-table-body',
  //           rowHeight: 48,
  //           headerHeight: 55
  //       }
  //   },
  // })
} 
export function getPdf(title, id, options = {}){
  if(!pdfElemtId){
    return;
  }
  let downloadElem = document.querySelector(`#${pdfElemtId}`)
  html2Canvas(downloadElem, {
    allowTaint: true,
    scale: 2 //提升画面质量，但是会增加文件大小
  }).then(function (canvas) {
    var context = canvas.getContext("2d");
    // 【重要】关闭抗锯齿
    context.mozImageSmoothingEnabled = false;
    context.webkitImageSmoothingEnabled = false;
    context.msImageSmoothingEnabled = false;
    context.imageSmoothingEnabled = false;
    let contentWidth = canvas.width
    let contentHeight = canvas.height
    let pageHeight = contentWidth / A4_WIDTH * A4_HEIGHT
    let leftHeight = contentHeight
    let position = 0
    let imgWidth = A4_WIDTH + 3;
    let imgHeight = A4_WIDTH / contentWidth * contentHeight
    let pageData = canvas.toDataURL('image/jpeg', 1.0)
    let PDF = new JsPDF('', 'pt', 'a4')
    if (leftHeight < pageHeight) {
      PDF.addImage(pageData, 'JPEG', 0, 0, imgWidth, imgHeight)
    } else {
      while (leftHeight > 0) {
        PDF.addImage(pageData, 'JPEG', 0, position, imgWidth, imgHeight)
        leftHeight -= pageHeight
        position -= A4_HEIGHT
        if (leftHeight > 0) {
          PDF.addPage()
        }
      }
    }
    PDF.save(title + '.pdf')
  })
  
}
