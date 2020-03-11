import App, { AppProps, AppContext } from 'next/app';
import React, { ReactElement } from 'react';

const MyApp = ({ Component, pageProps }: AppProps): ReactElement => (
    // Prop spreading is the recommended way to implement this, from Next.js docs
    // eslint-disable-next-line react/jsx-props-no-spreading
    <Component {...pageProps} />
);

// Force every page to server side render so that we get a chance to set security-related cookies
// This will have a slight performance impact, but it should be negligable
//
// (implementation below from https://nextjs.org/docs/advanced-features/custom-app and
// https://nextjs.org/docs/basic-features/typescript)
//
MyApp.getInitialProps = async (appContext: AppContext): Promise<{}> => {
    let appProps;
    try {
        appProps = await App.getInitialProps(appContext);
    } catch (error) {
        console.error(`Unhandled exception: ${error.stack}`);
        throw error;
    }

    // Prop spreading is the recommended way to implement this, from Next.js docs
    // eslint-disable-next-line react/jsx-props-no-spreading
    return { ...appProps };
};

export default MyApp;
