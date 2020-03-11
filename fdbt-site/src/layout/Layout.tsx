import React, { FC, PropsWithChildren } from 'react';
import Head from 'next/head';
import Header from './Header';
import AlphaBanner from './AlphaBanner';
import Footer from './Footer';
import LogoBanner from './LogoBanner';

type LayoutProps = {
    title: string;
    description: string;
};

const Layout: FC<LayoutProps> = ({ title, description, children }: PropsWithChildren<LayoutProps>) => (
    <div>
        <Head>
            <link rel="shortcut icon" href="/assets/images/favicon.ico" />
            <title>{title || 'Fares Data Build Tool'}</title>
            <meta name="description" content={description || 'Fares Data Build Tool'} />
            <meta name="viewport" content="width=device-width, initial-scale=1" />
            <meta charSet="utf-8" />
        </Head>

        <Header />
        <div className="govuk-width-container app-width-container--wide">
            <AlphaBanner />
            <div className="dftlogo" />
            <LogoBanner />
            {/* <h1>{this.props.name}</h1> */}
            {children}
        </div>
        <Footer />
    </div>
);

export default Layout;
