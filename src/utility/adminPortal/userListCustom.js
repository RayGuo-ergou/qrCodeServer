// 0 = free, 1 = cut-in, 2 = free&cut-in
const USER_TYPE = {
    0: 'root',
    1: 'normal',
};
// eslint-disable-next-line no-unused-vars
const setCustom = async (response, request, context) => {
    const records = response.records || [];
    response.records = records.map((record) => {
        record.params.role = USER_TYPE[record.params.role];
        return record;
    });
    return response;
};

module.exports = setCustom;
