// eslint-disable-next-line import/prefer-default-export
export const getCleanWebsite = (nocEmail: string): string => {
    const splitEmail = nocEmail.split('#');

    return splitEmail.length > 1 && splitEmail[1] ? splitEmail[1] : splitEmail[0];
};
