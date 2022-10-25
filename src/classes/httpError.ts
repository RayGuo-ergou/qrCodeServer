import { CustomError } from 'ts-custom-error';

class HttpError extends CustomError {
    constructor(message?: string, public status?: number) {
        super(message);

        Object.setPrototypeOf(this, HttpError.prototype);
    }
}

export default HttpError;
