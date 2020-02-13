// This injector grabs all the headers of the current request and injects them into the context
export default (session: any, currentContext: any, moduleSessionInfo: any): any => {
    const headers = { ...session.headers };

    return {
        headers
    };
};