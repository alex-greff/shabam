interface IHTTPError {
    name: string;
    message: string;
    stack?: string;
    status?: number;
}

class HTTPError extends Error implements IHTTPError {
    status: number | undefined;
    
    constructor(message?: string, status?: number) {
        super(message);
        this.status = status;
    }
}

export default HTTPError;