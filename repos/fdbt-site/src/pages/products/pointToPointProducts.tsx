import React, { ReactElement } from 'react';
import {
    MyFaresPointToPointProduct,
    MyFaresProduct,
    MyFaresService,
    NextPageContextWithSession,
} from '../../interfaces/index';
import { BaseLayout } from '../../layout/Layout';
import { getBodsServiceByNocAndId, getPointToPointProductsByLineId } from '../../data/auroradb';
import { getMatchingJson } from '../../data/s3';
import { getAndValidateNoc, sentenceCaseString } from '../../utils';
import moment from 'moment';
import { isArray, upperFirst } from 'lodash';
import { getTag } from './services';

const title = 'Point To Point Products - Create Fares Data Service';
const description = 'View and access your point to point products in one place.';

interface PointToPointProductsProps {
    service: MyFaresService;
    products: MyFaresPointToPointProduct[];
}

const PointToPointProducts = ({ products, service }: PointToPointProductsProps): ReactElement => {
    return (
        <>
            <BaseLayout title={title} description={description}>
                <div className="govuk-grid-row">
                    <div className="govuk-grid-column-full">
                        <h1 className="govuk-heading-l govuk-!-margin-bottom-4">
                            {service.lineName} - {service.origin} to {service.destination}
                        </h1>
                        <h1 className="govuk-heading-s govuk-!-margin-bottom-8">
                            Service status: {getTag(service.startDate, service.endDate)}
                        </h1>
                        <h1 className="govuk-heading-l govuk-!-margin-bottom-4">Products</h1>
                        {PointToPointProductsTable(products)}
                    </div>
                </div>
            </BaseLayout>
        </>
    );
};

const PointToPointProductsTable = (products: MyFaresPointToPointProduct[]): ReactElement => {
    return (
        <table className="govuk-table">
            <thead className="govuk-table__head">
                <tr className="govuk-table__row">
                    <th scope="col" className="govuk-table__header">
                        Product description
                    </th>
                    <th scope="col" className="govuk-table__header">
                        Validity
                    </th>
                    <th scope="col" className="govuk-table__header">
                        Start date
                    </th>
                    <th scope="col" className="govuk-table__header">
                        End date
                    </th>
                    <th scope="col" className="govuk-table__header">
                        Product status
                    </th>
                </tr>
            </thead>

            <tbody className="govuk-table__body">
                {products.length > 0 ? (
                    products.map((product, index) => (
                        <tr key={index} className="govuk-table__row">
                            <td className="govuk-table__cell">{product.productDescription}</td>
                            <td className="govuk-table__cell">{product.validity}</td>
                            <td className="govuk-table__cell">{product.startDate}</td>
                            <td className="govuk-table__cell">{product.endDate}</td>
                            <td className="govuk-table__cell">{getTag(product.startDate, product.endDate)}</td>
                        </tr>
                    ))
                ) : (
                    <span className="govuk-body">
                        <i>You currently have no products against this service</i>
                    </span>
                )}
            </tbody>
        </table>
    );
};

export const filterProductsNotToDisplay = (service: MyFaresService, products: MyFaresProduct[]): MyFaresProduct[] => {
    const serviceStartDate = moment.utc(service.startDate, 'DD/MM/YYYY').valueOf();
    const serviceEndDate = moment.utc(service.endDate, 'DD/MM/YYYY').valueOf();
    return products.filter((product) => {
        const productStartDate = moment.utc(product.startDate, 'DD/MM/YYYY').valueOf();
        const productEndDate = moment.utc(product.endDate, 'DD/MM/YYYY').valueOf();
        return productEndDate >= serviceStartDate && productStartDate <= serviceEndDate;
    });
};

export const getServerSideProps = async (
    ctx: NextPageContextWithSession,
): Promise<{ props: PointToPointProductsProps }> => {
    const noc = getAndValidateNoc(ctx);
    const serviceId = ctx.query?.serviceId;
    if (!serviceId || isArray(serviceId)) {
        throw new Error('Unable to find line name to show products for.');
    }
    const service = await getBodsServiceByNocAndId(noc, serviceId);
    const products = await getPointToPointProductsByLineId(noc, service.lineId);
    const productsToDisplay = filterProductsNotToDisplay(service, products);
    const formattedProducts = await Promise.all(
        productsToDisplay.map(async (product) => {
            const matchingJson = await getMatchingJson(product.matchingJsonLink);
            const productDescription = `${upperFirst(matchingJson.passengerType)} - ${matchingJson.type} ${
                matchingJson.carnet ? '(carnet)' : ''
            }`;
            let validity = 'No restrictions';
            if (matchingJson.timeRestriction.length > 0) {
                const daysValid = matchingJson.timeRestriction.map((restriction) =>
                    sentenceCaseString(restriction.day),
                );
                validity = daysValid.join(', ');
            }
            return {
                productDescription,
                startDate: product.startDate,
                endDate: product.endDate,
                validity,
            };
        }),
    );
    return { props: { products: formattedProducts, service } };
};

export default PointToPointProducts;
