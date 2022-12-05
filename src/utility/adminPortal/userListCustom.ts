import { After } from 'adminjs';
import QRCodeListAction from '../../types/admin/qrCodeListAction';
// 0 = free, 1 = cut-in, 2 = free&cut-in
const USER_TYPE = {
    0: 'root',
    1: 'normal',
};
// eslint-disable-next-line no-unused-vars
const setCustom: After<QRCodeListAction> = async (
    response,
    request,
    context
    // eslint-disable-next-line @typescript-eslint/require-await
) => {
    const records = response.records || [];
    response.records = records.map((record) => {
        record.params.role =
            USER_TYPE[record.params.role as keyof typeof USER_TYPE];
        return record;
    });
    return response;
};

export default setCustom;
