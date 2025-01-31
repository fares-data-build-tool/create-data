import React, { ReactElement } from 'react';
import { NextPageContextWithSession } from '../../interfaces/index';
import { BaseLayout } from '../../layout/Layout';
import { getCsrfToken } from '../../utils';

const title = 'Multi-operator products (internal) - Create Fares Data Service';
const description = 'View and access your multi-operator products (internal) in one place.';

interface MultiOperatorProductsProps {
    csrfToken: string;
}

const MultiOperatorProducts = (): ReactElement => {
    return (
        <BaseLayout title={title} description={description} showNavigation>
            <div className="govuk-grid-row">
                <div className="govuk-grid-column-full">
                    <div className="dft-flex dft-flex-justify-space-between">
                        <h1 className="govuk-heading-xl govuk-!-margin-bottom-3">Multi-operator products</h1>
                    </div>
                    <p className="govuk-body">Stub page</p>
                </div>
            </div>
        </BaseLayout>
    );
};

export const getServerSideProps = (ctx: NextPageContextWithSession): { props: MultiOperatorProductsProps } => {
    return { props: { csrfToken: getCsrfToken(ctx) } };
};

export default MultiOperatorProducts;
