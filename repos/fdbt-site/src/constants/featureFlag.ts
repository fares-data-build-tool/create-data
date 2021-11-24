const devOrTest = ['test', 'dev'].includes(process.env.STAGE ?? '');

export const globalSettingsDeleteEnabled = devOrTest;
export const myFaresEnabled = true;
export const exportEnabled = true;
