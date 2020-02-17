import React, { ReactElement } from 'react';
import { NextPageContext } from 'next';
import Error from './_error';

interface ErrorPageProps {
    statusCode: number;
}

const ErrorPage = ({ statusCode }: ErrorPageProps): ReactElement => <Error statusCode={statusCode} />;

ErrorPage.getInitialProps = (ctx: NextPageContext): {} => {
    return { statusCode: ctx?.res?.statusCode };
};

export default ErrorPage;
