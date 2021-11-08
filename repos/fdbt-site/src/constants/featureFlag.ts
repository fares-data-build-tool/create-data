// const dev = 'dev' === process.env.STAGE;
const devOrTest = ['test', 'dev'].includes(process.env.STAGE ?? '');
console.log(devOrTest);

export const globalSettingsDeleteEnabled = devOrTest;
export const myFaresEnabled = devOrTest;
export const saveProductsEnabled = true;
export const exportEnabled = false;
export const masterStopListEnabled = false;
