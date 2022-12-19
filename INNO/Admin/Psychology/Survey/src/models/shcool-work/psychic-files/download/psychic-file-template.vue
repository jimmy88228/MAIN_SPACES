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
            tableHtml: ""
        };
    },
    methods: {
        tableToExcel(callback){
          this.createTable();
          this.$nextTick(()=>{
            this.createXlsxDownload();
            setTimeout(()=>{
              typeof(callback) == 'function' && callback();
            }, 1000)
          })
        },
        createXlsxDownload(){
          var xlsxParam = { raw: true };//转换成excel时，使用原始的格式
          var wb = XLSX.utils.table_to_book(document.querySelector("#downloadTable"),xlsxParam);
          // console.log("wb", wb)
          let sheet = wb.Sheets.Sheet1;
          this.addRangeBorder(sheet['!merges'], sheet);
          this.setExlStyle(sheet);
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
        setExlStyle(sheet){
          let rowTitle = ['学生情况', '绑定家长', '活动记录', '心理轨迹', '干预记录'];
          let rowsJson = {}, colsJson = {};
          sheet["!cols"] = [];
          sheet["!rows"] = [];
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
                }
              }
              if(rowTitle.indexOf(sheet[i].v) != -1){
                sheet[i].s.fill = {
                  fgColor: { rgb: "F2F2F2" },
                }
                sheet[i].s.alignment = { 
                  horizontal: "center",
                  vertical: "center",
                }
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
          let arr = ["A","B","C","D","E","F","G","H","I","J","K","L","M","N","O","P","Q","R","S","T","U","V","W","X","Y","Z"];
          range.forEach(item=>{
            let startRowNumber = Number(item.s.c),endRowNumber = Number(item.e.c);
            for(let i = startRowNumber +1;i<= endRowNumber;i++){
              ws[arr[i]+(Number(item.e.r)+1)]= {
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
            let tableTime = `<tr><td colspan="8">档案内容更新至${DateUtils.format(new Date(), 'yyyy-MM-dd HH:mm')}    导出者：用户名称（${this._loginAdmin.admin_name}） </td></tr>`;
            let tableTitle = `<tr><td colspan="8" class="table-title">个人心理档案</td></tr>`;
            let tableContent = '';
            // 个人信息
            tableContent += `<tr><td colspan="8" class="tr-title">学生情况</td></tr>`;
            tableContent += `<tr>
              <td>姓名</td><td>${personInfo.student_name}</td>
              <td>手机号</td><td>未知</td>
              <td>性别</td><td>${personInfo.student_sex_str}</td>
              <td>年龄</td><td>未知</td>
            </tr>
            <tr>
              <td>所在学校</td><td>${personInfo.school_name}</td>
              <td>校区</td><td>${personInfo.campus}</td>
              <td>学年</td><td>${personInfo.school_year}</td>
              <td>班级</td><td>${personInfo.class_name}</td>
            </tr>`;
            /**
             * 绑定家长
            */
            tableContent += `<tr><td colspan="8" class="tr-title">绑定家长</td></tr>`;
            relateData.map((item)=>{
              tableContent +=`<tr>
                <td>家长名称</td><td >${item.user_name}</td>
                <td>家长身份</td><td >${item.relate_type_desc}</td>
                <td>手机号</td><td colspan="3">${item.mobile_phone}</td>
              </tr>`;
            })
            /**
             * 活动记录
             * */ 
            tableContent += `<tr><td colspan="8" class="tr-title">活动记录</td></tr>`;
            // 活动记录th
            tableContent += `<tr>
              <td colspan="2" class="text-c">参与活动名称</td>
              <td >量表</td>
              <td >参与的日期</td>
              <td >完成量表耗时</td>
              <td >完成情况</td>
              <td >总分</td>
              <td align="center">测评结果</td>
            </tr>`;
            // 活动记录 内容
            for(let i = 0; i < actList.length; i++){
              let modelRecord = actList[i].get_model_record || [];
              for(let j = 0; j < modelRecord.length; j++){
                tableContent += `<tr>`
                if(j == 0){
                  tableContent += `<td colspan="2" rowspan="${modelRecord.length}" class="text-c">${actList[i].activity_name}</td>`
                }
                tableContent += `<td >${modelRecord[j].model_name}</td>
                    <td >${modelRecord[j].start_time + '\t'}</td>
                    <td >${modelRecord[j].survey_time + '\t'}</td>
                    <td >${modelRecord[j].state_str + '\t'}</td>
                    <td >${(modelRecord[j].coefficient_points || '-') + '\t'}</td>
                    <td align="center">${(modelRecord[j].survey_result || '') + '\t'}</td>
                  </tr>`; 
              }
            }
            /**
             * 心理轨迹
             * */ 
            tableContent += `<tr><td colspan="8" class="tr-title">心理轨迹</td></tr>`;
            // 
            tableContent += `<tr>
              <td >心理预警变化</td>
              <td >时间</td>
              <td >记录者</td>
              <td colspan="5" class="text-c">预警记录</td>
            </tr>`;
            psychicList.map((item)=>{
              tableContent += `<tr>
                <td >${(item.getrank && item.getrank.level_name) || '已解除'}</td>
                <td >${item.intervention_time}</td>
                <td >${(item.getadmin && item.getadmin.user_name) || '--'}</td>
                <td colspan="5" class="text-c">${item.warning_remark}</td>
              </tr>`;
            })
            /**
             * 干预记录
             * */ 
            tableContent += `<tr><td colspan="8" class="tr-title">干预记录</td></tr>`;
            // 
            tableContent += `<tr>
              <td >序号</td>
              <td >时间</td>
              <td >记录者</td>
              <td colspan="5" class="text-c">描述</td>
            </tr>`;
            meddleRecord.map((item, index)=>{
              tableContent += `<tr>
                <td >${index + 1}</td>
                <td >${item.intervention_time}</td>
                <td >${(item.getadmin && item.getadmin.user_name) || '--'}</td>
                <td colspan="5" class="text-c">${item.assess_suggest}</td>
              </tr>`;
            })
            // 合并table html
            this.tableHtml = `${tableRootL}${tableTime}${tableTitle}${tableContent}${tableRootR}`
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