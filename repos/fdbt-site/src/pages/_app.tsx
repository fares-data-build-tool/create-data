import '../design/Pages.scss';
import '../design/Layout.scss';
import '../design/Components.scss';
import { AppProps } from 'next/app';
import React, { ReactElement, useEffect } from 'react';

declare global {
    interface Window {
        GOVUKFrontend: {
            initAll: Function;
        };
    }
}

const MyApp = ({ Component, pageProps }: AppProps): ReactElement => {
    useEffect(() => {
        document.getElementsByTagName('body')[0].classList.add('js-enabled');

        if (window.GOVUKFrontend) {
            window.GOVUKFrontend.initAll();
        }
    });

    // eslint-disable-next-line react/jsx-props-no-spreading
    return <Component {...pageProps} />;
};

export default MyApp;
