import '../design/Pages.scss';
import Document, { Html, Head, Main, NextScript } from 'next/document'
import * as React from 'react';
class MyDocument extends Document {
  static async getInitialProps(ctx) {
    const initialProps = await Document.getInitialProps(ctx)
    return { ...initialProps }
  }

  render() {
    return (
      <Html lang="en" className="govuk-template app-html-class flexbox no-flexboxtweener">
        <Head />
        <body className="govuk-template__body app-body-class">
          <Main />
          <NextScript />
        </body>
      </Html>
    )
  }
}

export default MyDocument