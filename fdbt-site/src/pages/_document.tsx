import Document, { Html, Head, Main, NextScript, DocumentContext, DocumentInitialProps } from 'next/document';
import React, { ReactElement } from 'react';
import { ServerResponse } from 'http';
import { parseCookies } from 'nookies';
import Header from '../layout/Header';
import Breadcrumbs from '../components/Breadcrumbs';
import { ID_TOKEN_COOKIE } from '../constants';
import AlphaBanner from '../layout/AlphaBanner';
import { Breadcrumb } from '../interfaces';
import Footer from '../layout/Footer';
import breadcrumb from '../utils/breadcrumbs';

interface DocumentProps extends DocumentInitialProps {
    nonce: string;
    isAuthed: boolean;
    csrfToken: string;
    breadcrumbs: Breadcrumb[];
}

interface ResponseWithLocals extends ServerResponse {
    locals: {
        nonce: string;
        csrfToken: string;
    };
}

class MyDocument extends Document<DocumentProps> {
    static async getInitialProps(ctx: DocumentContext): Promise<DocumentProps> {
        const initialProps = await Document.getInitialProps(ctx);
        const nonce = (ctx.res as ResponseWithLocals)?.locals?.nonce ?? null;
        const csrfToken = (ctx.res as ResponseWithLocals)?.locals?.csrfToken ?? null;

        if (ctx.pathname !== '/') {
            ctx.res?.setHeader('X-Robots-Tag', 'none, noindex, nofollow, noimageindex, noarchive');
        }

        const cookies = parseCookies(ctx);
        const idTokenCookie = cookies[ID_TOKEN_COOKIE];

        const breadcrumbs = breadcrumb(ctx).generate();

        return { ...initialProps, nonce, isAuthed: !!idTokenCookie, csrfToken, breadcrumbs };
    }

    render(): ReactElement {
        return (
            <Html lang="en" className="govuk-template app-html-class flexbox no-flexboxtweener">
                <Head nonce={this.props.nonce}>
                    {process.env.STAGE === 'prod' && (
                        <>
                            <script
                                async
                                src="https://www.googletagmanager.com/gtag/js?id=UA-173062045-1"
                                nonce={this.props.nonce}
                            />
                            <script
                                nonce={this.props.nonce}
                                dangerouslySetInnerHTML={{
                                    __html: `window.dataLayer = window.dataLayer || [];
                                        function gtag(){dataLayer.push(arguments);}
                                        gtag('js', new Date());
                                        gtag('config', 'UA-173062045-1');`,
                                }}
                            />
                        </>
                    )}
                </Head>
                <body className="govuk-template__body app-body-class js-enabled">
                    <Header isAuthed={this.props.isAuthed} csrfToken={this.props.csrfToken} />
                    <div className="govuk-width-container app-width-container--wide">
                        <AlphaBanner />
                        {this.props.breadcrumbs.length !== 0 && <Breadcrumbs breadcrumbs={this.props.breadcrumbs} />}
                        <Main />
                    </div>
                    <Footer />

                    <NextScript nonce={this.props.nonce} />
                    <script src="/scripts/all.js" nonce={this.props.nonce} />
                    <script nonce={this.props.nonce}>window.GOVUKFrontend.initAll()</script>
                </body>
            </Html>
        );
    }
}

export default MyDocument;
