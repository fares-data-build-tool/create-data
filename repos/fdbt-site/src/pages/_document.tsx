import Document, { Html, Head, Main, NextScript, DocumentContext, DocumentInitialProps } from 'next/document';
import React, { ReactElement } from 'react';
import '../design/Pages.scss';

class MyDocument extends Document {
    static async getInitialProps(ctx: DocumentContext): Promise<DocumentInitialProps> {
        const initialProps = await Document.getInitialProps(ctx);
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
