import winston, { format } from 'winston';

export default winston.createLogger({
    level: 'info',
    format: format.combine(
        format.errors({ stack: true }),
        format.prettyPrint(),
        process.env.NODE_ENV === 'production' ? format.json() : format.simple(),
        format.colorize(),
    ),
    transports: [new winston.transports.Console()],
});
