import App, { AppProps, AppContext } from 'next/app';
import React, { ReactElement } from 'react';

const MyApp = ({ Component, pageProps }: AppProps): ReactElement => (
    // Prop spreading is the recommended way to implement this, from Next.js docs
    // eslint-disable-next-line react/jsx-props-no-spreading
    <Component {...pageProps} />
);

// Force every page to server side render so that we get a chance to set security-related cookies
// This will have a slight performance impact, but it should be negligable
// A better approach long term would be to submit a contribution to the Next.js serverless component
// to provide the option to set these headers as properties on the statically rendered pages as
// they are uploaded to S3
//
// (implementation below from https://nextjs.org/docs/advanced-features/custom-app and
// https://nextjs.org/docs/basic-features/typescript)
//
MyApp.getInitialProps = async (appContext: AppContext): Promise<{}> => {
    // calls page's `getInitialProps` and fills `appProps.pageProps`
    const appProps = await App.getInitialProps(appContext);

    // Prop spreading is the recommended way to implement this, from Next.js docs
    // eslint-disable-next-line react/jsx-props-no-spreading
    return { ...appProps };
};

export default MyApp;
