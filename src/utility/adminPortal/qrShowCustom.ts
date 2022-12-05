import { NotFoundError, ActionHandler, RecordJSON } from 'adminjs';

// 0 = free, 1 = cut-in, 2 = free&cut-in
const QR_TYPE = {
    0: 'free',
    1: 'cut-in',
    2: 'free&cut-in',
    3: 'free&cut-in(no limit)',
};

const qrShowCustom: ActionHandler<{ record: RecordJSON }> = async (
    request,
    response,
    context
    // eslint-disable-next-line @typescript-eslint/require-await
) => {
    if (!context.record) {
        throw new NotFoundError(
            [
                `Record of given id ("${
                    request.params.recordId as string
                }") could not be found`,
            ].join('\n'),
            'Action#handler'
        );
    }
    const data = context.record;
    data.params.type =
        QR_TYPE[context.record.params.type as keyof typeof QR_TYPE];
    data.params.username = `${
        data.populated.userId.params.first_name as string
    } ${data.populated.userId.params.last_name as string}`;

    return {
        record: context.record.toJSON(context.currentAdmin),
    };
};

export default qrShowCustom;
