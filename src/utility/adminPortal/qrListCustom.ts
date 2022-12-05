import { After } from 'adminjs';
import QRListCustom from '../../types/admin/qrCodeListAction';

// 0 = free, 1 = cut-in, 2 = free&cut-in
const QR_TYPE = {
    0: 'free',
    1: 'cut-in',
    2: 'free&cut-in',
    3: 'free&cut-in(no limit)',
};

// eslint-disable-next-line @typescript-eslint/require-await
const setCustom: After<QRListCustom> = async (response, request, context) => {
    const recordsTmp = response.records || [];

    response.records = recordsTmp.map((record) => {
        record.params.type =
            QR_TYPE[record.params.type as keyof typeof QR_TYPE];
        record.populated.userId.title =
            record.populated.userId.params.first_name +
            ' ' +
            record.populated.userId.params.last_name;

        return record;
    });
    return response;
};

export default setCustom;
