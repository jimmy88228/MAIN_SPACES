// 导出页面为PDF格式
import html2Canvas from 'html2canvas'
import JsPDF from 'jspdf'
export function getPdf(title, id, options = {}){
  let width = options.width;
  let parentId = options.parentId;
  let viewElem = document.querySelector(`#${id}`);
  let parentNode = parentId ? document.querySelector(`#${parentId}`) : viewElem.parentNode;
  let viewElemHtml = viewElem.innerHTML;
  let downloadElem = parentNode.getElementsByClassName("download-PDF");
  width = Number(width) || Number(viewElem.offsetWidth);
  
  parentNode.style.position = "relative";
  if(downloadElem.length > 0){
    downloadElem[0].remove();
  }
  let div = document.createElement('div') || {};
  div.className = viewElem.className + " download-PDF";
  div.style.position = "absolute";
  div.style.top = "0px";
  div.style.left = "0px";
  div.style.transform = "translateX(-110%)";
  div.innerHTML = viewElemHtml;
  parentNode.appendChild(div);
  downloadElem = parentNode.getElementsByClassName("download-PDF");
  downloadElem[0].style.width = width + "px";
  if(downloadElem.length){
    // 兼容table无法根据屏幕占100%, 设置col按比例保持;
    let table = downloadElem[0].getElementsByTagName("table") || [];
    for(let i = 0; i < table.length; i++){
      let tableW = Number(table[i].offsetWidth);
      let col = table[i].getElementsByTagName("col") || [];
      for(let j = 0; j < col.length; j++){
        col[j].setAttribute("width", ((Number(col[j].offsetWidth) / tableW) * 100))
      }
    }
  }
  html2Canvas(downloadElem[0], {
    allowTaint: true,
    scale: 2 //提升画面质量，但是会增加文件大小
  }).then(function (canvas) {
    let contentWidth = canvas.width
    let contentHeight = canvas.height
    let pageHeight = contentWidth / 592.28 * 841.89
    let leftHeight = contentHeight
    let position = 0
    let imgWidth = 595.28
    let imgHeight = 592.28 / contentWidth * contentHeight
    let pageData = canvas.toDataURL('image/jpeg', 1.0)
    let PDF = new JsPDF('', 'pt', 'a4')
    if (leftHeight < pageHeight) {
      PDF.addImage(pageData, 'JPEG', 0, 0, imgWidth, imgHeight)
    } else {
      while (leftHeight > 0) {
        PDF.addImage(pageData, 'JPEG', 0, position, imgWidth, imgHeight)
        leftHeight -= pageHeight
        position -= 841.89
        if (leftHeight > 0) {
          PDF.addPage()
        }
      }
    }
    PDF.save(title + '.pdf')
  })
  
}