export const globalSettingsEnabled = true;
export const globalSettingsDeleteEnabled = ['test', 'dev'].includes(process.env.STAGE ?? '');
export const myFaresEnabled = ['test', 'dev'].includes(process.env.STAGE ?? '');
export const saveProductsEnabled = ['test', 'dev'].includes(process.env.STAGE ?? '');
export const exportEnabled = false;
