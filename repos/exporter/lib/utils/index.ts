import dateFormat from 'dateformat';

export const convertDateFormat = (date: string): string => dateFormat(date, 'dd/mm/yyyy');
