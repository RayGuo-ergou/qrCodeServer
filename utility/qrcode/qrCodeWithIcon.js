const QRCode = require('qrcode');
const { createCanvas, loadImage } = require('canvas');

async function create(dataForQRcode, center_image, width, cwidth) {
    const canvas = createCanvas(width, width);
    QRCode.toCanvas(canvas, dataForQRcode, {
        errorCorrectionLevel: 'H',
        margin: 1,
        color: {
            dark: '#000000',
            light: '#ffffff',
        },
    });

    const ctx = canvas.getContext('2d');
    const img = await loadImage(center_image);
    const center = (width - cwidth) / 2;
    ctx.drawImage(img, center, center, cwidth, cwidth);
    return canvas.toDataURL('image/png');
}

module.exports = create;
