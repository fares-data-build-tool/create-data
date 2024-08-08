import '../design/main.scss';
import { AppProps } from 'next/app';
import React, { ReactElement, useEffect, useRef } from 'react';
import { initAll } from 'govuk-frontend';

declare global {
    interface Window {
        GOVUKFrontend: {
            initAll: Function;
        };
    }
}

const MyApp = ({ Component, pageProps }: AppProps): ReactElement => {
    const initialized = useRef(false);

    useEffect(() => {
        if (!initialized.current) {
            initialized.current = true;

            const bodyElement = document.getElementsByTagName('body')[0];
            bodyElement.classList.add('js-enabled');

            if ('noModule' in HTMLScriptElement.prototype) {
                bodyElement.classList.add('govuk-frontend-supported');
            }

            initAll();
        }
    }, []);
    // eslint-disable-next-line react/jsx-props-no-spreading
    return <Component {...pageProps} />;
};

export default MyApp;
