export class APIError extends Error {
    constructor(message?: string) {
        super(message);
    }
}

export class NotFoundError extends APIError {
    constructor(message?: string) {
        super(message);
    }
}