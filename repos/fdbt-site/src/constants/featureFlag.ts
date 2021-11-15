const devOrTest = ['test', 'dev'].includes(process.env.STAGE ?? '');

export const globalSettingsDeleteEnabled = devOrTest;
export const myFaresEnabled = devOrTest;
export const saveProductsEnabled = true;
export const exportEnabled = devOrTest;
