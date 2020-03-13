import React, { ReactElement } from 'react';
import { NextPageContext } from 'next';
import Error from './_error';

interface ErrorPageProps {
    statusCode: number;
}

const ErrorPage = ({ statusCode }: ErrorPageProps): ReactElement => <Error statusCode={statusCode} />;

// eslint-disable-next-line @typescript-eslint/require-await
export const getServerSideProps = (ctx: NextPageContext): {} => {
    return { props: { statusCode: ctx?.res?.statusCode } };
};

export default ErrorPage;
