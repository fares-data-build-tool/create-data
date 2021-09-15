export const globalSettingsEnabled = true;
export const globalSettingsDeleteEnabled = ['test', 'dev'].includes(process.env.STAGE ?? '');
