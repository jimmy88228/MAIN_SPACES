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
    csvTransform(val,type){
      val = '="' + val + '"';
      return val;
    },
    getList({result,start,end,model,pSize,total,fnc,cb,that}){
      that.exportLoad = true;
      setTimeout(()=>{
        that.exportClass = true;
      },300)
      return setPromiseAll(...arguments);
    }
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
      extra.type == "csv" && 
      (
        sheetCsvFilter.push({label:colums[i].title,value:colums[i].key})
      )
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

function setPromiseAll({result=[],start,end,model,pSize,total,fnc,cb,that}){
  let _arr = [];
  end*pSize > total && (end = Math.ceil(total/pSize));
  let nowNum = end*pSize;
  that.percentVal = parseInt((nowNum/that.total<0.1? 0.1 : nowNum/that.total) * 100);
  that.percentVal >= 100 && (that.percentVal = 100);
  try{
     _arr = fnc && fnc({start,end});
      if(!_arr || _arr.length<1)return
  }catch(e){
      console.log('fnc catch',e)
      return
  }
  return Promise.all(_arr).then(res=>{
      for(let j = 0,lenJ=res.length;j<lenJ;j++){
          result = result.concat(res[j]);
      }
      if(end*pSize >= total){
          that.percentVal = 100;
          that.exportClass = false;
          setTimeout(()=>{
            that.exportLoad = false;
          },500)
          console.log('结束',end,total,that.exportDataList,result);
          cb && cb(result);
          return result
      }
      start = end;
      end += model;
      return setPromiseAll({result,start,end,model,pSize,total,fnc,cb,that});
  }).catch(e=>{
      console.log('all catch',e); 
      return setPromiseAll({result,start,end,model,pSize,total,fnc,cb,that});
  })
}