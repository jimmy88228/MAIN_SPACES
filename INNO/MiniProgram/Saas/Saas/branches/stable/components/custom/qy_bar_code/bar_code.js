import {
  qrcode_custom,
  barcode_custom
} from "../../../common/utils/codeCanvas/index.js"
const app = getApp();
Component(app.BTAB({
  options: {
    multipleSlots: true
  },
  properties: {

  },

  data: {

  },

  methods: {
    drawCode(data=''){
      console.log('bar_drawCode',data);
      let qr_pay_code = data || '';
      let code_data = {
        qr_pay_code: qr_pay_code
      }
      this.setData({
        code_data: code_data
      });
      // qrcode_custom('payCode', qr_pay_code, 450, 450, this);
      barcode_custom('barCanvas', qr_pay_code, 500, 150, this);
    }
  }
}))
