import Document, { Html, Head, Main, NextScript, DocumentContext, DocumentInitialProps } from 'next/document';
import React, { ReactElement } from 'react';

class MyDocument extends Document {
    static async getInitialProps(ctx: DocumentContext): Promise<DocumentInitialProps> {
        const initialProps = await Document.getInitialProps(ctx);
        ctx.res?.setHeader('X-Content-Type-Options', 'nosniff');
        ctx.res?.setHeader('X-Frame-Options', 'DENY');
        return { ...initialProps };
    }

    render(): ReactElement {
        return (
            <Html lang="en" className="govuk-template app-html-class flexbox no-flexboxtweener">
                <Head />
                <body className="govuk-template__body app-body-class">
                    <Main />
                    <NextScript />
                </body>
            </Html>
        );
    }
}

export default MyDocument;
