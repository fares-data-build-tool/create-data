import React, { FC, PropsWithChildren } from 'react';
import Head from 'next/head';

import favicon from '../assets/images/favicon.ico';
import { buildTitle } from '../utils';
import { ErrorInfo } from '../interfaces';

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
        {children}
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
