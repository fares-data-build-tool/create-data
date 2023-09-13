const getEnvironment = (): string => {
    return document.location.host.split('.')[1] ?? 'test';
};

export default getEnvironment;
