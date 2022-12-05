import { IQRCode } from '../../model/qrCode';
import { IUser } from '../../model/user';
interface meta {
    total: number;
    perPage: number;
    page: number;
    direction: string;
    sortBy: string;
}

interface record {
    id: string;
    title: string;
    baseError?: string;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    errors?: any;
}

export interface recordBase extends record {
    params: Omit<IQRCode, 'type'> & { type: number | string };
    populated: {
        userId: userId;
    };
}

interface userId extends record {
    params: IUser;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    populated: any;
}

export default interface listAction {
    meta: meta;
    records: recordBase[];
}
