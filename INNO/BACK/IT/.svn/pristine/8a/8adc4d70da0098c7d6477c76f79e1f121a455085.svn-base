import dateUtil from "@/helper/utils/date-util";
const DFLen = 12;
export default {
    exportExcal(obj={}) {   //name、except、len、extra 为非必填。
        let {name="表格导出",datas=[],colums=[],except=[],len,extra={}} = obj;  
        const ExportJsonExcel = require("js-export-excel"); 
        let option = {};
        option.datas = getDatas(datas,colums,except,len,extra);
        let date = new Date();
        date = dateUtil.format(dateUtil.parse(date.toLocaleDateString()),"yyyyMMdd") + '_' + date.getHours() + date.getMinutes() +  date.getSeconds();
        option.fileName = name + '_' + date;
        // console.log('option',option); 
        var toExcel = new ExportJsonExcel(option);
        toExcel.saveExcel();
      }
}

function getDatas(sheetData,colums,except,len,extra){
  let sheetFilter = [];
  let sheetHeader = [];
  let columnWidths = [];
  for(let i = 0,ilen=colums.length;i<ilen;i++){
      let needContinue = false;
      for(let j = 0,jlen=except.length;j<jlen;j++){
          if( colums[i] && colums[i].key == except[j]){
            needContinue = true;
            break;
          }
      }
      if(needContinue){continue};
      sheetFilter.push(colums[i].key);
      sheetHeader.push(colums[i].title);
      columnWidths.push(len||DFLen);
  }
  //自定义类型 extra
  if(extra.add && extra.add instanceof Array){ //add:扩充表头
    for(let ilen=extra.add.length-1,i=ilen;i>=0;i--){ //按扩充数组原顺序展示 因此需倒序
      sheetFilter.unshift(extra.add[i].key || "");
      sheetHeader.unshift(extra.add[i].title || "");
      columnWidths.push(len||DFLen);
    }
  }
  if(extra.lenArr){ //lenArr：表格长度数组自定义
    columnWidths = extra.lenArr;
  }
  return [{sheetData,sheetFilter,sheetHeader,columnWidths}];
}
 