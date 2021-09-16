import React, { ReactElement } from 'react';
import { MyFaresService, NextPageContextWithSession } from '../../interfaces/index';
import { BaseLayout } from '../../layout/Layout';
import { getBodsServicesByNoc } from '../../data/auroradb';
import { getAndValidateNoc } from '../../utils';
import { myFaresEnabled } from '../../constants/featureFlag';
import moment from 'moment';

const title = 'Services - Create Fares Data Service';
const description = 'View and access your services in one place.';

interface ServicesProps {
    services: MyFaresService[];
    myFaresEnabled: boolean;
}

const Services = ({ services, myFaresEnabled }: ServicesProps): ReactElement => {
    return (
        <>
            <BaseLayout
                title={title}
                description={description}
                showNavigation
                referer={''}
                activePage="services"
                myFaresEnabled={myFaresEnabled}
            >
                <div className="govuk-grid-row">
                    <div className="govuk-grid-column-full">
                        <h1 className="govuk-heading-xl govuk-!-margin-bottom-3">Services</h1>

                        {ServicesTable(services)}
                    </div>
                </div>
            </BaseLayout>
        </>
    );
};

const ServicesTable = (services: MyFaresService[]): ReactElement => {
    return (
        <table className="govuk-table">
            <thead className="govuk-table__head">
                <tr className="govuk-table__row">
                    <th scope="col" className="govuk-table__header">
                        Service description
                    </th>
                    <th scope="col" className="govuk-table__header">
                        Start date
                    </th>
                    <th scope="col" className="govuk-table__header">
                        End date
                    </th>
                    <th scope="col" className="govuk-table__header">
                        Service status
                    </th>
                </tr>
            </thead>

            <tbody className="govuk-table__body">
                {services.map((service) => (
                    <tr key={service.lineName} className="govuk-table__row">
                        <td className="govuk-table__cell">
                            {service.lineName} - {service.serviceDescription}
                        </td>
                        <td className="govuk-table__cell">{service.startDate}</td>
                        <td className="govuk-table__cell">{service.endDate}</td>
                        <td className="govuk-table__cell">{getTag(service.startDate, service.endDate)}</td>
                    </tr>
                ))}
            </tbody>
        </table>
    );
};

const getTag = (startDate: string, endDate: string) => {
    const today = new Date().setHours(0, 0, 0, 0);
    const startDateAsUnixTime = moment(startDate, 'DD/MM/YYYY').valueOf();
    const endDateAsUnixTime = moment(endDate, 'DD/MM/YYYY').valueOf();

    if (startDateAsUnixTime <= today && endDateAsUnixTime >= today) {
        return <strong className="govuk-tag govuk-tag--turquoise">Active</strong>;
    } else if (startDateAsUnixTime >= today) {
        return <strong className="govuk-tag govuk-tag--blue">Pending</strong>;
    } else {
        return <strong className="govuk-tag govuk-tag--red">Expired</strong>;
    }
};

export const getServerSideProps = async (ctx: NextPageContextWithSession): Promise<{ props: ServicesProps }> => {
    const services = await getBodsServicesByNoc(getAndValidateNoc(ctx));

    return { props: { services: services, myFaresEnabled } };
};

export default Services;
