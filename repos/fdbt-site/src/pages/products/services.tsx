import React, { ReactElement } from 'react';
import {
    MyFaresProduct,
    MyFaresService,
    MyFaresServiceWithProductCount,
    NextPageContextWithSession,
} from '../../interfaces/index';
import { BaseLayout } from '../../layout/Layout';
import { myFaresEnabled } from '../../constants/featureFlag';
import { getPointToPointProducts, getBodsServicesByNoc } from '../../data/auroradb';
import { getAndValidateNoc } from '../../utils';
import moment from 'moment';

const title = 'Services - Create Fares Data Service';
const description = 'View and access your services in one place.';

interface ServicesProps {
    servicesAndProducts: MyFaresServiceWithProductCount[];
    myFaresEnabled: boolean;
}

const Services = ({ servicesAndProducts, myFaresEnabled }: ServicesProps): ReactElement => {
    return (
        <>
            <BaseLayout title={title} description={description} showNavigation myFaresEnabled={myFaresEnabled}>
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
                            {getTag(service.startDate, service.endDate)}
                        </td>
                    </tr>
                ))}
            </tbody>
        </table>
    );
};

export const getTag = (startDate: string, endDate: string | undefined): JSX.Element => {
    const today = moment.utc().startOf('day').valueOf();
    const startDateAsUnixTime = moment.utc(startDate, 'DD/MM/YYYY').valueOf();
    const endDateAsUnixTime = endDate ? moment.utc(endDate, 'DD/MM/YYYY').valueOf() : undefined;

    if (startDateAsUnixTime <= today && (!endDateAsUnixTime || endDateAsUnixTime >= today)) {
        return <strong className="govuk-tag govuk-tag--turquoise">Active</strong>;
    } else if (startDateAsUnixTime > today) {
        return <strong className="govuk-tag govuk-tag--blue">Pending</strong>;
    } else {
        return <strong className="govuk-tag govuk-tag--red">Expired</strong>;
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

    return services.map((service) => ({
        ...service,
        endDate: service.endDate || '',
        products:
            productsByLine
                .get(service.lineId)
                ?.filter((product) =>
                    showProductAgainstService(product.startDate, product.endDate, service.startDate, service.endDate),
                ).length ?? 0,
    }));
};

export const getServerSideProps = async (ctx: NextPageContextWithSession): Promise<{ props: ServicesProps }> => {
    const noc = getAndValidateNoc(ctx);
    const services = await getBodsServicesByNoc(noc);
    const products = await getPointToPointProducts(noc);
    const servicesAndProducts = matchProductsToServices(services, products);
    return { props: { servicesAndProducts, myFaresEnabled: myFaresEnabled } };
};

export default Services;
