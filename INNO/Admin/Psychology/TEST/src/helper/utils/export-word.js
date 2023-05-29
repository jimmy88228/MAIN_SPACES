import Docxtemplater from "docxtemplater";
import PizZip from "pizzip";
import PizZipUtils from "pizzip/utils/index.js";
import { saveAs } from "file-saver";

export function exportWord(templateUrl, data, name){
  renderDoc(templateUrl, data, name);
}
//
function loadFile(url, callback) {
  PizZipUtils.getBinaryContent(url, callback);
}

// 读取模板
function renderDoc(templateUrl, data, name) {
  loadFile(templateUrl, function(
    error,
    content
  ) {
    if (error) {
      throw error;
    }
    const zip = new PizZip(content);
    const doc = new Docxtemplater(zip, { paragraphLoop: true, linebreaks: true });
    doc.setData(data);
    try {
      // render the document (replace all occurences of {first_name} by John, {last_name} by Doe, ...)
      doc.render();
    } catch (error) {
      // The error thrown here contains additional information when logged with JSON.stringify (it contains a properties object containing all suberrors).
      function replaceErrors(key, value) {
        if (value instanceof Error) {
          return Object.getOwnPropertyNames(value).reduce(function(
            error,
            key
          ) {
            error[key] = value[key];
            return error;
          },
          {});
        }
        return value;
      }
      console.log(JSON.stringify({ error: error }, replaceErrors));

      if (error.properties && error.properties.errors instanceof Array) {
        const errorMessages = error.properties.errors
          .map(function(error) {
            return error.properties.explanation;
          })
          .join("\n");
        console.log("errorMessages", errorMessages);
        // errorMessages is a humanly readable message looking like this :
        // 'The tag beginning with "foobar" is unopened'
      }
      throw error;
    }
    const out = doc.getZip().generate({
      type: "blob",
      mimeType:
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
    });
    // Output the document using Data-URI
    saveAs(out, `${name || '文档'}.docx`);
  });
}

/**
 * 模板判断条件
 * 
 * 布尔判断/循环包裹判断
 * {#key}
 * 
 * {/key}
 * 条件判断
 * {#key == 'XXX'}
 * 
 * {/}
 * 
*/