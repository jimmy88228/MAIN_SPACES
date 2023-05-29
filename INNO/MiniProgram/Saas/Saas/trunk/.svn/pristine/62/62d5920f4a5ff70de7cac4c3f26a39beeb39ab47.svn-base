import BarCode from "./code-bar.min";
import QrCode from "./code-qr.min";

function convert_length(length) {
    return Math.round(wx.getSystemInfoSync().windowWidth * length / 750);
}

function barc(id, code, width, height) {
    BarCode.code128(wx.createCanvasContext(id), code, convert_length(width), convert_length(height));
}

function qrc(id, code, width, height) {
    QrCode.api.draw(code, {
        ctx: wx.createCanvasContext(id),
        width: convert_length(width),
        height: convert_length(height)
    });
}

export default {
    barcode: barc,
    qrcode: qrc
};
