import logger from './internalLogger';

const passLogger = (level: string): ((obj: AnyError) => void) => {
    const logMethod = getLogMethod(level);

    return (obj) => {
        const message = getMessage(obj);

        return logMethod(message, obj);
    };
};

const getLogMethod = (level: string) => {
    switch (level) {
        case 'error':
            return logger.error.bind(logger);
        case 'warn':
            return logger.warn.bind(logger);
        default:
            return logger.info.bind(logger);
    }
};

const getMessage = (obj: AnyError): string => {
    if (obj instanceof Error) {
        return obj.stack ?? obj.message;
    }
    if (obj.length === 1) {
        return obj[0];
    }
    return obj.toString();
};

type AnyError = (Error & { [key: string]: unknown }) | string[] | string;

const consoleMethods: (keyof Console)[] = ['log', 'debug', 'info', 'warn', 'error'];

consoleMethods.forEach((method) => {
    // eslint-disable-next-line no-console
    console[method] = passLogger(method);
});
