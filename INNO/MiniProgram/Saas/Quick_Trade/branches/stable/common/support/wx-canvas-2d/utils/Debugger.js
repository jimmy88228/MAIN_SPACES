"use strict";var SYS_INFO=wx.getSystemInfoSync();module.exports={name:"debugLogout",handler:function(n){var o=1<arguments.length&&void 0!==arguments[1]?arguments[1]:"info";if(n){var r;"devtools"===SYS_INFO.brand?(r={info:"#61CFFF",warn:"#FFD56C",error:"#FF8080",success:"#A6F27D"}[o]||"#909399",console.log("%cWxCanvas2d%c".concat(n),"\n                color: rgba(0, 0, 0, .8);\n                background-color: #A6F27D;\n                padding: 1px 4px;\n                border-radius: 4px 0 0 4px;\n            ","\n                color: rgba(0, 0, 0, .5);\n                background-color: ".concat(r,";\n                padding: 1px 4px;\n                border-radius: 0 4px 4px 0;\n            "))):console.debug("WxCanvas2d: ".concat(n))}}};