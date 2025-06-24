import '../design/main.scss';
import { AppProps } from 'next/app';
import React, { ReactElement, useEffect, useRef } from 'react';

const MyApp = ({ Component, pageProps }: AppProps): ReactElement => {
    const initialized = useRef(false);

    useEffect(() => {
        if (!initialized.current) {
            initialized.current = true;

            const bodyElement = document.getElementsByTagName('body')[0];
            bodyElement.classList.add('js-enabled');
        }
    }, []);
    // eslint-disable-next-line react/jsx-props-no-spreading
    return <Component {...pageProps} />;
};

export default MyApp;
