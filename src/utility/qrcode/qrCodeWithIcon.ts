import QRCode, { QRCodeRenderersOptions } from 'qrcode';
import { createCanvas, loadImage } from 'canvas';

async function create(
    dataForQRcode: string,
    center_image: string,
    width: number,
    cwidth: number
) {
    const options: QRCodeRenderersOptions = {
        errorCorrectionLevel: 'H',
        margin: 1,
        color: {
            dark: '#000000',
            light: '#ffffff',
        },
    };

    const canvas = createCanvas(width, width);
    await QRCode.toCanvas(canvas, dataForQRcode, options);

    const ctx = canvas.getContext('2d');
    const img = await loadImage(center_image);
    const center = (width - cwidth) / 2;
    ctx.drawImage(img, center, center, cwidth, cwidth);
    return canvas.toDataURL('image/png');
}

export default create;
