const { NotFoundError } = require('adminjs');
// 0 = free, 1 = cut-in, 2 = free&cut-in
const QR_TYPE = {
    0: 'free',
    1: 'cut-in',
    2: 'free&cut-in',
    3: 'free&cut-in(no limit)',
};

const qrShowCustom = async (request, response, data) => {
    if (!data.record) {
        throw new NotFoundError(
            [
                `Record of given id ("${request.params.recordId}") could not be found`,
            ].join('\n'),
            'Action#handler'
        );
    }
    data.record.params.type = QR_TYPE[data.record.params.type];
    data.record.params.username =
        data.record.populated.userId.params.first_name +
        ' ' +
        data.record.populated.userId.params.last_name;

    return {
        record: data.record.toJSON(data.currentAdmin),
    };
};

module.exports = qrShowCustom;
