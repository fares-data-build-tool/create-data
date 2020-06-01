import Document, { Html, Head, Main, NextScript, DocumentContext, DocumentInitialProps } from 'next/document';
import React, { ReactElement } from 'react';
import { ServerResponse } from 'http';

interface DocumentProps extends DocumentInitialProps {
    nonce: string;
}

interface ResponseWithLocals extends ServerResponse {
    locals: {
        nonce: string;
    };
}

class MyDocument extends Document<{ nonce: string }> {
    static async getInitialProps(ctx: DocumentContext): Promise<DocumentProps> {
        const initialProps = await Document.getInitialProps(ctx);
        const nonce = (ctx.res as ResponseWithLocals)?.locals?.nonce ?? null;

        if (ctx.pathname !== '/') {
            ctx.res?.setHeader('X-Robots-Tag', 'none, noindex, nofollow, noimageindex, noarchive');
        }

        return { ...initialProps, nonce };
    }

    render(): ReactElement {
        return (
            <Html lang="en" className="govuk-template app-html-class flexbox no-flexboxtweener">
                <Head nonce={this.props.nonce} />
                <body className="govuk-template__body app-body-class js-enabled">
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
