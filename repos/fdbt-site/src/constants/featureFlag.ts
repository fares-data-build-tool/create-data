export const globalSettingsEnabled = ['test', 'dev'].includes(process.env.STAGE || '');
export const globalSettingsDeleteDisabled = ['test', 'dev'].includes(process.env.STAGE || '');
