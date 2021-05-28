import React, { PropsWithChildren, ReactElement, useEffect, useState } from 'react';
import Head from 'next/head';
import { Portal } from 'react-portal';

import favicon from '../assets/images/favicon.ico';
import { buildTitle } from '../utils';
import { ErrorInfo } from '../interfaces';
import PhaseBanner from './PhaseBanner';
import Footer from './Footer';
import Help from '../components/Help';
import CookieBanner from './CookieBanner';

interface LayoutProps {
    title: string;
    description: string;
    errors?: ErrorInfo[];
    hideCookieBanner?: boolean;
    hideHelp?: boolean;
}

export const BaseLayout = ({
    title,
    description,
    errors = [],
    children,
    hideCookieBanner = false,
    hideHelp = false,
}: PropsWithChildren<LayoutProps>): ReactElement => {
    const [showBanner, setShowBanner] = useState(false);

    useEffect(() => {
        setShowBanner(true);
    });

    return (
        <>
            <Head>
                <link rel="shortcut icon" href={favicon} />
                <title>{buildTitle(errors, title || 'Create Fares Data')}</title>
                <meta name="description" content={description || 'Create Fares Data'} />
                <meta name="viewport" content="width=device-width, initial-scale=1" />
                <meta charSet="utf-8" />
            </Head>

            {!hideCookieBanner && showBanner && (
                <Portal node={document && document.getElementById('js-cookie-banner')}>
                    <CookieBanner />
                </Portal>
            )}

            <div className="govuk-width-container app-width-container--wide">
                <PhaseBanner />
                <main id="main-content" role="main" tabIndex={-1}>
                    <div className="govuk-main-wrapper app-main-class">{children}</div>
                </main>
                {!hideHelp && <Help />}
            </div>
            <Footer />
        </>
    );
};

export const FullColumnLayout = ({
    title,
    description,
    errors = [],
    children,
    hideCookieBanner = false,
    hideHelp = false,
}: PropsWithChildren<LayoutProps>): ReactElement => (
    <BaseLayout
        title={title}
        description={description}
        errors={errors}
        hideCookieBanner={hideCookieBanner}
        hideHelp={hideHelp}
    >
        <div className="govuk-grid-row">
            <div className="govuk-grid-column-full">{children}</div>
        </div>
    </BaseLayout>
);

export const TwoThirdsLayout = ({
    title,
    description,
    errors = [],
    children,
    hideCookieBanner = false,
    hideHelp = false,
}: PropsWithChildren<LayoutProps>): ReactElement => (
    <BaseLayout
        title={title}
        description={description}
        errors={errors}
        hideCookieBanner={hideCookieBanner}
        hideHelp={hideHelp}
    >
        <div className="govuk-grid-row">
            <div className="govuk-grid-column-two-thirds">{children}</div>
        </div>
    </BaseLayout>
);

export default TwoThirdsLayout;
