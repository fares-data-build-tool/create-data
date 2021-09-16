export const globalSettingsEnabled = ['test', 'dev'].includes(process.env.STAGE ?? '');
export const globalSettingsDeleteEnabled = ['test', 'dev'].includes(process.env.STAGE ?? '');
export const myFaresEnabled = ['test', 'dev'].includes(process.env.STAGE ?? '');
