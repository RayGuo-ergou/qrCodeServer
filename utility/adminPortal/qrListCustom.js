// 0 = free, 1 = cut-in, 2 = free&cut-in
const QR_TYPE = {
    0: 'free',
    1: 'cut-in',
    2: 'free&cut-in',
    3: 'free&cut-in(no limit)',
};
// eslint-disable-next-line no-unused-vars
const setCustom = async (response, request, context) => {
    const records = response.records || [];
    response.records = records.map((record) => {
        record.params.type = QR_TYPE[record.params.type];
        record.populated.userId.title =
            record.populated.userId.params.first_name +
            ' ' +
            record.populated.userId.params.last_name;

        return record;
    });
    return response;
};

module.exports = setCustom;
