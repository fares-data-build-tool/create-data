import React, { ReactElement } from 'react';
import {
    MyFaresService,
    MyFaresServiceWithProductCount,
    NextPageContextWithSession,
    EntityStatus,
} from '../../interfaces/index';
import { MyFaresProduct } from '../../../shared/dbTypes';
import { BaseLayout } from '../../layout/Layout';
import { myFaresEnabled, exportEnabled } from '../../constants/featureFlag';
import { getPointToPointProducts, getBodsServicesByNoc } from '../../data/auroradb';
import { getAndValidateNoc } from '../../utils';
import moment from 'moment';

const title = 'Services - Create Fares Data Service';
const description = 'View and access your services in one place.';

interface ServicesProps {
    servicesAndProducts: MyFaresServiceWithProductCount[];
    myFaresEnabled: boolean;
    exportEnabled: boolean;
}

const Services = ({ servicesAndProducts, myFaresEnabled, exportEnabled }: ServicesProps): ReactElement => {
    return (
        <>
            <BaseLayout
                title={title}
                description={description}
                showNavigation
                myFaresEnabled={myFaresEnabled}
                exportEnabled={exportEnabled}
            >
                <div className="govuk-grid-row">
                    <div className="govuk-grid-column-full">
                        <div className="dft-flex dft-flex-justify-space-between">
                            <h1 className="govuk-heading-xl govuk-!-margin-bottom-3">Services</h1>

                            <a href="/fareType" className="govuk-button" data-module="govuk-button">
                                Create new product
                            </a>
                        </div>
                        {ServicesTable(servicesAndProducts)}
                    </div>
                </div>
            </BaseLayout>
        </>
    );
};

const ServicesTable = (services: MyFaresServiceWithProductCount[]): ReactElement => {
    return (
        <table className="govuk-table">
            <thead className="govuk-table__head">
                <tr className="govuk-table__row">
                    <th scope="col" className="govuk-table__header">
                        Service description
                    </th>
                    <th scope="col" className="govuk-table__header dft-text-align-centre">
                        Active products
                    </th>
                    <th scope="col" className="govuk-table__header dft-text-align-centre">
                        Start
                        <br /> date
                    </th>
                    <th scope="col" className="govuk-table__header dft-text-align-centre">
                        End <br />
                        date
                    </th>
                    <th scope="col" className="govuk-table__header dft-text-align-centre">
                        Service status
                    </th>
                </tr>
            </thead>

            <tbody className="govuk-table__body">
                {services.map((service, index) => (
                    <tr key={index} className="govuk-table__row">
                        <td className="govuk-table__cell">
                            <a href={`/products/pointToPointProducts?serviceId=${service.id}`}>
                                {service.lineName} - {service.origin} to {service.destination}
                            </a>
                        </td>
                        <td className="govuk-table__cell dft-text-align-centre">{service.products}</td>
                        <td className="govuk-table__cell dft-text-align-centre">{service.startDate}</td>
                        <td className="govuk-table__cell dft-text-align-centre">{service.endDate || '-'}</td>
                        <td className="govuk-table__cell dft-text-align-centre">
                            {getTag(service.startDate, service.endDate, true)}
                            {service.requiresAttention === true ? (
                                <strong className="govuk-tag govuk-tag--yellow dft-table-tag">NEEDS ATTENTION</strong>
                            ) : null}
                        </td>
                    </tr>
                ))}
            </tbody>
        </table>
    );
};

export const getEntityStatus = (startDate: string, endDate: string | undefined): EntityStatus => {
    const today = moment.utc().startOf('day').valueOf();
    const startDateAsUnixTime = moment.utc(startDate, 'DD/MM/YYYY').valueOf();
    const endDateAsUnixTime = endDate ? moment.utc(endDate, 'DD/MM/YYYY').valueOf() : undefined;

    if (startDateAsUnixTime <= today && (!endDateAsUnixTime || endDateAsUnixTime >= today)) {
        return EntityStatus.Active;
    } else if (startDateAsUnixTime > today) {
        return EntityStatus.Pending;
    } else {
        return EntityStatus.Expired;
    }
};

export const getTag = (startDate: string, endDate: string | undefined, isWithinATable: boolean): JSX.Element => {
    const status = getEntityStatus(startDate, endDate);

    if (status === EntityStatus.Active) {
        return (
            <strong className={`govuk-tag govuk-tag--turquoise${isWithinATable ? ' dft-table-tag' : ''}`}>
                Active
            </strong>
        );
    } else if (status === EntityStatus.Pending) {
        return (
            <strong className={`govuk-tag govuk-tag--blue${isWithinATable ? ' dft-table-tag' : ''}`}>Pending</strong>
        );
    } else {
        return <strong className={`govuk-tag govuk-tag--red${isWithinATable ? ' dft-table-tag' : ''}`}>Expired</strong>;
    }
};

export const showProductAgainstService = (
    // 2021-09-15T23:00:00.000Z format
    productStartDate: string,
    // 2021-09-15T23:00:00.000Z format
    productEndDate: string | undefined,
    // 05/04/2020 format
    serviceStartDate: string,
    // 05/04/2020 format
    serviceEndDate: string | undefined,
): boolean => {
    const momentProductStartDate = moment(productStartDate).valueOf();
    const momentProductEndDate = productEndDate && moment(productEndDate).valueOf();
    const momentServiceStartDate = moment(serviceStartDate, 'DD/MM/YYYY').valueOf();
    const momentServiceEndDate = serviceEndDate ? moment(serviceEndDate, 'DD/MM/YYYY').valueOf() : undefined;

    return (
        (!momentProductEndDate || momentProductEndDate >= momentServiceStartDate) &&
        (!momentServiceEndDate || momentServiceEndDate >= momentProductStartDate)
    );
};

export const matchProductsToServices = (
    services: MyFaresService[],
    products: MyFaresProduct[],
): MyFaresServiceWithProductCount[] => {
    const productsByLine = products.reduce((map, product) => {
        const serviceByLine = map.get(product.lineId) ?? [];
        serviceByLine.push(product);
        map.set(product.lineId, serviceByLine);
        return map;
    }, new Map<string, MyFaresProduct[]>());

    return services.map((service) => {
        const filteredProducts = productsByLine
            .get(service.lineId)
            ?.filter((product) =>
                showProductAgainstService(product.startDate, product.endDate, service.startDate, service.endDate),
            );

        return {
            ...service,
            endDate: service.endDate || '',
            products: filteredProducts === undefined ? 0 : filteredProducts.length,
            requiresAttention:
                filteredProducts === undefined
                    ? false
                    : filteredProducts.some((product) =>
                          product.servicesRequiringAttention?.some((serviceId) => serviceId === service.id.toString()),
                      ),
        };
    });
};

export const getServerSideProps = async (ctx: NextPageContextWithSession): Promise<{ props: ServicesProps }> => {
    const noc = getAndValidateNoc(ctx);
    const services = await getBodsServicesByNoc(noc);
    const products = await getPointToPointProducts(noc);
    const servicesAndProducts = matchProductsToServices(services, products);

    return { props: { servicesAndProducts, myFaresEnabled, exportEnabled } };
};

export default Services;
