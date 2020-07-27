import '../design/Pages.scss';
import '../design/Layout.scss';
import '../design/Components.scss';
import App, { AppProps, AppContext } from 'next/app';
import React, { ReactElement } from 'react';
import { Response } from 'express';
import { CustomAppProps } from '../interfaces';
import logger from '../utils/logger';

const MyApp = ({ Component, pageProps, csrfToken }: AppProps & { csrfToken: string }): ReactElement => (
    // Prop spreading is the recommended way to implement this, from Next.js docs
    // eslint-disable-next-line react/jsx-props-no-spreading
    <Component {...pageProps} csrfToken={csrfToken} />
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

        if (appContext.ctx.req && appContext.ctx.res) {
            const { locals } = appContext.ctx.res as Response;
            (appProps as CustomAppProps).csrfToken = locals.csrfToken;
        }
    } catch (error) {
        logger.error(error, { context: 'pages.app', message: 'unhandled exception' });
        throw error;
    }

    // Prop spreading is the recommended way to implement this, from Next.js docs
    // eslint-disable-next-line react/jsx-props-no-spreading
    return { ...appProps };
};

export default MyApp;
