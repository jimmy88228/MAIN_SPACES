<template>
    <div class="download-table">
        <div  id="downloadTable">
          <div v-html="tableHtml"></div>
        </div>
    </div>
</template>

<script>
import FileSaver from 'file-saver'
import XLSX from 'xlsx'
import XLSXStyle from 'xlsx-style-medalsoft'
import DateUtils from "@/helper/utils/date-util.js";
export default {
    props: {
      downloadData: {
        type: Object,
        default(){
          return {}
        }
      }
    },
    data() {
        return {
            tableHtml: "",
            letterArr: ["A","B","C","D","E","F","G","H","I","J","K","L","M","N","O","P","Q","R","S","T","U","V","W","X","Y","Z"]
        };
    },
    methods: {
        tableToExcel(callback){
          this.createTable();
          this.$nextTick(()=>{
            let tableStyle = this.getTableIndex();
            this.createXlsxDownload(tableStyle);
            setTimeout(()=>{
              typeof(callback) == 'function' && callback();
            }, 1000)
          })
        },
        createXlsxDownload(tableStyle){
          var xlsxParam = { raw: true };//转换成excel时，使用原始的格式
          var wb = XLSX.utils.table_to_book(document.querySelector("#downloadTable"),xlsxParam);
          // console.log("wb", wb)
          let sheet = wb.Sheets.Sheet1;
          this.addRangeBorder(sheet['!merges'], sheet);
          this.setExlStyle(sheet, tableStyle);
          // excel导出时间
          sheet['A1'].s = {
            ...sheet['A1'].s,
            font: { sz: 11, color: { rgb: "A6A6A6" }},
            alignment: { 
              horizontal: "right",
              vertical: "center",
            }
          }
          // excel标题
          sheet['A2'].s = {
            ...sheet['A2'].s,
            font: { sz: 16},
            alignment: { 
              horizontal: "center",
              vertical: "center",
            }
          }
          const wbout = XLSXStyle.write(wb, {
            type: 'binary',
            bookType: 'xlsx',
            bookSST: true,
            cellStyles: true
          })
          try {
            FileSaver.saveAs(
              new Blob([this.s2ab(wbout)], { type: "application/octet-stream;charset=utf-8" }),
              "个人心理档案.xlsx"
            );
          } catch (e) {
            if (typeof console !== "undefined") console.log(e, wbout);
          }
        },
        setExlStyle(sheet, tableStyle){
          let rowTitle = ['学生情况', '绑定家长', '活动记录', '心理轨迹', '干预记录'];
          let rowsJson = {}, colsJson = {};
          sheet["!cols"] = [];
          sheet["!rows"] = [];
          console.log("sheet", sheet, "tableStyle", tableStyle)
          for(let i in sheet){
            if(i && i.indexOf('!') == -1){
              sheet[i].s = {
                font: { sz: 11 },
                border: {
                  top: {
                    style: "thin",
                  },
                  bottom: {
                    style: "thin",
                  },
                  left: {
                    style: "thin",
                  },
                  right: {
                    style: "thin",
                  },
                },
                alignment: { 
                  horizontal: "left",
                  vertical: "center",
                },
                ...tableStyle[i] || {}
              }
              if(rowTitle.indexOf(sheet[i].v) != -1){
                sheet[i].s.fill = {
                  fgColor: { rgb: "F2F2F2" },
                }
                // sheet[i].s.alignment = { 
                //   horizontal: "center",
                //   vertical: "center",
                // }
              }
              // 每列宽度
              if(!colsJson[i[0]]){
                colsJson[i[0]] = true;
                sheet["!cols"].push({
                  wpx: 130
                })
              }
              // 每行高度
              let rowNum =  i.replace(/[^\d]/g, "");
              rowNum = parseInt(rowNum);
              if(!rowsJson[rowNum]){
                rowsJson[rowNum] = true;
                if(rowNum == 2){ // 大标题行
                  sheet["!rows"].push({
                    hpt: 60
                  })
                } else {
                  sheet["!rows"].push({
                    hpt: 30
                  })
                }
              }
              
            }

            // 设置高度

          }
        },
        addRangeBorder(range,ws){
          // 添加除了内容外，合并的空白项也增加边框
          let letterArr = this.letterArr || [];
          range.forEach(item=>{
            let startRowNumber = Number(item.s.c),endRowNumber = Number(item.e.c);
            for(let i = startRowNumber +1;i<= endRowNumber;i++){
              ws[letterArr[i]+(Number(item.e.r)+1)]= {
                s:{border:{top:{style:'thin'}, left:{style:'thin'},bottom:{style:'thin'},right:{style:'thin'}}},
                v: ''
              };
            }
          })
        },
        createTable() {
            let downloadData = this.downloadData || {};
            let personInfo = downloadData.personInfo || {};
            let relateData = downloadData.relateData || [];
            let actList = downloadData.actList || [];
            let psychicList = downloadData.psychicList || [];
            let meddleRecord = downloadData.meddleRecord || [];
            let tableRootL = '<table border="1" cellspacing="0" cellpadding="0">', tableRootR = '</table>';
            let tableTime = `<tr><td colspan="8" align="right">档案内容更新至${DateUtils.format(new Date(), 'yyyy-MM-dd HH:mm')}    导出者：用户名称（${this._loginAdmin.admin_name}） </td></tr>`;
            let tableTitle = `<tr><td colspan="8" align="center">个人心理档案</td></tr>`;
            let tableContent = '';
            // 个人信息
            tableContent += `<tr><td colspan="8" align="center">学生情况</td></tr>`;
            tableContent += `<tr>
              <td>姓名</td><td>${personInfo.student_name || '未知'}</td>
              <td>学号</td><td>${personInfo.student_number || '未知'}</td>
              <td>性别</td><td>${personInfo.student_sex_str || '未知'}</td>
              <td>年龄</td><td>未知</td>
            </tr>
            <tr>
              <td>所在学校</td><td>${personInfo.school_name || '未知'}</td>
              <td>校区</td><td>${personInfo.campus || '未知'}</td>
              <td>学年</td><td>${personInfo.school_year || '未知'}</td>
              <td>班级</td><td>${personInfo.class_name || '未知'}</td>
            </tr>`;
            /**
             * 绑定家长
            */
            tableContent += `<tr><td colspan="8" align="center">绑定家长</td></tr>`;
            if(relateData.length){
              relateData.map((item)=>{
                tableContent +=`<tr>
                  <td>家长名称</td><td >${item.user_name || '未知'}</td>
                  <td>家长身份</td><td >${item.relate_type_desc || '未知'}</td>
                  <td>手机号</td><td colspan="3">${item.mobile_phone || '未知'}</td>
                </tr>`;
              })
            } else {
              tableContent +=`<tr>
                  <td>家长名称</td><td >未知</td>
                  <td>家长身份</td><td >未知</td>
                  <td>手机号</td><td colspan="3">未知</td>
                </tr>`;
            }
            
            /**
             * 活动记录
             * */ 
            tableContent += `<tr><td colspan="8" align="center">活动记录</td></tr>`;
            // 活动记录th
            tableContent += `<tr>
              <td colspan="2" align="center">参与活动名称</td>
              <td >量表</td>
              <td >参与的日期</td>
              <td >完成量表耗时</td>
              <td >完成情况</td>
              <td >总分</td>
              <td>测评结果</td>
            </tr>`;
            // 活动记录 内容
            if(actList.length){
              for(let i = 0; i < actList.length; i++){
                let modelRecord = actList[i].get_model_record || [];
                for(let j = 0; j < modelRecord.length; j++){
                  tableContent += `<tr>`
                  if(j == 0){
                    tableContent += `<td colspan="2" rowspan="${modelRecord.length}" align="center">${actList[i].activity_name}</td>`
                  }
                  tableContent += `<td >${modelRecord[j].model_name || '-'}</td>
                      <td >${(modelRecord[j].start_time || '-') + '\t'}</td>
                      <td >${(modelRecord[j].survey_time || '-') + '\t'}</td>
                      <td >${(modelRecord[j].state_str || '-') + '\t'}</td>
                      <td >${(modelRecord[j].coefficient_points || '-') + '\t'}</td>
                      <td >${(modelRecord[j].survey_result || '-') + '\t'}</td>
                    </tr>`; 
                }
              }
            } else {
              tableContent += `<td colspan="8" align="center">暂无数据</td>`
            }
            /**
             * 心理轨迹
             * */ 
            tableContent += `<tr><td colspan="8" align="center">心理轨迹</td></tr>`;
            // 
            tableContent += `<tr>
              <td >心理预警变化</td>
              <td >时间</td>
              <td >记录者</td>
              <td colspan="5" align="center">预警记录</td>
            </tr>`;
            if(psychicList.length){
              psychicList.map((item)=>{
                tableContent += `<tr>
                  <td >${(item.getrank && item.getrank.level_name) || '已解除'}</td>
                  <td >${item.intervention_time || '-'}</td>
                  <td >${(item.getadmin && item.getadmin.user_name) || '-'}</td>
                  <td colspan="5" align="center">${item.warning_remark || '-'}</td>
                </tr>`;
              })
            } else {
              tableContent += `<tr>
                  <td colspan="8" align="center">暂无数据</td>
                </tr>`;
            }
            
            /**
             * 干预记录
             * */ 
            tableContent += `<tr><td colspan="8" align="center">干预记录</td></tr>`;
            // 
            tableContent += `<tr>
              <td >序号</td>
              <td >时间</td>
              <td >记录者</td>
              <td colspan="5" align="center">描述</td>
            </tr>`;
            if(meddleRecord.length){
              meddleRecord.map((item, index)=>{
                tableContent += `<tr>
                  <td >${index + 1}</td>
                  <td >${item.intervention_time || '-'}</td>
                  <td >${(item.getadmin && item.getadmin.user_name) || '-'}</td>
                  <td colspan="5" align="center">${item.assess_suggest || '-'}</td>
                </tr>`;
              })
            } else {
              tableContent += `<tr>
                  <td colspan="8" align="center">暂无数据</td>
                </tr>`;
            }
            // 合并table html
            this.tableHtml = `${tableRootL}${tableTime}${tableTitle}${tableContent}${tableRootR}`
        },
        getTableIndex(){
          let tableStyle = {}, letterArr = this.letterArr;
          let downloadTable = document.querySelector("#downloadTable");
          let table = downloadTable.getElementsByTagName("table")[0];
          let tr = table.getElementsByTagName("tr");
          for(let i = 0; i < tr.length; i++){
            let td = tr[i].getElementsByTagName("td");
            let trcolspan = 0, trrowspan = 0;
            for(let j = 0; j < td.length; j++){
              let colspan = td[j].getAttribute('colspan') || 1;
              let rowspan = td[j].getAttribute('rowspan')
              if(td[j].getAttribute('align')){
                tableStyle[letterArr[trcolspan] + (i + 1)] = {
                  alignment: { 
                    horizontal: td[j].getAttribute('align'),
                    vertical: "center",
                  }
                }
              }
              trcolspan += parseInt(colspan);
            }
          }
          return tableStyle;
        },
        base64:(s) => window.btoa(unescape(encodeURIComponent(s))),
        s2ab(s) {
          var buf = new ArrayBuffer(s.length);
          var view = new Uint8Array(buf);
          for (var i=0; i!=s.length; ++i) view[i] = s.charCodeAt(i) & 0xFF;
          return buf;
        }
    },
};
</script>

<style scoped lang="less">
.download-table{
  display: none;
}
</style>