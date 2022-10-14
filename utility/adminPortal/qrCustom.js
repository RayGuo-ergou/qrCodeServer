// 0 = free, 1 = cut-in, 2 = free&cut-in
const QR_TYPE = {
    0: 'free',
    1: 'cut-in',
    2: 'free&cut-in',
};
const setCustom = async (response, request, context) => {
    const records = response.records || [];
    response.records = records.map((record) => {
        record.params.type = QR_TYPE[record.params.type];
        console.log(record.params);
        return record;
    });
    return response;
};

module.exports = setCustom;
