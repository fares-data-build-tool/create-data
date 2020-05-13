import React, { ReactElement } from 'react';
import { NextPageContext } from 'next';
import Error from './_error';

const ErrorPage = (): ReactElement => <Error />;

export const getServerSideProps = (ctx: NextPageContext): {} => {
    return { props: { statusCode: ctx?.res?.statusCode } };
};

export default ErrorPage;
