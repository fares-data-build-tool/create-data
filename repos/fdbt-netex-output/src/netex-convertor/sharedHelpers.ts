// eslint-disable-next-line import/prefer-default-export
export const getCleanWebsite = (nocWebsite: string): string => {
    const splitWebsite = nocWebsite.split('#');

    return splitWebsite.length > 1 && splitWebsite[1] ? splitWebsite[1] : splitWebsite[0];
};
