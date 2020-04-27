import React, { ReactElement } from 'react';
import Layout from '../layout/Layout';

const title = 'Multiple Product Validity - Fares data build tool';
const description = 'Multiple Product Validity - page of the Fares data build tool';

const MultipleProduct = (): ReactElement => {
    return (
        <Layout title={title} description={description}>
            <main className="govuk-main-wrapper app-main-class" id="main-content" role="main">
                <legend className="govuk-fieldset__legend govuk-fieldset__legend--xl">
                    <h1 className="govuk-fieldset__heading" id="page-heading">
                        Placeholder page for multiple product validity
                    </h1>
                </legend>
            </main>
        </Layout>
    );
};

export const getServerSideProps = (): {} => {
    return { props: {} };
};

export default MultipleProduct;
