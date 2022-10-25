import { IUser } from '../model/user';

export interface RegisterBody extends IUser {
    key: string;
}
