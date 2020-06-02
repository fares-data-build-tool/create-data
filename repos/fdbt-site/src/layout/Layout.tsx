import React, { FC, PropsWithChildren } from 'react';
import Head from 'next/head';
import Header from './Header';
import AlphaBanner from './AlphaBanner';
import Footer from './Footer';

import favicon from '../assets/images/favicon.ico';
import { buildTitle } from '../utils';
import { ErrorInfo } from '../types';

type LayoutProps = {
    title: string;
    description: string;
    errors?: ErrorInfo[];
};

export const BaseLayout: FC<LayoutProps> = ({
    title,
    description,
    errors = [],
    children,
}: PropsWithChildren<LayoutProps>) => (
    <div>
        <Head>
            <link rel="shortcut icon" href={favicon} />
            <title>{buildTitle(errors, title || 'Fares Data Build Tool')}</title>
            <meta name="description" content={description || 'Fares Data Build Tool'} />
            <meta name="viewport" content="width=device-width, initial-scale=1" />
            <meta charSet="utf-8" />
        </Head>

        <Header />
        <div className="govuk-width-container app-width-container--wide">
            <AlphaBanner />

            <main className="govuk-main-wrapper app-main-class" id="main-content" role="main">
                {children}
            </main>
        </div>
        <Footer />
    </div>
);

export const FullColumnLayout: FC<LayoutProps> = ({
    title,
    description,
    errors = [],
    children,
}: PropsWithChildren<LayoutProps>) => (
    <BaseLayout title={title} description={description} errors={errors}>
        <div className="govuk-grid-row">
            <div className="govuk-grid-column-full">{children}</div>
        </div>
    </BaseLayout>
);

export const TwoThirdsLayout: FC<LayoutProps> = ({
    title,
    description,
    errors = [],
    children,
}: PropsWithChildren<LayoutProps>) => (
    <BaseLayout title={title} description={description} errors={errors}>
        <div className="govuk-grid-row">
            <div className="govuk-grid-column-two-thirds">{children}</div>
        </div>
    </BaseLayout>
);

export default TwoThirdsLayout;
