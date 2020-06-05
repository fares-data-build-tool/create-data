import Document, { Html, Head, Main, NextScript, DocumentContext, DocumentInitialProps } from 'next/document';
import React, { ReactElement } from 'react';
import { ServerResponse } from 'http';
import { parseCookies } from 'nookies';
import Header from '../layout/Header';
import { ID_TOKEN_COOKIE } from '../constants';

interface DocumentProps extends DocumentInitialProps {
    nonce: string;
    isAuthed: boolean;
}

interface ResponseWithLocals extends ServerResponse {
    locals: {
        nonce: string;
    };
}

class MyDocument extends Document<{ nonce: string; isAuthed: boolean }> {
    static async getInitialProps(ctx: DocumentContext): Promise<DocumentProps> {
        const initialProps = await Document.getInitialProps(ctx);
        const nonce = (ctx.res as ResponseWithLocals)?.locals?.nonce ?? null;

        if (ctx.pathname !== '/') {
            ctx.res?.setHeader('X-Robots-Tag', 'none, noindex, nofollow, noimageindex, noarchive');
        }

        const cookies = parseCookies(ctx);
        const idTokenCookie = cookies[ID_TOKEN_COOKIE];

        return { ...initialProps, nonce, isAuthed: !!idTokenCookie };
    }

    render(): ReactElement {
        return (
            <Html lang="en" className="govuk-template app-html-class flexbox no-flexboxtweener">
                <Head nonce={this.props.nonce} />
                <body className="govuk-template__body app-body-class js-enabled">
                    <Header isAuthed={this.props.isAuthed} />
                    <Main />
                    <NextScript nonce={this.props.nonce} />
                    <script src="/scripts/all.js" nonce={this.props.nonce} />
                    <script nonce={this.props.nonce}>window.GOVUKFrontend.initAll()</script>
                </body>
            </Html>
        );
    }
}

export default MyDocument;
