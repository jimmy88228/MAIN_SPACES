import dateUtil from "@/helper/utils/date-util";
const DFLen = 10;
export default {
    exportExcel(obj={}) {  //导出xlsx格式
        let {datas=[],colums=[],name="表格导出",len,extra={}} = obj;  
        (extra = extra || {}) && (extra.type = "excel");
        const ExportJsonExcel = require("js-export-excel"); 
        let option = {
          datas:getDatas(datas,colums,len,extra),
          fileName:name + '_' + getNowDate()
        };
        var toExcel = new ExportJsonExcel(option);
        toExcel.saveExcel();
    },
    exportCsv(obj={}) { //导出csv格式 
      let {datas=[],colums=[],name="表格导出",len,extra={}} = obj;  
      (extra = extra || {}) && (extra.type = "csv");
      const { Parser } = require('json2csv');
      let rsData = getDatas(datas,colums,len,extra) || [];
      const json2csvParser = new Parser({ fields:rsData.sheetCsvFilter });
      const el = document.createElement('a');
      el.href = getDownloadHref(json2csvParser.parse(rsData.sheetData),'application/csv;charset=utf-8');
      el.download = name + '_' + getNowDate() + ".csv";
      document.body.appendChild(el);
      el.click();
      document.body.removeChild(el);
    },
}

function getDatas(sheetData,colums,len,extra){
  let sheetFilter = [];
  let sheetHeader = [];
  let columnWidths = [];
  let sheetCsvFilter = [];
  for(let i = 0,ilen=colums.length;i<ilen;i++){
      extra.type == "excel" && 
      (
        sheetFilter.push(colums[i].key),
        sheetHeader.push(colums[i].title),
        columnWidths.push(len||DFLen)
      )
      extra.type == "csv" && sheetCsvFilter.push({
        label:colums[i].title,
        value:colums[i].key,
      })
  }
  if(extra.type == "excel" && extra.lenArr){ //lenArr：表格长度数组自定义
    columnWidths = extra.lenArr;
  }
  return extra.type == "csv" ? {sheetCsvFilter,sheetData} : [{sheetData,sheetFilter,sheetHeader,columnWidths}];
}

function getDownloadHref (data,type="") {
  const _utf = '\uFEFF'; // 为了使文件以utf-8的编码模式，同时也是解决中文乱码的问题
  if (window.Blob && window.URL && window.URL.createObjectURL) {
      const blob = new Blob([_utf + data], {
          type: type // 自定义格式
      });
      return URL.createObjectURL(blob);
  }
}
 
function getNowDate(){
  let date = new Date();
  return dateUtil.format(dateUtil.parse(date.toLocaleDateString()),"yyyyMMdd") + date.getHours() + date.getMinutes() +  date.getSeconds();
}