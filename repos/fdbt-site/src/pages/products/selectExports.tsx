import React, { ReactElement } from 'react';
import { getAllProductsByNoc } from '../../data/auroradb';
import { getProductsMatchingJson } from '../../data/s3';
import { NextPageContextWithSession } from '../../interfaces';
import { BaseLayout } from '../../layout/Layout';
import { getAndValidateNoc, getCsrfToken } from '../../utils';
import { getNonExpiredProducts, filterOutProductsWithNoActiveServices } from '../api/exports';

const title = 'Select Exports';
const description = 'Export selected products into NeTEx.';

interface SelectExportsProps {
    csrf: string;
    productsToDisplay: ProductToExport[];
}

interface ProductToExport {
    id: string;
    productName: string;
    startDate: string;
    service: string | null;
    direction: string | null;
}

const SelectExports = ({ csrf, productsToDisplay }: SelectExportsProps): ReactElement => {
    return (
        <>
            <BaseLayout title={title} description={description} showNavigation>
                <div className="govuk-grid-row">
                    <div className="govuk-grid-column-full">
                        <div className="dft-flex dft-flex-justify-space-between">
                            <h1 className="govuk-heading-xl">Export your selected products {csrf}</h1>{' '}
                        </div>

                        <div className="govuk-grid-row">
                            <div className="govuk-grid-column-two-thirds">
                                <p className="govuk-body-m govuk-!-margin-bottom-9">
                                    This will export all of the products you select below. Expired products or products
                                    for expired services, will not be included in the list below.
                                </p>
                            </div>
                        </div>
                        <div>
                            {productsToDisplay.map((product) => {
                                return <p>{product.productName}</p>;
                            })}
                        </div>
                    </div>
                </div>
            </BaseLayout>
        </>
    );
};

export const getServerSideProps = async (ctx: NextPageContextWithSession): Promise<{ props: SelectExportsProps }> => {
    const noc = getAndValidateNoc(ctx);
    const products = await getAllProductsByNoc(noc);
    const nonExpiredProducts = getNonExpiredProducts(products);
    const nonExpiredProductsWithActiveServices = await filterOutProductsWithNoActiveServices(noc, nonExpiredProducts);

    const productsToDisplay: ProductToExport[] = await Promise.all(
        nonExpiredProductsWithActiveServices.map(async (nonExpiredProduct) => {
            const s3Data = await getProductsMatchingJson(nonExpiredProduct.matchingJsonLink);
            const product = s3Data.products[0];

            return {
                id: nonExpiredProduct.id,
                productName:
                    'productName' in product ? product.productName : `${s3Data.passengerType} - ${s3Data.type}`,
                startDate: nonExpiredProduct.startDate,
                service: 'lineName' in s3Data ? s3Data.lineName : null,
                direction: 'journeyDirection' in s3Data ? s3Data.journeyDirection : null,
            };
        }),
    );

    console.log(JSON.stringify(productsToDisplay));

    return {
        props: {
            csrf: getCsrfToken(ctx),
            productsToDisplay,
        },
    };
};

export default SelectExports;
