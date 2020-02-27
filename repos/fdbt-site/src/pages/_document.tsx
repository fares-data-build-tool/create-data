import Document, { Html, Head, Main, NextScript, DocumentContext, DocumentInitialProps } from 'next/document';
import React, { ReactElement } from 'react';
import '../design/Pages.scss';

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

    // Force every page to server side render so that we get a chance to set security-related cookies
    // This will have a slight performance impact, but it should be negligable
    // A better approach long term would be to submit a contribution to the Next.js serverless component
    // to provide the option to set these headers as properties on the statically rendered pages as
    // they are uploaded to S3
    getInitialProps = (): {} => {
        return {};
    };
}

export default MyDocument;
